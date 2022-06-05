# Global EEG Norms (GEN)
A Progressive Web Application for Global EEG Norms

## What is GEN?
**GEN** is a Progressive Web Application (PWA) for managing BIDS datasets on the browser. While this tool has primary support for the electroencephalography (EEG) modality of the BIDS specification, we intend to expand support for other modalities as we continue development.

### Goals
**Short Term:** We intend for **GEN** to enable the development of standard annotations for EEG datasets (starting with resting-state artifacts) through *global feedback from clinical neurophysiologists*.

**Mid Term:** We intend for the libraries resulting from **GEN** to reduce the barriers to entry for neurophysiology research by enabling standalone data management and analysis applications to be prototyped and released on modern browsers.

**Long Term:**  By enabling the use of EEG as gatekeeper in public health, we intend for **GEN** to enable the rapid diagnosis of neurological disorders in lower to middle-income countries with unreliable internet connections.

### Key Features
1. Import local datasets in the BIDS format
2. View and edit data in the dataset
    - Visually annotate artifacts using HED tags
3. Validate edits using the [bids-validator](https://github.com/bids-standard/bids-validator/tree/master/bids-validator) library
4. Export dataset as a .zip file in the BIDS format

### Additional Notes
- The contents of file buffers are only decoded and stored in memory when they are needed by the user. Only edited files are then re-encoded on data export.

## Roadmap
### GSoC Milestones
1. [x] Release **GEN** as a Progressive Web App (PWA) for loading, annotating and exporting BIDS datasets on the browser
2. [ ] Conduct usability testing with clinical neurophysiologists and determine interrater agreement
    - Develop a simplified UI to gether feedback. Here is a slice of a dataset. Does it have an artifact? If so, what and where?
    - Host a curated collection of datasets remotely. Allow users to submit us their annotations about them (from the web interface).
    - Compare stored annotations
3. [ ] Publish thorough documentation for released libraries
    - [ ] `bids-standard`: Manage BIDS datasets in the browser and Node.js
    - [ ] `neurowidgets`: A Web Component library for loading, visualizing and annotating EEG data 
    - [ ] `neuroconvert`: Convert neuroscience datasets between formats (e.g. EDF, NWB, etc.)
    - [ ] `freerange`: File import / export utilities with included iterative read/write support
4. [ ] Release a comprehensive HED library for EEG artifacts
5. [ ] Create tools for automatic detection of common artifacts on the browser (optional)

### Additional Milestones
#### Brains@Play
1. [ ] Pipe EEG data acquired from the browser using the [datastreams-api](https://github.com/brainsatplay/datastreams-api) into the BIDS format.

#### LORIS
1. [ ] Request and modify a remote BIDS datasets from a LORIS database 
2. [ ] Package the LORIS frontend as a PWA
    - This would allow for users to download the application in a way that looks like a native app. Assets are cached for offline access.
3. [ ] Breakout LORIS UI tools as a component library on NPM (e.g. `neurowidgets`) that allows arbitrary webpages to manage datasets.
    - React components [can be added to arbitrary webpages](https://reactarmory.com/answers/how-to-integrate-react-into-existing-app), although you must include React ([making that webpage a React app, in a way](https://blog.logrocket.com/react-vs-web-components/)) since the library is not aligned with web standards (unlike Web Components)
    - This would allow for the neuroscience community to use standard UI resources across the web. Similar efforts include [geppetto](https://github.com/MetaCell/geppetto-meta), which also uses React.


#### Neurodata without Borders
> **Note:** Garrett will be attending [NWB User Days 2022](https://neurodatawithoutborders.github.io/nwb_hackathons/HCK13_2022_Janelia/) and has previously developed [WebNWB](https://github.com/brainsatplay/webnwb) to manage NWB files on the browser.

1. Enable the conversion of NWB files into BIDS (and vice-versa)


## External Libraries
1. [visualscript](https://github.com/brainsatplay/visualscript) for UI prototyping
2. [freerange](https://github.com/brainsatplay/freerange) for file management

## Acknowledgments
**GEN** was originally developed for the Global Brain Consortium (GBC) by **Garrett Flynn** for Google Summer of Code 2022 with the mentorship of Pedro Valdes-Sosa, Jorge Bosch-Bayard, and several others from the EEGNet and HED communities.


## Additional Resources
The official GSoC proposal behind this project can be viewed [here](https://summerofcode.withgoogle.com/programs/2022/projects/WOkMdu9V).

Additionally, Garrett maintained a devlog throughout Summer 2022 [here](https://github.com/garrettmflynn/gsoc).
