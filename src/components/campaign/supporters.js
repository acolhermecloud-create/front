import React, { useState, useRef, useEffect } from 'react';
import { Stack, Avatar, Typography, Button } from '@mui/material';
import { formatCurrency, getTimeElapsed } from '@/utils/functions';

const SupportersList = ({ donation }) => {
  const [expanded, setExpanded] = useState(false);
  const [isOverflow, setIsOverflow] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      // Verifica se o conteúdo ultrapassa 320px
      const element = containerRef.current;
      setIsOverflow(element.scrollHeight > 200);
    }
  }, [donation]);

  return (
    <div style={{ position: 'relative' }}>
      {donation?.donations && donation.donations.length > 0 && (
        <Stack
          py={2}
          direction="column"
          spacing={2}
          display="flex"
          justifySelf="start"
          style={{
            maxHeight: expanded ? 'none' : 200, // Limita a altura a 320px quando não expandido
            overflow: 'hidden', // Esconde o conteúdo extra
          }}
          ref={containerRef}
        >
          {donation.donations.map((donationItem, index) =>
            (donationItem?.donor?.name && donationItem.status === 1 && donationItem.type === 0) ? (
              <Stack key={index} direction="row" spacing={2}>
                <Avatar alt={donationItem?.donor?.name ?? ""} src="/static/images/avatar/1.jpg" />
                <Stack justifyContent="center">
                  <Typography variant="subtitle1" color="initial" style={{ lineHeight: 1 }} fontWeight={500}>
                    {donationItem?.donor?.name ?? ""}
                  </Typography>
                  <Typography variant="subtitle1" color="primary" fontWeight={500}>
                    R$ {formatCurrency(`${donationItem.value}`)}&nbsp;
                    <span style={{ color: '#8c8c8c', fontSize: '0.785rem' }}>
                      - {getTimeElapsed(donationItem.donatedAt)}
                    </span>
                  </Typography>
                </Stack>
              </Stack>
            ) : null
          )}
        </Stack>
      )}

      {/* Gradiente para o fade */}
      {!expanded && isOverflow && (
        <div
          style={{
            position: 'absolute',
            bottom: '40px', // Faz o fade aparecer acima do botão
            left: 0,
            right: 0,
            height: '200px', // Altura do fade
            background: 'linear-gradient(to top, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0))',
            pointerEvents: 'none', // Evita que interfira nos cliques
          }}
        />
      )}

      {/* Botão Ver Mais/Ver Menos */}
      {isOverflow && (
        <Stack display="flex" direction="row" justifyContent="center" style={{ marginTop: '40px' }}>
          <Button
            onClick={() => setExpanded((prev) => !prev)}
            style={{
              zIndex: 1,
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

export default SupportersList;
