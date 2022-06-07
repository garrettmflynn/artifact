import * as validation from './validation.js'
import * as standard from '../bids-standard/src/index.js'

export let bids;
export let fallback = {
    file: null,
    name: null
};

// Prompt the User when Leaving with Unsaved Changes
window.onbeforeunload = function(){
  console.log(bids.manager.changelog)
  if (bids.manager.changelog.length > 0){
    return 'Unsaved changes will be deleted. Are you sure you want to leave?';
  }
};

const progressCallback = (options, ratio) => options.loader.progress = ratio

const createBIDS = (options) => {
 const bids = new standard.BIDSDataset({
    ignoreWarnings: false,
    ignoreNiftiHeaders: false,
    ignoreSubjectConsistency: false,
    // debug: true
  })

  const ignoreHEDErrors = (e) =>  {
    const case1 = e.key != 'HED_ERROR'
    const case2 = e.reason != 'The validation on this HED string returned an error.' 
    return case1 && case2
  }

  bids.addIgnore(ignoreHEDErrors)


  return bids
}


export const mountCache = async (options={}) => {

  bids = createBIDS()

  const files = await bids.mountCache((ratio) => progressCallback(options, ratio))
  if (!files) {
    bids = undefined
    return undefined
  }
  else return mount(options, bids)
}

export const mount = async (options={}) => {


    // Generate BIDS Dataset and Mount Files
    const bidsExisted = !!bids
    if (!bidsExisted) {
      bids = createBIDS()
      options.overlay.open = true
      options.loader.text = 'Mounting Dataset'
    }

    // Keep Cached files
    const files = (bidsExisted) ? bids.files : await bids.mount((ratio) => progressCallback(options, ratio))

    // Assume Files are Already Mounted
    if (!files) {
      options.overlay.open = false
      bids = null
    } else {

    const fileList = files.list.map(o => o.file)
    options.loader.text = 'Validating Dataset'
    const info = await bids.validate(fileList)  
  
    options.loader.text = 'Plotting Dataset Files'
  
    console.log(bids)
  
    // overlayDiv.innerHTML = 'Dataset loaded!'
  
    // Register Actual Directories
    if (Object.values(bids.manager.files.system).length) {
      const editor = options.editors[0]
      editor.header = bids.manager.directoryName
      if (editor) editor.set(bids.manager.files.system)
  
      // Plot Default Data
      const allEDFFiles = bids.manager.files.types.edf
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
  }