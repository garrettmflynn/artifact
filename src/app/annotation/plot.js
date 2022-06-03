import * as defaults from './defaults.js'

export default (eventInfo, method) => {

    const annotations = [];
    const shapes = [];
  
      // TODO: Move this outside of the for loop for performant batch processing
      const onset = parseFloat(new Number(eventInfo.onset))
      const duration = parseFloat(new Number(eventInfo.duration) ?? 1) // May be n/a
      const y = parseFloat(new Number(eventInfo.y ?? 0)) // TODO: Derive y from data file...
  
      if (!method || method === 'line'){
  
          shapes.push({
            type: 'line',
            xref: 'x',
            yref: 'paper',
            x0: onset,
            y0: 0,
            x1: onset,
            y1: 1,
            fillcolor: 'black',
            opacity: 1.0,
            line: {
              width: 1
            },
            layer: 'below'
          })
  
      }
  
  
      if (!method || method === 'range'){
        shapes.push({
          type: 'rect',
          xref: 'x',
          yref: 'paper',
          x0: onset,
          y0: 0,
          x1: onset + duration,
          y1: 1,
          fillcolor: defaults.range.fill,
          opacity: 0.5,
          line: {
            width: 0
          },
          layer: 'below'
        })
      }
  
    return {annotations, shapes}
  }