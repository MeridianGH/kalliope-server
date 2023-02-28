import React from 'react'
import PropTypes from 'prop-types'
import './thumbnail.css'
import imagePlaceholder from '../../../../assets/image_placeholder.png'

export function Thumbnail({ image, size }) {
  return (
    <div className={'thumbnail-container'} style={{ width: size, height: size }}>
      <img className={'thumbnail-backdrop'} src={image ?? imagePlaceholder} alt='Thumbnail Background'/>
      <img className={'thumbnail'} src={image ?? imagePlaceholder} alt='Video Thumbnail'/>
    </div>
  )
}

Thumbnail.propTypes = {
  image: PropTypes.string.isRequired,
  size: PropTypes.string.isRequired
}
