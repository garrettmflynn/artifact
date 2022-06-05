// XML Loader
import * as files from 'freerange'
import * as xml from 'freerange-xml'
const fileManager = new files.FileManager({debug: true})
fileManager.extend(xml)

// Your Default XML File
import xmlHEDScore from '../../HED_score_1.0.0.xml'

export const map = {} // Map of short to long HED tags

export const tag = document.getElementById('tag')
export const text = document.getElementById('freetext')
const loader = document.getElementById('xml')

// ---------------- Setup Controls ----------------
const toggleFreeFormInput = (target) => {
  const value = target.value ?? ''
  if (value.at(-1) === '#') {
    text.style.display = ''
  } else text.style.display = 'none'
}

tag.onChange = (ev) => toggleFreeFormInput(ev.target) // Check to display free form input

// Load a new .xml schema
loader.onChange = async (ev) => {
  tag.style.display = 'block'
  const file = ev.target.files[0]
  fileManager.get(file).then(loadHEDXML)
}


// ---------------- Load XML File ----------------
export const loadHEDXML = (o) => {
  const options = new Set()
  o = o.HED.schema[0]

  const filter = ['/EEG-artifact']
  const shortName = true

  const drillNodes = (o, base = '') => {
    const emptyBase = base === ''
    const count = filter.reduce((a, b) => a + base.includes(b), 0)
    if (count || base === '') {
      const val = o.name?.[0]?.['_']

      if (o.name) {
        base += `/${val}`
        if (val !== '#') {
          const toInclude = !emptyBase || filter.includes(base)
          if (toInclude) {
            map[val] = base // Intermediary tags
            options.add(val)
          }
        }
      }

      if (o.node) {
        o.node.forEach(o => drillNodes(o, base))
      }

      // Final Tags
      else {
        if (shortName) {
          const split = base.split('/')
          const short = split.at(-1)
          const val = (short === '#') ? split.slice(split.length - 2).join('/') : short
          options.add(val)
          map[val] = base
        } else {
          options.add(base)
          map[base] = base
        }

      }
    }
  }

  drillNodes(o)
  tag.options = Array.from(options)
  toggleFreeFormInput(tag.element)
}

fileManager.decode({ text: xmlHEDScore }, {name: 'HED_score_1.0.0.xml', type: 'application/xml'}).then(loadHEDXML)