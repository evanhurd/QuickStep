var assert = require("assert");
var jsdom = require("jsdom").jsdom;


var doc = jsdom('', {});
var window = doc.parentWindow;
var document = window.document;
var parent = document.createElement('div');
GLOBAL.window = window;
GLOBAL.document = document;

document.body.appendChild(parent);


describe('ElementCollection Tests', function(){
	var ElementCollection = require('../ElementCollection.js');

	var listA = document.createElement('div');document.body.appendChild(listA);
	var listB = document.createElement('div');document.body.appendChild(listB);
	var listC = document.createElement('div');document.body.appendChild(listC);
	var listCBeforeElement = document.createElement('div');listC.appendChild(listCBeforeElement);
	var element1 = document.createElement('div');element1.innerHTML = '1';
	var element2 = document.createElement('div');element2.innerHTML = '2';
	var element3 = document.createElement('div');element3.innerHTML = '3';

	it('new ElementCollection() :: Create New ElementCollection', function(done){
		ec = new ElementCollection();
		done();
	});

	it('insert() :: Insert ElementCollection Into Element ListA', function(done){
		ec.insert(listA);
		assert.equal(ec.parentElement, listA, 'Parent Element should be listA!!!!');
		assert.equal(listA.childNodes[0], ec.placeHolder, 'Hmmm?? The ElementCollection\'s placeholder is not present!');
		done();
	});

	it('appendChild() :: Insert element1 into ElementCollection', function(done){
		ec.appendChild(element1);
		assert.equal(ec.children[0], element1, 'element1 should be the new first child of the ElementCollection!');
		done();
	});

	it('insertBefore() :: Insert element2 before element1', function(done){
		ec.insertBefore(element2, element1);
		assert.equal(ec.children[0], element2, 'element2 should be the new first child of the ElementCollection!');
		assert.equal(ec.children[1], element1, 'element1 should be the second child of the ElementCollection!');
		assert.equal(listA.children[0], element2, 'element2 should be the new first child of listA!');
		assert.equal(listA.children[1], element1, 'element1 should be the second child of listA!');
		done();
	});

	it('appendChild() :: Insert element3 into ElementCollection', function(done){
		ec.appendChild(element3);
		assert.equal(ec.children[2], element3, 'element3 should be the third child of the ElementCollection!');
		done();
	});

	it('pullout() :: Pull the ElementCollection out of ListA', function(done){
		ec.pullout();
		assert.equal(listA.childNodes.length, 1, 'There should only be one element in ListA');
		done();
	});

	it('remove() :: Remove ElementCollection', function(done){
		ec.remove();
		assert.notEqual(ec.parentElement, listA, 'Parent Element should nolonger be listA!!!!');
		assert.equal(ec.parentElement, null, 'Parent Element be null');
		assert.notEqual(listA.childNodes[0], ec.placeHolder, 'Hmmm?? The ElementCollection\'s placeholder should not be present!');
		done();
	});

	it('insert() :: Insert ElementCollection Into Element ListB', function(done){
		ec.insert(listB);
		assert.equal(ec.parentElement, listB, 'Parent Element should be listA!!!!');
		done();
	});

	it('Verify Order Integredy of elements in ListB', function(done){
		assert.equal(listB.children[0], element2, 'ListB\s element 1 is not element2, like it should be!');
		assert.equal(listB.children[1], element1, 'ListB\s element 2 is not element2, like it should be!');
		assert.equal(listB.children[2], element3, 'ListB\s element 3 is not element2, like it should be!');
		done();
	});

	it('insert(parent, beforeElement) :: Insert ElementCollection Into Element ListC BEFORE an existing element!', function(done){
		ec.pullout();
		ec.remove();
		ec.insert(listC, listCBeforeElement);
		assert.equal(listC.lastChild, listCBeforeElement, 'ListC\'s last child was not the existing element!');
		done();
	});

	it('Verify Order Integredy of elements in ListB, again!', function(done){
		assert.equal(listC.children[0], element2, 'ListC\s element 1 is not element2, like it should be!');
		assert.equal(listC.children[1], element1, 'ListC\s element 2 is not element2, like it should be!');
		assert.equal(listC.children[2], element3, 'ListC\s element 3 is not element2, like it should be!');
		done();
	});

	it('Verify ListC\'s innerHTML', function(done){
		var html = "<div>2</div><div>1</div><div>3</div><!--ElementCollection--><div></div>";
		assert.equal(listC.innerHTML, html, 'Maybe the test has changed????');
		done();

		window.close();
	});

});
