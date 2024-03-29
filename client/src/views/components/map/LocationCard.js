import React from 'react'
import classNames from 'classnames'
import ExitIcon from 'react-feather/dist/icons/x'
import CheckIcon from 'react-feather/dist/icons/check'
import { TitleCard } from '../titleCard/TitleCard'
import { MOBILE } from '../../../utils/const'

import styles from './LocationCard.module.scss'

export const LocationCard = (props) => {
  const { 
    media,
    visible, 
    name, 
    suburb, 
    position,
    addable, 
    maxed,
    onLocationAdded, 
    onExit } = props
  
  return (
    <div 
      className={classNames({ 
        [styles.visible]: visible, 
        [styles.hidden]: (!visible), 
        [styles.mobile]: (media===MOBILE),
        [styles.web]: (media!==MOBILE) 
      })}>
      <TitleCard
        name={name}
        suburb={suburb}
        position={position}
        full
        media={media}
      />
      <div className={styles.exitButton} onClick={onExit}>
        <ExitIcon className={styles.icon}/>
      </div>
      {addable ? 
        <div className={classNames({ [styles.addButton]: !maxed, [styles.addButtonDisabled]: maxed })} onClick={onLocationAdded} >     
          <h4>Add</h4>
        </div>
        :
        <div className={styles.addButtonAdded} >     
          <h4>Added</h4>
          <CheckIcon className={styles.icon} />
        </div>
      }
    </div>
  )
}
