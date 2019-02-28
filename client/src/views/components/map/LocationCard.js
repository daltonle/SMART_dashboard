import React from 'react'
import classNames from 'classnames'
import ExitIcon from 'react-feather/dist/icons/x'
import { TitleCard } from '../titleCard/TitleCard'

import styles from './LocationCard.module.scss'

export const LocationCard = (props) => {
  const { visible, name, suburb, position, onLocationAdded, onExit } = props
  return (
    <div className={classNames({ [styles.visible]: visible, [styles.hidden]: (!visible) })}>
      <TitleCard
        name={name}
        suburb={suburb}
        position={position}
        full
      />
      <div className={styles.exitButton} onClick={onExit}>
        <ExitIcon className={styles.icon}/>
      </div>
      <div className = {styles.addButton} onClick={onLocationAdded} >
        <h4>Add</h4>
      </div>
    </div>
  )
}
