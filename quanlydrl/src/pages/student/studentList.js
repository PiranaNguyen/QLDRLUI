import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form } from 'react-bootstrap';

const StudentList = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false); // Biến xác định xem đang chỉnh sửa hay không
    const [currentStudent, setCurrentStudent] = useState({
        sid: '',
        fullName: '',
        phoneNumber: '',
        address: '',
        clazz: '',
        user: '',
        department: ''
    });
    const ids = localStorage.getItem('id');

    useEffect(() => {
        if (ids) {
            fetchStudents(ids);
        }
    }, [ids]); // Thêm ids vào mảng phụ thuộc

    const fetchStudents = (id) => {
        axios.get(`http://localhost:8080/api/students/${id}`)
            .then(response => {
                setStudents([response.data]); // Đặt sinh viên vào mảng để đồng nhất với cách hiển thị dữ liệu
                setCurrentStudent(response.data); // Đặt sinh viên hiện tại để chỉnh sửa
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });
    };

    const handleEdit = (student) => {
        setCurrentStudent(student);
        setIsEditing(true);
        setShowModal(true);
    };

    const handleSave = () => {
        if (isEditing) {
            axios.put(`http://localhost:8080/api/students/${currentStudent.id}`, currentStudent)
                .then(() => {
                    fetchStudents(ids); // Gọi lại fetchStudents với ids hiện tại
                    setShowModal(false);
                })
                .catch(error => {
                    setError(error);
                });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentStudent(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className="container mt-5">
            <h2>Thông Tin Sinh Viên</h2>
            {students.length > 0 && (
                <table className="table table-striped table-bordered mt-3">
                    <thead className="thead-dark">
                        <tr>
                            <th>Mã Sinh Viên</th>
                            <th>Họ Tên</th>
                            <th>Số Điện Thoại</th>
                            <th>Địa Chỉ</th>
                            <th>Lớp</th>
                            <th>Tên Đăng Nhập</th>
                            <th>Khoa</th>
                            <th>Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map(student => (
                            <tr key={student.id}>
                                <td>{student.sid}</td>
                                <td>{student.fullName}</td>
                                <td>{student.phoneNumber}</td>
                                <td>{student.address}</td>
                                <td>{student.clazz}</td>
                                <td>{student.user}</td>
                                <td>{student.department}</td>
                                <td>
                                    <Button variant="warning" onClick={() => handleEdit(student)}>Sửa</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditing ? 'Sửa Sinh Viên' : 'Thông Tin Sinh Viên'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formStudentId">
                            <Form.Label>Mã Sinh Viên</Form.Label>
                            <Form.Control
                                type="text"
                                name="sid"
                                value={currentStudent.sid}
                                onChange={handleChange}
                                placeholder="Enter student id"
                                readOnly
                                
                            />
                        </Form.Group>
                        <Form.Group controlId="formStudentName">
                            <Form.Label>Họ Tên</Form.Label>
                            <Form.Control
                                type="text"
                                name="fullName"
                                value={currentStudent.fullName}
                                onChange={handleChange}
                                placeholder="Enter full name"
                            />
                        </Form.Group>
                        <Form.Group controlId="formStudentPhoneNumber">
                            <Form.Label>Số Điện Thoại</Form.Label>
                            <Form.Control
                                type="text"
                                name="phoneNumber"
                                value={currentStudent.phoneNumber}
                                onChange={handleChange}
                                placeholder="Enter phone number"
                            />
                        </Form.Group>
                        <Form.Group controlId="formStudentAddress">
                            <Form.Label>Địa Chỉ</Form.Label>
                            <Form.Control
                                type="text"
                                name="address"
                                value={currentStudent.address}
                                onChange={handleChange}
                                placeholder="Enter address"
                            />
                        </Form.Group>
                        <Form.Group controlId="formStudentClazz">
                            <Form.Label>Lớp</Form.Label>
                            <Form.Control
                                type="text"
                                name="clazz"
                                value={currentStudent.clazz}
                                onChange={handleChange}
                                placeholder="Enter class"
                                readOnly
                            />
                        </Form.Group>
                        <Form.Group controlId="formStudentUser">
                            <Form.Label>Người Dùng</Form.Label>
                            <Form.Control
                                type="text"
                                name="user"
                                value={currentStudent.user}
                                onChange={handleChange}
                                placeholder="Enter user"
                                readOnly
                            />
                        </Form.Group>
                        <Form.Group controlId="formStudentUser">
                            <Form.Label>Khoa</Form.Label>
                            <Form.Control
                                type="text"
                                name="department"
                                value={currentStudent.department}
                                onChange={handleChange}
                                placeholder="Enter department"
                                readOnly
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Đóng</Button>
                    <Button variant="primary" onClick={handleSave}>Lưu</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default StudentList;
