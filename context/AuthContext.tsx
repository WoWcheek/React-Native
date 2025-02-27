import React, { useState, createContext } from "react";

const AuthContext = createContext({
    token: null as string | null,
    setToken: (_token: string | null) => {}
});

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children
}) => {
    const [token, setToken] = useState<string | null>(null);

    return (
        <AuthContext.Provider value={{ token, setToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthProvider, AuthContext };
