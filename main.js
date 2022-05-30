// import * as components from 'https://cdn.jsdelivr.net/npm/visualscript'
import * as bids from './src/standards/bids/src/index.js'
import * as components from './src/components/index.js'
import * as files from './src/files/src/index.js'
import * as hed from './src/standards/bids/src/hed.js'

import xmlHEDScore from './HED_score_1.0.0.xml'

const editorDiv = document.getElementById('editor')
const errorDiv = document.getElementById('errors')
const warningDiv = document.getElementById('warnings')
const downloadButton = document.getElementById('download')
const tagControl = document.getElementById('tag')
const freeTextControl = document.getElementById('freetext')

// tagControl.style.display = 'none'

const fullHEDTagMap = {}
const handleXML = ({HED}) => {
    const options = new Set()
    const o = HED.schema[0]

    const filter = ['/EEG-artifact']
    const shortName = true

    const drillNodes = (o, base) => {
      if (o.name) base += `/${o.name[0]['_']}`
      if (o.node) {
        o.node.forEach(o => drillNodes(o,base))
      } else {
        const count = filter.reduce((a,b) => a + base.includes(b), 0)
        if (count) {
          if (shortName) {
            const short = base.split('/').at(-1)
            const val = (short === '#') ? base : short
            options.add(val)
            fullHEDTagMap[val] = base
          } else {
            options.add(base)
            fullHEDTagMap[base] = base
          }

        }
      }
    }

    drillNodes(o,'')
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

  // TODO: Only plot artifacts for now. Make this general for existin gevents!
  if (eventInfo.artifact != 'n/a'){

    // TODO: Move this outside of the for loop for performant batch processing
    const onset = parseFloat(new Number(eventInfo.onset))
    const duration = parseFloat(new Number(eventInfo.duration) ?? 1) // May be n/a
    const y = parseFloat(new Number(eventInfo.y ?? 0)) // TODO: Derive y from data file...

    if (!method || method === 'annotation'){

        // Display short tag as the annotation
        const shortTag = eventInfo.artifact.split('/').at(-1)
        const annotate_text = `<b>${shortTag}</b>` // TODO: Specific to artifact annotation

        annotations.push({
          text: annotate_text,
          x: parseFloat(onset.toPrecision(4)),
          y: parseFloat(y.toPrecision(4))
        });
    }


    if (!method || method === 'shape'){
      shapes.push({
        type: 'rect',
        xref: 'x',
        yref: 'paper',
        x0: onset,
        y0: 0,
        x1: onset + duration,
        y1: 1,
        fillcolor: '#d3d3d3',
        opacity: 0.7,
        line: {
          width: 0
        },
        layer: 'below'
      })
    }
  }

  return {annotations, shapes}
}



files.decode({text: xmlHEDScore}, 'application/xml').then(handleXML)

