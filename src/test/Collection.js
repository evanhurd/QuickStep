 var assert = require("assert");

describe('Collection Tests', function(){
	var Model = require('../Model.js');
	var Collection = require('../Collection.js');
	var Book = new Model("Book", ["Title","Author"]);
	var Dog = new Model("Dog", ["Name"]);

	var dog = new Dog({Name:"Tobi"});
	var book1 = new Book({Title:'Book 1', Author:'1 Book'});
	var book2 = new Book({Title:'Book 2', Author:'2 Book'});
	var book3 = new Book({Title:'Book 3', Author:'3 Book'});
	var testData = {};
	
	it('Create New Collection', function(done){
		Books = new Collection(Book);
		done();
	});

	it('Add Correct Item to Collection', function(done){
		Books.add(book1);
		done();
	});

	it('Attempt to add incorrect Item to Collection', function(done){
		if(Books.add(dog).length == 0){
			done();
			return true;
		}
		done(new Error("Did not fail at all. Should have."));
	});

	it('Was the correct item added?', function(done){
		if(Books[0].Item.toString() == "Book"){
			done();
		}else{
			done("Incorrect item!");
		}
	});

	it('Is length of the item correct?', function(done){
		if(Books.length == 1){
			done();
		}else{
			done("Incorrect collection length! Should be 1");
		}
	});

	it('Are the item keys accessible?', function(done){
		if(Books[0].Title == "Book 1"){
			done();
		}else{
			done("The title of the book should be 'Book 1'");
		}
	});

	it('Can we set a item\'s key?', function(done){
		Books[0].Title = "Book 1.2"
		if(Books[0].Title == "Book 1.2"){
			done();
		}else{
			done("The title of the book should now be 'Book 1.2'");
		}
	});

	it("Does the '*' event fire?", function(done){
		function testEvent(event){
			Books.SubPub.unsubscribe('*', testEvent);
			if(event.type == 'Update'){
				done();
			}else{
				done(new Error("Did not recieve the expected event!"));
			}
		}
		Books.on('*', testEvent);
		Books[0].Title = "Book 1.2";
	});

	it("Does the 'Update' event fire?", function(done){
		function testEvent(event){
			Books.SubPub.unsubscribe('Update', testEvent);
			if(event.type == 'Update'){
				done();
			}else{
				done(new Error("Did not recieve the expected event!"));
			}
		}		
		Books.on('Update', testEvent);
		Books[0].Title = "Book 1.2";
	});

	it("Can we remove the item?", function(done){

		if(Books.remove(book1).length > 0){
			done();
		}else{
			done("Oops. Failed to remove item!");
		}
	});

	it("Did the length change to zero?", function(done){
		if(Books.length == 0){
			done();
		}else{
			done("Oops. The length was not zero");
		}
	});

	it("Does the 'Add' event fire?", function(done){
		function testEvent(event){
			Books.SubPub.unsubscribe('Add', testEvent);
			if(event.type == 'Add' && event.items.length == 1){
				done();
			}else{
				done(new Error("Did not recieve the expected event!"));
			}
		}
		Books.on('Add', testEvent);
		Books.add(book1);
	});

	it("Does the 'Remove' event fire?", function(done){
		function testEvent(event){
			Books.SubPub.unsubscribe('Remove', testEvent);
			if(event.type == 'Remove' && event.items.length == 1){
				done();
			}else{
				done(new Error("Did not recieve the expected event!"));
			}
		}
		Books.on('Remove', testEvent);
		Books.remove(book1);
	});

	it("Does the Filter Work:no Filter Keys", function(done){
		Books = new Collection(Book);

		book1 = new Book({Title:'Book 1', Author:'1 Book'});
		book2 = new Book({Title:'Book 2', Author:'2 Book'});
		book3 = new Book({Title:'Book 3', Author:'3 Book'});

		Books.filter(function(item){
			if(item.Title == 'Book 1'){
				return true;
			}else{
				return false;
			}
		});

		Books.add(book3);
		Books.add(book2);
		Books.add(book1);

		assert.equal(Books.length, 1, 'The length of books should be 1! Filter did not apply correctly!');
		assert.equal(Books[0].Author, '1 Book', 'Filter did not apply correctly');
		done();
	});

	it("Does the Filter Work:Filter Keys", function(done){
		Books = new Collection(Book);

		book1 = new Book({Title:'Book 1', Author:'1 Book'});
		book2 = new Book({Title:'Book 2', Author:'2 Book'});
		book3 = new Book({Title:'Book 3', Author:'3 Book'});

		Books.filter(function(item){
			if(item.Title == 'Book 1'){
				return true;
			}else{
				return false;
			}
		}, 'Book.Title');

		Books.add(book3);
		Books.add(book2);
		Books.add(book1);

		assert.equal(Books.length, 1, 'The length of books should be 1! Filter did not apply correctly!');
		assert.equal(Books[0].Author, '1 Book', 'Filter did not apply correctly');

		book1.Title = 'Book 1.1';
		assert.equal(Books.length, 0, 'The length of books should be 0! Filter did not apply correctly!');
		book2.Title = 'Book 1';
		Books.add(book2);
		assert.equal(Books.length, 1, 'The length of books should be 1! Filter did not apply correctly!');

		done();
	});

	it("CollectionOf Collection", function(done){
		Books = new Collection(Book);
		BooksOfBooks = new Collection(Books);

		book1 = new Book({Title:'Book 1', Author:'1 Book'});
		book2 = new Book({Title:'Book 2', Author:'2 Book'});
		book3 = new Book({Title:'Book 3', Author:'3 Book'});

		Books.add(book3);
		BooksOfBooks.add(book2);
		Books.add(book1);

		assert.equal(Books.length, 3, 'The length of Books should be 3!');
		assert.equal(Books.length, BooksOfBooks.length, 'The length of Books should match BooksOfBooks!');

		BooksOfBooks.remove(book3);
		BooksOfBooks.remove(book2);
		BooksOfBooks.remove(book1);

		assert.equal(Books.length, 0, 'The length of Books should be 0!');
		assert.equal(Books.length, BooksOfBooks.length, 'The length of Books should match BooksOfBooks and both be 0!');
		done();
	});

	it("CollectionOf Collection:no Filter Keys", function(done){

		book1 = new Book({Title:'Book 1', Author:'1 Book'});
		book2 = new Book({Title:'Book 2', Author:'2 Book'});
		book3 = new Book({Title:'Book 3', Author:'3 Book'});		

		BooksOfBooks.filter(function(item){
			if(item.Title == 'Book 1'){
				return true;
			}else{
				return false;
			}
		});

		Books.add(book3);
		Books.add(book2);
		Books.add(book1);
		assert.equal(BooksOfBooks.length, 1, 'The length of BooksOfBooks should be 1! Filter did not apply correctly!');
		assert.equal(BooksOfBooks[0].Author, '1 Book', 'Filter did not apply correctly');

		Books.remove(book3);
		Books.remove(book2);
		Books.remove(book1);
		assert.equal(BooksOfBooks.length, 0, 'The length of BooksOfBooks should be 0! Filter did not apply correctly!');
		done();
	});


	it("CollectionOf Collection:Filter Keys", function(done){

		BooksOfBooks.filter(function(item){
			if(item.Title == 'Book 1'){
				return true;
			}else{
				return false;
			}
		}, 'Book.Title');

		Books.add(book3);
		Books.add(book2);
		Books.add(book1);

		assert.equal(BooksOfBooks.length, 1, 'A: The length of BooksOfBooks should be 1! Filter did not apply correctly!');
		assert.equal(BooksOfBooks[0].Author, '1 Book', 'Filter did not apply correctly');

		book1.Title = 'Book 1.1';
		assert.equal(BooksOfBooks.length, 0, 'The length of BooksOfBooks should be 0! Filter did not apply correctly!');
		book2.Title = 'Book 1';
		assert.equal(BooksOfBooks.length, 1, 'B: The length of BooksOfBooks should be 1! Filter did not apply correctly!');
		assert.equal(Books.length, 3, 'The length of Books should be 3! Filter did not apply correctly!');
		done();

	});

	it("CollectionOf CrossFilter", function(done){
		var Book = new Model("Book", ["Title","Author"]);
		var Author = new Model("Author", ["Name"]);

		Books = new Collection(Book);
		Authors = new Collection(Author);

		BookAuthors = new Collection(Books).crossFilter(Authors, 'Author', 'Name');

		book1 = new Book({Title:'Book 1', Author:'1 Book'});
		book2 = new Book({Title:'Book 2', Author:'2 Book'});
		book3 = new Book({Title:'Book 3', Author:'3 Book'});
		book4 = new Book({Title:'Book 4', Author:'3 Book'});
		book5 = new Book({Title:'Book 5', Author:'3 Book'});

		book6 = new Book({Title:'Book 5', Author:'4 Book'});
		book7 = new Book({Title:'Book 5', Author:'5 Book'});

		author1 = new Author({Name:'1 Book'});
		author2 = new Author({Name:'2 Book'});
		author3 = new Author({Name:'3 Book'});
		author4 = new Author({Name:'6 Book'});

		Books.add(book3);
		Books.add(book2);
		Books.add(book1);
		Books.add(book4);
		Books.add(book5);
		Books.add(book6);
		Books.add(book7);

		Authors.add(author1);
		Authors.add(author2);
		Authors.add(author3);
		Authors.add(author4);

		assert.equal(Books.length, 7, 'A: The length of Books should be 7!');
		assert.equal(Authors.length, 4, 'A: The length of Authors should be 3!');
		assert.equal(BookAuthors.length, 5, 'A: The length of BooksOfBooks should be 5! Filter did not apply correctly!');
		done();
		
	});

});
