import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Form, Button, Modal } from 'react-bootstrap';

const ClassManagement = () => {
    const [classes, setClasses] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentClass, setCurrentClass] = useState({
        id: '',
        name: '',
        department: '',
        advisor: '',
        schoolYear: '',
        user: ''
    });
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = () => {
        axios.get('http://localhost:8080/api/classes')
            .then(response => {
                setClasses(response.data);
                setError(null);
            })
            .catch(error => {
                setError('Error fetching classes: ' + error.message);
            });
    };

    const handleShowModal = (clazz = {
        id: '',
        name: '',
        department: '',
        advisor: '',
        schoolYear: '',
        user: ''
    }) => {
        setCurrentClass(clazz);
        setIsEditing(!!clazz.id);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentClass(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    const handleSave = () => {
        if (isEditing) {
            axios.put(`http://localhost:8080/api/classes/${currentClass.id}`, currentClass)
                .then(() => {
                    fetchClasses();
                    handleCloseModal();
                })
                .catch(error => {
                    setError('Error saving class: ' + error.message);
                });
        } else {
            axios.post('http://localhost:8080/api/classes', currentClass)
                .then(() => {
                    fetchClasses();
                    handleCloseModal();
                })
                .catch(error => {
                    setError('Error saving class: ' + error.message);
                });
        }
    };

    const handleDelete = (id) => {
        axios.delete(`http://localhost:8080/api/classes/${id}`)
            .then(() => {
                fetchClasses();
            })
            .catch(error => {
                setError('Error deleting class: ' + error.message);
            });
    };

    return (
        <div className="container mt-5">
            <h1>Danh Sách Lớp</h1>

            <Button variant="primary" onClick={() => handleShowModal()}>
                Thêm Lớp
            </Button>

            {error && <div className="alert alert-danger">{error}</div>}

            <Table striped bordered hover className="mt-3">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tên Lớp</th>
                        <th>Khoa</th>
                        <th>Cố Vấn</th>
                        <th>Niên Khóa</th>
                        <th>User</th>
                        <th>Hành Động</th>
                    </tr>
                </thead>
                <tbody>
                    {classes.map(clazz => (
                        <tr key={clazz.id}>
                            <td>{clazz.id}</td>
                            <td>{clazz.name}</td>
                            <td>{clazz.department}</td>
                            <td>{clazz.advisor}</td>
                            <td>{clazz.schoolYear}</td>
                            <td>{clazz.user}</td>
                            <td>
                                <Button variant="warning" onClick={() => handleShowModal(clazz)}>Sửa</Button>
                                <Button variant="danger" onClick={() => handleDelete(clazz.id)}>Xóa</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditing ? 'Sửa Lớp' : 'Thêm Lớp'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formClassId">
                            <Form.Label>ID</Form.Label>
                            <Form.Control
                                type="text"
                                name="id"
                                value={currentClass.id}
                                onChange={handleChange}
                                placeholder="Nhập mã lớp"
                                readOnly={isEditing}
                            />
                        </Form.Group>
                        <Form.Group controlId="formClassName">
                            <Form.Label>Tên Lớp</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={currentClass.name}
                                onChange={handleChange}
                                placeholder="Nhập tên lớp"
                            />
                        </Form.Group>
                        <Form.Group controlId="formClassDepartment">
                            <Form.Label>Khoa</Form.Label>
                            <Form.Control
                                type="text"
                                name="department"
                                value={currentClass.department}
                                onChange={handleChange}
                                placeholder="Nhập khoa"
                            />
                        </Form.Group>
                        <Form.Group controlId="formClassAdvisor">
                            <Form.Label>Cố Vấn</Form.Label>
                            <Form.Control
                                type="text"
                                name="advisor"
                                value={currentClass.advisor}
                                onChange={handleChange}
                                placeholder="Nhập cố vấn"
                            />
                        </Form.Group>
                        <Form.Group controlId="formClassSchoolYear">
                            <Form.Label>Niên Khóa</Form.Label>
                            <Form.Control
                                type="text"
                                name="schoolYear"
                                value={currentClass.schoolYear}
                                onChange={handleChange}
                                placeholder="Nhập niên khóa (2014 - 2018)"
                            />
                        </Form.Group>
                        <Form.Group controlId="formClassUser">
                            <Form.Label>Tên Đăng Nhập</Form.Label>
                            <Form.Control
                                type="text"
                                name="user"
                                value={currentClass.user}
                                onChange={handleChange}
                                placeholder="Nhập tên đăng nhập"
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>Đóng</Button>
                    <Button variant="primary" onClick={handleSave}>Lưu</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ClassManagement;
