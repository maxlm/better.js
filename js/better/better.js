define(
['jquery','./toolbox/aop', './toolbox/connect','./toolbox/declare','./toolbox/namespace','./toolbox/replace'],
function($,aop,connect,declare,ns,replace) {
    //summary:
    //      Some kind of bootstrap for better.js
    
    $.aop = aop; //aspect oriented code. From Dojo Tooltit sources
    $.connect = connect // aspect.after for connects to objects
    $.declare = declare //OOP tool
    $.ns = ns //namespaces. jQuery.getObject
    $.replace = replace // mini-templating engine. See docs on dojotoolkit for dojo.replace

    ns.setObject('better');
    return $
});
