import { createContext, useState, useEffect, useContext } from "react";
import { useAuth } from "./AuthContext";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { fetchWithErrorHandling } from "@/treatment/fetch";

const UserContext = createContext();
const apiUrl = process.env.NEXT_PUBLIC_API

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Define como true no início

  const { getToken } = useAuth();
  const router = useRouter();

  const [balanceAwaitRelease, setBalanceAwaitRelease] = useState();
  const [balanceReleasedWithdraw, setBalanceReleasedWithdraw] = useState();

  const register = async (name, email, documentId, password) => {

    const payload = {
      name,
      email,
      documentId,
      password
    };

    setLoading(true);

    const response = await fetchWithErrorHandling(`${apiUrl}/account/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const data = await response.json();
      return { status: true, data };
    }
    else return { status: false, data: await response.text() };
  }

  const update = async (userId, name, email, documentId, phone) => {
    const payload = {
      id: userId,
      name,
      email,
      documentId,
      phone
    };

    setLoading(true);

    const user = getToken();

    const response = await fetchWithErrorHandling(`${apiUrl}/account/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}`, },
      body: JSON.stringify(payload),
    });

    if (response.status === 401) {
      toast.error('Faça o login novamente');
      router.push("/login"); // Redireciona para o login se o token estiver inválido
      return { status: false };
    }

    if (response.status !== 200 && response.status !== 201) {
      toast.error('Erro ao atualizar usuário, verifique todos os campos');
      return { status: false };
    }

    const data = await response.json();

    if (response.ok) return { status: true, data };
    else return { status: false, data };
  }

  const updateAddress = async (userId, street, city, state, zipCode, country) => {
    const payload = {
      userId,
      street,
      city,
      state,
      zipCode,
      country
    };

    setLoading(true);

    const user = getToken();

    const response = await fetchWithErrorHandling(`${apiUrl}/account/update/address`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}`, },
      body: JSON.stringify(payload),
    });

    if (response.status === 401) {
      toast.error('Faça o login novamente');
      router.push("/login"); // Redireciona para o login se o token estiver inválido
      return { status: false };
    }

    if (response.status !== 200 && response.status !== 201) {
      toast.error('Erro ao atualizar endereço, verifique todos os campos');
      return { status: false };
    }

    if (response.ok) return { status: true };
    else return { status: false };
  }

  const updateAvatar = async (userId, formData) => {

    setLoading(true);
    const user = getToken();

    const response = await fetchWithErrorHandling(`${apiUrl}/account/update/avatar/${userId}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${user.token}`, },
      body: formData,
    });

    if (response.status === 401) {
      toast.error('Faça o login novamente');
      router.push("/login"); // Redireciona para o login se o token estiver inválido
      return { status: false };
    }

    const data = await response.text();

    if (response.ok) return { status: true, data };
    else return { status: false, data };
  }

  const removeAvatar = async () => {

    setLoading(true);
    const user = getToken();

    const response = await fetchWithErrorHandling(`${apiUrl}/account/remove/avatar`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${user.token}`, }
    });

    if (response.status === 401) {
      toast.error('Faça o login novamente');
      router.push("/login"); // Redireciona para o login se o token estiver inválido
      return { status: false };
    }

    const data = await response.text();

    if (response.ok) return { status: true, data };
    else return { status: false, data };
  }

  const changePassword = async (oldPassword, newPassword) => {

    setLoading(true);
    const user = getToken();

    const response = await fetchWithErrorHandling(`${apiUrl}/account/update/password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}`, },
      body: JSON.stringify({ oldPassword, newPassword })
    });

    if (response.status === 401) {
      toast.error('Faça o login novamente');
      router.push("/login"); // Redireciona para o login se o token estiver inválido
      return { status: false };
    }

    if (response.ok) {
      const data = await response.text();
      return { status: true, data };
    }
    else return { status: false, response };
  }

  const requestChallenge = async (email) => {

    setLoading(true);

    const response = await fetchWithErrorHandling(`${apiUrl}/account/request/challenge`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reference: email })
    });

    if (response.ok) {
      return { status: true };
    }
    else return { status: false, response };
  }

  const changePasswordWithChallenge = async (userMail, challenge, newPassword) => {

    setLoading(true);
    const user = getToken();

    const response = await fetchWithErrorHandling(`${apiUrl}/account/password/update/with/challenge`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userMail, challenge, newPassword })
    });

    if (response.ok) {
      const data = await response.text();
      return { status: true, data };
    }
    else return { status: false, response };
  }

  const balanceAwaitingRelease = async () => {

    setLoading(true);
    const user = getToken();

    if (!user) return;

    const response = await fetchWithErrorHandling(`${apiUrl}/account/balanceAwaitingRelease`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${user.token}`, }
    });

    if (response.status === 401) {
      toast.error('Faça o login novamente');
      router.push("/login"); // Redireciona para o login se o token estiver inválido
      return { status: false };
    }

    const data = await response.json();

    if (response.ok) {
      setBalanceAwaitRelease(data?.balance);
      return { status: true, data };
    }
    else return { status: false, data };
  }

  const balanceReleasedForWithdraw = async () => {

    setLoading(true);
    const user = getToken();

    if (!user) return;

    const response = await fetchWithErrorHandling(`${apiUrl}/account/balanceReleasedForWithdraw`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${user.token}`, }
    });

    if (response.status === 401) {
      toast.error('Faça o login novamente');
      router.push("/login"); // Redireciona para o login se o token estiver inválido
      return { status: false };
    }

    const data = await response.json();

    if (response.ok) {
      setBalanceReleasedWithdraw(data?.balance);
      return { status: true, data };
    }
    else return { status: false, data };
  }

  useEffect(() => {
    setLoading(false); // Carregamento concluído
  }, []);

  return (
    <UserContext.Provider value={{
      user,
      loading,
      balanceAwaitRelease,
      balanceReleasedWithdraw,
      setUser,
      register,
      update,
      updateAddress,
      updateAvatar,
      removeAvatar,
      balanceAwaitingRelease,
      balanceReleasedForWithdraw,
      changePassword,
      requestChallenge,
      changePasswordWithChallenge
    }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook para usar o contexto
export const useUser = () => {
  return useContext(UserContext);
};