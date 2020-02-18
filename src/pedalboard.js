import React, { Component } from 'react';

const getMicrophoneStream = () => {
  navigator.getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia
  return new Promise((resolve, reject) => {
    navigator.getUserMedia(
      { audio: true },
      medias => resolve(medias),
      error => reject(error)
    )
  })
}

export class PedalBoard extends Component {

  state = {
    powerOn: false,
    components: [],
    nodes: [],
  }

  componentDidMount() {
    console.log('componentDidMount')
    if (!this.ctx) this.init();
  }

  init = () => {
    console.log('init')
    this.ctx = new AudioContext()
    this.createNodes().then(() => {
      this.connect()
    })
  }

  connect = () => {
    console.log('connect', this.state.nodes);
    [ this.sourceNode, ...this.state.nodes, this.ctx.destination ].reduce((a, b) => {
      (a.output ? a.output.connect(b) : a.connect((b.input ? b.input : b)))
      return (b.input ? b.input : b);
    });
  }

  createMicroSourceNode = () => {
    console.log('createMicroSourceNode')
    return getMicrophoneStream().then(stream => {
      this.sourceNode = this.ctx.createMediaStreamSource(stream)
    })
  }

  createNodes = () => {
    console.log('createNodes')
    return this.createMicroSourceNode().then(() => {
      const nodes = [];
      const components = this.props.children(this.ctx).map(i => i(e => nodes.push(e)))
      this.setState({ components, nodes });
    })
  }

  render() {
    return (
      <div style={{ outline: '1px solid red', display: 'flex', flexWrap: 'wrap', width: '100%', backgroundColor: 'black' }}>
        {this.state.components}
      </div>
    );
  }
}