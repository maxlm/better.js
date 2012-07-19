define(['better'],function($){
    var wR = {}

    function wId(/*String?*/baseName){
        // summary:
        //          Generate Unique widget id that based on it's declaredClass property
        baseName = baseName || 'widget'
        if(!wR[baseName]){
            wR[baseName] = 0;
        }
        return baseName + '_' + wR[baseName]++;
    }

    var attachEvent = function(/*Widget*/self, /*jQuery*/el, /*String*/eventDefinition) {
        //summary:
        //          Bind Widget methods as an event handlers for given DOMElement wrapped with jQuery

        //get comma-separated event definitions.
        //Example: <a data-better-event="click: hide, mouseover: doUsefulStuff"
        var defs = eventDefinition.split(','),
            parts = [],
            evtName = "",
            widgetMethodName = "";
            $.each(defs, function(idx, definition) {
                // split definition to [DOMEventName,DOMEventHandler] pair
                parts = definition.split(':'),
                evtName = parts[0],
                widgetMethodName = parts[1];


                //check for handler existence in Widget
                if(!self[widgetMethodName]) {
                    var msg = " Template rendering failed. "
                            + " Can't bind  handler <{className}#{method}> to event <{evt}>. Handler does not exists";
                    throw new Error($.replace(msg,{
                        className: self.delaredClass,
                        method: widgetMethodName,
                        evt: evtName
                    }))
                }
                // bind Widget method to DOMElement event
                el.on(evtName, $.proxy(self[widgetMethodName], self))
            })
    }
    
    var attachPoint = function(/*Widget*/ self, /*jQuery*/ el, /*String*/ pointList){
        //summary:
        //          Bind DOMElement references wrapped with jQuery to Widget
        $.each(pointList.split(','),function(idx, point){
             self[point] = el
        })
    }
    
    var processDataPoints = function(/*Widget*/self){
        //summary:
        //          Process data-better-event && data-better-point attribs
        self.domNode.find('*').andSelf().each(function(){
            var el = $(this),
                 data = el.data(),
                 evt = data.betterEvent,
                 point = data.betterPoint;
                 
            if(evt) {
                attachEvent(self,el,evt)
            }
            
            if(point) {
                attachPoint(self, el, point)
            }
        })
    }

    var createEventNamespace = function(self, eventName) {
        return self.declaredClass + '.' + eventName
    }


    var Widget
    /*=== hack for phpstorm 4.0.1*/
    /*=== Tell phpstorm that we declaring a class. Comment bellow gives us autocomplete in phpstorm */

     // var Widget = function(){
    // }

    /**
     *@class Widget
     * Base class for all widgets
     */
     Widget = $.declare(null, { /**@lends Widget */
        declaredClass: 'better.Widget',
        id: '',
        template: '',
        domNode: null,
        contentNode: null,
        __construct: function(/*Object?*/args,/*String|DOMElement|jQuery*/node) {
            //mix arguments into widget
            $.extend(this, args);
            //attach widget to DOM node
            this.domNode = $(node);
            
            //set unique id for widget
            this.id = this.id //id passed as  argument
                        || this.domNode.prop('id') //target domNode already has id
                        || wId(this.declaredClass); //generate unique id for widget
            this.id+=""
            
            //register widget instance in registry
            var reg = better.Widget.registry
            if(reg[this.id]) {
                throw new Error("An object with id <" + this.id + "> already exists")
            } else {
                reg[this.id] = this;
            }
            
            //render widget template
            this.render();
            

            // whatever you want
            this.init();
        },
        init: function() {
            //summary:
            //          Initialize your widget here
        },
        render: function() {
            
            if(this.template) {
                var targetNode = this.domNode,
                     tpl = $(this.template);
                targetNode.replaceWith(tpl);
                this.domNode = tpl;
            }
            this.domNode.prop('id', this.id);
            processDataPoints(this);
        },
        destroy: function() {
            //summary:
            //          Remove Widget from DOM. Must be called before delete
            this.domNode.remove();
            delete better.Widget.registry[this.id]
        },
        on: function(/*String*/ event, /*Object?*/ data, /*Function*/ handler) {
            var evtName = createEventNamespace(this, event),
                 evtData = {widget: this}
            
            if($.isFunction(data)) {
                handler = data
                data = {}
            }
            $.extend(data, evtData)
            this.domNode.on(evtName, data, handler)
        },
        one: function(/*String*/ event, /*Object?*/ data, /*Function*/ handler) {
            var evtName = createEventNamespace(this, event),
                             evtData = {widget: this}

                        if($.isFunction(data)) {
                            handler = data
                            data = {}
                        }
                        $.extend(data, evtData)
                        this.domNode.one(evtName, data, handler)
        },
        trigger: function(/*String*/ event, /*Object?*/ data){
            //summary:
            //          trigger event on Widget domNode
            //description:
            //          trigger event on Widget domNode
            //          Generation rule for event name:
            //              {widget.declaredClass}+ '.' + {event}
            var evtName = createEventNamespace(this, event),
                evtData = {widget: this}
                if(data) {
                    $.extend(evtData,data)
                }
                evtData.type = evtName
            this.domNode.trigger(evtData)
        },
        off: function(/*String?*/ event){
            //summary:
            //          Unbind event/all events bound to Widget.domNode
            if(event) {
               event =  createEventNamespace(this, event)
            }
            this.off(event)
        }
    })
    
    
    $.ns.setObject('better.Widget', Widget);
    var reg = $.ns.getObject('better.Widget.registry', true);
    better.Widget.byId = function(id){
        return reg[id+""]
    }
    return Widget;
})