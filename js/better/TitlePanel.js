define(['better', 'better/Panel', 'text!better/templates/TitlePanel/default.html'], function ($, Panel, template) {

    var TitlePanel

    /*=== hack for phpstorm 4.0.1*/
    /*=== Tell phpstorm that we declaring a class. Comment bellow gives us autocomplete in phpstorm */
//        var TitlePanel = function(){
//
//        }

    /**
     * @class TitlePanel
     * @extends Panel
     */
    TitlePanel = $.declare(Panel, /**@lends Panel*/{
        //summary:
        //      User Interface component that contains fragment of HTML markup and has title


        declaredClass:'better.TitlePanel',
        template:template,
        //contentNode: DOMElement wrapped with jQuery
        //      Represents TitlePanel content area
        contentNode:null,
        //toggleButtonNode: DOMElement wrapped with jQuery
        //      Element that issues show/hide transition when user clicks on toggleButtonNode
        toggleButtonNode:null,
        //toggleAnimationNode: DOMElement wrapped with jQuery
        //      An element to perform animation on.
        toggleTransitionNode:null,
        //headerNode: DOMElement wrapped with jQuery
        //            Represents TitlePanel header
        headerNode:null,
        //titleNode: DOMElement wrapped with jQuery
        //           Represents TitlePanel title
        titleNode:null,
        //title: String.
        //       TitlePanel title
        title:'',
        //opened: Boolean.
        //        Indicates TitlePanel state (opened/closed)
        opened:true,
        toggleable:false,

        init:function () {
            if(!this.toggleButtonNode){
                // if template doen't specifies button to toggle TitlePanel
                // we assume that it will be toggled on header click
                this.toggleButtonNode = this.headerNode;
            }
            this.inherited(arguments);
            if(this.title){
                this.setTitle(this.title);
            }

            this.toggleButtonNode.on('click', $.proxy(this._onToggleButtonClick, this));
            if (this.toggleable) {
                this.toggleButtonNode[0].style.display = "";
                this.on('toggle', $.proxy(this.toggle, this));
            }

            if (this.opened) {
                this.toggleTransitionNode.show();
            } else {
                this.toggleTransitionNode.hide()
            }
        },
        show:function () {
            if (this.opened) {
                return;
            }

            this.onShow();
//            this.toggleButtonNode.toggleClass("opened closed");
//            this.headerNode.toggleClass("opened closed");
            this.toggleTransitionNode.slideDown('fast', $.proxy(function () {
                //TitlePanel opened only when animation playback ended
                this.opened = true;
                this.onShowed();
            }, this));
        },
        hide:function () {
            if (!this.opened) {
                return;
            }
            /*var classToApply = styleMapping["opened"]*/
            this.onHide();
//            this.toggleButtonNode.toggleClass("opened closed");

            var self = this;
            this.toggleTransitionNode.slideUp('fast', function () {
                self.headerNode.toggleClass("opened closed");
                self.opened = false;
                self.onHidden();
            });

        },
        toggle:function () {
            //summary:
            //      Toggle TitlePanel content area visibility state
            if (this.opened) {
                this.hide()
            } else {
                this.show()
            }
        },
        setTitle:function (/*String*/title) {
            //summary:
            //          Set the TitlePanel title
            this.title = title;
            if (this.titleNode) {
                this.titleNode.html(title)
            }
        },
        _onToggleButtonClick: function (/*Event*/event) {
            //summary:
            //      Trigger toggle event on toggle button click
            //description:
            //      Click on TitlePanel toggleButtonNode is rather widget event than common event.
            //
            //       Also, jQuery unbind manual says us that:
            //          Using a proxied function to unbind an event on an element
            //          will unbind all proxied functions on that element,
            //          as the same proxy function is used for all proxied events.
            //          To allow unbinding a specific event, use unique class names on the event
            //          (e.g. click.proxy1, click.proxy2) when attaching them.
            //
            //      We smart guys and will use this advice. Because better.js using proxying a lot.
            event.preventDefault();
            event.stopPropagation();
            this.trigger('toggle');
        }
    })

    $.ns.setObject('better.TitlePanel', TitlePanel);
    return TitlePanel

})