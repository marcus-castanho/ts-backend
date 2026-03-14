import { ReactNode } from 'react';
import { AppClientRoutingProvider } from './AppClientRoutingContext';

type AppContextProviderProps = { children: ReactNode };
export function AppContextProvider({ children }: AppContextProviderProps) {
    return <AppClientRoutingProvider>{children}</AppClientRoutingProvider>;
}
