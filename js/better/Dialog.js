define(['better', 'better/Panel','text!better/templates/dialog/twitter.html'],function($,Panel,template){

      var Dialog

    /*=== hack for phpstorm 4.0.1*/
    /*=== Tell phpstorm that we declaring a class. Comment bellow gives us autocomplete in phpstorm */
//    var Dialog = function(){
//
//    }

    /**
     * @class Dialog
     * @extends Panel
     */
      Dialog = $.declare(Panel,  /**@lends Dialog*/{
        declaredClass: 'better.Dialog',
        template: template,
        //contentNode: DOMElement wrapped with jQuery
        //             Represents Dialog content area
        contentNode: null,
        //headerNode: DOMElement wrapped with jQuery
        //            Represents Dialog header
        headerNode: null,
        //titleNode: DOMElement wrapped with jQuery
        //           Represents Dialog title
        titleNode: null,
        //closeNode: DOMElement wrapped with jQuery
        //           Represents Dialog close button
        closeNode: null,
        //title: String.
        //       Dialog title
        title: '',
        //opened: Boolean.
        //        Indicates Dialog state (opened/closed)
        opened: false,
        //autoOpen: Boolean
        //          Open Dialog immediately
        autoOpen: false,
        closable: true,
        init: function() {
            this.domNode.css('display', 'none');
            this.inherited(arguments);
            this.setTitle(this.title)

            if(!this.closable) {
                this.closeNode.css('display','none');
            }
            if(this.autoOpen) {
                this.show();
            }
            
        },
        show: function() {
            if(this.opened) {
                return;
            }
            
            this.domNode.position({
                of: window
            })

            this.domNode.fadeIn($.proxy(function() {
                //dialog opened only when animation playback ended
                this.opened = true;
                this.trigger('show');
            },this));
        },
        hide: function() {
            if(!this.opened) {
                return;
            }
            this.domNode.fadeOut($.proxy(function() {
                //hack for UI.position
                this.domNode.css({top:0, left: 0});
                this.opened = false;
                this.trigger('hide');
            },this));                       
            
        },
        setTitle: function(/*String*/title) {
            this.title = title
            if(this.titleNode){
                this.titleNode.html(title)
            }
        }
    })
    
    $.ns.setObject('better.Dialog',Dialog);
    return Dialog
    
    
    
})