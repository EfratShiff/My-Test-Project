import logo from './logo.svg';
import './App.css';
import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

const ForgotPasswordLazy = React.lazy(() => import("./component/ForgotPassword"));
const LoginLazy = React.lazy(() => import("./component/Login"));
const CreateTestLazy = React.lazy(() => import("./component/CreateTest"));
const SolveTestLazy = React.lazy(() => import("./component/SolveTest"));
const AppBarLazy = React.lazy(() => import("./component/AppBar"));
const HomeLazy = React.lazy(() => import("./component/Home"));
const ManagerMenuLazy = React.lazy(() => import("./component/ManagerMenu"));
const ViewTestsLazy = React.lazy(() => import("./component/ViewTests"));
const StudentMenuLazy = React.lazy(() => import("./component/StudentMenu"));
const TeacherMenuLazy = React.lazy(() => import("./component/TeacherMenu"));
const ViewRezultTestLazy = React.lazy(() => import("./component/ViewRezultTest"));

function App() {
  return (
    <>
      <div className="App">
        <Suspense fallback="loading...">
          <Routes>
            <Route path="/" element={<HomeLazy />} />
            <Route path="/Login" element={<LoginLazy />} />
            <Route path="/AppBar" element={<AppBarLazy />} />
            <Route path="/CreateTest" element={<CreateTestLazy />} />
            <Route path="/SolveTest/:testId" element={<SolveTestLazy />} />
            <Route path="/ManagerMenu" element={<ManagerMenuLazy />} />
            <Route path="/ViewTests" element={<ViewTestsLazy />} />
            <Route path="/TeacherMenu" element={<TeacherMenuLazy />} />
            <Route path="/StudentMenu" element={<StudentMenuLazy />} />
            <Route path="/ViewRezultTest" element={<ViewRezultTestLazy />} />
            <Route path="/ViewRezultTest/:testId" element={<ViewRezultTestLazy />} />
            <Route path="/forgot-password" element={<ForgotPasswordLazy />} />
          </Routes>
        </Suspense>
      </div>
    </>
  );
}

export default App;
