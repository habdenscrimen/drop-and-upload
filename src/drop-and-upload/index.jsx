// @flow
import React, { useState, DragEvent, useEffect, ChangeEvent } from 'react'

import { fileToBase64, fakeUploadingRequest } from './utils'
import dropPlaceholder from '../assets/icons/drop-placeholder.svg'
import './styles.scss'

type Props = {
  value: string,
  onChange: (url: string) => void,
}

const imageParams = {
  size: 100,
  imageTypes: ['image/png', 'image/jpeg'],
}

export const DropAndUpload = ({ value: url, onChange }: Props) => {
  const [hovering, setHovering] = useState(false)
  const [error, setError] = useState(null)
  const [progress, setProgress] = useState(null)
  const [request, setRequest] = useState<XMLHttpRequest>(null)

  useEffect(() => {
    console.log('UPDATED URL')
  }, [url])

  const reset = () => {
    setProgress(null)
    setRequest(null)
    setError(null)
  }

  const cancelUploading = () => {
    request.abort()
    reset()
  }

  const updateURL = (url: string) => {
    onChange(url)
    reset()
  }

  // enable 'copy' cursor effect when dragging
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()

    e.dataTransfer.dropEffect = 'copy'
  }

  const dropUpload = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setHovering(false)

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
      cancelUploading()
    }
  }

  return (
    <div className="drop-container">
      <div className="drop-container__header">header</div>

      <div className="drop-container__body">
        <div
          className={`drop-container__drop-area ${
            hovering ? 'drop-container__drop-area-hovered' : ''
          }`}
          onDragOver={handleDragOver}
          onDrop={dropUpload}
          onDragEnter={() => setHovering(true)}
          onDragLeave={() => setHovering(false)}
        >
          {progress ? (
            <div>{progress}</div>
          ) : (
            <img src={dropPlaceholder} alt="Drop here" height={80} width={80} />
          )}

          <span className="drop-container__icon-label">
            {progress ? 'Uploading' : 'Drag & drop here'}
          </span>

          <p>- or -</p>

          <span>
            {progress && request ? (
              <button onClick={cancelUploading}>Cancel</button>
            ) : (
              <div>
                <label htmlFor="fileInput">Select file to upload</label>
                <input
                  type="file"
                  name="fileInput"
                  id="fileInput"
                  accept={imageParams.imageTypes.join(',')}
                  onChange={inputUpload}
                />
              </div>
            )}
          </span>

          {error && <p>{error}</p>}
        </div>
      </div>
    </div>
  )
}
