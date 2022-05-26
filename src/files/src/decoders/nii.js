import nifti from 'nifti-reader-js'

export default (o) => {
    try {
        let header = null, image = null, extension = null;
        header = nifti.readHeader(o.buffer);
        // console.log('Header', header.toFormattedString());
        image = nifti.readImage(header, o.buffer);
        // console.log('Image', image);
        if (nifti.hasExtension(header)) {
            extension = nifti.readExtensionData(header, o.buffer);
        }
        return {
            header,
            image,
            extension,
            buffer: o.buffer
        }
    } catch (e) {
        console.warn(e)
        return o
    }
}
