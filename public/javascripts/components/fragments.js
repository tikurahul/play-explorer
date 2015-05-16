var React = require('react');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;

var Fragment = React.createClass({
  mixins: [PureRenderMixin],
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
    var newValue = event.target.value;
    this.setState({
      value: newValue
    });
  },
  render: function() {
    var value = this.state.value;
    return (
      <input type='text' value={value} onChange={this.handleChange} />
    );
  }
});

var Fragments = React.createClass({
  mixins: [PureRenderMixin],
  getInitialState: function() {
    return {
      baseUrl: null,
      fragments: []
    }
  },
  render: function() {
    return (
      <div>
        <span className='baseUrl'></span>
      </div>
    );
  }
});

exports.Fragment = Fragment;
exports.Fragments = Fragments;
