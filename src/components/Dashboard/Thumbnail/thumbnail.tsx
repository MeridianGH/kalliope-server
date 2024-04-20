import React from 'react'
import PropTypes from 'prop-types'
import { Nullable } from '../../../types/types'
import imagePlaceholder from '../../../assets/image_placeholder.png'
import './thumbnail.scss'

export interface ThumbnailProps {
  image: Nullable<string>
  size: `${number}${'%' | 'px' | 'em' | 'vh' | 'vw'}`
}

export function Thumbnail({ image, size }: ThumbnailProps) {
  return (
    <div className={'thumbnail-container'} style={{ width: size, height: size }}>
      <img className={'thumbnail-backdrop'} src={image ?? imagePlaceholder} alt='Thumbnail Background'/>
      <img className={'thumbnail'} src={image ?? imagePlaceholder} alt='Video Thumbnail'/>
    </div>
  )
}

Thumbnail.propTypes = {
  image: PropTypes.string,
  size: PropTypes.string.isRequired
}
