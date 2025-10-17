const express = require('express');
const router = express.Router();

// Dashboard Daten - Übersicht
router.get('/overview', async (req, res) => {
  try {
    // Mock-Daten für Dashboard-Übersicht
    const dashboardData = {
      currentPeriod: {
        period: 'Oktober 2024',
        revenue: 45000,
        costs: 32000,
        profit: 13000,
        profitMargin: 28.9,
        status: 'good'
      },
      yearToDate: {
        totalRevenue: 420000,
        totalCosts: 315000,
        totalProfit: 105000,
        averageMargin: 25.0,
        months: 10
      },
      trends: {
        revenueGrowth: 8.5, // % zu Vormonat
        costEfficiency: 2.3, // % Verbesserung
        profitTrend: 'increasing'
      },
      alerts: [
        {
          type: 'warning',
          message: 'Personalkosten sind um 12% gestiegen',
          severity: 'medium',
          date: '2024-10-10'
        },
        {
          type: 'success',
          message: 'Umsatz übertrifft Ziel um 15%',
          severity: 'low',
          date: '2024-10-12'
        }
      ],
      lastUpdate: new Date().toISOString()
    };

    res.json(dashboardData);
  } catch (error) {
    res.status(500).json({
      error: 'Fehler beim Laden der Dashboard-Daten',
      message: error.message
    });
  }
});

// Jahresvergleich
router.get('/year-comparison', async (req, res) => {
  try {
    const { year } = req.query;
    const currentYear = parseInt(year) || new Date().getFullYear();
    
    // Mock-Daten für Jahresvergleich
    const yearComparison = {
      currentYear,
      previousYear: currentYear - 1,
      monthlyData: [
        { month: 'Jan', current: 38000, previous: 35000 },
        { month: 'Feb', current: 41000, previous: 37000 },
        { month: 'Mar', current: 44000, previous: 40000 },
        { month: 'Apr', current: 43000, previous: 41000 },
        { month: 'Mai', current: 46000, previous: 42000 },
        { month: 'Jun', current: 48000, previous: 44000 },
        { month: 'Jul', current: 47000, previous: 45000 },
        { month: 'Aug', current: 49000, previous: 46000 },
        { month: 'Sep', current: 42000, previous: 39000 },
        { month: 'Okt', current: 45000, previous: 41000 }
      ],
      summary: {
        currentYearTotal: 443000,
        previousYearTotal: 410000,
        growth: 8.0,
        performance: 'above_target'
      }
    };

    res.json(yearComparison);
  } catch (error) {
    res.status(500).json({
      error: 'Fehler beim Laden des Jahresvergleichs',
      message: error.message
    });
  }
});

// KPI-Trends für Charts
router.get('/kpi-trends', async (req, res) => {
  try {
    const { period = '12m' } = req.query;
    
    // Mock-Daten für verschiedene KPIs über Zeit
    const kpiTrends = {
      period,
      data: {
        revenue: [
          { date: '2024-01', value: 38000 },
          { date: '2024-02', value: 41000 },
          { date: '2024-03', value: 44000 },
          { date: '2024-04', value: 43000 },
          { date: '2024-05', value: 46000 },
          { date: '2024-06', value: 48000 },
          { date: '2024-07', value: 47000 },
          { date: '2024-08', value: 49000 },
          { date: '2024-09', value: 42000 },
          { date: '2024-10', value: 45000 }
        ],
        profitMargin: [
          { date: '2024-01', value: 22.1 },
          { date: '2024-02', value: 24.3 },
          { date: '2024-03', value: 25.8 },
          { date: '2024-04', value: 23.9 },
          { date: '2024-05', value: 26.1 },
          { date: '2024-06', value: 27.3 },
          { date: '2024-07', value: 25.8 },
          { date: '2024-08', value: 28.2 },
          { date: '2024-09', value: 28.6 },
          { date: '2024-10', value: 28.9 }
        ],
        costRatio: [
          { date: '2024-01', value: 77.9 },
          { date: '2024-02', value: 75.7 },
          { date: '2024-03', value: 74.2 },
          { date: '2024-04', value: 76.1 },
          { date: '2024-05', value: 73.9 },
          { date: '2024-06', value: 72.7 },
          { date: '2024-07', value: 74.2 },
          { date: '2024-08', value: 71.8 },
          { date: '2024-09', value: 71.4 },
          { date: '2024-10', value: 71.1 }
        ]
      },
      insights: [
        {
          type: 'trend',
          metric: 'profitMargin',
          direction: 'increasing',
          strength: 'strong',
          description: 'Gewinnmarge zeigt einen starken Aufwärtstrend'
        },
        {
          type: 'volatility',
          metric: 'revenue',
          level: 'moderate',
          description: 'Umsatz schwankt moderat, aber insgesamt stabil'
        }
      ]
    };

    res.json(kpiTrends);
  } catch (error) {
    res.status(500).json({
      error: 'Fehler beim Laden der KPI-Trends',
      message: error.message
    });
  }
});

