import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Chip,
  Avatar,
  LinearProgress,
  Alert,
  Button,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Assessment,
  Euro,
  Warning,
  CheckCircle,
} from '@mui/icons-material';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

// Chart.js registrieren
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Mock Data
const mockDashboardData = {
  currentPeriod: {
    period: 'Oktober 2024',
    revenue: 45000,
    costs: 32000,
    profit: 13000,
    profitMargin: 28.9,
    status: 'good'
  },
  scoring: {
    overall: 85,
    grade: 'A',
    status: { level: 'excellent', color: '#22c55e', text: 'Ausgezeichnet' }
  },
  alerts: [
    {
      type: 'warning',
      message: 'Personalkosten sind um 12% gestiegen',
      severity: 'medium'
    },
    {
      type: 'success',
      message: 'Umsatz übertrifft Ziel um 15%',
      severity: 'low'
    }
  ]
};

const Dashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState(mockDashboardData);
  const [loading, setLoading] = useState(false);

  // Chart Data für Umsatz-Trend
  const revenueChartData = {
    labels: ['Jun', 'Jul', 'Aug', 'Sep', 'Okt'],
    datasets: [
      {
        label: 'Umsatz (€)',
        data: [48000, 47000, 49000, 42000, 45000],
        borderColor: '#1976d2',
        backgroundColor: 'rgba(25, 118, 210, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          callback: function(value: any) {
            return '€' + value.toLocaleString();
          }
        }
      },
    },
  };

  // Chart Data für Kosten-Verteilung
  const costBreakdownData = {
    labels: ['Personal', 'Material', 'Marketing', 'Büro', 'Sonstiges'],
    datasets: [
      {
        data: [18000, 8000, 3000, 2000, 1000],
        backgroundColor: [
          '#1976d2',
          '#2196f3',
          '#64b5f6',
          '#90caf9',
          '#bbdefb',
        ],
        borderWidth: 0,
      },
    ],
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Überblick über Ihre Unternehmenskennzahlen für {dashboardData.currentPeriod.period}
        </Typography>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Umsatz */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: '#1976d2', mr: 2 }}>
                  <Euro />
                </Avatar>
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Umsatz
                  </Typography>
                  <Typography variant="h5" component="div">
                    {formatCurrency(dashboardData.currentPeriod.revenue)}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingUp sx={{ color: '#22c55e', mr: 1 }} />
                <Typography variant="body2" sx={{ color: '#22c55e' }}>
                  +7.1% zum Vormonat
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Gewinn */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: '#22c55e', mr: 2 }}>
                  <TrendingUp />
                </Avatar>
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Gewinn
                  </Typography>
                  <Typography variant="h5" component="div">
                    {formatCurrency(dashboardData.currentPeriod.profit)}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ color: '#22c55e' }}>
                  {dashboardData.currentPeriod.profitMargin.toFixed(1)}% Marge
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Kosten */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: '#ff9800', mr: 2 }}>
                  <TrendingDown />
                </Avatar>
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Kosten
                  </Typography>
                  <Typography variant="h5" component="div">
                    {formatCurrency(dashboardData.currentPeriod.costs)}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ color: '#22c55e' }}>
                  -2.3% optimiert
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Scoring */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: dashboardData.scoring.status.color, mr: 2 }}>
                  <Assessment />
                </Avatar>
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Gesundheits-Score
                  </Typography>
                  <Typography variant="h5" component="div">
                    {dashboardData.scoring.overall}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Chip 
                  label={dashboardData.scoring.grade} 
                  size="small" 
                  sx={{ bgcolor: dashboardData.scoring.status.color, color: 'white' }}
                />
                <Typography variant="body2" sx={{ color: dashboardData.scoring.status.color }}>
                  {dashboardData.scoring.status.text}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Umsatz-Trend */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Umsatz-Entwicklung
            </Typography>
            <Box sx={{ height: 300 }}>
              <Line data={revenueChartData} options={chartOptions} />
            </Box>
          </Paper>
        </Grid>

        {/* Kosten-Verteilung */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Kosten-Verteilung
            </Typography>
            <Box sx={{ height: 300 }}>
              <Doughnut 
                data={costBreakdownData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                    },
                  },
                }}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Alerts und Quick Actions */}
      <Grid container spacing={3}>
        {/* Alerts */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Aktuelle Hinweise
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {dashboardData.alerts.map((alert, index) => (
                <Alert 
                  key={index}
                  severity={alert.type === 'warning' ? 'warning' : 'success'}
                  icon={alert.type === 'warning' ? <Warning /> : <CheckCircle />}
                >
                  {alert.message}
                </Alert>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Schnellaktionen
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button variant="contained" fullWidth>
                Neue BWA hochladen
              </Button>
              <Button variant="outlined" fullWidth>
                Scoring aktualisieren
              </Button>
              <Button variant="outlined" fullWidth>
                Empfehlungen anzeigen
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;