import React, { Component } from 'react';

function makeDistortionCurve(amount) {
  var k = typeof amount === 'number' ? amount : 50,
    n_samples = 44100,
    curve = new Float32Array(n_samples),
    deg = Math.PI / 180,
    i = 0,
    x
  for (; i < n_samples; ++i) {
    x = (i * 2) / n_samples - 1
    curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x))
  }
  return curve
}

export class Disto extends Component {
  
  state = { value: this.props.initialValue }

  componentDidMount() {
    this.node = this.props.context.createWaveShaper()
    this.node.oversample = '8x'
    this.node.curve = makeDistortionCurve(0)
    this.props.offer(this.node);
  }

  updateValue = (value) => {
    this.setState({ value })
    this.node.curve = makeDistortionCurve(parseInt(20 * value))
  }

  componentWillUnmount() {}

  render() {
    return (
      <div className="pedal">
        <h3>{this.props.title}: {this.state.value}</h3>
        <input 
          type="range" 
          min={this.props.min} 
          max={this.props.max} 
          step={this.props.step} 
          value={this.state.value} 
          onChange={e => this.updateValue(e.target.value)} /> 
      </div>
    )
  }
}