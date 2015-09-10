var assert = require("assert");
var jsdom = require("jsdom").jsdom;
//var simulant = require("simulant");


var doc = jsdom('', {});
var window = doc.parentWindow;
var document = window.document;
GLOBAL.window = window;
GLOBAL.document = document;

describe('Working Test: Model changes to Element', function(){
	var QuickStep = require('../QuickStep.js');
	var Model = require('../Model.js');
	var Collection = require('../Collection.js');
	var CollectionElement = require('../CollectionElement.js');

	it('Create Models and Collections', function(done){
		Book = new Model("Book", ["Title","Author"]);
		Books = new Collection(Book);
		book1 = new Book({Title:'Go Dog Go', Author:'Dr. Suesssss'});
		book2 = new Book({Title:'The Black Book of Communism', Author:'Harvard'});
		book3 = new Book({Title:'Tools of Dominion', Author:'Gray North'});
		done();
	});

	it('Create Parent Element and CollectionElement', function(done){
		parentDiv = QuickStep.div(
			{parent:document.body},
			CollectionElement(Books, function(book, value){
				return QuickStep.div(value('Title'), ' - ', value('Author'));
			})
		);
		assert.equal(document.body.firstChild, parentDiv, 'document.body should have recieved a child!');
		done();
	});

	it('add() :: Add a book to the Collection', function(done){
		Books.add(book1);
		assert.equal(parentDiv.children.length, 1, 'There should be one new element in the parentDiv');
		var expectedValue = book1.Title + ' - ' + book1.Author;
		assert.equal(parentDiv.children[0].innerHTML,expectedValue , 'The new element\'s innerHTML was not "'+expectedValue+'"');
		done();
	});

	it('Change the title of book1', function(done){
		book1.title = 'Suess';
		var expectedValue = book1.Title + ' - ' + book1.Author;
		assert.equal(parentDiv.children[0].innerHTML,expectedValue , 'The new element\'s innerHTML was not "'+expectedValue+'"');
		done();
	});

	it('add() :: Add the other two books', function(done){
		Books.add(book2, book3);
		assert.equal(parentDiv.children.length, 3, 'There should 3 children in parentDiv');
		done();
	});

	it('Change the title of book3', function(done){
		var expectedValue1 = book1.Title + ' - ' + book1.Author;
		var expectedValue2 = book2.Title + ' - ' + book2.Author;
		book3.title = 'Gary North & Klein(HA HA HA HA)';
		var expectedValue = book3.Title + ' - ' + book3.Author;
		assert.equal(parentDiv.children[2].innerHTML,expectedValue , 'The third element\'s innerHTML was not "'+expectedValue+'"');
		assert.equal(parentDiv.children[0].innerHTML,expectedValue1 , 'The first element\'s innerHTML should not have changed!');
		assert.equal(parentDiv.children[1].innerHTML,expectedValue2 , 'The second element\'s innerHTML should not have changed!');
		done();
	});

	it('remove() :: Remove Book 2', function(done){
		Books.remove(book2);
		assert.equal(parentDiv.children.length, 2, 'There should only be 2 children now?');
		var expectedValue = book3.Title + ' - ' + book3.Author;
		assert.equal(parentDiv.children[1].innerHTML,expectedValue , 'The second element\'s innerHTML should be book 3!');
		done();
		window.close();
	});

});