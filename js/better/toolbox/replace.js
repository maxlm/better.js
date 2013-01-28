define(['jquery','./namespace'],function($,ns){
    var _pattern = /\{([^\}]+)\}/g,

    replace = function(tmpl, map, pattern){
            return tmpl.replace(pattern || _pattern, $.isFunction(map) ?
                    map : function(_, k){ return ns.getObject(k, false, map); });
    };
    
    return replace;
    
    /*=====
    dojo.replace = function(tmpl, map, pattern){
            //	summary:
            //		Performs parameterized substitutions on a string. Throws an
            //		exception if any parameter is unmatched.
            //	tmpl: String
            //		String to be used as a template.
            //	map: Object|Function
            //		If an object, it is used as a dictionary to look up substitutions.
            //		If a function, it is called for every substitution with following
            //		parameters: a whole match, a name, an offset, and the whole template
            //		string (see https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/String/replace
            //		for more details).
            //	pattern: RegEx?
            //		Optional regular expression objects that overrides the default pattern.
            //		Must be global and match one item. The default is: /\{([^\}]+)\}/g,
            //		which matches patterns like that: "{xxx}", where "xxx" is any sequence
            //		of characters, which doesn't include "}".
            //	returns: String
            //		Returns the substituted string.
            //	example:
            //	|	// uses a dictionary for substitutions:
            //	|	dojo.replace("Hello, {name.first} {name.last} AKA {nick}!",
            //	|		{
            //	|			nick: "Bob",
            //	|			name: {
            //	|				first:	"Robert",
            //	|				middle: "X",
            //	|				last:		"Cringely"
            //	|			}
            //	|		});
            //	|	// returns: Hello, Robert Cringely AKA Bob!
            //	example:
            //	|	// uses an array for substitutions:
            //	|	dojo.replace("Hello, {0} {2}!",
            //	|		["Robert", "X", "Cringely"]);
            //	|	// returns: Hello, Robert Cringely!
            //	example:
            //	|	// uses a function for substitutions:
            //	|	function sum(a){
            //	|		var t = 0;
            //	|		dojo.forEach(a, function(x){ t += x; });
            //	|		return t;
            //	|	}
            //	|	dojo.replace(
            //	|		"{count} payments averaging {avg} USD per payment.",
            //	|		dojo.hitch(
            //	|			{ payments: [11, 16, 12] },
            //	|			function(_, key){
            //	|				switch(key){
            //	|					case "count": return this.payments.length;
            //	|					case "min":		return Math.min.apply(Math, this.payments);
            //	|					case "max":		return Math.max.apply(Math, this.payments);
            //	|					case "sum":		return sum(this.payments);
            //	|					case "avg":		return sum(this.payments) / this.payments.length;
            //	|				}
            //	|			}
            //	|		)
            //	|	);
            //	|	// prints: 3 payments averaging 13 USD per payment.
            //	example:
            //	|	// uses an alternative PHP-like pattern for substitutions:
            //	|	dojo.replace("Hello, ${0} ${2}!",
            //	|		["Robert", "X", "Cringely"], /\$\{([^\}]+)\}/g);
            //	|	// returns: Hello, Robert Cringely!
            return "";	// String
    }
    =====*/

                
    
})