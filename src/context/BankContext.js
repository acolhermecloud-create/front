import { createContext, useContext, useState } from "react";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { fetchWithErrorHandling } from "@/treatment/fetch";

const BankContext = createContext();
const apiUrl = process.env.NEXT_PUBLIC_API;

export const BankProvider = ({ children }) => {

  const { getToken } = useAuth();
  const router = useRouter();

  const requestWithdraw = async (value) => {

    const user = getToken();

    if (!user) {
      toast.error('Faça o login novamente');
      router.push("/login"); // Redireciona para o login se o token estiver inválido
      return { status: false };
    }

    const response = await fetchWithErrorHandling(`${apiUrl}/bank/withdraw`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}`, },
      body: JSON.stringify({ value })
    });

    if (response.ok) return { status: true };
    else {
      const data = await response.json();
      return { status: false, data };
    }
  }

  const getTransactions = async (page, pageSize) => {
    const user = getToken();

    if (!user) {
      toast.error('Faça o login novamente');
      router.push("/login"); // Redireciona para o login se o token estiver inválido
      return { status: false };
    }

    const response = await fetchWithErrorHandling(`${apiUrl}/bank/get/transactions/${page}/${pageSize}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}`, }
    });

    if (response.ok){
      const data = await response.json();
      return { status: true, data };
    }
    else {
      return { status: false, response };
    }
  }

  const getBalance = async () => {
    const user = getToken();

    if (!user) {
      return { status: false };
    }

    const response = await fetchWithErrorHandling(`${apiUrl}/bank/get/balance`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}`, }
    });

    if (response.ok){
      const data = await response.json();
      return { status: true, data };
    }
    else {
      return { status: false, response };
    }
  }

  return (
    <BankContext.Provider value={{
      requestWithdraw,
      getTransactions,
      getBalance
    }}>
      {children}
    </BankContext.Provider>
  );
};

// Hook para usar o contexto
export const useBank = () => {
  return useContext(BankContext);
};