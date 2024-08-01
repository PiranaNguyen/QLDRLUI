import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from "./pages/header/Header";
import './App.css';
import Index from './pages/index/Index';
import NoMatch from './pages/noMatch/NoMatch';
import Login from './pages/login/Login';
import AdminLogin from './pages/login/AdminLogin';
import StudentList from './pages/student/studentList';
import StudentListAdmin from './pages/student/studentListAdmin';
import ClassList from './pages/class/classList';
import UserList from './pages/user/UserList';
import EvaluationForm from './pages/evaluationform/EvaluationForm';
import AdvisorList from './pages/advisor/advisorList';
import Profile from './pages/profile/Profile';
import StudentEvaluationForm from './pages/evaluationform/StudentEvaluationForm';
import AdminEvaluationForm from './pages/evaluationform/AdminEvaluationForm';
import ClassEvaluationForm from './pages/evaluationform/ClassEvaluationForm';

function App(){
  return (
    <Router>
      <Header/>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/index" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/stueva" element={<StudentEvaluationForm />} />
        <Route path="/admeva" element={<AdminEvaluationForm />} />
        <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/student" element={<StudentList />} />
          <Route path="/astudent" element={<StudentListAdmin />} />
          <Route path="/advisor" element={<AdvisorList />} />
          <Route path="/class" element={<ClassList />} />
          <Route path="/user" element={<UserList />} />
          <Route path="/evaluate" element={<EvaluationForm />} />
          <Route path="/claeva" element={<ClassEvaluationForm />} />
          <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<NoMatch />} />
      </Routes>
    </Router>
  );
}

export default App;
