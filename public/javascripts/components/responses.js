var React = require('react');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;
var PropsMixin = require('./mixins');
var Pubsub = require('../modules/pubsub');

var Responses = React.createClass({
  mixins: [PureRenderMixin, PropsMixin],
  propTypes: {
    pending: React.PropTypes.bool,
    responses: React.PropTypes.object
  },
  getInitialState: function() {
    return {
      pending: false,
      responses: []
    };
  },
  render: function() {
    var progressStyle = {};
    if (!pending) {
      progressStyle.display = 'none'
    }

    return (
      <div>
        <i className="fa fa-spinner fa-spin" style={progressStyle} />
      </div>
    );
  }
});
