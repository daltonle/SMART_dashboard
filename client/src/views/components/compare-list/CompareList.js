import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import DeleteIcon from 'react-feather/dist/icons/x'
import { removeCompareSensor } from '../../../state/ducks/compare/actions'

import styles from './CompareList.module.scss'

const CompareItem = ({ name, id, onItemDelete }) => {
  return (
    <div className={styles.item}>
      <h4>{name}</h4>
      <DeleteIcon className={styles.deleteBttn} onClick={e => onItemDelete(id, e)}/>
    </div>
  )
}

class CompareList extends Component {
  static propTypes = {
    sensors: PropTypes.array,

    removeCompareSensor: PropTypes.func
  }

  handleItemDelete = (id, e) => {
    e.preventDefault()
    this.props.removeCompareSensor(id)
  }

  render() {
    const { sensors } = this.props
    const items = sensors.map(s => <CompareItem name={s.description} key={s.id} id={s.id} onItemDelete={this.handleItemDelete}/>)
    return (
      <div className={styles.list}>
        {items}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  sensors: state.compare.sensors
})

const mapDispatchToProps = {
  removeCompareSensor
}

export default connect(mapStateToProps, mapDispatchToProps)(CompareList)

