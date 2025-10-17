const express = require('express');
const router = express.Router();

// Mock OpenAI API Funktion (später durch echte API ersetzen)
class AIRecommendationEngine {
  
  static async generateRecommendations(financialData, historicalData, scoringData) {
    // Simuliert KI-Analyse - später durch echte OpenAI API ersetzen
    const insights = this.analyzeBusinessSituation(financialData, historicalData, scoringData);
    const recommendations = this.generateActionableRecommendations(insights);
    
    return {
      insights,
      recommendations,
      confidence: this.calculateConfidence(historicalData),
      generatedAt: new Date().toISOString()
    };
  }

  static analyzeBusinessSituation(current, historical, scoring) {
    const insights = [];
    
    // Umsatz-Trend analysieren
    if (historical.length >= 3) {
      const recentRevenues = historical.slice(-3).map(d => d.revenue);
      const trend = this.calculateTrend(recentRevenues);
      
      if (trend > 0.05) {
        insights.push({
          type: 'positive',
          category: 'revenue',
          title: 'Starkes Umsatzwachstum',
          description: `Ihr Umsatz ist in den letzten Monaten um ${(trend * 100).toFixed(1)}% gewachsen. Diese positive Entwicklung zeigt eine gesunde Geschäftsentwicklung.`,
          impact: 'high',
          confidence: 0.9
        });
      } else if (trend < -0.05) {
        insights.push({
          type: 'warning',
          category: 'revenue',
          title: 'Rückläufiger Umsatz',
          description: `Der Umsatz ist in den letzten Monaten um ${Math.abs(trend * 100).toFixed(1)}% zurückgegangen. Dies erfordert Aufmerksamkeit.`,
          impact: 'high',
          confidence: 0.85
        });
      }
    }

    // Gewinnmarge analysieren
    const profitMargin = ((current.revenue - current.costs) / current.revenue) * 100;
    if (profitMargin > 25) {
      insights.push({
        type: 'positive',
        category: 'profitability',
        title: 'Hervorragende Gewinnmarge',
        description: `Mit ${profitMargin.toFixed(1)}% liegt Ihre Gewinnmarge deutlich über dem Branchendurchschnitt von 22,5%. Dies zeigt eine effiziente Geschäftsführung.`,
        impact: 'medium',
        confidence: 0.95
      });
    }

    // Kostenkontrolle analysieren
    const costRatio = (current.costs / current.revenue) * 100;
    if (costRatio < 70) {
      insights.push({
        type: 'positive',
        category: 'efficiency',
        title: 'Ausgezeichnete Kostenkontrolle',
        description: `Ihr Kostenverhältnis von ${costRatio.toFixed(1)}% zeigt eine sehr gute Kostendisziplin. Sie haben Ihre Ausgaben gut im Griff.`,
        impact: 'medium',
        confidence: 0.88
      });
    }

    // Scoring-basierte Insights
    if (scoring.overall >= 80) {
      insights.push({
        type: 'positive',
        category: 'overall',
        title: 'Starke Unternehmensgesundheit',
        description: `Ihr Gesamt-Score von ${scoring.overall} Punkten zeigt eine sehr gesunde Geschäftssituation. Sie sind auf einem guten Weg.`,
        impact: 'high',
        confidence: 0.92
      });
    }

    return insights;
  }

