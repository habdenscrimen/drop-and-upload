// @flow
import React, { Fragment } from 'react'

import dropPlaceholder from '../../../assets/drop-placeholder.svg'
import './styles.scss'

type Props = {
  uploading: boolean,
  progress: number,
  url: string,
}

export const Preview = ({ uploading, progress, url }: Props) => (
  <Fragment>
    <div className="preview-container">
      {uploading ? (
        <span>{progress || 0}%</span>
      ) : (
        <img
          className={`preview-container__image ${
            url ? 'preview-container__image-rounded' : ''
          }`}
          src={url || dropPlaceholder}
          alt="Drop here"
        />
      )}
    </div>

    <span className="preview-container__icon-label">
      {uploading ? 'Uploading' : url ? 'Drag & drop here to replace' : 'Drag & drop here'}
    </span>
  </Fragment>
)
