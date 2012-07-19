define(['better','better/Panel','text!better/templates/tooltip/dijit.html','better/ui/position'],
       function($,Panel,template){
    var Tooltip
    /*=== hack for phpstorm 4.0.1*/
    /*=== Tell phpstorm that we declaring a class. Comment bellow gives us autocomplete in phpstorm */
    //    var Tooltip = function(){
    //
    //    }

    /**
     * @class Tooltip
     * @extends Panel
     */
    Tooltip = $.declare(Panel,/**@lends Tooltip */ {
        declaredClass: 'better.Tooltip',
        template: template,
        position: {},
        content: '',
        shown: false,
        currentNode: null,
        __construct: function() {
          //set default tooltip position
          this.position = {
              my: "bottom",
              at: "top",
              offset: "0 -5",
              collision: "flipfit flipfit",
              using: $.proxy(function(pos, e) {

                  var el = e.element.element,
                      swap = {
                          top: 'bottom',
                          bottom: 'top',
                          left: 'right',
                          right: 'left'

                      },
                      cssClass
                  if(e.horizontal !== 'center') {
                      cssClass = e.horizontal
                  } else if(e.vertical !== 'center') {
                      cssClass = e.vertical
                  }

                  if(cssClass) {
                      el.addClass(swap[cssClass])
                      this._removeClass = swap[cssClass];
                  }
                  el.css(pos);
              }, this)
          }

          this.inherited(arguments)
        },
        init: function() {
            this.domNode.css('display','none');
        },
        show: function(/*String|Function*/content,/*DOMElement*/aroundNode, /*Object?*/position) {
            //summary:
            //          Show tooltip with content around desired aroundNode at given position

            aroundNode = $(aroundNode)
            position = position || this.position
            position.of = aroundNode

            if(this.shown && this.currentNode[0] !== aroundNode[0]) {
                var self = this;

                this.one('hide',function(event){
                    self.show(content, aroundNode, position)
                })

                this.hide()

                return
            }

            this.currentNode = aroundNode

            if(isString(content)) {
                // HTML string passed as a content
                this.setContent(content)
            } else if($.isFunction(content)) {
                //function that acts as content-getter
                // or invokes Tooltip.setContent or Tooltip.setHref
                var retVal = content(aroundNode, this);
                if(retVal) {
                    this.setContent(retVal);
                }
            }
            this.domNode.position(position);

            var self = this
            this.domNode.fadeIn('fast', function(){
                self.shown = true;
                self.trigger('show')
            })
        },
        hide: function(){
            var self = this;
            this.domNode.fadeOut('fast', function(){
                self.shown = false
                //ui.position workaround
                self.domNode.css({
                    top: 0,
                    left: 0,
                    position: 'absolute'
                })

                if(self._removeClass){
                    self.domNode.removeClass(self._removeClass)
                }
                self.trigger('hide')
            })
        }
    })

    var staticTooltip = new Tooltip({},'<div>')
    staticTooltip.domNode.appendTo(document.body)
    Tooltip.show = function(content, aroundNode, position) {
        staticTooltip.show(content, aroundNode, position)
    }
    Tooltip.hide = function() {
        staticTooltip.hide()
    }

    var isString = function(it) {
         // summary:
         //		Return true if it is a String
         // it: anything
         //		Item to test.
         return (typeof it == "string" || it instanceof String); // Boolean
     }

    $.ns.setObject('better.Tooltip', Tooltip);
    return Tooltip

})