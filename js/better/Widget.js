define(['better'], function ($) {
    var
        wR            = {},
        templateCache = {};

    function wId(/*String?*/baseName) {
        // summary:
        //          Generate Unique widget id that based on it's declaredClass property
        baseName = baseName || 'widget'
        if (!wR[baseName]) {
            wR[baseName] = 0;
        }
        return baseName + '_' + wR[baseName]++;
    }

    function buildTemplate(/*Widget*/self, /*HTML*/template) {
        //summary:
        //      Build widget's template
        //description:
        //      Create HTMLFragment from string and cache it.
        //      Cached HTMLFragment(Widget's template) will be used
        //      on next instantiation of a widget with the same Widget.declaredClass
        //      This technique gives us 20-25 times performance boost.
        if(!self.declaredClass) {
            throw new Error("Widget doen't have 'declaredClass' property. " +
                "Please pass class name as a first parameter " +
                "to toolbox/declare on class declaration"
            );
        }
        if(self.ignoreTemplateCache) {
            return $(template);
        }
        if(templateCache[self.declaredClass]){
            return $(templateCache[self.declaredClass].cloneNode(true));
        } else {
            template = $(template);
            templateCache[self.declaredClass] = template[0];
            return template;
        }
    }

    var attachEvent = function (/*Widget*/self, /*jQuery*/el, /*String*/eventDefinition) {
        //summary:
        //          Bind Widget methods as an event handlers for given DOMElement wrapped with jQuery

        //get comma-separated event definitions.
        //Example: <a data-better-event="click: hide, mouseover: doUsefulStuff"
        var defs = eventDefinition.split(','),
            parts = [],
            evtName = "",
            widgetMethodName = "";
        $.each(defs, function (idx, definition) {
            // split definition to [DOMEventName,DOMEventHandler] pair
            parts = definition.split(':'),
            evtName = $.trim(parts[0]),
            widgetMethodName = $.trim(parts[1]);


            //check for handler existence in Widget
            if (!self[widgetMethodName]) {
                var msg = " Template rendering failed. "
                    + " Can't bind  handler '{className}#{method}' to event '{evt}'. Handler does not exists";
                throw new Error($.replace(msg, {
                    className:self.declaredClass,
                    method:widgetMethodName,
                    evt:evtName
                }))
            }
            // bind Widget method to DOMElement event
            el.on(evtName, $.proxy(self[widgetMethodName], self))
        })
    }

    var attachPoint = function (/*Widget*/ self, /*jQuery*/ el, /*String*/ pointList) {
        //summary:
        //          Bind DOMElement references wrapped with jQuery to Widget
        $.each(pointList.split(','), function (idx, point) {
            self[point] = el
        })
    }

    var processDataPoints = function (/*Widget*/self) {
        //summary:
        //          Process data-better-event && data-better-point attribs
        self.domNode.find('*').andSelf().each(function () {
            var el = $(this),
                data = el.data(),
                evt = data.betterEvent,
                point = data.betterPoint;

            if (evt) {
                attachEvent(self, el, evt)
            }

            if (point) {
                attachPoint(self, el, point)
            }
        })
    }

    var createEventNamespace = function (self, eventName) {
        return self.declaredClass + '.' + eventName
    }


    var Widget

    /**
     * @class Widget
     * Base class for all widgets
     */
    Widget = $.declare('better.Widget', null, { /**@lends Widget */
        //declaredClass: String
        //      Class name of declared class.
        //      filled  automatically if you passing className
        //      as a first parameter in toolbox/declare.
        //      If you don't - fill it manually.
        //      better.js uses declaredClass property a lot
        declaredClass: '',
        id:'',
        template:'',
        //ignoreTemplateCache: Boolean
        //      You will need set this to True if
        //      you will try to instantiate the same widget with different templates.
        //      For example:
        //          You have two panels.
        //          One with blue gradient and another with some fancy background image.
        //          |
        //          |   var bluePanel    = new Panel(domNode1,{template: blueGradient});
        //          |   var fancyBgImage = new Panel(domNode2, {template: bgImgPanel});
        //          |
        //          If ignoreTemplateCache was'nt set to True, you will observe that both panels are blue
        //
        ignoreTemplateCache: false, //todo: add ability of template caching by theme&declaredClass: twitter.better.TitlePanel, dijit.better.TitlePanel etc
        domNode:null,
        contentNode:null,
        //templateInMarkup: Boolean
        //      Tells widget whether it's template located in original DOMElement
        templateInMarkup: false,
        //manualInit: Boolean
        //            In some cases init call on widget instantiation might be not good idea
        //            Set it to True for manual widget initialization(direct Widget.init() call)
        manualInit:false,
        //initOrder: Array
        //      list of widget initialization methods. See Widget#init() for more information
        //      Change the order if default initialization order doesn't meet your requirements
        //      Do not change this if you not sure
        //
        initOrder: ['initView','initLogic'],
        __construct:function (/*String|DOMElement|jQuery*/node, /*Object?*/args) {
            //mix arguments into widget
            $.extend(this, args); //todo: make deep copy? not sure
            //attach widget to DOM node
            this.domNode = $(node);

            //set unique id for widget
            this.id = this.id //id passed as  argument
                || this.domNode.prop('id') //target domNode already has id
                || wId(this.declaredClass); //generate unique id for widget
            this.id += ""

            //register widget instance in registry
            var reg = better.Widget.registry
            if (reg[this.id]) {
                throw new Error("An object with id '" + this.id + "' already exists")
            } else {
                reg[this.id] = this;
            }

            //render widget template
            this.render();


            // whatever you want
            if (!this.manualInit) {
                this.init();
            }
        },
        init:function () {
            //summary:
            //          Write some code here to initialize your widget.
            //          But read description first:)
            //description:
            //          Widget initialization process assumed to be (but not MUST be) multi-step process.
            //          Basicaly, almost all widgets will have two steps in their initialization process:
            //
            //                  1. Init widget view(template):
            //                          Bind events to template  and apply initial CSS styles here
            //                  2. Init logic:
            //                          All the stuff that is not related to widget's UI part.
            //                          For example:
            //                               - load content from remote URL
            //                               - set initial data (Title, for example)
            //                               - show Dialog if 'autoshow' parameter set to true
            //
            //          You can easily customize initialization flow by adding/removing methods to your widget
            //          and method names to initOrder variable.
            //          Method names must be added in order of execution (Your K.O.).
            //
            //
            //          If you think that such approach is redundant - just write code in 'init' method
            //
            var widget = this;
            $.each(this.initOrder, function(idx, initStep){
                if(widget[initStep]){
                    widget[initStep]();
                }
            })

        },
        initView:function() {
            //summary:
            //      Part of widget initialization flow. See Widget#init() description
            //description:
            //      Bind events to template  and apply initial CSS styles here
        },
        initLogic:function() {
            //summary:
            //      Part of widget initialization flow. See Widget#init() description
            //description:
            //      The rest of initialization stuff goes here
            //      Here you can:
            //      - load content from remote URL
            //      - set initial data (Title, for example)
            //      - show Dialog if 'autoshow' parameter set to true
            //      - etc
        },
        render:function () {
            //summary:
            //      Render widget to original DOMElement passed to widget contructor
            //      In case when widget has template,
            //      original DOMElement will be replaced by template markup


            //widget can have default template string and flag templateInMarkup set to true
            if (this.template && !this.templateInMarkup) {
                // if      widget doesn't has template in markup but has this.template
                //              - replace original DOMElement with template
                // otherwise
                //              - skip original DOMElement replacement

                var targetNode = this.domNode,
                    tpl = buildTemplate(this, this.template)
                    inlineStyles = this.domNode.attr('style');
                targetNode.replaceWith(tpl);
                this.domNode = tpl;
                if(inlineStyles) {
                    this.domNode.attr('style', inlineStyles);
                }
            }
            this.domNode.attr('id', this.id);
            processDataPoints(this);
        },
        appendTo:function (/*String|DOMElement|jQuery*/parentNode) {
            //jQuery has a lot of placement methods.
            // This makes harder implementation of widget domNode placement like Dijit/WidgetBase#placeAt
            //todo: make frontend for a bunch of jquery placement methods. Like dojo/dom-construct.place

            //weird construction
            this.domNode.appendTo($(parentNode));
        },
        destroy:function (/*Boolean?*/keepMarkup) {
            //summary:
            //          Remove Widget from DOM. Must be called before delete
            //          If keepMarkup flag passed - Widget#destroy will only unbind all events
            if(keepMarkup) {
                //keep markup in it's original state
                this.domNode.find('*')
                            .andSelf()
                            .unbind()
            } else {
                this.domNode.remove();
            }

            delete better.Widget.registry[this.id]
        },
        on:function (/*String*/ event, /*Object?*/ data, /*Function*/ handler) {
            //summary:
            //          Connect handler to widget event
            var evtName = createEventNamespace(this, event),
                evtData = {widget:this}

            if ($.isFunction(data)) {
                handler = data
                data = {}
            }
            $.extend(data, evtData);
            this.domNode.on(evtName, data, handler)
        },
        one:function (/*String*/ event, /*Object?*/ data, /*Function*/ handler) {
            //summary:
            //          Connect handler to widget event once
            var evtName = createEventNamespace(this, event),
                evtData = {widget:this}

            if ($.isFunction(data)) {
                handler = data
                data = {}
            }
            $.extend(data, evtData)
            this.domNode.one(evtName, data, handler)
        },
        trigger:function (/*String*/ event, /*Object?*/ data) {
            //summary:
            //          trigger event on Widget domNode
            //description:
            //          trigger event on Widget domNode
            //          Generation rule for event name:
            //              {widget.declaredClass}+ '.' + {event}
            //event: String
            //      Event name to trigger on widget instance
            //data: Object [optional]
            //      Additional data to pass in event handlers


            //todo: need some mechanism to prevent custom event bubbling. It works slowly
            var evtName = createEventNamespace(this, event),
                evtData = {widget:this}
            if (data) {
                $.extend(evtData, data)
            }
            evtData.type = evtName;

            this.domNode.trigger(evtData)
        },
        off:function (/*String?*/ event) {
            //summary:
            //          Unbind event/all events bound to Widget.domNode
            if (event) {
                event = createEventNamespace(this, event)
            }
            this.off(event)
        }
    })


    $.ns.setObject('better.Widget', Widget);
    var reg = $.ns.getObject('better.Widget.registry', true);
    better.Widget.byId = function (id) {
        return reg[id + ""]
    }
    return Widget;
})