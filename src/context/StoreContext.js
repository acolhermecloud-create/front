import { createContext, useContext, useState } from "react";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { fetchWithErrorHandling } from "@/treatment/fetch";

const StoreContext = createContext();
const apiUrl = process.env.NEXT_PUBLIC_API;

export const StoreProvider = ({ children }) => {

  const { getToken } = useAuth();
  const router = useRouter();

  const [userDigitalStickersState, setUserDigitalStickersState] = useState();
  const [userDigitalStickersUsageState, setUserDigitalStickersUsageState] = useState();

  const getDigitalStickers = async () => {

    const response = await fetchWithErrorHandling(`${apiUrl}/store/get/digitalStickers`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();

    if (response.ok) return { status: true, data };
    else return { status: false };
  }

  const handleBuyDigitalSticker = async (planId, qtd, campaignId = null) => {
    const user = getToken();

    const response = await fetchWithErrorHandling(`${apiUrl}/store/buy/digitalStickers`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${user?.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ planId, qtd, campaignId })
    });

    if (response.status === 401) {
      toast.error('Faça o login novamente');
      router.push("/login"); // Redireciona para o login se o token estiver inválido
      return { status: false };
    }

    if (response.ok) {
      const data = await response.json();
      return { status: true, data };
    }
    else return { status: false };
  }

  const checkDigitalStickers = async (transactionId) => {

    const user = getToken();

    const response = await fetchWithErrorHandling(`${apiUrl}/store/payment/check/${transactionId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${user.token}`,
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();

    if (response.ok) return { status: true, data };
    else return { status: false };
  }

  const getUserDigitalStickers = async () => {

    const user = getToken();

    const response = await fetchWithErrorHandling(`${apiUrl}/store/get/user/digitalStickers`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${user?.token}`,
        'Content-Type': 'application/json',
      }
    });

    if (response.ok) {
      const data = await response.json();
      setUserDigitalStickersState(data);
      return { status: true, data };
    }
    else return { status: false };
  }

  const getUserDigitalStickersUsage = async () => {

    const user = getToken();

    const response = await fetchWithErrorHandling(`${apiUrl}/store/get/user/usage/digitalStickers`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${user?.token}`,
        'Content-Type': 'application/json',
      }
    });

    if (response.ok) {
      const data = await response.json();
      setUserDigitalStickersUsageState(data);
      return { status: true, data };
    }
    else return { status: false };
  }

  return (
    <StoreContext.Provider value={{
      userDigitalStickersState,
      userDigitalStickersUsageState,
      getDigitalStickers,
      handleBuyDigitalSticker,
      checkDigitalStickers,
      getUserDigitalStickers,
      getUserDigitalStickersUsage
    }}>
      {children}
    </StoreContext.Provider>
  );
};

// Hook para usar o contexto
export const useStore = () => {
  return useContext(StoreContext);
};