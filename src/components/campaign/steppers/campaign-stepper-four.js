import { Box, Button, Stack, Typography, IconButton } from "@mui/material";
import { ArrowUpward, ArrowDownward, CloudUpload, Delete } from "@mui/icons-material";
import { useEffect, useState } from "react";
import ButtonHandleNextStepper from "./btn-handle-next";
import styled from "@emotion/styled";
import { toast } from "react-toastify";

export default function CampaignStepperFour({ handleFiles, handleFinish }) {

  // Estado para controlar a ordem das imagens
  const [imageList, setImageList] = useState([]);

  // Função para fazer o upload das imagens
  const uploadFiles = (e) => {
    const newFiles = Array.from(e.target.files);

    // Tipos MIME aceitos
    const acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    // Filtrando os arquivos válidos
    const validFiles = newFiles.filter(file => acceptedTypes.includes(file.type));

    // Verificando se há arquivos válidos
    if (validFiles.length > 0) {
      setImageList((prev) => [...prev, ...validFiles]);
    } else {
      toast.error("Por favor, selecione apenas arquivos JPG, PNG ou WebP.");
    }
  };


  // Função para mover a imagem para cima
  const moveUp = (index) => {
    if (index === 0) return; // Não faz nada se já for a primeira imagem
    const newImageList = [...imageList];
    const [movedImage] = newImageList.splice(index, 1);
    newImageList.splice(index - 1, 0, movedImage);
    setImageList(newImageList);
  };

  // Função para mover a imagem para baixo
  const moveDown = (index) => {
    if (index === imageList.length - 1) return; // Não faz nada se já for a última imagem
    const newImageList = [...imageList];
    const [movedImage] = newImageList.splice(index, 1);
    newImageList.splice(index + 1, 0, movedImage);
    setImageList(newImageList);
  };

  // Função para remover uma imagem
  const removeImage = (index) => {
    const newImageList = imageList.filter((_, i) => i !== index); // Filtra o item a ser removido
    setImageList(newImageList); // Atualiza o estado com a nova lista sem a imagem removida
  };

  const handleFinalizeFlow = () => {

    if(imageList.length === 0){
      toast.info('Aumente suas changes de arrecadação, escolha uma imagem');
      return;
    }

    handleFinish();
  };

  useEffect(() => {
    if(imageList){
      handleFiles(imageList);
    }
  }, [imageList])

  return (
    <Box>
      <Stack my={3} sx={{ maxWidth: 380 }}>
        <Typography variant="h5" color="primary">
          Imagens falam por você
        </Typography>
        <Typography mt={1} variant="body2" color="initial">
          Inspire seus doadores com uma imagem que vai ajudar a ilustrar a sua causa.
          Uma boa foto é muito importante para criar conexão entre a sua vaquinha e quem vai doar.
        </Typography>
      </Stack>

      {/* Se houver imagens, exibe a lista com as setas para mover */}
      {imageList.length > 0 ? (
        <Box sx={{ maxWidth: 380, maxHeight: 400, pb: 2, overflow: 'auto', mt: 2 }}>
          <Typography variant="h6" mb={1}>Imagens selecionadas</Typography>
          {imageList.map((file, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                justifyContent: 'flex-start', // Alinha os itens à esquerda
                alignItems: 'center', // Alinha verticalmente os itens
                marginBottom: 2,
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', marginRight: 2 }}>
                <IconButton
                  size="small"
                  onClick={() => moveUp(index)}
                  disabled={index === 0} // Desabilita se já for a primeira imagem
                >
                  <ArrowUpward />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => moveDown(index)}
                  disabled={index === imageList.length - 1} // Desabilita se já for a última imagem
                >
                  <ArrowDownward />
                </IconButton>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
                <img
                  src={URL.createObjectURL(file)} // Cria a URL temporária para o arquivo
                  alt="Imagem"
                  width="60px"
                  height="60px"
                  style={{
                    borderRadius: 5,
                    marginRight: 8,
                  }}
                />
                <IconButton
                  size="small"
                  onClick={() => removeImage(index)} // Remove a imagem ao clicar
                >
                  <Delete />
                </IconButton>
              </Box>
            </Box>
          ))}

          {/* Botão para escolher mais imagens */}
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Button
              component="label"
              variant="outlined"
              startIcon={<CloudUpload />}
              sx={{
                borderColor: '#000',
                borderWidth: 1,
                borderStyle: 'solid',
                padding: '8px 16px',
              }}
            >
              Escolher mais imagens
              <input
                type="file"
                onChange={uploadFiles}
                multiple
                style={{ display: 'none' }}
              />
            </Button>
          </Box>
        </Box>
      ) : (
        // Se não houver imagens, exibe o botão para adicionar imagens
        <Stack
          sx={{
            position: 'relative',
          }}
          direction="row"
          display="flex"
          justifyContent="center"
        >
          <img
            src="/assets/images/choice_bg.png"
            alt="Imagem com botão"
            width="90%"
            style={{
              borderRadius: 5,
              display: 'block',
            }}
          />
          <Stack
            sx={{
              position: 'absolute',
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '90%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0)',
              transition: 'background-color 0.3s ease',
              justifyContent: 'center',
              alignItems: 'center',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
              },
            }}
          >
            <Button
              component="label"
              variant="contained"
              startIcon={<CloudUpload />}
              color="light"
              sx={{
                p: 1.5,
                zIndex: 1,
                borderColor: '#000',
                borderWidth: 1,
                borderStyle: 'solid',
              }}
            >
              Escolher arquivos
              <VisuallyHiddenInput
                type="file"
                accept="image/jpeg, image/png, image/webp"
                onChange={uploadFiles}
                multiple
              />
            </Button>
          </Stack>
        </Stack>
      )}

      {/* Botão para avançar para o próximo passo */}
      <Stack mt={2} direction="row" display="flex" justifyContent="center">
        <Box sx={{ width: '100%', maxWidth: 380 }}>
          <ButtonHandleNextStepper handleNext={handleFinalizeFlow} />
        </Box>
      </Stack>
    </Box>
  );
}

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});