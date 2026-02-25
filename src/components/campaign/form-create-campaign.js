import { Circle, KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import { Box, Button, Container, Divider, Grid, Link, MobileStepper, Stack, Typography } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import { useEffect, useState } from "react";
import CampaignStepperOne from "./steppers/campaign-stepper-one";
import CampaignStepperTwo from "./steppers/campaign-stepper-two";
import CampaignStepperThree from "./steppers/campaign-stepper-three";
import CampaignStepperFour from "./steppers/campaign-stepper-four";
import { useLoading } from "@/context/LoadingContext";
import { useCampaign } from "@/context/CampaignContext";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import UpSellByPlan from "./store/up-sell-by-plan";
import BuyKaixinhas from "@/pages/loja/adesivo-digital";
import usePixelEvent from "@/hooks/usePixelEvent";
import useFacebookPixelApi from "@/hooks/useFacebookPixelApi";
import { centsToDecimal } from "@/utils/functions";

const steps = 4;

export default function FormCreateCampaign() {

  const theme = useTheme();
  const { handleLoading, handleCloseLoading } = useLoading();

  const { handleSetToken } = useAuth();
  const { handleCreateCampaign } = useCampaign();

  const [activeStep, setActiveStep] = useState(0);

  const { getToken } = useAuth();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const firePixelEvent = usePixelEvent();
  const {sendEventToFacebook} = useFacebookPixelApi();

  // Valor bruto para cálculo
  const [title, setTitle] = useState('');
  const [goalRaw, setGoalRaw] = useState("0");

  const [name, setName] = useState('');
  const [documentId, setDocumentId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [beneficiaryType, setBeneficiaryType] = useState(0);
  const [beneficiaryName, setBeneficiaryName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [deadLine, setDeadLine] = useState(7);
  const [files, setFiles] = useState([]);

  const [showUpSell, setShowUpSell] = useState(false);
  const [slug, setSlug] = useState('');
  const [campaignId, setCampaignId] = useState();

  const handleSetDeadLine = (dLine) => {
    setDeadLine(dLine)
  }

  const handleSetDocumentId = (docId) => {
    setDocumentId(docId.replace(/\D/g, ''));
  }

  const handleFinish = async () => {
    const formData = new FormData();
    formData.append('CategoryId', category);
    formData.append('Title', title);
    formData.append('Description', description);
    formData.append('FinancialGoal', goalRaw);
    formData.append('Deadline', deadLine);
    files.forEach((file) => {
      formData.append('Files', file);
    });
    formData.append('BeneficiaryName', beneficiaryName);
    formData.append('Name', name);
    formData.append('DocumentId', documentId.replace(/\D/g, ''));
    formData.append('Email', email);
    formData.append('Password', password);

    handleLoading();

    const result = await handleCreateCampaign(formData);
    handleCloseLoading();

    if (!result.status) {
      toast.error(`${result.data.message}`);
    } else {
      
      const token = getToken();
      const mail = email && email !== '' ? email : token?.email;

      firePixelEvent('Lead', {
        email: mail,
        value: (parseFloat(goalRaw) / 100).toFixed(2),
        currency: "BRL"
      }, { eventID: 'complete-campaign-1554207512648166' });

      firePixelEvent('Lead', {
        email: mail,
        value: (parseFloat(goalRaw) / 100).toFixed(2),
        currency: "BRL"
      }, { eventID: 'complete-campaign-988398956462728' });

      await sendEventToFacebook('Lead', {
        email: mail,
        value: (parseFloat(goalRaw) / 100).toFixed(2),
        currency: "BRL"
      });

      if (result.data && result.data.login && result.data.login.token && result.data.login.token !== '') {
        handleSetToken(result.data.login);
      }
      if (result.data.campaign.slug) {
        setSlug(result.data.campaign.slug);
        setCampaignId(result.data.campaign.id);
      }
      setShowUpSell(true);
      clearFields();
    }
  }

  const clearFields = () => {
    setTitle('');
    setGoalRaw('0');
    setName('');
    setDocumentId('');
    setEmail('');
    setPassword('');
    setBeneficiaryType(0);
    setBeneficiaryName('');
    setCategory('');
    setDescription('');
    setDeadLine(7);
    setFiles([]);
  }
  useEffect(() => {
    console.log('email', email)
  }, [email])

  return (
    <Container maxWidth="lg">
      {!showUpSell ?
        (
          <Box
            sx={{
              display: 'flex',
              mt: 2,
              mb: 4,
              flexDirection: 'column',
              alignItems: 'center',  // Alinha o conteúdo horizontalmente
              justifyContent: 'center',  // Alinha o conteúdo verticalmente
            }}
          >
            <Box sx={{ width: '100%' }}>
              <MobileStepper
                variant="dots"
                steps={steps}
                position="static"
                activeStep={activeStep}
                sx={{ maxWidth: 400, flexGrow: 1, margin: '0 auto' }}  // Garante que o MobileStepper tenha um tamanho fixo

                backButton={
                  <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                    {theme.direction === 'rtl' ? (
                      <KeyboardArrowRight />
                    ) : (
                      <KeyboardArrowLeft />
                    )}
                    Voltar
                  </Button>
                } />
            </Box>

            {activeStep === 0 && (
              <CampaignStepperOne
                title={title}
                goalRaw={goalRaw}
                deadLine={deadLine}
                name={name}
                documentId={documentId}
                email={email}
                password={password}
                handleSetTitle={setTitle}
                handleSetGoal={setGoalRaw}
                handleSetDeadLine={handleSetDeadLine}
                handleSetName={setName}
                handleSetDocumentId={handleSetDocumentId}
                handleSetEmail={setEmail}
                handleSetPassword={setPassword}
                handleNext={handleNext} />)}

            {activeStep === 1 && (
              <CampaignStepperTwo
                beneficiaryType={beneficiaryType}
                beneficiaryName={beneficiaryName}
                category={category}
                handleSetBeneficiary={setBeneficiaryType}
                handleSetBeneficiaryName={setBeneficiaryName}
                handleSetCategory={setCategory}
                handleNext={handleNext} />
            )}
            {activeStep === 2 && (
              <CampaignStepperThree
                description={description}
                handleSetDescription={setDescription}
                handleNext={handleNext} />
            )}
            {activeStep === 3 && (
              <CampaignStepperFour
                files={files}
                handleFiles={setFiles}
                handleFinish={handleFinish} />
            )}
          </Box>
        )
        : (
          <>
            {/** 
           * <UpSellByPlan
            title={title}
            description={description}
            slug={slug} />
           */}
            <BuyKaixinhas
              campaignId={campaignId} />
          </>
        )
      }
    </Container>
  );
}

