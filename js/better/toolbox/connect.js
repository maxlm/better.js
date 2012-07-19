define(['jquery', './aop'],function($,aspect){
    
    function connect(/*Object*/obj,/*String*/methodName,/*Object?*/scope, /*Function*/method){
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
