import { createContext, useContext, useState } from 'react'

const PublishContext = createContext(null);

export function PublishProvider({ children }) {
    const [isOpen,         setIsOpen]         = useState(false);
    const [publishVersion, setPublishVersion] = useState(0);
    const [publishMode,    setPublishMode]    = useState('track');

    return (
        <PublishContext.Provider value={{
            isOpen,
            publishVersion,
            publishMode,
            openPublish:     (mode = 'track') => { setPublishMode(mode); setIsOpen(true); },
            closePublish:    () => setIsOpen(false),
            notifyPublished: () => setPublishVersion(v => v + 1),
        }}>
            {children}
        </PublishContext.Provider>
    );
}

export function usePublish() {
    return useContext(PublishContext);
}
