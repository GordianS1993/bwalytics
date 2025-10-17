const express = require('express');
const router = express.Router();

// Scoring-Algorithmus für Unternehmensgesundheit
class BusinessHealthScoring {
  
  // Hauptscoring-Funktion
  static calculateOverallScore(financialData, historicalData = []) {
    const scores = {
      liquidity: this.calculateLiquidityScore(financialData),
      profitability: this.calculateProfitabilityScore(financialData),
      stability: this.calculateStabilityScore(financialData, historicalData),
      growth: this.calculateGrowthScore(financialData, historicalData),
      efficiency: this.calculateEfficiencyScore(financialData)
    };

    // Gewichtung der verschiedenen Bereiche
    const weights = {
      liquidity: 0.25,
      profitability: 0.30,
      stability: 0.20,
      growth: 0.15,
      efficiency: 0.10
    };

    // Gesamtscore berechnen
    const overallScore = Object.keys(scores).reduce((total, key) => {
      return total + (scores[key] * weights[key]);
    }, 0);

    return {
      overall: Math.round(overallScore),
      breakdown: scores,
      weights,
      grade: this.getScoreGrade(overallScore),
      status: this.getHealthStatus(overallScore)
    };
  }

  // Liquiditätsscore (0-100)
  static calculateLiquidityScore(data) {
    const { revenue, costs, cashFlow } = data;
    
    if (!revenue || !costs) return 50; // Neutral wenn Daten fehlen

    const profitMargin = ((revenue - costs) / revenue) * 100;
    const estimatedCashFlow = cashFlow || (revenue - costs);
    const monthlyBurn = costs / 12;
    const runwayMonths = estimatedCashFlow / monthlyBurn;

    let score = 50; // Basis-Score

    // Gewinnmarge berücksichtigen
    if (profitMargin > 30) score += 25;
    else if (profitMargin > 20) score += 15;
    else if (profitMargin > 10) score += 5;
    else if (profitMargin < 0) score -= 30;

    // Liquiditätslaufzeit berücksichtigen
    if (runwayMonths > 12) score += 25;
    else if (runwayMonths > 6) score += 10;
    else if (runwayMonths < 3) score -= 20;

    return Math.max(0, Math.min(100, score));
  }

  // Rentabilitätsscore (0-100)
  static calculateProfitabilityScore(data) {
    const { revenue, costs, profit } = data;
    
    if (!revenue || costs === undefined) return 50;

    const actualProfit = profit || (revenue - costs);
    const profitMargin = (actualProfit / revenue) * 100;
    const costRatio = (costs / revenue) * 100;

    let score = 50;

    // Gewinnmarge bewerten
    if (profitMargin > 35) score += 30;
    else if (profitMargin > 25) score += 20;
    else if (profitMargin > 15) score += 10;
    else if (profitMargin > 5) score += 5;
    else if (profitMargin < 0) score -= 25;

    // Kostenverhältnis bewerten
    if (costRatio < 60) score += 20;
    else if (costRatio < 70) score += 10;
    else if (costRatio < 80) score += 5;
    else if (costRatio > 90) score -= 15;

    return Math.max(0, Math.min(100, score));
  }

  // Stabilitätsscore basierend auf Variabilität
  static calculateStabilityScore(data, historicalData) {
    if (historicalData.length < 3) return 70; // Neutral bei wenig Daten

    const revenues = historicalData.map(d => d.revenue).filter(r => r);
    const margins = historicalData.map(d => {
      if (d.revenue && d.costs) {
        return ((d.revenue - d.costs) / d.revenue) * 100;
      }
      return null;
    }).filter(m => m !== null);

    if (revenues.length < 3) return 70;

    // Variationskoeffizient berechnen
    const revenueCV = this.calculateCV(revenues);
    const marginCV = margins.length > 0 ? this.calculateCV(margins) : 0;

    let score = 80; // Hoher Basis-Score für Stabilität

    // Umsatzstabilität bewerten
    if (revenueCV < 0.1) score += 20;
    else if (revenueCV < 0.2) score += 10;
    else if (revenueCV > 0.4) score -= 20;

    // Margenstabilität bewerten
    if (marginCV < 0.15) score += 10;
    else if (marginCV > 0.3) score -= 15;

    return Math.max(0, Math.min(100, score));
  }

