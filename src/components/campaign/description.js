import React, { useState, useRef, useEffect } from 'react';
import { Box, Button } from '@mui/material';

const DescriptionBox = ({ description }) => {
  const [expanded, setExpanded] = useState(false);
  const [isOverflow, setIsOverflow] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      // Verifica se o conteúdo ultrapassa 50px
      const element = containerRef.current;
      setIsOverflow(element.scrollHeight > 320);
    }
  }, [description]);

  return (
    <Box
      sx={{
        position: 'relative',
        maxWidth: '100%',
      }}
    >
      {/* Conteúdo da descrição */}
      <div
        ref={containerRef}
        style={{
          maxHeight: expanded ? 'none' : 360,
          overflow: 'hidden',
          whiteSpace: 'normal',
          wordWrap: 'break-word',
          display: 'block',
        }}
        dangerouslySetInnerHTML={{ __html: description }}
      />

      {/* Gradiente para fade */}
      {!expanded && isOverflow && (
        <Box
          sx={{
            position: 'relative', // Respeita o pai
            bottom: 0,
            width: '100%',
            height: '50px',
            background: 'linear-gradient(to top, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0))',
            pointerEvents: 'none',
            marginTop: '-40px', // Conecta o fade ao conteúdo
          }}
        />
      )}

      {/* Botão Ver Mais/Ver Menos */}
      {isOverflow && (
        <Box
          display="flex"
          justifyContent="center"
          sx={{
            width: '100%',
            marginTop: !expanded ? '-10px' : '8px', // Adapta o espaçamento para não quebrar o layout
          }}
        >
          <Button
            onClick={() => setExpanded((prev) => !prev)}
            style={{ color: '#000' }}
            variant="text"
          >
            {expanded ? 'Ver Menos' : 'Ver Mais'}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default DescriptionBox;
