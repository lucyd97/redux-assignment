import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import PropTypes from 'prop-types'
import List from '../components/List'
import Album from '../components/Album'
import Photo from '../components/Photo'

const App = ({store}) => (
    <Provider store={store}>
    <Router>
      <Route exact path="/" component={List} />
      <Route exact path="/SelectedAlbum" component={Album} />
      <Route exact path="/SelectedPhoto" component={Photo} />
    </Router>
  </Provider>
)

App.propTypes = {
    store: PropTypes.object.isRequired
  }

export default App