import React, { Dispatch, SetStateAction } from 'react';

const apiNames = ['rest', 'graphql', 'grpc'] as const;
export type Api = typeof apiNames[number];

export const getApiFromLocalStorage = (): Api => {
    return apiNames.find(value => value === localStorage.getItem('api')) || 'rest';
}

export const ApiContext = React.createContext<[Api, Dispatch<SetStateAction<Api>>]>([getApiFromLocalStorage(), () => {}]);
