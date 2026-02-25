import React, { useState } from 'react';
import InputMask from 'react-input-mask';
import { TextField, InputAdornment } from '@mui/material';
import { AssignmentInd } from '@mui/icons-material';

const CpfCnpjDocumentIdCompoenent = ({ documentId, setDocumentId, mask }) => {

  const handleSetDocumentId = (value) => {
    const numericValue = value.replace(/\D/g, ''); // Remove caracteres não numéricos
    setDocumentId(numericValue);
  };

  return (
    <InputMask
      mask={mask}
      value={documentId}
      onChange={(e) => handleSetDocumentId(e.target.value)}
      maskPlaceholder={null} // Desabilita placeholders
      alwaysShowMask={false} // Não exibe a máscara o tempo todo
    >
      {(inputProps) => (
        <TextField
          {...inputProps}
          size="small"
          sx={{ mt: 2 }}
          id="outlined-basic"
          label="Documento"
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AssignmentInd />
              </InputAdornment>
            ),
          }}
        />
      )}
    </InputMask>
  );
};

export default CpfCnpjDocumentIdCompoenent;
