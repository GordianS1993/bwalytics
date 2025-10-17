const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const path = require('path');
const fs = require('fs').promises;
const router = express.Router();

// Multer Konfiguration für PDF Upload
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, `bwa_${timestamp}_${sanitizedName}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Nur PDF-Dateien sind erlaubt'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB
  }
});

// BWA-Kennzahlen Extraktor
class BWAParser {
  static extractFinancialData(text) {
    const data = {
      period: null,
      revenue: null,
      costs: null,
      profit: null,
      cashFlow: null,
      assets: null,
      liabilities: null,
      equity: null,
      extractedAt: new Date().toISOString()
    };

    // Periode extrahieren (Monat/Jahr)
    const periodMatch = text.match(/(?:januar|februar|märz|april|mai|juni|juli|august|september|oktober|november|dezember)\s+(\d{4})|(\d{1,2})\.(\d{4})|(\d{4})/i);
    if (periodMatch) {
      data.period = periodMatch[0];
    }

    // Umsätze extrahieren
    const revenuePatterns = [
      /umsatzerlöse?\s*:?\s*([\d.,]+)/i,
      /erlöse?\s*:?\s*([\d.,]+)/i,
      /umsatz\s*:?\s*([\d.,]+)/i,
      /verkaufserlöse?\s*:?\s*([\d.,]+)/i
    ];
    
    for (const pattern of revenuePatterns) {
      const match = text.match(pattern);
      if (match) {
        data.revenue = this.parseGermanNumber(match[1]);
        break;
      }
    }

    // Kosten extrahieren
    const costPatterns = [
      /gesamtkosten\s*:?\s*([\d.,]+)/i,
      /aufwendungen\s*:?\s*([\d.,]+)/i,
      /kosten\s*:?\s*([\d.,]+)/i,
      /materialaufwand\s*:?\s*([\d.,]+)/i
    ];
    
    for (const pattern of costPatterns) {
      const match = text.match(pattern);
      if (match) {
        data.costs = this.parseGermanNumber(match[1]);
        break;
      }
    }

    // Gewinn/Verlust extrahieren
    const profitPatterns = [
      /(?:jahres)?ergebnis\s*:?\s*([-]?[\d.,]+)/i,
      /gewinn\s*:?\s*([-]?[\d.,]+)/i,
      /verlust\s*:?\s*([-]?[\d.,]+)/i,
      /betriebsergebnis\s*:?\s*([-]?[\d.,]+)/i
    ];
    
    for (const pattern of profitPatterns) {
      const match = text.match(pattern);
      if (match) {
        data.profit = this.parseGermanNumber(match[1]);
        break;
      }
    }

    // Wenn Gewinn nicht direkt gefunden, aus Umsatz - Kosten berechnen
    if (!data.profit && data.revenue && data.costs) {
      data.profit = data.revenue - data.costs;
    }

    return data;
  }

  static parseGermanNumber(numberStr) {
    if (!numberStr) return null;
    
    // Deutsche Zahlenformatierung: 1.234.567,89 -> 1234567.89
    const cleaned = numberStr
      .replace(/\./g, '') // Tausender-Punkte entfernen
      .replace(',', '.'); // Komma durch Punkt ersetzen
    
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? null : parsed;
  }

  static calculateBasicKPIs(data) {
    const kpis = {};
    
    if (data.revenue && data.costs) {
      kpis.profitMargin = ((data.profit || 0) / data.revenue) * 100;
      kpis.costRatio = (data.costs / data.revenue) * 100;
    }

    if (data.assets && data.liabilities) {
      kpis.equityRatio = ((data.assets - data.liabilities) / data.assets) * 100;
      kpis.debtRatio = (data.liabilities / data.assets) * 100;
    }

    return kpis;
  }
}

// Routes

// BWA PDF hochladen und verarbeiten
router.post('/upload', upload.single('bwaFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        error: 'Keine Datei hochgeladen',
        message: 'Bitte wählen Sie eine BWA-PDF-Datei aus' 
      });
    }

    console.log(`📄 BWA-Upload gestartet: ${req.file.filename}`);

    // PDF-Inhalt lesen und parsen
    const fileBuffer = await fs.readFile(req.file.path);
    const pdfData = await pdfParse(fileBuffer);
    
    console.log(`📖 PDF-Text extrahiert: ${pdfData.text.length} Zeichen`);

    // Finanzdaten aus PDF extrahieren
    const financialData = BWAParser.extractFinancialData(pdfData.text);
    const kpis = BWAParser.calculateBasicKPIs(financialData);

    // Mock-Speicherung (später durch Datenbank ersetzen)
    const bwaRecord = {
      id: Date.now(),
      filename: req.file.filename,
      originalName: req.file.originalname,
      uploadedAt: new Date().toISOString(),
      fileSize: req.file.size,
      data: financialData,
      kpis: kpis,
      status: 'processed'
    };

    console.log(`✅ BWA verarbeitet:`, bwaRecord);

    res.json({
      message: 'BWA erfolgreich hochgeladen und verarbeitet',
      bwa: bwaRecord,
      summary: {
        revenue: financialData.revenue,
        costs: financialData.costs,
        profit: financialData.profit,
        profitMargin: kpis.profitMargin
      }
    });

  } catch (error) {
    console.error('BWA Upload Fehler:', error);
    
    // Datei löschen bei Fehler
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error('Fehler beim Löschen der Datei:', unlinkError);
      }
    }

    res.status(500).json({
      error: 'Fehler beim Verarbeiten der BWA',
      message: error.message
    });
  }
});

// BWA-Liste abrufen (Mock-Daten)
router.get('/list', async (req, res) => {
  try {
    // TODO: Aus Datenbank laden
    const mockBWAs = [
      {
        id: 1,
        period: 'Oktober 2024',
        revenue: 45000,
        costs: 32000,
        profit: 13000,
        profitMargin: 28.9,
        uploadedAt: '2024-10-01T10:00:00Z',
        status: 'processed'
      },
      {
        id: 2,
        period: 'September 2024',
        revenue: 42000,
        costs: 30000,
        profit: 12000,
        profitMargin: 28.6,
        uploadedAt: '2024-09-01T10:00:00Z',
        status: 'processed'
      }
    ];

    res.json({
      bwas: mockBWAs,
      count: mockBWAs.length,
      message: 'BWA-Liste erfolgreich geladen'
    });
  } catch (error) {
    res.status(500).json({
      error: 'Fehler beim Laden der BWA-Liste',
      message: error.message
    });
  }
});

// Einzelne BWA abrufen
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // TODO: Aus Datenbank laden
    const mockBWA = {
      id: parseInt(id),
      period: 'Oktober 2024',
      revenue: 45000,
      costs: 32000,
      profit: 13000,
      data: {
        period: 'Oktober 2024',
        revenue: 45000,
        costs: 32000,
        profit: 13000,
        extractedAt: '2024-10-14T10:00:00Z'
      },
      kpis: {
        profitMargin: 28.9,
        costRatio: 71.1
      },
      uploadedAt: '2024-10-01T10:00:00Z',
      status: 'processed'
    };

    res.json(mockBWA);
  } catch (error) {
    res.status(500).json({
      error: 'Fehler beim Laden der BWA',
      message: error.message
    });
  }
});

// BWA löschen
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // TODO: Aus Datenbank löschen + Datei löschen
    
    res.json({
      message: 'BWA erfolgreich gelöscht',
      id: parseInt(id)
    });
  } catch (error) {
    res.status(500).json({
      error: 'Fehler beim Löschen der BWA',
      message: error.message
    });
  }
});

module.exports = router;