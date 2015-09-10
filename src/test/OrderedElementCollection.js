var assert = require("assert");
var jsdom = require("jsdom").jsdom;
//var simulant = require("simulant");


var doc = jsdom('', {});
var window = doc.parentWindow;
var document = window.document;
GLOBAL.window = window;
GLOBAL.document = document;

describe('Ordered Element Collection', function(){
	var QuickStep = require('../QuickStep.js');
	var Model = require('../Model.js');
	var Collection = require('../Collection.js');
	var CollectionElement = require('../CollectionElement.js');

	it('Create Models and Collections', function(done){
		Book = new Model("Book", ["Title","Author", "Order"]);
		Books = new Collection(Book);
		book1 = new Book({Title:'Go Dog Go', Author:'Dr. Suesssss', Order:3});
		book2 = new Book({Title:'The Black Book of Communism', Author:'Harvard', Order:1});
		book3 = new Book({Title:'Tools of Dominion', Author:'Gray North', Order:2});
		done();
	});

	it('Create Parent Element and CollectionElement', function(done){
		parentDiv = QuickStep.div(
			{parent:document.body},
			CollectionElement(Books, function(book, value){
				return QuickStep.div(value('Order'));
			})
		);
		assert.equal(document.body.firstChild, parentDiv, 'document.body should have recieved a child!');
		done();
	});

	it('add() :: Add all books to Model', function(done){
		Books.add(book1);
		Books.add(book2);
		Books.add(book3);
		assert.equal(parentDiv.children.length, 3, 'There should be thee elements in the parentDiv');
		Books.sort(function(itemA, itemB){
			if (itemA.Order < itemB.Order) {
				return -1;
			}else if (itemA.Order > itemB.Order) {
				return 1;
			}else{
				return 0;
			}
		});
		done();
	});

	it('Check the Expected Order of the Collection POST apply sort', function(done){
		assert.equal(Books[0].Order, 1, 'The first item in the collection should have had an order value of 1!');
		assert.equal(Books[1].Order, 2, 'The second item in the collection should have had an order value of 2!');
		assert.equal(Books[2].Order, 3, 'The third item in the collection should have had an order value of 3!');
		done();
	});

	it('Match the index of each item to their know order', function(done){

		assert.equal(Books[0]._index, 0, 'The first item in the collection should have had an order value of 1!');
		assert.equal(Books[1]._index, 1, 'The second item in the collection should have had an order value of 2!');
		assert.equal(Books[2]._index, 2, 'The third item in the collection should have had an order value of 3!');
		done();
	});

	it('Remove the items', function(done){
		Books.remove(book1);
		Books.remove(book2);
		Books.remove(book3);
		assert.equal(Books.length, 0, 'All of the items should have been removed!');
		done();
	});

	it('Add and Check the Expected Order of the items PRE sort', function(done){
		Books.add(book1);
		Books.add(book2);
		Books.add(book3);
		assert.equal(Books[0].Order, 1, 'The first item in the collection should have had an order value of 1!');
		assert.equal(Books[1].Order, 2, 'The second item in the collection should have had an order value of 2!');
		assert.equal(Books[2].Order, 3, 'The third item in the collection should have had an order value of 3!');
		done();
	});

	it('Match the index of each item to their know order', function(done){

		assert.equal(Books[0]._index, 0, 'The first item in the collection should have had an order value of 1!');
		assert.equal(Books[1]._index, 1, 'The second item in the collection should have had an order value of 2!');
		assert.equal(Books[2]._index, 2, 'The third item in the collection should have had an order value of 3!');
		done();
	});

	it('Check their expected _nextItem and _previousItem', function(done){

		assert.equal(Books[0]._previousItem, null, 'Books[0]._previousItem should be null');
		assert.equal(Books[0]._nextItem, Books[1], 'Books[0]._previousItem should be book2');
		assert.equal(Books[1]._previousItem, Books[0], 'Books[0]._previousItem should be book1');
		assert.equal(Books[1]._nextItem, Books[2], 'Books[0]._previousItem should be book3');
		assert.equal(Books[2]._previousItem, Books[1], 'Books[0]._previousItem should be book2');
		assert.equal(Books[2]._nextItem, null, 'Books[0]._previousItem should be null');
		done();
	});

	it('Check the order of the DOM elements', function(done){
		assert.equal(parentDiv.children[0].innerHTML, 1, 'The first element should have the html of "1" Instead, it had '+parentDiv.children[0].innerHTML);
		assert.equal(parentDiv.children[1].innerHTML, 2, 'The first element should have the html of "2" Instead, it had '+parentDiv.children[1].innerHTML);
		assert.equal(parentDiv.children[2].innerHTML, 3, 'The first element should have the html of "3" Instead, it had '+parentDiv.children[2].innerHTML);
		done();
	});

	it('Reverse the order and Check the order of the DOM elements', function(done){
		Books.sort(function(itemA, itemB){
			if (itemA.Order < itemB.Order) {
				return 1;
			}else if (itemA.Order > itemB.Order) {
				return 0;
			}else{
				return 0;
			}
		});
		assert.equal(parentDiv.children[0].innerHTML, 3, 'The first element should have the html of "3" Instead, it had '+parentDiv.children[0].innerHTML);
		assert.equal(parentDiv.children[1].innerHTML, 2, 'The first element should have the html of "2" Instead, it had '+parentDiv.children[1].innerHTML);
		assert.equal(parentDiv.children[2].innerHTML, 1, 'The first element should have the html of "1" Instead, it had '+parentDiv.children[2].innerHTML);
		done();
	});

});