import * as xml from '../xml.js'
import * as dataset from '../dataset.js'
import * as annotation from '../annotation/index.js'
import * as plotDefaults from '../plot/defaults.js'

export default async (editor) => {


    if (dataset.bids){
  
    // Initialize Plot-Specific Function Scopes
    const entries = {}
    let lastEntry = null
    const montage = Array.from({length: plotDefaults.channels.n}, e => true)
  
    // Get Basic Info from the Editor
    let entryName, fileBody

    if (editor.header.includes('.edf')){
      entryName = editor.header
      fileBody = editor.target
    } else {
      entryName = dataset.fallback.name
      fileBody = dataset.fallback.file
    }

    // Get Channel Metadata
    const sps = await fileBody.samplingRate // ASSUMPTION: Ground-truth sampling rate is in EDF file

    // Plot Existing HED Events
    const dataEvents = await dataset.bids.getEvents(entryName, {create: false})

    const toPlot = {annotations: [], shapes: []}
  
    if (!dataEvents) console.warn(`No events.tsv file found for ${entryName}!`)
    else {
      dataEvents.forEach(e => {
    
          // TODO: Only plot artifacts for now. Make this general for existing events!
          if (e.annotation_type && e.annotation_type != 'n/a'){
            console.log('Existing HED Event', e)

            // Grab important information
            const eventInfo = {
              onset: e.onset,
              duration: e.duration,
              annotation_type: e.annotation_type, // Redundant...
              sps
            }
    
            const info = annotation.plot(eventInfo, 'range')
            toPlot.shapes.push(...info.shapes ?? [])
            eventInfo.range = info.shapes[0]
            annotation.control(eventInfo, {editor: editor})
          } else console.warn('Existing event that is not plotted', e)
      })
    }
  
    editor.timeseries.config = {
      modeBarButtonsToRemove: ['zoomIn2d','zoomOut2d', 'autoScale2d']
    }
  
    const layout = {
      legend: {
        traceorder: 'reversed'
      },
      annotations: toPlot.annotations,
      shapes: toPlot.shapes,
      // title: `${entryName}`,
      dragmode: 'pan',
      xaxis: {
        rangemode: 'tozero',
        range: [0, 1500], // TODO: Set to 5 seconds
        rangeslider: {},
        title: {
          text: `Sample Number`,
          font: {
            size: 12,
            color: '#7f7f7f'
          }
        },
      },
      hovermode: 'closest',
      // yaxis:  {
      //   domain: [0,1],
      //   // autorange: true,
      //   // showgrid: true,
      //   // zeroline: false,
      //   // showline: false,
      //   // autotick: false,
      //   // ticks: '',
      //   // showticklabels: false,
      //   // fixedrange: true,
      //   title: {
      //     text: `Voltage (${fileBody.channels[0].dimensions})`,
      //     font: {
      //       size: 12,
      //       color: '#7f7f7f'
      //     }
      //   }
      // },
    }
  
  
    const overlap = 0.0 // TODO: Make the overlap work. This currently doesn't because the plots have a background...
  
  
    const channelSubset = fileBody.channels.slice(0,plotDefaults.channels.n)

    const n = channelSubset.length
    const maxPointsPerChannel = Math.floor(plotDefaults.channels.points.max / n) // No limit right now
  
    const relayout = (traces, change={}, plot=true) => {
  
      const update = {}
  
      let n = traces.reduce((a,b) => a + parseInt(new Number(b.visible === true)), 0)
      if (change.on === true) n++
      if (change.on === false) n--
  
      // console.log('change.on', change.on, n)
  
      const interval = 1 / n
  
      let count = 0
      traces.forEach((o,i) => {
        const case1 = o.visible === true
        const case21 = change.i === i
        const case22 = change.on === true
  
        const changeLayout = (case1 && !case21) || (case21 && case22)
  
        // Initialize Axis
        const axisName = `yaxis${i+2}`
        if (changeLayout){
  
          // console.log('found', axisName, editor.timeseries.div.layout[axisName], i)
          if (!editor.timeseries.div.layout[axisName]) {
            editor.timeseries.div.layout[axisName] = {
              showgrid: false,
              zeroline: false,
              showline: true,
              autotick: true,
              ticks: '',
              showticklabels: false,
              autorange: true,
              // range: [o.phys_min, o.phys_max],
              type: 'linear',
            }
          }
    
          
          update[axisName] = editor.timeseries.div.layout[axisName]  ?? {}
          update[axisName].domain = [(count)/(n), (interval*overlap) + (count+1)/(n)]
  
          // console.log('Still Active', axisName, update[axisName].domain)
          count++
  
          // if (plot) editor.timeseries.Plotly.relayout(editor.timeseries.div, axisName, update[axisName]) // Update domain
        } else if (plot) {
          // update[axisName] = null
          // editor.timeseries.Plotly.relayout(editor.timeseries.div, axisName, null) // Remove domain
        }
      })
  
      if (plot) {
        // console.log('update',JSON.parse(JSON.stringify(update)))
        editor.timeseries.Plotly.relayout(editor.timeseries.div, update)
        // console.log('LAYOUT', JSON.parse(JSON.stringify(editor.timeseries.layout)))
      }
  
  
      return update
    }
  
  
    editor.timeseries.data = await Promise.all(channelSubset.map(async (o,i) => {
      const show = !!montage?.[i]

      const data = await o.data

      const channelSlice =  Math.min(plotDefaults.channels.points.preferred, maxPointsPerChannel)
      const y = (data.length < channelSlice) ? data : data.slice(0, channelSlice)

      return {
        name: await o.label, //this.header,
        visible: show ? true : 'legendonly',
        line: {
          color: 'black',
          width: 1.0
        },
        y,
        yaxis: `y${i+2}`,
      }
    }))
  
    
    editor.timeseries.layout = Object.assign(layout, relayout(editor.timeseries.data), false) // first layout
  
    // console.log('OG LAYOUT', JSON.parse(JSON.stringify(editor.timeseries.layout)))
  
      // TODO: Relayout the Channels on the Y Axis
      // editor.timeseries.onLegendClick = (data) => {
      //   const focusObject = data.node.__data__[0].trace
      //   const toggleOn = focusObject.visible === 'legendonly'
      //   const which = data.data.findIndex(o => o.name === focusObject.name)
      //   relayout(data.data, {on: toggleOn, i: which}, true)
      //   // return false
      // }
  
    // Create New HED Events
    editor.timeseries.onClick = async (data) => {
      for (var i = 0; i < data.points.length; i++) {
        const point = data.points[i]
  
        // let annotations = editor.timeseries.div.layout.annotations || []
        let shapes = editor.timeseries.div.layout.shapes || []



        const onset = point.x / sps

        let entry = entries[lastEntry ?? onset]
        if (!entry) {
  
          entry = entries[onset] = {sps} // Always include sampling rate
  
          const shortTag = xml.tag.element.value
          const freeText = xml.text.element.value

          let fullTag = xml.map[shortTag] ?? ''
          if (!fullTag) console.warn('Full tag not found', shortTag)

          if (fullTag && fullTag.includes('#')) {
            if (freeText) fullTag = fullTag.replace('#', freeText)
            else fullTag = fullTag.replace('/#', '') // Remove free text area
          }
          entry.fullTag = fullTag
          
          entry.annotation_type = shortTag.replace('#', freeText) // make these
          lastEntry = entry.onset = onset
          // annotation[point.x].y = point.y
  
          entry = annotation.control(entry, {
            editor: editor,
            section: 0
          })
  
          // Plot Line
          const toPlot = annotation.plot(entry, 'line') 
          entry.line = toPlot.shapes[0]
          shapes.push(...toPlot.shapes ?? [])
  
        } else {
  
          // Specify Info to Add HED Tag
          const hedInfo = {
            header: 'annotation_type',
            tag: entry.fullTag,
            code: entry.annotation_type
          }

  
          const eventInfo = {
            onset: Math.min(onset, entry.onset),
            duration: Math.abs(onset - entry.onset),
            annotation_type: hedInfo.code, // Redundant...
            sps: entry.sps
          }
  
          const toPlot = annotation.plot(eventInfo, 'range') 
          shapes.push(...toPlot.shapes ?? [])
  
          entry.range = toPlot.shapes[0]
  
          dataset.bids.addHED(hedInfo, eventInfo, entryName)
  
          // Interact with the Annotation
          annotation.control(entry, {
            editor: editor,
            section: 1
          })
  
          // Remove Line
          shapes = editor.timeseries.div.layout.shapes = shapes.filter(o => o !== entry.line)
  
          lastEntry = null
        }
  
        // Relayout the Plot
        editor.timeseries.Plotly.relayout(
          editor.timeseries.div, 
          { 
            // annotations, 
            shapes 
          }
        )
  
      }
    }
    }
  }
  