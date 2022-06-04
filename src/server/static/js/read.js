export default (response, callback) => {
    const reader = response.body.getReader();
    const bytes = parseInt(response.headers.get('Content-Length'), 10)
    const type = response.headers.get('Content-Type')

    console.log('Bytes',  bytes, response)

    return new Promise(resolve => {
    let bytesReceived = 0
    let buffer = [];

    reader.read().then(function processBuffer({ done, value }) {

      if (done) {
          const config = {}
          if (typeof type === 'string') config.type = type
        const blob = new Blob(buffer, config)
        resolve(blob)
        return;
      }
  
      bytesReceived += value.length;
      const chunk = value;  
      buffer.push(chunk);

      if (callback instanceof Function) callback(bytesReceived/bytes , bytes)

      // Read some more, and call this function again
      return reader.read().then(processBuffer)
    });
})
  }