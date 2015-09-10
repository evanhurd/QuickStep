// JavaScript Document
var QuickStep = {
	listeners : {
		array	: [],
		object : [],
		string : [],
		number: [],
		element: [],
		other : {}
	},
	on: function(type,method) {
		switch(type) {
			case 'array':
				QuickStep.listeners.array.push(
					{
						method : method
					}
				);
			break;
			case 'object':
				QuickStep.listeners.object.push(
					{
						method : method
					}
				);			
			break;
			case 'string':
				QuickStep.listeners.string.push(
					{
						method : method
					}
				);			
			break;
			case 'number':
				QuickStep.listeners.number.push(
					{
						method : method
					}
				);			
			break;
			case 'element':
				QuickStep.listeners.element.push(
					{
						method : method
					}
				);			
			break;
			default:
			if(QuickStep.listeners.other[type] === undefined){
				QuickStep.listeners.other[type] = [];
			}
			QuickStep.listeners.other[type].push(method);
			return QuickStep;
		}
		return QuickStep;
	},
	
	apply: function(element,args){
		element = ( QuickStep.getType(element) === 'string' ) ? document.createElement(element) : element;
		for(var i = 0; i < args.length;i++){
			QuickStep.trigger(QuickStep.getType(args[i]), args[i],element);
		}
		return element;
	},

	insertBefore: function(element,beforeElment){
		QuickStep.trigger(QuickStep.getType(beforeElment)+"<"+QuickStep.getType(element), element,beforeElment);
		return element;
	},

	remove: function(element){
		QuickStep.trigger('-'+QuickStep.getType(element), element,element)
		return element;
	},

	append: function(element, parent){
		QuickStep.trigger(QuickStep.getType(element), element,parent);
		return element;
	},
	
	trigger: function(type, thing,target){
		var setting = arguments[3];
		if( QuickStep.listeners[type] ){
			for(var i = QuickStep.listeners[type].length - 1; i >= 0; i--){
				listener = QuickStep.listeners[type][i];
				if(typeof listener.method === 'function' && listener.method.call(target,type,thing,target,setting) === false){
					return QuickStep;	
				}
			}			
		} else {
			if(QuickStep.listeners.other[type] !== undefined){
				for(var i = QuickStep.listeners.other[type].length - 1; i >= 0; i--){
					method = QuickStep.listeners.other[type][i];
					if(typeof method === 'function' && method.call(target,type,thing,target,setting) === false){
						return QuickStep;	
					}
				}
			}
		}
	},
	/**
	 * Thanks to : 
	 * http://javascriptweblog.wordpress.com/2011/08/08/fixing-the-javascript-typeof-operator/
	 *  @param (any) Thing to be identified
	 *  @return (string) object type
	*/
	getType: function(thing) {

		
		if(thing === undefined)return undefined;
		if(thing === null) return null;
		if(thing && thing.nodeType == 8) return 'element';

		if(typeof thing == 'object' && thing.tagName && thing._localName){
			return "element";
		}

		var majorType = ({}).toString.call(thing).match(/([a-zA-Z]+)/)[1];
		var minorType = ({}).toString.call(thing).match(/\s([a-zA-Z]+)/)[1];
		if(majorType && minorType && majorType.toLowerCase() == "object" && minorType.toLowerCase().search('element') > 0){
			return 'element';
		}else if(typeof thing == 'object' && thing.toString() != "" && thing.toString() != ({}).toString()){
			return thing.toString();
		}else{
			return minorType.toLowerCase();
		}
	},
	
	"a":function(){return this.apply("a",arguments);},
	"abbr":function(){return this.apply("abbr",arguments);},
	"acronym":function(){return this.apply("acronym",arguments);},
	"address":function(){return this.apply("address",arguments);},
	"applet":function(){return this.apply("applet",arguments);},
	"area":function(){return this.apply("area",arguments);},
	"b":function(){return this.apply("b",arguments);},
	"base":function(){return this.apply("base",arguments);},
	"basefont":function(){return this.apply("basefont",arguments);},
	"bdo":function(){return this.apply("bdo",arguments);},
	"big":function(){return this.apply("big",arguments);},
	"blockquote":function(){return this.apply("blockquote",arguments);},
	"body":function(){return this.apply("body",arguments);},
	"br":function(){return this.apply("br",arguments);},
	"button":function(){return this.apply("button",arguments);},
	"caption":function(){return this.apply("caption",arguments);},
	"center":function(){return this.apply("center",arguments);},
	"cite":function(){return this.apply("cite",arguments);},
	"code":function(){return this.apply("code",arguments);},
	"col":function(){return this.apply("col",arguments);},
	"colgroup":function(){return this.apply("colgroup",arguments);},
	"dd":function(){return this.apply("dd",arguments);},
	"del":function(){return this.apply("del",arguments);},
	"dfn":function(){return this.apply("dfn",arguments);},
	"dir":function(){return this.apply("dir",arguments);},
	"div":function(){return this.apply("div",arguments);},
	"dl":function(){return this.apply("dl",arguments);},
	"dt":function(){return this.apply("dt",arguments);},
	"em":function(){return this.apply("em",arguments);},
	"fieldset":function(){return this.apply("fieldset",arguments);},
	"font":function(){return this.apply("font",arguments);},
	"form":function(){return this.apply("form",arguments);},
	"frame":function(){return this.apply("frame",arguments);},
	"frameset":function(){return this.apply("frameset",arguments);},
	"h1":function(){return this.apply("h1",arguments);},
	"h2":function(){return this.apply("h2",arguments);},
	"h3":function(){return this.apply("h3",arguments);},
	"h4":function(){return this.apply("h4",arguments);},
	"h5":function(){return this.apply("h5",arguments);},
	"h6":function(){return this.apply("h6",arguments);},
	"head":function(){return this.apply("head",arguments);},
	"hr":function(){return this.apply("hr",arguments);},
	"html":function(){return this.apply("html",arguments);},
	"i":function(){return this.apply("i",arguments);},
	"iframe":function(){return this.apply("iframe",arguments);},
	"img":function(){return this.apply("img",arguments);},
	"input":function(){return this.apply("input",arguments);},
	"ins":function(){return this.apply("ins",arguments);},
	"isindex":function(){return this.apply("isindex",arguments);},
	"kbd":function(){return this.apply("kbd",arguments);},
	"label":function(){return this.apply("label",arguments);},
	"legend":function(){return this.apply("legend",arguments);},
	"li":function(){return this.apply("li",arguments);},
	"link":function(){return this.apply("link",arguments);},
	"map":function(){return this.apply("map",arguments);},
	"menu":function(){return this.apply("menu",arguments);},
	"meta":function(){return this.apply("meta",arguments);},
	"noframes":function(){return this.apply("noframes",arguments);},
	"noscript":function(){return this.apply("noscript",arguments);},
	"object":function(){return this.apply("object",arguments);},
	"ol":function(){return this.apply("ol",arguments);},
	"optgroup":function(){return this.apply("optgroup",arguments);},
	"option":function(){return this.apply("option",arguments);},
	"p":function(){return this.apply("p",arguments);},
	"param":function(){return this.apply("param",arguments);},
	"pre":function(){return this.apply("pre",arguments);},
	"q":function(){return this.apply("q",arguments);},
	"s":function(){return this.apply("s",arguments);},
	"samp":function(){return this.apply("samp",arguments);},
	"script":function(){return this.apply("script",arguments);},
	"select":function(){return this.apply("select",arguments);},
	"small":function(){return this.apply("small",arguments);},
	"span":function(){return this.apply("span",arguments);},
	"strike":function(){return this.apply("strike",arguments);},
	"strong":function(){return this.apply("strong",arguments);},
	"style":function(){return this.apply("style",arguments);},
	"sub":function(){return this.apply("sub",arguments);},
	"sup":function(){return this.apply("sup",arguments);},
	"table":function(){return this.apply("table",arguments);},
	"tbody":function(){return this.apply("tbody",arguments);},
	"td":function(){return this.apply("td",arguments);},
	"textarea":function(){return this.apply("textarea",arguments);},
	"tfoot":function(){return this.apply("tfoot",arguments);},
	"th":function(){return this.apply("th",arguments);},
	"thead":function(){return this.apply("thead",arguments);},
	"title":function(){return this.apply("title",arguments);},
	"tr":function(){return this.apply("tr",arguments);},
	"tt":function(){return this.apply("tt",arguments);},
	"u":function(){return this.apply("u",arguments);},
	"ul":function(){return this.apply("ul",arguments);}
};

