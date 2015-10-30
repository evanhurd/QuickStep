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
	//this.metaKeys = [];
	this.SubPub = new SubPub();
	this.__defineGetter__('length', function(){return this.items.length});
	this.sortFunction = null;
	this.subCollectionOf = null;
	this.filterFunction = null;
	this.filterFunctionKeys = null;

	if(this.allowedModels[0] && this.allowedModels[0].toString() == 'Collection'){
		this.subCollectionOf = this.allowedModels[0];
		this.allowedModels = this.allowedModels[0].allowedModels;
		initCollectionOf(this);
	}
}

Collection.prototype.on = function(eventName, callBack) {
	this.SubPub.subscribe(eventName,callBack);
}

Collection.prototype.add = function(){
	var arg = arguments[0] && arguments[0].toString() == '[object Arguments]' ? arguments[0] : arguments;
	setTimeout(function(arg){
		if(this.subCollectionOf) {
			return this.subCollectionOf.add.call(this.subCollectionOf, arguments);
		}

		var added = [];
		for(var i = 0; i < arg.length;i++){
			var newItem = this.__addSingleItem(arg[i]);
			if(newItem) added.push(newItem);
		}

		applySortMetaData(this);
		if(added.length > 0) this.event({type:'Add',items:added});
		return added;
	}.bind(this, arg,0));
}

Collection.prototype.event = function(eventProperties) {
	fireEvent(this, new CollectionEvent(this, eventProperties));
}

