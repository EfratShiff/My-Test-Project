import logo from './logo.svg';
import './App.css';
import CreateTest from './component/CreateTest';
import Login from './component//Login';
import React, { Suspense }  from 'react';
import { AppBar } from '@mui/material';
import { Route, Routes } from 'react-router-dom';
const LoginLazy = React.lazy(() => import("./component/Login"))
const CreateTestLazy = React.lazy(() => import("./component/CreateTest"))
const SolveTestLazy = React.lazy(() => import("./component/SolveTest"))
const AppBarLazy = React.lazy(() => import("./component/AppBar"))
const HomeLazy = React.lazy(() => import("./component/Home"))


function App() {
  return (
    <>
   

<div className="App">
<AppBar />
      <Suspense fallback="loading...">
        <Routes>
          <Route path='/Login' element={<LoginLazy />} />
          <Route path='/' element={<AppBarLazy />} />
          <Route path='/' element={<HomeLazy />} />
          <Route path='/CreateTest' element={<CreateTestLazy />} />
          <Route path='/SolveTest' element={<SolveTestLazy />} />
          {/* <Route path='/Home' element={<HomeLazy />} /> */}
         </Routes>
      </Suspense>
      </div>
    </>
  );
}

export default App;
