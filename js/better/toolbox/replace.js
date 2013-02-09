/*
 The "New" BSD License:
 **********************

 Copyright (c) 2005-2012, The Dojo Foundation
 All rights reserved.

 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions are met:

 * Redistributions of source code must retain the above copyright notice, this
 list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice,
 this list of conditions and the following disclaimer in the documentation
 and/or other materials provided with the distribution.
 * Neither the name of the Dojo Foundation nor the names of its contributors
 may be used to endorse or promote products derived from this software
 without specific prior written permission.

 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 DISCLAIMED.  IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE
 FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
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