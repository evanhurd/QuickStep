var Element = new Model("Element",['element, hidden']);

Element.prototype.init = function(){
	this.__proto__.toString = function(){ return "qsElement"}
	this.hidden = 0;
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


QuickStep.on('qsElement',function(type,thing,target){
	var element = thing.element || document.createElement('div');
	QuickStep.apply(target,element);
	return false;
});

QuickStep.on('-qsElement',function(type,thing){
	if(thing.element.parentElement)thing.element.parentElement.removeChild(thing.element);
	return false;
});

QuickStep.on('element<qsElement',function(type,thing,target){
	var element = thing.element || document.createElement('div');
	if(target.parentElement)target.parentElement.insertBefore(element, target);
	return false;
});