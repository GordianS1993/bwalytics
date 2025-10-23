/**
 * Integration Tests für vollständige BWA-Datenextraktion
 * Testet extractBWADataFromText End-to-End
 */

import { describe, it, expect } from 'vitest';
import { extractBWADataFromText } from '../helpers/bwa-extractor.js';
import { 
  DATEV_SUSA_SAMPLE, 
  LEXOFFICE_SAMPLE,
  EXPECTED_BWA_DATA_DATEV 
} from '../fixtures/bwa-samples.js';

describe('extractBWADataFromText - Integration', () => {
  it('sollte vollständige BWA-Daten aus DATEV-Format extrahieren', () => {
    const result = extractBWADataFromText(DATEV_SUSA_SAMPLE);
    
    // Umsatz
    expect(result.revenue).toBe(EXPECTED_BWA_DATA_DATEV.revenue);
    
    // Kosten
    expect(result.costs).toBe(EXPECTED_BWA_DATA_DATEV.costs);
    
    // Gewinn
    expect(result.profit).toBe(EXPECTED_BWA_DATA_DATEV.profit);
    
    // Marge (mit Toleranz wegen Rundung)
    expect(result.margin).toBeCloseTo(EXPECTED_BWA_DATA_DATEV.margin, 1);
  });

  it('sollte Kosten-Breakdown inkludieren', () => {
    const result = extractBWADataFromText(DATEV_SUSA_SAMPLE);
    
    expect(result.costBreakdown).toBeDefined();
    expect(result.costBreakdown.personal).toBeDefined();
    expect(result.costBreakdown.personal.total).toBeGreaterThan(0);
  });

  it('sollte Lexoffice-Format verarbeiten', () => {
    const result = extractBWADataFromText(LEXOFFICE_SAMPLE);
    
    expect(result.revenue).toBe(95500);
    expect(result.costs).toBeGreaterThan(0);
    expect(result.profit).toBeGreaterThan(0);
  });

  it('sollte negative Margen korrekt berechnen', () => {
    const lossScenario = `
4120 Gehälter 80.000,00
8400 Erlöse 50.000,00
    `;
    
    const result = extractBWADataFromText(lossScenario);
    
    expect(result.revenue).toBe(50000);
    expect(result.costs).toBe(80000);
    expect(result.profit).toBe(-30000);
    expect(result.margin).toBeLessThan(0);
  });

  it('sollte bei fehlenden Erlösen Marge 0 zurückgeben', () => {
    const noCostsScenario = `
4120 Gehälter 50.000,00
    `;
    
    const result = extractBWADataFromText(noCostsScenario);
    
    expect(result.revenue).toBe(0);
    expect(result.margin).toBe(0);
  });

  it('sollte Gesamtkosten korrekt summieren', () => {
    const result = extractBWADataFromText(DATEV_SUSA_SAMPLE);
    
    // Manuelle Summe aller Kategorien
    const manualSum = 
      result.costBreakdown.personal.total +
      result.costBreakdown.raum.total +
      result.costBreakdown.kfz.total +
      result.costBreakdown.marketing.total +
      result.costBreakdown.versicherungen.total +
      result.costBreakdown.büro.total +
      result.costBreakdown.fremdleistung.total +
      result.costBreakdown.sonstige.total;
    
    expect(result.costs).toBe(manualSum);
  });
});
