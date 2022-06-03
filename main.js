// import * as components from 'https://cdn.jsdelivr.net/npm/visualscript'
import * as bids from './src/standards/bids/src/index.js'
import * as components from './src/components/index.js'
import * as files from './src/files/src/index.js'
import xmlHEDScore from './HED_score_1.0.0.xml'

const rangeFillColor = '#d3d3d3'
const overlay = document.body.querySelector('visualscript-overlay')
const loader = document.body.querySelector('visualscript-loader')

const editorDiv = document.getElementById('editor')
const annotationApp = document.getElementById('annotation-app')
const artifactsDiv = document.getElementById('artifacts')

const errorDiv = document.getElementById('errors')
const warningDiv = document.getElementById('warnings')
const errorHeader = document.getElementById('errorsheader')
const warningHeader = document.getElementById('warningsheader')

const downloadButton = document.getElementById('download')
const tagControl = document.getElementById('tag')
const freeTextControl = document.getElementById('freetext')

// tagControl.style.display = 'none'

const HEDTagMap = {}
const handleXML = ({HED}) => {
    const options = new Set()
    const o = HED.schema[0]

    const filter = ['/EEG-artifact']
    const shortName = true

    const drillNodes = (o, base='') => {
      const emptyBase = base === ''
      const count = filter.reduce((a,b) => a + base.includes(b), 0)
      if (count || base === '') {
        const val = o.name?.[0]?.['_']

        if (o.name) {
          base += `/${val}`
          if (val !== '#'){
            const toInclude = !emptyBase || filter.includes(base)
            if (toInclude){
              HEDTagMap[val] = base // Intermediary tags
              options.add(val)
            }
          }
        }

        if (o.node) {
          o.node.forEach(o => drillNodes(o,base))
        } 
        
        // Final Tags
        else {
            if (shortName) {
              const split = base.split('/')
              const short = split.at(-1)
              const val = (short === '#') ? split.slice(split.length - 2).join('/') : short
              options.add(val)
              HEDTagMap[val] = base
            } else {
              options.add(base)
              HEDTagMap[base] = base
            }

          }
        }
    }

    drillNodes(o)
    tagControl.options = Array.from(options)
    toggleFreeFormInput(tagControl.element)
}

const toggleFreeFormInput = (target) => {
  const value = target.value ?? ''
  if (value.at(-1) === '#') {
    freeTextControl.style.display = ''
  } else freeTextControl.style.display = 'none'
}

tagControl.onChange = (ev) => {
  toggleFreeFormInput(ev.target)
}

const plotEvent = (eventInfo, method) => {

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
        fillcolor: rangeFillColor,
        opacity: 0.5,
        line: {
          width: 0
        },
        layer: 'below'
      })
    }

  return {annotations, shapes}
}



files.decode({text: xmlHEDScore}, 'application/xml').then(handleXML)

const editor = new components.ObjectEditor({ header: 'Dataset', plot: [(key, o) => key.includes('.edf')] })
editor.preprocess = async (o) => {
  if (o instanceof files.IterativeFile) return await o.get()
  else return o
}
const editor2 = new components.ObjectEditor({ header: 'First EDF File' })

let fallbackFileObject = {}
let fallbackEntryName = 'File'
const ungodlyLarge = Math.pow(10, 1000)
const preferredChannelPoints = ungodlyLarge // 10000
const totalMaxPoints = ungodlyLarge //1000000


