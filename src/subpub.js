module.exports = SubPub; 
var subpubId = 0;
function SubPub(){
	this.events = {};
	this.groups = [[]];
	subpubId++;
	this.id = subpubId;
	this.newGroup = function() {
		this.groups.push([]);
		return {
			  subscribe : subscribe.bind(this, this, this.groups.length-1)
			, publish : publish.bind(this, this)
			, unsubscribe : unsubscribe.bind(this, this, this.groups.length-1)
			, destroy : destroy.bind(this, this, this.groups.length -1)
		};
	};

	this.subscribe = subscribe.bind(this, this, 0);
	this.publish = publish.bind(this, this);
	this.unsubscribe = unsubscribe.bind(this, this, 0);
	this.destroy = destroy.bind(this, this, 0);
	return this;
}

function subscribe(subpub, eventGroup, eventName, callBack) {
	if(subpub.events[eventName] == undefined) subpub.events[eventName] = [];
	if(subpub.events[eventName].indexOf(callBack) > -1) return false;
	subpub.events[eventName].push(callBack);
	subpub.groups[eventGroup].push(callBack);
}

function publish(subpub, eventName, eventObject) {
	if(subpub.events[eventName] != undefined && subpub.events[eventName].length > 0) {
		var events = subpub.events[eventName];
		for(var i = 0; i < events.length; i++) {
			events[i](eventObject);
		}
	}
}

function unsubscribe(subpub, eventGroup, eventName, callBack) {
	if(subpub.groups[eventGroup] != undefined && subpub.groups[eventGroup].length > 0) {
		subpub.groups[eventGroup].splice(subpub.groups[eventGroup].indexOf(callBack),1);
	}

	if(subpub.events[eventName] != undefined && subpub.events[eventName].length > 0) {
		subpub.events[eventName].splice(subpub.events[eventName].indexOf(callBack),1);
	}
}

function destroy(subpub, eventGroup) {
	if(subpub.groups[eventGroup]) {
		var group = subpub.groups[eventGroup];
		for(var i = 0; i < group.length; i++) {
			for(event in subpub.events) {
				var ci = subpub.events[event].indexOf(group[i]);
				if(ci > -1) {
					subpub.events[event].splice(ci, 1);
				}
			}
		}
		subpub.groups[eventGroup] = null;
	}
}