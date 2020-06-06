// @flow
export const fileToBase64 = (file: File, size: number): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      const img = new Image()
      img.src = e.target.result

      img.onload = () => {
        // make sure the image is the correct size
        if (img.width === size && img.height === size) {
          // if the image is the correct size, return it in base64
          resolve(e.target.result)
        } else {
          // otherwise throw an error
          reject(new Error('Invalid image size'))
        }
      }
    }

    // start reading file
    reader.readAsDataURL(file)
  })

export const fakeUploadingRequest = (
  base64: string,
  onProgress: (progress: number) => void,
  onFinish: () => void,
  onError: () => void,
) => {
  // use XMLHttpRequest because it's impossible to track upload progress with 'fetch'
  const xhr = new XMLHttpRequest()

  // send fake request to 'jsonplaceholder' just for testing
  xhr.open('POST', 'https://jsonplaceholder.typicode.com/posts')
  xhr.setRequestHeader('Content-type', 'application/json; charset=UTF-8')

  // calculate progress percentage
  xhr.upload.onprogress = (e) => {
    const percent = e.lengthComputable ? Math.round((e.loaded / e.total) * 100) : 0

    onProgress(percent)
  }

  xhr.onload = () => {
    // when request is complete, check its status
    if (xhr.status >= 200 && xhr.status < 300) {
      onFinish()
    } else {
      onError()
    }
  }

  // send the fake request
  xhr.send(JSON.stringify({ body: base64 }))

  // return XMLHttpRequest to be able to abort the request
  return xhr
}
