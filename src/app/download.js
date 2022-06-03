import * as validation from './validation.js'

export default async (dataset, options = {}) => {
    if (dataset) {
        options.overlay.open = true
        options.loader.progress = 0 // Reset loader
        const info = await dataset.zipCheck({}, (ratio) => {
            options.loader.text = 'Zipping Annotated Dataset'
            options.loader.progress = ratio
        }, (ratio) => {
            options.loader.text = 'Unzipping Dataset to Validate'
            options.loader.progress = ratio
        }) // Show potential errors in your download
        validation.display(info)
        options.loader.text = 'Downloading Annotated Dataset'
        await dataset.download(true, info) // Auto-override the lock on downloading because of errors
        options.overlay.open = false
    }
}