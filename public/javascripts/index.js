var React = require('react');
var Utils = require('./modules/utils');
var Pubsub = require('./modules/pubsub');
var Fragments = require('./components/fragments').Fragments;
var UrlTracker = require('./components/fragments').UrlTracker;
var Parameters = require('./components/parameters').Parameters;

var cache = {};

var endpoints = Application['endpoints'] || [];
var endpoint = null;
var endpointId = null;
var i = 0;

var UrlTrackerFactory = React.createFactory(UrlTracker);
var FragmentsFactory = React.createFactory(Fragments);
var ParametersFactory = React.createFactory(Parameters);

var endpointHandler = function(eventId) {
  var endpointInfo = cache[eventId] || null;
  if (endpointInfo && Application.baseUrl) {
    // copy, to prevent mutation of original Application
    var clonedEndpointInfo = JSON.parse(JSON.stringify(endpointInfo));
    // render url tracker
    var urlTracker = UrlTrackerFactory({
      baseUrl: Application.baseUrl,
      fragments: clonedEndpointInfo.fragments
    });
    React.render(urlTracker, document.querySelector('#urlTracker'));
    // render fragments
    var fragments = FragmentsFactory({
      baseUrl: Application.baseUrl,
      fragments: clonedEndpointInfo.fragments
    });
    React.render(fragments, document.querySelector('#fragments'));
    // render parameters
    var parameters = ParametersFactory({
      verb: endpointInfo.method,
      parameters: clonedEndpointInfo.parameters
    });
    React.render(parameters, document.querySelector('#parameters'));
    Pubsub.publish('endpoint-change', eventId);
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
