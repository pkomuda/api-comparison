import { Token } from '@context/AuthContext';
import React, { Dispatch, SetStateAction } from 'react';

const accessLevelNames = ['admin', 'client', ''] as const;
export type AccessLevel = typeof accessLevelNames[number];

export const getAccessLevelFromToken = (auth: [Token, Dispatch<SetStateAction<Token>>]): AccessLevel => {
    const [token, ] = auth;
    if (token.upn) {
        return token.groups[0] as AccessLevel;
    } else {
        return '';
    }
};

export const AccessLevelContext = React.createContext<[AccessLevel, Dispatch<SetStateAction<AccessLevel>>]>(['', () => {}]);
