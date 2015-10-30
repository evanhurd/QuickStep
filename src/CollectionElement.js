module.exports = CollectionElement;
var ElementCollection = require('./ElementCollection.js');
var ModelValue = require('./ModelValue.js');

function CollectionElement(collection, func){
	var ec = new ElementCollection();
	ec.collection = collection;
	ec.itemFunction = func;
	ec.SubPub = collection.SubPub.newGroup();
	ec.knownItems = [];

	ec.SubPub.subscribe('Add', onAddItems.bind(ec, ec));
	ec.SubPub.subscribe('Remove', onRemoveItems.bind(ec, ec));


	setTimeout(function(ec){
		if(ec.collection.length > 0) {
			//iniExistingItems(ec);
		}

	}.bind(null, ec),10);


	return ec;
}

function onAddItems(collectionElement, event){
	for(var i = 0; i < event.items.length; i++) {
		addItem(collectionElement, event.items[i]);
	}
}

function onRemoveItems(collectionElement, event){
	for(var i = 0; i < event.items.length; i++) {
		removeItem(collectionElement, event.items[i]);
	}
}

function iniExistingItems(collectionElement){
	for(var i = 0; i < collectionElement.collection.length; i++){
		addItem(collectionElement, collectionElement.collection[i]);
	}
}

function addItem(collectionElement, item){
	var newElement = new collectionElement.itemFunction(item, new ModelValue(item));
	var foundIndex = getIndexOfNextKnowItem(item, collectionElement);
	if(foundIndex == null) {
		collectionElement.appendChild(newElement);
		//console.log(1, newElement, collectionElement);
	}else{
		var nextSibling = collectionElement.children[foundIndex];
		collectionElement.insertBefore(newElement,nextSibling);
		//console.log(2, newElement);
	}
	newElement.__collectionElementItem = item;
	
	item.SortMeta.SubPub.subscribe('_index', onIndexChange.bind(item,item, newElement, collectionElement));
}

function onIndexChange(item, element, collectionElement){
	var nextItemIndex = getIndexOfNextKnowItem(item, collectionElement);
	if(nextItemIndex >= 0 && nextItemIndex != null){
		var nextSibling = collectionElement.children[nextItemIndex];
		collectionElement.removeChild(element);
		collectionElement.insertBefore(element, nextSibling);
	}else{
		//collectionElement.removeChild(element);
		//collectionElement.appendChild(element);
	}
}

function removeItem(collectionElement, item){
	for(var i = 0; i < collectionElement.children.length; i++) {
		if(collectionElement.children[i].__collectionElementItem == item) {
			collectionElement.removeChild(collectionElement.children[i]);
		}
	}
}

function getIndexOfNextKnowItem(item, elementCollection){
	var nextItem = item._nextItem;
	while(nextItem){
		for(var i = 0; i < elementCollection.children.length; i++) {
			if(elementCollection.children[i].__collectionElementItem == nextItem) {
				return i;
			}
		}
		nextItem = nextItem._nextItem;
	}
	return null;
}

function getCurrentIndexOfItemElement(item, elementCollection){
	for(var i = 0; i < elementCollection.children.length; i++) {
		if(elementCollection.children[i].__collectionElementItem == nextItem) {
			return i;
		}
	}
	return false;
}
