'use client'
import AboutHomeSection from "@/components/about-section";
import BannerV2 from "@/components/banner-v2";
import CtaSection from "@/components/cta-section";
import DonationCategoryNav from "@/components/donation-category-nav";
import DonationList from "@/components/donation-list";
import LoadingModal from "@/components/modal/LoadingModal";
import NewsSection from "@/components/news-section";
import { useAuth } from "@/context/AuthContext";
import { useCampaign } from "@/context/CampaignContext";
import { Box } from "@mui/material";
import { useEffect, useRef } from "react";

export default function Home() {

  const { validateTokenWithOutRedirect } = useAuth();
  const { handleGetCategories } = useCampaign();
  const isMounted = useRef(true);

  useEffect(() => {
    if(isMounted.current){
      isMounted.current = false;
      validateTokenWithOutRedirect();
      handleGetCategories();
    }
  }, [])

  return (
    <div>
      <Box>
        {/* Header */}
        <BannerV2 />
        <DonationCategoryNav />
        <DonationList />
        {/*<NewsSection />*/}
        <AboutHomeSection />
        <CtaSection />
      </Box>
    </div>
  );
}
