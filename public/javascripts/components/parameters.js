var React = require('react');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;
var PropsMixin = require('./mixins');

var BasicParameter = React.createClass({
  mixins: [PureRenderMixin, PropsMixin],
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

    var value = !!value ? value : defaultValue;
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
    this.setState({
      value: newValue
    });
  }
});

var Parameters = React.createClass({
  mixins: [PureRenderMixin, PropsMixin],
  propTypes: {
    parameters: React.PropTypes.arrayOf(React.PropTypes.object)
  },
  getInitialState: function() {
    return {
      parameters: []
    };
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
    console.log('Making request');
  }
})

exports.BasicParameter = BasicParameter;
exports.Parameters = Parameters;
