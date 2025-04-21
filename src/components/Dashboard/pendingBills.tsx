import { useEffect, useState } from "react";
import axios from "axios";
import { Box, Card, CardContent, Typography, Grid, CircularProgress, } from "@mui/material";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import { useNavigate } from "react-router-dom";

const PendingBills = () => {
  const [bills, setBills] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const token = sessionStorage.getItem("access_token");

  const fetchPendingBills = async () => {
    try {
      if (!token) {
        setError("No access token found. Please log in.");
        return;
      }

      const response = await axios.get("/getBillsByStatus/Pending", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const pendingBills = response.data?.Pending_bills || [];
      setBills(pendingBills);
    } catch (err: any) {
      setError(err.message || "Failed to fetch bills");
    } finally {
      setLoading(false);
    }
  };

  const handleClick = (id: any) => {
    console.log('card clicked', id);
    navigate(`/dashboard/pending-detail?id=${id}`);
  };

  useEffect(() => {
    fetchPendingBills();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: 'center', height: "100vh", width: "100vw",}}>
        <CircularProgress size={30} sx={{ color: "#EF9651", mr: "10px" }} />
        <Typography variant="h5">Loading...</Typography>
      </Box>
    );
  }

  if (error) {
    return <h1>Error: {error}</h1>;
  }

  if (!Array.isArray(bills)) {
    return <h1>Data is not in the expected format</h1>;
  }

  return (
    <Box sx={{ height: "100vh", width: '100vw'}}>
      {bills.length === 0 ? (
        <Typography>No pending bills found.</Typography>
      ) : (
        <Grid container spacing={2}>
          {bills.map((bill: any) => (
            // <Grid item xs={12} sm={6} md={4} key={bill.ID}>
              <Card onClick={() => handleClick(bill.ID)} key={bill.ID}
                sx={{
                  borderRadius: "12px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  "&:hover": {
                    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
                  },
                  bgcolor: "#EF9651",
                  width: "220px",
                  transition: "box-shadow 0.3s ease-in-out",
                  cursor: 'pointer',
                }}
              >
                <CardContent
                  sx={{
                    p: "12px !important",
                    "&:last-child": {
                      pb: "12px !important",
                    },
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    {/* Left - Customer Name, Date, BillNo */}
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      <Typography variant="h5" sx={{ fontWeight: "bold", color: "#333", textAlign: "left" }}>
                        {bill.customer_name}
                      </Typography>
                      <Typography variant="body1" sx={{ fontSize: "16px", display: "flex", alignItems: "center", margin: "4px 0", }}>
                        <CalendarTodayRoundedIcon sx={{ fontSize: "16px", mr: "2px" }} />
                        {new Date(bill.bill_date).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </Typography>
                      <Typography variant="body1" sx={{ fontSize: "16px", display: "flex", alignItems: "center" }}>
                        <AccountBalanceWalletRoundedIcon sx={{ fontSize: "16px", mr: "2px" }} />
                        {bill.BillNo}
                      </Typography>
                    </Box>

                    {/* Right - Total & Paid */}
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <Typography variant="h6" sx={{ fontWeight: "bold", fontSize: "20px", color: "#333" }}>
                        ₹{bill.TotalPayable}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          border: "4px solid #D9D9D9",
                          borderRadius: "50%",
                          width: "50px",
                          height: "50px",
                          justifyContent: "center",
                        }}
                      >
                        <Typography variant="body2" sx={{ fontWeight: "bold", fontSize: "14px", p: "4px 2px 0px 2px", }}>
                        ₹{bill.AmountPaid}
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: "14px" }}>
                          Paid
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            // </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default PendingBills;