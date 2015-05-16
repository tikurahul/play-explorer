var Utils = function() {
  // does nothing
}

Utils.endpointId = function(endpoint) {
  if (!!endpoint === false)
    return null;

  var packageName = endpoint.packageName;
  var controller = endpoint.controller;
  var method = endpoint.method;

  return [method, packageName, controller].join('.');
}

module.exports = Utils;
