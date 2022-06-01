# Global EEG Norms (GEN)
A Progressive Web Application for Global EEG Norms


## What is this?
**GEN** is a Progressive Web App (PWA) for annotating EEG data on the browser.

This software validates the effectiveness of modern web technologies to drastically simplify neuroscience research pipelines through standardized tools available on the Open Web. A similar pipeline can be used to develop, publish about, and monetize future web-based neurophysiology tools

Most methods for the BIDSDataset are asynchronous to allow for iterative reading: decoding files only as they are relevant to the end-user.


### Development Notes
- Recompression of .nii files takes a lot of processing power. Can we avoid that?
    - Use Web Workers!

### Checklist
- [ ] `bids-standard`: An NPM library for reading/writing/exporting BIDS files on the browser
- [ ] `hed-standard`: An ontology for EEG artifacts that is interoperable with the HED schema
- [ ] `neurowidgets`: A Web Component library for loading, visualizing and annotating EEG data 
- [ ] A Progressive Web App for loading, annotating and exporting EEG data
- [ ] Documentation website
- [ ] Interrater agreement results from usability testing
- [ ] Automatic detection of common artifacts (optional)
- [ ] Additional features based on end-user requests (optional)
- [ ] `neuroconvert`: An NPM library for importing other standardized EEG data formats (optional)
- [ ] `dandi`: An NPM library to publish to DANDI (optional)

## Acknowledgments
This software was originally developed for the Global Brain Initiative by **Garrett Flynn** for Google Summer of Code 2022 with the guidance of Pedro Valdes-Sosa and Jorge Bosch-Bayard.
