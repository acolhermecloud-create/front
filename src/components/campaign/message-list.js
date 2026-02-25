import React, { useState, useRef, useEffect } from 'react';
import { Stack, Avatar, Typography, Button, IconButton } from '@mui/material';
import { getTimeElapsed } from '@/utils/functions';
import { Delete } from '@mui/icons-material';

const MessageList = ({ user, campaignComments, deleteComment }) => {
  const [expanded, setExpanded] = useState(false);
  const [isOverflow, setIsOverflow] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      // Verifica se a altura do conteúdo é maior que 150px
      const element = containerRef.current;
      setIsOverflow(element.scrollHeight > 150);
    }
  }, [campaignComments]);

  return (
    <div style={{ position: 'relative', maxWidth: '100%' }}>
      <Stack
        py={2}
        direction="column"
        spacing={2}
        display="flex"
        justifySelf="start"
        style={{
          maxHeight: expanded ? 'none' : 320, // Limita a altura a 150px quando não expandido
          overflow: 'hidden',
        }}
        ref={containerRef}
      >
        {campaignComments && campaignComments.map((msg, index) => (
          <Stack key={index} direction={'row'} display={'flex'} justifyContent={'space-between'}>
            <Stack direction="row" spacing={2}>
              <Avatar alt={msg.name} src="/static/images/avatar/1.jpg" />
              <Stack justifyContent="center">
                <Typography variant="subtitle1" color="initial" style={{ lineHeight: 1 }} fontWeight={500}>
                  {msg.userName}
                </Typography>
                <Typography variant="body2" color="initial">
                  {msg.comment}
                </Typography>
                <Typography variant="subtitle1" color="primary" fontWeight={500}>
                  <span style={{ color: '#8c8c8c', fontSize: '0.785rem' }}>
                    {getTimeElapsed(msg.createAt)}
                  </span>
                </Typography>
              </Stack>
            </Stack>
            {user?.id === msg.userId && (
              <IconButton color="error" aria-label="delete" onClick={() => deleteComment(msg.id)}>
                <Delete />
              </IconButton>
            )}
          </Stack>
        ))}
      </Stack>

      {/* Gradiente para o fade */}
      {!expanded && isOverflow && (
        <div
          style={{
            position: 'absolute', // Posiciona o fade dentro do contêiner
            bottom: '40px', // Ajusta a posição do fade para aparecer acima do botão
            left: 0,
            right: 0,
            height: '320px', // Altura do fade
            background: 'linear-gradient(to top, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0))',
            pointerEvents: 'none', // Não interfere nos cliques
          }}
        />
      )}

      {/* Botão Ver Mais/Ver Menos */}
      {isOverflow && (
        <Stack display="flex" direction="row" justifyContent="center" style={{ marginTop: '40px' }}>
          <Button
            onClick={() => setExpanded((prev) => !prev)}
            style={{
              zIndex: 1, // Mantém o botão acima do fade
              color: '#000',
            }}
          >
            {expanded ? 'Ver Menos' : 'Ver Mais'}
          </Button>
        </Stack>
      )}
    </div>
  );
};

export default MessageList;
