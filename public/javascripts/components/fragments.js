var React = require('react');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;

var Fragment = React.createClass({
  mixins: [PureRenderMixin],
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
  getInitialState: function() {

  }
});

exports.Fragment = Fragment;
exports.Fragments = Fragments;
