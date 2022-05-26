import reader from 'h5wasm'
import nwb from 'webnwb'

export default async (o) => {
      const io = new nwb.NWBHDF5IO(reader, true)
      console.log('Writing NWB file')
      await io._write(o.file.name, o.buffer).then(res => {
          console.log('res', res)
          return res
      }).catch(e => {
          console.log(e)
      })
      let file = io.read(o.file.name)
      console.log('File', file)
      return file
}