// Wirtschaftsplan vs. Ist-Daten
router.get('/business-plan', async (req, res) => {
  try {
    // Mock-Daten für Wirtschaftsplan-Vergleich
    const businessPlan = {
      year: 2024,
      quarterly: [
        {
          quarter: 'Q1',
          planned: { revenue: 120000, costs: 90000, profit: 30000 },
          actual: { revenue: 123000, costs: 91000, profit: 32000 },
          variance: { revenue: 2.5, costs: 1.1, profit: 6.7 }
        },
        {
          quarter: 'Q2',
          planned: { revenue: 130000, costs: 95000, profit: 35000 },
          actual: { revenue: 141000, costs: 98000, profit: 43000 },
          variance: { revenue: 8.5, costs: 3.2, profit: 22.9 }
        },
        {
          quarter: 'Q3',
          planned: { revenue: 135000, costs: 98000, profit: 37000 },
          actual: { revenue: 138000, costs: 99000, profit: 39000 },
          variance: { revenue: 2.2, costs: 1.0, profit: 5.4 }
        },
        {
          quarter: 'Q4',
          planned: { revenue: 140000, costs: 102000, profit: 38000 },
          actual: null, // Noch nicht verfügbar
          variance: null
        }
      ],
      yearlyForecast: {
        planned: { revenue: 525000, costs: 385000, profit: 140000 },
        forecast: { revenue: 548000, costs: 398000, profit: 150000 },
        confidence: 85
      },
      performance: {
        overallVariance: 5.2,
        status: 'ahead_of_plan',
        riskFactors: [
          'Steigende Materialkosten im Q4',
          'Saisonale Umsatzschwankungen'
        ]
      }
    };

    res.json(businessPlan);
  } catch (error) {
    res.status(500).json({
      error: 'Fehler beim Laden des Wirtschaftsplans',
      message: error.message
    });
  }
});

// Branchenvergleich
router.get('/industry-benchmark', async (req, res) => {
  try {
    const { industry = 'default' } = req.query;
    
    // Mock-Daten für Branchenvergleich
    const benchmark = {
      industry: industry === 'default' ? 'Kleinunternehmen allgemein' : industry,
      companySize: 'small',
      metrics: {
        profitMargin: {
          company: 28.9,
          industryAverage: 22.5,
          industryTop25: 35.0,
          position: 'above_average',
          percentile: 75
        },
        costRatio: {
          company: 71.1,
          industryAverage: 77.5,
          industryTop25: 65.0,
          position: 'above_average',
          percentile: 70
        },
        revenueGrowth: {
          company: 8.5,
          industryAverage: 5.2,
          industryTop25: 12.0,
          position: 'above_average',
          percentile: 68
        }
      },
      insights: [
        'Ihre Gewinnmarge liegt 6.4 Punkte über dem Branchendurchschnitt',
        'Kosteneffizienz ist überdurchschnittlich gut',
        'Wachstumsrate zeigt positive Entwicklung'
      ],
      recommendations: [
        'Gewinnmarge weiter optimieren - Potenzial für Top 25%',
        'Aktuelle Kostenstruktur beibehalten',
        'Wachstumsstrategie überprüfen und ausbauen'
      ]
    };

    res.json(benchmark);
  } catch (error) {
    res.status(500).json({
      error: 'Fehler beim Laden des Branchenvergleichs',
      message: error.message
    });
  }
});

module.exports = router;