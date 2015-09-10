module.exports = ModelValue;
var QuickStep = require('./QuickStep.js');

function ModelValue(item){
	if(item.toString() == "CollectionItem"){
		this.metaSubPub = item.SortMeta.SubPub;
		this.SubPub = item.SubPub;
		this.item = item;
		this.modelKeys = item.Item.Properties.Model.keys;
	}else{
		this.metaSubPub = false;
		this.SubPub = item.SubPub;
		this.item = item;
		this.modelKeys = item.Properties.Model.keys;
	}
	
	this.stringTester = new createValueStringTester(this.item, this.modelKeys);
	return Value.bind(this);
}

function Value(valueString){
	var keysUsed = this.stringTester.test(valueString);
	return {
		item : this.item,
		keys : keysUsed,
		modelKeys : this.modelKeys,
		valueString : valueString,
		SubPub : this.SubPub,
		metaSubPub : this.metaSubPub ? this.metaSubPub.newGroup() : this.SubPub,
		stringTester : this.stringTester,
		toString : function(){return "ModelValue"}
	};
}


function createValueStringTester(item, keys){
	return (function(item){
		//var keys = item.Properties.Model.keys;
		var tester = {};
		var __currentTestKeys = [];

		tester.__get = function(key){
			if(__currentTestKeys.indexOf(key) < 0) __currentTestKeys.push(key);
		}

		for(var i in keys) {
			var key = keys[i];
			tester.__defineGetter__(key, tester.__get.bind(tester,key));
		}

		tester.__defineGetter__('_index', tester.__get.bind(tester,'_index'));
		tester.__defineGetter__('_previousItem', tester.__get.bind(tester,'_previousItem'));
		tester.__defineGetter__('_nextItem', tester.__get.bind(tester,'_nextItem'));

		tester.test = function(valueString){
			__currentTestKeys = [];
			with(this) {
				eval(valueString);
			}
			return __currentTestKeys;
		}
		return tester;
	})(item);
}

function bindKeys(modelValue, updateFunction, target, setting) {
	for(var i in modelValue.keys) {
		var key = modelValue.keys[i];
		if(key == '_index' || key == '_previousItem' || key == '_nextItem') {
			modelValue.metaSubPub.subscribe(key,updateFunction.bind(modelValue, modelValue, target, setting));
		}else{
			modelValue.item.on(key,updateFunction.bind(modelValue, modelValue, target, setting));
		}
	}
}

function evaluateValueString(item, valueString){
	with(item) {
		return eval(valueString);
	}
}

function updateTextNode(modelValue, target) {
	target.nodeValue = evaluateValueString(modelValue.item, modelValue.valueString);
}

function updateStyle(modelValue, target, setting) {
	target.style[setting] = evaluateValueString(modelValue.item, modelValue.valueString);
}

function updateAttribute(modelValue, target, setting) {
	target.setAttribute(setting, evaluateValueString(modelValue.item, modelValue.valueString));
}

function updateClass(modelValue, target) {
	target.setAttribute('class', evaluateValueString(modelValue.item, modelValue.valueString));
}

function applyEventToTarget(modelValue, target, event){

}

QuickStep.on('ModelValue',function(type,thing,target){
	var initialValue = evaluateValueString(thing.item, thing.valueString);
	var textNode = document.createTextNode(initialValue);
	bindKeys(thing, updateTextNode, textNode, null);
	target.appendChild(textNode);
	return false;
});

QuickStep.on('element.object.style.*=ModelValue',function(type,thing,target, setting){
	bindKeys(thing, updateStyle, target, setting);
	updateStyle(thing, target, setting); 
	return false;
});

QuickStep.on('element.object.attribute.*=ModelValue',function(type,thing,target, setting){
	bindKeys(thing, updateAttribute, target, setting);
	updateAttribute(thing, target, setting);
	return false;
});

QuickStep.on('element.object.attr.*=ModelValue',function(type,thing,target, setting){
	bindKeys(thing, updateAttribute, target, setting);
	updateAttribute(thing, target, setting);
	return false;
});

QuickStep.on('element.object.id=ModelValue',function(type,thing,target, setting){
	bindKeys(thing, updateAttribute, target, "id");
	updateAttribute(thing, target, "id");
	return false;
});

QuickStep.on('element.object.class=ModelValue',function(type,thing,target, setting){
	bindKeys(thing, updateClass, target);
	target.setAttribute('class', evaluateValueString(thing.item,thing.valueString));
	return false;
});

QuickStep.on('element.object.change=ModelValue',function(type,thing,target, setting){
	applyEventToTarget();
	return false;
});
