define(function(){
    /**
     *  Tool for parent class method calls.
     *  Obviously, class should be declared with lang.declare
     */
    function inherited(args){
        var name,caller, inheritedFrom;
             caller = inherited.caller || arguments.callee.caller
        if(typeof(args) === 'string'){
            name = args;
            args = arguments[1];
        } else {
            name = caller.__name__;
        }
        inheritedFrom = caller.__inherited__;
        if(name && inheritedFrom){// maybe we need return statement here?
            inheritedFrom.prototype[name].apply(this, args);
        }
    }

    /**
     *  Basic tool for class declaration
     *  Capable to invoke parent class methods via inherited().
     *  Similar to PHP parent::methodName()
     *  That is all for now...
     *  @author Murzik
     */
     function declare(/* Constructor? */parent,/* Object */props) {
        var
            hasBase = typeof(parent) == 'function',
            base = hasBase? parent : function() {},
            classDeclaration = function() {
                //similar to PHP5 __construct
                if(this.__construct) {
                        this.__construct.apply(this, arguments);
                }
            },
            protoChainBreak = function() {},
            prop,
            propVal;

        protoChainBreak.prototype = base.prototype;
        classDeclaration.prototype = new protoChainBreak();
        classDeclaration.prototype.constructor = classDeclaration;
        //similar to PHP self keyword
        classDeclaration.prototype.__self = classDeclaration;
        for(prop in props){
            if(! props.hasOwnProperty(prop)){
                continue
            }
            propVal = props[prop];
            if(typeof(propVal) === 'function' && typeof(base.prototype[prop]) === 'function'){
                propVal.__name__  = prop;
                propVal.__inherited__ = base;
            }
            classDeclaration.prototype[prop] = propVal;
        }
        classDeclaration.prototype.inherited = inherited;

        return classDeclaration;
    }
    
    return declare;
});
