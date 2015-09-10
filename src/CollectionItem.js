var SubPub = require('./subpub.js');
module.exports = CollectionItem;

function CollectionItem(item, collection){
	var self = this;
	this.Item = item;
	this.Collection = collection;
	this.SubPub = item.SubPub.newGroup();
	this.SortMeta = {
		nextItem : null,
		previousItem : null,
		index : null,
		SubPub : new SubPub()
	}

	this.__defineGetter__('_nextItem', function(){
		return this.Collection[this.Collection.indexOfItem(this)+1] || null;
	});
	this.__defineGetter__('_previousItem', function(){
		return this.Collection[this.Collection.indexOfItem(this)-1] || null;
	});
	this.__defineGetter__('_index', function(){
		return this.Collection.indexOfItem(this);
	});

	this.__defineSetter__('_nextItem', function(value){
		if(this.SortMeta.nextItem != value) {
			this.SortMeta.nextItem = value;
			this.SortMeta.SubPub.publish('_nextItem', value);
		}
	});
	this.__defineSetter__('_previousItem', function(value){
		if(this.SortMeta.previousItem != value) {
			this.SortMeta.previousItem = value;
			this.SortMeta.SubPub.publish('_previousItem', value);
		}
	});
	this.__defineSetter__('_index', function(value){
		if(this.SortMeta.index != value) {
			this.SortMeta.index = value;
			this.SortMeta.SubPub.publish('_index', value);
		}
	});

	initItemKeys(this);
} 

CollectionItem.prototype.toString = function(){return "CollectionItem";}

CollectionItem.prototype.on = function(eventName, callBack) {
	this.SubPub.subscribe(eventName,callBack);
}

CollectionItem.prototype.destory = function(){
	this.SubPub.destroy();
	this.Item = undefined;
	this.SubPub = undefined;
	delete this.SubPub;
	delete this.Item;

}

function initItemKeys(collectionItem){
	var keys =  collectionItem.Item.Properties.Model.keys;
	for(var i = 0; i < keys.length;i++) {
		collectionItem.__defineGetter__(keys[i], get.bind(collectionItem, collectionItem, keys[i]));
		collectionItem.__defineSetter__(keys[i], set.bind(collectionItem, collectionItem, keys[i]));
	}
}

function get(collectionItem, key){
	return collectionItem.Item[key];
}

function set(collectionItem, key, value){
	collectionItem.Item[key] = value;
}