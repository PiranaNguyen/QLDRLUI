import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form } from 'react-bootstrap';

const ClassList = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [currentClass, setCurrentClass] = useState({
        id: '',
        name: '',
        department: ''
    });

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = () => {
        axios.get('http://localhost:8080/api/classes')
            .then(response => {
                setClasses(response.data);
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });
    };

    const handleAdd = () => {
        setCurrentClass({
            id: '',
            name: '',
            department: ''
        });
        setShowModal(true);
    };

    const handleEdit = (clazz) => {
        setCurrentClass(clazz);
        setShowModal(true);
    };

    const handleDelete = (id) => {
        axios.delete(`http://localhost:8080/api/classes/${id}`)
            .then(() => {
                fetchClasses();
            })
            .catch(error => {
                setError(error);
            });
    };

    const handleSave = () => {
        if (currentClass.id) {
            axios.put(`http://localhost:8080/api/classes/${currentClass.id}`, currentClass)
                .then(() => {
                    fetchClasses();
                    setShowModal(false);
                })
                .catch(error => {
                    setError(error);
                });
        } else {
            axios.post('http://localhost:8080/api/classes', currentClass)
                .then(() => {
                    fetchClasses();
                    setShowModal(false);
                })
                .catch(error => {
                    setError(error);
                });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentClass(prevState => ({
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
            <h2>Danh Sách Lớp</h2>
            <Button variant="primary" onClick={handleAdd}>Thêm Lớp</Button>
            <table className="table table-striped table-bordered mt-3">
                <thead className="thead-dark">
                    <tr>
                        <th>ID</th>
                        <th>Tên Lớp</th>
                        <th>Khoa</th>
                        <th>Hành Động</th>
                    </tr>
                </thead>
                <tbody>
                    {classes.map(clazz => (
                        <tr key={clazz.id}>
                            <td>{clazz.id}</td>
                            <td>{clazz.name}</td>
                            <td>{clazz.department}</td>
                            <td>
                                <Button variant="warning" onClick={() => handleEdit(clazz)}>Sửa</Button>{' '}
                                <Button variant="danger" onClick={() => handleDelete(clazz.id)}>Xóa</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{currentClass.id ? 'Sửa Lớp' : 'Thêm Lớp'}</Modal.Title>
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
                                placeholder="Enter ID"
                            />
                        </Form.Group>
                        <Form.Group controlId="formClassName">
                            <Form.Label>Tên Lớp</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={currentClass.name}
                                onChange={handleChange}
                                placeholder="Enter class name"
                            />
                        </Form.Group>
                        <Form.Group controlId="formClassDepartment">
                            <Form.Label>Khoa</Form.Label>
                            <Form.Control
                                type="text"
                                name="department"
                                value={currentClass.department}
                                onChange={handleChange}
                                placeholder="Enter department"
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

export default ClassList;
