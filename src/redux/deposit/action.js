import {
    UPDATE_CURRENT_STATE
  } from './types';

export const updateDepositState = (currentState) => {
    return {
        type: UPDATE_CURRENT_STATE,
        payload: currentState
    }
}