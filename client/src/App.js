import React, { Component } from 'react'
import './App.scss'
import { Provider } from 'react-redux'
import store from './state/store'
import Map from './views/components/map/Map'

class App extends Component {
  render() {
    return (
      <Provider store={ store }>
        <div className="App">
          <Map />
        </div>
      </Provider>
    )
  }
}

export default App
