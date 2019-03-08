import React from 'react'
import classNames from 'classnames/bind'
import styles from './ParticleData.module.scss'

export const ParticleData = (props) => {
  let { data, level, unit } = props
  let cx = classNames.bind(styles)
  let circleClass = cx({
    circle: true,
    [`lvl${level}`]: true
  })
  
  return (
    <div className={circleClass}>
      <h1>{data}</h1>
      <h6>{unit}</h6>
    </div>
  )
}