  // Wachstumsscore
  static calculateGrowthScore(data, historicalData) {
    if (historicalData.length < 2) return 60; // Neutral

    const recent = historicalData.slice(-3); // Letzte 3 Perioden
    const revenues = recent.map(d => d.revenue).filter(r => r);
    
    if (revenues.length < 2) return 60;

    const growthRate = ((revenues[revenues.length - 1] - revenues[0]) / revenues[0]) * 100;
    
    let score = 50;

    if (growthRate > 15) score += 30;
    else if (growthRate > 10) score += 20;
    else if (growthRate > 5) score += 10;
    else if (growthRate > 0) score += 5;
    else if (growthRate < -10) score -= 25;

    return Math.max(0, Math.min(100, score));
  }

  // Effizienz-Score
  static calculateEfficiencyScore(data) {
    const { revenue, costs } = data;
    
    if (!revenue || !costs) return 60;

    const efficiency = revenue / costs; // Revenue per cost unit
    
    let score = 50;

    if (efficiency > 1.5) score += 30;
    else if (efficiency > 1.3) score += 20;
    else if (efficiency > 1.1) score += 10;
    else if (efficiency < 1.0) score -= 30;

    return Math.max(0, Math.min(100, score));
  }

  // Hilfsfunktionen
  static calculateCV(values) {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);
    return stdDev / mean;
  }

  static getScoreGrade(score) {
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    if (score >= 50) return 'D';
    return 'F';
  }

  static getHealthStatus(score) {
    if (score >= 85) return { level: 'excellent', color: '#22c55e', text: 'Ausgezeichnet' };
    if (score >= 70) return { level: 'good', color: '#84cc16', text: 'Gut' };
    if (score >= 55) return { level: 'average', color: '#eab308', text: 'Durchschnittlich' };
    if (score >= 40) return { level: 'concerning', color: '#f97316', text: 'Bedenklich' };
    return { level: 'critical', color: '#ef4444', text: 'Kritisch' };
  }
}

// Routes

