// From https://bids-specification.readthedocs.io/en/stable/04-modality-specific-files/03-electroencephalography.html#sidecar-json-_eegjson

type rowType = {
    name: string | 'n/a',
    type: "MEGMAG" | "MEGGRADAXIAL" | "MEGGRADPLANAR" | "MEGREFMAG" | "MEGREFGRADAXIAL" | "MEGREFGRADPLANAR" | "MEGOTHER" | "EEG" | "ECOG" | "SEEG" | "DBS" | "VEOG" | "HEOG" | "EOG" | "ECG" | "EMG" | "TRIG" | "AUDIO" | "PD" | "EYEGAZE" | "PUPIL" | "MISC" | "SYSCLOCK" | "ADC" | "DAC" | "HLU" | "FITERR" | "OTHER",
    units: string | 'n/a',
    description: string | 'n/a',
    sampling_frequency: number | 'n/a',
    reference: string | 'n/a',
    low_cutoff: number | 'n/a',
    high_cutoff: number | 'n/a',
    notch: number | 'n/a',
    status: "good" | "bad" | "n/a",
    status_description: string | 'n/a',
}

const row = {
    required: {
        name: 'n/a',
        type: 'EEG',
        units: 'n/a',
    },

    optional: {
        description: 'n/a',
        sampling_frequency: 'n/a',
        reference: 'n/a',
        low_cutoff: 'n/a',
        high_cutoff: 'n/a',
        notch: 'n/a',
        status: 'n/a',
        status_description: 'n/a',
    }
}

const required = false

export {
    row,
    rowType,
    required
}