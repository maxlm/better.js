define(['better','better/Widget','better/ui/position'],function($,Widget) {
    var Panel

    /*=== hack for phpstorm 4.0.1*/
    /*=== Tell phpstorm that we declaring a class. Comment bellow gives us autocomplete in phpstorm */
    // var Panel = function(){
    // }

    /**
     * @class Panel
     * @extends Widget
     */
   Panel = $.declare(Widget,/**@lends Panel */ {
        declaredClass: 'better.Panel',
//        template: '<div data-better-point="contentNode"> </div>',
        loadingMsg: '<div class="state-loading"></div>',
        errorMsg: 'An error occurred. Please contact support.',
        content: null,
        href: null,
        contentNode: null,
        render: function() {
            this.contentNode = this.domNode;
            if(!this.content){
                this.content = this.domNode.html()
            }
            //call parent method (Widget#render)
            this.inherited(arguments);
            
        },
        init: function() {
            if(this.content) {
                this.contentNode.html(this.content)
            } else if (this.href) {
                this.setHref(this.href)
            }
        },
        setContent: function(content) {
            //summary:
            //          set content to content node point
            cancelDeferred(this)
            this.content = content
            this.contentNode.html(content)
        },
        getContent: function() {
           return  this.contentNode.html();
        },
        setHref: function(href) {
            //summary:
            //          Load content into pane from given href


            // if we have any in-flight requests
            cancelDeferred(this)
            this.href = href;
            this.setLoadingMessage()
            this._dfd = $.get(href)
                         .done($.proxy(this.onLoad,this))
                         .fail($.proxy(this.onError,this))

        },
        reload: function() {
            this.setHref(this.href)
        },
        onLoad: function(content, status, jqXHR) {
            //summary:
            //          AJAX successful response handler
            this.domNode.html(content)
            delete this._dfd;
            this.trigger('load', {content: content})
        },
        onError: function() {
            this.setErrorMessage()
            this.trigger('error')
        },
        setErrorMessage: function() {
            //summary: Set Pane error message
            //         which will appear on ajax request error
            //         Overwrite this method to implement your own
            //         error messaging logic
            this.setContent(this.errorMsg);
        },
        setLoadingMessage: function() {
            //summary: Inform user about content loading
            //         Overwrite this method to implement your own
            //         error messaging logic
            this.setContent(this.loadingMsg);
        }
    });

    $.ns.setObject('better.Panel',Panel)

    var cancelDeferred = function(self) {
    //summary:
    //          Cancel any in-flight AJAX requests
    //          sample of private method
        if(self._dfd){
            self._dfd.abort();
            delete self._dfd;
        }
    };
    
    return Panel
})
