import * as validation from './validation.js'
import * as standard from '../bids-standard/src/index.js'

export let bids;
export let fallback = {
    file: null,
    name: null
};

export const mount = async (options={}) => {

    bids = new standard.BIDSDataset({
      ignoreWarnings: false,
      ignoreNiftiHeaders: false,
      ignoreSubjectConsistency: false,
      // debug: true
    })

  
    options.overlay.open = true

    options.loader.text = 'Mounting Dataset'
    const files = await bids.mount((ratio) => options.loader.progress = ratio)

    const fileList = files.list.map(o => o.file)
    options.loader.text = 'Validating Dataset'
    const info = await bids.validate(fileList)  
  
    options.loader.text = 'Plotting Dataset Files'
  
    console.log(bids)
  
    // overlayDiv.innerHTML = 'Dataset loaded!'
  
    // Register Actual Directories
    if (Object.values(bids.files.system).length) {
      const editor = options.editors[1]
      if (editor) editor.set(bids.files.system)
  
      // Plot Default Data
      const allEDFFiles = bids.files.types.edf
      if (allEDFFiles){
        setTimeout(async () => {
             const editor = options.editors[1]
             const file = Object.values(allEDFFiles)[0]
                fallback.file = await file.body
                fallback.name = file.name
                if (editor) editor.set({}, true) // Force plot
                options.overlay.open = false
        }, 500)
      } else options.overlay.open = false
  
      validation.display(info)
  
    }
  }