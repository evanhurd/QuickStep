 var assert = require("assert");

describe('Model Tests', function(){
	var Model = require('../Model.js');
	var testData = {};
	
	it('Create a new Book Model', function(done){
		Book = new Model("Book", ["Title","Author"]);
		done();
	});

	it('Create a new book item from the Book Model', function(done){
		book = new Book({Title:'Test', Author:'Test'});
		done();
	});

	it('Set book title and Author', function(done){
		book.Title = "Green Eggs and Ham";
		book.Author = "";
		done();
	});

	it('Get book title', function(done){
		assert(book.Title == "Green Eggs and Ham", "Title should be \"Green Eggs and Ham\"");
		assert(book.Author == "", "Author should be an empty string");
		done();
	});

	it("Test the Setter and the 'Update' Events", function(done){
		var  testEvent = function (event){
			book.SubPub.unsubscribe('Update', testEvent);
			done(assert(event.key == "Author" && event.value  == "Dr. Seuss1", "Opps, 'Update' event failed. Author should be \"Dr. Seuss1\""));
			
		}
		book.on('Update', testEvent);
		book.Author = "Dr. Seuss1";
	});

	it("Test the Setter and the key 'Author' Events", function(done){
		var testEventA = function(event){
			book.SubPub.unsubscribe('Author', testEventA);
			done(assert(event.key == "Author" && event.value  == "Dr. Seuss2", "Opps, 'Author' event failed. Author should be \"Dr. Seuss2\""));
		}
		book.on('Author', testEventA);
		book.Author = "Dr. Seuss2";
	});

	it("Test the Global Model's 'Update' Events", function(done){
		var shouldBe = "Dr. Seuss3"
		var testEvent = function(event){
			book.Properties.Model.SubPub.unsubscribe('Update', testEvent);
			done(assert(event.key == "Author" && event.value  == shouldBe, "Opps, 'Update' event failed. Author should be \""+shouldBe+"\""));
		}
		book.Properties.Model.on('Update', testEvent);
		book.Author = shouldBe;
	});

	it("Test the Global Model's 'Update:Book' Events", function(done){
		var shouldBe = "Dr. Seuss4"
		var testEvent = function(event){
			book.Properties.Model.SubPub.unsubscribe('Update:Book', testEvent);
			done(assert(event.key == "Author" && event.value  == shouldBe, "Opps, 'Update:Book.Author' event failed. Author should be \""+shouldBe+"\""));
		}
		book.Properties.Model.on('Update:Book', testEvent);
		book.Author = shouldBe;
	});

	it("Test the Global Model's 'Update:Book.Author' Events", function(done){
		var shouldBe = "Dr. Seuss5"
		var testEvent = function(event){
			book.Properties.Model.SubPub.unsubscribe('Update:Book.Author', testEvent);
			done(assert(event.key == "Author" && event.value  == shouldBe, "Opps, 'Update:Book.Author' event failed. Author should be \""+shouldBe+"\""));
		}
		book.Properties.Model.on('Update:Book.Author', testEvent);
		book.Author = shouldBe;
	});

});