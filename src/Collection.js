/*
Classes
| Name              | Description                               | Type                | File     |
| Model             | Core Key/Value pair Model                 | QSModel             |          |
| Collection        | A Collection of Models                    | QSCollection        |          |
| OrderedCollection | A ordered/filtered subset of a Collection | QSOrderedCollection |          |
| ElementGroup      | A Group of Elements                       | QSElementGroup      |          |
| Element           | Any DOM element or QSElement              | -----------         |          |
| QSElement         | A sepial QSElement                        | QSElement           |          |
| ItemEvent         | A event object for changes to an item     | ItemEvent           | Model.js |
|                   |                                           |                     |          |
*/

var SubPub = require('./subpub.js');
var CollectionItem = require('./CollectionItem.js');
module.exports = Collection;

function Collection(){
	failInvalidModels(arguments);

	var self = this;
	this.allowedModels = arguments.length > 0 ? arguments : [];
	this.items = [];
	this.SubPub = new SubPub();
	this.__defineGetter__('length', function(){return this.items.length});
	this.sortFunction = null;
}

Collection.prototype.on = function(eventName, callBack) {
	this.SubPub.subscribe(eventName,callBack);
}

Collection.prototype.add = function(){
	var added = [];
	for(var i = 0; i < arguments.length;i++){
		var newItem = this.__addSingleItem(arguments[i]);
		if(newItem) added.push(newItem);
	}
	applySortMetaData(this);
	if(added.length > 0) this.event({type:'Add',items:added});
	return added;
}

Collection.prototype.event = function(eventProperties) {
	fireEvent(this, new CollectionEvent(this, eventProperties));
}

Collection.prototype.remove = function(){
	var removed = [];
	for(var i = 0; i < arguments.length;i++){
		var removedItem = this.__removeSingleItem(arguments[i]);
		if(removedItem) removed.push(removedItem);
	}
	applySortMetaData(this);
	if(removed.length > 0) this.event({type:'Remove',items:removed});
	return removed;
}

Collection.prototype.toString = function(){return "Collection";}

Collection.prototype.__addSingleItem = function(item){
	if(item.toString() == "CollectionItem"){
		item = item.Item;
	}
	if(this.isValidItem(item) == false) return false;
	var collectionItem = new CollectionItem(item, this);
	addGetterIndex(this);
	if(typeof this.sortFunction == 'function'){
		var insertIndex = findInsertIndex(this, item, this.sortFunction);
		this.items.splice(insertIndex,0,collectionItem);
	}else{
		this.items.push(collectionItem);
	}
	collectionItem.on("*", fireItemChangeEvent.bind(this, this, collectionItem));
	return collectionItem;
}

Collection.prototype.__removeSingleItem = function(item){
	var index = this.indexOfItem(item);
	if(index > -1){
		var collectionItem = this.items[index];
		this.items[index].destory();
		removeGetterIndex(this);
		this.items.splice(index,1);
		return collectionItem;
	}else{
		return false
	}
}

Collection.prototype.sort = function(sortFunction){
	this.sortFunction = sortFunction;
	this.items.sort(sortFunction);
	applySortMetaData(this);
	setTimeout(function(){
		this.event({type:'Sort',items:[]});
	}.bind(this), 10);
	return this;
}

Collection.prototype.indexOfItem = function(item){
	if(item.toString() == "CollectionItem"){
		return this.items.indexOf(item);
	}else{
		
		for(var i = 0; i < this.items.length; i++){
			if(this.items[i].Item == item){
				return i;
			}
		}
		return -1;
	}	
}

Collection.prototype.isValidItem = function(item){
	if(item.toString() == "CollectionItem"){
		item = item.Item;
	}
	if(this.allowedModels.length == 0) return true;

	for(var i = 0; i < this.allowedModels.length;i++){
		if(item instanceof this.allowedModels[i]) return true;
	}
	return false;
}


function failInvalidModels(models){
	for(var i = 0; i < models.length;i++) {
		if(models[i].toString() != "Model"){
			throw models[i].toString() + " is not a valid Model!";
		}
	}
}

function fireItemChangeEvent(collection, collectionItem, event){
	var item = collectionItem.Item;
	collection.SubPub.publish("*", event);
	collection.SubPub.publish(event.type, event);
	collection.SubPub.publish(event.type + ":" + item.toString(), event);
	collection.SubPub.publish(event.type + ":" + item.toString() + "." + event.key, event);
	collection.SubPub.publish(item.toString(), event);
	collection.SubPub.publish(item.toString() + "." + event.key, event);
}

function CollectionEvent(collection, properties) {
	var event = {
		  collection : collection
		, items : properties.items
		, type : properties.type || "Uknown"
	}
	return event;
}

function fireEvent(collection, event) {
	collection.SubPub.publish("*", event);
	collection.SubPub.publish(event.type, event);
}

function addGetterIndex(collection){
	collection.__defineGetter__(collection.items.length, indexGetter.bind(collection, collection,  collection.items.length));
	collection.__defineSetter__(collection.items.length, indexSetter.bind(collection, collection,  collection.items.length));
}

function removeGetterIndex(collection){
	if(collection.items.length > 0) {
		delete collection[collection.items.length-1];
	}
	
}

function indexGetter(collection, index){
	return collection.items[index];
}

function indexSetter(collection, index){
	return false;
}

function findInsertIndex(collection, item, sortFunction) {
	var len = collection.length;
	for(var i = 0; i < len; i++){
		var sortValue = sortFunction(item, collection.items[i]);
		if(sortValue == -1){ //a < b
			return i;
		}else if(sortValue == 1) { // a > b
			continue;
		}else{ //a == b
			return i+1;
		}
	}
	return len;
}

function applySortMetaData(collection){
	for(var i = collection.items.length - 1; i >= 0; i--) {
		collection.items[i]._previousItem = collection.items[i-1] || null;
		collection.items[i]._nextItem = collection.items[i+1] || null;
		collection.items[i]._index = i;
	}
}