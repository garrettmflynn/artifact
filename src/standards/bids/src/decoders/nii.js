import nifti from 'nifti-reader-js'

export default (buffer) => {
    try {
        let header = null, image = null, extension = null;
        console.log('Buffer', buffer);
        header = nifti.readHeader(buffer);
        console.log('Header', header.toFormattedString());
        image = nifti.readImage(header, buffer);
        console.log('Image', image);
        if (nifti.hasExtension(header)) {
            extension = nifti.readExtensionData(header, buffer);
        }
        return {
            header,
            image,
            extension
        }
    } catch (e) {
        console.warn(e)
    }
}
