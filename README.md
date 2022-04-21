# artifact
 EEG Artifact Annotation on the Browser

> **Note:** Uses [simplepwa](https://github.com/nikkifurls/simplepwa) as a template.

## What is this?
**Artifact** is a Progressive Web App (PWA) for annotating EEG artifacts on the browser.

This software validates the effectiveness of modern web technologies to drastically simplify neuroscience research pipelines through standardized tools available on the Open Web. A similar pipeline can be used to develop, publish about, and monetize future web-based neurophysiology tools

## Roadmap
1. Load BIDS file
2. Annotate artifacts
    - Implement HED schema
3. Export as updated BIDS file


## Libraries
- `bids-standard`
- `hed-standard`
- `neuroconvert`

### Additional Functionality
1. BIDS -> NWB support
2. Spike sorting for intracellular data


## Acknowledgments
This software was originally developed for the Global Brain Initiative by **Garrett Flynn** for Google Summer of Code 2022 with the guidance of Pedro Valdes-Sosa and Jorge Bosch-Bayard.