const onPlot = async (thisEditor) => {


  if (bidsDataset){

  // Initialize Plot-Specific Function Scopes
  const allAnnotations = {}
  let lastAnnotation = null
  const numberToGet = 4
  const montage = Array.from({length: numberToGet}, e => true)

  const createAnnotationEditor = (info, section=true) => {

    if (section === true || section === 0){
      const div = document.createElement('div')
      div.classList.add('item')
      const controlDiv = document.createElement('div')
      const bold = document.createElement('b')
      const onset = document.createElement('onset')
      const button = document.createElement('visualscript-button')
      button.size = 'small'
      bold.innerHTML = info.artifact
      onset.innerHTML = info.onset
      button.innerHTML = 'Delete'
      button.classList.add('disabled')
      button.onClick = () => {
        div.remove()
        lastAnnotation = null
        delete info[info.offset]
        shapes = shapes.filter(o => o !== info.line && o !== info.range)
        thisEditor.timeseries.Plotly.relayout(thisEditor.timeseries.div, { shapes })
        bidsDataset.deleteHED(info.offset)
      }

      div.insertAdjacentElement('beforeend', bold)
      div.insertAdjacentElement('beforeend', onset)
      div.insertAdjacentElement('beforeend', controlDiv)
      controlDiv.insertAdjacentElement('beforeend', button)
      artifactsDiv.insertAdjacentElement('beforeend', div)
      info.div = div
      info.controlDiv = controlDiv
    }

    if (section === true || section === 1){
      const button = document.createElement('visualscript-button')
      button.innerHTML = 'Hide'
      button.primary = true
      button.size = 'small'

      button.onClick = () => {
        if (button.innerHTML === 'Hide') {
          info.range.opacity = 0
          button.innerHTML = 'Show'
        } else if (button.innerHTML === 'Show') {
          button.innerHTML = 'Hide'
          info.range.opacity = 0.5
        }
        thisEditor.timeseries.Plotly.relayout(thisEditor.timeseries.div, { shapes: thisEditor.timeseries.div.layout.shapes })
      }

      button.onmouseover = () => {
        info.range.fillcolor = 'lime'
        thisEditor.timeseries.Plotly.relayout(thisEditor.timeseries.div, { shapes: thisEditor.timeseries.div.layout.shapes })
      }

      button.onmouseout= () => {
        info.range.fillcolor = rangeFillColor
        thisEditor.timeseries.Plotly.relayout(thisEditor.timeseries.div, { shapes: thisEditor.timeseries.div.layout.shapes })
      }

      info.controlDiv.insertAdjacentElement('afterbegin', button)
    }

    return info
  }

  // Get Basic Info from the Editor
  let entryName, fileObject
  if (thisEditor.header.includes('.edf')){
    entryName = thisEditor.header
    fileObject = thisEditor.target
  } else {
    entryName = fallbackEntryName
    fileObject = fallbackFileObject
  }

  // Plot Existing HED Events
  const dataEvents = await bidsDataset.getEvents(entryName)

  const toPlot = {annotations: [], shapes: []}

  dataEvents.forEach(e => {

      // TODO: Only plot artifacts for now. Make this general for existing events!
      if (e.artifact && e.artifact != 'n/a'){

      const info = plotEvent(e, 'range')
      toPlot.shapes.push(...info.shapes ?? [])
      e.range = info.shapes[0]
      createAnnotationEditor(e)
    }
  })

  thisEditor.timeseries.config = {
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
    //     text: `Voltage (${fileObject.channels[0].dimensions})`,
    //     font: {
    //       size: 12,
    //       color: '#7f7f7f'
    //     }
    //   }
    // },
  }


  const overlap = 0.0 // TODO: Make the overlap work. This currently doesn't because the plots have a background...


  const channelSubset = fileObject.channels.slice(0,numberToGet)
  const n = channelSubset.length
  const maxPointsPerChannel = Math.floor(totalMaxPoints / n) // No limit right now

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

        // console.log('found', axisName, thisEditor.timeseries.div.layout[axisName], i)
        if (!thisEditor.timeseries.div.layout[axisName]) {
          thisEditor.timeseries.div.layout[axisName] = {
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
  
        
        update[axisName] = thisEditor.timeseries.div.layout[axisName]  ?? {}
        update[axisName].domain = [(count)/(n), (interval*overlap) + (count+1)/(n)]

        // console.log('Still Active', axisName, update[axisName].domain)
        count++

        // if (plot) thisEditor.timeseries.Plotly.relayout(thisEditor.timeseries.div, axisName, update[axisName]) // Update domain
      } else if (plot) {
        // update[axisName] = null
        // thisEditor.timeseries.Plotly.relayout(thisEditor.timeseries.div, axisName, null) // Remove domain
      }
    })

    if (plot) {
      // console.log('update',JSON.parse(JSON.stringify(update)))
      thisEditor.timeseries.Plotly.relayout(thisEditor.timeseries.div, update)
      // console.log('LAYOUT', JSON.parse(JSON.stringify(thisEditor.timeseries.layout)))
    }


    return update
  }


  thisEditor.timeseries.data = channelSubset.map((o,i) => {
    const show = !!montage?.[i]
    const channelSlice =  Math.min(preferredChannelPoints, maxPointsPerChannel)
    const y = (o.data.length < channelSlice) ?o.data : o.data.slice(0, channelSlice)
    return {
      name: o.label, //this.header,
      visible: show ? true : 'legendonly',
      line: {
        color: 'black',
        width: 1.0
      },
      y,
      yaxis: `y${i+2}`,
    }
  })

  
  thisEditor.timeseries.layout = Object.assign(layout, relayout(thisEditor.timeseries.data), false) // first layout

  // console.log('OG LAYOUT', JSON.parse(JSON.stringify(thisEditor.timeseries.layout)))

    // TODO: Relayout the Channels on the Y Axis
    // thisEditor.timeseries.onLegendClick = (data) => {
    //   const focusObject = data.node.__data__[0].trace
    //   const toggleOn = focusObject.visible === 'legendonly'
    //   const which = data.data.findIndex(o => o.name === focusObject.name)
    //   relayout(data.data, {on: toggleOn, i: which}, true)
    //   // return false
    // }

  // Create New HED Events
  thisEditor.timeseries.onClick = async (data) => {
    for (var i = 0; i < data.points.length; i++) {
      const point = data.points[i]

      // let annotations = thisEditor.timeseries.div.layout.annotations || []
      let shapes = thisEditor.timeseries.div.layout.shapes || []

      let annotation = allAnnotations[lastAnnotation ?? point.x]
      if (!annotation) {

        annotation = allAnnotations[point.x] = {}

        const shortTag = tagControl.element.value
        const freeText = freeTextControl.element.value
        let fullTag = HEDTagMap[shortTag] ?? ''
        if (!fullTag) console.warn('Full tag not found', shortTag)

        if (fullTag && fullTag.includes('#')) {
          if (freeText) fullTag = fullTag.replace('#', freeText)
          else fullTag = fullTag.replace('/#', '') // Remove free text area
        }
        annotation.fullTag = fullTag
        annotation.artifact = shortTag.replace('#', freeText)
        lastAnnotation = annotation.onset = point.x
        // annotation[point.x].y = point.y

        annotation = createAnnotationEditor(annotation, 0)

        // Plot Line
        const toPlot = plotEvent(annotation, 'line') 
        annotation.line = toPlot.shapes[0]
        shapes.push(...toPlot.shapes ?? [])

      } else {

        // Specify Info to Add HED Tag
        const hedInfo = {
          header: 'artifact',
          tag: annotation.fullTag,
          code: annotation.artifact
        }

        const eventInfo = {
          onset: Math.min(point.x, annotation.onset),
          duration: Math.abs(point.x - annotation.onset),
          artifact: hedInfo.code // Redundant...
        }

        const toPlot = plotEvent(eventInfo, 'range') 
        shapes.push(...toPlot.shapes ?? [])

        annotation.range = toPlot.shapes[0]

        bidsDataset.addHED(hedInfo, eventInfo, entryName)

        // Interact with the Annotation
        createAnnotationEditor(annotation, 1)

        // Remove Line
        shapes = thisEditor.timeseries.div.layout.shapes = shapes.filter(o => o !== annotation.line)

        lastAnnotation = null
      }

      // Relayout the Plot
      thisEditor.timeseries.Plotly.relayout(
        thisEditor.timeseries.div, 
        { 
          // annotations, 
          shapes 
        }
      )

    }
  }
  }
}

