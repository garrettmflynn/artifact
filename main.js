// import * as components from 'https://cdn.jsdelivr.net/npm/visualscript'
import * as bids from './src/standards/bids/src/index.js'
import * as components from './src/components/index.js'
import * as files from './src/files/src/index.js'
import * as templates from './src/standards/bids/src/templates.js'

import xmlHEDScore from './HED_score_1.0.0.xml'

const editorDiv = document.getElementById('editor')
const errorDiv = document.getElementById('errors')
const warningDiv = document.getElementById('warnings')
const downloadButton = document.getElementById('download')
const tagControl = document.getElementById('tag')
const freeTextControl = document.getElementById('freetext')

// tagControl.style.display = 'none'

const deepClone = (o) => JSON.parse(JSON.stringify(o))

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
            const val = base.split('/').at(-1)
            if (val === '#') options.add(base)
            else options.add(val)
          } else {
            options.add(base)
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



files.decode({text: xmlHEDScore}, 'application/xml').then(handleXML)

const getSidecar = (o) => {
  const jsonSidecarName = Object.keys(o).find(str => str.includes('_events.json'))
  let jsonSidecar = o[jsonSidecarName]
  console.log('jsonSidecar', jsonSidecar)
  if (!jsonSidecar) jsonSidecar = o[jsonSidecarName] = {} // Create JSON sidecar
  return jsonSidecar
}


const addHEDTag = (hed, eventInfo, fileName, modalityFileDirectory, history, method="inheritance") => {

    // Account for Missing Info
    if (!hed.code) hed.code = hed.tag
    if (!hed.label) hed.label = hed.code

    // Get Event .tsv File
    const fileSplit = fileName.split('_')
    const fileCoreName = fileSplit.slice(0, fileSplit.length - 1).join('_')

    const expectedFileName = `${fileCoreName}_events.tsv`
    console.log('directory', modalityFileDirectory)
    console.log('expectedFileName', expectedFileName)

    const foundFileName = Object.keys(modalityFileDirectory).find(str => str.includes(fileCoreName) && str.includes('_events.tsv'))
    let tsvEventFile = (!foundFileName) ? modalityFileDirectory[expectedFileName] = [] : modalityFileDirectory[foundFileName]
    console.log('tsvEventFile', tsvEventFile)

    const eventTemplate = deepClone(tsvEventFile[0]) ?? templates // Add structured event
    eventInfo[hed.code] = hed.label // Associate code and label
    tsvEventFile.push(Object.assign(eventTemplate, eventInfo))

    // Inherit from a Top-Level JSON Sidecar
    let sidecarDir;
    if (method === 'long') sidecarDir = history[0].parent

    // Inherit from a Subject-Specific JSON Sidecar
    else sidecarDir = history.at(-1).parent

    const jsonSidecar = getSidecar(sidecarDir)
    if (!jsonSidecar[hed.code]) jsonSidecar[hed.code] = (method === 'long') ? longSidecarTemplate : eventTemplate
    // if (!jsonSidecar[hed.code]) jsonSidecar[hed.code] = eventTemplate
    if (!jsonSidecar[hed.code].Levels[hed.label]) jsonSidecar[hed.code].Levels[hed.label] = 'Insert description here'
    if (!jsonSidecar[hed.code].HED[hed.label]) jsonSidecar[hed.code].HED = hed.tag // String

    console.log('jsonSidecar', jsonSidecar)

}


const editor = new components.ObjectEditor({ header: 'Dataset', plot: ['data'] })
editor.onPlot = () => {

  const maxNum = 1000000
  const entryName = editor.history.at(-3).key
  const channelInfo = editor.history.at(-1).parent
  console.log('Original Data Length', channelInfo.data.length)
  const y = (channelInfo.data.length < maxNum) ? channelInfo.data : channelInfo.data.slice(0, maxNum)
  console.log('New Data Length', y.length)


  editor.timeseries.data = [
    {
      name: channelInfo.label, //this.header,
      y: editor.target
    }
  ]

  editor.timeseries.layout = {
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

  let hedAnnotation = {}

  editor.timeseries.onClick = (data) => {
    for (var i = 0; i < data.points.length; i++) {
      const point = data.points[i]

      const annotations = editor.timeseries.div.layout.annotations || [];
      const shapes = editor.timeseries.div.layout.shapes || [];

      if (!hedAnnotation.x) {
        hedAnnotation.tag = tagControl.element.value.replace('#', freeTextControl.element.value)
        const annotate_text = `<b>${hedAnnotation.tag}</b>`
        hedAnnotation.x = point.x
        annotations.push({
          text: annotate_text,
          x: parseFloat(point.x.toPrecision(4)),
          y: parseFloat(point.y.toPrecision(4))
        });
      }
      else {
        shapes.push({
          type: 'rect',
          xref: 'x',
          yref: 'paper',
          x0: hedAnnotation.x,
          y0: 0,
          x1: point.x,
          y1: 1,
          fillcolor: '#d3d3d3',
          opacity: 0.7,
          line: {
            width: 0
          },
          layer: 'below'
        })


        // Specify Info to Add HED Tag
        const eventInfo = {
          onset: hedAnnotation.x,
          duration: 'n/a',
          [hedAnnotation.tag]: hedAnnotation.tag // FIX!
        }

        const nestDepth = 2 // Expected depth of .edf channel data
        const history = editor.history.slice(0, editor.history.length - nestDepth)
        console.log('RevisedHistory', history)
        const fileHistoryObject = history.pop()
        const modalityHistoryObject = history.pop()
        console.log('modalityHistoryObject', modalityHistoryObject)

        addHEDTag(hedAnnotation, eventInfo, fileHistoryObject.key, modalityHistoryObject.parent, history, 'inheritance')




        delete hedAnnotation.x
      }

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

  info.errors.forEach((error, i) => {
    errorDiv.insertAdjacentHTML('beforeend', createView(error, i, 'Error'))
  })

  info.warnings.forEach((warning, i) => {
    warningDiv.insertAdjacentHTML('beforeend', createView(warning, i, 'Warning'))
  })
}

downloadButton.onClick = async () => {
  if (bidsDataset) {
    const info = await bidsDataset.download(true) // Auto-override the lock on downloading because of errors
    if (info) showValidation(info)
  }
}