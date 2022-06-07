import * as validation from './validation.js'

export default async (dataset, options = {}) => {
    if (dataset) {
        options.overlay.open = true
        options.loader.progress = 0 // Reset loader

        options.loader.text = 'Validating Annotated Dataset'
        console.log('Changelog', dataset.manager.changelog)

        const info = await dataset.check()
        validation.display(info)

        const filtered = info.errors.filter((e) =>  {
            const case1 = e.key != 'HED_ERROR'
            const case2 = e.reason != 'The validation on this HED string returned an error.' 
            return case1 && case2
        })


        if (filtered.length > 0) alert('Cannot save invalid BIDS dataset')
        else {

            if (filtered.length != info.errors.length) console.warn('Saving changes to disk despite residual HED errors...')

            // Override HED errors
            options.loader.text = 'Saving Changes to Disk'
            await dataset.save(true, (dir, ratio) => {
                options.loader.progress = ratio
            })
        }

        options.overlay.open = false
    }
}