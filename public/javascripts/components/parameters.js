var React = require('react');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;
var PropsMixin = require('./mixins');
var Pubsub = require('../modules/pubsub');

var BasicParameter = React.createClass({
  mixins: [PropsMixin],
  propTypes: {
    parameterInfo: React.PropTypes.object
  },
  getInitialState: function() {
    return {
      parameterInfo: null
    };
  },
  render: function() {
    var name = this.state.parameterInfo.name;
    var value = this.state.parameterInfo.value;
    var required = this.state.parameterInfo.required;
    var defaultValue = this.state.parameterInfo['default'];
    var inputType = this.state.parameterInfo.inputType;

    value = !!value ? value : defaultValue;
    var placeholder = name;

    // we are going to render a form-group for every parameter
    // http://getbootstrap.com/css/#forms
    return (
      <div className="form-group">
        <label htmlFor={name}>{name}</label>
        <input type={inputType} className="form-control" id={name} name={name} placeholder={placeholder} value={value} required={required} onChange={this.handleChange} />
      </div>
    );
  },
  handleChange: function(event) {
    var newValue = event.target.value;
    var parameterInfo = this.state.parameterInfo;
    parameterInfo.value = newValue;
    this.setState({
      parameterInfo: parameterInfo
    });
  }
});

var Parameters = React.createClass({
  mixins: [PureRenderMixin, PropsMixin],
  propTypes: {
    url: React.PropTypes.string,
    verb: React.PropTypes.string,
    parameters: React.PropTypes.arrayOf(React.PropTypes.object)
  },
  getInitialState: function() {
    return {
      url: null,
      verb: null,
      parameters: []
    };
  },
  componentWillMount: function() {
    var self = this;
    Pubsub.subscribe('request-url-update', (url) => {
      self.setState({
        url: url
      });
    });
  },
  componentWillUnmount: function() {
    Pubsub.unsubscribeAll('request-url-update');
  },
  render: function() {
    var parameters = this.state.parameters || [];
    var hide = parameters.length <= 0;
    var style = {};
    if (hide) {
      style.display = 'none'
    }

    var components = [];
    parameters.forEach((parameterInfo) => {
      var parameter = <BasicParameter parameterInfo={parameterInfo} />;
      components.push(parameter);
    });

    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          <h5>Parameters</h5>
        </div>
        <div className="panel-body">
          <form>
            <section style={style}>
              {components}
            </section>
            <button type="button" className="btn btn-default" onClick={this.handleClick}>Make Request</button>
          </form>
        </div>
      </div>
    );
  },
  handleClick: function() {
    var url = this.state.url;
    var verb = this.state.verb;
    var parameters = this.state.parameters;
    var requestPayload = {};
    parameters.forEach((parameter) => {
      requestPayload[parameter.name] = parameter.value;
    });
    console.log('Making request', url, verb, requestPayload);
    Pubsub.publish('start-request', url, verb, requestPayload);
    var $request = $.ajax({
      url: url,
      method: verb,
      data: requestPayload
    });
    $request.always(() => {
      Pubsub.publish('end-request');
    });
    $request.done((data, status, xhr) => {
      var responseHeaders = xhr.getAllResponseHeaders();
      Pubsub.publish('request-success', url, verb, requestPayload, status, responseHeaders, data);
    });
    $request.fail((xhr, textStatus, error) => {
      Pubsub.publish('request-failed', url, verb, requestPayload, textStatus, error);
    });
  }
})

exports.BasicParameter = BasicParameter;
exports.Parameters = Parameters;
