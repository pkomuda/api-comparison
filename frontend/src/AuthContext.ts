import Cookies from 'js-cookie';
import React, { Dispatch, SetStateAction } from 'react';
import jwt_decode from 'jwt-decode';

export interface Token {
    upn: string;
    groups: string[];
}

export const getTokenFromCookie = (): Token => {
    const token = Cookies.get('token');
    if (token) {
        const decoded = jwt_decode(token) as Token;
        return {
            upn: decoded.upn,
            groups: decoded.groups
        };
    } else {
        return {
            upn: '',
            groups: []
        };
    }
}

export const AuthContext = React.createContext<[Token, Dispatch<SetStateAction<Token>>]>([getTokenFromCookie(), () => {}]);
