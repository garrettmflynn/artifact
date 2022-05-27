// import * as components from 'https://cdn.jsdelivr.net/npm/visualscript'
import * as bids from './src/standards/bids/src/index.js'
import * as components from './src/components/index'


const editorDiv = document.getElementById('editor')
const errorDiv = document.getElementById('errors')
const warningDiv = document.getElementById('warnings')
const downloadButton = document.getElementById('download')
const tagControl = document.getElementById('tag')
tagControl.options = ['Event/Something', 'Event/Other']

const graphContainer = document.getElementById('graph')
const timeseries = new components.InteractiveTimeSeries({
  Plotly
})

graphContainer.appendChild(timeseries)

const editor = new components.ObjectEditor({header: 'Dataset'})
editor.style.color = 'black'
editorDiv.appendChild(editor)

let bidsDataset = null
const dataset = document.getElementById('dataset')

// --------------- Create a BIDS Dataset ---------------
dataset.onChange = async (ev) => {
  const files = ev.target.files
    bidsDataset = new bids.BIDSDataset({
      ignoreWarnings: false,
      ignoreNiftiHeaders: false,
      ignoreSubjectConsistency: false,
    })

    const info = await bidsDataset.validate(files)
    const {filesystem} = await bidsDataset.load(files)

    console.log(bidsDataset)
    if ('edf' in bidsDataset.files.types) {
      const firstEntry = Object.entries(bidsDataset.files.types.edf)[0]
      const channelInfo = firstEntry[1].channels[0]
      console.log('EDF first subject + session', firstEntry, channelInfo)
      timeseries.data =  [
        {
          name: channelInfo.label,
          y: channelInfo.data
        }
      ]

      timeseries.layout = {
          title: firstEntry[0],
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
    
    timeseries.onClick = (data) => {
        console.log('CLICK', data)
        for(var i=0; i < data.points.length; i++){
            const point = data.points[i]
    
            const annotations = timeseries.div.layout.annotations || [];
            const shapes = timeseries.div.layout.shapes || [];

            if (!hedAnnotation.x)  {
              hedAnnotation.tag = tagControl.element.value
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
                  opacity: 0.4,
                  line: {
                      width: 0
                  },
                  layer: 'below'
              })
              delete hedAnnotation.x
            }

            timeseries.Plotly.relayout(timeseries.div, {annotations, shapes})
        }
    }

    }

    // Register Actual Directories
    if (filesystem){

      const toDisplay = Object.keys(filesystem).reduce((a,b) => a + (
        b.includes('.edf') //|| b.includes('.nwb')
      ), 0) === 0 
      // TODO: Fix the object editor so it doesn't access objects until it uses them.
      // Do now show top-level EDF because the stringification takes SO long

      if (toDisplay) editor.target = filesystem
    }

    showValidation(info)
}

const showValidation = (info) => {

  errorDiv.innerHTML = ''
  warningDiv.innerHTML = ''


  const createView = (o, i, type='Error') => {
    return `
    <h5>${type} ${i+1}: [${o.code}] ${o.key}</h5>
    <a href=${o.helpUrl}>Click here for more information about this issue</a>
    <p><small>${o.reason}</small></p>
    <span>${o.files.length} files.</span>
    <ul>
      ${o.files.map((file, j) => `<li>File ${j} - ${file?.file?.name}</li>`).join('')}
    </ul>
    `
  }

  console.log('Errors', info.errors)
  info.errors.forEach((error, i) => {
    errorDiv.insertAdjacentHTML('beforeend',createView(error, i, 'Error'))
  })

  console.log('Warnings', info.warnings)
  info.warnings.forEach((warning, i) => {
    warningDiv.insertAdjacentHTML('beforeend',createView(warning, i, 'Warning'))
  })
}

downloadButton.onClick = async () => {
  if (bidsDataset) {
    const info = await bidsDataset.download()
    if (info) showValidation(info)
  }
}