editor2.onPlot = onPlot
editor.onPlot = onPlot

editorDiv.appendChild(editor)
annotationApp.appendChild(editor2)

let bidsDataset = null
const dataset = document.getElementById('dataset')

const xmlSelector = document.getElementById('xml')
xmlSelector.onChange = async (ev) => {

  tagControl.style.display = 'block'

  const file = ev.target.files[0]
  files.get(file).then(handleXML)
}

// --------------- Create a BIDS Dataset ---------------
dataset.onChange = async (ev) => {

  const files = ev.target.files
  bidsDataset = new bids.BIDSDataset({
    ignoreWarnings: false,
    ignoreNiftiHeaders: false,
    ignoreSubjectConsistency: false,
    // debug: true
  })

  loader.text = 'Validating Dataset'
  overlay.open = true

  const info = await bidsDataset.validate(files)
  loader.text = 'Parsing Dataset Files'

  await bidsDataset.load(files, (ratio) => {
    loader.progress = ratio
  })


  loader.text = 'Plotting Dataset Files'


  console.log(bidsDataset)

  // overlayDiv.innerHTML = 'Dataset loaded!'

  // Register Actual Directories
  if (Object.values(bidsDataset.files.system).length) {
    editor.set(bidsDataset.files.system)

    // Plot Default Data
    const allEDFFiles = bidsDataset.files.types.edf
    if (allEDFFiles){
      setTimeout(() => {
            Object.values(allEDFFiles)[0].get().then(res => {
              fallbackFileObject = res 
              fallbackEntryName = `${Object.keys(allEDFFiles)[0]}.edf`
              editor2.set({}, true) // Force plot
              overlay.open = false
            })
      }, 500)
    } else overlay.open = false


    showValidation(info)

  }
}

