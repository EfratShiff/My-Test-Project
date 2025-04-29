import React, { useState, useEffect } from 'react';
import { Modal, Box, Button } from '@mui/material';

const Home = () => {
  const [open, setOpen] = useState(false); // מתחיל כלא פתוח

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpen(true); // נפתח אחרי 5 שניות
    }, 5000);

    return () => clearTimeout(timer); // ניקוי טיימר במקרה של unmount
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Modal
        open={open}
        onClose={() => {}} // מבטל סגירה ע"י Esc או רקע
        disableEscapeKeyDown
        BackdropProps={{ onClick: (e) => e.stopPropagation() }} // מונע סגירה ע"י רקע
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          p: 4,
          borderRadius: 2
        }}>
          <h2>חובה לאשר לפני סגירה</h2>
          <Button variant="contained" onClick={handleClose}>אני מאשר/ת</Button>
        </Box>
      </Modal>
    </>
  );
};

export default Home;
