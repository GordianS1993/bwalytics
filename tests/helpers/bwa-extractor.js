/**
 * Hilfsfunktionen für Tests
 * Extrahierte Funktionen aus bwa-upload-working.html für testbare Module
 */

/**
 * Parst deutsche Zahlenformate (1.234,56) zu JavaScript Numbers
 * @param {string} str - Deutsche Zahl als String
 * @returns {number} - Geparste Zahl
 */
export function parseGermanNumber(str) {
  if (!str || typeof str !== 'string') return 0;
  
  // Entferne alle Punkte (Tausender-Trennzeichen)
  // Ersetze Komma durch Punkt (Dezimaltrennzeichen)
  const cleaned = str.replace(/\./g, '').replace(',', '.');
  const parsed = parseFloat(cleaned);
  
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Extrahiert detaillierte Kostenaufschlüsselung aus BWA-Text
 * @param {string} text - BWA PDF-Text
 * @returns {object} - Kategorisierte Kosten mit Einzelpositionen
 */
export function extractDetailedCostBreakdown(text) {
  console.log('🔍 === INTELLIGENTE KOSTENARTEN-EXTRAKTION ===');
  
  const costs = {
    // Hauptkategorien
    personal: { total: 0, items: [], label: 'Personalkosten' },
    raum: { total: 0, items: [], label: 'Raumkosten' },
    kfz: { total: 0, items: [], label: 'Kfz-Kosten' },
    marketing: { total: 0, items: [], label: 'Marketing & Werbung' },
    versicherungen: { total: 0, items: [], label: 'Versicherungen & Beiträge' },
    büro: { total: 0, items: [], label: 'Büro & Verwaltung' },
    fremdleistung: { total: 0, items: [], label: 'Fremdleistungen' },
    sonstige: { total: 0, items: [], label: 'Sonstige Kosten' }
  };
  
  // Kategorisierungs-Regeln (semantisch, format-agnostisch)
  const categoryRules = {
    personal: [
      /4120.*gehalt|lohn|gehälter/i,
      /4130.*sozial.*aufwend|sozialabgaben|lohnnebenkosten/i,
      /4140.*freiw.*sozial|vermögenswirksam|betriebliche altersv/i,
      /gehalt|lohn|personal|sozialvers|arbeitgeber/i
    ],
    raum: [
      /421\d.*miete|raumkosten/i,
      /424\d.*strom|gas|wasser|heizung|energie/i,
      /425\d.*reinigung|hausmeister|geb.*reinigung/i,
      /miete|nebenkosten|strom|gas|wasser|heizung/i
    ],
    kfz: [
      /452\d.*kfz.*versich|fahrzeugversich/i,
      /453\d.*kfz.*betrieb|kraftstoff|tanken|diesel|benzin/i,
      /454\d.*kfz.*repar|reparatur.*fahr/i,
      /455\d.*kfz|fahrzeug/i,
      /456\d.*maut|vignette/i,
      /458\d.*sonst.*kfz/i,
      /459\d.*fremdfahrzeug|mietfahrzeug|leasing.*fahr/i,
      /kfz|fahrzeug|auto|pkw|lkw|kraftstoff|tanken|maut/i
    ],
    marketing: [
      /460\d.*werb|marketing|anzeigen/i,
      /465\d.*bewirt|geschäftsessen/i,
      /werb|marketing|anzeige|google.*ads|facebook.*ads|kampagne/i
    ],
    versicherungen: [
      /436\d.*versich|haftpflicht/i,
      /438\d.*beitr|kammer|verband|ihk/i,
      /439\d.*abgab|gebühr/i,
      /versicherung|haftpflicht|kammer|beitrag|ihk/i
    ],
    büro: [
      /491\d.*porto|brief|paket/i,
      /492\d.*telefon|internet|mobilfunk/i,
      /493\d.*büro|schreibw|papier|toner/i,
      /495\d.*rechts|beratung|steuerber/i,
      /496\d.*edv|software|computer/i,
      /497\d.*bank|konto|gebühr/i,
      /498\d.*sonst.*betrieb/i,
      /büro|porto|telefon|internet|software|beratung|rechts|steuer/i
    ],
    fremdleistung: [
      /470\d.*verpack|material/i,
      /478\d.*fremd.*arb|subunternehm|freelanc/i,
      /fremdleis|subuntern|extern.*dienst|freelanc/i
    ]
  };
  
  // Analysiere jede Zeile
  const lines = text.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Erkenne Kontozeilen mit verschiedenen Formaten
    // Format 1: "4120 Gehälter 45.000,00"
    // Format 2: "Konto 4120 - Gehälter: 45.000,00 EUR"
    const match1 = line.match(/^(\d{4})\s+(.+?)\s+([\d,.]+)$/);
    const match2 = line.match(/Konto\s+(\d{4}).*?[:-]\s*(.+?):\s*([\d,.]+)/i);
    
    let accountNumber, description, amount;
    
    if (match1) {
      accountNumber = match1[1];
      description = match1[2].trim();
      amount = parseGermanNumber(match1[3]);
    } else if (match2) {
      accountNumber = match2[1];
      description = match2[2].trim();
      amount = parseGermanNumber(match2[3]);
    } else {
      continue;
    }
    
    // Nur Kosten-Konten (4xxx, 6xxx, 7xxx) und Beträge > 0
    if (!accountNumber.match(/^[467]\d{3}$/) || amount <= 0) {
      continue;
    }
    
    // Kategorisiere
    let categorized = false;
    for (const [category, rules] of Object.entries(categoryRules)) {
      for (const rule of rules) {
        if (rule.test(accountNumber + ' ' + description)) {
          costs[category].total += amount;
          costs[category].items.push({
            account: accountNumber,
            description: description,
            amount: amount
          });
          categorized = true;
          break;
        }
      }
      if (categorized) break;
    }
    
    // Fallback: Sonstige
    if (!categorized) {
      costs.sonstige.total += amount;
      costs.sonstige.items.push({
        account: accountNumber,
        description: description,
        amount: amount
      });
    }
  }
  
  return costs;
}

