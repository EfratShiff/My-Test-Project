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

const ManagerMenuLazy = React.lazy(() => import("./component/ManagerMenu"));

const ViewTestsLazy = React.lazy(() => import("./component/ViewTests"))
const StudentMenuLazy = React.lazy(() => import("./component/StudentMenu"))
const TeacherMenuLazy = React.lazy(() => import("./component/TeacherMenu"))


function App() {
  return (
    <>
   

<div className="App">
<HomeLazy />
      <Suspense fallback="loading...">
        <Routes>
          <Route path='/Login' element={<LoginLazy />} />
          <Route path='/AppBar' element={<AppBarLazy />} />
          <Route path='/CreateTest' element={<CreateTestLazy />} />
          <Route path='/SolveTest' element={<SolveTestLazy />} />
          <Route path="/ManagerMenu" element={<ManagerMenuLazy />} />
          <Route path='/CreateTest' element={<CreateTestLazy />} />
          <Route path='/ViewTests' element={<ViewTestsLazy />} />
          <Route path='/TeacherMenu' element={<TeacherMenuLazy />} />
          <Route path='/StudentMenu' element={<StudentMenuLazy />} />
         </Routes>
      </Suspense>
      </div>
    </>
  );
}

export default App;
