var QuickStep = require('./QuickStep.js');
var Model = require('./Model.js');
var Collection = require('./Collection.js');
var CollectionElement = require('./CollectionElement.js');
var ModelValue = require('./ModelValue.js');

QuickStep.Model = Model;
QuickStep.Collection = Collection;
QuickStep.CollectionElement = CollectionElement;
QuickStep.ModelValue = ModelValue;
module.exports = QuickStep;
if(window)window.QuickStep = QuickStep;