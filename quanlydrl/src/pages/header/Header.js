import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const fullName = localStorage.getItem('fullName');
  const role = localStorage.getItem('role'); // Lấy role từ localStorage

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('fullName');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const renderNavLinks = () => {
    if (!token) {
      return (
        <>
        <Nav className="ms-auto">
            <Nav.Link as={Link} to="/login">Đăng Nhập</Nav.Link>
        </Nav>
        </>
      );
    }
  };

  const renderNavLinks2 = () => {
    if (token && role === 'student') {
      return (
        <>
        <Nav className="ms-auto">
            <Nav.Link as={Link} to="/student">Sinh Viên</Nav.Link>
        </Nav>
        <Nav className="ms-auto">
            <Nav.Link as={Link} to="/stueva">Đánh Giá</Nav.Link>
        </Nav>
        <Nav className="ms-auto">
            <Nav.Link className="nav-link">Chào {fullName}</Nav.Link>
        </Nav>
        <Nav className="ms-auto">
            <Nav.Link className="nav-link" onClick={handleLogout}>Đăng Xuất</Nav.Link>
        </Nav>
        </>
      );
    }
  };

  const renderNavLinks3 = () => {
    if (token && role === 'advisor') {
      return (
        <>
        <Nav className="ms-auto">
            <Nav.Link as={Link} to="/astudent">Sinh Viên</Nav.Link>
        </Nav>
        <Nav className="ms-auto">
            <Nav.Link as={Link} to="/class">Danh Sách Lớp</Nav.Link>
        </Nav> 
        <Nav className="ms-auto">
            <Nav.Link as={Link} to="/admeva">Đánh Giá</Nav.Link>
        </Nav>
        <Nav className="ms-auto">
            <Nav.Link className="nav-link">Chào {fullName}</Nav.Link>
        </Nav>
        <Nav className="ms-auto">
            <Nav.Link className="nav-link" onClick={handleLogout}>Đăng Xuất</Nav.Link>
        </Nav>
        </>
      );
    }
  };
  const renderNavLinks4 = () => {
    if (token && role === 'clazz') {
      return (
        <>
        <Nav className="ms-auto">
            <Nav.Link as={Link} to="/astudent">Danh Sách Sinh Viên</Nav.Link>
        </Nav>
        <Nav className="ms-auto">
            <Nav.Link as={Link} to="/claeva">Đánh Giá</Nav.Link>
        </Nav>
        <Nav className="ms-auto">
            <Nav.Link className="nav-link">Chào {fullName}</Nav.Link>
        </Nav>
        <Nav className="ms-auto">
            <Nav.Link className="nav-link" onClick={handleLogout}>Đăng Xuất</Nav.Link>
        </Nav>
        </>
      );
    }
  };

  return (
    <Navbar bg="primary" variant="dark">
      <Container>
        <Navbar.Brand as={Link} to="/"><strong>Quản Lý Điểm Rèn Luyện</strong></Navbar.Brand>
        <Nav className="ms-auto">
            <Nav.Link as={Link} to="/index">Trang Chủ</Nav.Link>
        </Nav>
        <Nav className="ms-auto">
            <Nav.Link as={Link} to="/profile">Tài Khoản</Nav.Link>
        </Nav>

        <Nav className="ms-auto">
          {renderNavLinks()}
        </Nav>
        <Nav className="ms-auto">
          {renderNavLinks2()}
        </Nav>
        <Nav className="ms-auto">
          {renderNavLinks3()}
        </Nav>
        <Nav className="ms-auto">
          {renderNavLinks4()}
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Header;
