import '#/styles/global.css';
import React from 'react';
import { AppContextProvider } from './contexts';
import { ClientRouter } from './router/ClientRouter';
import { BrowserRouter, Routes, Route } from 'react-router';

export function App() {
    return (
        <React.StrictMode>
            <BrowserRouter>
                <Routes>
                    <Route
                        path="/client"
                        element={
                            <AppContextProvider>
                                <ClientRouter />
                            </AppContextProvider>
                        }
                    />
                </Routes>
            </BrowserRouter>
        </React.StrictMode>
    );
}
