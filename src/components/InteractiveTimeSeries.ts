import {LitElement, css, } from 'lit';
import ResizeObserver from 'resize-observer-polyfill';

export type InteractiveTimeSeriesProps = {
  max?: number;
  backgroundColor?: string;
  data?: {
    y: any[],
    [x:string]: any
  }[]
  layout?: {[x:string]: any}
  colorscale?: 'Hot' | 'Cold' | 'YlGnBu' | 'YlOrRd' | 'RdBu' | 'Portland' | 'Picnic' | 'Jet' | 'Greys' | 'Greens' | 'Electric' | 'Earth' | 'Bluered' | 'Blackbody' | string[][],
  Plotly?: any,
  onClick?: Function
}


const colorscales = ['Hot' , 'Cold' , 'YlGnBu' , 'YlOrRd' , 'RdBu' , 'Portland' , 'Picnic' , 'Jet' , 'Greys' , 'Greens' , 'Electric' , 'Earth' , 'Bluered' , 'Blackbody']

export class InteractiveTimeSeries extends LitElement {

    static get styles() {
      return css`

      :host {
        overflow: hidden;
      }
      
      `;
    }

    createRenderRoot() {
      return this;
    }
    
    
    static get properties() {
      return {
        max: {
          type: Number,
          reflect: true
        },
        data: {
          type: Array,
          reflect: true
        },
        layout: {
          type: Object,
          reflect: true,
        },
        colorscale: {
          type: Object,
          reflect: true
        },
        backgroundColor: {
          type: String,
          reflect: true,
        },
        onClick: {
          type: Function,
          reflect: true,
        },
      };
    }

    static colorscales = colorscales
    colorscale: InteractiveTimeSeriesProps['colorscale'] = 'Electric'
    div: any = document.createElement('div');
    data: InteractiveTimeSeriesProps['data'] = [];
    plotData: any[] = []
    layout: InteractiveTimeSeriesProps['layout'] = {}
    windowSize = 300
    binWidth = 256
    Plotly: InteractiveTimeSeriesProps['Plotly']
    onClick: InteractiveTimeSeriesProps['Plotly']
    colorscales = colorscales

    constructor(props: InteractiveTimeSeriesProps={}) {
      super();

      this.data = props.data ?? []
      if (props.layout) this.layout = props.layout

      if (props.colorscale) this.colorscale = props.colorscale
      if (props.onClick) this.onClick = props.onClick

      if (props.Plotly){
        this.Plotly = props.Plotly
        this.Plotly.newPlot(this.div, this.getTraces(), this.getLayout());
      } else console.warn('<visualscript-timeseries-interactive>: Plotly instance not provided...')

      // window.addEventListener('resize', this.resize)

      let observer = new ResizeObserver(() => this.resize());
      observer.observe(this.div);
  }

  getTraces = () => {
    return this.data.map(o => Object.assign({
      type: "scatter",
      mode: "lines",
      // line: {color: '#000000'}
      // name: 'Voltage',
    }, o))
  }

  getLayout = () => {
    return Object.assign({
      // title: 'Basic Time Series',
      responsive: true,
      autosize: true
    }, this.layout)
  }

  resize = () => {
    this.Plotly.relayout(this.div, {
      'xaxis.autorange': true,
      'yaxis.autorange': true
    })
  }

    transpose(a) {
      return Object.keys(a[0]).map(function(c) {
          return a.map(function(r) { return r[c]; });
      });
  }

  willUpdate(changedProps:any) {
    
    if (changedProps.has('data')) {
      this.Plotly.newPlot(this.div, this.getTraces(), this.getLayout());
    }

    if (changedProps.has('onClick')) {
      this.div.on('plotly_click', this.onClick);
    }
  }

  //   updateData = (newData) => {

  //     // For a fixed window size,
  //     // Push the latest data and remove the first element
  //     if (!Array.isArray(newData[0])) newData = [newData]

  //     newData.forEach(d => {
  //       if(this.data.length > this.windowSize) {
  //         this.data.push(d)
  //         this.data.splice(0, 1)
  //       } else {
  //         this.data.push(d);
  //       }
  //     })


  //   this.plotData[0].z[0] = transpose(this.data)
  //     const ticRes = performance.now()
  //     Plotly.restyle(this.div, 'z', this.plotData[0].z);
  //     const tocRes = performance.now()
  //     console.log('Restyle', tocRes - ticRes)

  //     // const ticUp = performance.now()
  //     // Plotly.update(this.div, this.plotData[0])
  //     // const tocUp = performance.now()
  //     // console.log('Update', tocUp - ticUp)

  // //     const ticAn = performance.now()
  // //     Plotly.animate(this.div, {
  // //       data: [{z: this.plotData[0].z, type: 'heatmap'}],
  // //   }, {
  // //       transition: {duration: 0},
  // //       frame: {duration: 0, redraw: true}
  // //   });
  // //   const tocAn = performance.now()
  //   // console.log('Animate', tocAn - ticAn)

  //   }

    render() {
      return this.div
    }
  }
  
  customElements.define('visualscript-timeseries-interactive', InteractiveTimeSeries);