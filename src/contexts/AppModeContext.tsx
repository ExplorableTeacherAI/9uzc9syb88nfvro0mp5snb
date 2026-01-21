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
const getAppMode = (defaultMode: AppMode): AppMode => {
    // Check all possible URL patterns for mode parameter
    let urlMode: string | null = null;

    // Pattern 1: Regular query string before hash (e.g., ?mode=preview#/)
    const regularParams = new URLSearchParams(window.location.search);
    urlMode = regularParams.get('mode');

    // Pattern 2: Query string after hash (e.g., #/?mode=preview)
    if (!urlMode && window.location.hash) {
        const hashParts = window.location.hash.split('?');
        if (hashParts.length > 1) {
            const hashParams = new URLSearchParams(hashParts[1]);
            urlMode = hashParams.get('mode');
        }
    }

    // Pattern 3: Check full URL href as fallback
    if (!urlMode) {
        const fullUrl = window.location.href;
        const modeMatch = fullUrl.match(/[?&]mode=(editor|preview)/);
        if (modeMatch) {
            urlMode = modeMatch[1];
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
};

export const AppModeProvider = ({
    children,
    defaultMode = 'editor'
}: AppModeProviderProps) => {
    // Calculate mode once on mount - URL won't change during session
    const mode = getAppMode(defaultMode);

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
