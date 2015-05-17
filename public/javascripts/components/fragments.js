var React = require('react');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;
var PropsMixin = require('./mixins');
var Pubsub = require('../modules/pubsub');

var DynamicFragment = React.createClass({
  mixins: [PureRenderMixin, PropsMixin],
  propTypes: {
    name: React.PropTypes.string.isRequired,
    regex: React.PropTypes.string.isRequired,
    value: React.PropTypes.string
  },
  getInitialState: function(){
    return {
      name: null,
      regex: null,
      value: null
    }
  },
  handleChange: function(event) {
    var name = this.state.name;
    var newValue = event.target.value;
    this.setState({
      value: newValue
    });
    // publish event for UrlTracker
    Pubsub.publish('dynamic-fragment-update', name, newValue);
  },
  render: function() {
    var value = this.state.value;
    var name = this.state.name;
    return (
      <input className="form-control" type='text' value={value} onChange={this.handleChange} placeholder={name} />
    );
  }
});

var StaticFragment = React.createClass({
  mixins: [PureRenderMixin, PropsMixin],
  propTypes: {
    value: React.PropTypes.string.isRequired
  },
  getInitialState: function() {
    return {
      value: null
    };
  },
  render: function() {
    var value = this.state.value;

    return (
      <samp>{value}</samp>
    );
  }
});

var Fragment = React.createClass({
  mixins: [PureRenderMixin, PropsMixin],
  propTypes: {
    fragment: React.PropTypes.object
  },
  getInitialState: function() {
    return {
      fragment: null
    };
  },
  render: function() {
    var fragment = this.state.fragment;
    var type = fragment.type;
    var component = null;

    if (type === 'static') {
      component = <StaticFragment value={fragment.value} />
    } else if (type === 'dynamic') {
      component = <DynamicFragment name={fragment.identifier} regex={fragment.regex} />
    }

    return (
      <div>
        {component}
      </div>
    );
  }
});

var UrlTracker = React.createClass({
  mixins: [PureRenderMixin, PropsMixin],
  propTypes: {
    url: React.PropTypes.string
  },
  getInitialState: function() {
    return {
      baseUrl: null,
      fragments: [],
      url: null
    };
  },
  componentWillMount: function() {
    var self = this;
    Pubsub.subscribe('dynamic-fragment-update', (name, value) => {
      var fragments = self.state.fragments;
      var urlParts = [self.state.baseUrl];
      fragments.forEach((fragment) => {
        // only dynamic fragments can be updated
        if (fragment.type === 'dynamic' && fragment.identifier === name) {
          fragment.value = value;
        }
        urlParts.push(fragment.value);
      });
      var url = urlParts.join('/');
      console.log('URL : ', url);
      self.setState({
        url: url
      });
    });
  },
  render: function() {
    var url = this.state.url;
    var style = {
      display: 'none'
    };

    return (
      <div className="urlTracker" style={style}>
        {url}
      </div>
    );
  }
});

var Fragments = React.createClass({
  mixins: [PureRenderMixin, PropsMixin],
  getInitialState: function() {
    return {
      baseUrl: null,
      fragments: []
    }
  },
  render: function() {
    var baseUrl = this.state.baseUrl;
    var fragments = this.state.fragments;
    var displayState = baseUrl ? "block" : "none";
    var style = {
      display: displayState
    };

    var components = [];
    fragments.forEach((fragment, i) => {
      var staticFragment = <StaticFragment value="/" />
      var fragment = <Fragment fragment={fragment} />;
      components.push(staticFragment)
      components.push(fragment);
    });

    return (
      <div className="panel panel-default" style={style}>
        <div className="panel-heading">
          <h5>URL</h5>
        </div>
        <div className="panel-body">
          <StaticFragment className='baseUrl' value={baseUrl} />
          { components }
        </div>
      </div>
    );
  }
});

exports.StaticFragment = StaticFragment;
exports.DynamicFragment = DynamicFragment;
exports.Fragments = Fragments;
exports.UrlTracker = UrlTracker;
