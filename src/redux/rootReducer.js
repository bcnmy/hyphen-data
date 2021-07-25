import { combineReducers } from 'redux'

import depositReducer from "./deposit/reducer";

const rootReducer = combineReducers({
  deposit: depositReducer
})

export default rootReducer