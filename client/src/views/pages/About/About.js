import React from 'react'
import GithubIcon from 'react-feather/dist/icons/github'
import { DESK, MOBILE } from '../../../utils/const'
import { AppBar } from '../../components/appbar/AppBar'

import styles from './About.module.scss'

const About = ({ media, history }) => {
  if (media === DESK)
    return (
      <div className={styles.outer}>
        <div className={styles.appbar}>
          <AppBar active="about" media={media} noShadow/>
        </div>
        <div className={styles.content}>
          <div className={styles.header}>
            <h1>About</h1>
          </div>
          <div className={styles.aboutPara}>
            <p>
              This project was done by Dalton Le as part of the 2018/2019 Summer Research Scholarships with
              SMART Infrastructure Facility, Univesity of Wollongong. For more information please visit SMART
              website or email <b>duong.daltonle@gmail.com</b>.
            </p>
          </div>
        </div>
        <div className={styles.footer}>
          <div className={styles.footerContent}>
            <span>Copyright (c) 2019 SMART Infrastructure Facility.<br/>Released under the MIT License.</span>
            <div className={styles.linkDiv}>
              <GithubIcon className={styles.icon}/>
              <span>View on GitHub</span>
              <a href='https://github.com/daltonle/SMART_dashboard'><span className={styles.link}></span></a>
            </div>
          </div>
        </div>
      </div>
    )
  else if (media === MOBILE)
    return (
      <div className={styles.outer}>
        <div className={`${styles.content} ${styles.m_content}`}>
          <div className={styles.header}>
            <h1>About</h1>
          </div>
          <div className={styles.aboutPara}>
            <p>
              This project was done by Dalton Le as part of the 2018/2019 Summer Research Scholarships with
              SMART Infrastructure Facility, Univesity of Wollongong. For more information please visit SMART
              website or email <b>duong.daltonle@gmail.com</b>.
            </p>
          </div>
        </div>
        <div className={styles.m_footer}>
          <div className={styles.m_footerContent}>
            <span>Copyright (c) 2019 SMART Infrastructure Facility.<br/>Released under the MIT License.</span>
            <div className={styles.linkDiv}>
              <GithubIcon className={styles.icon}/>
              <span>View on GitHub</span>
              <a href='https://github.com/daltonle/SMART_dashboard'><span className={styles.link}></span></a>
            </div>
          </div>
        </div>
        <div className={styles.appbar}>
          <AppBar active="about" media={media}/>
        </div>
      </div>
    )
}

export default About
