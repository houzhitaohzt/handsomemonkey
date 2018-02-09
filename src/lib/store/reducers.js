import { combineReducers } from 'redux'
import locationReducer from './location'
import navTabReducer from '../../components/NavigateTabs/modules/tabs'

import stateReducer from '../../components/State/module';
export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    location: locationReducer,
    navigate: navTabReducer,
    stateMaps:stateReducer,
    ...asyncReducers
  })
};

export const injectReducer = (store, { key, reducer }) => {
  if (Object.hasOwnProperty.call(store.asyncReducers, key)) return

  store.asyncReducers[key] = reducer;
  store.replaceReducer(makeRootReducer(store.asyncReducers))
};

export default makeRootReducer

