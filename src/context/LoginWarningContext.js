import { createContext, useState, useContext } from "react";

const LoginWarningContext = createContext();

export const LoginWarningProvider = ({ children }) => {

  const [returnUrl, setReturnUrl] = useState('');

  const [LoginWarning, setLoginWarning] = useState(false);
  const handleLoginWarning = (returnUrl) => {
    setReturnUrl(returnUrl);
    setLoginWarning(true);
  }
  const handleCloseLoginWarning = () => setLoginWarning(false);

  return (
    <LoginWarningContext.Provider value={{
      returnUrl,
      LoginWarning,
      handleLoginWarning,
      handleCloseLoginWarning
    }}>
      {children}
    </LoginWarningContext.Provider>
  );
};

// Hook para usar o contexto
export const useLoginWarning = () => {
  return useContext(LoginWarningContext);
};