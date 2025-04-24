import { useLocation } from 'react-router-dom';
import { Box, Typography, Divider, CircularProgress, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Paper } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import { useEffect, useRef, useState } from 'react';
import api from '../api';

const DetailsViewBill = () => {
  const [bill, setBill] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const query = new URLSearchParams(useLocation().search);
  const billId = query.get('id');
  const token = sessionStorage.getItem("access_token");
  const printRef = useRef<HTMLDivElement>(null);

  const getBillById = async (id: string | null) => {
    try {
      if (!token) {
        setError("No access token found. Please log in.");
        return;
      }

      const response = await api.get(`/getBillById/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const billData = response.data?.bill?.[0];

      if (billData) {
        setBill(billData);
      } else {
        setError("No bill found.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch bill");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
  if (!printRef.current || !bill) return;
  
    const printWindow = window.open('', '', 'width=800,height=600');
    if (!printWindow) return;
  
    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>${bill.customer_name}-${bill.BillNo}</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 20mm 10mm 20mm 10mm;
          }
    
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            min-height: 100vh;
            position: relative;
          }
    
          .print-content {
            flex: 1;
            padding: 10px;
            box-sizing: border-box;
            position: relative;
          }
    
          .company-info {
            text-align: center;
            margin-bottom: 20px;
          }
    
          .company-info h4,
          .company-info h6 {
            margin: 4px 0;
          }
    
          .details-box-wrapper {
            display: flex;
            justify-content: space-between;
            margin-top: 80px;
            margin-bottom: 20px;
          }
    
          .details-box h6 {
            margin: 6px 0;
          }
    
          .table-container {
            border: 1px solid #ccc;
            border-radius: 10px;
            overflow: hidden;
            margin-bottom: 30px;
            background: white;
          }
    
          table {
            width: 100%;
            border-spacing: 0;
            border-collapse: separate;
            border-radius: 10px;
          }
    
          thead th {
            background-color: #F0F0F0;
            font-weight: bold;
            padding: 8px;
            font-size: 12px;
            border-bottom: 1px solid #ccc;
          }
    
          thead th:first-child {
            border-top-left-radius: 10px;
          }
    
          thead th:last-child {
            border-top-right-radius: 10px;
          }
    
          thead th:nth-child(1),
          tbody td:nth-child(1) {
            text-align: center;
            border-right: 1px solid #ccc;
          }
    
          thead th:nth-child(2),
          tbody td:nth-child(2) {
            text-align: left;
            border-right: 1px solid #ccc;
          }
    
          thead th:nth-child(3),
          tbody td:nth-child(3) {
            text-align: center;
            border-right: 1px solid #ccc;
          }
    
          thead th:nth-child(4),
          tbody td:nth-child(4) {
            text-align: center;
          }
    
          tbody td {
            padding: 8px;
            font-size: 12px;
            border-bottom: 1px solid #ccc;
          }
    
          tbody tr:last-child td {
            border-bottom: none;
          }
    
          .total-row {
            font-weight: bold;
            text-align: center;
          }
    
          .disclaimer-wrapper {
            // position: absolute;
            // bottom: 20px;
            // right: 10px;
            text-align: right;
            width: calc(100% - 20px);
          }
    
          .disclaimer {
            font-size: 12px;
            color: black;
          }
    
          .red-star {
            color: red;
            font-size: 16px;
            font-weight: bold;
            margin-right: 2px;
          }
        </style>
      </head>
      <body>
        <div class="print-content">
          <!-- Company Info -->
          <div class="company-info">
            <h2>Net Auto Care</h2>
            <h4>No: 54, Dummy Street, Muthialpet, Pondicherry - 605 010</h4>
          </div>
    
          <!-- Customer & Bill Info -->
          <div class="details-box-wrapper">
            <div class="details-box">
              <h6><strong>Customer Name:</strong> ${bill.customer_name}</h6>
              <h6><strong>Vehicle Number:</strong> ${bill.vehicle_number}</h6>
              <h6><strong>Mobile:</strong> ${bill.mobile}</h6>
            </div>
            <div class="details-box">
              <h6><strong>Bill No:</strong> ${bill.BillNo}</h6>
              <h6><strong>Date:</strong> ${new Date().toLocaleDateString()}</h6>
              <h6><strong>Time:</strong> ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase()}</h6>
            </div>
          </div>
    
          <!-- Table -->
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                ${bill.spare_items.map((item: any, index: any) => `
                  <tr>
                    <td>${index + 1}</td>
                    <td>${item.spare_item}</td>
                    <td>x ${item.quantity}</td>
                    <td>₹${item.amount}</td>
                  </tr>
                `).join('')}
              <tr>
                <td colspan="3" style="text-align: right; font-weight: bold;">
                  Total Amount: 
                </td>
                <td style="text-align: center; font-weight: bold;">
                  ₹${bill.TotalPayable}
                </td>              
              </tr>
              </tbody>
            </table>
          </div>
    
          <!-- Disclaimer -->
          <div class="disclaimer-wrapper">
            <div class="disclaimer">
              <span class="red-star">*</span>This is a system generated bill for reference only and does not require any signature for verification
            </div>
          </div>
        </div>
    
        <script>
          setTimeout(() => {
            window.print();
            window.close();
          }, 300);
        </script>
      </body>
      </html>
    `);
  
    printWindow.document.close();
  };
  
  
  useEffect(() => {
    if (billId) {
      getBillById(billId);
    } else {
      setLoading(false);
      setError("Invalid bill ID");
    }
  }, [billId]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: 'center', width: '76vw', mt:"60px" }}>
        <CircularProgress size={30} sx={{ color: "#3F7D58", mr: "10px" }} />
        <Typography variant="h6">Loading...</Typography>
      </Box>
    );
  }

  if (error || !bill) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h6" color="error">Error</Typography>
        <Typography>{error || "No bill found with the given ID."}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '80vw', m: 2}}>
    
    <div ref={printRef} >
      <Card sx={{ p: 2, boxShadow: 4, borderRadius: '10px', width: '78vw' }}>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>Bill Details</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Box sx={{ textAlign: { xs: 'left', sm: 'left' } }}>
            <Typography variant='h6' margin={'6px 0'}><strong>Customer Name:</strong> {bill.customer_name}</Typography>
            <Typography variant='h6'><strong>Mobile:</strong> {bill.mobile}</Typography>
          </Box>
          <Box sx={{ textAlign: { xs: 'left', sm: 'left' } }}>
            <Typography variant='h6' margin={'6px 0'}><strong>Vehicle Name:</strong> {bill.vehicle_name}</Typography>
            <Typography variant='h6'><strong>Vehicle Number:</strong> {bill.vehicle_number}</Typography>
          </Box>
  
          <Box sx={{ textAlign: { xs: 'left', sm: 'left' } }}>
            <Typography variant='h6' margin={'6px 0'}><strong>Total Payable:</strong> ₹{bill.TotalPayable}</Typography>
            <Typography variant='h6'><strong>Amount Paid:</strong> ₹{bill.AmountPaid}</Typography>
          </Box>
          <Box sx={{ textAlign: { xs: 'left', sm: 'left' } }}>
            <Typography variant='h6' margin={'6px 0'}><strong>Bill No:</strong> {bill.BillNo}</Typography>
            <Typography variant='h6'><strong>Bill Date:</strong> {new Date(bill.bill_date).toLocaleDateString()}</Typography>
          </Box>
        </Box>
      </Card>
    </div>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" startIcon={<PrintIcon />} onClick={handlePrint}
          sx={{
            textTransform: 'none',
            bgcolor: '#5744E3',
            boxShadow: 'none',
            '&:focus': { outline: 'none', boxShadow: 'none' },
            '&:hover': { backgroundColor: '#4534C8', boxShadow: 'none' },
            mt: '10px',
            borderRadius: '8px'
          }}
        >
          Print Bill
        </Button>
      </Box>      
      <Divider sx={{ my: '10px', }} />
      <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>Spare Items</Typography>
      {bill.spare_items?.length > 0 ? (
        <Box sx={{ pl: 1 }}>
          <TableContainer sx={{ border: '1px solid #ccc', borderRadius: '10px'}}>
            <Table sx={{ minWidth: 650 }} aria-label="spare items table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', borderRight: '1px solid #ccc'}}>S.No</TableCell>
                  <TableCell sx={{ textAlign: 'left', fontWeight: 'bold', borderRight: '1px solid #ccc'}}>Item Name</TableCell>
                  <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', borderRight: '1px solid #ccc'}}>Quantity</TableCell>
                  <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', }}>Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bill.spare_items.map((item: any, index: number) => (
                  <TableRow key={item.ID || index}>
                    <TableCell sx={{ textAlign: 'center', borderRight: '1px solid #ccc', borderBottom: index === bill.spare_items.length - 1 ? 'none' : '1px solid #ccc',}}>{index + 1}</TableCell>
                    <TableCell sx={{ textAlign: 'left', borderRight: '1px solid #ccc', borderBottom: index === bill.spare_items.length - 1 ? 'none' : '1px solid #ccc',}}>{item.spare_item}</TableCell>
                    <TableCell sx={{ textAlign: 'center', borderRight: '1px solid #ccc', borderBottom: index === bill.spare_items.length - 1 ? 'none' : '1px solid #ccc',}}>{item.quantity}</TableCell>
                    <TableCell sx={{ textAlign: 'center', borderBottom: index === bill.spare_items.length - 1 ? 'none' : '1px solid #ccc',}}>₹{item.amount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      ) : (
        <Typography>No spare items found.</Typography>
      )}

     {bill.transactions?.length > 0 && (
       <>
         <Divider sx={{ my: 3 }} />
         <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
           Transaction Details
         </Typography>
         <TableContainer sx={{ border: '1px solid #ccc', borderRadius: '10px', mb: 2 }}>
           <Table sx={{ minWidth: 650 }} aria-label="transaction details table">
             <TableHead>
               <TableRow>
                 <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', borderRight: '1px solid #ccc',  }}>S.No</TableCell>
                 <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', borderRight: '1px solid #ccc',  }}>Amount Paid</TableCell>
                 <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', borderRight: '1px solid #ccc',  }}>Mode of Payment</TableCell>
                 <TableCell sx={{ textAlign: 'center', fontWeight: 'bold',  }}>Transaction Date</TableCell>
               </TableRow>
             </TableHead>
             <TableBody>
               {bill.transactions.map((txn: any, index: number) => (
                 <TableRow key={txn.ID || index}>
                   <TableCell sx={{ textAlign: 'center', borderRight: '1px solid #ccc', borderBottom: index === bill.transactions.length - 1 ? 'none' : '1px solid #ccc',}}>{index + 1}</TableCell>
                   <TableCell sx={{ textAlign: 'center', borderRight: '1px solid #ccc', borderBottom: index === bill.transactions.length - 1 ? 'none' : '1px solid #ccc',}}>₹{txn.AmountPaid}</TableCell>
                   <TableCell sx={{ textAlign: 'center', borderRight: '1px solid #ccc', borderBottom: index === bill.transactions.length - 1 ? 'none' : '1px solid #ccc',}}>{txn.ModeOfPayment === '' ? '-' : txn.ModeOfPayment}</TableCell>
                   <TableCell sx={{ textAlign: 'center', borderBottom: index === bill.transactions.length - 1 ? 'none' : '1px solid #ccc',}}>{new Date(txn.TransactionDate).toLocaleDateString()}</TableCell>
                 </TableRow>
               ))}
             </TableBody>
           </Table>
         </TableContainer>
       </>
     )}
     
     {/* <Paper sx={{ padding: 2 }}>
      <Box>
        <Typography variant='h4'>Net Auto Care</Typography>
        <Typography variant='h6'>No: 54, Dummy Street, Muthialpet, Pondicherry - 605 010</Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
        <Box sx={{ textAlign: { xs: 'left', sm: 'left' } }}>
          <Typography variant='h6'><strong>Customer Name:</strong> {bill.customer_name}</Typography>
          <Typography variant='h6'><strong>Vehicle Number:</strong> {bill.vehicle_number}</Typography>
          <Typography variant='h6'><strong>Mobile:</strong> {bill.mobile}</Typography>
        </Box>
        <Box sx={{ textAlign: { xs: 'left', sm: 'left' } }}>
          <Typography variant='h6'><strong>Bill No:</strong> {bill.BillNo}</Typography>
          <Typography variant='h6'><strong>Date:</strong> {new Date().toLocaleDateString()}</Typography>
          <Typography variant='h6'><strong>Time:</strong> {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase()}</Typography>
        </Box>
      </Box>
      <TableContainer sx={{ border: '1px solid #ccc', borderRadius: '10px', mb: 2 }}>
        <Table sx={{ minWidth: 650 }} aria-label="spare items table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', borderRight: '1px solid #ccc', bgcolor: '#F0F0F0' }}>S.No</TableCell>
              <TableCell sx={{ textAlign: 'left', fontWeight: 'bold', borderRight: '1px solid #ccc', bgcolor: '#F0F0F0' }}>Item</TableCell>
              <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', borderRight: '1px solid #ccc', bgcolor: '#F0F0F0' }}>Quantity</TableCell>
              <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', bgcolor: '#F0F0F0' }}>Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bill.spare_items.map((item: any, index: number) => (
              <TableRow key={item.ID || index}>
                <TableCell sx={{ textAlign: 'center', borderRight: '1px solid #ccc', borderBottom: index === bill.spare_items.length - 1 ? 'none' : '1px solid #ccc' }}>{index + 1}</TableCell>
                <TableCell sx={{ textAlign: 'left', borderRight: '1px solid #ccc', borderBottom: index === bill.spare_items.length - 1 ? 'none' : '1px solid #ccc' }}>{item.spare_item}</TableCell>
                <TableCell sx={{ textAlign: 'center', borderRight: '1px solid #ccc', borderBottom: index === bill.spare_items.length - 1 ? 'none' : '1px solid #ccc' }}>x {item.quantity}</TableCell>
                <TableCell sx={{ textAlign: 'center', borderBottom: index === bill.spare_items.length - 1 ? 'none' : '1px solid #ccc' }}>₹{item.amount}</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={4} sx={{ borderTop: '1px solid #ccc' }}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Typography variant="body1">
                    <strong>Total Amount:</strong> ₹{bill.TotalPayable}
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Typography variant="body2" gutterBottom>
          <span style={{ fontWeight: 'bold', color: 'red', marginRight:'2px', fontSize: '18px' }}>*</span>
          This is a system generated bill for reference only and does not require any signature for verification
        </Typography>
      </Box> */}

      {/* <Typography variant="body2" display="block" align="center" sx={{ mt: 4 }}> */}
        {/* © 2025 Net Auto Care. All rights reserved. */}
      {/* </Typography> */}
    {/* </Paper> */}

    </Box>
  );
};

export default DetailsViewBill;