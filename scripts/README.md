# Logging Scripts

This folder contains scripts for processing and analyzing user interaction logs.

## Available Scripts

### 1. Process Logs (`processLogs.js`)

Fetches logs from Firebase and generates human-readable reports.

**Usage:**
```bash
# Process specific session
npm run process-logs SESSION_ID

# Process all sessions
npm run process-logs
```

**Output:** Creates reports in `logs/reports/` directory with `.json`, `.csv`, and `.txt` formats.

### 2. Example Translation (`exampleTranslation.js`)

Demonstrates how the click translation system works with sample data.

**Usage:**
```bash
npm run example-translation
```

**Output:** Displays examples in the console showing how raw clicks are translated.

## Quick Start

1. **See Examples:**
   ```bash
   npm run example-translation
   ```

2. **Process Your Logs:**
   ```bash
   npm run process-logs your-session-id
   ```

3. **View in Browser:**
   Use the `LogViewer` component in the app for a visual interface.

## Output Formats

### Text Report
Human-readable format showing click sequence with descriptions.

### CSV Report
Spreadsheet format that can be opened in Excel, Google Sheets, etc.

### JSON Report
Full structured data for programmatic analysis.

## Documentation

See [CLICK_LOG_TRANSLATION.md](../docs/CLICK_LOG_TRANSLATION.md) for complete documentation.
