import Cookies from 'js-cookie';
import jwt_decode from 'jwt-decode';
import { createContext, Dispatch, SetStateAction } from 'react';

export interface Token {
    upn: string;
    groups: string[];
    iat: number;
    exp: number;
}

export const getTokenFromCookie = (): Token => {
    const token = Cookies.get('token');
    if (token) {
        const decoded = jwt_decode(token) as Token;
        return {
            upn: decoded.upn,
            groups: decoded.groups,
            iat: decoded.iat,
            exp: decoded.exp
        };
    } else {
        return {
            upn: '',
            groups: [],
            iat: 0,
            exp: 0
        };
    }
}

export const AuthContext = createContext<[Token, Dispatch<SetStateAction<Token>>]>([getTokenFromCookie(), () => {}]);
