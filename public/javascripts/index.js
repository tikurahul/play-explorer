var React = require('react');
var Utils = require('./modules/utils');
var Pubsub = require('./modules/pubsub');
var Fragments = require('./components/fragments').Fragments;

var cache = {};

var endpoints = Application['endpoints'] || [];
var endpoint = null;
var endpointId = null;
var i = 0;

var endpointHandler = function(eventId) {
  var endpointInfo = cache[eventId] || null;
  if (endpointInfo && Application.baseUrl) {
    // render fragments
    var FragmentsFactory = React.createFactory(Fragments);
    var fragments = FragmentsFactory({
      baseUrl: Application.baseUrl,
      fragments: endpointInfo.fragments
    });
    React.render(fragments, document.querySelector('#fragments'));
  }
};

for (i = 0; i < endpoints.length; i += 1) {
  endpoint = endpoints[i];
  endpointId = Utils.endpointId(endpoint);
  Pubsub.subscribe(endpointId, endpointHandler);
  cache[endpointId] = endpoint;
}

// DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('Init complete.');

  $('a[data-endpoint-id]').on('click', (event) => {
    event.stopPropagation();

    var $target = $(event.target);
    var eventId = $target.attr('data-endpoint-id');
    Pubsub.publish(eventId, eventId);
  });

});
