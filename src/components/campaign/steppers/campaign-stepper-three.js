import {
  Box, Stack,
  Typography,
} from "@mui/material";
import ButtonHandleNextStepper from "./btn-handle-next";

import dynamic from 'next/dynamic';
import { useMemo } from "react";
import { toast } from "react-toastify";

const RichTextEditorRTE = dynamic(() => import('@/components/rich-text/rich-text-rte'), {
  ssr: false,
});

export default function CampaignStepperThree({
  description,
  handleSetDescription,
  handleNext
}) {

  const memoizedEditor = useMemo(() => (
    <RichTextEditorRTE value={description} onChange={handleSetDescription} />
  ), [description, handleSetDescription]);

  const handleValidateNext = () => {

    if (!description || description === '' || description.length < 50) {
      toast.error('Informe uma descrição de ao menos 50 caracteres');
      return;
    }

    handleNext();
  }

  return (
    <Box>
      <Stack my={3}>
        <Typography mt={1} variant="h5" color="primary">Conte um pouco da sua história</Typography>
        <Typography mt={3} variant="body2" color="initial">
          Explique o motivo pelo qual você precisa arrecadar doações, como vai utilizar o valor arrecadado,
          e o quão importante é receber doações.
        </Typography>

        <Stack mt={2}>
          {/* Utilizando o componente RichTextEditor */}
          {memoizedEditor}
        </Stack>
      </Stack>
      <Stack direction={'row'} display={'flex'} justifyContent={'center'} mt={{xs: 12, sm: 8}}>
        <Box sx={{maxWidth: 350}}>
          <ButtonHandleNextStepper handleNext={handleValidateNext} />
        </Box>
      </Stack>
    </Box>
  );
}
