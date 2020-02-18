import React, { Component } from 'react';

const equalizerFrequencies = [125, 250, 500, 1000, 2000, 3000, 4000, 6000, 8000, 16000];

export class Equalizer extends Component {

  state = {}
  
  addController = (name, min, max, step, initialValue, f) => {
    this.setState({ [name]: initialValue });
    f(initialValue);
    this.controls.push(
      <div>
        {name} <input 
          type="range" 
          min={min} 
          max={max} 
          step={step} 
          value={this.state[name]} 
          onChange={e => {
            this.setState({ [name]: parseFloat(e.target.value) });
            f(parseFloat(e.target.value))
          }} /> 
      </div>
    )
  };

  componentDidMount() {
    this.controls = [];
    const equalizerNodes = equalizerFrequencies.map((frequency) => {
      const filterNode = this.props.context.createBiquadFilter();
      filterNode.type = "peaking";
      filterNode.frequency.value = frequency;
      filterNode.gain.value = 0;
      filterNode.Q.value = 5;
      this.addController(frequency + ' Hz gain', -40, 40, 1, 0, value => {
        filterNode.gain.value = value
      })
      return filterNode;
    });
    equalizerNodes.reduce((a, b) => {
      a.connect(b);
      return b;
    });
    this.node = {
      input: equalizerNodes[0],
      output: equalizerNodes[equalizerNodes.length - 1]
    };
    this.props.offer(this.node);
  }

  componentWillUnmount() {}

  render() {
    return (
      <div className="pedal">
        <h3>{this.props.title}</h3>
        {this.controls}
      </div>
    )
  }
}