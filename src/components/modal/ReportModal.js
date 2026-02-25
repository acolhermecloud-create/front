import React, { useState } from "react";
import { Modal, Box, Typography, FormControl, 
  RadioGroup, FormControlLabel, Radio, TextField, Button, 
  FormLabel,
  Divider} from "@mui/material";
import { useCampaign } from "@/context/CampaignContext";
import { toast } from "react-toastify";
import { useLoading } from "@/context/LoadingContext";

const ReportModal = ({ campaignId, open, onClose }) => {
  const [donorStatus, setDonorStatus] = useState("");
  const [issueType, setIssueType] = useState("");
  const [reportReason, setReportReason] = useState("");
  const [details, setDetails] = useState("");

  const { reportCampaign } = useCampaign();
  const { handleLoading, handleCloseLoading } = useLoading();

  const handleSubmit = async (e) => {
    e.preventDefault();
    handleLoading();
    const response = await reportCampaign(campaignId, donorStatus, issueType, reportReason, details);
    if(response.status){
      toast.success("Vaquinha reportada");
    }
    handleCloseLoading();
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          height: 500,
          maxHeight: '80%',
          overflowY: 'auto',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 1,
        }}
      >
        <Typography variant="h6" component="h2" gutterBottom>
          Denunciar Campanha
        </Typography>
        <Divider/>
        <form onSubmit={handleSubmit}>
          <FormControl component="fieldset" fullWidth margin="normal">
            <FormLabel component="legend">Você é:</FormLabel>
            <RadioGroup
              value={donorStatus}
              onChange={(e) => setDonorStatus(e.target.value)}
              row
            >
              <FormControlLabel value="Sou um doador desta vaquinha" control={<Radio />} label="Sou um doador desta vaquinha" />
              <FormControlLabel value="Não sou um doador desta vaquinha" control={<Radio />} label="Não sou um doador desta vaquinha" />
            </RadioGroup>
          </FormControl>

          <Divider/>

          <FormControl component="fieldset" fullWidth margin="normal">
            <FormLabel component="legend">Minha denúncia é relativa a:</FormLabel>
            <RadioGroup
              value={issueType}
              onChange={(e) => setIssueType(e.target.value)}
              row
            >
              <FormControlLabel value="Problemas envolvendo meus dados, propriedade ou imagem" control={<Radio />} label="Algum problema que envolve meus dados, minha propriedade ou minha imagem" />
              <FormControlLabel value="Violação dos termos de uso do Vakinha" control={<Radio />} label="Algum problema que envolve a violação dos termos de uso do Vakinha, mas não me envolve diretamente" />
            </RadioGroup>
          </FormControl>

          <Divider/>
          
          <FormControl component="fieldset" fullWidth margin="normal">
            <FormLabel component="legend">Estou denunciando esta campanha porque:</FormLabel>
            <RadioGroup
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              row
            >
              <FormControlLabel value="Apropriação indevida da minha imagem ou dados" control={<Radio />} label="Há apropriação indevida da minha imagem ou dos meus dados" />
              <FormControlLabel value="Sou o beneficiário, mas não autorizei a criação" control={<Radio />} label="Sou o suposto beneficiário, mas não o criador da campanha, e não autorizei sua criação." />
              <FormControlLabel value="Sou o beneficiário, mas estou removendo a autorização" control={<Radio />} label="Sou o suposto beneficiário, mas não o criador da campanha, e estou removendo a autorização dada anteriormente para sua criação." />
              <FormControlLabel value="Outras circunstâncias" control={<Radio />} label="Outras circunstâncias." />
            </RadioGroup>
          </FormControl>

          <TextField
            label="Descreva o que motivou sua denúncia"
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            margin="normal"
            required
            helperText="Quanto mais detalhes você fornecer, mais precisa será a análise da nossa equipe."
          />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
            <Button variant="contained" color="primary" style={{color: '#fff'}} type="submit">
              Enviar denúncia
            </Button>
            <Button variant="outlined" color="secondary" onClick={onClose}>
              Cancelar
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default ReportModal;
