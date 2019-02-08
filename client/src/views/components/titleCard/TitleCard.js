import React from 'react'
import MapPinIcon from 'react-feather/dist/icons/map-pin'
import CompassIcon from 'react-feather/dist/icons/compass'
import styles from './TitleCard.module.scss'

export const TitleCard = (props) => {
  let {
    name,
    suburb,
    position
  } = props
  
  return (
    <div>
      <h1>{name}</h1>
      <div className={styles.info}>
        <MapPinIcon className={styles.icon} />
        <h5>{suburb}</h5>
      </div>
      <div className={styles.info}>
        <CompassIcon className={styles.icon} />
        <h5>{`${position.lat}, ${position.lng}`}</h5>
      </div>
    </div>
  )
}