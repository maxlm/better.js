define(['better', 'better/Widget'], function(/*jQuery*/$, Widget){

    var StackViewAbstract;
    /*=== hack for phpstorm 4.0.1*/
    /*=== Tell phpstorm that we declaring a class. Comment bellow gives us autocomplete in phpstorm */
//    var StackViewAbstract = function(){
//
//    }

    /**
     * @class StackContainer
     * @param items
     * @constructor
     */
    var StackContainer = function(/*Array?*/ items) {
        this.items = [];
        if(items) {
            this.items = items;
        }
    }


    StackContainer.prototype.items = [];
    StackContainer.prototype.currentItem = undefined;

    StackContainer.prototype.indexOf = function(/*Anything*/value) {
        return $.inArray(value, this.items)
    }

    StackContainer.prototype.each = function(/*Callback*/cb, /*Object?*/scope) {
        //summary:
        //          Iterate over StackContainer items.
        //          'this' keyword points to StackContainer instance by default
        scope = scope || this;
        $.each(this.items, $.proxy(cb, scope));
    }

    StackContainer.prototype.next = function() {
        return step(this, true);
    }
    StackContainer.prototype.prev = function() {
        return step(this);
    }

    StackContainer.prototype.add = function(/*Anything*/ item) {
        //summary:
        //          Add new item at the end of container
        this.items.push(item);
        if(!this.currentItem) {
            this.currentItem = item;
        }
    }

    StackContainer.prototype.remove = function(/*Anything*/ item) {
        var itemIdx = this.indexOf(item);

        if(-1 === itemIdx) {
            var msg = "Trying to delete item that does not exists in container";
            throw new Error(msg)
        }
        if(item === this.currentItem) {
            this.currentItem = undefined;
        }

        this.items.splice(itemIdx, 1);

        if(this.items.length) {
            //select previous item
            this.currentItem = this.items[Math.max(0, Math.min(itemIdx, this.items.length - 1) - 1)]
        }
    }

    StackContainer.prototype.current = function(/*Anything?*/ item) {
        if(!arguments.length) {
            return this.currentItem || this.items[0];
        }
        var idx = this.indexOf(item);
        if(-1 === idx) {
            var msg = "Item passed to StackContainer::setCurrent does not exist."+
                      " You must add item via StackContainer::add before setCurrent call";
            throw new Error(msg)
        }
        this.currentItem = this.items[idx]
    }

    function step(/*StackContainer*/self, /*Boolean?*/forward) {
        //summary:
        //          Private method of StackContainer
        //		    Gets the next/previous item in container from the current position

        var idx = self.indexOf(self.currentItem);

        //awesome two-liner from Dijit StackController!
        //it makes steps circular
        idx += forward ? 1 : self.items.length - 1;
        self.currentItem = self.items[ idx % self.items.length ];

        return self.currentItem;
    }
//====end of StackContainer declaration====//

    /**
     * @class StackViewAbstract
     * @extends Widget
     */
     StackViewAbstract = $.declare(Widget, /**@lends StackViewAbstract*/{
         // summary:
         //		A container that has multiple children, but shows only
         //		one child at a time
         //
         // description:
         //		A container for widgets (ContentPanes, for example) That displays
         //		only one Widget at a time.
         //
         //
         //		Base class for Tabs, Accordion, Show, etc.


         panes: [],
         //stackContainer: StackContainer holds all stacked widgets
         stackContainer: {},
         __construct: function(/*String|DOMElement|jQuery*/node, /*Object?*/args) {
             this.stackContainer = new StackContainer();
             this.inherited(arguments)
         },
         init: function() {
         },
         next: function() {
             //summary:
             //         Show next widget in stack relative to current selection
             var
                 sc    = this.stackContainer,
                 from  = sc.current(),
                 to    = sc.next();
             this._move(from, to);
         },
         prev: function() {
             //summary:
             //         Show previous widget in stack relative to current selection
             var
                 sc    = this.stackContainer,
                 from  = sc.current(),
                 to    = sc.prev();
             this._move(from, to);
         },
         current: function(/*Widget?*/ widget) {
             //summary:
             //         get/set currently displayed widget

             var
                 sc   = this.stackContainer,
                 from = sc.current(),
                 to   = widget;

             if(!widget) {
                 return from;
             }

             sc.current(to);
             this._move(from, to);

         },
         addChild: function(/*Widget*/widget) {

         },
         removeChild: function(/*Widget*/widget) {
             //todo: maybe it makes sense to add complementary method detachChild
             this.stackContainer.remove(widget);
             widget.destroy();
         },
         onShow: function(showTarget, hideTarget) {
             this.trigger('show',{
                 showTarget: showTarget,
                 hideTarget: hideTarget
             })
         },
         onHide: function(show, hide) {
             this.trigger('hide',{
                 showTarget: show,
                 hideTarget: hide
             });
         },
         onShowed: function(showedTarget, hiddenTarget) {
             this.trigger('showed',{
                 showedTarget: showedTarget,
                 hiddenTarget: hiddenTarget
             })
         },
         onHidden: function(showedTarget, hiddenTarget) {
             this.trigger('hidden', {
                 showedTarget: showedTarget,
                 hiddenTarget: hiddenTarget
             })
         },
         _move: function(/*Widget*/from, /*Widget*/to) {
             //summary:
             //     Perform transition from one stacked view widget to another
             //     and set just shown widget as currently displayed
             this._doTransition(from, to);
             this.stackContainer.current(to);
         },
         _doTransition: function(/*Widget*/from,/*Widget*/to) {
             //summary:
             //     Abstract method that must be implemented in child class.
             //     Method *MUST* hide widget that passed in 'from' parameter
             //     and show widget that passed in 'to' parameter
             throw new Error(this.declaredClass + "#_doTransition must be implemented");
         }


     });

    return StackViewAbstract;
})