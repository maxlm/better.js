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
        if(name && inheritedFrom){
            return inheritedFrom.prototype[name].apply(this, args);
        }
    }

    /**
     * Registry of classes declared via 'declare'
     * @type {Object}
     */
    var classRegistry = {};

    function registerClass(/*String*/className, /*Function*/ declaredClass){
        //summary:
        //      Register declared class in class registry.
        //      Private method. Used in 'declare'
        if(!classRegistry[className]) {
            classRegistry[className] = declaredClass;
        } else {
            var msg = "Attempt to redeclare class." +
                      "Class '" + className +
                      "' already declared";
            throw new Error(msg);
        }
    }

    function getDeclaredClass(className) {
        //summary:
        //      Get class constructor by class name
        //return: Constructor|undefined
        return classRegistry[className];
    }

    /**
     *  Basic tool for class declaration
     *  Capable to invoke parent class methods via inherited().
     *  Similar to PHP parent::methodName()
     *  That is all for now...
     *  @author Murzik
     */
    function declare(/*String?*/className, /*Constructor?*/parent, /*Object*/props) {

        //<<==params normalization
        if(typeof className !== "string") {
            props = parent;
            parent = className;
            className = "";
        }
        if(!props) {
            props = parent;
            parent = false;
        }
        //==>>end of params normalization
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
        if(className) {
            classDeclaration.prototype.declaredClass = className;
            registerClass(className, classDeclaration);
        }
        return classDeclaration;
    }

    declare.getDeclaredClass = getDeclaredClass;

    return declare;
});
