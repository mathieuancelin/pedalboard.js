import React, { Component } from 'react';

export class Osciloscope extends Component {

  componentDidMount() {
    if (this.osciloCanvas) {
      this.createOscillo();
      this.mounted = true;
      this.animationFrame = requestAnimationFrame(this.drawOsciloscope);
    }
  }

  componentWillUnmount() {
    if (this.mounted) {
      this.mounted = false;
      cancelAnimationFrame(this.animationFrame);
    }
  }

  setupCanvas = (canvas) => {
    this.osciloscopeHtml = canvas;
    this.osciloCanvas = canvas.getContext('2d');
  }

  createOscillo = () => {
    this.node = this.props.context.createAnalyser()
    this.props.offer(this.node);
    this.node.fftSize = 2048
    this.node.maxDecibels = 10
    this.node.minDecibels = 0
    this.bufferLength = this.node.frequencyBinCount
    this.dataArray = new Uint8Array(this.bufferLength)
  }

  drawOsciloscope = () => {
    this.animationFrame = requestAnimationFrame(this.drawOsciloscope);
    this.osciloCanvas.fillStyle = 'rgb(0, 0, 0)'
    this.osciloCanvas.fillRect(
      0,
      0,
      this.osciloscopeHtml.width,
      this.osciloscopeHtml.height
    )
    this.osciloCanvas.lineWidth = 2
    this.osciloCanvas.strokeStyle = '#ABDCF6'
    this.osciloCanvas.beginPath()

    this.node.getByteTimeDomainData(this.dataArray)

    const sliceWidth = (this.osciloscopeHtml.width * 1.0) / this.bufferLength
    let x = 0
    for (let i = 0; i < this.bufferLength; i++) {
      const y = (this.dataArray[i] / 128.0) * (this.osciloscopeHtml.height / 2)

      if (i === 0) {
        this.osciloCanvas.moveTo(x, y)
      } else {
        this.osciloCanvas.lineTo(x, y)
      }

      x += sliceWidth
    }
    this.osciloCanvas.stroke()
  }

  render() {
    return (
      <div className="pedal">
        <canvas style={{ width: '100%', height: '100%'}} ref={this.setupCanvas} />
      </div>
    )
  }
}