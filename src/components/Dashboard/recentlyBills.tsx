import { Card, CardContent, Typography, Grid, Box, CircularProgress } from '@mui/material';
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';


export const RecentlBills = () => {
  const [addedBills, setAddedBills] = useState<any[]>([]); // Ensure initial state is an empty array
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const token = sessionStorage.getItem("access_token");

  const RecentlyAddedBills = async () => {
    try {
      if (!token) {
        setError("No access token found. Please log in.");
        return;
      }

      const response = await api.get("/getRecentlyaddedBills", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const addedBills = response.data?.recently_added_bills || [];
      setAddedBills(addedBills);
    } catch (err: any) {
      setError(err.message || "Failed to fetch bills");
    } finally {
      setLoading(false);
    }
  };

  // const RecentlyPaidBills = async () => {
  //   try {
  //     if (!token) {
  //       setError("No access token found. Please log in.");
  //       return;
  //     }

  //     const response = await api.get("/getRecentlyPaidBills", {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     const paidBills = response.data?.recently_added_bills || [];
  //     console.log('RecentlyPaidBills', response);

  //     setPaidBills(paidBills);
  //   } catch (err: any) {
  //     setError(err.message || "Failed to fetch bills");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  

  const handleClick = (id: any) => {
    console.log('card clicked', id);
    navigate(`/dashboard/recent-detail?id=${id}`);
  };
  

    useEffect(() => {
      RecentlyAddedBills();
      // RecentlyPaidBills();
    }, []);
  
    if (loading) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: 'center', width: '76vw', mt:"60px" }}>
          <CircularProgress size={30} sx={{ color: "#60B5FF", mr: "10px" }} />
          <Typography variant="h5">Loading...</Typography>
        </Box>
      );
    }
  
    if (error) {
      return <h1>Error: {error}</h1>;
    }
  
    if (!Array.isArray(addedBills)) {
      return <h1>Data is not in the expected format</h1>;
    }
  

  
  return (
    <Box sx={{ }}>
      {/* <h1>Recent Added Bills</h1> */}
      {addedBills.length === 0 ? (
        <Typography>No Recently Added bills found.</Typography>
      ) : (
      <Grid container spacing={2}>
        {addedBills.map((bill) => (
         <Card onClick={() => handleClick(bill.ID)} key={bill.ID}
         sx={{
           borderRadius: '12px',
           boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
           '&:hover': {
             boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
           },
           bgcolor: '#60B5FF',
           width: '220px',
           transition: 'box-shadow 0.3s ease-in-out',
           cursor: 'pointer',
         }}
       >
         <CardContent
           sx={{
             p: '10px !important',
             '&:last-child': {
               pb: '10px !important',
             },
           }}
         >
           <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', }}>
             {/* Left Section - Customer Name & Bill Date/Number */}
             <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
               <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333', textAlign: 'left', }}>{bill.customer_name}</Typography>
               <Typography variant="body1" color="textPrimary" sx={{ fontSize: '16px', display: 'flex', alignItems: 'center', margin: '4px 0', }}>
                 <CalendarTodayRoundedIcon sx={{ fontSize: '16px', marginRight: '2px' }} />
                 {new Date(bill.bill_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', })}
               </Typography>
               <Typography variant="body1" color="textPrimary" sx={{ fontSize: '16px', display: 'flex', alignItems: 'center', }}>
                 <AccountBalanceWalletRoundedIcon sx={{ fontSize: '16px', marginRight: '2px' }} />
                 {bill.BillNo}
               </Typography>
             </Box>
               
             {/* Right Section - Payment and Paid Status */}
             <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
              <Typography variant="h6" color="textPrimary" sx={{ fontWeight: 'bold', fontSize: '22px',  }}>{bill.BillNo}</Typography>
               <Typography variant="h6" color="textPrimary" sx={{ fontWeight: 'bold', fontSize: '20px', color: '#333', mt:"20px" }}>₹{bill.TotalPayable}</Typography>
             </Box>
           </Box>
         </CardContent>
       </Card>
      ))}
    </Grid>
    )}
    </Box>
  );
};