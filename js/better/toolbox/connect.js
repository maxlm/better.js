define(['jquery', './aspect'],function($,aspect){
    
    function connect(/*Object*/obj,/*String*/methodName,/*Object?*/scope, /*Function*/method){
        //summary:
        //      Syntatic sugar for aspect.after
        //      Connects 'method'(advice) which will be executed in given 'scope'(if provided)
        //      *after* obj[methodName](target) execution
        //      See better/toolbox/aspect for more details
        // returns:
        //		A signal object that can be used to cancel the advice. If remove() is called on this signal object, it will
        //		stop the advice function from being executed.
        if ($.isFunction(method)) {
            return aspect.after(obj, methodName, $.proxy(method, scope), true)
        } else {
            // scope didn't passed. So, 3d argument is method
            method = scope
            return aspect.after(obj, methodName, method, true)
        }
    }
    
    return connect;
})
