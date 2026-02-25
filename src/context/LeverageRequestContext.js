import { createContext, useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { useAuth } from "./AuthContext";
import { fetchWithErrorHandling } from "@/treatment/fetch";

const LeverageRequestContext = createContext();
const apiUrl = process.env.NEXT_PUBLIC_API

export const LeverageRequestProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [planId, setPlanId] = useState();

  const [openModal, setOpen] = useState(false);
  const handleOpenLeverageRequestModal = (id) => {
    setPlanId(id)
    setOpen(true);
  }
  const handleCloseLeverageRequestModal = () => setOpen(false);
  const [leverageRequest, setLeverageRequest] = useState();
  const [sented, setSented] = useState(false);

  const { getToken } = useAuth();

  const handleAddLeverageRequest = async (formData) => {

    const user = getToken();

    const response = await fetchWithErrorHandling(`${apiUrl}/leverage/create`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${user.token}`, },
      body: formData
    });

    if(response.ok){
      return { status: response.ok, data: '' };
    }else{
      const data = await response.json();
      return { status: response.ok, data: data };
    }
  }

  const onSubmitForm = (form) => {
    setLeverageRequest(form);
  }

  useEffect(() => {
    setLoading(false); // Carregamento concluído
  }, []);

  return (
    <LeverageRequestContext.Provider value={{
      openModal,
      leverageRequest,
      sented,
      planId,
      setSented,
      handleOpenLeverageRequestModal,
      handleCloseLeverageRequestModal,
      handleAddLeverageRequest,
      onSubmitForm,
    }}>
      {children}
    </LeverageRequestContext.Provider>
  );
};

// Hook para usar o contexto
export const useLeverageRequest = () => {
  return useContext(LeverageRequestContext);
};