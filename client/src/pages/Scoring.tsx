import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Avatar,
  Button,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Assessment,
  Warning,
  CheckCircle,
  Speed,
} from '@mui/icons-material';

// Mock Data für Scoring
const mockScoringData = {
  overall: 85,
  grade: 'A',
  status: { level: 'excellent', color: '#22c55e', text: 'Ausgezeichnet' },
  breakdown: {
    liquidity: 85,
    profitability: 88,
    stability: 83,
    growth: 82,
    efficiency: 87
  },
  trends: {
    direction: 'improving',
    change: '+5 Punkte seit letztem Monat',
    momentum: 'positive'
  },
  recommendations: [
    {
      category: 'liquidity',
      priority: 'medium',
      title: 'Liquiditätsreserven aufbauen',
      description: 'Erhöhen Sie Ihre Liquiditätsreserven für mehr Sicherheit'
    },
    {
      category: 'growth',
      priority: 'high',
      title: 'Wachstumsmomentum nutzen',
      description: 'Ihr positiver Trend bietet Expansionsmöglichkeiten'
    }
  ]
};

const Scoring: React.FC = () => {
  const { overall, grade, status, breakdown, trends } = mockScoringData;

  const getScoreColor = (score: number) => {
    if (score >= 85) return '#22c55e';
    if (score >= 70) return '#84cc16';
    if (score >= 55) return '#eab308';
    if (score >= 40) return '#f97316';
    return '#ef4444';
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'liquidity':
        return <TrendingUp />;
      case 'profitability':
        return <Assessment />;
      case 'stability':
        return <CheckCircle />;
      case 'growth':
        return <TrendingUp />;
      case 'efficiency':
        return <Speed />;
      default:
        return <Assessment />;
    }
  };

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case 'liquidity':
        return 'Liquidität';
      case 'profitability':
        return 'Rentabilität';
      case 'stability':
        return 'Stabilität';
      case 'growth':
        return 'Wachstum';
      case 'efficiency':
        return 'Effizienz';
      default:
        return category;
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Unternehmens-Scoring
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Bewertung der Gesundheit Ihres Unternehmens basierend auf BWA-Analyse
        </Typography>
      </Box>

      {/* Overall Score */}
      <Paper sx={{ p: 4, mb: 4, textAlign: 'center' }}>
        <Box sx={{ display: 'inline-flex', alignItems: 'center', mb: 3 }}>
          <Avatar 
            sx={{ 
              width: 80, 
              height: 80, 
              bgcolor: status.color, 
              fontSize: '2rem',
              mr: 3
            }}
          >
            {overall}
          </Avatar>
          <Box sx={{ textAlign: 'left' }}>
            <Typography variant="h3" component="div" sx={{ fontWeight: 600 }}>
              Note {grade}
            </Typography>
            <Typography variant="h6" sx={{ color: status.color, mb: 1 }}>
              {status.text}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {trends.change}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
          <Chip
            icon={trends.direction === 'improving' ? <TrendingUp /> : <TrendingDown />}
            label={trends.direction === 'improving' ? 'Verbesserung' : 'Verschlechterung'}
            color={trends.direction === 'improving' ? 'success' : 'error'}
          />
          <Chip
            label={`${trends.momentum} Momentum`}
            variant="outlined"
          />
        </Box>

        <Button variant="contained" size="large">
          Detailanalyse anzeigen
        </Button>
      </Paper>

      {/* Score Breakdown */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Bewertung nach Kategorien
        </Typography>
        
        <Grid container spacing={3}>
          {Object.entries(breakdown).map(([category, score]) => (
            <Grid item xs={12} sm={6} md={4} key={category}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: getScoreColor(score), 
                        mr: 2,
                        width: 48,
                        height: 48
                      }}
                    >
                      {getCategoryIcon(category)}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" component="div">
                        {getCategoryTitle(category)}
                      </Typography>
                      <Typography variant="h4" sx={{ color: getScoreColor(score) }}>
                        {score}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <LinearProgress
                    variant="determinate"
                    value={score}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: 'grey.200',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: getScoreColor(score),
                        borderRadius: 4,
                      },
                    }}
                  />
                  
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ mt: 1, textAlign: 'center' }}
                  >
                    {score >= 85 ? 'Ausgezeichnet' : 
                     score >= 70 ? 'Gut' :
                     score >= 55 ? 'Durchschnittlich' :
                     score >= 40 ? 'Bedenklich' : 'Kritisch'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Recommendations based on scoring */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Empfehlungen zur Verbesserung
        </Typography>
        
        <Grid container spacing={2}>
          {mockScoringData.recommendations.map((rec, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {rec.priority === 'high' ? 
                      <Warning sx={{ color: '#f97316', mr: 1 }} /> :
                      <CheckCircle sx={{ color: '#22c55e', mr: 1 }} />
                    }
                    <Chip
                      label={rec.priority === 'high' ? 'Hohe Priorität' : 'Mittlere Priorität'}
                      size="small"
                      color={rec.priority === 'high' ? 'error' : 'warning'}
                    />
                  </Box>
                  
                  <Typography variant="h6" gutterBottom>
                    {rec.title}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary">
                    {rec.description}
                  </Typography>
                  
                  <Button 
                    variant="outlined" 
                    size="small" 
                    sx={{ mt: 2 }}
                    fullWidth
                  >
                    Details anzeigen
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
};

export default Scoring;