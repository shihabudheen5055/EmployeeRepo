import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Modal, Form } from "react-bootstrap";
import { useFormik } from "formik";
import "./App.css"; // Import the custom CSS
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [employees, setEmployees] = useState([]);
  const [filter, setFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);

  useEffect(() => {
    const storedEmployees = localStorage.getItem("employees");
    if (storedEmployees) {
      setEmployees(JSON.parse(storedEmployees));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("employees", JSON.stringify(employees));
  }, [employees]);

  const formik = useFormik({
    initialValues: {
      name: "",
      jobTitle: "",
      email: ""
    },
    validate: (values) => {
      const errors = {};
      if (!values.name) {
        errors.name = "Employee name is required"; // Validation message for required name
      }
      return errors;
    },
    onSubmit: (values, { resetForm }) => {
      if (currentEmployee) {
        updateEmployee(values);
      } else {
        addEmployee(values);
      }
      resetForm();
    },
    enableReinitialize: true,
  });

  const addEmployee = (values) => {
    setEmployees([...employees, { ...values, id: Date.now() }]);
    toast.success(`${values.name} employee added to the system.`, {
      position: "bottom-right"
    });
  };

  const deleteEmployee = (id) => {
    setEmployees(employees.filter((emp) => emp.id !== id));
    toast.success("Employee deleted.", {
      position: "bottom-right"
    });
  };

  const openEditModal = (employee) => {
    setCurrentEmployee(employee);
    formik.setValues({
      name: employee.name,
      jobTitle: employee.jobTitle,
      email: employee.email,
    });
    setShowModal(true);
  };

  const updateEmployee = (values) => {
    setEmployees(
      employees.map((emp) =>
        emp.id === currentEmployee.id ? { ...currentEmployee, ...values } : emp
      )
    );
    setShowModal(false);
    setCurrentEmployee(null);
  };

  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <Container className="app-container">
      <ToastContainer />
      <Row className="my-4">
        <Col className="text-center">
          <h1 className="text-light">Employee Management</h1>
        </Col>
      </Row>

      <Row>
        <Col className="d-flex justify-content-center">
          <Form.Control
            type="text"
            placeholder="Filter by name"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter-input"
          />
        </Col>
      </Row>

      <Row className="my-4">
        <Col className="d-flex justify-content-center">
        <Form onSubmit={formik.handleSubmit}>
  <Row>
    <Col xs={12} sm={4}>
      <Form.Group>
        <Form.Control
          type="text"
          name="name"
          placeholder="Name"
          value={formik.values.name}
          onChange={formik.handleChange}
          className="input-field"
        />
        {formik.errors.name ? (
          <div className="text-danger">{formik.errors.name}</div>
        ) : null}
      </Form.Group>
    </Col>
    <Col xs={12} sm={4}>
      <Form.Control
        type="text"
        name="jobTitle"
        placeholder="Job Title"
        value={formik.values.jobTitle}
        onChange={formik.handleChange}
        className="input-field"
      />
    </Col>
    <Col xs={12} sm={4}>
      <Form.Control
        type="email"
        name="email"
        placeholder="Email"
        value={formik.values.email}
        onChange={formik.handleChange}
        className="input-field"
      />
    </Col>
    <Col xs={12} className="d-flex justify-content-center">
      <Button type="submit" variant="primary" className="add-button">
        {currentEmployee ? "Update Employee" : "Add Employee"}
      </Button>
    </Col>
  </Row>
</Form>

        </Col>
      </Row>

      <Row>
  <Col>
    <div className="employee-list-box">
      <Row className="employee-header">
        <Col xs={12} sm={3}><strong>Name</strong></Col>
        <Col xs={12} sm={3}><strong>Job Title</strong></Col>
        <Col xs={12} sm={3}><strong>Email</strong></Col>
        <Col xs={12} sm={3} className="text-right"><strong>Actions</strong></Col>
      </Row>
      <ul className="list-group employee-list">
        {filteredEmployees.map((employee) => (
          <li key={employee.id} className="list-group-item employee-box">
            <Row>
              <Col xs={12} sm={3}>{employee.name}</Col>
              <Col xs={12} sm={3}>{employee.jobTitle}</Col>
              <Col xs={12} sm={3}>{employee.email}</Col>
              <Col xs={12} sm={3}>
                <div className="d-flex justify-content-end">
                  <Button
                    variant="warning"
                    onClick={() => openEditModal(employee)}
                    className="mr-2"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => deleteEmployee(employee.id)}
                  >
                    Delete
                  </Button>
                </div>
              </Col>
            </Row>
          </li>
        ))}
      </ul>
    </div>
  </Col>
</Row>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
  <Modal.Header closeButton>
    <Modal.Title>Edit Employee</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form onSubmit={formik.handleSubmit}>
      <Form.Group>
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          disabled
        />
        {formik.errors.name ? (
          <div className="text-danger">{formik.errors.name}</div>
        ) : null}
      </Form.Group>
      <Form.Group>
        <Form.Label>Job Title</Form.Label>
        <Form.Control
          type="text"
          name="jobTitle"
          value={formik.values.jobTitle}
          onChange={formik.handleChange}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          name="email"
          value={formik.values.email}
          onChange={formik.handleChange}
        />
      </Form.Group>
    </Form>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowModal(false)}>
      Close
    </Button>
    <Button
      variant="primary"
      onClick={formik.handleSubmit} // Explicitly trigger form submission
    >
      Save Changes
    </Button>
  </Modal.Footer>
</Modal>

    </Container>
  );
}

export default App; 