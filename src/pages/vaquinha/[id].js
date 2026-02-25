import DonationDetails from "@/components/donation-details";
import { useCampaign } from "@/context/CampaignContext";
import { useLoading } from "@/context/LoadingContext";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

export default function DetalhesVaquinha(){

  const router = useRouter();
  const { id } = router.query;

  const isMounted = useRef(true);
  const [campaign, setCampaign] = useState();

  const { handleLoading, handleCloseLoading, loading } = useLoading();
  const { handleGetCampaignBySlug } = useCampaign();
  const [isLoading, setIsLoading] = useState(true);

  const getCampaignDetais = async (slug) => {
    handleLoading();
    const response = await handleGetCampaignBySlug(slug);
    
    if (response.status && response.data.campaign) {
      setCampaign(response.data.campaign);
    }else{
      location.href = "/404";
    }

    handleCloseLoading();
    setIsLoading(false);
  }
  
  useEffect(() => {
    if(isMounted.current && id){
      isMounted.current = false;
      getCampaignDetais(id);
    }
  }, [id]);

  return(
    <Box>
      <DonationDetails 
        loading={isLoading} 
        donation={campaign}/>
    </Box>
  );
}