QuickStep.on('element',function(type,thing,target){
	target.appendChild(thing);
	return false;
});

QuickStep.on('-element',function(type,thing,target){
	if(thing.parentElement)thing.parentElement.removeChild(thing);
	return false;
});

QuickStep.on('element<element',function(type,thing,target){
	if(target.parentElement)target.parentElement.insertBefore(thing, target);
	return false;
});

QuickStep.on('string',function(type,thing,target){
	target.appendChild(document.createTextNode(thing));
	return false;
});
QuickStep.on('number',function(type,thing,target){
	target.appendChild(document.createTextNode(thing));
	return false;
});
QuickStep.on('array',function(type,thing,target){
	QuickStep.apply(target,thing);
	return false;
});
QuickStep.on('object',function(type,thing,target){
	for(var i in thing){
		QuickStep.trigger(QuickStep.getType(target)+'.object.'+i+"="+QuickStep.getType(thing[i]),thing[i],target);
	}
	return false;
});

QuickStep.on('[object Arguments]',function(type,thing,target){
	var argArray = [];
	for(var i = 0; i < thing.length;i++){
		argArray.push(thing[i]);
	}
	QuickStep.apply(target,argArray);
	return false;
});

QuickStep.on('element.object.style=object',function(type,thing,target){
	for(var i in thing){
		var type = QuickStep.getType(thing[i]);
		if(type == 'string' || type == "number"){
			target.style[i] = thing[i];
		}else{
			QuickStep.trigger("element.object.style."+i+"="+type,thing[i],target);
			QuickStep.trigger("element.object.style.*="+type,thing[i],target, i);
		}
	}
	return false;
});

