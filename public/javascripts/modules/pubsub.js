var EventEmitter = require('events').EventEmitter;

var emitter = new EventEmitter();

var Pubsub = function() {
  // empty constructor
}

Pubsub.subscribe = function(event, listener) {
  emitter.on(event, listener);
}

Pubsub.unsubscribe = function(event, listener) {
  emitter.removeListener(event, listener);
}

Pubsub.once = function(event, listener) {
  emitter.once(event, listener);
}

Pubsub.publish = function(event) {
  var args = Array.prototype.slice.call(arguments);
  emitter.emit.apply(emitter, args);
}

Pubsub.unsubscribeAll = function(event) {
  emitter.removeAllListeners(event);
}

module.exports = Pubsub;
