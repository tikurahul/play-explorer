var React = require('react');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;
var PropsMixin = require('./mixins');
var Pubsub = require('../modules/pubsub');

var FailedResponse = React.createClass({
  mixins: [PureRenderMixin, PropsMixin],
  propTypes: {
    verb: React.PropTypes.string,
    url: React.PropTypes.string,
    textStatus: React.PropTypes.string,
    error: React.PropTypes.string
  },
  getInitialState: function() {
    return {
      verb: null,
      url: null,
      textStatus: null,
      error: null
    };
  },
  render: function() {
    var verb = this.state.verb;
    var url = this.state.url;
    var textStatus = this.state.textStatus;
    var error = this.state.error;

    var urlStyle = {
      'marginLeft': '2rem'
    };

    var statusStyle = {
      'marginLeft': '2rem',
      'textTransform': 'uppercase'
    };

    return (
      <div className='panel panel-default'>
        <div className='panel-heading'>
          <button className='btn btn-primary'>{verb}</button>
          <samp style={urlStyle}>{url}</samp>
          <span className='badge' style={statusStyle}>{textStatus}</span>
        </div>
        <div className='panel-body'>
          <div className='well well-lg'>
            <samp>{error}</samp>
          </div>
        </div>
      </div>
    );
  }
});

var Headers = React.createClass({
  mixins: [PureRenderMixin, PropsMixin],
  propTypes: {
    responseHeaders: React.PropTypes.object
  },
  getInitialState: function() {
    return {
      responseHeaders: null
    };
  },
  render: function() {
    var responseHeaders = this.state.responseHeaders;
    var headerKeys = Object.keys(responseHeaders);
    var style = {};
    if (headerKeys.length <= 0) {
      style.display = 'none';
    }

    var components = headerKeys.map((key) => {
      var value = responseHeaders[key];
      return (
        <a href='#' className='list-group-item'>
          <h5 className='list-group-item-heading'>{key}</h5>
          <p className='list-group-item-text'>{value}</p>
        </a>
      );
    });

    return (
      <div className='list-group' style={style}>
        {components}
      </div>
    );
  }
});

var SuccessfulResponse = React.createClass({
  mixins: [PureRenderMixin, PropsMixin],
  propTypes: {
    verb: React.PropTypes.string,
    url: React.PropTypes.string,
    status: React.PropTypes.string,
    responseHeaders: React.PropTypes.object,
    data: React.PropTypes.string
  },
  getInitialState: function() {
    return {
      verb: null,
      url: null,
      status: null,
      responseHeaders: null,
      data: null
    };
  },
  render: function() {
    var verb = this.state.verb;
    var url = this.state.url;
    var status = this.state.status;
    var responseHeaders = this.state.responseHeaders;
    var data = this.state.data;

    var urlStyle = {
      'marginLeft': '2rem'
    };

    var statusStyle = {
      'marginLeft': '2rem',
      'textTransform': 'uppercase'
    };

    // <Headers responseHeaders={responseHeaders} />

    return (
      <div className='panel panel-default'>
        <div className='panel-heading'>
          <button className='btn btn-primary'>{verb}</button>
          <samp style={urlStyle}>{url}</samp>
          <span className='badge' style={statusStyle}>{status}</span>
        </div>
        <div className='panel-body'>
          <div className='well well-lg'>
            <samp>{data}</samp>
          </div>
        </div>
      </div>
    );
  }
});

var Responses = React.createClass({
  mixins: [PropsMixin],
  propTypes: {
    requestPending: React.PropTypes.bool,
    successes: React.PropTypes.array,
    failures: React.PropTypes.array
  },
  getInitialState: function() {
    return {
      requestPending: false,
      successes: [],
      failures: []
    };
  },
  componentWillMount: function() {
    var self = this;
    // start-request
    Pubsub.subscribe('start-request', () => {
      self.setState({
        requestPending: true
      });
    });
    // end-request
    Pubsub.subscribe('end-request', () => {
      self.setState({
        requestPending: false
      });
    });
    // request-success
    Pubsub.subscribe('request-success', (url, verb, requestPayload, status, responseHeaders, data) => {
      var successes = self.state.successes;
      successes.push({
        url: url,
        verb: verb,
        requestPayload: requestPayload,
        status: status,
        responseHeaders: responseHeaders,
        data: data
      });
      // update
      self.setState({
        successes: successes
      });
    });
    // request-failed
    Pubsub.subscribe('request-failed', (url, verb, requestPayload, textStatus, error) => {
      var failures = self.state.failures;
      failures.push({
        url: url,
        verb: verb,
        requestPayload: requestPayload,
        textStatus: textStatus,
        error, error
      });
      // update
      self.setState({
        failures: failures
      });
    });
    Pubsub.subscribe('endpoint-change', (eventId) => {
      // reset
      self.setState({
        requestPending: false,
        successes: [],
        failures: []
      });
    });
  },
  componentWillUnmount: function() {
    Pubsub.unsubscribeAll('start-request', 'end-request', 'request-success', 'request-failed', 'endpoint-change');
  },
  render: function() {
    var requestPending = this.state.requestPending;
    var progressStyle = {};
    if (!requestPending) {
      progressStyle.display = 'none'
    }

    var successes = this.state.successes;
    var successfulComponents = successes.map((success) => {
      return (
        <SuccessfulResponse verb={success.verb}
          url={success.url}
          status={success.status}
          responseHeaders={success.responseHeaders}
          data={success.data} />
      );
    });

    var failures = this.state.failures;
    var failedComponents = failures.map((failure) => {
      return (
        <FailedResponse verb={failure.verb}
          url={failure.url}
          textStatus={failure.textStatus}
          error={failure.error} />
      );
    });

    return (
      <div>
        <i className="fa fa-spinner fa-spin" style={progressStyle} />
        {successfulComponents}
        {failedComponents}
      </div>
    );
  }
});

exports.FailedResponse = FailedResponse;
exports.Headers = Headers;
exports.SuccessfulResponse = SuccessfulResponse;
exports.Responses = Responses;
