
import load from './load.js'
import validate from 'bids-validator'
import convert from './convert.js';
import * as templates from './templates.js'
import fileManager from './files.js'
import KeyGroup from './KeyGroup.js';

const deepClone = (o) => JSON.parse(JSON.stringify(o))

const checkTopLevel = (filesystem, extension) => {
  return Object.keys(filesystem).reduce((a,b) => a + (
      b.includes(`.${extension}`)
  ), 0) !== 0 
}

class BIDSDataset {

    constructor(options={}) {
        this.groups = {

          // The set of scans whose filenames share all BIDS filename key-value pairs, except for subject and session
          key: {},

          // TODO: A collection of sessions across participants that contain the exact same set of Key and Parameter Groups
          // acquisition: {}
        }

        // ------------- Setup freerange File Manager -------------
        this.manager = fileManager // Track changes to the filesystem
        
        const keyGroups = this.groups.key
        // assign each file to a key group
        this.manager.addGroup((file) => {
            const keyGroupName = this.getKeyGroupName(file)
            if (keyGroupName){
              if (!keyGroups[keyGroupName]) keyGroups[keyGroupName] = new KeyGroup(keyGroupName)
              keyGroups[keyGroupName].add(file)
            }
        })


        // ------------- Specify Additional Attributes -------------
        this.options = { verbose: true }
        Object.assign(this.options, options)
        this.ignoreConditions = []
    }

    _setConfig = (options={}) => {
      if (options.config) this.options.config = options
      else this.options.config = `${this.name}/.bids-validator-config.json`
    }

    get = async (name, directory, type, extension, options={}) => {

      const create = options.create ?? true

      const fileSplit = name.split('_')
      const fileCoreName = fileSplit.slice(0, fileSplit.length - 1).join('_') // Remove extension and modality
      const hasPrefix = fileCoreName.length > 0
      const expectedFileName = `${fileCoreName}${type ? ((hasPrefix) ? `_${type}` : type) : ''}.${extension}`
      const foundFileName = Object.keys(directory.ref).find(str => str.includes(fileCoreName) && (type ? str.includes(`_${type}.${extension}`) : str.includes(`.${extension}`)))


      if (!foundFileName){

        // Create File If Not Found
        if (create) {
          const fileSpoof = {name: expectedFileName}
          if (extension === 'json') fileSpoof.data = {}
          else if (extension === 'tsv') fileSpoof.data = []
          else defaultObj = fileSpoof.data = ''

          const path = (directory.path) ? `${directory.path}/${fileSpoof.name}` : fileSpoof.name
          const file = directory.ref[expectedFileName] = await fileManager.loadFile(fileSpoof, {directory: directory.name, path})

          return await file.body
        } 
        
        // Or Return Undefined
        else return undefined
      } 

      // Return Existing File Body
      else return await directory.ref[foundFileName].body 
    }

    getEvents = async (name, options) => {
      const directory = await this.getDirectory(name)
      return await this.get(name, directory, 'events', 'tsv', options)
    }


    // Returns a Directory Information Object
    getDirectory = async (fileName) => {

      let checks = 0
      let drill = (o, path="") => {
        return new Promise(async (resolve, reject) => {
          if (checks > 50) {
            this.onError('TOO MANY CHECKS!')
            reject('No file with this name can be found.') // Likely an invalid file name 
          }
          for (let key in o) {

            // File Found!
            if (key === fileName) resolve({
              ref: o,
              path
            })

            // Drill Directories
            else if (key.split('.').length === 1) {
              if (typeof o[key] === 'object'){
                checks++
                let newPath = (path) ? path + '/' + key : key
                resolve(await drill(o[key], newPath))
              }
            }
          }
        })
      }

      // Check Shortcut based on File Name
      const shortcutInfo = {}
      fileName.split('_').map(str => str.split('-')).forEach(([key, value]) => {
        if (!value) {
          const split = key.split('.')
          shortcutInfo.modality = split[0]
          shortcutInfo.extension = split[1]
        } else shortcutInfo[key] = value
      })

      let o = this.manager.files.system
      const hasFolders = [
        'sub', 
        'ses',
        'modality'
      ]

      const keys = [
        'sub', 
        'ses', 
        'task', 
        'recording', // Only in pet modality?
        'acq', 
        'run', 
        'proc', 
        'modality' // Proxy for modality
      ]

      let path = ''

      // Drill or Check System Subset
      // let partialFileName = '' // Omit ses (TODO: Might not be bids-compliant, but needed for Jorge's dataset and aligned with the BIDS Validator...)
      const promises = keys.map(async str => {
        const hasFolder = hasFolders.includes(str)
        const tempO = (str === 'modality') ? o?.[shortcutInfo['modality']] : o?.[str]?.[shortcutInfo[str]]
        if (!tempO && hasFolder) return false
        else {

          const info = shortcutInfo[str]
          const generalPathAddition = `${str}-${info}`
          
          if (str === 'modality') {
            if (hasFolder) path = (path) ? path + '/' + info : info
            // if (info) partialFileName += (partialFileName) ? `_${info}` : info
          } else {
            if (hasFolder) path = (path) ? path + '/' + generalPathAddition : generalPathAddition
            // if (str != 'ses' && info) partialFileName += (partialFileName) ? `_${generalPathAddition}` : generalPathAddition
          }

          if (hasFolder) o = tempO

          return true
        }
      })

      // partialFileName = `${partialFileName}.${shortcutInfo.extension}`

      await Promise.all(promises)

      const shortcut = o[fileName]// ?? o[partialFileName] // Allow Partial Match

      if (shortcut) {
        return {
          ref: o,
          path
        }
      } else this.onError(`No shortcut found for ${fileName}. Checking all directories...`)

      // Check All Files
      const directory = await drill(this.manager.files.system)
      return directory

    }
    