const editor = new components.ObjectEditor({ header: 'Dataset', plot: ['data'] })
editor.onPlot = () => {

  // const maxNum = 1000000 // TODO: Should we keep or remove for performance?
  const entryName = editor.history.at(-3).key
  const channelInfo = editor.history.at(-1).parent
  // console.log('Original Data Length', channelInfo.data.length)
  // const y = (channelInfo.data.length < maxNum) ? channelInfo.data : channelInfo.data.slice(0, maxNum)
  // console.log('New Data Length', y.length)

  let hedAnnotation = {}

  // Plot Existing HED Events
  const nestDepth = 2 // Expected depth of .edf channel data
  const history = editor.history.slice(0, editor.history.length - nestDepth)
  const fileHistoryObject = history.pop()
  const focusFileName = fileHistoryObject.key
  const modalityHistoryObject = history.pop()
  const focusDirectory = modalityHistoryObject.parent
  const hedEvents = hed.getEvents(focusFileName, focusDirectory)
        
  const toPlot = {annotations: [], shapes: []}
  hedEvents.forEach(e => {
    const info = plotEvent(e)
    toPlot.annotations.push(...info.annotations ?? [])
    toPlot.shapes.push(...info.shapes ?? [])
  })
  
  editor.timeseries.data = [
    {
      name: channelInfo.label, //this.header,
      y: editor.target
    }
  ]

  editor.timeseries.layout = {
    annotations: toPlot.annotations,
    shapes: toPlot.shapes,
    title: `${entryName} - ${channelInfo.label}`,
    yaxis: {
      title: {
        text: `Voltage (${channelInfo.dimensions})`,
        font: {
          size: 12,
          color: '#7f7f7f'
        }
      },
      // autorange: true,
      range: [channelInfo.phys_min, channelInfo.phys_max],
      type: 'linear',
      fixedrange: false
    },
    xaxis: {
      // rangeselector: selectorOptions,
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
    // yaxis: {
    //     fixedrange: true
    // }
  }

  // Create New HED Events
  editor.timeseries.onClick = (data) => {
    for (var i = 0; i < data.points.length; i++) {
      const point = data.points[i]

      const annotations = editor.timeseries.div.layout.annotations || []
      const shapes = editor.timeseries.div.layout.shapes || []

      if (!hedAnnotation.onset) {
        const shortTag = tagControl.element.value
        hedAnnotation.fullTag = fullHEDTagMap[shortTag]
        hedAnnotation.artifact = shortTag.replace('#', freeTextControl.element.value)
        hedAnnotation.onset = point.x
        hedAnnotation.y = point.y

        const toPlot = plotEvent(hedAnnotation, 'annotation') 
        annotations.push(...toPlot.annotations ?? [])
      } else {

        // Specify Info to Add HED Tag
        const hedInfo = {
          header: 'artifact',
          tag: hedAnnotation.fullTag,
          code: hedAnnotation.tag
        }

        const eventInfo = {
          onset: Math.min(point.x, hedAnnotation.onset),
          duration: Math.abs(point.x - hedAnnotation.onset),
          artifact: hed.code // Redundant...
        }

        const toPlot = plotEvent(eventInfo, 'shape') 
        shapes.push(...toPlot.shapes ?? [])

        hed.add(hedInfo, eventInfo, focusFileName, focusDirectory, history, 'inheritance')
        delete hedAnnotation.onset
      }

      // Relayout the Plot
      editor.timeseries.Plotly.relayout(editor.timeseries.div, { annotations, shapes })

    }
  }
}

editorDiv.appendChild(editor)

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
  })

  const info = await bidsDataset.validate(files)
  await bidsDataset.load(files)

  console.log(bidsDataset)

  // Register Actual Directories
  if (bidsDataset.files.system) {
    editor.set(bidsDataset.files.system)
    // console.log(editor, editor.target, bidsDataset.files.system)
  }

  showValidation(info)
}

const showValidation = (info) => {

  errorDiv.innerHTML = ''
  warningDiv.innerHTML = ''


  const createView = (o, i, type = 'Error') => {
    return `
    <h5>${type} ${i + 1}: [${o.code}] ${o.key}</h5>
    <a href=${o.helpUrl}>Click here for more information about this issue</a>
    <p><small>${o.reason}</small></p>
    <span>${o.files.length} files.</span>
    <ul>
      ${o.files.map((file, j) => `<li>File ${j} - ${file?.file?.name}</li>`).join('')}
    </ul>
    `
  }

  console.log('Info', info)
  if (info.errors) info.errors.forEach((error, i) => {
      errorDiv.insertAdjacentHTML('beforeend', createView(error, i, 'Error'))
    })

    if (info.warnings) info.warnings.forEach((warning, i) => {
      warningDiv.insertAdjacentHTML('beforeend', createView(warning, i, 'Warning'))
    })
}

downloadButton.onClick = async () => {
  if (bidsDataset) {
    const info = await bidsDataset.check() // Show potential errors in your download
    showValidation(info)
    await bidsDataset.download(true) // Auto-override the lock on downloading because of errors
  }
}