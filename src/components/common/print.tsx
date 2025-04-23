import React, { useRef } from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import jsPDF from 'jspdf';  // Import jsPDF

const InvoiceComponent: React.FC = () => {
  const printRef = useRef<HTMLDivElement>(null);

  // Function to trigger print
  const handlePrint = () => {
    if (printRef.current) {
      const printWindow = window.open('', '_blank');
      printWindow?.document.write('<html><head><title>Invoice</title>');
      printWindow?.document.write('<style>@media print { .no-print { display: none; } }</style>'); // Hide non-print elements
      printWindow?.document.write('<style>body { font-family: Arial, sans-serif; }</style>'); // Add custom styles
      printWindow?.document.write('</head><body>');
      printWindow?.document.write(printRef.current.innerHTML);
      printWindow?.document.write('</body></html>');
      printWindow?.document.close();
      printWindow?.print();
    }
  };

  // Function to download as PDF using jsPDF
  const handleDownloadPDF = () => {
    if (printRef.current) {
      const doc = new jsPDF();
      doc.html(printRef.current, {
        callback: function (doc) {
          doc.save('invoice.pdf');
        },
        margin: [10, 10, 10, 10],
      });
    }
  };

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Invoice
      </Typography>
      
      {/* Invoice content */}
      <div ref={printRef}>
        <Paper sx={{ padding: '20px', border: '1px solid #ccc', marginBottom: '20px' }}>
          <Typography variant="h6">Invoice #12345</Typography>
          <Typography variant="body1" sx={{ marginBottom: '10px' }}>
            Date: 2025-04-23
          </Typography>

          <Typography variant="body1">
            <strong>Billed To:</strong> John Doe
            <br />
            Address: 1234 Elm Street, Cityville, State, 12345
          </Typography>

          <Box sx={{ marginTop: '20px' }}>
            <Typography variant="h6" sx={{ marginBottom: '10px' }}>
              Items:
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body1">Product 1</Typography>
              <Typography variant="body1">$100</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body1">Product 2</Typography>
              <Typography variant="body1">$50</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
              <Typography variant="h6">Total</Typography>
              <Typography variant="body1">$150</Typography>
            </Box>
          </Box>
        </Paper>
      </div>

      {/* Buttons to trigger print and download */}
      <Box sx={{ marginTop: '20px' }}>
        <Button variant="outlined" onClick={handlePrint} sx={{ marginRight: '10px' }}>
          Print Invoice
        </Button>
        <Button variant="outlined" onClick={handleDownloadPDF} sx={{ marginRight: '10px' }}>
          Download as PDF
        </Button>
      </Box>
    </Box>
  );
};

export default InvoiceComponent;
