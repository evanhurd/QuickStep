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



});
