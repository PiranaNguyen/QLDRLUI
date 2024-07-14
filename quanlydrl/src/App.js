import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from "./pages/header/Header";
import './App.css';
import Dashboard from './pages/dashboard/Dashboard';
import NoMatch from './pages/noMatch/NoMatch';
import Login from './pages/login/Login';
import AdminLogin from './pages/login/AdminLogin';
import PrivateRoute from './pages/login/privateRoute';
import { AuthProvider } from './pages/login/authContext';
import StudentList from './pages/student/studentList';
import StudentListAdmin from './pages/student/studentListAdmin';
import ClassList from './pages/class/classList';
import UserList from './pages/user/UserList';


function App(){
  return (

    <Router>
      <Header/>
      <Routes>
        <Route index element={<Dashboard/>}/>
        <Route path="/index" element={<Dashboard/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/student" element={<StudentList />} />
        <Route path="/astudent" element={<StudentListAdmin />} />
        <Route path="/class" element={<ClassList />} />
        <Route path="/user" element={<UserList />} />
        <Route path="*" element={<NoMatch/>}/>
      </Routes>
    </Router>
  )
}

export default App;
