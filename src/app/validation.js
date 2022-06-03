
const errorDiv = document.getElementById('errors')
const warningDiv = document.getElementById('warnings')
const errorHeader = document.getElementById('errorsheader')
const warningHeader = document.getElementById('warningsheader')

export const display = (info) => {

    errorDiv.innerHTML = ''
    warningDiv.innerHTML = ''

    const createView = (o, i, type = 'error') => {
        return `
    <div class=${type}>
      <h5>${i + 1}: [${o.code}] ${o.key}</h5>
      <a href=${o.helpUrl}>Click here for more information about this issue</a>
      <p><small>${o.reason}</small></p>
      <span>${o.files.length} files.</span>
      <ul>
        ${o.files.map((file, j) => `<li><p><b>File ${j}</b> - ${file?.file?.name}<p><p><small><b>Evidence:</b> ${file.evidence}</small></li>`).join('')}
      </ul>
    <div>
    `
    }

    console.log('Info', info)
    if (info.errors) {
        if (info.errors.length > 0) errorHeader.style.display = 'block'
        else errorHeader.style.display = ''
        info.errors.forEach((error, i) => {
            errorDiv.insertAdjacentHTML('beforeend', createView(error, i, 'error'))
        })
    }

    if (info.warnings) {
        if (info.warnings.length > 0) warningHeader.style.display = 'block'
        else warningHeader.style.display = ''
        info.warnings.forEach((warning, i) => {
            warningDiv.insertAdjacentHTML('beforeend', createView(warning, i, 'warning'))
        })
    }
}