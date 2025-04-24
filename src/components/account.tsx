import { useEffect, useState, useRef } from 'react';
import { Box, Button, CircularProgress, Paper, Typography } from '@mui/material';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import CustomTextField from './common/customTextField';
import api from './api';
import PrintIcon from '@mui/icons-material/Print';

const Account = () => {
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [edit, setEdit] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    address: '',
  });

  const token = sessionStorage.getItem('access_token');
  const printRef = useRef<HTMLDivElement>(null);  // Reference for the content to print

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const fetchProfile = async () => {
    try {
      if (!token) {
        alert('No access token found. Please log in.');
        return;
      }
      const response = await api.get('/getProfile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && typeof response.data === 'object') {
        setProfile(response.data);
      } else {
        alert('Profile data is not in the expected format.');
      }
    } catch (e: any) {
      alert(e || 'Failed to fetch Profile');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEdit(true);
    setFormData({
      name: profile.name,
      email: profile.email,
      mobile: profile.mobile,
      address: profile.address,
    });
  };

  const handleCancel = () => {
    setEdit(false);
    setFormData({
      name: profile?.name || '',
      email: profile?.email || '',
      mobile: profile?.mobile || '',
      address: profile?.address || '',
    });
  };

  const handleUpdate = async () => {
    try {
      const response = await api.post(
        '/updateProfile',
        {
          name: formData.name,
          mobile: formData.mobile,
          address: formData.address,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('response', response.data);

      setProfile((prev: any) => ({
        ...prev,
        name: formData.name,
        mobile: formData.mobile,
        address: formData.address,
      }));

      setEdit(false);
    } catch (err: any) {
      console.error('Update Error:', err);
    }
  };

  const handlePrint = () => {
    if (!printRef.current) return;
    
    const printWindow = window.open('', '', 'width=800,height=600');
    if (!printWindow) return;
    
    const content = printRef.current.innerHTML;
    const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
      .map(el => el.outerHTML)
      .join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>Profile</title>
          ${styles}
          <style>
            @page { size: A4; margin: 10mm; }
            body { font-family: sans-serif; padding: 20px; }
            .print-content { max-width: 800px; margin: 0 auto; }
            .print-header { text-align: center; margin-bottom: 20px; }
            .print-avatar { 
              height: 120px; width: 120px; 
              background-color: #ccc; 
              border-radius: 50%; 
              display: flex; 
              justify-content: center; 
              align-items: center; 
              margin: 0 auto 20px; 
              font-size: 40px; 
              font-weight: bold; 
            }
            .print-field { margin-bottom: 15px; }
            .print-label { font-weight: bold; display: block; margin-bottom: 5px; }
            .print-value { padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
            .no-print { display: none; }
          </style>
        </head>
        <body>
          <div class="print-content">
            <div class="print-header">
              <h1>Profile Information</h1>
            </div>
            ${content}
          </div>
          <script>
            setTimeout(() => {
              window.print();
              window.close();
            }, 200);
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };
  

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '76vw', mt: '60px' }}>
        <CircularProgress size={30} sx={{ color: '#60B5FF', mr: '10px' }} />
        <Typography variant="h5">Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ m: 2 }}>
      <Typography variant="h4" fontWeight={'bold'} margin={2}>Personal Information</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" startIcon={<PrintIcon />} onClick={handlePrint}
          sx={{
            textTransform: 'none',
            bgcolor: '#5744E3',
            boxShadow: 'none',
            '&:focus': { outline: 'none', boxShadow: 'none' },
            '&:hover': { backgroundColor: '#4534C8', boxShadow: 'none' },
            m: '10px 0'
          }}
        >
          Print
        </Button>
      </Box>

      {profile ? (
        <div ref={printRef}> {/* Added ref here to ensure content is printed */}
          <Paper sx={{ padding: '20px', textAlign: 'left', boxShadow: 4, borderRadius: '10px', position: 'relative', width: '70vw' }}>
            {!edit && (
              <Box sx={{ display: 'flex', position: 'absolute', right: 14, top: 14, fontSize: '22px', cursor: 'pointer', gap: '2px' }} onClick={handleEdit}>
                <EditTwoToneIcon sx={{ fontSize: '18px', mt: '3px', color: '#5744E3' }} />
                <Typography sx={{ color: '#5744E3' }}>Edit</Typography>
              </Box>
            )}

            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center' }}>
              <Box sx={{ height: '100px', width: '100px', bgcolor: '#ccc', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '50%', fontSize: '60px', margin: '4px 0', fontWeight: 'bold' }}>
                {profile.name[0]}
              </Box>
            </Box>

            {/* Name */}
            <Box>
              <Typography sx={{ m: '8px 0' }}><strong>Name</strong></Typography>
              <CustomTextField
                placeholder="Name"
                name="name"
                value={edit ? formData.name : profile.name}
                onChange={handleChange}
                disabled={!edit}
              />
            </Box>

            {/* Email */}
            <Box>
              <Typography sx={{ m: '8px 0' }}><strong>Email</strong></Typography>
              <CustomTextField
                placeholder="Email"
                name="email"
                value={edit ? formData.email : profile.email}
                onChange={handleChange}
                disabled={true}
              />
            </Box>

            {/* Mobile */}
            <Box>
              <Typography sx={{ m: '8px 0' }}><strong>Mobile</strong></Typography>
              <CustomTextField
                placeholder="Mobile"
                name="mobile"
                value={edit ? formData.mobile : profile.mobile}
                onChange={handleChange}
                disabled={!edit}
              />
            </Box>

            {/* Address */}
            <Box>
              <Typography sx={{ m: '8px 0' }}><strong>Address</strong></Typography>
              <CustomTextField
                placeholder="Address"
                name="address"
                value={edit ? formData.address : profile.address}
                onChange={handleChange}
                disabled={!edit}
              />
            </Box>

            {/* Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', mt: '10px' }}>
              <Button variant="outlined" onClick={handleCancel} sx={{ textTransform: 'none' }} disabled={!edit}>
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleUpdate}
                disabled={!edit}
                sx={{
                  textTransform: 'none',
                  bgcolor: '#5744E3',
                  boxShadow: 'none',
                  '&:focus': { outline: 'none', boxShadow: 'none' },
                  '&:hover': { backgroundColor: '#4534C8', boxShadow: 'none' },
                }}
              >
                Update
              </Button>
            </Box>
          </Paper>
        </div>
      ) : (
        <Typography>No profile data available.</Typography>
      )}
    </Box>
  );
};

export default Account;
