// import reader from '../../external/h5wasm/dist/esm/hdf5_hl.js'
import reader from 'h5wasm'
import nwb from '../../../standards/nwb/src/index'

export default async (o) => {
      const io = new nwb.NWBHDF5IO(reader)
      await io._write(o.file.name, o.buffer)
      let file = io.read(o.file.name)
      return file
}