// Aktuelles Scoring abrufen
router.get('/current', async (req, res) => {
  try {
    // Mock aktueller Finanzdaten
    const currentData = {
      revenue: 45000,
      costs: 32000,
      profit: 13000,
      cashFlow: 15000,
      period: 'Oktober 2024'
    };

    // Mock historischer Daten
    const historicalData = [
      { revenue: 38000, costs: 29000, period: 'Juli 2024' },
      { revenue: 41000, costs: 31000, period: 'August 2024' },
      { revenue: 42000, costs: 30000, period: 'September 2024' },
      { revenue: 45000, costs: 32000, period: 'Oktober 2024' }
    ];

    const scoring = BusinessHealthScoring.calculateOverallScore(currentData, historicalData);

    const response = {
      ...scoring,
      period: currentData.period,
      lastUpdated: new Date().toISOString(),
      recommendations: generateRecommendations(scoring),
      trends: {
        direction: 'improving',
        change: '+5 Punkte seit letztem Monat',
        momentum: 'positive'
      }
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({
      error: 'Fehler beim Berechnen des Scorings',
      message: error.message
    });
  }
});

// Scoring-Historie
router.get('/history', async (req, res) => {
  try {
    const { months = 12 } = req.query;
    
    // Mock historische Scoring-Daten
    const scoringHistory = [
      { period: '2024-01', overall: 72, breakdown: { liquidity: 70, profitability: 75, stability: 80, growth: 60, efficiency: 75 } },
      { period: '2024-02', overall: 74, breakdown: { liquidity: 72, profitability: 78, stability: 78, growth: 65, efficiency: 77 } },
      { period: '2024-03', overall: 76, breakdown: { liquidity: 75, profitability: 80, stability: 76, growth: 70, efficiency: 79 } },
      { period: '2024-04', overall: 73, breakdown: { liquidity: 71, profitability: 77, stability: 75, growth: 68, efficiency: 74 } },
      { period: '2024-05', overall: 79, breakdown: { liquidity: 78, profitability: 82, stability: 79, growth: 75, efficiency: 81 } },
      { period: '2024-06', overall: 81, breakdown: { liquidity: 80, profitability: 84, stability: 81, growth: 78, efficiency: 82 } },
      { period: '2024-07', overall: 78, breakdown: { liquidity: 76, profitability: 81, stability: 79, growth: 72, efficiency: 80 } },
      { period: '2024-08', overall: 82, breakdown: { liquidity: 82, profitability: 85, stability: 80, growth: 80, efficiency: 83 } },
      { period: '2024-09', overall: 83, breakdown: { liquidity: 84, profitability: 86, stability: 82, growth: 78, efficiency: 85 } },
      { period: '2024-10', overall: 85, breakdown: { liquidity: 85, profitability: 88, stability: 83, growth: 82, efficiency: 87 } }
    ];

    const limitedHistory = scoringHistory.slice(-months);

    res.json({
      history: limitedHistory,
      summary: {
        averageScore: Math.round(limitedHistory.reduce((sum, item) => sum + item.overall, 0) / limitedHistory.length),
        trend: 'improving',
        bestPeriod: '2024-10',
        improvementAreas: ['growth', 'stability']
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Fehler beim Laden der Scoring-Historie',
      message: error.message
    });
  }
});

// Detaillierte Scoring-Analyse
router.get('/analysis/:category', async (req, res) => {
  try {
    const { category } = req.params;
    
    const analyses = {
      liquidity: {
        title: 'Liquiditätsanalyse',
        description: 'Bewertet die Zahlungsfähigkeit und Liquiditätslage',
        currentScore: 85,
        factors: [
          { name: 'Gewinnmarge', value: 28.9, weight: 40, score: 90, status: 'excellent' },
          { name: 'Liquiditätslaufzeit', value: 8.5, weight: 35, score: 85, status: 'good' },
          { name: 'Cashflow-Stabilität', value: 'stabil', weight: 25, score: 80, status: 'good' }
        ],
        insights: [
          'Hohe Gewinnmarge sichert gute Liquidität',
          'Liquiditätslaufzeit über 6 Monate ist ausgezeichnet',
          'Cashflow zeigt stabile Entwicklung'
        ],
        recommendations: [
          'Liquiditätsreserven weiter ausbauen',
          'Notfall-Liquiditätsplan erstellen'
        ]
      },
      profitability: {
        title: 'Rentabilitätsanalyse',
        description: 'Misst die Gewinnerzielung und Kosteneffizienz',
        currentScore: 88,
        factors: [
          { name: 'Gewinnmarge', value: 28.9, weight: 50, score: 92, status: 'excellent' },
          { name: 'Kostenverhältnis', value: 71.1, weight: 30, score: 85, status: 'good' },
          { name: 'ROI', value: 'hoch', weight: 20, score: 85, status: 'good' }
        ],
        insights: [
          'Gewinnmarge deutlich über Branchendurchschnitt',
          'Kostenkontrolle sehr effektiv',
          'Return on Investment überzeugt'
        ],
        recommendations: [
          'Preisstrategien überprüfen - weiteres Potenzial',
          'Kosteneinsparungen weiter vorantreiben'
        ]
      }
    };

    const analysis = analyses[category];
    if (!analysis) {
      return res.status(404).json({ error: 'Analyse-Kategorie nicht gefunden' });
    }

    res.json(analysis);
  } catch (error) {
    res.status(500).json({
      error: 'Fehler beim Laden der Analyse',
      message: error.message
    });
  }
});

// Hilfsfunktion für Empfehlungen
function generateRecommendations(scoring) {
  const recommendations = [];
  
  if (scoring.breakdown.liquidity < 70) {
    recommendations.push({
      category: 'liquidity',
      priority: 'high',
      title: 'Liquidität verbessern',
      description: 'Cashflow-Management optimieren und Liquiditätsreserven aufbauen'
    });
  }
  
  if (scoring.breakdown.profitability < 75) {
    recommendations.push({
      category: 'profitability',
      priority: 'medium',
      title: 'Rentabilität steigern',
      description: 'Kosten analysieren und Preisstrategien überprüfen'
    });
  }
  
  if (scoring.breakdown.growth < 60) {
    recommendations.push({
      category: 'growth',
      priority: 'medium',
      title: 'Wachstum fördern',
      description: 'Marketing-Investitionen und Geschäftsentwicklung intensivieren'
    });
  }

  return recommendations;
}

module.exports = router;