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

	it("Test Model Extends: Keys", function(done){
		var A = new Model('A',['a']);
		var B = new Model('B',['b']).extends(A);

		var b = new B({a:1,b:2});
		assert(b.a == 1, "B should have inherited key `a` from A!");
		done();
	});

	it("Test Model Extends: Prototype", function(done){
		var A = new Model('A',['a']);
		var B = new Model('B',['b']);
		
		A.prototype.foo = function(){
			return this.a;
		}
		B.prototype.foobar = function(){
			return this.a + this.b;
		}

		B.extends(A);

		var a = new A({a:1});
		var b = new B({a:1,b:1});

		assert(a.foo() == 1, "a.foo() should have been 1!");
		assert(b.foo() == 1, "b.foo() should have been 1!");
		assert(b.foobar() == 2, "b.foobar() should have been 2!");
		done();
	});

	it("Test Model Init with Extends", function(done){
		var A = new Model('A',['a']);
		A.prototype.init = function(){
			this.a = 1;
		}

		var B = new Model('B',['b']);
		B.prototype.init = function(){
			this.a = this.a + 1;
			this.b = 2;
		}
		B.extends(A);

		var b = new B({a:0,b:2});
		var a = new A({a:0});

		assert(b.a == 2, "b.a should have been 2!");
		assert(b.b == 2, "b.a should have been 2!");
		done();
	});

});