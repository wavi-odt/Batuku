import { createContext, useContext, useState } from 'react'

const PublishContext = createContext(null);

export function PublishProvider({ children }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <PublishContext.Provider value={{
            isOpen,
            openPublish:  () => setIsOpen(true),
            closePublish: () => setIsOpen(false),
        }}>
            {children}
        </PublishContext.Provider>
    );
}

export function usePublish() {
    return useContext(PublishContext);
}
