// import * as components from 'https://cdn.jsdelivr.net/npm/visualscript'
import * as bids from './src/standards/bids/src/index.js'
import * as components from './src/components/index.js'
import * as files from './src/files/src/index.js'
import xmlHEDScore from './HED_score_1.0.0.xml'

const overlay = document.body.querySelector('visualscript-overlay')
const loader = document.body.querySelector('visualscript-loader')

const editorDiv = document.getElementById('editor')
const annotationApp = document.getElementById('annotation-app')

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

    // TODO: Only plot artifacts for now. Make this general for existing events!
    if (eventInfo.artifact && eventInfo.artifact != 'n/a'){

    if (!method || method === 'annotation'){

          // Display short tag as the annotation
          const shortTag = eventInfo.artifact.split('/').at(-1)
          const annotate_text = `<b>${shortTag}</b>` // TODO: Specific to artifact annotation

          annotations.push({
            text: annotate_text,
            x: onset,
            y: y
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
editor.preprocess = async (o) => {
  if (o instanceof files.IterativeFile) return await o.get()
  else return o
}
const editor2 = new components.ObjectEditor({ header: 'First EDF Channel' })

// const nestDepth = 2 // Expected depth of .edf channel data
let fallbackFileObject = {}
let fallbackEntryName = 'File'
let fallbackChannelInfo = {}


const onPlot = async (thisEditor) => {

  if (bidsDataset){

  // const maxNum = 1000000 // TODO: Should we keep or remove for performance?
  const entryName = thisEditor.history.at(-3)?.key ?? fallbackEntryName
  const channelInfo = thisEditor.history.at(-1)?.parent ?? fallbackChannelInfo

  // console.log('Original Data Length', channelInfo.data.length)
  // const y = (channelInfo.data.length < maxNum) ? channelInfo.data : channelInfo.data.slice(0, maxNum)
  // console.log('New Data Length', y.length)

  let hedAnnotation = {}

  // Plot Existing HED Events
  const hedEvents = await bidsDataset.getEvents(entryName)

  const toPlot = {annotations: [], shapes: []}
  hedEvents.forEach(e => {
    const info = plotEvent(e)
    toPlot.annotations.push(...info.annotations ?? [])
    toPlot.shapes.push(...info.shapes ?? [])
  })
  
  thisEditor.timeseries.data = [
    {
      name: channelInfo.label, //this.header,
      y: thisEditor.target
    }
  ]

  thisEditor.timeseries.layout = {
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
  thisEditor.timeseries.onClick = async (data) => {
    for (var i = 0; i < data.points.length; i++) {
      const point = data.points[i]

      const annotations = thisEditor.timeseries.div.layout.annotations || []
      const shapes = thisEditor.timeseries.div.layout.shapes || []

      if (!hedAnnotation.onset) {

        const shortTag = tagControl.element.value
        const freeText = freeTextControl.element.value
        let fullTag = HEDTagMap[shortTag]

        if (fullTag.includes('#')) {
          if (freeText) fullTag = fullTag.replace('#', freeText)
          else fullTag = fullTag.replace('/#', '') // Remove free text area
        }
        hedAnnotation.fullTag = fullTag
        hedAnnotation.artifact = shortTag.replace('#', freeText)
        hedAnnotation.onset = point.x
        hedAnnotation.y = point.y

        const toPlot = plotEvent(hedAnnotation, 'annotation') 
        annotations.push(...toPlot.annotations ?? [])
      } else {

        // Specify Info to Add HED Tag
        const hedInfo = {
          header: 'artifact',
          tag: hedAnnotation.fullTag,
          code: hedAnnotation.artifact
        }

        const eventInfo = {
          onset: Math.min(point.x, hedAnnotation.onset),
          duration: Math.abs(point.x - hedAnnotation.onset),
          artifact: hedInfo.code // Redundant...
        }

        const toPlot = plotEvent(eventInfo, 'shape') 
        shapes.push(...toPlot.shapes ?? [])

        bidsDataset.addHED(hedInfo, eventInfo, entryName)
        delete hedAnnotation.onset
      }

      // Relayout the Plot
      thisEditor.timeseries.Plotly.relayout(thisEditor.timeseries.div, { annotations, shapes })

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
    debug: true
  })

  loader.text = 'Validating Dataset'
  overlay.open = true

  const info = await bidsDataset.validate(files)
  loader.text = 'Parsing Dataset Files'

  await bidsDataset.load(files, (ratio) => {
    loader.progress = ratio
  })

  console.log(bidsDataset)

  // overlayDiv.innerHTML = 'Dataset loaded!'

  // Register Actual Directories
  if (Object.values(bidsDataset.files.system).length) {
    editor.set(bidsDataset.files.system)

    // Plot Default Data
    const allEDFFiles = bidsDataset.files.types.edf
    if (allEDFFiles){
        fallbackFileObject = await Object.values(allEDFFiles)[0].get()
        fallbackEntryName = `${Object.keys(allEDFFiles)[0]}.edf`
        fallbackChannelInfo = fallbackFileObject.channels[0]
        editor2.set(fallbackChannelInfo.data, true) // Force plot

        showValidation(info)
    }

  }

  overlay.open = false
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
        ${o.files.map((file, j) => `<li>File ${j} - ${file?.file?.name}</li>`).join('')}
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