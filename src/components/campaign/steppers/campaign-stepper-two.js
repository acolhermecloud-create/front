import {
  Box, FormControl, FormControlLabel, FormLabel, InputAdornment, InputLabel, MenuItem, Radio,
  RadioGroup, Select, Stack, TextField, Typography
} from "@mui/material";
import ButtonHandleNextStepper from "./btn-handle-next";
import { EmojiPeople } from "@mui/icons-material";
import { useCampaign } from "@/context/CampaignContext";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";

export default function CampaignStepperTwo({
  beneficiaryType, beneficiaryName, category,
  handleSetBeneficiaryName,
  handleSetBeneficiary,
  handleSetCategory,
  handleNext
}) {

  const { handleGetCategories, categories } = useCampaign();
  const isMounted = useRef(true);

  const handleValidateNext = () => {
        
    if(beneficiaryType === 3 && beneficiaryName === ''){
      toast.error('Informe o nome do beneficiário');
      return;
    }
    
    if(!category || category === ''){
      toast.error('Informe a categoria');
      return;
    }
    handleNext();
  };

  useEffect(() => {
    if (isMounted.current) {
      isMounted.current = false;
      handleGetCategories();
    }
  }, []);

  return (
    <Box>
      <Stack mt={1} sx={{ maxWidth: 380 }}>
        <FormControl>
          <FormLabel id="demo-radio-buttons-group-label">
            <Typography mt={1} variant="h5" color="primary">Essa kaixinha é para ajudar quem?</Typography>
          </FormLabel>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue={0}
            name="radio-buttons-group"
            value={beneficiaryType}
            onChange={(e) => handleSetBeneficiary(parseInt(e.target.value))}
          >
            <FormControlLabel value={0} control={<Radio size="small" />} label="Eu mesmo(a) preciso do valor" />
            <FormControlLabel value={1} control={<Radio size="small" />} label="Para alguém da família" />
            <FormControlLabel value={2} control={<Radio size="small" />} label="Para meu animal de estimação" />
            <FormControlLabel value={3} control={<Radio size="small" />} label="Para um(a) amigo(a) que está precisando" />
            {beneficiaryType === 3 && (
              <TextField
                size="small"
                sx={{ mt: 2 }}
                id="outlined-basic"
                label="Nome do amigo(a): Ex: Juliana Mendez"
                variant="outlined"
                value={beneficiaryName}
                onChange={(e) => handleSetBeneficiaryName(e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><EmojiPeople /></InputAdornment>, // R$ fixo aqui
                }}
              />
            )}
            <FormControlLabel value={4} control={<Radio size="small" />} label="Para uma empresa ou instituição" />
          </RadioGroup>
        </FormControl>
      </Stack>
      <Stack my={3} sx={{ maxWidth: 380 }}>
        <Typography mt={1} variant="h5" color="primary">Em qual categoria sua vaquinha se enquadra?</Typography>
        <FormControl fullWidth size="small" sx={{ mt: 2 }}>
          <InputLabel id="demo-select-small-label">Categoria</InputLabel>
          <Select
            value={category}
            label="Categoria"
            onChange={(e) => handleSetCategory(e.target.value)}
          >
            <MenuItem key={'none'} value={''}>Selecione</MenuItem>
            {categories && categories.map((category, index) =>
              <MenuItem key={index} value={category.id}>{category.name}</MenuItem>
            )}
          </Select>
        </FormControl>
      </Stack>
      <Stack sx={{ maxWidth: 380 }}>
        <ButtonHandleNextStepper handleNext={handleValidateNext} />
      </Stack>
    </Box>
  );
}
