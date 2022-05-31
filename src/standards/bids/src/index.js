
import load from './load.js'
import zip from './zip.js'
import JSZip from 'jszip';
import validate from 'bids-validator'
// import hedValidator from 'hed-validator'
import { saveAs } from 'file-saver';
import convert from './convert.js';

import * as templates from './templates.js'

const deepClone = (o) => JSON.parse(JSON.stringify(o))

class BIDSDataset {

    constructor(options={}) {
        this.files = {
          system: {},
          types: {}
        }
        this.options = { verbose: true }
        Object.assign(this.options, options)
    }

    _setConfig = (options={}) => {
      if (options.config) this.options.config = options
      else this.options.config = `${this.name}/.bids-validator-config.json`
    }

    // TODO: Automatically find directory
    get = (name, directory, type, extension) => {

      let defaultObj;
      if (extension === 'json') defaultObj = {}
      else if (extension === 'tsv') defaultObj = []
      else defaultObj = ''

      const fileSplit = name.split('_')
      const fileCoreName = fileSplit.slice(0, fileSplit.length - 1).join('_') // Remove extension and modality
      const hasPrefix = fileCoreName.length > 0
      const expectedFileName = `${fileCoreName}${type ? ((hasPrefix) ? `_${type}` : type) : ''}.${extension}`
      const foundFileName = Object.keys(directory).find(str => str.includes(fileCoreName) && (type ? str.includes(`_${type}.${extension}`) : str.includes(`.${extension}`)))
      return (!foundFileName) ? directory[expectedFileName] = defaultObj : directory[foundFileName] // Creates if not found
    }

    getEvents = async (name) => {
      const directory = await this.getDirectory(name)
      return this.get(name, directory, 'events', 'tsv')
    }

    getDirectory = async (fileName) => {

      let checks = 0
      let drill = (o) => {
        return new Promise(async (resolve, reject) => {
          if (checks > 50) {
            console.error('TOO MANY CHECKS!')
            reject('No file with this name can be found.') // Likely an invalid file name 
          }
          for (let key in o) {

            // File Found!
            if (key === fileName) resolve(o)

            // Drill Directories
            else if (key.split('.').length === 1) {
              if (typeof o[key] === 'object'){
                layers++
                resolve(await drill(o[key]))
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
          shortcutInfo.type = split[0]
          shortcutInfo.extension = split[1]
        } else shortcutInfo[key] = value
      })

      let o = this.files.system.sub[shortcutInfo.sub]
      if (shortcutInfo.ses) o.ses[shortcutInfo.ses]
      if (shortcutInfo.type) {
        const tempO = o[shortcutInfo.type]

        // Check All File Types in This Subject / Session
        if (!tempO) o = await drill(tempO)
        else o = tempO
      }

      const shortcut = o[fileName]

      if (shortcut) return o

      // Check All Files
      const directory = await drill(this.files.system)
      return directory

    }
    
    getSidecar = async (name, options={}) => {

      let type;
      if (options.type){
        const split = name.split('_')
        type = split.at(-1).split('.')[0]
        name = `${split.slice(0, split.length - 1).join('_')}_${options.type}` // No extension needed
      }

      const fileInfo = {}
      name.split('_').map(arr => arr.split('-')).forEach(arr => {
        if (arr.length === 2) fileInfo[arr[0]] = arr[1]
        else {
          const split = arr[0].split('.') // Might have an extension
          fileInfo.type =  type ?? split[0] // Keep OG type
          fileInfo.extension =  split?.[1]
        }
      })

      const task = fileInfo.task

      // TODO: Look for more matches than just task
      if (options.global) return this.get(`${task ? `task-${task}` : ''}_${fileInfo.type}.${fileInfo.extension}`, this.files.system, fileInfo.type, 'json')
      else this.get(name, await this.getDirectory(name), fileInfo.type, 'json')
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

    load = async (files) => {
        if (files.length){
          this.name = files[0].webkitRelativePath?.split('/')?.[0] // directory name
          this._setConfig()
          const dataStructure = await load(files)
          this.files = convert(dataStructure, `${dataStructure.format}2bids`)
          return this.files
        }
    }
    
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

    check = async (options={}, override=false) => {
      const zippedBlob = await zip(this.name, this.files.system)

      // Spoof Files for Pre-Export Validation
      const unzipped = await JSZip.loadAsync(zippedBlob)
      const fileList = await Promise.all(Object.entries(unzipped.files).filter(([path, f]) => !f.dir).map(async ([path, f]) => {
        const buffer = await f.async("arraybuffer")
        const blob = new Blob([buffer])
        blob.name = f.name.split('/').at(-1)
        blob.webkitRelativePath = `${this}/${path}`
        return blob
      }))

      // Validate Files
      const info = await this.validate(fileList, options)
      info.zip = zippedBlob
      return info
    }

    download = async (override=false) => {
      const info = await this.check({}, override)
      if (info.zip instanceof Blob && (info.errors.length === 0 || override)) saveAs(info.zip, `${this.name}.zip`)
      return info
    }


    // HED
    // Add HED Tag using the Inheritance Method
    addHED = async (hed, eventInfo, fileName) => {
  
      // Account for Missing Info
      if (!hed.code) hed.code = hed.tag
      if (!hed.label) hed.label = hed.code
  
      // Get Event .tsv File
      const tsvEventFile = await this.getEvents(fileName)
      const eventTemplate = deepClone(tsvEventFile[0]) ?? templates.objects['events.json'] // Add structured event
      eventInfo[hed.header] = hed.code
  
      // Make sure all entries have the same keys!
      tsvEventFile.forEach(res => res[hed.header] = (!res[hed.header]) ? 'n/a' : res[hed.header])
      tsvEventFile.push(Object.assign(eventTemplate, eventInfo))

      const globalSidecar = await this.getSidecar(fileName, {global: true, type: 'events'})
      const subjectSidecar = await this.getSidecar(fileName, {type: 'events'})
      
      // Subject Sidecar
      if (!subjectSidecar[hed.header]) subjectSidecar[hed.header] = templates.objects['events.json']
      if (!subjectSidecar[hed.header].Levels[hed.code]) subjectSidecar[hed.header].Levels[hed.code] = ''
      if (!subjectSidecar[hed.header].HED[hed.code]) subjectSidecar[hed.header].HED[hed.code] = hed.tag // String
  
      // Global Sidecar
      if (!globalSidecar[hed.header]) globalSidecar[hed.header] = templates.objects['events.json']
      globalSidecar[hed.header].HED = subjectSidecar[hed.header].HED // Link these directly // TODO: Make this work for more than one subjectSidecar!
      globalSidecar[hed.header].Levels = subjectSidecar[hed.header].Levels // Link these directly // TODO: Make this work for more than one subjectSidecar!
  }
}



export {
    BIDSDataset,
    load,
    // zip
}