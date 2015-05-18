var Utils = function() {
  // does nothing
}

Utils.endpointId = function(endpoint) {
  if (!!endpoint === false)
    return null;

  var packageName = endpoint.packageName;
  var controller = endpoint.controller;
  var methodName = endpoint.methodName;
  var method = endpoint.method;

  return [method, packageName, controller, methodName].join('.');
}

Utils.asJson = function(input) {
  if (typeof(input) === 'string') {
    return input;
  } else if (typeof(input) === 'object') {
    return JSON.stringify(input);
  } else {
    return input.toString();
  }
}

module.exports = Utils;