  static generateActionableRecommendations(insights) {
    const recommendations = [];

    // Umsatz-Empfehlungen
    const revenueInsights = insights.filter(i => i.category === 'revenue');
    if (revenueInsights.some(i => i.type === 'positive')) {
      recommendations.push({
        category: 'growth',
        priority: 'high',
        title: 'Wachstumsmomentum nutzen',
        description: 'Ihr positiver Umsatztrend bietet eine Gelegenheit zur Expansion.',
        actions: [
          'Marketing-Budget um 10-15% erhöhen',
          'Neue Vertriebskanäle erschließen',
          'Kapazitäten für gestiegene Nachfrage ausbauen',
          'Kundenbindungsprogramm entwickeln'
        ],
        expectedImpact: 'Weitere Umsatzsteigerung um 5-10%',
        timeframe: '3-6 Monate',
        investment: 'Mittel'
      });
    }

    // Effizienz-Empfehlungen
    const efficiencyInsights = insights.filter(i => i.category === 'efficiency');
    if (efficiencyInsights.some(i => i.type === 'positive')) {
      recommendations.push({
        category: 'optimization',
        priority: 'medium',
        title: 'Kostenvorteil weiter ausbauen',
        description: 'Ihre gute Kostenkontrolle kann als Wettbewerbsvorteil genutzt werden.',
        actions: [
          'Prozessautomatisierung vorantreiben',
          'Lieferantenverhandlungen intensivieren',
          'Digitalisierung weiter vorantreiben',
          'Benchmarking mit Wettbewerbern durchführen'
        ],
        expectedImpact: 'Weitere Kosteneinsparung von 2-3%',
        timeframe: '2-4 Monate',
        investment: 'Niedrig'
      });
    }

    // Liquiditäts-Empfehlungen
    recommendations.push({
      category: 'finance',
      priority: 'medium',
      title: 'Finanzpolster stärken',
      description: 'Aufbau von Liquiditätsreserven für zukünftige Investitionen und Krisen.',
      actions: [
        'Liquiditätsplanung für 12 Monate erstellen',
        'Kreditlinie für Notfälle einrichten',
        'Rücklagenbildung systematisieren',
        'Cashflow-Forecasting implementieren'
      ],
      expectedImpact: 'Verbesserte Finanzstabilität',
      timeframe: '1-3 Monate',
      investment: 'Niedrig'
    });

    // Strategische Empfehlungen
    recommendations.push({
      category: 'strategy',
      priority: 'low',
      title: 'Langfristige Positioning stärken',
      description: 'Strategische Weiterentwicklung für nachhaltigen Erfolg.',
      actions: [
        'Marktpositionierung analysieren',
        'Alleinstellungsmerkmale schärfen',
        'Innovations-Pipeline aufbauen',
        'Kundenanalyse vertiefen'
      ],
      expectedImpact: 'Nachhaltige Wettbewerbsvorteile',
      timeframe: '6-12 Monate',
      investment: 'Hoch'
    });

    return recommendations;
  }

  static calculateTrend(values) {
    if (values.length < 2) return 0;
    
    const first = values[0];
    const last = values[values.length - 1];
    
    return (last - first) / first;
  }

  static calculateConfidence(historicalData) {
    // Confidence basiert auf Datenmenge und -qualität
    if (historicalData.length < 3) return 0.6;
    if (historicalData.length < 6) return 0.75;
    if (historicalData.length < 12) return 0.85;
    return 0.95;
  }
}

// Routes

// Aktuelle Empfehlungen abrufen
router.get('/current', async (req, res) => {
  try {
    // Mock aktueller Daten
    const currentData = {
      revenue: 45000,
      costs: 32000,
      profit: 13000,
      period: 'Oktober 2024'
    };

    const historicalData = [
      { revenue: 38000, costs: 29000, period: 'Juli 2024' },
      { revenue: 41000, costs: 31000, period: 'August 2024' },
      { revenue: 42000, costs: 30000, period: 'September 2024' },
      { revenue: 45000, costs: 32000, period: 'Oktober 2024' }
    ];

    const scoringData = {
      overall: 85,
      breakdown: {
        liquidity: 85,
        profitability: 88,
        stability: 83,
        growth: 82,
        efficiency: 87
      }
    };

    const aiRecommendations = await AIRecommendationEngine.generateRecommendations(
      currentData, 
      historicalData, 
      scoringData
    );

    res.json({
      ...aiRecommendations,
      meta: {
        period: currentData.period,
        dataQuality: historicalData.length >= 6 ? 'high' : 'medium',
        lastUpdate: new Date().toISOString()
      }
    });

  } catch (error) {
    res.status(500).json({
      error: 'Fehler beim Generieren der Empfehlungen',
      message: error.message
    });
  }
});

