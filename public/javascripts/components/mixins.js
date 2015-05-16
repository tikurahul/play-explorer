var PropsMixin = {
  componentWillMount: function() {
    // copy this.props to this.state to keep them in sync
    this._copy(this.props);
  },
  componentWillReceiveProps: function(props) {
    this._copy(props);
  },
  _copy: function(props) {
    var newState = {};
    Object.keys(props).forEach((key) => {
      newState[key] = props[key];
    });
    this.setState(newState);
  }
}

module.exports = PropsMixin;
