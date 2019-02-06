import React, { Component } from 'react'
import './App.scss'
import { Provider } from 'react-redux'
import { Route, Switch } from 'react-router-dom'
import Media from 'react-media'
import store from './state/store'
import Dashboard_desktop from './views/pages/Dashboard/Dashboard_desktop'
import Dashboard_mobile from './views/pages/Dashboard/Dashboard_mobile';

class App extends Component {
  render() {
    return (
      <Provider store={ store }>
        <div className="App">
          <Media query="(max-width: 820px)">
            { matches =>
              matches ? (
                <Switch>
                  <Route exact path='/' component={Dashboard_mobile} />
                </Switch>
              ) : (
                <Switch>
                  <Route exact path='/' component={Dashboard_desktop} />
                </Switch>
              )
            }
          </Media>
        </div>
      </Provider>
    )
  }
}

export default App
