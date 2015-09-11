var QuickStep = require('./QuickStep.js');
var Model = require('./Model.js');
var Collection = require('./Collection.js');
var CollectionElement = require('./CollectionElement.js');
var ModelValue = require('./ModelValue.js');
var Element = require('./extensions/element.js');

QuickStep.Model = Model;
QuickStep.Collection = Collection;
QuickStep.CollectionElement = CollectionElement;
QuickStep.ModelValue = ModelValue;
QuickStep.Element = Element;




module.exports = QuickStep;
if(window)window.QuickStep = QuickStep;