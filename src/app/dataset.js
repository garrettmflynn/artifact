import * as validation from './validation.js'
import * as standard from '../bids-standard/src/index.js'

export let bids;
export let fallback = {
    file: null,
    name: null
};

export const load = async (files, options={}) => {

    bids = new standard.BIDSDataset({
      ignoreWarnings: false,
      ignoreNiftiHeaders: false,
      ignoreSubjectConsistency: false,
      // debug: true
    })
  
    options.loader.text = 'Validating Dataset'
    options.overlay.open = true
  
    const info = await bids.validate(files)
    options.loader.text = 'Parsing Dataset Files'
  
    await bids.load(files, (ratio) => {
      options.loader.progress = ratio
    })
  
  
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
        setTimeout(() => {
             const editor = options.editors[1]
              Object.values(allEDFFiles)[0].get().then(res => {
                fallback.file = res 
                fallback.name = `${Object.keys(allEDFFiles)[0]}.edf`
                if (editor) editor.set({}, true) // Force plot
                options.overlay.open = false
              })
        }, 500)
      } else options.overlay.open = false
  
      validation.display(info)
  
    }
  }