import React, { Component } from 'react';

export class Spectre extends Component {

  componentDidMount() {
    if (this.spectreCanvas) {
      this.createSpectre();
      this.mounted = true;
      this.animationFrame = requestAnimationFrame(this.drawSpectre);
    }
  }

  componentWillUnmount() {
    if (this.mounted) {
      this.mounted = false;
      cancelAnimationFrame(this.animationFrame);
    }
  }

  setupCanvas = (canvas) => {
    this.spectreHtml = canvas;
    this.spectreCanvas = canvas.getContext('2d');
  }

  createSpectre = () => {
    this.node = this.props.context.createAnalyser()
    this.props.offer(this.node);
    this.node.fftSize = 256
    this.node.smoothingTimeConstant = 0.9
    this.bufferSpectreLength = this.node.frequencyBinCount
    this.dataSpectreArray = new Uint8Array(this.bufferSpectreLength)
  }

  drawSpectre = () => {
    this.animationFrame = requestAnimationFrame(this.drawSpectre)

    this.node.getByteFrequencyData(this.dataSpectreArray)

    this.spectreCanvas.fillStyle = 'rgb(0, 0, 0)'
    this.spectreCanvas.fillRect(
      0,
      0,
      this.spectreHtml.width,
      this.spectreHtml.height
    )

    const lBarre = Math.floor(
      (this.spectreHtml.width / this.bufferSpectreLength) * 2.5
    )

    let x = 0
    for (let i = 0; i < this.bufferSpectreLength; i++) {
      let hBarre = this.dataSpectreArray[i]

      this.spectreCanvas.fillStyle = '#ABDCF6'
      this.spectreCanvas.fillRect(
        x,
        this.spectreHtml.height - hBarre / 1.5,
        lBarre,
        hBarre
      )

      x += lBarre + 1
    }
  }

  render() {
    return (
      <div className="pedal">
        <canvas style={{ width: '100%', height: '100%'}} ref={this.setupCanvas} />
      </div>
    )
  }
}