module.export = SortedCollection;

function SortedCollection(collection, options) {
	this.children = [];
	this.options = options;
	this.childrenElements = [];
	this.collection = collection;
	this.colectionSubPub = collection.SubPub.newGroup();
	
	this.add = function() {
		var items = [];
		for(var i = 0; i < arguments.length;i++){
			items.push(arguments[i]);
		}

		this.collection.add.apply(this.collection, items);
	};
	this.remove = function() {
		var items = [];
		for(var i = 0; i < arguments.length;i++){
			items.push(arguments[i]);
		}

		this.collection.remove.apply(this.collection, items);
	};

	this.on = function(event, func) {
		this.colectionSubPub.subscribe(event, func);
	}

	this.colectionSubPub.subscribe('Add', function(event){
		
	}.bind(this));

	this.colectionSubPub.subscribe('Remove', function(event){
		
	}.bind(this));

}

SortedCollection.prototype.indexOfItem = function(item){
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

function refresh(sortedCollection){
	
}

function filterAndAddItem(sortedCollection, item){
	if(sortedCollection.indexOfItem(item))
}