    getSidecar = async (name, options={}) => {

      const ogDir = await this.getDirectory(name)

      let type;
      if (options.type){
        const split = name.split('_')
        type = split.at(-1).split('.')[0] // Original type
        name = `${split.slice(0, split.length - 1).join('_')}_${options.type}` // No extension needed
      }

      const fileInfo = {}
      name.split('_').map(arr => arr.split('-')).forEach(arr => {
        if (arr.length === 2) fileInfo[arr[0]] = arr[1]
        else {
          const split = arr[0].split('.') // Might have an extension
          fileInfo.type =  options.type ?? type ?? split[0] // Keep OG type
          fileInfo.extension =  split?.[1]
        }
      })

      const task = fileInfo.task

      // TODO: Look for more matches than just task
      if (options.global) {
        return await this.get(
          `${task ? `task-${task}` : ''}_${fileInfo.type}.${fileInfo.extension}`, 
          {ref: this.manager.files.system, path: '', name: ''}, 
          fileInfo.type, 
          'json',
          options
        )
      } else return await this.get(name, ogDir, fileInfo.type, 'json', options)
    }

    validate = (files, options={}) => {
      
        if (!this.options.config) this._setConfig(options)

        return new Promise(resolve => {
        validate.BIDS(
            files,
            Object.assign(this.options, options),
            (issues, summary) => {
              if (issues === 'Invalid') {    
                resolve({ errors: 'Invalid', summary, status: 'validated' })
              } else {
                resolve({
                    errors: issues.errors ? issues.errors : [],
                    warnings: issues.warnings ? issues.warnings : [],
                    summary,
                    status: 'validated',
                })
              }
            },
          )
        })
    }

    mountCache = async (callback) => {
      const files = await fileManager.mount(null, callback).catch(this.onError)
      if (!files) return undefined
      else return this.mount(null, files)
    }

    mount = async (callback, files) => {
      this._setConfig()

      if (!files) files = await fileManager.mount(null, callback).catch(this.onError)
      if (!files) return undefined

      files.format = 'bids'
      if (checkTopLevel(files.system, 'edf')) files.format = 'edf' // replace bids with edf
      if (checkTopLevel(files.system, 'nwb')) files.format = 'nwb' // replace bids with nwb
  
      this.name = fileManager.directoryName // directory name
      this.manager.files = await convert(files, `${files.format}2bids`, this.options)

      // TODO: Assign Acquisition Groups
      // ...


      return this.manager.files
    }

    // load = async (files, callback) => {
    //     if (files.length){
    //       this.name = files[0].webkitRelativePath?.split('/')?.[0] // directory name
    //       this._setConfig()
    //       const dataStructure = await load(files, this.options, callback)
    //       this.manager.files = await convert(dataStructure, `${dataStructure.format}2bids`, this.options)
    //       return this.manager.files
    //     }
    // }
    
    // checkHED = () => {
    //   const dataset = new hedValidator.validator.BidsDataset(eventData, sidecarData)
    //     const [schemaDefinition, schemaDefinitionIssues] = parseHedVersion(
    //       jsonContents,
    //       dir,
    //     )
    //     try {
    //       return hedValidator.validator
    //         .validateBidsDataset(dataset, schemaDefinition)
    //         .then(hedValidationIssues => {
    //           return schemaDefinitionIssues.concat(
    //             convertHedIssuesToBidsIssues(hedValidationIssues),
    //           )
    //         })
    //     } catch (error) {
    //       const issues = schemaDefinitionIssues.concat(
    //         internalHedValidatorIssue(error),
    //       )
    //       return Promise.resolve(issues)
    //     }
    //   }
    // }

    check = async (options={}) => {
      await fileManager.sync() // Sync before validation

      // Get Validation Info
      let validationInfo = await this.validate(this.manager.files.list.map(o => o.file), options)
      
      // Ignore User-Specified Conditions
      validationInfo.errors = validationInfo.errors.filter((e) => this.ignoreConditions.reduce((a,b) => {
        const res = !b(e)
        if (!res) console.warn('Ignoring Error', e)
        return a*res
      }, true))

      // Return Updated Validation Info
      return validationInfo
    }

