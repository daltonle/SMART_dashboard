import React from 'react'
import { DESK } from '../../../utils/const'
import MapPinIcon from 'react-feather/dist/icons/map-pin'
import CompassIcon from 'react-feather/dist/icons/compass'
import styles from './TitleCard.module.scss'

export const TitleCard = (props) => {
  let {
    name,
    suburb,
    position,
    media
  } = props
  
  return (
    <div>
      {media===DESK ? <h1>{name}</h1> : <h2>{name.length > 25 && !props.full ? `${name.substring(0, 25)}...` : name}</h2>}
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