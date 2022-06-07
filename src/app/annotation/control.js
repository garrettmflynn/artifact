import * as defaults from './defaults.js'

export default (info, options={}) => {

  const artifactsDiv = document.getElementById("artifacts")
  const timeseries = options?.editor?.timeseries

  if (options.section == null || options.section === 0){
    const div = document.createElement('div')
    div.classList.add('item')
    const controlDiv = document.createElement('div')
    const bold = document.createElement('b')
    const onset = document.createElement('onset')
    const button = document.createElement('visualscript-button')
    button.size = 'small'
    bold.innerHTML = info.annotation_type
    onset.innerHTML = info.onset
    button.innerHTML = 'Delete'
    button.classList.add('disabled')
    button.onClick = () => {
      div.remove()
      lastAnnotation = null
      delete info[info.offset]
      shapes = shapes.filter(o => o !== info.line && o !== info.range)
      if (timeseries) timeseries.Plotly.relayout(timeseries.div, { shapes })
      dataset.bids.deleteHED(info.offset)
    }

    div.insertAdjacentElement('beforeend', bold)
    div.insertAdjacentElement('beforeend', onset)
    div.insertAdjacentElement('beforeend', controlDiv)
    controlDiv.insertAdjacentElement('beforeend', button)
    artifactsDiv.insertAdjacentElement('beforeend', div)
    info.div = div
    info.controlDiv = controlDiv
  }

  if (options.section == null || options.section === 1){
    const button = document.createElement('visualscript-button')
    button.innerHTML = 'Hide'
    button.primary = true
    button.size = 'small'

    if (timeseries) {
      button.onClick = () => {
        if (button.innerHTML === 'Hide') {
          info.range.opacity = 0
          button.innerHTML = 'Show'
        } else if (button.innerHTML === 'Show') {
          button.innerHTML = 'Hide'
          info.range.opacity = 0.5
        }
        timeseries.Plotly.relayout(timeseries.div, { shapes: timeseries.div.layout.shapes })
      }

      button.onmouseover = () => {
        info.range.fillcolor = defaults.range.highlight
        timeseries.Plotly.relayout(timeseries.div, { shapes: timeseries.div.layout.shapes })
      }

      button.onmouseout= () => {
        info.range.fillcolor = defaults.range.fill
        timeseries.Plotly.relayout(timeseries.div, { shapes: timeseries.div.layout.shapes })
      }
    } else console.error('Controls will not work for annotations.')

    info.controlDiv.insertAdjacentElement('afterbegin', button)
  }

  return info
}