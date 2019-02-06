import React, { Component } from 'react'
import { DESK, MOBILE } from '../../../utils/const'
import styles from './AppBar.module.scss'

import BellIcon from 'react-feather/dist/icons/bell'
import UserIcon from 'react-feather/dist/icons/user'
import ActivityIcon from 'react-feather/dist/icons/activity'
import SettingsIcon from 'react-feather/dist/icons/settings'

/**
 * Static component at the moment. Needs to configure router and redux in future development
 */
export const AppBar = (props) => {
  if (props.media === DESK) return (<AppBar_desktop />)
  else if (props.media === MOBILE) return (<AppBar_mobile />)
}

const AppBar_desktop = () => (
  <div className={styles.container}>
    <span className={styles.menuItems}>SETTINGS</span>
    <span className={styles.menuItems}>PROFILE</span>
    <span className={styles.menuItems}>ALERTS</span>
    <div className={`${styles.menuActive} ${styles.menuItems}`}>DASHBOARD</div>
  </div>
)

const AppBar_mobile = () => (
  <div className={styles.m_background}>
    <div className={styles.m_container}>
      <div className={`${styles.m_menuActive} ${styles.m_menuItems}`}>
        <ActivityIcon color={'#068FAB'} size={16}/><br/>
        <span>Dashboard</span>
      </div>
      <div className={styles.m_menuItems}>
        <BellIcon size={16}/><br/>
        <span>Alerts</span>
      </div>
      <div className={styles.m_menuItems}>
        <UserIcon size={16}/><br/>
        <span>Profile</span>
      </div>
      <div className={styles.m_menuItems}>
        <SettingsIcon size={16}/><br/>
        <span>Settings</span>
      </div>
    </div>
  </div>
)