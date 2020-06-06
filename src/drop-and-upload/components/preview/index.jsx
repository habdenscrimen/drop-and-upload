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
    <div
      className={`preview-container ${
        progress ? `preview-container__progress-${progress}` : ''
      }`}
    >
      {progress ? (
        <div className="preview-container__inner">
          <img src={dropPlaceholder} alt={progress} />
        </div>
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
