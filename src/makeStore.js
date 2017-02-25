import { applyMiddleware, createStore, compose } from 'redux'
import thunk from 'redux-thunk'

export default (reducer, initialState) => {
  if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    return createStore(reducer, composeEnhancers(applyMiddleware(thunk)), initialState)
  }
  return createStore(reducer, applyMiddleware(thunk), initialState)
}