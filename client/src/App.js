import React, { Component } from 'react'
import './App.scss'
import { Provider } from 'react-redux'
import { Route, Switch } from 'react-router-dom'
import Media from 'react-media'
import { DESK, MOBILE } from './utils/const'
import store from './state/store'
import DashboardMain from './views/pages/DashboardMain/DashboardMain'

class App extends Component {
  render() {
    return (
      <Provider store={ store }>
        <div className="App">
          <Media query="(max-width: 820px)">
            {matches => (
              <Switch>
                <Route
                  exact path='/dashboard'
                  render={(props) => <DashboardMain {...props} media={matches ? MOBILE : DESK} />}
                />
              </Switch>
            )}
          </Media>
        </div>
      </Provider>
    )
  }
}

export default App
