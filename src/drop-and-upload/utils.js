// @flow

export const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.addEventListener('load', (e) => {
      resolve(e.target.result)
    })

    reader.addEventListener('error', (e) => {
      reject(e.target.error)
    })

    reader.readAsDataURL(file)
  })

export const validateImageResolution = (
  imageData: string,
  width: number,
  height: number,
): Promise<boolean> =>
  new Promise((resolve) => {
    // load image in order to check width and height
    const img = new Image()

    img.src = imageData

    img.addEventListener('load', () => {
      // check if image has correct size
      if (img.width === width && img.height === height) {
        resolve(true)
      } else {
        resolve(false)
      }
    })
  })

export const uploadImage = (
  request: XMLHttpRequest,
  imageData: string,
  onProgress: (percentage: number) => {},
): Promise<string> =>
  new Promise((resolve, reject) => {
    // send fake request to 'jsonplaceholder'
    request.open('POST', 'https://jsonplaceholder.typicode.com/posts')
    request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8')

    // listen to progress events
    request.upload.addEventListener('progress', (e) => {
      // calculate uploading percentage based on loaded and total bytes
      const percent = e.lengthComputable ? Math.round((e.loaded / e.total) * 100) : 0

      // fire onProgress callback
      onProgress(percent)
    })

    // listen to load events
    request.addEventListener('load', () => {
      if (request.status >= 200 && request.status < 300) {
        resolve(imageData)
      } else {
        reject(request.statusText)
      }
    })

    request.send(JSON.stringify({ body: imageData }))
  })
