import { createContext, useContext, useState } from 'react'

const PublishContext = createContext(null);

export function PublishProvider({ children }) {
    const [isOpen, setIsOpen] = useState(false);
    const [publishVersion, setPublishVersion] = useState(0);

    return (
        <PublishContext.Provider value={{
            isOpen,
            publishVersion,
            openPublish:     () => setIsOpen(true),
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
