import { createContext, useState, useEffect, useContext } from "react";
import { useAuth } from "./AuthContext";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { fetchWithErrorHandling } from "@/treatment/fetch";

const CampaignContext = createContext();
const apiUrl = process.env.NEXT_PUBLIC_API

export const CampaignProvider = ({ children }) => {

  const router = useRouter();

  const [loading, setLoading] = useState(true); // Define como true no início
  const [categories, setCaregories] = useState([]);

  const [categoryId, setCategoryId] = useState(undefined);
  const [initialDate, setInitialDate] = useState(undefined);
  const [finalDate, setFinalDate] = useState(undefined);

  const { getToken } = useAuth();

  const handleGetCategories = async () => {
    setLoading(true);

    const response = await fetchWithErrorHandling(`${apiUrl}/campaign/get/categories`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', },
    });

    const data = await response.json();
    setCaregories(data);
    if (response.ok) return { status: true, data };
    else return { status: false, data };
  }

  const handleCreateCampaign = async (formData) => {
    setLoading(true);

    const user = getToken();

    const response = await fetchWithErrorHandling(`${apiUrl}/campaign/create`, {
      method: 'POST',
      headers: { 'Authorization': user?.token ? `Bearer ${user.token}` : '', },
      body: formData
    });

    const data = await response.json();
    return { status: response.ok, data: data };
  }

  const handleUpdateCampaign = async (formData) => {
    setLoading(true);

    const user = getToken();

    const response = await fetchWithErrorHandling(`${apiUrl}/campaign/update`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${user.token}`, },
      body: formData
    });

    const data = await response.json();
    return { status: response.ok, data: data };
  }

  const handleUpdateImagesCampaign = async (campaignId, formData) => {
    setLoading(true);

    const user = getToken();

    const response = await fetchWithErrorHandling(`${apiUrl}/campaign/update/images/${campaignId}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${user.token}`, },
      body: formData
    });

    const data = await response.json();
    return { status: response.ok, data: data };
  }

  const handleDesactiveCampaign = async (campaignId) => {
    setLoading(true);

    const user = getToken();

    const response = await fetchWithErrorHandling(`${apiUrl}/campaign/desactive/${campaignId}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${user.token}`, }
    });

    const data = await response.json();
    return { status: response.ok, data: data };
  }

  const handleDeleteImages = async (payload) => {
    setLoading(true);

    const user = getToken();

    const response = await fetchWithErrorHandling(`${apiUrl}/campaign/delete/images`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${user.token}`, 'Content-Type': 'application/json' },
      body: payload
    });

    const data = await response.json();
    return { status: response.ok, data: data };
  }

  const handleGetCampaigns = async ({ startDate, endDate, guids, categoryId, name, status, page, pageSize }) => {
    setLoading(true);

    const payload = {
      startDate: startDate ?? null,
      endDate: endDate ?? null,
      guids: guids ?? null,
      categoryId: categoryId ?? null,
      name: name ?? null,
      status: status ?? null,
      page,
      pageSize
    }

    const response = await fetchWithErrorHandling(`${apiUrl}/campaign/filter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (response.ok) return { status: true, data };
    else return { status: false, data };
  }

  const handleGetCampaignsByUser = async (page, pageSize) => {
    setLoading(true);

    const user = getToken();

    const response = await fetchWithErrorHandling(`${apiUrl}/campaign/get/by/user/${page}/${pageSize}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user?.token}` }
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
    else return { status: false, response };
  }

  const handleSetCategoryId = (categoryId) => {
    setCategoryId(categoryId);
  }

  const handleSetDate = (initial, final) => {
    setInitialDate(initial);
    setFinalDate(final);
  }

  const handleGetCampaignBySlug = async (slug) => {

    const response = await fetchWithErrorHandling(`${apiUrl}/campaign/${slug}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', },
    });

    const data = await response.json();
    if (response.ok) return { status: true, data };
    else return { status: false, data };
  }

  const handleGeneratePaymentViaPIX = async (campaignId, value, donorName, donorEmail,
    donorDocumentId, donorPhone
  ) => {
    setLoading(true);

    const payload = {
      campaignId,
      value: value,
      donorName,
      donorEmail,
      donorDocumentId,
      donorPhone
    }

    const response = await fetchWithErrorHandling(`${apiUrl}/campaign/donation/pix/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (response.ok) return { status: true, data };
    else return { status: false, data };
  }

  const handleRecordUtm = async (utmPayload) => {
    setLoading(true);

    const response = await fetchWithErrorHandling(`${apiUrl}/campaign/record/utm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', },
      body: JSON.stringify(utmPayload)
    });

    const data = await response.text();
    if (response.ok) return { status: true, data };
    else return { status: false, data };
  }

  const getLogs = async (campaignId) => {
    setLoading(true);

    const response = await fetchWithErrorHandling(`${apiUrl}/campaign/logs/${campaignId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', },
    });

    const data = await response.json();
    if (response.ok) return { status: true, data };
    else return { status: false, data };
  }

  const reportCampaign = async (campaignId, iam, aRespectFor, why, description) => {

    setLoading(true);

    const user = getToken();
    const response = await fetchWithErrorHandling(`${apiUrl}/campaign/report`, {
      method: 'POST',
      headers: {
        'Authorization': user?.token ? `Bearer ${user.token}` : '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({campaignId, iam, aRespectFor, why, description})
    });

    setLoading(false);
    if (response.ok) return { status: true };
    else return { status: false };    
  }

  const checkPaymentDonation = async (transactionId) => {
    
    const response = await fetchWithErrorHandling(`${apiUrl}/campaign/payment/check/${transactionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();

    if (response.ok) return { status: true, data };
    else return { status: false };
  }

  const makeSmallDonation = async (campaignId, quantity) => {

    setLoading(true);

    const user = getToken();
    const response = await fetchWithErrorHandling(`${apiUrl}/campaign/donation/small/digitalStickers`, {
      method: 'POST',
      headers: {
        'Authorization': user?.token ? `Bearer ${user.token}` : '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({campaignId, quantity})
    });

    setLoading(false);
    if (response.ok) return { status: true };
    else return { status: false };    
  }

  const handleGetPlans = async () => {
    setLoading(true);

    const user = getToken();

    const response = await fetchWithErrorHandling(`${apiUrl}/campaign/plans`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` }
    });

    const data = await response.json();
    if (response.ok) return { status: true, data };
    else return { status: false, data };
  }

  const handleAddComment = async (campaignId, comment) => {
    setLoading(true);

    const user = getToken();

    const response = await fetchWithErrorHandling(`${apiUrl}/campaign/add/comment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
      body: JSON.stringify({ campaignId, comment })
    });
    
    if (response.ok) return { status: true };
    else return { status: false, data };
  }

  const handleRemoveComment = async (commentId) => {
    setLoading(true);

    const user = getToken();

    const response = await fetchWithErrorHandling(`${apiUrl}/campaign/remove/comment/${commentId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` }
    });
    
    if (response.ok) return { status: true };
    else return { status: false, data };
  }

  useEffect(() => {
    setLoading(false); // Carregamento concluído
  }, []);

  return (
    <CampaignContext.Provider value={{
      handleGetCategories,
      handleCreateCampaign,
      handleUpdateCampaign,
      handleGetCampaigns,
      handleSetCategoryId,
      handleSetDate,
      handleGetCampaignBySlug,
      handleGeneratePaymentViaPIX,
      handleGetCampaignsByUser,
      handleUpdateImagesCampaign,
      handleDeleteImages,
      handleDesactiveCampaign,
      getLogs,
      reportCampaign,
      checkPaymentDonation,
      makeSmallDonation,
      handleGetPlans,
      handleAddComment,
      handleRemoveComment,
      handleRecordUtm,
      categories,
      categoryId,
      initialDate,
      finalDate,
    }}>
      {children}
    </CampaignContext.Provider>
  );
};

// Hook para usar o contexto
export const useCampaign = () => {
  return useContext(CampaignContext);
};