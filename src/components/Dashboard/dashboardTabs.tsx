import { useEffect, useState } from 'react';
import { Box, Tabs, Tab, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate, useLocation } from 'react-router-dom';
import { RecentlyAddedBills } from './recentlyAddedBills';
import CompletedBills from './completedBills';
import PendingBills from './pendingBills';

const tabRoutes = ['/dashboard/recent', '/dashboard/pending', '/dashboard/completed'];

const TabPanel = ({ children, value, index }: { children: React.ReactNode, value: number, index: number }) => (
  <div role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`} aria-labelledby={`tab-${index}`}>
    {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
  </div>
);

export default function DashboardTabs() {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine tab index based on current path
  const currentIndex = tabRoutes.indexOf(location.pathname);
  const [value, setValue] = useState(currentIndex !== -1 ? currentIndex : 0);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    navigate(tabRoutes[newValue]);
  };

  useEffect(() => {
    // Update tab index if user navigates directly (e.g., via browser URL)
    const newIndex = tabRoutes.indexOf(location.pathname);
    if (newIndex !== -1 && newIndex !== value) {
      setValue(newIndex);
    }
  }, [location.pathname]);

  return (
    <>
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <TextField
          placeholder="Search..."
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              margin: '10px',
              pl: '8px',
              '& .MuiInputBase-input': {
                border: 'none',
                borderRadius: '8px',
                padding: '10px 10px 10px 0',
                fontSize: '16px',
              },
            },
          }}
        />
      </Box>

      <Box sx={{ width: '100%' }}>
        <Tabs value={value} onChange={handleChange} aria-label="dashboard tabs" sx={{ borderBottom: 1, borderColor: 'divider', '& .MuiTabs-flexContainer': {
            '& .MuiTab-root': {
              '&:focus': {
                outline: 'none', // Remove outline on focus for Tab
              },
            },
          }, }}>
          <Tab label="Recent" id="tab-0" sx={{ textTransform: 'none' }} />
          <Tab label="Pending" id="tab-1" sx={{ textTransform: 'none' }} />
          <Tab label="Completed" id="tab-2" sx={{ textTransform: 'none' }} />
        </Tabs>
        <TabPanel value={value} index={0}><RecentlyAddedBills /></TabPanel>
        <TabPanel value={value} index={1}><PendingBills /></TabPanel>
        <TabPanel value={value} index={2}><CompletedBills /></TabPanel>
      </Box>
    </>
  );
}
