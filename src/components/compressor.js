import React, { Component } from 'react';

export class Compressor extends Component {
  
  componentDidMount() {
    this.node = this.props.context.createDynamicsCompressor()
    this.props.offer(this.node);
  }

  componentWillUnmount() {}

  render() {
    return (
      <div className="pedal">
        <h3>{this.props.title}</h3>
      </div>
    )
  }
}