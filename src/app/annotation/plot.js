import * as defaults from './defaults.js'

export default (eventInfo, method) => {

    const annotations = [];
    const shapes = [];
  
      const sps = parseFloat(new Number(eventInfo.sps))

      // TODO: Move this outside of the for loop for performant batch processing
      const onsetSeconds = parseFloat(new Number(eventInfo.onset))
      const durationSeconds = parseFloat(new Number(eventInfo.duration) ?? 1) // May be n/a
      // const y = parseFloat(new Number(eventInfo.y ?? 0)) // TODO: Derive y from data file...
  
      const onsetClosestPoint = Math.round(onsetSeconds * sps)
      const durationClosestPointLength = Math.round(durationSeconds * sps)
      
      if (!method || method === 'line'){
  
          shapes.push({
            type: 'line',
            xref: 'x',
            yref: 'paper',
            x0: onsetClosestPoint,
            y0: 0,
            x1: onsetClosestPoint,
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
          x0: onsetClosestPoint,
          y0: 0,
          x1: onsetClosestPoint + durationClosestPointLength,
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