/**
 * Extrahiert BWA-Hauptdaten (Umsatz, Kosten, Gewinn)
 * @param {string} text - BWA PDF-Text
 * @returns {object} - { revenue, costs, profit, margin, costBreakdown }
 */
export function extractBWADataFromText(text) {
  // Extrahiere Kosten-Breakdown
  const costBreakdown = extractDetailedCostBreakdown(text);
  
  // Berechne Gesamt-Kosten
  let totalCosts = 0;
  for (const category of Object.values(costBreakdown)) {
    totalCosts += category.total;
  }
  
  // Extrahiere Umsatz (Konto 8xxx)
  // Format: "8400 Erlöse 0,00 95.500,00 95.500,00" oder "Konto 8400 - Umsatzerlöse: 95.500,00 EUR"
  let revenue = 0;
  const lines = text.split('\n');
  for (const line of lines) {
    // Format 1: "8400 Erlöse ... Saldo"
    const match1 = line.match(/8\d{3}\s+.*?Erlöse?.*?([\d,.]+)\s*$/i);
    // Format 2: "Konto 8400 - Umsatzerlöse: 95.500,00"
    const match2 = line.match(/Konto\s+8\d{3}.*?[:-]\s*(?:Umsatz|Erlöse?).*?([\d,.]+)/i);
    
    if (match1) {
      revenue = parseGermanNumber(match1[1]);
      break;
    } else if (match2) {
      revenue = parseGermanNumber(match2[1]);
      break;
    }
  }
  
  // Berechne Gewinn und Marge
  const profit = revenue - totalCosts;
  const margin = revenue > 0 ? (profit / revenue) * 100 : 0;
  
  return {
    revenue,
    costs: totalCosts,
    profit,
    margin: Math.round(margin * 10) / 10, // 1 Dezimalstelle
    costBreakdown
  };
}
