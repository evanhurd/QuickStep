var Model = require('../Model.js');
var QuickStep = require('../QuickStep.js');

var Element = new Model("Element",['element', 'hidden']);
module.exports = Element;

var elementMetaData = {};

Element.prototype.init = function(){
	setUpQuickStepTriggers(this.toString());
	//this.__proto__.toString = function(){ return "qsElement"}
	this.hidden = 0;
	elementMetaData[this._id] = {
		model: this,
		events : {

		}
	};
}

Element.prototype.hide = function(){
	if(this.element){
		this.element.style.display = 'none';
		this.hidden = 0;		
	}
}

Element.prototype.show = function(){
	if(this.element){
		this.element.style.display = '';
		this.hidden = 0;		
	}
}

Element.prototype.element_bindEvent = function(eventName){
	if(elementMetaData[this._id].events[eventName]){
		this.element.removeEventListener(eventName, elementMetaData[this._id].events[eventName]);
	}
	var eventFunc = function(eventName, event){
		this.event({type:'element.'+eventName, key:'element.'+eventName, value:event});
		//this.SubPub.publish('element.'+eventName,{type:eventName, event:event, item:this});
	}.bind(this, eventName);

	this.element.addEventListener(eventName, eventFunc);
	elementMetaData[this._id].events[eventName] = eventFunc;
	return this;
}

function setUpQuickStepTriggers(elementName){
	QuickStep.on(elementName,function(type,thing,target){
		thing.element = thing.element || document.createElement('div');
		QuickStep.apply(target,[thing.element]);
		return false;
	});

	QuickStep.on('-'+elementName,function(type,thing){
		if(thing.element.parentElement)thing.element.parentElement.removeChild(thing.element);
		return false;
	});

	QuickStep.on('element<'+elementName,function(type,thing,target){
		var element = thing.element || document.createElement('div');
		if(target.parentElement)target.parentElement.insertBefore(element, target);
		return false;
	});
}