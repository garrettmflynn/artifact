
import load from './load.js'
import download from './download.js'
import validate from 'bids-validator'

class BIDSDataset {

    constructor(options={}) {
        this.data = {}
        this.options = { verbose: true }
        Object.assign(this.options, options)
    }

    _setConfig = (options={}) => {
      if (options.config) this.options.config = options
      else this.options.config = `${this.name}/.bids-validator-config.json`
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
        this.name = files?.[0]?.webkitRelativePath?.split('/')?.[0] // directory name
        this._setConfig()
        this.data = await load(files)
        return this.data
    }

    download = () => download(this)
}



export {
    BIDSDataset,
    load,
    download
}