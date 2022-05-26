// import * as reader from "h5wasm";
export type ArbitraryObject = {[x:string]: any}

// Support BigInt Automatically
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

// Core HDF5IO Class
export default class HDF5IO {

  reader: any;
  File: any;
  Dataset: any;

  files: Map<string, {
    name: string,
    read?: any,
    write?: any,
    file?: any
  }> = new Map();

  _path: string = "/hdf5-io"
  debug: boolean;
  _preprocess: Function = (_:any) => {} // Returns modifier for _parse
  _postprocess: Function = (o:any) => o // Returns processed file object


  constructor(reader: any, options:ArbitraryObject={}, debug = false) {
    this.reader = reader.ready;
    this.File = reader.File
    this.Dataset = reader.Dataset

    this.debug = debug;
    if (options?.preprocess) this._preprocess = options.preprocess
    if (options?.postprocess) this._postprocess = options.postprocess
  }

  // ---------------------- Local Filestorage Utilities ----------------------

  // Ensure path has slash at the front
  _convertPath = (path: string) => {
    const hasSlash = path[0] === '/'
    return path = (hasSlash) ? path : `/${path}` // add slash
  }

  initFS = (path:string=this._path) => {
    
    // Note: Can wait for filesystem operations to complete
    return new Promise(async resolve => {
    this._path = path = this._convertPath(path) // set latest path


      this.reader = await this.reader  
      this.reader.FS.mkdir(path);
      this.reader.FS.chdir(path);

      try {
        // Create a local mount of the IndexedDB filesystem:
        this.reader.FS.mount(this.reader.FS.filesystems.IDBFS, {}, path)
        if (this.debug) console.log(`Mounted IndexedDB filesystem to ${path}`)
        this.syncFS(true, path)
        resolve(true)
      } catch (e) {
        switch((e as any).errno){
          case 44: 
            console.warn('Path does not exist');
            resolve(false)
            break;
          case 10:
            console.warn(`Filesystem already mounted at ${path}`);
            if (this.debug) console.log('Active Filesystem', await this.list(path))
            resolve(true)
            break;
          default: 
            console.warn('Unknown filesystem error', e);
            resolve(false)
        }
      }
  })

  }
 
  syncFS = (read:boolean= false, path=this._path) => {
    path = this._convertPath(path)

    return new Promise(async resolve => {

      this.reader = await this.reader
      if (this.debug && !read) console.log(`Pushing all current files in ${path} to IndexedDB`)

        this.reader.FS.syncfs(read, async (e?:Error) => {
          if (e) {
            console.error(e)
            resolve(false)
          } else {
            if (this.debug)  {
              const list = await this.list(path)
              if (read) console.log(`IndexedDB successfully read into ${path}!`, list)
              else console.log(`All current files in ${path} pushed to IndexedDB!`, list)
            } 
            resolve(true)
          }
        })
    })

  }

  // ---------------------- New HDF5IO Methods ----------------------

  // Allow Upload of HDF5 Files from the Browser
  upload = async (ev: Event) => {
    const input = ev.target as HTMLInputElement;
    if (input.files && input.files?.length) {
      await Promise.all(Array.from(input.files).map(async f => {
        let ab = await f.arrayBuffer();
        console.log(ab)
        await this._write(f.name, ab)
      }))
    }
  }

  list = async (path:string=this._path) => {
    path = this._convertPath(path)

    this.reader = await this.reader    
    let node;

    try {node = (this.reader.FS.lookupPath(path))?.node} 
    catch (e) {console.warn(e)}

    if (node?.isFolder && node.contents) {
        let files = Object.values(node.contents).filter((v:any) => !(v.isFolder)).map((v:any) => v.name);
        // const subfolders = Object.values(node.contents).filter((v:any) => (v.isFolder)).map((v:any) => v.name)
        // Add Files to Registry
        files.forEach((name: string) => {
          if (!this.files.has(name)) this.files.set(name, {name, file: undefined}) // undefined === capable of being loaded
        })
        return files
    }
    else return []
}

  // Allow Download of NWB-Formatted HDF5 Files fromthe  Browser
  download = (name: string, file: any, extension: string = 'hdf5') => {
    if (!file) file = (name) ? this.files.get(name) : [...this.files.values()][0]
    if (file) {
      if (!name) name = file.name // Get Default Name
      if (file.write) file.write.flush();
      if (file.read) file.read.flush();

      const blob = new Blob([this.reader.FS.readFile(file.name)], { type: 'application/x-hdf5' });
      var a = document.createElement("a");
      document.body.appendChild(a);
      a.style.display = "none";

      // IE 10 / 11
      const nav = (globalThis.navigator as any);
      if (nav?.msSaveOrOpenBlob) {
        nav.msSaveOrOpenBlob(blob, name);
      } else {
        var url = globalThis.URL?.createObjectURL(blob);
        a.href = url;
        let nameNoExtension = name.replace(/(.+)\.(.+)/, '$1')
        a.download = nameNoExtension + `.${extension}` // Add Extension
        a.target = "_blank";
        //globalThis.open(url, '_blank', fileName);
        a.click();
        setTimeout(function () { globalThis.URL.revokeObjectURL(url) }, 1000);
      }
    }
  }

