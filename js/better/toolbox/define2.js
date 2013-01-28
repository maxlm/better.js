define(function(){
    /**
     *  Tool for parent class method calls.
     *  Obviously, class should be declared with lang.declare
     */
    function inherited(/*String*/name, /*Array*/args) {
        var
            caller = inherited.caller,
            inheritedFrom = undefined,
            callerFound = false,
            currClazz = this.constructor;

        while(!callerFound && currClazz) {
            if(caller === currClazz.prototype[name]) {
                callerFound = true;
                break;
            }
            currClazz = currClazz.__parent;
        }

        if(!callerFound) {
            throw new Error("method '"
                + name
                + "' not found in inheritance chain."
                + "Perhaps you trying to call 'inherited'"
                + "from a method of one name to a method of a different name"
            );
        }

        while(currClazz.__parent && !inheritedFrom) {
            inheritedFrom = currClazz.__parent.prototype[name]
        }

        if(name && inheritedFrom){// maybe we need return statement here?
            return inheritedFrom.apply(this, args);
        } else {
            throw new Error("End of inheritance chain reached. Perhaps, you trying to call method '" + name + "' in base class");
        }
    }

    function isArray(/*something*/v) {
        return Object.prototype.toString.call(v) === '[object Array]';
    }
    function extendz(/*Function|Function[]*/parents){

        //do nothing on empty argument set
        if(!arguments.length){
            return
        }
        if(typeof(parents) == 'function'){
            parents = [parents]
        }
        if(!isArray(parents) || !parents.length){
            throw "argument passed to 'extendz' must be a parent class declaration or array of parents"
        }
        //defer inheritance until first clazz instantiation
        inheritMultiple(this, parents)
    }

    function inherit(me,from){
        function tempCtor() {}
        var myproto = me.prototype;
        tempCtor.prototype = from.prototype;
        me.prototype = new tempCtor();
        for(var prop in myproto) {
            if(!myproto.hasOwnProperty(prop)) {
                continue
            }
            me.prototype[prop] = myproto[prop]
        }
        me.prototype.constructor = me;
        me.__parent = from;
        return me;
    }

    function inheritMultiple(/*Constructor*/ me, /*Constructor[]*/ from) {
        from = from.concat([]);
        if(from.length > 1) {
            //make plain inheritance chain
            var
                base = from.pop(),
                mixin = from.pop();
            base = inherit(mixin, base);
            while(mixin = from.pop()) {
                base = inherit(mixin, base)
            }
            return inherit(me, base)
        } else {
            return inherit(me,from[0])
        }
    }

    /**
     *  Basic tool for class declaration
     *  Capable to invoke parent class methods via inherited().
     *  Similar to PHP parent::methodName()
     *  That is all for now...
     *  @author Murzik
     */
    function declare(/*Constructor[]*/ parents) {
        var classDeclaration = function() {
            //similar to PHP5 __construct
            if(this.__construct) {
                this.__construct.apply(this, arguments);
            }
        }

        classDeclaration.prototype.constructor = classDeclaration;
        classDeclaration.prototype.inherited = inherited;
        classDeclaration.extendz = extendz;
        if(parents) {
            classDeclaration.extendz(parents)
        }
        return classDeclaration;
    }

    return declare;
});
