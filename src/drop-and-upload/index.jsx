// @flow
import React, { useState, DragEvent, ChangeEvent } from 'react'

import { Preview, FileInput, Header } from './components'
import { fileToBase64, fakeUploadingRequest } from './utils'
import './styles.scss'

const imageParams = {
  size: 100,
  imageTypes: ['image/png', 'image/jpeg'],
}

type Props = {
  value: string,
  onChange: (url: string) => void,
}

export const DropAndUpload = ({ value: url, onChange }: Props) => {
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState<string>(null)
  const [progress, setProgress] = useState<number>(null)
  const [request, setRequest] = useState<XMLHttpRequest>(null)

  const resetState = () => {
    setProgress(null)
    setRequest(null)
    setError(null)
    setDragging(false)
  }

  const abortRequest = () => {
    if (request) {
      request.abort()
    }
  }

  const cancelUploading = () => {
    abortRequest()
    resetState()
  }

  const updateURL = (url: string) => {
    onChange(url)
    resetState()
  }

  // enable 'copy' cursor effect when dragging
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()

    e.dataTransfer.dropEffect = 'copy'
  }

  const dropUpload = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    resetState()

    const { files } = e.dataTransfer

    // count validation
    if (files.length !== 1) {
      return setError('You can upload only 1 image')
    }

    // type validation
    if (!imageParams.imageTypes.includes(files[0].type)) {
      return setError('Invalid image format')
    }

    return processFile(files[0])
  }

  const inputUpload = (e: ChangeEvent<HTMLInputElement>) => processFile(e.target.files[0])

  const processFile = async (file: File) => {
    try {
      // convert image to base64
      const base64 = await fileToBase64(file, imageParams.size)

      // upload image
      const request = fakeUploadingRequest(
        base64,
        setProgress,
        () => updateURL(base64),
        cancelUploading,
      )

      // save request to be able to abort it by clicking button
      setRequest(request)
    } catch (error) {
      setError(error.message)
      abortRequest()
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
          onDragOver={handleDragOver}
          onDrop={dropUpload}
          onDragEnter={() => setDragging(true)}
          onDragLeave={() => setDragging(false)}
        >
          <Preview progress={progress} url={url} />

          <p className="drop-container__or-separator">- or -</p>

          <div>
            {!progress ? (
              <FileInput
                accept={imageParams.imageTypes.join(',')}
                onChange={inputUpload}
              />
            ) : (
              <button onClick={cancelUploading} className="drop-container__cancel-button">
                Cancel
              </button>
            )}
          </div>

          {error && <p className="drop-container__error">{error}</p>}
        </div>
      </div>
    </div>
  )
}
