import { AccountDetails } from "@component/AccountDetails";
import { AddAccount } from '@component/AddAccount';
import { ChangePassword } from "@component/ChangePassword";
import { EditAccount } from '@component/EditAccount';
import { Home } from '@component/Home';
import { Layout } from '@component/Layout';
import { ListAccounts } from '@component/ListAccounts';
import { Login } from '@component/Login';
import { Register } from '@component/Register';
import { AccessLevel, AccessLevelContext, getAccessLevelFromToken } from '@context/AccessLevelContext';
import { Api, ApiContext, getApiFromLocalStorage } from '@context/ApiContext';
import { AuthContext, getTokenFromCookie, Token } from '@context/AuthContext';
import { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

export const App = () => {

    const auth = useState<Token>(getTokenFromCookie());
    const accessLevel = useState<AccessLevel>(getAccessLevelFromToken(auth));
    const api = useState<Api>(getApiFromLocalStorage());

    return (
        <AuthContext.Provider value={auth}>
            <AccessLevelContext.Provider value={accessLevel}>
                <ApiContext.Provider value={api}>
                    <BrowserRouter>
                        <Layout>
                            <Routes>
                                <Route path="/" element={<Home/>}/>
                                <Route path="/login" element={<Login/>}/>
                                <Route path="/register" element={<Register/>}/>
                                <Route path="/addAccount" element={<AddAccount/>}/>
                                <Route path="/editAccount/:username" element={<EditAccount/>}/>
                                <Route path="/accounts" element={<ListAccounts/>}/>
                                <Route path="/account" element={<AccountDetails/>}/>
                                <Route path="/changePassword" element={<ChangePassword/>}/>
                            </Routes>
                        </Layout>
                    </BrowserRouter>
                </ApiContext.Provider>
            </AccessLevelContext.Provider>
        </AuthContext.Provider>
    );
};
