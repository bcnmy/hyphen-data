import { combineReducers } from 'redux'

import depositReducer from "./deposit/reducer";
import searchReducer from './search/reducer';
import mainReducer from './root/reducer';

const rootReducer = combineReducers({
  deposit: depositReducer,
  search: searchReducer,
  root: mainReducer
})

export default rootReducer