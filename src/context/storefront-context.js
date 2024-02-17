import { createContext, useState, useContext } from 'react';

const StorefrontPhotoContext = createContext();

export const useStorefrontPhoto = () => useContext(StorefrontPhotoContext);

export const StorefrontPhotoProvider = ({ children }) => {
    const [avatarUrl, setAvatarUrl] = useState(null);
    const [coverUrl, setCoverUrl] = useState(null);

    const setAvatar = (url) => setAvatarUrl(url);
    const setCover = (url) => setCoverUrl(url);

    return (
        <StorefrontPhotoContext.Provider value={{ avatarUrl, coverUrl, setAvatar, setCover }}>
            {children}
        </StorefrontPhotoContext.Provider>
    );
};