// Branchenspezifische Empfehlungen
router.get('/industry/:sector', async (req, res) => {
  try {
    const { sector } = req.params;
    
    const industryRecommendations = {
      'einzelhandel': {
        title: 'Einzelhandel-spezifische Empfehlungen',
        recommendations: [
          {
            category: 'seasonal',
            title: 'Saisonale Planung optimieren',
            description: 'Q4 ist traditionell stark im Einzelhandel',
            actions: ['Lagerhaltung für Weihnachtsgeschäft', 'Personal aufstocken']
          }
        ]
      },
      'dienstleistung': {
        title: 'Dienstleistungs-spezifische Empfehlungen',
        recommendations: [
          {
            category: 'scalability',
            title: 'Skalierbarkeit verbessern',
            description: 'Zeit-basierte Geschäftsmodelle optimieren',
            actions: ['Automatisierung einführen', 'Standardprozesse entwickeln']
          }
        ]
      }
    };

    const sectorData = industryRecommendations[sector] || {
      title: 'Allgemeine Branchenempfehlungen',
      recommendations: []
    };

    res.json(sectorData);
  } catch (error) {
    res.status(500).json({
      error: 'Fehler beim Laden der Branchenempfehlungen',
      message: error.message
    });
  }
});

// Empfehlungen nach Priorität
router.get('/priority/:level', async (req, res) => {
  try {
    const { level } = req.params; // 'high', 'medium', 'low'
    
    // Mock-Daten für verschiedene Prioritätsstufen
    const allRecommendations = [
      {
        id: 1,
        priority: 'high',
        category: 'cash_flow',
        title: 'Liquiditätsmanagement verbessern',
        description: 'Cashflow-Vorhersage und -optimierung',
        urgency: 'Diese Woche',
        impact: 'Hoch',
        effort: 'Mittel'
      },
      {
        id: 2,
        priority: 'medium',
        category: 'growth',
        title: 'Marketing-Strategie ausbauen',
        description: 'Digitale Präsenz und Kundenakquise verstärken',
        urgency: 'Nächster Monat',
        impact: 'Mittel',
        effort: 'Hoch'
      },
      {
        id: 3,
        priority: 'low',
        category: 'efficiency',
        title: 'Prozessoptimierung',
        description: 'Arbeitsabläufe digitalisieren und automatisieren',
        urgency: 'Nächstes Quartal',
        impact: 'Niedrig',
        effort: 'Niedrig'
      }
    ];

    const filteredRecommendations = allRecommendations.filter(r => r.priority === level);

    res.json({
      priority: level,
      count: filteredRecommendations.length,
      recommendations: filteredRecommendations
    });
  } catch (error) {
    res.status(500).json({
      error: 'Fehler beim Laden der priorisierten Empfehlungen',
      message: error.message
    });
  }
});

// Empfehlungen als abgehakt markieren
router.post('/mark-completed/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { feedback, rating } = req.body;

    // TODO: In Datenbank speichern
    
    res.json({
      message: 'Empfehlung als abgeschlossen markiert',
      id: parseInt(id),
      feedback: feedback || null,
      rating: rating || null,
      completedAt: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: 'Fehler beim Markieren der Empfehlung',
      message: error.message
    });
  }
});

// Feedback zu Empfehlungen
router.post('/feedback', async (req, res) => {
  try {
    const { recommendationId, useful, comment, implemented } = req.body;

    // TODO: Feedback in Datenbank speichern für ML-Verbesserung
    
    res.json({
      message: 'Feedback erfolgreich gespeichert',
      recommendationId,
      feedback: {
        useful,
        comment,
        implemented,
        submittedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Fehler beim Speichern des Feedbacks',
      message: error.message
    });
  }
});

module.exports = router;