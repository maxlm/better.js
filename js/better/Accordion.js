define(['better', 'better/StackViewAbstract'], function(/*jQuery*/$, StackView){
    var Accordion

    /**
     * @class Accordion
     * @extends StackViewAbstract
     */
    Accordion = $.declare(StackView , { /**@lends Accordion*/
        declaredClass: 'better.Accordion',
        panelWidget: 'better.TitlePanel',
        init: function() {
            if(this.templateInMarkup){
              this._instantiateWidgetsFromMarkup();
            }

            this.domNode.on('better.TitlePanel.toggle', $.proxy(this._onChildToggle,this))
        },
        addChild: function(/*TitlePanel*/ child) {

        },
        _doTransition:function(/*TitlePanel*/from, /*TitlePanel*/to) {
            from.hide();
            to.show();
        },
        destroy: function(){
            this.stackContainer.each(function(idx, pane){
                pane.destroy();
            })
            this.remove();
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
                    templateInMarkup: true,
                    opened: false
                };

            //Accordion doen't care about template. Accordion.panelWidget do.
            //make sure that panelWidget class know how to work with markup provided
            this.domNode.children().each(function(idx, child){
                if($.type(self.panelWidget) === 'string'){
                    //todo: get the constructor object by class name
                } else if($.type(self.panelWidget) === 'function' && self.panelWidget.prototype.declaredClass){
                    var childWidget = new self.panelWidget(child, defaultParams);
                    self.stackContainer.add(childWidget);
                }
            })
        }
    })

    return Accordion;
})