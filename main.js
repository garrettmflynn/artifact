import * as visualscript from 'https://cdn.jsdelivr.net/npm/visualscript'
import * as bids from './src/standards/bids/src/index.js'

const editorDiv = document.getElementById('editor')
const errorDiv = document.getElementById('errors')
const warningDiv = document.getElementById('warnings')

const editor = new visualscript.ObjectEditor({header: 'BIDS File'})
editor.style.color = 'black'
editorDiv.appendChild(editor)

const file = document.getElementById('file')
file.onchange = async (ev) => {
  const files = ev.target.files
    const bidsFile = new bids.BIDSFile({
      ignoreWarnings: false,
      ignoreNiftiHeaders: false,
      ignoreSubjectConsistency: false,
    })

    const info = await bidsFile.validate(files)
    const data = await bidsFile.load(files)
    console.log(bidsFile, bidsFile.data, info)
    editor.target = data

    errorDiv.innerHTML = ''
    warningDiv.innerHTML = ''


    const createView = (o, i, type='Error') => {
      return `
      <h3>${type} ${i+1}: [${o.code}] ${o.key}</h3>
      <a href=${o.helpUrl}>Click here for more information about this issue</a>
      <p><small>${o.reason}</small></p>
      <span>${o.files.length} files.</span>
      <ul>
        ${o.files.map((file, j) => `<li>File ${j} - ${file?.file?.name}</li>`).join('')}
      </ul>
      `
    }

    info.errors.forEach((error, i) => {
      errorDiv.insertAdjacentHTML('beforeend',createView(error, i, 'Error'))
    })

    info.warnings.forEach((warning, i) => {
      warningDiv.insertAdjacentHTML('beforeend',createView(warning, i, 'Warning'))
    })
}