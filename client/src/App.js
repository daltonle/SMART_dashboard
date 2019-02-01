import React, { Component } from 'react'
import './App.scss'
import { Provider } from 'react-redux'
import { Route, Switch } from 'react-router-dom'
import store from './state/store'
import Dashboard_desktop from './views/pages/Dashboard/Dashboard_desktop'
import Dashboard_mobile from './views/pages/Dashboard/Dashboard_mobile';

class App extends Component {
  render() {
    return (
      <Provider store={ store }>
        <div className="App">
          <Switch>
            <Route exact path='/' component={Dashboard_desktop} />
          </Switch>
        </div>
      </Provider>
    )
  }
}

export default App
