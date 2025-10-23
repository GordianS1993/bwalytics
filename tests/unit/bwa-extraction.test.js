/**
 * Unit Tests für BWA-Extraktion
 * Testet parseGermanNumber und extractDetailedCostBreakdown
 */

import { describe, it, expect } from 'vitest';
import { parseGermanNumber, extractDetailedCostBreakdown } from '../helpers/bwa-extractor.js';
import { 
  DATEV_SUSA_SAMPLE, 
  EXPECTED_BREAKDOWN_DATEV,
  MINIMAL_BWA,
  INVALID_BWA,
  EMPTY_BWA 
} from '../fixtures/bwa-samples.js';

describe('parseGermanNumber', () => {
  it('sollte deutsche Zahlen korrekt parsen', () => {
    expect(parseGermanNumber('1.234,56')).toBe(1234.56);
    expect(parseGermanNumber('45.000,00')).toBe(45000);
    expect(parseGermanNumber('850,00')).toBe(850);
    expect(parseGermanNumber('1.240')).toBe(1240);
  });

  it('sollte Zahlen ohne Formatierung parsen', () => {
    expect(parseGermanNumber('1234.56')).toBe(1234.56);
    expect(parseGermanNumber('45000')).toBe(45000);
  });

  it('sollte ungültige Eingaben als 0 behandeln', () => {
    expect(parseGermanNumber('')).toBe(0);
    expect(parseGermanNumber(null)).toBe(0);
    expect(parseGermanNumber(undefined)).toBe(0);
    expect(parseGermanNumber('abc')).toBe(0);
  });
});

describe('extractDetailedCostBreakdown', () => {
  it('sollte DATEV Summen- und Saldenliste korrekt extrahieren', () => {
    const result = extractDetailedCostBreakdown(DATEV_SUSA_SAMPLE);
    
    // Personal: Gehälter (45.000) + Sozialabgaben (9.500) = 54.500
    expect(result.personal.total).toBe(EXPECTED_BREAKDOWN_DATEV.personal.total);
    expect(result.personal.items.length).toBe(EXPECTED_BREAKDOWN_DATEV.personal.itemCount);
    
    // Raum: Miete (3.600) + Strom/Gas/Wasser (850) = 4.450
    expect(result.raum.total).toBe(EXPECTED_BREAKDOWN_DATEV.raum.total);
    expect(result.raum.items.length).toBe(EXPECTED_BREAKDOWN_DATEV.raum.itemCount);
    
    // Kfz: Betriebskosten (1.240)
    expect(result.kfz.total).toBe(EXPECTED_BREAKDOWN_DATEV.kfz.total);
    expect(result.kfz.items.length).toBe(EXPECTED_BREAKDOWN_DATEV.kfz.itemCount);
    
    // Marketing: Werbekosten (2.800)
    expect(result.marketing.total).toBe(EXPECTED_BREAKDOWN_DATEV.marketing.total);
    expect(result.marketing.items.length).toBe(EXPECTED_BREAKDOWN_DATEV.marketing.itemCount);
    
    // Büro: Telefon/Internet (450) + Rechts/Beratung (1.200) = 1.650
    expect(result.büro.total).toBe(EXPECTED_BREAKDOWN_DATEV.büro.total);
    expect(result.büro.items.length).toBe(EXPECTED_BREAKDOWN_DATEV.büro.itemCount);
    
    // Sonstige: Sonstige Betriebskosten (780)
    expect(result.sonstige.total).toBe(EXPECTED_BREAKDOWN_DATEV.sonstige.total);
    expect(result.sonstige.items.length).toBe(EXPECTED_BREAKDOWN_DATEV.sonstige.itemCount);
  });

  it('sollte Personal-Konten korrekt kategorisieren', () => {
    const result = extractDetailedCostBreakdown(DATEV_SUSA_SAMPLE);
    
    const personalAccounts = result.personal.items.map(item => item.account);
    expect(personalAccounts).toContain('4120'); // Gehälter
    expect(personalAccounts).toContain('4130'); // Sozialabgaben
  });

  it('sollte Raum-Konten korrekt kategorisieren', () => {
    const result = extractDetailedCostBreakdown(DATEV_SUSA_SAMPLE);
    
    const raumAccounts = result.raum.items.map(item => item.account);
    expect(raumAccounts).toContain('4210'); // Miete
    expect(raumAccounts).toContain('4240'); // Strom, Gas, Wasser
  });

  it('sollte minimales BWA verarbeiten', () => {
    const result = extractDetailedCostBreakdown(MINIMAL_BWA);
    
    expect(result.personal.total).toBe(30000); // 4120 Gehälter
    expect(result.personal.items.length).toBe(1);
  });

  it('sollte ungültige BWAs ohne Fehler verarbeiten', () => {
    const result = extractDetailedCostBreakdown(INVALID_BWA);
    
    // Alle Kategorien sollten leer sein
    expect(result.personal.total).toBe(0);
    expect(result.raum.total).toBe(0);
    expect(result.kfz.total).toBe(0);
    expect(result.marketing.total).toBe(0);
  });

  it('sollte leere Eingabe ohne Fehler verarbeiten', () => {
    const result = extractDetailedCostBreakdown(EMPTY_BWA);
    
    expect(result.personal.total).toBe(0);
    expect(result.raum.total).toBe(0);
  });

  it('sollte nur Kosten-Konten (4xxx) extrahieren', () => {
    const result = extractDetailedCostBreakdown(DATEV_SUSA_SAMPLE);
    
    // Konto 8400 (Erlöse) sollte NICHT in den Kosten sein
    const allItems = Object.values(result).flatMap(cat => cat.items);
    const hasRevenueAccount = allItems.some(item => item.account.startsWith('8'));
    
    expect(hasRevenueAccount).toBe(false);
  });

  it('sollte Einzelpositionen mit korrekten Details speichern', () => {
    const result = extractDetailedCostBreakdown(DATEV_SUSA_SAMPLE);
    
    const gehaltItem = result.personal.items.find(item => item.account === '4120');
    
    expect(gehaltItem).toBeDefined();
    expect(gehaltItem.account).toBe('4120');
    expect(gehaltItem.description).toContain('Gehälter');
    expect(gehaltItem.amount).toBe(45000);
  });
});
