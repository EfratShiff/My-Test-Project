import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './component/Login';
import Register from './component/Register';
import Home from './component/Home';
import ViewTests from './component/ViewTests';
import SolveTest from './component/SolveTest';
import ViewTest from './component/ViewTest';
import Navbar from './component/Navbar';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import rtlPlugin from 'stylis-plugin-rtl';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';
import { CssBaseline } from '@mui/material';

// יצירת קאש עם תמיכה ב-RTL
const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

// יצירת תמה עם כיוון RTL
const theme = createTheme({
  direction: 'rtl',
  typography: {
    fontFamily: 'Rubik, sans-serif',
  },
});

function App() {
  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/ViewTests" element={<ViewTests />} />
            <Route path="/SolveTest/:testId" element={<SolveTest />} />
            <Route path="/ViewTest/:testId" element={<ViewTest />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </CacheProvider>
  );
}

export default App; 