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

export class Disto2 extends Component {
  
  state = { value: this.props.initialValue }

  createPreamp = (type, frequency) => {
    const biquad = this.props.context.createBiquadFilter()
    biquad.type = type
    biquad.frequency.value = frequency
    this.addController(`${frequency} Hz gain`, -20, 20, 1, 0, value => {
      biquad.gain.value = value
    })
    const waveShaper = this.props.context.createWaveShaper()
    waveShaper.oversample = '4x'
    waveShaper.curve = makeDistortionCurve(0)
    this.addController(`${frequency} Hz dist.`, 0, 1, 0.1, 0, value => {
      waveShaper.curve = makeDistortionCurve(parseInt(20 * value))
      // equalizer.forEach(node => node.Q.value =  (2 * (1-value)) + 3)
    })
  
    biquad.connect(waveShaper)
    // waveShaper.connect(gain)
  
    return {
      input: biquad,
      output: waveShaper
    }
  }

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
    const lowcut = this.props.context.createBiquadFilter()
    lowcut.type = "highpass";
    lowcut.frequency.value = 20;
    const highcut = this.props.context.createBiquadFilter()
    highcut.type = "lowpass";
    highcut.frequency.value = 10000;
    lowcut.connect(highcut)
    
    const preamp1 = this.createPreamp('peaking', 185)
    const preamp2 = this.createPreamp('peaking', 750)
    const preamp3 = this.createPreamp('peaking', 2350)
    const preamp4 = this.createPreamp('peaking', 5250)

    highcut.connect(preamp1.input)
    highcut.connect(preamp2.input)
    highcut.connect(preamp3.input)
    highcut.connect(preamp4.input)

    const distoMaster = this.props.context.createGain();
    distoMaster.gain.value = 1
    this.addController(`gain`, 0, 1, 0.05, 0.5, (value) => {
      distoMaster.gain.value = value
    })

    preamp1.output.connect(distoMaster)
    preamp2.output.connect(distoMaster)
    preamp3.output.connect(distoMaster)
    preamp4.output.connect(distoMaster)

    const disto = {
      input: lowcut,
      output: distoMaster,
    };

    this.node = disto;
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
        {this.controls}
      </div>
    )
  }
}