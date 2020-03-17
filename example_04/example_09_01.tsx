import { Action } from 'redux-actions';
import { cloneDeep } from 'lodash';

import {
    getLocationsList,
    getLocation,
    removeMemberFromLocation
} from 'src/actions';
import { APILocation } from 'src/models';
import { APIUserExtended } from 'src/models';

export interface State {
    list: APILocation[];
    count: number;
    isLoading: boolean;
    editableLocation: APILocation | null;
}

const initialState: State = {
    list: [],
    count: 0,
    isLoading: false,
    editableLocation: null
};

export default function locations(
    state: State = initialState,
    { payload, type }: Action<any>
): State {
    switch (type) {
        case getLocationsList.TRIGGER:
        case getLocation.TRIGGER:
            return {
                ...state,
                isLoading: true,
                editableLocation: null
            };

        case getLocationsList.SUCCESS:
            return {
                ...state,
                list: payload.data,
                isLoading: false
            };

        case getLocation.SUCCESS:
            return {
                ...state,
                editableLocation: payload,
                isLoading: false
                };

        case getLocationsList.FAILURE:
        case getLocation.FAILURE:
            return {
                ...state,
                isLoading: false,
                editableLocation: null
                };

        case removeMemberFromLocation.SUCCESS:
            const newState = cloneDeep(state.editableLocation);
            const newUsers =
            newState &&
            newState.users.filter(
                (item: APIUserExtended) => item.id !== payload.userId
            );
            const item = Object.assign(newState, { users: newUsers 
        });
            return {
                 ...state,
                editableLocation: item
             };

            default:
                return state;
            }
        }
