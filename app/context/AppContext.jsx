import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [profileImageUpdate, setProfileImageUpdate] = useState(0);

    return (
        <AppContext.Provider value={{ profileImageUpdate, setProfileImageUpdate }}>
          {children}
        </AppContext.Provider>
    );
};


export const useAppContext = () => {
  return useContext(AppContext);
};
