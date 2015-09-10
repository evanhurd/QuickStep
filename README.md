# QuickStep


#### Basic Usage of QuickStep Elements

```javascript
  //Creating Elements
  document.body.appendChild(QuickStep.div());
  QuickStep.div(QuickStep.div());
  
  with(QuickStep){
    document.body.appendChild(div(div("Hello World")));
    
    //Self inserting element
    div(
      {parent:document.body},
      div("Hello World")
    );
    
    // Assigning Attributes and Styles
    div(
      {
        parent:document.body,
        id : "foo",
        class : "foo-bar",
        attr : {
          name : 'test'
        },
        style {
          color:'red'
        }
      },
      span("Hello World"),
      button("Test"),
    );
  }
```

### Models

```
new Model(name, keys=[key1,key2,...])
```

```javascript

  Book = new Model("Book", ["Title","Author", "Order"]);
  
  var book1 = new Book({Title:'Go Dog Go', Author:'Dr. Suesssss', Order:3}),
      book2 = new Book({Title:'The Black Book of Communism', Author:'Harvard', Order:1}),
      book3 = new Book({Title:'Tools of Dominion', Author:'Gary North', Order:2});
      
```


### Collections

```
new Collection(model);
```

```javascript
  var Books = new Collection(Book);
```
#### Adding To A Collection
```
collection.add(model1,[model2],[model2]...);
```
```javascript
	Books.add(book1);
	Books.add(book2, book3);
```

### Removing From A Collection
```
collection.remove(model1,[model2],[model2]...);
```
```javascript
	Books.remove(book1);
	Books.remove(book2, book3);
```
### Sorting A Collection
```
collection.sort(sortFunction);
```
```javascript
  Books.sort(function(itemA, itemB){
  	if (itemA.order < itemB.order) {
  		return 1;
  	}else if (itemA.order > itemB.order) {
  		return -1;
  	}else{
  		return 0;
  	}
  });
```

### CollectionElement

```
CollectionElement(collection, elementFunction);
```

```javascript
	with(QuickStep) {
		div(
			{parent:document.body},
			CollectionElement(Books, function(book, value){
				return div(
					'[',value('_index'),'] ', value('Order'), ' - ', value('Title'), ' - ', value('Author')
				);
			})
		);
	}
```


