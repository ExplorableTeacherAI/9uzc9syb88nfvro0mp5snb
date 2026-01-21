import { createContext, useContext, useMemo, type ReactNode } from 'react';

export type AppMode = 'editor' | 'preview';

interface AppModeContextType {
    mode: AppMode;
    isEditor: boolean;
    isPreview: boolean;
}

const AppModeContext = createContext<AppModeContextType | undefined>(undefined);

interface AppModeProviderProps {
    children: ReactNode;
    defaultMode?: AppMode;
}

/**
 * Provider component that determines the app mode from:
 * 1. URL parameter (?mode=editor or ?mode=preview)
 * 2. Environment variable (VITE_APP_MODE)
 * 3. Default fallback (editor)
 */
export const AppModeProvider = ({
    children,
    defaultMode = 'editor'
}: AppModeProviderProps) => {
    const mode = useMemo(() => {
        // First, check URL parameters from both regular search and hash-based search
        // This handles both ?mode=preview and #/?mode=preview patterns
        let urlMode: string | null = null;

        // Check regular query string first
        const regularParams = new URLSearchParams(window.location.search);
        urlMode = regularParams.get('mode');

        // If not found, check hash-based query string (for HashRouter)
        if (!urlMode && window.location.hash) {
            const hashParts = window.location.hash.split('?');
            if (hashParts.length > 1) {
                const hashParams = new URLSearchParams(hashParts[1]);
                urlMode = hashParams.get('mode');
            }
        }

        if (urlMode === 'editor' || urlMode === 'preview') {
            return urlMode as AppMode;
        }

        // Second, check environment variable
        const envMode = import.meta.env.VITE_APP_MODE;
        if (envMode === 'editor' || envMode === 'preview') {
            return envMode as AppMode;
        }

        // Fallback to default
        return defaultMode;
    }, [defaultMode]);

    const value = useMemo(() => ({
        mode,
        isEditor: mode === 'editor',
        isPreview: mode === 'preview',
    }), [mode]);

    return (
        <AppModeContext.Provider value={value}>
            {children}
        </AppModeContext.Provider>
    );
};

/**
 * Hook to access the current app mode
 * @returns AppModeContextType with mode, isEditor, and isPreview
 * @throws Error if used outside of AppModeProvider
 */
export const useAppMode = (): AppModeContextType => {
    const context = useContext(AppModeContext);
    if (!context) {
        throw new Error('useAppMode must be used within AppModeProvider');
    }
    return context;
};
