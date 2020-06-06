// @flow
import React, { useState } from 'react'
import ReactDOM from 'react-dom'

import { DropAndUpload } from './drop-and-upload'
import './styles/global.scss'

const App = () => {
  const [imageURL, setImageURL] = useState<string>(null)

  const onChange = (url: string) => {
    setImageURL(url)

    console.log('Got the new URL')
  }

  return (
    <main className="app-container">
      <DropAndUpload value={imageURL} onChange={onChange} />
    </main>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
)
