// @flow
import React, { useState, DragEvent } from 'react'
import { Preview, FileInput, Header } from './components'
import { fileToBase64, validateImageResolution, uploadImage } from './utils'
import './styles.scss'

type Props = {
  value: string,
  onChange: (url: string) => void,

  imageResolution?: number,
  imageTypes?: string[],
}

export const DropAndUpload = ({
  value: url,
  onChange: setUrl,
  imageResolution = 100,
  imageTypes = ['image/png', 'image/jpeg'],
}: Props) => {
  const [dragging, setDragging] = useState(false)
  const [upload, setUpload] = useState<{
    request: XMLHttpRequest,
    error: Error,
    progress: number,
  }>({
    request: undefined,
    error: undefined,
    progress: undefined,
  })

  // enables 'copy' cursor effect when dragging
  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()

    e.dataTransfer.dropEffect = 'copy'
  }

  // cancels current image upload
  const onCancelUpload = () => {
    console.debug('canceling upload')

    if (upload.request) {
      upload.request.abort()
    }

    setUpload({})
  }

  // uploads file
  const onUploadFile = async (e: DragEvent<HTMLDivElement>) => {
    try {
      e.preventDefault()
      setDragging(false)

      const { files } = e.dataTransfer || e.target

      // validate files length
      if (files.length !== 1) {
        return setUpload({
          error: new Error('You can only upload one image at a time'),
        })
      }
      // validate file type
      if (!imageTypes.includes(files[0].type)) {
        return setUpload({
          error: new Error('Invalid image format'),
        })
      }

      // read file
      const imageData = await fileToBase64(files[0])

      // validate file resolution
      const valid = await validateImageResolution(
        imageData,
        imageResolution,
        imageResolution,
      )
      if (!valid) {
        return setUpload({
          error: new Error('Image resolution should be 100px by 100px'),
        })
      }

      // create upload request
      const request = new XMLHttpRequest()
      setUpload({ request })

      // upload image
      const newUrl = await uploadImage(request, imageData, (percentage) => {
        setUpload({ request, progress: percentage })
      })

      // set new url
      setUpload({})
      setUrl(newUrl)
    } catch (error) {
      console.error('failed to upload', error)

      return setUpload({
        error: new Error(`Failed to upload: ${error.message}`),
      })
    }
  }

  return (
    <div className="drop-container">
      <Header />

      <div className="drop-container__body">
        <div
          className={`drop-container__drop-area ${
            dragging ? 'drop-container__drop-area-hovered' : ''
          }`}
          onDragOver={onDragOver}
          onDrop={onUploadFile}
          onDragEnter={() => setDragging(true)}
          onDragLeave={() => setDragging(false)}
        >
          <Preview uploading={upload.request} progress={upload.progress} url={url} />

          <p className="drop-container__or-separator">- or -</p>

          <div>
            {!upload.request ? (
              <FileInput accept={imageTypes.join(',')} onChange={onUploadFile} />
            ) : (
              <button onClick={onCancelUpload} className="drop-container__cancel-button">
                Cancel
              </button>
            )}
          </div>

          {upload.error && (
            <p className="drop-container__error">{upload.error.message}</p>
          )}
        </div>
      </div>
    </div>
  )
}
