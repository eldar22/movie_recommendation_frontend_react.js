import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { Row, Col, Button, Form, Container } from "react-bootstrap";
import axios from "axios";

function Registration() {
  const [f_name, setF_name] = useState("");
  const [l_name, setL_name] = useState("");
  const [tel, setTel] = useState(0);
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="registration-body">
      <Container fluid>
        <Row>
          <Col sm={3} className="registration-form">
            <h3>Registration page</h3>
            <Form
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  await axios
                    .post("http://localhost:3000/registration", {
                      first_name: f_name,
                      last_name: l_name,
                      tel: tel,
                      dob: dob,
                      email: email,
                      password: password
                    })
                    .then((res) => {
                      if (res.data === "Registered!") {
                        window.location.href = "http://localhost:3001/login";
                      }
                    });
                } catch (err) {
                  return console.log(err);
                }
              }}
            >
              <Form.Group className="mb-3" id="formRegFirstName">
                <Form.Label>First name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="First name"
                  value={f_name}
                  onChange={(e) => {
                    setF_name(e.target.value);
                  }}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formRegLastName">
                <Form.Label>Last name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Last name"
                  value={l_name}
                  onChange={(e) => {
                    setL_name(e.target.value);
                  }}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formRegDoB">
                <Form.Label>Date of birth</Form.Label>
                <Form.Control
                  type="date"
                  placeholder="Date of birth"
                  value={dob}
                  onChange={(e) => {
                    setDob(e.target.value);
                  }}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formRegEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formRegPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
              </Form.Group>

              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
          </Col>
          <Col sm={2}></Col>
          <Col sm={4}>
            <img src="https://icon-library.com/images/movie-app-icon/movie-app-icon-27.jpg" />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Registration;
