define(['better', 'better/StackViewAbstract'], function(/*jQuery*/$, StackView){
    var Accordion

    /**
     * @class Accordion
     * @extends StackViewAbstract
     */
    Accordion = $.declare('better.Accordion',StackView , { /**@lends Accordion*/
        //panelWidget: String|Constructor
        //      widget class that will act as a Accordion pane
        //      Accordion expects TitlePanel or it's ancestor as a panelWidget
        panelWidget: 'better.TitlePanel',
        init: function() {
            if(!$.isFunction(this.panelWidget) || !this.panelWidget.prototype.declaredClass) {
                this._getCtor();
            }
            //todo: add ability to instantiate panels from properties-object passed into constructor
            this._instantiateWidgetsFromMarkup();

            var toggleEvt = this.panelWidget.prototype.declaredClass + ".toggle";
            this.domNode.on(toggleEvt, $.proxy(this._onChildToggle,this))
        },
        addChild: function(/*TitlePanel*/ child) {
            //fixme: i'm not sure how implement it.
            //fixme: Too much options: TitlePanel, DOMElement with props object, props object without DOMElement
        },
        __construct: function(){
            this.inherited(arguments);
        },
        _doTransition:function(/*TitlePanel*/from, /*TitlePanel*/to) {
            //both 'from' and 'to' could be jQuery objects
            // because it implements show/hide methods
            //but I'm not sure how we can use that
            from.hide();
            to.show();
        },
        _getCtor: function() {
            //summary:
            //      Get panel widget constructor.
            //description:
            //      Accordion assumes that panelWidget is a Constructor function,
            //      but user also can provide string with widget class name.
            //      In that case we must get Constructor function by class name
            //internal:
            //      Shortcut method. It's goal - increase readability.
            //      Used in Accordion#init().
            if($.type(this.panelWidget) === 'string'){
                var widgetClazz = $.declare.getDeclaredClass(this.panelWidget);
                if(!widgetClazz) {
                    throw new Error(this.panelWidget + " class does not exists. " +
                        "Probably, problem is in missing dependency" +
                        " or in class name typo");
                }
                this.panelWidget = widgetClazz;
            } else {
                throw new Error("panelWidget must be a widget constructor " +
                                "or string that represents widget class name."+
                                "But " + $.type(this.panelWidget) + " given"
                )
            }
        },
        _onChildToggle:function(/*Event*/event){
            //summary:
            //      Internal event handler
            //description:
            //      Catch event that propagated from child widget
            //      and perform toggle transition
            //      on currently displayed widget and widget that has been clicked
            //
            //      see Accordion#init()
            event.stopPropagation();
            var
                from = this.stackContainer.current(),
                to   = event.widget;

            this._move(from,to);
        },
        _instantiateWidgetsFromMarkup: function(){
            //summary:
            //      Protected method
            //description:
            //      If we have child templates in markup - parse them.
            //      Well, actually - instantiate TitlePanel widgets.

            var
                self = this,
                defaultParams = {
                    toggleable: false,
                    templateInMarkup: this.templateInMarkup || false,
                    opened: false
                },
                params = {};

            //Accordion doesn't care about template. Accordion.panelWidget do.
            //make sure that panelWidget class know how to work with provided markup

            this.containerNode.children().each(function(idx, child){
                params = child.getAttribute('data-better-params');
                if(params) {
                    try {
                        params = $.parseJSON(params);
                    } catch(err) {
                        throw new Error("Failed to parse params. " +
                                        "Seems that data-better-params " +
                                        "holding malformed JSON: " + params +
                                        " see http://api.jquery.com/jQuery.parseJSON/" +
                                        " Especially section about malformed JSON"
                                  );
                    }
                }
                params = $.extend({},defaultParams, params||{});
                params.toggleable = false;
                self.stackContainer.add(new self.panelWidget(child, params));
            })
        }
    })

    return Accordion;
})