import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

const TemplateA = () => {
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <div style={{ padding: '1rem' }}>
      {/* Print Button (hidden on print) */}
      <div style={{ marginBottom: '1rem' }} className="no-print">
        <button
          onClick={handlePrint}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#3b82f6', // Tailwind bg-blue-600
            color: 'white',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            border: 'none',
            transition: 'background-color 0.3s',
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2563eb'} // Tailwind hover:bg-blue-700
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
        >
          Print Invoice
        </button>
      </div>

      {/* Invoice Content */}
      <div
        ref={componentRef}
        style={{
          padding: '1rem',
          border: '1px solid #ddd',
          borderRadius: '0.375rem',
          backgroundColor: '#fff',
        }}
        className="print-container"
      >
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Invoice Preview</h2>
        <p>Customer: John Doe</p>
        <p>Phone: 9876543210</p>
        <p>Invoice #: INV-1001</p>
        <p>Date: 2025-04-21</p>
        <table style={{ width: '100%', marginTop: '1rem', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ padding: '0.5rem', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Item</th>
              <th style={{ padding: '0.5rem', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Qty</th>
              <th style={{ padding: '0.5rem', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Unit Price</th>
              <th style={{ padding: '0.5rem', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '0.5rem', borderBottom: '1px solid #ddd' }}>Pastry</td>
              <td style={{ padding: '0.5rem', borderBottom: '1px solid #ddd' }}>2</td>
              <td style={{ padding: '0.5rem', borderBottom: '1px solid #ddd' }}>₹50</td>
              <td style={{ padding: '0.5rem', borderBottom: '1px solid #ddd' }}>₹100</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Internal styles for printing */}
      <style>{`
        @media print {
          body {
            font-family: Arial, sans-serif;
          }

          /* Hide the print button during print */
          .no-print {
            display: none;
          }

          /* Adjust the print container */
          .print-container {
            width: 100%;
            padding: 20px;
            background-color: #fff;
            box-shadow: none;
          }

          /* Ensure table borders are clear and clean in the print version */
          table {
            border-collapse: collapse;
            width: 100%;
          }

          th, td {
            padding: 8px;
            text-align: left;
            border: 1px solid #ddd;
          }
        }
      `}</style>
    </div>
  );
};

export default TemplateA;
