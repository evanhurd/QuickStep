var SubPub = require('./subpub.js');
module.exports = Model;

function Model(name, keys, settings) {

	function Item(model, keyValuePair){
		var self = this;
		var properties = {};
		self.Properties = properties;
		self.Event = ItemEvent.bind(self, self);
		self.SubPub = new SubPub();
		self.ParentSubPub = model.SubPub.newGroup();

		properties.keyValuePair = keyValuePair || {};
		properties.Model = model;
		initItemGettersAndSetters(self);
		self.init(self);
	}

	Item.keys = keys;
	Item.prototype.Settings = settings || {};
	Item.prototype.extenedFrom = [];
	Item.modelName= name;
	Item.prototype.toString = function() {return this.Properties.Model.modelName;};
	Item.prototype.event = function(eventProperties){
		fireEvent(this, new ItemEvent(this, eventProperties));
	};
	Item.prototype.init = function(){};
	Item.prototype.on = on;
	Item.SubPub = new SubPub();
	Item.on = on;

	Item.__proto__.toString = function(){return "Model";}
	Item.__proto__.extends = function(model){
		return extendModel(this,model);
	}

	var inculcatedFunction = Item.bind({},Item);
	inculcatedFunction.Item = Item;
	inculcatedFunction.keys = keys;
	inculcatedFunction.prototype = Item.prototype;
	inculcatedFunction.name = name;
	return inculcatedFunction;
}

function on(eventName,callBack) {
	this.SubPub.subscribe(eventName, callBack);
}

function initItemGettersAndSetters(item) {
	for(var i = 0; i < item.Properties.Model.keys.length;i++) {
		var key = item.Properties.Model.keys[i];
		item.__defineGetter__(key, attemptKeyGet.bind(item, item, key));
		item.__defineSetter__(key, attemptKeySet.bind(item, item, key));
	}
}

function attemptKeyGet(item, key){
	return item.Properties.keyValuePair[key];
}

function attemptKeySet(item, key, value){
	item.Properties.keyValuePair[key] = value;
	item.event({
		  key : key
		, value : value
		, oldValue : item.Properties.keyValuePair[key]
	});
}


function ItemEvent(item, properties) {
	//console.log('TODO', 'Add property requirments.');
	//console.log('TODO', 'Add event time info.');
	var event = {
		  model : item.Properties.Model
		, item : item
		, type : properties.type || "Update"
		, key : properties.key || ""
		, value : properties.value  || ""
		, oldValue : properties.oldValue  || ""
	}

	return event;
}

function fireEvent(item, event) {
	item.SubPub.publish("*", event);
	item.SubPub.publish(event.key, event);
	item.SubPub.publish(event.type, event);
	
	item.ParentSubPub.publish("*", event);
	item.ParentSubPub.publish(event.type, event);
	item.ParentSubPub.publish(event.type + ":" + item.toString(), event);
	item.ParentSubPub.publish(event.type + ":" + item.toString() + "." + event.key, event);
	item.ParentSubPub.publish(item.toString(), event);
	item.ParentSubPub.publish(item.toString() + "." + event.key, event);
}


function extendModel(model, withModel){
	if(model.toString() == "Model" && withModel.toString() == "Model") {
		model.prototype.extenedFrom.push(withModel.name);

		//Extend Keys
		for(var i = 0; i < withModel.keys.length; i++){
			var key = withModel.keys[i];
			if(model.keys.indexOf(key) < 0) {
				model.keys.push(key);	
			}
		}

		//Extend prototypes
		for(proto in withModel.prototype){

			if( 	proto == "Settings"
				||	proto == "on"
				||	proto == "event"
				||	proto == "toString"
				||	proto == "init"
				||	proto == "extenedFrom") {
				continue;
			}

			if(model.prototype[proto] == undefined) {
				model.prototype[proto] = withModel.prototype[proto];
			}
		}

		//Extend proto.init
		if(typeof withModel.prototype.init == 'function'){
			model.prototype.init = function(nativeInit, extenededInit, item){
				extenededInit.call(item);
				nativeInit.call(item);
			}.bind(model,model.prototype.init,withModel.prototype.init);		
		}

		return model;
	}else{
		return false;
	}
}