const showValidation = (info) => {

  errorDiv.innerHTML = ''
  warningDiv.innerHTML = ''


  const createView = (o, i, type = 'error') => {
    return `
    <div class=${type}>
      <h5>${i + 1}: [${o.code}] ${o.key}</h5>
      <a href=${o.helpUrl}>Click here for more information about this issue</a>
      <p><small>${o.reason}</small></p>
      <span>${o.files.length} files.</span>
      <ul>
        ${o.files.map((file, j) => `<li><p><b>File ${j}</b> - ${file?.file?.name}<p><p><small><b>Evidence:</b> ${file.evidence}</small></li>`).join('')}
      </ul>
    <div>
    `
  }

  console.log('Info', info)
  if (info.errors) {
    if (info.errors.length > 0) errorHeader.style.display = 'block'
    else errorHeader.style.display = ''
    info.errors.forEach((error, i) => {
      errorDiv.insertAdjacentHTML('beforeend', createView(error, i, 'error'))
    })
  }

    if (info.warnings) {
      if (info.warnings.length > 0) warningHeader.style.display = 'block'
      else warningHeader.style.display = ''
      info.warnings.forEach((warning, i) => {
        warningDiv.insertAdjacentHTML('beforeend', createView(warning, i, 'warning'))
      })
    }
}

downloadButton.onClick = async () => {
  if (bidsDataset) {
    loader.progress = 0 // Reset loader
    overlay.open = true
    const info = await bidsDataset.zipCheck({}, (ratio) => {
      loader.text = 'Zipping Edited Dataset'
      loader.progress = ratio
    }, (ratio) => {
      loader.text = 'Unzipping Dataset to Validate'
      loader.progress = ratio
    }) // Show potential errors in your download
    showValidation(info)
    loader.text = 'Downloading Edited Dataset'
    await bidsDataset.download(true, info) // Auto-override the lock on downloading because of errors
    overlay.open = false
  }
}