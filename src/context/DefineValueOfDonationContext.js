import { createContext, useState, useContext, useEffect } from "react";

const DefineValueOfDonationContext = createContext();

export const DefineValueOfDonationProvider = ({ children }) => {

  const [campaign, setCampaign] = useState();
  const [imagesOfCampaign, setImagesOfCampaign] = useState();

  const [open, setOpen] = useState(false);
  const handleOpenDefineValueOfDonation = (campaign, images) => {
    setCampaign(campaign);
    setImagesOfCampaign(images);
    setOpen(true);
  }
  const handleCloseDefineValueOfDonation = () => setOpen(false);
  
  return (
    <DefineValueOfDonationContext.Provider value={{
      open,
      campaign,
      imagesOfCampaign,
      handleOpenDefineValueOfDonation,
      handleCloseDefineValueOfDonation
    }}>
      {children}
    </DefineValueOfDonationContext.Provider>
  );
};

// Hook para usar o contexto
export const useDefineValueOfDonation = () => {
  return useContext(DefineValueOfDonationContext);
};