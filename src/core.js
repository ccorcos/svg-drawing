import { Provider } from 'react-redux'
import { combineReducers } from 'redux-immutable'
import makeStore from './makeStore'

import app from './app/reducer'
import cube from './cube/reducer'

export const rootRedcer = combineReducers({
  app,
  cube,
})

export const store = makeStore(rootRedcer)

export const Root = props =>
  <Provider store={store}>
    {props.children}
  </Provider>
