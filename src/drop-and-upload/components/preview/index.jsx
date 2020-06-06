// @flow
import React, { Fragment } from 'react'

import dropPlaceholder from '../../../assets/icons/drop-placeholder.svg'
import './styles.scss'

type Props = {
  progress: number,
  url: string,
}

export const Preview = ({ progress, url }: Props) => (
  <Fragment>
    <div className="preview-container">
      {progress ? (
        <span>{progress}%</span>
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
      {progress ? 'Uploading' : 'Drag & drop here'}
    </span>
  </Fragment>
)
