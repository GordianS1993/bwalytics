import React from 'react';
import { Box, Typography } from '@mui/material';

const Recommendations: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Empfehlungen
      </Typography>
      <Typography variant="body1" color="text.secondary">
        KI-basierte Empfehlungen zur Unternehmenssteuerung (wird implementiert...)
      </Typography>
    </Box>
  );
};

export default Recommendations;