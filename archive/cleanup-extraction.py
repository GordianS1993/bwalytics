#!/usr/bin/env python3
"""
Code Cleanup Script - Entfernt ALLE Fallback/Schätzungs-Code aus BWA-Extraktion
Nur echte PDF-Zahlen oder Demo-Daten - keine Verfälschungen!
"""

import re

# Lese die Datei
with open('bwa-upload-working.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Pattern: Alles zwischen "}" nach "break;" bis "// **VALIDIERUNG**"
# Das ist der gesamte Fallback-Block (Zeile 2888-2951)
pattern = r'(                // Stop wenn beide gefunden\s+if \(revenue > 0 && costs > 0\) \{\s+console\.log\([^)]+\);\s+break;\s+\}\s+\})\s+// \*\*FALLBACK:.*?(?=// \*\*VALIDIERUNG\*\*)'

replacement = r'\1\n            \n            // ✅ EXTRAKTION ABGESCHLOSSEN - Keine Schätzungen, nur echte PDF-Zahlen!\n            console.log(\'📊 Extraktion abgeschlossen. Revenue:\', revenue, \'€, Costs:\', costs, \'€\');\n            \n            // **VALIDIERUNG - Bei Fehler Demo-Daten verwenden**\n            '

# Replace mit DOTALL flag (. matched auch \n)
content_new = re.sub(pattern, replacement, content, flags=re.DOTALL)

# Prüfe ob was geändert wurde
if content != content_new:
    print(f"✅ Fallback-Code entfernt! ({len(content) - len(content_new)} Zeichen gelöscht)")
    
    # Schreibe zurück
    with open('bwa-upload-working.html', 'w', encoding='utf-8') as f:
        f.write(content_new)
    
    print("✅ Datei gespeichert: bwa-upload-working.html")
else:
    print("❌ Kein Match gefunden - Code bereits bereinigt oder Pattern nicht korrekt")
