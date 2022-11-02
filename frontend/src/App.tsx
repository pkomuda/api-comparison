import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Home } from './component/Home';
import { Layout } from './component/Layout';
import { useState } from 'react';
import { AuthContext, getTokenFromCookie, Token } from './AuthContext';
import { Login } from './component/Login';
import { Register } from './component/Register';

export const App = () => {

    const auth = useState<Token>(
        getTokenFromCookie()
    );

    return (
        <AuthContext.Provider value={auth}>
            <BrowserRouter>
                <Layout>
                    <Routes>
                        <Route path="/" element={<Home/>}/>
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/register" element={<Register/>}/>
                    </Routes>
                </Layout>
            </BrowserRouter>
        </AuthContext.Provider>
    );
};
