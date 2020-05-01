import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware } from 'redux';
import albumsApp from './reducers/AlbumsApp'
import App from './components/App'
import  thunk  from 'redux-thunk';

var store = applyMiddleware(thunk)(createStore)(albumsApp);

render(<App store={store} />, document.getElementById('root'))