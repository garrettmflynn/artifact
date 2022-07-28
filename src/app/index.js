import * as components from '../components/index.js'
import download from './download.js'
import * as plot from './plot/index.js'
import * as dataset from './dataset.js'
import * as freerange from 'freerange'


const controls = {
    loader: document.body.querySelector('visualscript-loader'),
    overlay: document.body.querySelector('visualscript-overlay'),
    editors: []
}

// ----------------------- Edit Files -----------------------
// Basic Object Editor with Iterative File Support and EDF Plotting
const editor = new components.ObjectEditor({ header: 'Dataset', plot: [(key, o) => key.includes('.edf')] })
editor.preprocess = async (o) => {
  if (o instanceof freerange.RangeFile) return o.body // Get the body of the file
  else return o
}
editor.onPlot = plot.update
document.getElementById('editor').appendChild(editor)
controls.editors.push(editor)

// Default Plot
const editor2 = new components.ObjectEditor({ header: `First EDF File (${plot.defaults.channels.n} Channels)` })
editor2.onPlot = (editor) => {
    document.getElementById('artifacts').innerHTML = ''
    console.log(plot, editor)
    plot.update(editor)
}
document.getElementById('annotation-app').appendChild(editor2)
controls.editors.push(editor2)

// -------------------- Upload Dataset --------------------
document.getElementById('dataset').onClick = () => dataset.mount(controls)

// -------------------- Download Annotated Dataset --------------------
document.getElementById('download').onClick = () => {
    download(dataset.bids, controls)
}


// dataset.mountCache(controls)