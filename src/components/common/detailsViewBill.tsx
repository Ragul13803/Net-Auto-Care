import { useLocation } from 'react-router-dom';
import { Box, Typography, Divider, List, ListItem, ListItemText, CircularProgress, Paper } from '@mui/material';
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
    <>
    <Paper sx={{ p: 2 , m: 2, width: '900px'}}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>Bill Details</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between'}}>
        <Box sx={{ textAlign: 'left' }}>
          <Typography variant='h6'><strong>Customer Name:</strong> {bill.customer_name}</Typography>
          <Typography variant='h6'><strong>Mobile:</strong> {bill.mobile}</Typography>
          <Typography variant='h6'><strong>Vehicle Name:</strong> {bill.vehicle_name}</Typography>
          <Typography variant='h6'><strong>Vehicle Number:</strong>{bill.vehicle_number}</Typography>
        </Box>

        <Box sx={{ textAlign: 'right' }}>
          <Typography variant='h6'><strong>Bill No:</strong> {bill.BillNo}</Typography>
          <Typography variant='h6'><strong>Bill Date:</strong> {new Date(bill.bill_date).toLocaleDateString()}</Typography>
          <Typography variant='h6'><strong>Status:</strong> {bill.bill_status === 'U' ? 'Unpaid' : 'Completed'}</Typography>
          <Typography variant='h6'><strong>Total Payable:</strong> ₹{bill.TotalPayable}</Typography>
          <Typography variant='h6'><strong>Amount Paid:</strong> ₹{bill.AmountPaid}</Typography>
        </Box>
      </Box>
      <Divider sx={{ my: 2 }} />

      <Typography variant="h5" sx={{ mb: 1 }}>Spare Items</Typography>
      <List>
        {bill.spare_items?.length > 0 ? (
          bill.spare_items.map((item: any) => (
            <ListItem key={item.ID} sx={{ px: 0 }}>
              <ListItemText
                primary={item.spare_item}
                secondary={`Quantity: ${item.quantity}, Amount: ₹${item.amount}`}
              />
            </ListItem>
          ))
        ) : (
          <Typography>No spare items found.</Typography>
        )}
      </List>

      {/* Optional: Transactions section */}
      {bill.transactions?.length > 0 && (
        <>
          <Divider sx={{ my: 3 }} />
          <Typography variant="h6" sx={{ mb: 1 }}>Transactions</Typography>
          <List>
            {bill.transactions.map((txn: any, idx: number) => (
              <ListItem key={idx} sx={{ px: 0 }}>
                <ListItemText
                  primary={`Amount: ₹${txn.AmountPaid}`}
                  secondary={`Date: ${txn.TransactionDate}`}
                />
              </ListItem>
            ))}
          </List>
        </>
      )}
    </Paper>
    </>
  );
};

export default DetailsViewBill;