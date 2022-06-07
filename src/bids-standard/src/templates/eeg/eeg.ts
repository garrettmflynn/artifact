type filterType = {[x:string]:any} | "n/a"

type fileType = {
    TaskName: string, // Required Generally

    InstitutionAddress: string,
    InstitutionName:string,
    InstitutionalDepartmentName: string,
    Manufacturer: string,
    ManufacturersModelName: string,
    SoftwareVersions: string,
    TaskDescription: string,
    Instructions: string,
    CogAtlasID: string,
    CogPOID: string,
    DeviceSerialNumber: string,

    EEGReference: string,
    SamplingFrequency: number,
    PowerLineFrequency: number | 'n/a',
    SoftwareFilters: filterType,

    CapManufacturer: string,
    CapManufacturersModelName: string,
    EEGChannelCount: number,
    ECGChannelCount: number,
    EMGChannelCount: number,
    EOGChannelCount: number,
    MiscChannelCount: number,
    TriggerChannelCount: number,
    RecordingDuration: number,
    RecordingType: string,
    EpochLength: number,
    EEGGround: string,
    HeadCircumference: number,
    EEGPlacementScheme: string,
    HardwareFilters: filterType,
    SubjectArtefactDescription: string,
}

const file = {
    required: {
        TaskName: "n/a", // Required Generally
        EEGReference: "n/a",
        SamplingFrequency: 250,
        PowerLineFrequency: 50,
        SoftwareFilters: "n/a",
    },

    optional: {
        InstitutionAddress: "n/a",
        InstitutionName: "n/a",
        InstitutionalDepartmentName: "n/a",
        Manufacturer: "n/a",
        ManufacturersModelName: "n/a",
        SoftwareVersions: "n/a",
        TaskDescription: "n/a",
        Instructions: "n/a",
        CogAtlasID: "n/a",
        CogPOID: "n/a",
        DeviceSerialNumber: "n/a",
        CapManufacturer: "n/a",
        CapManufacturersModelName: "n/a",
        EEGChannelCount: 0,
        ECGChannelCount: 0,
        EMGChannelCount: 0,
        EOGChannelCount: 0,
        MiscChannelCount: 0,
        TriggerChannelCount: 0,
        RecordingDuration:0,
        RecordingType: "n/a",
        EpochLength: 0,
        EEGGround: "n/a",
        HeadCircumference: "n/a",
        EEGPlacementScheme: "n/a",
        HardwareFilters: "n/a",
        SubjectArtefactDescription: "n/a",
    }
}

const required = true

export {
    file,
    fileType,
    required
}