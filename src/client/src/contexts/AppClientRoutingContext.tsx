import { PAGE } from '#/config/pages';
import { useSearchParams, useNavigate } from 'react-router';
import React, { createContext, useContext, ReactNode } from 'react';

type AppClientRoutingContextType = {
    route: string;
    goTo: (route: string) => void;
    goBack: () => void;
    goForward: () => void;
};
const AppClientRoutingContext =
    createContext<AppClientRoutingContextType | null>(null);

type AppClientRoutingProviderProps = {
    children?: ReactNode;
};
export function AppClientRoutingProvider({
    children,
}: AppClientRoutingProviderProps) {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const route = searchParams.get('route');

    const goTo = (selectedRoute: string) => {
        const newSearchParams = new URLSearchParams({ route: selectedRoute });
        navigate(`/client?${newSearchParams}`);
    };

    const goBack = () => window.history.back();

    const goForward = () => window.history.forward();

    return (
        <AppClientRoutingContext.Provider
            value={{
                route: route || PAGE.index,
                goTo,
                goBack,
                goForward,
            }}
        >
            {children}
        </AppClientRoutingContext.Provider>
    );
}

export function useAppClientRouting(): AppClientRoutingContextType {
    const context = useContext(AppClientRoutingContext);

    if (!context) throw new Error('AppClientRoutingContext was not provided');

    return context;
}
