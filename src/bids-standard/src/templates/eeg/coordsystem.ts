type coordinateType = {[x:string]: [number, number, number]}
type coordinateSystemType = "CTF" | "ElektaNeuromag" | "4DBti" | "KitYokogawa" | "ChietiItab" | "Other" | "CapTrak" | "EEGLAB" | "EEGLAB-HJ" | "Other" | "ICBM452AirSpace" | "ICBM452Warp5Space" | "IXI549Space" | "fsaverage" | "fsaverageSym" | "fsLR" | "MNIColin27" | "MNI152Lin" | "MNI152NLin2009aSym" | "MNI152NLin2009bSym" | "MNI152NLin2009cSym" | "MNI152NLin2009aAsym" | "MNI152NLin2009bAsym" | "MNI152NLin2009cAsym" | "MNI152NLin6Sym" | "MNI152NLin6ASym" | "MNI305" | "NIHPD" | "OASIS30AntsOASISAnts" | "OASIS30Atropos" | "Talairach" | "UNCInfant" | "fsaverage3" | "fsaverage4" | "fsaverage5" | "fsaverage6" | "fsaveragesym" | "UNCInfant0V21" | "UNCInfant1V21" | "UNCInfant2V21" | "UNCInfant0V22" | "UNCInfant1V22" | "UNCInfant2V22" | "UNCInfant0V23" | "UNCInfant1V23" | "UNCInfant2V23"
type coordinateSystemUnits = "m" | "mm" | "cm" | "n/a"

type fileType = {
    IntendedFor: string | string[], // Required Generally

    // Fields relating to the EEG electrode positions:
    EEGCoordinateSystem: coordinateSystemType,
    EEGCoordinateUnits: coordinateSystemUnits
    EEGCoordinateSystemDescription: string, // Rquired if EEGCoordinateSystem === "Other"
    
    // Fields relating to the position of fiducials measured during an EEG session/run:
    FiducialsDescription: string, // optional
    FiducialsCoordinates: coordinateType,
    FiducialsCoordinateSystem: coordinateSystemType,
    FiducialsCoordinateUnits: coordinateSystemUnits,
    FiducialsCoordinateSystemDescription: string,
    
    // Fields relating to the position of anatomical landmark measured during an EEG session/run:
    AnatomicalLandmarkCoordinates: coordinateType,
    AnatomicalLandmarkCoordinateSystem: coordinateSystemType,
    AnatomicalLandmarkCoordinateUnits: coordinateSystemUnits,
    AnatomicalLandmarkCoordinateSystemDescription: string,
}

const file = {
    required: {
        IntendedFor: "n/a", // Required Generally
        EEGCoordinateSystem: "Talairach",
        EEGCoordinateUnits: "n/a",
    },

    optional: {
        EEGCoordinateSystemDescription: "n/a", // Rquired if EEGCoordinateSystem === "Other"
        FiducialsDescription: "n/a", 
        FiducialsCoordinates: "n/a",
        FiducialsCoordinateSystem: "Talairach",
        FiducialsCoordinateUnits: "n/a",
        FiducialsCoordinateSystemDescription: "n/a",
        AnatomicalLandmarkCoordinates: "n/a",
        AnatomicalLandmarkCoordinateSystem: "Talairach",
        AnatomicalLandmarkCoordinateUnits: "n/a",
        AnatomicalLandmarkCoordinateSystemDescription: "n/a",
    }
}

const required = false

export {
    file,
    fileType,
    required
}