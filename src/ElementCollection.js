module.exports = ElementCollection;
var QuickStep = require('./QuickStep.js');

/*
var listA = document.createElement('div');document.body.appendChild(listA);
var listB = document.createElement('div');document.body.appendChild(listB);
var element1 = document.createElement('div');element1.innerHTML = '1';
var element2 = document.createElement('div');element2.innerHTML = '2';
var element3 = document.createElement('div');element3.innerHTML = '3';

var ec = new ElementCollection();
ec.insert(listA);
//ec.pushin();
ec.appendChild(element1);
ec.appendChild(element2);
ec.appendChild(element3);
//ec.pullout();
ec.remove();
ec.insert(listB);
*/

function ElementCollection(){
	this.inState = 0;
	this.placeHolder = document.createComment('ElementCollection');
	this.children = [];
	this.firstChild = null;
	this.lastChild = null;
	this.parentElement = null;
	return this;
}


ElementCollection.prototype.pushin = function(){
	this.inState = 1;
	this.reInsertNodes();
}


ElementCollection.prototype.pullout = function(){
	this.inState = 0;
	for(var i = this.children.length-1; i >= 0; i--){
		if(this.children[i].parentElement) {
			QuickStep.remove(this.children[i]);
			//this.children[i].parentElement.removeChild(this.children[i]);
		}
	}			
}

ElementCollection.prototype.reInsertNodes = function(){
	if(this.parentElement && this.inState == 1){
		var beforeNode = this.placeHolder;
		for(var i = this.children.length-1; i >= 0; i--){
			if(this.children[i].parentElement) {
				QuickStep.remove(this.children[i]);
				//this.children[i].remove();
			}
			QuickStep.insertBefore(this.children[i], beforeNode);
			//this.parentElement.insertBefore(this.children[i], beforeNode);
			beforeNode = this.children[i];
		}		
	}
	return this;
}

ElementCollection.prototype.remove = function(){
	if( this.inState == 1) {
		this.pullout();	
	}

	if(this.placeHolder.parentElement)this.placeHolder.parentElement.removeChild(this.placeHolder);
	this.parentElement = null;		
	return this;
}

ElementCollection.prototype.insert = function(parentElement, beforeElement){
	var beforeElement = arguments[1] || false;
	if(this.placeHolder.parentElement)this.placeHolder.parentElement.removeChild(this.placeHolder);
	this.parentElement = parentElement;

	if(beforeElement) {
		parentElement.insertBefore(this.placeHolder, beforeElement);
	}else{
		parentElement.appendChild(this.placeHolder);
	}

	if( this.inState == 0) {
		this.pushin();
	}

	return this;
}


ElementCollection.prototype.appendChild = function(element){
	if(!element.parentElement) {
		this.children.push(element);
		if(this.inState == 1){
			QuickStep.insertBefore(element,this.placeHolder);
			//this.parentElement.insertBefore(element,this.placeHolder);
		}		
	}
}

ElementCollection.prototype.removeChild = function(element){
	var foundIndex = this.children.indexOf(element);
	if(foundIndex >= 0) {
		this.children.splice(foundIndex,1);
		QuickStep.remove(element);
	}
}

ElementCollection.prototype.insertBefore = function(element, existingChild){
	var foundIndex = this.children.indexOf(existingChild);
	if(foundIndex >= 0 && !element.parentElement) {
		this.children.splice(foundIndex,0,element);
		if(this.inState == 1) {

			if(existingChild.parentElement == this.parentElement){
				QuickStep.insertBefore(element,existingChild);
				//this.parentElement.insertBefore(element, existingChild);	
			}else{
				QuickStep.insertBefore(element,this.placeHolder);
				//this.parentElement.insertBefore(element, this.placeHolder);
			}
		}
	}
}

function getType(element){
	if(element.ELEMENT_NODE == 1){
		return 'Element';
	}else if(element.toString == "ElementCollection"){
		return "ElementCollection";
	}else{
		return "Other";
	}
}

function getFirstOrElement(element){
	if(element.children.length ==0 ) return null;
	if(getType(element) == 'ElementCollection') {
		return getFirstOrElement(element.children[0]);
	}else{
		return element.children[0];
	}
}

function getLastOrElement(element){
	if(element.children.length ==0 ) return null;
	if(getType(element) == 'ElementCollection') {
		return getLastOrElement(element.children.length-1);
	}else{
		return this.children[element.children.length-1];
	}
}


ElementCollection.prototype.toString = function(){return "ElementCollection"};

QuickStep.on('ElementCollection',function(type,thing,target){
	thing.insert(target);
	return false;
});