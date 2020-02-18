import React, { Component } from 'react';

export class Gain extends Component {
  
  state = { value: this.props.initialValue }

  componentDidMount() {
    this.node = this.props.context.createGain()
    this.node.gain.value = this.state.value;
    this.props.offer(this.node);
  }

  componentWillUnmount() {}

  updateValue = (value) => {
    this.setState({ value })
    this.node.gain.value = value
  }

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