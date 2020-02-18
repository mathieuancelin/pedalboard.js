
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { PedalBoard, Osciloscope, Oscilospectre, Spectre, Gain, Disto, Disto2, Compressor, Equalizer } from './index';

import './test.css';

class TestPedalBoard extends Component {
  render() {
    return (
      <PedalBoard>
        {ctx => {
          console.log('returning pedals')
          return [
            (offer) => <Gain title="Input gain" context={ctx} offer={offer} min={0} max={1} step={0.05} initialValue={1} />,
            (offer) => <Disto title="Disto 1" context={ctx} offer={offer} min={0} max={4} step={0.05} initialValue={0.1} />,
            (offer) => <Disto title="Disto 2" context={ctx} offer={offer} min={0} max={2} step={0.05} initialValue={0.1} />,
            (offer) => <Equalizer title="Equalizer" context={ctx} offer={offer} />,
            // (offer) => <Compressor title="Compressor" context={ctx} offer={offer} />,
            // (offer) => <Osciloscope context={ctx} offer={offer} />,
            // (offer) => <Spectre context={ctx} offer={offer} />,
            (offer) => <Oscilospectre context={ctx} offer={offer} />,
          ]
        }}
      </PedalBoard>
    );
  }
}

ReactDOM.render(<TestPedalBoard /> , document.getElementById('app'));

