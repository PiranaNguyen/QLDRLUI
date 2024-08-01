import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button, Container, Alert } from 'react-bootstrap';

const Profile = () => {
    const [profile, setProfile] = useState({
        id: '',
        fullName: '',
        name: '',
        email: '',
        phoneNumber: '',
        address: '',
        role: '',
        department: '', // chỉ cho cố vấn
        clazz: '' // chỉ cho sinh viên
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [departments, setDepartments] = useState([]);
    const [classes, setClasses] = useState([]);
    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPasswordError, setShowPasswordError] = useState(false);
    const id = localStorage.getItem('id');
    const role = localStorage.getItem('role');
    const userName = localStorage.getItem('userName');

    const fetchProfile = useCallback(async (id) => {
        try {
            let endpoint;
            switch (role) {
                case "student":
                    endpoint = `students/${id}`;
                    break;
                case "advisor":
                    endpoint = `advisors/${id}`;
                    break;
                case "clazz":
                    endpoint = `classes/${id}`;
                    break;
                default:
                    throw new Error('Invalid role');
            }
            const response = await axios.get(`http://localhost:8080/api/${endpoint}`);
            setProfile(response.data);
            setLoading(false);
        } catch (error) {
            setError('Error fetching profile.');
            setLoading(false);
        }
    }, [role]);

    useEffect(() => {
        if (id) {
            fetchProfile(id);
            fetchDepartments();
            fetchClasses();
        }
    }, [id, fetchProfile]);

    const fetchDepartments = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/departments');
            setDepartments(response.data);
        } catch (error) {
            setError('Error fetching departments.');
        }
    };

    const fetchClasses = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/classes');
            setClasses(response.data);
        } catch (error) {
            setError('Error fetching classes.');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSave = async () => {
        try {
            let endpoint;
            switch (role) {
                case "student":
                    endpoint = `students/${id}`;
                    break;
                case "advisor":
                    endpoint = `advisors/${id}`;
                    break;
                case "clazz":
                    endpoint = `classes/${id}`;
                    break;
                default:
                    throw new Error('Invalid role');
            }
            await axios.put(`http://localhost:8080/api/${endpoint}`, profile);
            alert('Profile updated successfully');
        } catch (error) {
            setError('Error saving profile.');
        }
    };

    const handlePasswordSubmit = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setShowPasswordError(true);
            return;
        }

        try {
            await axios.put(`http://localhost:8080/api/users/change/${userName}`, {
                id: profile.id,
                oldPassword: passwordData.oldPassword,
                newPassword: passwordData.newPassword
            });
            alert('Password changed successfully');
            setPasswordData({
                oldPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            setShowPasswordError(false);
        } catch (error) {
            setError('Error changing password.');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <Container>
            <h1>Hồ Sơ Cá Nhân</h1>
            <Form>
                <Form.Group controlId="formUserId">
                    <Form.Label>ID</Form.Label>
                    <Form.Control
                        type="text"
                        name="id"
                        value={profile.id}
                        readOnly
                    />
                </Form.Group>
                {role === "clazz" && (
                    <Form.Group controlId="formUserName">
                    <Form.Label>Tên Lớp</Form.Label>
                    <Form.Control
                        type="text"
                        name="name"
                        value={profile.name}
                        onChange={handleChange}
                    />
                    </Form.Group>
                )}
                
                {role !== "clazz" && (
                    <>
                    <Form.Group controlId="formUserName">
                        <Form.Label>Họ Tên</Form.Label>
                        <Form.Control
                            type="text"
                            name="fullName"
                            value={profile.fullName}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="formUserPhoneNumber">
                        <Form.Label>Số Điện Thoại</Form.Label>
                        <Form.Control
                            type="text"
                            name="phoneNumber"
                            value={profile.phoneNumber}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="formUserAddress">
                        <Form.Label>Địa Chỉ</Form.Label>
                        <Form.Control
                            type="text"
                            name="address"
                            value={profile.address}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    </>
                )}
                    <Form.Group controlId="formUserDepartment">
                        <Form.Label>Khoa</Form.Label>
                        <Form.Control
                            as="select"
                            name="department"
                            value={profile.department}
                            onChange={handleChange}
                        >
                            <option value="">Chọn Khoa</option>
                            {departments.map(department => (
                                <option key={department.id} value={department.id}>
                                    {department.name}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                {role !== "clazz" && (
                    <Form.Group controlId="formUserClazz">
                        <Form.Label>Lớp</Form.Label>
                        <Form.Control
                            as="select"
                            name="clazz"
                            value={profile.clazz}
                            onChange={handleChange}
                        >
                            <option value="">Chọn Lớp</option>
                            {classes.map(clazz => (
                                <option key={clazz.id} value={clazz.id}>
                                    {clazz.name}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                )}
                <Button variant="primary" onClick={handleSave}>Lưu</Button>
            </Form>

            <h2 className="mt-5">Đổi Mật Khẩu</h2>
            <Form>
                <Form.Group controlId="formOldPassword">
                    <Form.Label>Mật Khẩu Cũ</Form.Label>
                    <Form.Control
                        type="password"
                        name="oldPassword"
                        value={passwordData.oldPassword}
                        onChange={handlePasswordChange}
                    />
                </Form.Group>
                <Form.Group controlId="formNewPassword">
                    <Form.Label>Mật Khẩu Mới</Form.Label>
                    <Form.Control
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                    />
                </Form.Group>
                <Form.Group controlId="formConfirmPassword">
                    <Form.Label>Xác Nhận Mật Khẩu</Form.Label>
                    <Form.Control
                        type="password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                    />
                </Form.Group>
                {showPasswordError && (
                    <Alert variant="danger" className="mt-3">
                        Mật khẩu mới và xác nhận mật khẩu không khớp!
                    </Alert>
                )}
                <Button variant="primary" onClick={handlePasswordSubmit} className="mt-3">Đổi Mật Khẩu</Button>
            </Form>
        </Container>
    );
};

export default Profile;
