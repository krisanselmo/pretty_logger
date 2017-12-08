define("DynHighlightRules", [], function(require, exports, module) {
"use strict";

var oop = require("ace/lib/oop");
var TextHighlightRules = require("ace/mode/text_highlight_rules").TextHighlightRules;

var DynHighlightRules = function() {
   this.setKeywords = function(kwMap) {
       this.keywordRule.onMatch = this.createKeywordMapper(kwMap, "identifier")
   }
   this.keywordRule = {
       regex : "\\w+",
       onMatch : function() {return "text"}
   }

   this.$rules = {
        "start" : [
            {
                token: "comment",
                regex: /a\[(.*?)\]/,
            }, {
                token: "invalid",
                regex: /ERREUR/,
            }, {
                token: "comment",
                regex: /SECU/,
            }, {
                token: "invalid.deprecated",
                regex: /WARN/,
            }, {
                token: "variable",
                regex: /PERF/,
            }, {
                token: "variable",
                regex: /SUIVI/,
            }, {
                token: "storage.type",
                regex: /DEBUG/,
            }, {
                token: "comment",
                regex: /TRACE/,
            }, {
                token: "keyword",
                regex: /DAO/,
            }, {
                token: "keyword",
                regex: /postman/,
            }, {
                token: "keyword",
                regex: /Body requete/,
            }, {
                token: "keyword",
                regex: /pathparam/,
            }, {
                token: "keyword",
                regex: /queryparam/,
            }, {
                token: "constant.numeric",
                regex: /[0-9]{4}\/[0-9]{2}\/[0-9]{2}/,
            }, {
                token: "constant.numeric",
                regex: /[0-9]{2}:[0-9]{2}:[0-9]{2}[,.][0-9]{3}/,
            }, {
                token: "string",
                regex: /\[Ressource:(\S*)\]/,
            }, {
                token : "string",
                regex : /"(?:[^\\"]|\\.)*"/,
            }
        ]
    };
   this.normalizeRules()
};

oop.inherits(DynHighlightRules, TextHighlightRules);

exports.DynHighlightRules = DynHighlightRules;

});
