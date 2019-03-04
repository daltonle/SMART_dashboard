import React from 'react'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import ActivityIcon from 'react-feather/dist/icons/activity'
import InfoIcon from 'react-feather/dist/icons/info'
import { DESK, MOBILE } from '../../../utils/const'
import styles from './AppBar.module.scss'

/**
 * Static component at the moment. Needs to configure router and redux in future development
 */
export const AppBar = (props) => {
  if (props.media === DESK) return (<AppBarDesktop {...props} />)
  else if (props.media === MOBILE) return (<AppBarMobile {...props} />)
}

const AppBarDesktop = (props) => (
  <div className={styles.container}>
    <Link to="/about" className={classNames({[styles.menuActive]: props.active === 'about', [styles.menuItems]: true})}>ABOUT</Link>
    <Link to="/dashboard" className={classNames({[styles.menuActive]: props.active === 'dashboard', [styles.menuItems]: true})}>DASHBOARD</Link>
  </div>
)

const AppBarMobile = (props) => (
  <div className={styles.m_background}>
    <div className={styles.m_container}>
      <div className={classNames({[styles.m_menuActive]: props.active === 'dashboard', [styles.m_menuItemContainer]: true})}>
        <ActivityIcon size={16} className={styles.m_icon}/><br/>
        <Link to="/dashboard" className={classNames({[styles.m_menuActive]: props.active === 'dashboard', [styles.m_menuItems]: true})}>Dashboard</Link>
      </div>
      <div className={classNames({[styles.m_menuActive]: props.active === 'about', [styles.m_menuItemContainer]: true})}>
        <InfoIcon size={16} className={styles.m_icon}/><br/>
        <Link to="/about" className={classNames({[styles.m_menuActive]: props.active === 'about', [styles.m_menuItems]: true})}>About</Link>
      </div>
    </div>
  </div>
)