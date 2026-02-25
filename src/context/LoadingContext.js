import { createContext, useState, useContext } from "react";

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const handleLoading = () => setLoading(true);
  const handleCloseLoading = () => setLoading(false);

  return (
    <LoadingContext.Provider value={{
      loading,
      handleLoading,
      handleCloseLoading
    }}>
      {children}
    </LoadingContext.Provider>
  );
};

// Hook para usar o contexto
export const useLoading = () => {
  return useContext(LoadingContext);
};