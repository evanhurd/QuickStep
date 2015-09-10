var QuickStep = require('./QuickStep.js');
var Model = require('./Model.js');
var Collection = require('./Collection.js');
var CollectionElement = require('./CollectionElement.js');


Book = new Model("Book", ["Title","Author", "Order"]);
Books = new Collection(Book);
book1 = new Book({Title:'Go Dog Go', Author:'Dr. Suesssss', Order:3});
book2 = new Book({Title:'The Black Book of Communism', Author:'Harvard', Order:1});
book3 = new Book({Title:'Tools of Dominion', Author:'Gary North', Order:2});

Books.sort(function(itemA, itemB){
	var key = 'Title';
	if (itemA[key] < itemB[key]) {
		return 1;
	}else if (itemA[key] > itemB[key]) {
		return -1;
	}else{
		return 0;
	}
});

window.Book = Book;
window.Books = Books;
window.book1 = book1;
window.book2 = book2;
window.book3 = book3;

window.onload = function(){
	with(QuickStep) {

		div(
			{parent:document.body},

			window.CE = CollectionElement(Books, function(book, value){
				return div(
					'[',value('_index'),'] ', value('Order'), ' - ', value('Title'), ' - ', value('Author')
				);
			})
		);

	}

	Books.add(book1);
	Books.add(book2);
	Books.add(book3);

	Books.add(new Book({Title:'1 Fish 2 Fish Blue Fish', Autor: "Dr. Suess"}));

}