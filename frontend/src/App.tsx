import { Error } from '@component/Error';
import { ErrorBoundary } from '@component/ErrorBoundary';
import { Layout } from '@component/Layout';
import { PrivateRoute } from '@component/PrivateRoute';
import { AccessLevel, AccessLevelContext, getAccessLevelFromToken } from '@context/AccessLevelContext';
import { Api, ApiContext, getApiFromLocalStorage } from '@context/ApiContext';
import { AuthContext, getTokenFromCookie, Token } from '@context/AuthContext';
import { AccountDetails } from '@page/AccountDetails';
import { AddAccount } from '@page/AddAccount';
import { ChangePassword } from '@page/ChangePassword';
import { EditAccount } from '@page/EditAccount';
import { Home } from '@page/Home';
import { ListAccounts } from '@page/ListAccounts';
import { Login } from '@page/Login';
import { Register } from '@page/Register';
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
