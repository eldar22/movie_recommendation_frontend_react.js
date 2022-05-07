import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { Row, Col, Button, Form, Container } from "react-bootstrap";
import { useCookies } from "react-cookie";
import axios from "axios";
import MoviesList from "./MoviesList";
import setCookie from "./Cookies/setCookie";
import Cookies from "js-cookie";
//import { setCookie } from "../Cookies/Cookies";
//import { cookies, setCookie } from "./Cookies/Cookies";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="login-body">
      <Container fluid>
        <Row>
          <Col sm={3} className="login-form">
            <h3 className="login-page-info">Login page</h3>
            <Form
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  await axios
                    .post("http://localhost:3000/login", {
                      email: email,
                      password: password
                    })
                    .then((res) => {
                      if (res.data.status === "Login passed!") {
                        setCookie("user", res.data.token);
                        window.location.href = `http://localhost:3001/movies_list`;
                      } else {
                        alert("Login failed!");
                      }
                    });
                } catch (err) {
                  return console.log(err);
                }
              }}
            >
              <Form.Group className="mb-3" controlId="formBasicEmail">
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

              <Form.Group className="mb-3" controlId="formBasicPassword">
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
          {/*<Col sm={9} className="login-page-info">
            <h1>EMovies</h1>
                </Col>*/}
        </Row>
      </Container>
    </div>
  );
}

export default Login;
