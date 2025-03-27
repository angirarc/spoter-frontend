export type Status = 'INITIAL' | 'LOADING' | 'SUCCESS' | 'ERROR';

export interface State {
    status: Status;
    error?: any;
    message?: string;
}

export const initialState: State = {
    status: 'INITIAL',
    error: undefined,
    message: undefined,
};

export type LoadingStatus = {
    [fn: string]: State;
};

export type NewStatusFunction = (
    current: LoadingStatus,
    name: string,
    status: Status,
    message?: string,
    error?: unknown,
) => LoadingStatus;

export const newStatus: NewStatusFunction = (
    current: LoadingStatus,
    name: string,
    status: Status,
    message?: string,
    error?: unknown,
): LoadingStatus => ({
    ...current,
    [name]: {
        status,
        message,
        error,
    },
});
