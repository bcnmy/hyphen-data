import {
  UPDATE_CURRENT_STATE
} from './types';

const initialState = {
  totalVolume : undefined,
  totalVolumePerChain : {},
  volumePerDay : {},
  volumePerDayPerChain : {}
}

const reducer = (state = initialState, action) => {
  let localState = state;
  
  switch (action.type) {
    case UPDATE_CURRENT_STATE:
      let keys = Object.keys(action.payload);
      for(let index=0; index < keys.length; index++) {
        localState[keys[index]] = action.payload[keys[index]];
      }
      return localState;    
    default: return state
  }
}

export default reducer