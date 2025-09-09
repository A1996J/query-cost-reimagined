export const getPrintStyles = () => `
  /* Page setup for landscape A4 */
  @page { 
    size: A4 landscape; 
    margin: 10mm; 
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    height: auto !important;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 12px;
    line-height: 1.4;
    color: #1f2937;
    background: white;
    -webkit-print-color-adjust: exact;
    color-adjust: exact;
  }

  .print-report {
    width: 100%;
    max-width: none;
  }

  .pdf-page {
    width: 297mm;
    min-height: 210mm;
    padding: 15mm;
    margin: 0 auto;
    background: white;
    page-break-after: always;
    break-after: page;
    position: relative;
    display: flex;
    flex-direction: column;
  }

  .pdf-page:last-child {
    page-break-after: avoid;
    break-after: avoid;
  }

  .pdf-page:after {
    content: "";
    display: block;
    height: 0;
  }

  .avoid-break,
  .card, 
  .chart-container, 
  .insight-banner,
  .table-wrapper {
    break-inside: avoid;
    page-break-inside: avoid;
  }

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 2px solid #6ab04c;
    flex-shrink: 0;
  }

  .logo-section {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .logo {
    height: 40px;
    width: auto;
  }

  .header-text h1 {
    font-size: 24px;
    font-weight: 700;
    color: #1f2937;
    margin: 0;
  }

  .subtitle {
    font-size: 14px;
    color: #6b7280;
    margin: 4px 0 0 0;
  }

  .date {
    font-size: 12px;
    color: #6b7280;
  }

  .insight-banner {
    display: flex !important;
    align-items: center;
    gap: 12px;
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 20px;
    font-size: 13px;
    line-height: 1.5;
    flex-shrink: 0;
  }

  .insight-banner svg {
    flex-shrink: 0;
    width: 18px;
    height: 18px;
  }

  /* Card styles */
  .bg-card {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
  }

  .shadow-soft {
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  }

  /* Table styles */
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 10px 0;
    font-size: 11px;
  }

  thead {
    display: table-header-group;
  }

  tfoot {
    display: table-footer-group;
  }

  th, td {
    padding: 8px 10px;
    text-align: left;
    border-bottom: 1px solid #e5e7eb;
    break-inside: avoid;
    page-break-inside: avoid;
  }

  tr {
    break-inside: avoid;
    page-break-inside: avoid;
  }

  th {
    background: #f9fafb;
    font-weight: 600;
    color: #374151;
  }

  tr:nth-child(even) {
    background: #f9fafb;
  }

  /* Chart containers */
  .chart-container {
    margin: 15px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  /* Executive summary table tighter spacing */
  .exec-summary td, 
  .exec-summary th {
    padding: 6px 8px;
    font-size: 10px;
    line-height: 1.3;
  }

  /* Hide elements that shouldn't print */
  button, 
  .no-print,
  #__next-route-announcer__, 
  .toast, 
  .vite-error-overlay, 
  .devtools-overlay {
    display: none !important;
    visibility: hidden !important;
  }

  /* EMA color scheme */
  .text-finance-primary {
    color: #6ab04c !important;
  }

  .bg-finance-primary {
    background-color: #6ab04c !important;
  }

  .border-finance-primary {
    border-color: #6ab04c !important;
  }

  /* Print media query overrides */
  @media print {
    html, body {
      height: auto !important;
    }
    
    .pdf-page {
      margin: 0;
      page-break-after: always;
      break-after: page;
    }
    
    .pdf-page:last-child {
      page-break-after: avoid;
      break-after: avoid;
    }
    
    .avoid-break,
    .card, 
    .chart-container, 
    .insight-banner,
    .table-wrapper {
      break-inside: avoid;
      page-break-inside: avoid;
    }
    
    thead {
      display: table-header-group;
    }
    
    tfoot {
      display: table-footer-group;
    }
    
    tr, td, th {
      break-inside: avoid;
      page-break-inside: avoid;
    }
  }
`;