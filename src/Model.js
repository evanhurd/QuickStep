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
	}

	Item.keys = keys;
	Item.prototype.Settings = settings || {};
	Item.modelName= name;
	Item.prototype.toString = function() {return this.Properties.Model.modelName;};
	Item.prototype.event = function(eventProperties){
		fireEvent(this, new ItemEvent(this, eventProperties));
	};
	Item.prototype.on = on;
	Item.SubPub = new SubPub();
	Item.on = on;

	Item.__proto__.toString = function(){return "Model";}

	return Item.bind({},Item);
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
