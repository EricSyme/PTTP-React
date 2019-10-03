import * as ActionTypes from './ActionTypes';

export const Recordings = (state = {
        isLoading: true,
        errMess: null,
        recordings: []
    }, action) => {
    switch(action.type) {
        case ActionTypes.ADD_RECORDINGS:
            return {...state, isLoading: false, errMess: null, recordings: action.payload};

        case ActionTypes.RECORDINGS_LOADING:
            return {...state, isLoading: true, errMess: null, recordings: []};

        case ActionTypes.RECORDINGS_FAILED:
            return {...state, isLoading: false, errMess: action.payload, recordings: []};

        default:
            return state;
    }
}