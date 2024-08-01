import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Form, Button, InputGroup, Modal } from 'react-bootstrap';

const StudentManagement = () => {
    const [departments, setDepartments] = useState([]);
    const [classes, setClasses] = useState([]);
    const [students, setStudents] = useState([]);
    const [selectedDepartmentId, setSelectedDepartmentId] = useState('');
    const [selectedClassId, setSelectedClassId] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [error, setError] = useState(null);
    const [showStudentModal, setShowStudentModal] = useState(false);
    const [showClassModal, setShowClassModal] = useState(false);
    const [isEditingStudent, setIsEditingStudent] = useState(false);
    const [isEditingClass, setIsEditingClass] = useState(false);
    const [currentStudent, setCurrentStudent] = useState({
        id: '',
        sId: '',
        fullName: '',
        phoneNumber: '',
        address: '',
        clazz: '',
        user: ''
    });
    const [currentClass, setCurrentClass] = useState({
        id: '',
        name: '',
        department: ''
    });

    useEffect(() => {
        fetchDepartments();
    }, []);

    useEffect(() => {
        if (selectedDepartmentId) {
            fetchClassesByDepartment(selectedDepartmentId);
        }
    }, [selectedDepartmentId]);

    useEffect(() => {
        if (selectedClassId) {
            fetchStudents(selectedClassId);
        }
    }, [selectedClassId]);

    const fetchDepartments = () => {
        axios.get('http://localhost:8080/api/departments')
            .then(response => {
                if (response.status === 200) {
                    setDepartments(response.data);
                } else {
                    setError('Failed to fetch departments.');
                }
            })
            .catch(error => {
                console.error('Error fetching departments:', error);
                setError('Error fetching departments.');
            });
    };

    const fetchClassesByDepartment = (departmentId) => {
        axios.get(`http://localhost:8080/api/classes/dept/${departmentId}`)
            .then(response => {
                if (response.status === 200) {
                    setClasses(response.data);
                } else {
                    setError('Failed to fetch classes.');
                }
            })
            .catch(error => {
                console.error('Error fetching classes:', error);
                setError('Error fetching classes.');
            });
    };

    const fetchStudents = (classId) => {
        axios.get(`http://localhost:8080/api/students/class/${classId}`)
            .then(response => {
                if (response.status === 200) {
                    setStudents(response.data);
                    setError(null);
                } else {
                    setError('Failed to fetch students.');
                }
            })
            .catch(error => {
                console.error('Error fetching students:', error);
                setError('Error fetching students.');
            });
    };

    const handleDepartmentChange = (event) => {
        const departmentId = event.target.value;
        setSelectedDepartmentId(departmentId);
        setSelectedClassId(''); // Clear selected class when department changes
        setStudents([]); // Clear students when department changes
    };

    const handleClassChange = (event) => {
        const classId = event.target.value;
        setSelectedClassId(classId);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSortChange = () => {
        setSortOrder(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc'));
    };

    const handleEditStudent = (student) => {
        setCurrentStudent(student);
        setIsEditingStudent(true);
        setShowStudentModal(true);
    };

    const handleSaveStudent = () => {
        if (isEditingStudent) {
            axios.put(`http://localhost:8080/api/students/${currentStudent.id}`, currentStudent)
                .then(() => {
                    fetchStudents(selectedClassId);
                    setShowStudentModal(false);
                })
                .catch(error => {
                    setError(error);
                });
        } else {
            axios.post('http://localhost:8080/api/students', currentStudent)
                .then(() => {
                    fetchStudents(selectedClassId);
                    setShowStudentModal(false);
                })
                .catch(error => {
                    setError(error);
                });
        }
    };

    const handleSaveClass = () => {
        if (isEditingClass) {
            axios.put(`http://localhost:8080/api/classes/${currentClass.id}`, currentClass)
                .then(() => {
                    fetchClassesByDepartment(selectedDepartmentId);
                    setShowClassModal(false);
                })
                .catch(error => {
                    setError(error);
                });
        } else {
            axios.post('http://localhost:8080/api/classes', currentClass)
                .then(() => {
                    fetchClassesByDepartment(selectedDepartmentId);
                    setShowClassModal(false);
                })
                .catch(error => {
                    setError(error);
                });
        }
    };

    

    const handleDeleteStudent = (id) => {
        axios.delete(`http://localhost:8080/api/students/${id}`)
            .then(() => {
                fetchStudents(selectedClassId);
            })
            .catch(error => {
                setError(error);
            });
    };

    const handleChangeStudent = (e) => {
        const { name, value } = e.target;
        setCurrentStudent(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleChangeClass = (e) => {
        const { name, value } = e.target;
        setCurrentClass(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const filteredStudents = students
        .filter(student => student.fullName.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => {
            if (sortOrder === 'asc') {
                return a.fullName.localeCompare(b.fullName);
            }
            return b.fullName.localeCompare(a.fullName);
        });

    return (
        <div className="container mt-5">
            <h1>Danh Sách Sinh Viên Theo Lớp</h1>

            <Form.Group controlId="departmentSelect">
                <Form.Label>Chọn Khoa</Form.Label>
                <Form.Control as="select" onChange={handleDepartmentChange} value={selectedDepartmentId}>
                    <option value="">Chọn khoa</option>
                    {departments.map(dept => (
                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                </Form.Control>
            </Form.Group>

            <Form.Group controlId="classSelect" className="mt-3">
                <Form.Label>Chọn Lớp</Form.Label>
                <Form.Control as="select" onChange={handleClassChange} value={selectedClassId} disabled={!selectedDepartmentId}>
                    <option value="">Chọn lớp</option>
                    {classes.map(clazz => (
                        <option key={clazz.id} value={clazz.id}>{clazz.name}</option>
                    ))}
                </Form.Control>
            </Form.Group>

            <Button variant="primary" className="mt-3" onClick={() => { setIsEditingClass(false); setShowClassModal(true); }} disabled={!selectedDepartmentId}>
                Thêm Lớp
            </Button>

            {selectedClassId && (
                <>
                    <div className="d-flex justify-content-between my-3">
                        <InputGroup>
                            <Form.Control
                                placeholder="Tìm kiếm theo tên sinh viên"
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                            <Button variant="outline-secondary" onClick={handleSortChange}>
                                Sắp xếp {sortOrder === 'asc' ? 'Giảm dần' : 'Tăng dần'}
                            </Button>
                        </InputGroup>
                        <Button variant="primary" onClick={() => { setIsEditingStudent(false); setShowStudentModal(true); }}>
                            Thêm Sinh Viên
                        </Button>
                    </div>

                    {error && <div className="alert alert-danger">{error}</div>}

                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Mã Sinh Viên</th>
                                <th>Họ Tên</th>
                                <th>Số Điện Thoại</th>
                                <th>Địa Chỉ</th>
                                <th>Hành Động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.map(student => (
                                <tr key={student.id}>
                                    <td>{student.id}</td>
                                    <td>{student.sid}</td>
                                    <td>{student.fullName}</td>
                                    <td>{student.phoneNumber}</td>
                                    <td>{student.address}</td>
                                    <td>
                                        <Button variant="warning" onClick={() => handleEditStudent(student)}>Sửa</Button>{' '}
                                        <Button variant="danger" onClick={() => handleDeleteStudent(student.id)}>Xóa</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </>
            )}

            <Modal show={showStudentModal} onHide={() => setShowStudentModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditingStudent ? 'Sửa Sinh Viên' : 'Thêm Sinh Viên'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        {/* <Form.Group controlId="formStudentId">
                            <Form.Label>ID</Form.Label>
                            <Form.Control
                                type="text"
                                name="id"
                                value={currentStudent.id}
                                onChange={handleChangeStudent}
                                disabled={isEditingStudent}
                            />
                        </Form.Group> */}
                        <Form.Group controlId="formStudentSid">
                            <Form.Label>Mã Sinh Viên</Form.Label>
                            <Form.Control
                                type="text"
                                name="sId"
                                value={isEditingStudent ? currentStudent.sid : null}
                                onChange={handleChangeStudent}
                                disabled={isEditingStudent}
                            />
                        </Form.Group>
                        <Form.Group controlId="formStudentFullName">
                            <Form.Label>Họ Tên</Form.Label>
                            <Form.Control
                                type="text"
                                name="fullName"
                                value={isEditingStudent ? currentStudent.fullName : null}
                                onChange={handleChangeStudent}
                            />
                        </Form.Group>
                        <Form.Group controlId="formStudentPhoneNumber">
                            <Form.Label>Số Điện Thoại</Form.Label>
                            <Form.Control
                                type="text"
                                name="phoneNumber"
                                value={isEditingStudent ? currentStudent.phoneNumber : null}
                                onChange={handleChangeStudent}
                            />
                        </Form.Group>
                        <Form.Group controlId="formStudentAddress">
                            <Form.Label>Địa Chỉ</Form.Label>
                            <Form.Control
                                type="text"
                                name="address"
                                value={isEditingStudent ? currentStudent.address : null}
                                onChange={handleChangeStudent}
                            />
                        </Form.Group>
                        <Form.Group controlId="formStudentAddress">
                            <Form.Label>Địa Chỉ</Form.Label>
                            <Form.Control
                                type="text"
                                name="address"
                                value={isEditingStudent ? currentStudent.address : null}
                                onChange={handleChangeStudent}
                            />
                        </Form.Group>
                        <Form.Group controlId="departmentSelect2">
                            <Form.Label>Chọn Khoa</Form.Label>
                            <Form.Control name="department" disabled={isEditingStudent} as="select" onChange={handleDepartmentChange} value={selectedDepartmentId}>
                                <option value="">Chọn khoa</option>
                                {departments.map(dept => (
                                    <option defaultValue={isEditingStudent ? currentStudent.department : null} key={dept.id} value={dept.id}>{dept.name}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="classSelect2" className="mt-3">
                            <Form.Label>Chọn Lớp</Form.Label>
                            <Form.Control name="clazz" as="select" onChange={handleClassChange} value={selectedClassId} disabled={!selectedDepartmentId||isEditingStudent}>
                                <option value="">Chọn lớp</option>
                                {classes.map(clazz => (
                                    <option key={clazz.id} value={clazz.id}>{clazz.name}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowStudentModal(false)}>Đóng</Button>
                    <Button variant="primary" onClick={handleSaveStudent}>{isEditingStudent ? 'Lưu' : 'Thêm'}</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showClassModal} onHide={() => setShowClassModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditingClass ? 'Sửa Lớp' : 'Thêm Lớp'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formClassId">
                            <Form.Label>ID</Form.Label>
                            <Form.Control
                                type="text"
                                name="id"
                                value={currentClass.id}
                                onChange={handleChangeClass}
                                disabled={isEditingClass}
                            />
                        </Form.Group>
                        <Form.Group controlId="formClassName">
                            <Form.Label>Tên Lớp</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={currentClass.name}
                                onChange={handleChangeClass}
                            />
                        </Form.Group>
                        <Form.Group controlId="formClassDepartment">
                            <Form.Label>Khoa</Form.Label>
                            <Form.Control
                                type="text"
                                name="department"
                                value={currentClass.department}
                                onChange={handleChangeClass}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowClassModal(false)}>Đóng</Button>
                    <Button variant="primary" onClick={handleSaveClass}>{isEditingClass ? 'Lưu' : 'Thêm'}</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default StudentManagement;
