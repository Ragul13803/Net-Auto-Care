import { useLocation } from 'react-router-dom';
import { Box, Typography, Divider, CircularProgress, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
// import axios from 'axios';
import { useEffect, useState } from 'react';
import api from '../api';

const DetailsViewBill = () => {
  const [bill, setBill] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const query = new URLSearchParams(useLocation().search);
  const billId = query.get('id');
  const token = sessionStorage.getItem("access_token");

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
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%', m: 2}}>
    <Card sx={{ p: 2, boxShadow: 4, borderRadius: '10px' }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>Bill Details</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '760px' }}>
        <Box sx={{ minWidth: '40%', textAlign: { xs: 'left', sm: 'left' } }}>
          <Typography><strong>Customer Name:</strong> {bill.customer_name}</Typography>
          <Typography><strong>Mobile:</strong> {bill.mobile}</Typography>
          <Typography><strong>Vehicle Name:</strong> {bill.vehicle_name}</Typography>
          <Typography><strong>Vehicle Number:</strong> {bill.vehicle_number}</Typography>
        </Box>
        <Box sx={{ minWidth: '40%', textAlign: { xs: 'left', sm: 'left' } }}>
          <Typography><strong>Bill No:</strong> {bill.BillNo}</Typography>
          <Typography><strong>Bill Date:</strong> {new Date(bill.bill_date).toLocaleDateString()}</Typography>
          {/* <Typography><strong>Status:</strong> {bill.bill_status === 'U' ? 'Unpaid' : 'Completed'}</Typography> */}
          <Typography><strong>Total Payable:</strong> ₹{bill.TotalPayable}</Typography>
          <Typography><strong>Amount Paid:</strong> ₹{bill.AmountPaid}</Typography>
        </Box>
      </Box>
      </Card>
      <Divider sx={{ my: 3, }} />
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
                   <TableCell sx={{ textAlign: 'center', borderRight: '1px solid #ccc', borderBottom: index === bill.transactions.length - 1 ? 'none' : '1px solid #ccc',}}>{txn.ModeOfPayment}</TableCell>
                   <TableCell sx={{ textAlign: 'center', borderBottom: index === bill.transactions.length - 1 ? 'none' : '1px solid #ccc',}}>{new Date(txn.TransactionDate).toLocaleDateString()}</TableCell>
                 </TableRow>
               ))}
             </TableBody>
           </Table>
         </TableContainer>
       </>
     )}
    </Box>
  );
};

export default DetailsViewBill;