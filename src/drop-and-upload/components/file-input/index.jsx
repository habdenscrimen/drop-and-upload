// @flow
import React from 'react'

import './styles.scss'

type Props = {
  accept: string,
  onChange: () => void | (() => Promise<void>),
}

export const FileInput = ({ accept, onChange }: Props) => (
  <div>
    <input
      type="file"
      name="file"
      id="file"
      className="file-input"
      accept={accept}
      onChange={onChange}
    />
    <label htmlFor="file" className="file-input__label">
      Select file to upload
    </label>
  </div>
)
