// @flow
import React, { useState } from 'react'
import { DropAndUpload } from './drop-and-upload'
import './styles/global.scss'

export const App = () => {
  const [imageURL, setImageURL] = useState<string>(null)

  return (
    <main id="app-container">
      <DropAndUpload value={imageURL} onChange={setImageURL} />
    </main>
  )
}
