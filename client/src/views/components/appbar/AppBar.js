import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styles from './AppBar.module.scss'

/**
 * Static component at the moment. Needs to configure router and redux in future development
 */
export const AppBar = () => (
  <div className={styles.container}>
    <span className={styles.menuItems}>SETTINGS</span>
    <span className={styles.menuItems}>PROFILE</span>
    <span className={styles.menuItems}>ALERT</span>
    <div className={`${styles.menuActive} ${styles.menuItems}`}>DASHBOARD</div>
  </div>
)