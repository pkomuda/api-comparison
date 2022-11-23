import { AccountDetails } from '@component/AccountDetails';
import { AddAccount } from '@component/AddAccount';
import { ChangePassword } from '@component/ChangePassword';
import { EditAccount } from '@component/EditAccount';
import { Error } from '@component/Error';
import { ErrorBoundary } from '@component/ErrorBoundary';
import { Home } from '@component/Home';
import { Layout } from '@component/Layout';
import { ListAccounts } from '@component/ListAccounts';
import { Login } from '@component/Login';
import { PrivateRoute } from '@component/PrivateRoute';
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
                        <ErrorBoundary>
                            <Layout>
                                <Routes>
                                    <Route path="/" element={<Home/>}/>
                                    <Route path="/login" element={<Login/>}/>
                                    <Route path="/register" element={<Register/>}/>

                                    <Route path="/account" element={<PrivateRoute accessLevels={["admin", "client"]}><AccountDetails/></PrivateRoute>}/>
                                    <Route path="/changePassword" element={<PrivateRoute accessLevels={["admin", "client"]}><ChangePassword/></PrivateRoute>}/>

                                    <Route path="/addAccount" element={<PrivateRoute accessLevels={["admin"]}><AddAccount/></PrivateRoute>}/>
                                    <Route path="/accounts" element={<PrivateRoute accessLevels={["admin"]}><ListAccounts/></PrivateRoute>}/>
                                    <Route path="/account/:username" element={<PrivateRoute accessLevels={["admin"]}><EditAccount/></PrivateRoute>}/>

                                    <Route path="/error" element={<Error status={500} description={"Sorry, something went wrong."}/>}/>
                                    <Route path="/*" element={<Error status={404} description={"Sorry, the page you visited does not exist."}/>}/>
                                </Routes>
                            </Layout>
                        </ErrorBoundary>
                    </BrowserRouter>
                </ApiContext.Provider>
            </AccessLevelContext.Provider>
        </AuthContext.Provider>
    );
};