Collection.prototype.remove = function(){
	var arg = arguments[0] && arguments[0].toString() == '[object Arguments]' ? arguments[0] : arguments;

	if(this.subCollectionOf) {
		return this.subCollectionOf.remove.call(this.subCollectionOf, arguments);
	}

	var removed = [];
	for(var i = 0; i < arg.length;i++){
		var removedItem = this.__removeSingleItem(arg[i]);
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
	if(this.filterFunction && this.filterFunction(item) == false) return false;
	if(this.isValidItem(item) == false) return false;

	if(this.indexOfItem(item) > -1){
		return false
	}

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
		return item;
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

Collection.prototype.filter = function(filterFunction){
	this.filterFunction = filterFunction;
	for(var i = 1; i < arguments.length;i++){
		bindFilterKey(this, arguments[i]);
	}
	return this;
}

Collection.prototype.applyFilter = function(){

}

Collection.prototype.indexOfItem = function(item){
	if(item.toString() == "CollectionItem"){
		var item = item.Item;
	}

	for(var i = 0; i < this.items.length; i++){
		if(this.items[i].Item == item){
			return i;
		}
	}
	return -1;	
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

Collection.prototype.crossFilter = function(adjacentCollection,key, adjacentKey){
	new crossFilterCollection(this, key, adjacentCollection, adjacentKey);
	return this;
}

/*Collection.prototype.withKeys = function(){
	for(var i = 0; i < arguments.length;i++){
		this.metaKeys.push(arguments[i]);
	}
	return this;
}*/



function failInvalidModels(models){
	for(var i = 0; i < models.length;i++) {
		if(models[i] && models[i].toString() != "Model" && models[i].toString() != "Collection"){
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

function initCollectionOf(collection){

	collection.subCollectionOf.on('Add', function(collection, event){
		for(var i = 0; i < event.items.length; i++){
			if(collectionItem = collection.__addSingleItem(event.items[i])){
				collection.event({type:'Add',items:[collectionItem]});	
			}
		}
		if(event.items.length > 0){
			applySortMetaData(collection);
		}
	}.bind(collection,collection));

	collection.subCollectionOf.on('Remove', function(collection, event){
		for(var i = 0; i < event.items.length; i++){

			if( collection.__removeSingleItem(event.items[i])){
				collection.event({type:'Remove',items:[event.items[i]]});
			}
		}
		if(event.items.length > 0){
			applySortMetaData(collection);
		}
	}.bind(collection,collection));

	if(collection.subCollectionOf.length > 0){
		for(var i = 0; i < collection.subCollectionOf.length; i++){
			var item = collection.subCollectionOf[i].Item;
			if(collectionItem = collection.__addSingleItem(item)){
				collection.event({type:'Add',items:[collectionItem]});
			}
		}
	}
}

function bindFilterKey(collection, filterKey){
	if(!collection.filterFunction) return false;
	var subpub = collection.subCollectionOf ? collection.subCollectionOf.SubPub : collection.SubPub;

	subpub.subscribe(filterKey, function(collection, event){
		if(event.type == 'Update' && event.item){
			var index = collection.indexOfItem(event.item);
			if(collection.filterFunction(event.item) == true){
				if(index < 0){
					if( collectionItem = collection.__addSingleItem(event.item) ){
						collection.event({type:'Add',items:[collectionItem]});
					}
				}
			}else{
				if(index >= 0){
					if( collectionItem = collection.__removeSingleItem(event.item) ){
						collection.event({type:'Remove',items:[collectionItem]});	
					}
				}
			}
		}
	}.bind(collection, collection));
}

function crossFilterCollection(collection, key, adjacentCollection, adjacentKey){
	this.collection = collection;
	this.key = key;
	this.adjacentCollection = adjacentCollection;
	this.adjacentKey = adjacentKey;
	this.adjacentModel = adjacentCollection.allowedModels[0];
	this.model = collection.allowedModels[0];
	this.majorCollection = collection.subCollectionOf;

	this.keymap = {};
	this.keymap[adjacentKey] = {};
	this.keymap[key] = {};

	if(!this.majorCollection){
		throw new Error('The Collection needs to be initilized as a Sub Collection!');
	}
	if(!this.adjacentModel || !this.model){
		throw new Error('crossFilter Collections require given Models!');
	}


	this.adjacentCollection.on('Add', function(event){
		for(var i = 0; i < event.items.length;i++){
			moveItemsWhere(this.majorCollection, this.collection, this.key, event.items[i][this.adjacentKey]);
			//locateAndAdd(this.majorCollection, this.collection, this.key, event.items[i], this.adjacentKey, this.adjacentCollection);
		}
	}.bind(this));

	this.adjacentCollection.on('Remove', function(event){
		for(var i = 0; i < event.items.length;i++){
			locateAndRemove(this.majorCollection, this.collection, this.key, event.items[i], this.adjacentKey, this.adjacentCollection);
		}
	}.bind(this));

	this.collection.filter(function(item){
		if(findInCollection(this.adjacentCollection, this.adjacentKey, item[this.key])){
			return true;
		}else{
			return false;
		}
	}.bind(this),this.model.toString() + '.'+this.key);

	function locateAndRemove(collection, targetCollection, key, item, itemKey, adjacentCollection){
		if(findInCollection(adjacentCollection, itemKey, item[itemKey])) return true;

		var foundItem = findInCollection(collection, key, item[itemKey]);
		if(foundItem && collection.indexOfItem(foundItem) > -1){
			if(targetCollection.__removeSingleItem(foundItem)){
				targetCollection.event({type:'Remove',items:[foundItem.Item || foundItem]});
			}
		}
	}

}


function findInCollection(collection, key, value){
	for(var i = 0; i < collection.length; i++){
		if(collection[i][key] == value){
			return collection[i];
		}
	}
	return false;
}

function addToKeyMap(keymap, key, item ){
	if(!keymap[key][item[key]]) {
		keymap[key][item[key]] = item;
	}
}

function getItemFromKeyMap(keymap, key, value ){
	return keymap[key][value];
}

function moveItemsWhere(fromCollection, toCollection, key, value){
	for(var i = 0 ; i < fromCollection.length; i++){
		if(fromCollection[i][key] == value){
			var item = fromCollection[i];
			if(toCollection.__addSingleItem(item)){
				toCollection.event({type:'Remove',items:[item.Item || item]});
			}
		}
	}
}