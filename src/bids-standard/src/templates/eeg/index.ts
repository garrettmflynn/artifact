// Fully-Typed EEG-BIDS Specification
// https://bids-specification.readthedocs.io/en/stable/04-modality-specific-files/03-electroencephalography.html#sidecar-json-_eegjson

import * as channels from './channels'
import * as coordsystem from './coordsystem'
import * as eeg from './eeg'
import * as electrodes from './electrodes'

export default {
    'eeg': {
        extensions: ['.edf', '.bdf', ['.vhdr', '.vmrk', '.eeg'], ['.set', '.fdt']]
    },
    'eeg.json': eeg, 
    'channels.tsv': channels,
    'coordsystem.json': coordsystem,
    'electrodes.tsv': electrodes,
    'photo.jpg': {required: false},
}