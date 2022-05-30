import * as templates from './templates.js'

const deepClone = (o) => JSON.parse(JSON.stringify(o))

export const getEvents = (name, directory) => {
    const fileSplit = name.split('_')
    const fileCoreName = fileSplit.slice(0, fileSplit.length - 1).join('_')
    const expectedFileName = `${fileCoreName}_events.tsv`
    const foundFileName = Object.keys(directory).find(str => str.includes(fileCoreName) && str.includes('_events.tsv'))
    return (!foundFileName) ? directory[expectedFileName] = [] : directory[foundFileName]
  }
  
  const getSidecar = (o, fileName, method="top") => {
    const fileInfo = {}
  
    fileName.split('_').map(arr => arr.split('-')).forEach(arr => {
      if (arr.length === 2) fileInfo[arr[0]] = arr[1]
    })
  
    const expectedName = `${(method === 'top') ? `` : `sub-${fileInfo.sub}_ses-${fileInfo.ses}_`}task-${fileInfo.task}_events.json`
    let jsonSidecar = o[expectedName]
    if (!jsonSidecar) jsonSidecar = o[expectedName] = {} // Create JSON sidecar
    return jsonSidecar
  }
  
  
  export const add = (hed, eventInfo, fileName, modalityFileDirectory, history, method="inheritance") => {
  
      // Account for Missing Info
      if (!hed.code) hed.code = hed.tag
      if (!hed.label) hed.label = hed.code
  
      // Get Event .tsv File
      const tsvEventFile = getEvents(fileName, modalityFileDirectory)
      const eventTemplate = deepClone(tsvEventFile[0]) ?? templates.objects['events.json'] // Add structured event
      eventInfo[hed.header] = hed.code
  
      // Make sure all entries have the same keys!
      tsvEventFile.forEach(res => res[hed.header] = (!res[hed.header]) ? 'n/a' : res[hed.header])
      tsvEventFile.push(Object.assign(eventTemplate, eventInfo))
  
      const globalSidecar = getSidecar(history[0].parent, fileName, 'top')
      const subjectSidecar = getSidecar(history.at(-1).parent, fileName, 'subject')
      
      // Subject Sidecar
      if (!subjectSidecar[hed.header]) subjectSidecar[hed.header] = templates.objects['events.json']
      if (!subjectSidecar[hed.header].Levels[hed.code]) subjectSidecar[hed.header].Levels[hed.code] = 'Insert description here'
      if (!subjectSidecar[hed.header].HED[hed.code]) subjectSidecar[hed.header].HED[hed.code] = hed.tag // String
  
      // Global Sidecar
      if (!globalSidecar[hed.header]) globalSidecar[hed.header] = templates.objects['events.json']
      globalSidecar[hed.header].HED = subjectSidecar[hed.header].HED // Link these directly // TODO: Make this work for more than one subjectSidecar!
      globalSidecar[hed.header].Levels = subjectSidecar[hed.header].Levels // Link these directly // TODO: Make this work for more than one subjectSidecar!
  }
  