  // Fetch NWB Files from a URL
  fetch = async (
    url: string, 
    fileName: string = 'default.hdf5', 
    progressCallback: (ratio: number, length: number) => void = () => { }, 
    successCallback: (fromRemote: boolean) => void = () => { },
    ignoreLocalStorage: boolean = false
  ) => {

    //  Get File from Name
    let o = this.get(fileName, undefined, ignoreLocalStorage) ?? { nwb: undefined, file: undefined }

    // Only Fetch if NO Locally Cached Version
    if (!o.file) {

      const tick = performance.now()

      let response = await fetch(url).then(res => {

        // Use the Streams API
        if (res.body) {
          const reader = res.body.getReader()
          const length = res.headers.get("Content-Length") as any
          let received = 0

          // On Stream Chunk
          const stream = new ReadableStream({
            start(controller) {

              const push = async () => {

                reader.read().then(({ value, done }) => {
                  if (done) {
                    successCallback(true)
                    controller.close();
                    return;
                  }

                  received += value?.length ?? 0
                  progressCallback(received / length, length)
                  controller.enqueue(value);
                  push()
                })
              }

              push()
            }
          })

          // Read the Response
          return new Response(stream, { headers: res.headers });
        } else return new Response()
      })


      let ab = await response.arrayBuffer();

      const tock = performance.now()

      if (this.debug) console.log(`Fetched in ${tock - tick} ms`)

      await this._write(fileName, ab)
      o.file = this.read(fileName, ignoreLocalStorage)

    } else successCallback(false)
    return o.file
  }

  // Iteratively Check FS to Write File
  _write = async (name: string, ab: ArrayBuffer) => {
      const tick = performance.now()
      this.reader = await this.reader
      this.reader.FS.writeFile(name, new Uint8Array(ab));
      const tock = performance.now()
      if (this.debug) console.log(`Wrote raw file in ${tock - tick} ms`)
      return true
  }

        // Parse File Information with API Knowledge
  _parse = (o: any, aggregator: { [x: string]: any } = {}, key: string, modifier: ArbitraryObject = {}, keepDatasets:boolean = true) => {

          if (o){
          // Set Attributes
          if (o instanceof this.Dataset) {
            if (Object.keys(aggregator[key])) {
              // ToDO: Expose HDF5 Dataset objects
              // if (keepDatasets) aggregator[key] = o // Expose HDF5 Dataset
              // else 
              aggregator[key] = o.value
            }
            else aggregator[key] = o.value
  
            
          } else if (!o.attrs.value) {
            for (let a in o.attrs) {
              aggregator[key][a] = o.attrs[a].value // Exclude shape and dType
            }
          }
  
          // Drill Group
          if (o.keys instanceof Function) {
            let keys = o.keys()
            keys.forEach((k: string) => {
              const group = o.get(k)
              aggregator[key][k] = {}
              aggregator[key][k] = this._parse(group, aggregator[key], k, modifier, keepDatasets)
            })
          }
          }
  
          return aggregator[key]
        }

  // ---------------------- Core HDF5IO Methods ----------------------
  read = (name = [...this.files.keys()][0], ignoreLocalStorage: boolean = false) => {

    let file = this.get(name, 'r', ignoreLocalStorage)

    if (Number(file?.read?.file_id) != -1) {

      const tick = performance.now()

      const modifier = this._preprocess(file)
      let innerKey = 'res'
      let aggregator:ArbitraryObject = {[innerKey]: {}}
      this._parse(file.read, aggregator, innerKey, modifier)


      // Postprocess File
      file.file = this._postprocess(aggregator[innerKey])

      // if (!file.write) this.close()

      const tock = performance.now()
      if (this.debug) console.log(`Read file in ${tock - tick} ms`)
      return file.file

    } else return
  }

  // Get File by Name
  get = (name: string = [...this.files.keys()][0], mode?: string, ignoreLocalStorage: boolean = false ) => {

    let o = this.files.get(name)

    if (!o) {
      o = { name, file: null }
      this.files.set(name, o)
    }

    if (mode) {
      let hdf5 = new this.File(name, mode);
      if (mode === 'w') o.write = hdf5
      else if (mode === 'r') o.read = hdf5
      else if (mode === 'a') o.read = o.write = hdf5
    } else if (!ignoreLocalStorage && (name && o.file === undefined)) {
      if (this.debug) console.log(`Returning local version from ${this._path}`)
      this.read(name)
    }

    return o
  }

  save = (path:string) => this.syncFS(false, path)

  write = (o: ArbitraryObject, name = [...this.files.keys()][0]) => {

    let file = this.get(name, 'w')
    
    if (Number(file?.write?.file_id) != -1) {

      const tick = performance.now()

      // Write Arbitrary Object to HDF5 File
      let writeObject = (o: any, key?: String) => {
        const group = (key) ? file.write.get(key) : file.write
        for (let k in o) {
          const newKey = `${(key) ? `${key}/` : ''}${k}`
          if (!(o[k] instanceof Function)) {
            if (typeof o[k] === 'object') {
              if (o[k] instanceof Array) group.create_dataset(k, o[k]);
              else {
                file.write.create_group(newKey);
                writeObject(o[k], newKey)
              }
              // }
            } else {
              if (o[k]) group.create_attribute(k, o[k]);
            }
          }
        }
      }

      writeObject(o)

      const tock = performance.now()
      if (this.debug) console.log(`Wrote NWB File object to browser filesystem in ${tock - tick} ms`)
    }
  }

  close = (name = [...this.files.keys()][0]) => {
    const fileObj = this.files.get(name)
    if (fileObj) {
      if (fileObj.read) fileObj.read.close()
      if (fileObj.write) fileObj.write.close()

      this.files.delete(name)
    }
  }
}