    save = async (override=false, callback) => {
      const info = await this.check() // Validate Files
      if (info.errors.length === 0 || override) {
        info.files = await fileManager.save(callback).catch(this.onError)
      } else alert('Invalid BIDS dataset not saved. Try again with override=true')
      return info
    }


    // HED
    // Add HED Tag using the Inheritance Method
    addHED = async (hed, eventInfo, fileName) => {
  
      // Account for Missing Info
      if (!hed.code) hed.code = hed.tag
      if (!hed.label) hed.label = hed.code

      // TODO: Update Description
      // const description = await this.manager.files.system['dataset_description.json'].get()
      // if (!description.HEDVersion) {
      //   description.HEDVersion = { base: '8.0.0' }
      // } else if (typeof description.HEDVersion === 'string') description.HEDVersion = {base: description.HEDVersion}
      // if (!description.HEDVersion.libraries) description.HEDVersion.libraries = {sc: 'score_0.0.1'}

      // --------------- Handle Event File ---------------
      const tsvEventFile = await this.getEvents(fileName)
      const eventTemplate = deepClone(tsvEventFile[0]) ?? templates.objects['events.json'] // Add structured event
      eventInfo[hed.header] = hed.code // Add code to header

      // remove extraneous headers from eventInfo
      const reducedEventInfo = {}
      Object.keys(eventInfo).forEach(str => {
        if (str in eventTemplate) reducedEventInfo[str] = eventInfo[str]
      })
  
      // make sure all entries have the same keys!
      tsvEventFile.forEach(res => res[hed.header] = (!res[hed.header]) ? 'n/a' : res[hed.header])
      tsvEventFile.push(Object.assign(eventTemplate, reducedEventInfo))

      // --------------- Handle Event Sidecars ---------------
      let globalSidecar = await this.getSidecar(fileName, {global: true, type: 'events', create: false}) // Default to no global sidecar
      const subjectSidecar = await this.getSidecar(fileName, {type: 'events'})
      
      if (!globalSidecar) globalSidecar = globalSidecar // No Inheritance
      // ASSUMPTION: No need for a global sidecar unless currently specified

      // -------- Subject Sidecar --------
      if (!subjectSidecar[hed.header]) subjectSidecar[hed.header] = templates.objects['events.json']

      // Levels (optional)
      if (subjectSidecar[hed.header].Levels){
        if (!subjectSidecar[hed.header].Levels[hed.code]) subjectSidecar[hed.header].Levels[hed.code] = ''
      }

      // HED (required)
      if (!subjectSidecar[hed.header].HED) subjectSidecar[hed.header].HED = {}
      if (!subjectSidecar[hed.header].HED[hed.code]) subjectSidecar[hed.header].HED[hed.code] = hed.tag // String
  
      // -------- Global Sidecar (optional) --------
      if (globalSidecar){
        if (!globalSidecar[hed.header]) globalSidecar[hed.header] = templates.objects['events.json']
        globalSidecar[hed.header].HED = subjectSidecar[hed.header].HED // Link these directly // TODO: Make this work for more than one subjectSidecar!
        globalSidecar[hed.header].Levels = subjectSidecar[hed.header].Levels // Link these directly // TODO: Make this work for more than one subjectSidecar!
      }
  }

  deleteHED = async (offset) => {
    this.onError(`CANNOT REMOVE TAG YET (${offset})`)
  }

  onError = (e) => console.error(`[BIDSDataset]:`, e)
  addIgnore = (condition) => this.ignoreConditions.push(condition)
  addGroup = (condition) => this.groupConditions.push(condition)
  filter = (condition) =>this.manager.files.list.filter(condition)

    // -------------------- Generic Helper Function Backlog --------------------
  // Move active dataset files to a new location of the filesystem
  copy = (relDir) => {}

  // Get File Subsets
  subjects = (base) => {}
  sessions = (base) => {}
  tasks = (base) => {}
  acquisitions = (base) => {}
  runs = (base) => {}


  // -------------------- CuBIDS-Inspired Helper Functions --------------------
  // Add info from headers into sidecars
  addInfo = (fileType) => {
    // e.g. fileType = 'nii'

  }

  // Exemplar Dataset: A BIDS dataset containing one subject from each Acquisition Group
  // TODO: Copy to a new directory (!!!)
  getExemplars = () => {
    return this.groups.acquisition.forEach(arr => arr[0])
  }

  getKeyGroupName = (file) => {

    const splitPath = file.path.split('/')
    const dataType = splitPath[splitPath.length - 2] // Get data type from parent directory
    if (!dataType) return

    const ignore = ['sub','ses']
    const info = []
    file.name.split('_').map(str => str.split('-')).filter(arr => !ignore.includes(arr[0])).forEach(([key,value]) => {
        if (value) info.push({key, value})
        else {
          info.push({key: 'datatype', value: dataType}) // TODO: Allow any modality...
          info.push({key: 'suffix', value: key.split('.')[0]})
        }
    })

   return info.map((o) => `${o.key}-${o.value}`).join('_')
}
}



export {
    BIDSDataset,
    load,
    // zip
}