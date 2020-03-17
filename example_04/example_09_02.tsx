import { Action } from 'redux-actions';
import { put, takeLatest, call } from 'redux-saga/effects';
import { createRoutine, Routine } from 'redux-saga-routines';
import http from 'src/services/http';
import { APILocation } from 'src/models';

export interface GetLocationRequestValues {
    search: string;
    sortDirection: string;
}

export type GetLocationPayload = GetLocationRequestValues & any;

export const action: Routine = createRoutine('GET_LOCATION');

function getLocation(id: string) {
    return http({ route: `location/${id}` });
}

function* getLocationHandler({ payload }: Action<GetLocationPayload>) {
    try { const response: APILocation = yield call(getLocation, payload);
    yield put(action.success(response));
    } catch (error) {
    yield put(action.failure(error.message));
    }
}

export function* saga() {
    yield takeLatest(action.TRIGGER, getLocationHandler);
}
