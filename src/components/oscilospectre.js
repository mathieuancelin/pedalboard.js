import React, { Component } from 'react';

export class Oscilospectre extends Component {

  componentDidMount() {
    if (this.osciloCanvas) {
      this.createOscillo();
      this.createSpectre();
      this.mounted = true;
      this.animationFrame1 = requestAnimationFrame(this.drawSpectre);
      this.animationFrame2 = requestAnimationFrame(this.drawOsciloscope);
    }
  }

  componentWillUnmount() {
    if (this.mounted) {
      this.mounted = false;
      cancelAnimationFrame(this.animationFrame1);
      cancelAnimationFrame(this.animationFrame2);
    }
  }

  setupCanvas1 = (canvas) => {
    this.osciloscopeHtml = canvas;
    this.osciloCanvas = canvas.getContext('2d');
  }

  setupCanvas2 = (canvas) => {
    this.spectreHtml = canvas;
    this.spectreCanvas = canvas.getContext('2d');
  }

  createOscillo = () => {
    this.node1 = this.props.context.createAnalyser()
    this.props.offer(this.node1);
    this.node1.fftSize = 2048
    this.node1.maxDecibels = 10
    this.node1.minDecibels = 0
    this.bufferLength = this.node1.frequencyBinCount
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

    this.node1.getByteTimeDomainData(this.dataArray)

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

  createSpectre = () => {
    this.node2 = this.props.context.createAnalyser()
    this.props.offer(this.node2);
    this.node2.fftSize = 256
    this.node2.smoothingTimeConstant = 0.9
    this.bufferSpectreLength = this.node2.frequencyBinCount
    this.dataSpectreArray = new Uint8Array(this.bufferSpectreLength)
  }

  drawSpectre = () => {
    this.animationFrame = requestAnimationFrame(this.drawSpectre)

    this.node2.getByteFrequencyData(this.dataSpectreArray)

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
        <canvas style={{ width: '100%', height: '100%'}} ref={this.setupCanvas1} />
        <canvas style={{ width: '100%', height: '100%'}} ref={this.setupCanvas2} />
      </div>
    )
  }
}