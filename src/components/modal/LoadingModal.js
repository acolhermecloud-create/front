import { useLoading } from "@/context/LoadingContext";
import { Box, CircularProgress, Modal } from "@mui/material";

export default function LoadingModal() {

  const { loading } = useLoading();

  return (
    <Modal
      open={loading}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <CircularProgress />
      </Box>
    </Modal>
  );
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 100,
  maxWidth: '40%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  display: 'flex',
  justifyContent: 'center',
  p: 4,
  borderRadius: 2,
  backgroundColor: 'rgb(240, 240, 240, 0.8)'
};