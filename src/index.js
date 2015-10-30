var QuickStep = require('./QuickStep.js');
var Model = require('./Model.js');
var Collection = require('./Collection.js');
var CollectionElement = require('./CollectionElement.js');
var ModelValue = require('./ModelValue.js');
var Primitives = require('./primitives/index.js');
var SubPub = require('./subpub.js');

QuickStep.Model = Model;
QuickStep.Collection = Collection;
QuickStep.CollectionElement = CollectionElement;
QuickStep.ModelValue = ModelValue;
QuickStep.Primitives = Primitives;
QuickStep.Primitives = Primitives;
QuickStep.SubPub = SubPub;

module.exports = QuickStep;
window.QuickStep = QuickStep;