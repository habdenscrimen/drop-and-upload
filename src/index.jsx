// @flow
import React from 'react'
import ReactDOM from 'react-dom'

import { DropAndUpload } from './drop-and-upload'
import './styles.scss'

const App = () => {
  return (
    <main className="app-container">
      <DropAndUpload />
    </main>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
)
