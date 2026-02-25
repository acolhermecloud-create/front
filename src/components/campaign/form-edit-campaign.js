import { Box, Button, Divider, FormControl, IconButton, InputAdornment, InputLabel, MenuItem, Modal, Select, Stack, Tab, Tabs, TextField, Typography } from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import CampaignStepperOne from "./steppers/campaign-stepper-one";
import { ArrowDownward, ArrowUpward, CalendarToday, CardGiftcard, CloudUpload, Delete } from "@mui/icons-material";
import { useCampaign } from "@/context/CampaignContext";
import { formatCurrency, handleGetFileUrl, urlIsImage } from "@/utils/functions";
import { useTheme } from '@mui/material/styles';
import { useLoading } from "@/context/LoadingContext";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";

const RichTextEditorRTE = dynamic(() => import('@/components/rich-text/rich-text-rte'), {
  ssr: false,
});

export const EditCampaign = ({ handleUpdateImagesOfCampaign, campaign }) => {

  const theme = useTheme();
  const { handleLoading, handleCloseLoading } = useLoading();
  const { handleUpdateCampaign, handleUpdateImagesCampaign,
    handleDeleteImages,
    handleGetCategories, categories } = useCampaign();

  const [value, setValue] = useState(0);

  const handleChange = (_, newValue) => {
    setValue(newValue);
  };

  const isMounted = useRef(true);

  const [title, setTitle] = useState(campaign.title);
  const [description, setDescription] = useState(campaign.description);
  const [goalRaw, setGoalRaw] = useState(formatCurrency(`${campaign.financialGoal}`));
  const [category, setCategory] = useState(campaign.category.id);
  const [deadLine, setDeadLine] = useState(120);

  const [imageList, setImageList] = useState([]);
  const [imageKeyList, setImageKeyList] = useState([]);
  const [imagesToRemove, setImagesToRemove] = useState([]);
  const [imageSelectedIndex, setImageSelectedIndex] = useState();

  const [openDeleteImage, setOpenDeleteImage] = useState(false);
  const handleOpenDeleteImage = (index) => {
    setImageSelectedIndex(index);
    setImagesToRemove([campaign.media[index]])
    setOpenDeleteImage(true);
  }
  const handleCloseDeleteImage = () => setOpenDeleteImage(false);

  const handleChangeGoal = (event) => {
    const inputValue = event.target.value.replace(/\D/g, ""); // Remove tudo que não é dígito
    setGoalRaw(inputValue); // Atualiza o estado apenas com números
  };

  const uploadFiles = async (e) => {
    handleLoading();
    const newFiles = Array.from(e.target.files);

    // Tipos MIME aceitos
    const acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    // Filtrando os arquivos válidos
    const validFiles = newFiles.filter(file => acceptedTypes.includes(file.type));

    // Verificando se há arquivos válidos
    if (validFiles.length > 0) {

      const formData = new FormData();

      validFiles.forEach((file) => {
        formData.append('files', file);
      });

      const response = await handleUpdateImagesCampaign(campaign.id, formData);
      if (response.status) {
        toast.success('Imagens atualizadas com sucesso');
        setImageKeyList(response.data);
        handleUpdateImagesOfCampaign(campaign.id, response.data)
      } else {
        toast.error(`Erro ao atualizar imagens: ${response.data}`);
      }
    } else {
      toast.error("Por favor, selecione apenas arquivos JPG, PNG ou WebP.");
    }
    handleCloseLoading();
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
  const handleRemoveImage = (index) => {
    handleOpenDeleteImage(index)
  }

  // Função para remover uma imagem
  const removeImage = async () => {

    handleLoading();
    
    const payload = {
      campaignId: campaign.id,
      imagesKeys: imagesToRemove
    }

    const response = await handleDeleteImages(JSON.stringify(payload));

    if (response.status) {
      const newImageList = imageList.filter((_, i) => i !== imageSelectedIndex); // Filtra o item a ser removido
      const newImageKeys = campaign.media.filter((_, i) => i !== imageSelectedIndex);

      setImageList(newImageList); // Atualiza o estado com a nova lista sem a imagem removida
      handleUpdateImagesOfCampaign(campaign.id, newImageKeys);
      setImageSelectedIndex(undefined);
      toast.success('Imagem removida com sucesso');
    }else{
      toast.error('Erro ao remover imagem');
    }
    handleCloseDeleteImage();
    handleCloseLoading();
  };

  const memoizedEditor = useMemo(() => (
    <RichTextEditorRTE value={description} onChange={setDescription} />
  ), [description, setDescription]);

  const editCampaign = async () => {

    const formData = new FormData();
    formData.append('Id', campaign.id);
    formData.append('CategoryId', category);
    formData.append('Description', description);
    formData.append('Title', title);
    formData.append('FinancialGoal', goalRaw);
    formData.append('Deadline', deadLine);

    handleLoading();

    const result = await handleUpdateCampaign(formData);
    handleCloseLoading();

    if (result.status) {
      toast.success(`Campanha atualizada`);
    }
  }

  const componentInfomationsOfCampaign = () => {
    return (
      <>
        <Stack>
          <Typography variant="h6" color="initial">Dados</Typography>
        </Stack>
        <Stack>
          <TextField
            size="small"
            sx={{ mt: 2 }}
            id="outlined-basic"
            label="Titulo da sua kaixinha"
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start"><CardGiftcard /></InputAdornment>, // R$ fixo aqui
            }}
          />
          <Stack>
            <FormControl fullWidth size="small" sx={{ mt: 2 }}>
              <InputLabel id="demo-select-small-label">Categoria</InputLabel>
              <Select
                value={category}
                label="Categoria"
                onChange={(e) => setCategory(e.target.value)}
              >
                <MenuItem key={'none'} value={''}>Selecione</MenuItem>
                {categories && categories.map((category, index) =>
                  <MenuItem key={index} value={category.id}>{category.name}</MenuItem>
                )}
              </Select>
            </FormControl>
          </Stack>
          <TextField
            size="small"
            sx={{ mt: 2 }}
            id="outlined-basic"
            label="Meta"
            variant="outlined"
            value={formatCurrency(goalRaw)} // Exibição formatada
            onChange={handleChangeGoal}
            InputProps={{
              startAdornment: <InputAdornment position="start">R$</InputAdornment>, // R$ fixo aqui
            }}
          />
        </Stack>
        <TextField
          size="small"
          sx={{ mt: 2 }}
          id="outlined-basic"
          label="Validade (em dias)"
          variant="outlined"
          type="number"
          value={deadLine}
          onChange={(e) => setDeadLine(Math.min(120, Math.max(7, e.target.value)))} // Garante que o valor esteja entre 7 e 120
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <CalendarToday />
              </InputAdornment>
            ),
          }}
          inputProps={{
            min: 7, // Define o valor mínimo permitido
            max: 120, // Define o valor máximo permitido
          }}
        />
        {btnSaveChanges()}
      </>
    );
  }

  const componentImagesOfCampaign = () => {

    const style = {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 400,
      maxWidth: '90%',
      bgcolor: 'background.paper',
      boxShadow: 24,
      p: 4,
    };

    return (
      <>
        <Box sx={{ maxWidth: 380, maxHeight: 400, pb: 2, overflow: 'auto', mt: 2 }}>
          {imageList && imageList.map((file, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                justifyContent: 'flex-start', // Alinha os itens à esquerda
                alignItems: 'center', // Alinha verticalmente os itens
                marginBottom: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
                <img
                  src={urlIsImage(file) ? file : URL.createObjectURL(file)} // Cria a URL temporária para o arquivo
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
                  onClick={() => handleRemoveImage(index)} // Remove a imagem ao clicar
                >
                  <Delete color="error" />
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

        {/** MODAL CONFIRM DELETE IMAGES */}
        <Modal
          open={openDeleteImage}
          onClose={handleCloseDeleteImage}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Tem certeza que quer remover a imagem?
            </Typography>
            <Divider/>
            <Stack mt={2} direction={'row'} display={'flex'} justifyContent={'space-between'}>
              <Button
                onClick={handleCloseDeleteImage}
                style={{color: '#000'}}
              >Não</Button>
              <Button
                onClick={removeImage}
                variant="contained"
                color="error"
              >Sim</Button>
            </Stack>
          </Box>
        </Modal>
      </>
    );
  }

  const btnSaveChanges = () => {
    return (
      <>
        <Stack>
          <Button
            variant="contained"
            fullWidth
            sx={{
              mt: 3,
              flex: 1,
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.light.main,
              '&:hover': {
                bgcolor: theme.palette.primary.secondary,
                color: theme.palette.light.main
              },
            }}
            onClick={editCampaign}
          >
            Salvar alterações
          </Button>
        </Stack>
      </>
    );
  }

  useEffect(() => {
    if (isMounted.current && campaign) {
      isMounted.current = false;
      handleGetCategories();
      handleGetFileUrl(campaign.media).then(result => {
        setImageList(result);
      });
    }
  }, []);

  useEffect(() => {
    if (imageKeyList) {
      handleGetFileUrl(imageKeyList).then(result => {
        setImageList(result);
      });
    }
  }, [imageKeyList]);

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Informações" {...a11yProps(0)} />
          <Tab label="Descrição" {...a11yProps(1)} />
          <Tab label="Imagens" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        {componentInfomationsOfCampaign()}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <Stack>
          <Typography variant="h6" color="initial">Conte sua história</Typography>
        </Stack>
        <Stack mt={2}>
          {/* Utilizando o componente RichTextEditor */}
          {memoizedEditor}
        </Stack>
        {btnSaveChanges()}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        {componentImagesOfCampaign()}
      </CustomTabPanel>
    </Box>
  );
}

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}