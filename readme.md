# Workflow schvalování (SPA)

Tento repozitář obsahuje semestrální projekt, jehož cílem je návrh a implementace interaktivní webové aplikace podle architektonického vzoru Single-Page Application (SPA). Aplikace je vytvořena v čistém JavaScriptu (ES6+) a striktně odděluje stav, chování, projekce a infrastrukturu bez použití moderních UI frameworků (React, Vue atd.).

Aplikace řeší digitalizaci vnitrofiremních schvalovacích procesů.

## Tým a rozdělení odpovědností

Projekt je řešen týmově, přičemž každý člen nese individuální odpovědnost za konkrétní business entitu a infrastrukturní role (IR):

* **Jakub Kučera** (`kucerja3`)
  * **Business:** `Request` (Žádost)
  * **Infrastruktura:** IR01 (State Management), IR07 (Handlery)
* **Vojtěch Kubíček** (`kubicvo2`)
  * **Business:** `Comment` (Komentář)
  * **Infrastruktura:** IR05 (Selektory), IR06 (Renderovací logika)
* **Pavel Ondráček** (`ondrapa1`)
  * **Business:** `Approval` (Schválení)
  * **Infrastruktura:** IR02 (Dispatcher), IR03 (Asynchronní operace)
* **Matěj Wittich** (`wittima1`)
  * **Business:** `User` (Uživatel / Identita)
  * **Infrastruktura:** IR04 (Router), IR08 (Autentizace)

## Spuštění aplikace

Aplikace nevyžaduje žádný buildovací proces (bundler). Protože však využívá nativní ES6 moduly (`<script type="module">`), musí být spuštěna přes lokální webový server (nelze pouze otevřít `index.html` dvojklikem ve složce).

**Možnosti spuštění:**

1. **VS Code:** Nainstalujte si rozšíření *Live Server*, klikněte pravým tlačítkem na `index.html` a zvolte "Open with Live Server".
2. **Node.js (npx):** Otevřete terminál ve složce projektu a spusťte:
   ```bash
   npx serve .
