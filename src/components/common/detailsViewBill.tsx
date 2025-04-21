import { useLocation } from 'react-router-dom';
import { Box, Typography, Divider, CircularProgress, Paper } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';

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

      const response = await axios.get(`/getBillById/${id}`, {
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
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: 'center', height: "100vh", width: "100vw" }}>
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
    <Paper sx={{ p: 3, m: 2, width: '100%', maxWidth: '900px', mx: 'auto', boxShadow: 4 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>Bill Details</Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ minWidth: '40%' }}>
          <Typography><strong>Customer Name:</strong> {bill.customer_name}</Typography>
          <Typography><strong>Mobile:</strong> {bill.mobile}</Typography>
          <Typography><strong>Vehicle Name:</strong> {bill.vehicle_name}</Typography>
          <Typography><strong>Vehicle Number:</strong> {bill.vehicle_number}</Typography>
        </Box>

        <Box sx={{ minWidth: '40%', textAlign: { xs: 'left', sm: 'right' } }}>
          <Typography><strong>Bill No:</strong> {bill.BillNo}</Typography>
          <Typography><strong>Bill Date:</strong> {new Date(bill.bill_date).toLocaleDateString()}</Typography>
          <Typography><strong>Status:</strong> {bill.bill_status === 'U' ? 'Unpaid' : 'Completed'}</Typography>
          <Typography><strong>Total Payable:</strong> ₹{bill.TotalPayable}</Typography>
          <Typography><strong>Amount Paid:</strong> ₹{bill.AmountPaid}</Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" sx={{ mb: 1 }}>Spare Items</Typography>
      {bill.spare_items?.length > 0 ? (
        <Box sx={{ pl: 1 }}>
          {bill.spare_items.map((item: any, index: number) => (
            <Typography key={item.ID || index} sx={{ mb: 0.5 }}>
              • <strong>{item.spare_item}</strong>
               — Quantity: {item.quantity}, Amount: ₹{item.amount}
            </Typography>
          ))}
        </Box>
      ) : (
        <Typography>No spare items found.</Typography>
      )}

      {bill.transactions?.length > 0 && (
        <>
          <Divider sx={{ my: 3 }} />
          <Typography variant="h6" sx={{ mb: 1 }}>Transactions</Typography>
          <Box sx={{ pl: 1 }}>
            {bill.transactions.map((txn: any, index: number) => (
              <Typography key={index} sx={{ mb: 0.5 }}>
                • <strong>₹{txn.AmountPaid}</strong> on {new Date(txn.TransactionDate).toLocaleDateString()}
              </Typography>
            ))}
          </Box>
        </>
      )}
    </Paper>
  );
};

export default DetailsViewBill;
