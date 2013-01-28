define(['better', 'better/Widget', 'better/ui/position'], function ($, Widget) {
    var Panel

    /*=== hack for phpstorm 4.0.1*/
    /*=== Tell phpstorm that we declaring a class. Comment bellow gives us autocomplete in phpstorm */
    // var Panel = function(){
    // }

    /**
     * @class Panel
     * @extends Widget
     */
    Panel = $.declare(Widget, /**@lends Panel */ {
        //summary:
        //           Widget that holds fragment of HTML markup.
        //           Just Like common DIV tag but with advanced JavaScript API.
        //           API allows you to set content or load content from remote URL
        //description:
        //           Common DIV with advanced JavaScript API. It's API designed to
        //           help developer each time he/she writing something like:
        //
        //           $('#id').load(url).
        //
        //           Approach above has several drawbacks:
        //               - This code doesn't handle errors
        //               - This code doesn't change visual state of DOMElement to 'loading',
        //                 i.e. it doesn't give user visual feedback about things that happening
        //           Panel do this for developer in simple and extensible way


        declaredClass:'better.Panel',
        //loadingMsg: String|HTML
        //      Message and/or image that indicates Panel 'loading' state during http request
        loadingMsg:'<div class="state-loading"></div>',
        //errrosMsg: String|HTML
        //      Message to be displayed when error occurs
        errorMsg:'An error occurred. Please contact support.',
        //content: String|DOMElement
        //      Content that Panel currently displays
        //      Direct change of this property will do nothing
        //      Use setContent() or setHref() methods
        //      You can pass this property as a parameter on widget construction
        content:null,
        //href: String
        //      url to load content from
        //      Direct change of this property will do nothing
        //      use setHref method to load content into widget
        //      You can pass this property as a parameter on widget construction
        href:null,
        //contentNode: DOMElement wrapped with jQuery
        //      Reference to element, that represents widget content area
        contentNode:null,
        render:function () {

            this.contentNode = this.domNode;
            // here we can go in two ways:
            //      1. Widget template is in original DOMElement
            //         and we have to parse template first

            if (this.templateInMarkup) {
                      //That will do Widget#render
                this.inherited(arguments);
                     // and now we can grab content from contentNode
                this.content = this.content || this.contentNode.html();
            } else {
                // 2. We doesn't have template in markup.
                //    Widget's own template will replace original DOMElement
                //      and we will loose content

                //grab the content first
                this.content = this.content || this.contentNode.html();
                this.inherited(arguments);
            }
        },
        init:function () {
            if (this.content) {
                //todo: i'm not sure that we need setContent call when templateInMarkup set to true
                this.contentNode.html(this.content)
            } else if (this.href) {
                this.setHref(this.href)
            }
        },
        setContent:function (content) {
            //summary:
            //          set content to content node point
            cancelDeferred(this)
            this.content = content
            this.contentNode.html(content)
        },
        getContent:function () {
            //summary:
            //      Return actual content hold by pane
            return  this.contentNode.html();
        },
        setHref:function (href) {
            //summary:
            //          Load content into pane from given href


            // if we have any in-flight requests
            cancelDeferred(this)
            this.href = href;
            this.setLoadingMessage()
            this._dfd = $.get(href)
                .done($.proxy(this.onLoad, this))
                .fail($.proxy(this.onError, this))

        },
        reload:function () {
            //summary:
            //      Reload content from current href
            this.setHref(this.href)
        },
        onLoad:function (content, status, jqXHR) {
            //summary:
            //      Event. Triggered on successful AJAX request
            this.domNode.html(content)
            delete this._dfd;
            this.trigger('load', {content:content})
        },
        onError:function () {
            this.setErrorMessage()
            this.trigger('error')
        },
        setErrorMessage:function () {
            //summary: Set Pane error message
            //         which will appear on ajax request error
            //         Overwrite this method to implement your own
            //         error messaging logic
            this.setContent(this.errorMsg);
        },
        setLoadingMessage:function () {
            //summary: Inform user about content loading
            //         Overwrite this method to implement your own
            //         error messaging logic
            this.setContent(this.loadingMsg);
        },
        onShow:function () {
            //summary:
            //      Event. (Must be)Triggered before 'show' transition start.
            //      While content remains invisible
            this.trigger('show')
        },
        onHide:function () {
            //summary:
            //      Event. (Must be)Triggered before 'hide' transition start.
            //      While content remains visible
            this.trigger('hide')
        },
        onShowed:function () {
            //summary:
            //      Event. (Must be)Triggered on 'show' transition end.
            //      In other words - when animated DOMElement 100% visible
            this.trigger('showed')
        },
        onHidden:function () {
            //summary:
            //      Event. (Must be)Triggered on 'hide' transition end.
            //      In other words - when animated DOMElement 100% hidden
            this.trigger('hidden')
        }
    });

    $.ns.setObject('better.Panel', Panel)

    var cancelDeferred = function (/*Panel*/self) {
        //summary:
        //          Cancel any in-flight AJAX requests
        //          sample of private method

        if (self._dfd) {
            self._dfd.abort();
            delete self._dfd;
        }
    };

    return Panel
})
