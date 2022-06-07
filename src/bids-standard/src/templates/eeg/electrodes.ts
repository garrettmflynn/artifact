// From https://bids-specification.readthedocs.io/en/stable/04-modality-specific-files/03-electroencephalography.html#sidecar-json-_eegjson


// NOTE: Must be in this specific order...
type rowType = {
    name: string,
    x: number,
    y: number,
    z: number | 'n/a',
    type: string,
    material: string, // Tin, Ag/AgCl, Gold
    impedance: number,
}

const row = {
    required: {
        name: 'n/a',
        x: 0,
        y: 0,
        z: 'n/a',
    },

    optional: {
        type: "n/a",
        material: "n/a", // Tin, Ag/AgCl, Gold
        impedance: "n/a",
    }
}

const links = ['coordsystem.json']
const required = false

export {
    row,
    rowType,
    links,
    required
}