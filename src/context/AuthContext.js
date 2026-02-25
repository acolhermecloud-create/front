import { useRouter } from "next/router";
import { createContext, useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { useUser } from "./UserContext";
import { fetchWithErrorHandling } from "@/treatment/fetch";

const AuthContext = createContext();
const apiUrl = process.env.NEXT_PUBLIC_API

const userType = 0;

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [loadingUser, setLoading] = useState(true); // Define como true no início

  const router = useRouter();

  const login = async (email, password) => {

    const encodedEmail = encodeURIComponent(email);
    const encodedPassword = encodeURIComponent(password);

    setLoading(true);

    const response = await fetchWithErrorHandling(`${apiUrl}/auth/login/${encodedEmail}/${encodedPassword}/${userType}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', }
    });

    const data = await response.json();

    if (response.ok) return { status: true, data };
    else return { status: false, data };
  }

  const finalizeAuthWithOtp = async (email, otp) => {

    const response = await fetchWithErrorHandling(`${apiUrl}/auth/otp/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({ email, otp })
    });

    if (response.ok) {
      const data = await response.json();
      return { status: true, data };
    }
    else return { status: false, response };
  }

  const createUrlToTwoFactor = async () => {

    const user = getToken();

    if (!user) {
      toast.error('Faça o login novamente');
      router.push("/login"); // Redireciona para o login se o token estiver inválido
      return { status: false };
    }
    
    const response = await fetchWithErrorHandling(`${apiUrl}/auth/generate/twofactor/image`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}`, },
    });

    if (response.ok) {
      const data = await response.json();
      return { status: true, data };
    }
    else return { status: false, response };
  }

  const saveTwoFa = async (payload) => {

    const user = getToken();

    if (!user) {
      toast.error('Faça o login novamente');
      router.push("/login"); // Redireciona para o login se o token estiver inválido
      return { status: false };
    }
    
    const response = await fetchWithErrorHandling(`${apiUrl}/auth/save/2fa`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}`, },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      const data = await response.json();
      return { status: true, data };
    }
    else return { status: false, data: await response.json() };
  }

  const deleteTwoFa = async () => {

    const user = getToken();

    if (!user) {
      toast.error('Faça o login novamente');
      router.push("/login"); // Redireciona para o login se o token estiver inválido
      return { status: false };
    }
    
    const response = await fetchWithErrorHandling(`${apiUrl}/auth/delete/2fa`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}`, }
    });

    if (response.ok) {
      const data = await response.json();
      return { status: true, data };
    }
    else return { status: false, data: await response.json() };
  }

  // Função para carregar o usuário do localStorage
  const handleSetToken = (data, stayConnected = true) => {
    setToken(data);
    if (stayConnected) {
      localStorage.setItem(`REQUEST_IDS_${process.env.NEXT_PUBLIC_APP_NAME}`, JSON.stringify(data));
      localStorage.setItem(`STAY_CONNECTED_${process.env.NEXT_PUBLIC_APP_NAME}`, JSON.stringify(stayConnected));  // Armazenar o estado de stayConnected também
    } else {
      sessionStorage.setItem(`REQUEST_IDS_${process.env.NEXT_PUBLIC_APP_NAME}`, JSON.stringify(data));
      localStorage.removeItem(`STAY_CONNECTED_${process.env.NEXT_PUBLIC_APP_NAME}`);  // Remover stayConnected de localStorage
    }
  };

  const getToken = () => {
    try {
      const stayConnected = JSON.parse(localStorage.getItem(`STAY_CONNECTED_${process.env.NEXT_PUBLIC_APP_NAME}`));

      // Verificar se o stayConnected está presente e é verdadeiro
      if (stayConnected) {
        const user = localStorage.getItem(`REQUEST_IDS_${process.env.NEXT_PUBLIC_APP_NAME}`);
        if (user) return JSON.parse(user);
        return null;
      } else {
        const user = sessionStorage.getItem(`REQUEST_IDS_${process.env.NEXT_PUBLIC_APP_NAME}`);
        if (user) return JSON.parse(user);
        return null;
      }
    } catch (error) {
      // Caso o valor de stayConnected não seja válido ou não exista
      return sessionStorage.getItem(`REQUEST_IDS_${process.env.NEXT_PUBLIC_APP_NAME}`);
    }
  };

  const validateToken = async () => {
    const user = getToken();

    if(!user) return;

    const response = await fetchWithErrorHandling(`${apiUrl}/auth/validate/${user.token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) {
      logout();
      toast.error('Faça o login novamente');
      router.push("/login");
    }
  }

  const validateTokenWithOutRedirect = async () => {
    const user = getToken();

    if(!user) return;

    const response = await fetchWithErrorHandling(`${apiUrl}/auth/validate/${user.token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) {
      logout();
      return false;
    }

    return true;
  }

  // Função de logout
  const logout = () => {
    sessionStorage.removeItem(`REQUEST_IDS_${process.env.NEXT_PUBLIC_APP_NAME}`);
    localStorage.removeItem(`REQUEST_IDS_${process.env.NEXT_PUBLIC_APP_NAME}`);
    setToken(null); // Define como null ao fazer logout
  };

  useEffect(() => {
    setLoading(false); // Carregamento concluído
  }, []);

  return (
    <AuthContext.Provider value={{
      token,
      loadingUser,
      login,
      handleSetToken,
      getToken,
      logout,
      validateToken,
      validateTokenWithOutRedirect,
      createUrlToTwoFactor,
      saveTwoFa,
      deleteTwoFa,
      finalizeAuthWithOtp
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar o contexto
export const useAuth = () => {
  return useContext(AuthContext);
};