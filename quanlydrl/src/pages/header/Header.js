import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container"
import Nav from "react-bootstrap/Nav";
import {Link} from "react-router-dom";
import "./Header.css";

const Header = () =>{
    return (
        <>
            <Navbar bg="primary" variant="dark">
                <Container>
                    <Navbar.Brand to="/"><strong>Quản Lý Sinh Viên</strong></Navbar.Brand>
                    <Nav className="m1-auto">
                        <Nav.Link as={Link} to="/index" className="nav-link">Trang Chủ</Nav.Link>
                        <Nav.Link as={Link} to="/student" className="nav-link">Quản Lý Sinh Viên</Nav.Link>
                    </Nav>
                    <Nav className="m1-auto">
                        <Nav.Link as={Link} to="/login" className="nav-link">Đăng Nhập</Nav.Link>
                        <Nav.Link as={Link} to="/register" className="nav-link">Đăng Ký</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
        </>
    )
}

export default Header;