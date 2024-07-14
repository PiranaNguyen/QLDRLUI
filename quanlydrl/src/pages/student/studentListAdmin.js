import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form } from 'react-bootstrap';

const StudentList = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [currentStudent, setCurrentStudent] = useState({
        id: '',
        fullName: '',
        phoneNumber: '',
        address: '',
        classMonitor: '',
        clazz: '',
        user: ''
    });

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = () => {
        axios.get('http://localhost:8080/api/students')
            .then(response => {
                setStudents(response.data);
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });
    };

    const handleAdd = () => {
        setCurrentStudent({
            id: '',
            fullName: '',
            phoneNumber: '',
            address: '',
            classMonitor: '',
            clazz: '',
            user: ''
        });
        setShowModal(true);
    };

    const handleEdit = (student) => {
        setCurrentStudent(student);
        setShowModal(true);
    };

    const handleDelete = (id) => {
        axios.delete(`http://localhost:8080/api/students/${id}`)
            .then(() => {
                fetchStudents();
            })
            .catch(error => {
                setError(error);
            });
    };

    const handleSave = () => {
        if (currentStudent.id) {
            axios.put(`http://localhost:8080/api/students/${currentStudent.id}`, currentStudent)
                .then(() => {
                    fetchStudents();
                    setShowModal(false);
                })
                .catch(error => {
                    setError(error);
                });
        } else {
            axios.post('http://localhost:8080/api/students', currentStudent)
                .then(() => {
                    fetchStudents();
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
            <h2>Danh Sách Sinh Viên</h2>
            <Button variant="primary" onClick={handleAdd}>Thêm Sinh Viên</Button>
            <table className="table table-striped table-bordered mt-3">
                <thead className="thead-dark">
                    <tr>
                        <th>ID</th>
                        <th>Họ Tên</th>
                        <th>Số Điện Thoại</th>
                        <th>Địa Chỉ</th>
                        <th>Chức Vụ</th>
                        <th>Lớp</th>
                        <th>Tên Đăng Nhập</th>
                        <th>Hành Động</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map(student => (
                        <tr key={student.id}>
                            <td>{student.id}</td>
                            <td>{student.fullName}</td>
                            <td>{student.phoneNumber}</td>
                            <td>{student.address}</td>
                            <td>{student.classMonitor}</td>
                            <td>{student.clazz}</td>
                            <td>{student.user}</td>
                            <td>
                                <Button variant="warning" onClick={() => handleEdit(student)}>Sửa</Button>{' '}
                                <Button variant="danger" onClick={() => handleDelete(student.id)}>Xóa</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{currentStudent.id ? 'Sửa Sinh Viên' : 'Thêm Sinh Viên'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formStudentId">
                            <Form.Label>ID</Form.Label>
                            <Form.Control
                                type="text"
                                name="id"
                                value={currentStudent.id}
                                onChange={handleChange}
                                placeholder="Enter ID"
                                //readOnly={!!currentStudent.id}
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
                        <Form.Group controlId="formStudentClassMonitor">
                            <Form.Label>Chức Vụ</Form.Label>
                            <Form.Control
                                type="text"
                                name="classMonitor"
                                value={currentStudent.classMonitor}
                                onChange={handleChange}
                                placeholder="Enter class monitor"
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
