// src/components/leftMenuBar.js
import { useNavigate, useLocation } from "react-router-dom";
import { Box, Drawer, List, ListItem, ListItemText, IconButton, Typography, Divider, Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import NetAutoCare from "../assets/Net Auto Care.png";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import { useState } from "react";
// import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import api from "./api";

const drawerItems = [
  { text: "Dashboard", icon: <DashboardIcon />, route: "/dashboard" },
  { text: "Account", icon: <AccountBoxIcon />, route: "/account" },
  { text: "Logout", icon: <ExitToAppIcon />, route: "/login" },
];

const LeftMenuBar = () => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(true); // Sidebar state (expanded or minimized)
  const [logoutLoading, setLogoutLoading] = useState(false);
  const location = useLocation(); // Get current route
  const [DialogOpen, setDialogOpen] = useState(false);
  const token = sessionStorage.getItem("access_token");

  const drawerWidth = expanded ? 220 : 50;

  const handleToggleSidebar = () => {
    setExpanded(!expanded); // Toggle the sidebar's expanded state
  };

  const handleNavigation = (route: string) => {
    if (route === "/login") {
      setDialogOpen(true);
    } else {
      navigate(route);
    }
  };

  const handleLogoutConfirm = async () => {
    setLogoutLoading(true);
    try {
      if (!token) {
        alert("No access token found. Please log in.");
        return;
      }
  
      const response = await api.post('/logout', {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      sessionStorage.clear();
      toast.success(response.data.message);
    } catch (e: any) {
      alert(e.message || "Failed to log out");
    } finally {
      setLogoutLoading(false);
      setDialogOpen(false);
      navigate("/login");
    }
  };

  const handleLogoutCancel = () => {
    setDialogOpen(false);
  };

  // Check if the current path is under the /dashboard route
  const isDashboardActive = location.pathname.startsWith('/dashboard');

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <Drawer variant="persistent" anchor="left" open={true}
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: expanded ? "space-between" : "center",
              alignItems: "center",
            }}
          >
            {expanded && (
              <>
                <Box sx={{ padding: "4px", borderRadius: "50%" }}>
                  <img src={NetAutoCare} alt="logo" height={30} width={30} />
                </Box>
                <Typography variant="h6"
                  sx={{
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                >
                  Net Auto Care
                </Typography>
              </>
            )}
            <IconButton onClick={handleToggleSidebar} sx={{ "&:focus": { outline: "none" } }}>
              <MenuOpenIcon />
            </IconButton>
          </Box>
          <Divider />
          <List sx={{ p: '0 6px', mt: '10px' }}>
            {drawerItems.map((item, index) => {
              // Check if the current route is active
              const isActive = location.pathname === item.route || (item.route === "/dashboard" && isDashboardActive);

              return (
                <ListItem key={index} onClick={() => handleNavigation(item.route)}
                  sx={{
                    cursor: "pointer",
                    bgcolor: isActive ? "#5744E3" : "transparent",
                    color: isActive ? "white" : "inherit",
                    borderRadius: '10px',
                    pl: expanded ? '10px' : '7px'
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: expanded ? "8px" : 0 }}>
                    {item.icon}
                    {expanded && <ListItemText primary={item.text} />}
                  </Box>
                </ListItem>
              );
            })}
          </List>
        </Drawer>
        <ToastContainer />
      </Box>
      <Dialog open={DialogOpen} onClose={handleLogoutCancel} PaperProps={{
        sx: {
          width: '300px', // set your fixed width here
          borderRadius: '10px',
        },
      }}>
        <DialogTitle sx={{ fontWeight: 'bold' }}>Confirm Logout</DialogTitle>
        <DialogContent sx={{ padding: '14px 30px', }}>
          { logoutLoading? 
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: 'center', }}>
          <CircularProgress size={30} sx={{ color: "#5744E3", mr: "10px" }} />
          <Typography variant="h6">Logging out...</Typography>
        </Box> :
        <Typography>Are you sure you want to logout?</Typography> }
        </DialogContent>
        <DialogActions sx={{ gap: '4px'}}>
          <Button onClick={handleLogoutCancel} variant="outlined"
            sx={{
              textTransform: "none",
              "&:focus": { border: "none" },
            }}
          >No</Button>
          <Button onClick={handleLogoutConfirm} variant="contained"
            sx={{
              textTransform: "none",
              bgcolor: "#5744E3",
              boxShadow: "none",
              "&:focus": { outline: "none", boxShadow: "none" },
              "&:hover": { backgroundColor: "#5744E3", boxShadow: "none" },
            }}
          >Yes</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default LeftMenuBar;