QuickStep.on('element.object.attribute=object',function(type,thing,target){
	for(var i in thing){
		var type = QuickStep.getType(thing[i]);
		if(type == 'string' || type == "number"){
			target.setAttribute(i,thing[i]);
		}else{
			QuickStep.trigger("element.object.attribute."+i+"="+type,thing[i],target);
			QuickStep.trigger("element.object.attribute.*="+type,thing[i],target, i);
		}
	}
	return false;
});


QuickStep.on('element.object.attr=object',function(type,thing,target){
	for(var i in thing){
		var type = QuickStep.getType(thing[i]);
		if(type == 'string' || type == "number"){
			target.setAttribute(i,thing[i]);
		}else{
			QuickStep.trigger("element.object.attribute."+i+"="+type,thing[i],target);
			QuickStep.trigger("element.object.attribute.*="+type,thing[i],target, i);
		}
	}
	return false;
});

QuickStep.on('element.object.parent=element',function(type,thing,target){
	QuickStep.apply(thing,[target]);
	return false;
});
QuickStep.on('element.object.class=string',function(type,thing,target){
	target.className = thing;
	return false;
});

QuickStep.on('element.object.html=string',function(type,thing,target){
	target.innerHTML = thing;
	return false;
});

QuickStep.on('element.object.id=string',function(type,thing,target){
	target.setAttribute("id", thing);
	return false;
});

QuickStep.on('element.object.type=string',function(type,thing,target){
	target.setAttribute("type", thing);
	return false;
});

QuickStep.on('element.object.value=string',function(type,thing,target){
	target.setAttribute("value", thing);
	return false;
});

QuickStep.on('element.object.value=number',function(type,thing,target){
	target.setAttribute("value", thing);
	return false;
});

module.exports = QuickStep;