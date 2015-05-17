var React = require('react');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;
var PropsMixin = require('./mixins');
var Pubsub = require('../modules/pubsub');

var Responses = React.createClass({
  mixins: [PureRenderMixin, PropsMixin],
  getInitialState: function() {
    return {
      response: null
    };
  },
  render: function() {

  }
});
