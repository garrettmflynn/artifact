import * as validation from './validation.js'

export default async (dataset, options = {}) => {
    if (dataset) {
        options.overlay.open = true
        options.loader.progress = 0 // Reset loader

        options.loader.text = 'Validating Annotated Dataset'
        console.log('Changelog', dataset.manager.changelog)

        const info = await dataset.check()
        validation.display(info)


        if (info.length > 0) alert('Cannot save invalid BIDS dataset')
        else {

            // Override HED errors
            options.loader.text = 'Saving Changes to Disk'
            await dataset.save(true, (dir, ratio) => {
                options.loader.progress = ratio
            })
        }

        options.overlay.open = false
    }
}