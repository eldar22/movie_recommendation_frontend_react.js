import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import {
  Row,
  Col,
  Button,
  Form,
  Card,
  Container,
  Spinner,
  Offcanvas,
  CloseButton,
  Navbar,
  Nav
} from "react-bootstrap";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import axios from "axios";
import { sort } from "fast-sort";
import { FormLabel } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCookies } from "react-cookie";
import getCookie from "./Cookies/getCookie";
import Cookies from "js-cookie";
import deleteCookie from "./Cookies/deleteCookie";
var localStorage = require("localStorage");

function MoviesList() {
  const [movieList, setMovieList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedMovies, setSavedMovies] = useState([]);
  const [genre, setGenre] = useState("action");
  const [user, setUser] = useState([]);
  const [sortOption, setSortOption] = useState("default");
  const [sorted, setSorted] = useState([]);
  //const [getCookie, setCookie] = useState(GetCookie("user"));

  useEffect(async () => {
    try {
      await axios
        //.get("https://imdb-api.com/en/API/Top250Movies/k_o8ktb4x4")
        .get(
          `https://imdb-api.com/API/AdvancedSearch/k_o8ktb4x4/?genres=${genre}`
        )
        .then((res) => {
          //setTitle(res.data.Title);
          //setMovieList(res.data.items);
          setMovieList(res.data.results);
          setSorted(res.data.results);
          console.log(res.data);
        });

      await axios
        .get(`http://localhost:3000/movies_list`, {
          headers: { Authorization: `Bearer ${getCookie("user")}` }
        })
        .then((res) => {
          localStorage.setItem("savedMovies", res.data.savedMovies);
          setSavedMovies(JSON.parse(localStorage.getItem("savedMovies")));
        });

      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  }, [genre]);

  useEffect(async () => {
    await axios
      .get(`http://localhost:3000/movies_list`, {
        headers: { Authorization: `Bearer ${getCookie("user")}` }
      })
      .then((res) => {
        if (
          res.data === "Invalid cookie" ||
          res.data === "Not logged in!" ||
          getCookie("user") === undefined
        ) {
          window.location.href = "http://localhost:3001/login";
        } else {
          localStorage.setItem(
            "user",
            JSON.stringify({
              firstName: res.data.firstName,
              lastName: res.data.lastName
            })
          );
          //setUser([res.data.firstName, res.data.lastName]);
          setUser([
            JSON.parse(localStorage.getItem("user")).firstName,
            JSON.parse(localStorage.getItem("user")).lastName
          ]);

          console.log(user[0]);
        }
      });
  }, []);

  const updateSavedMovies = async () => {
    await axios
      .get(`http://localhost:3000/movies_list`, {
        headers: { Authorization: `Bearer ${getCookie("user")}` }
      })
      .then((res) => {
        setSavedMovies(JSON.parse(localStorage.getItem("savedMovies")));
      });
  };

  if (loading === true) {
    return (
      <Row className="loading-page">
        <Col sm={1} className="loading-spinner">
          <Spinner animation="border" role="status" variant="light">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </Col>
      </Row>
    );
  } else {
    function Filter() {
      const handleChange = (event) => {
        setGenre(event.target.value);
        setLoading(true);
      };

      return (
        <FormControl
          sx={{ m: 1, minWidth: 120 }}
          size="small"
          id="select-genre"
        >
          <InputLabel id="select-small-label">Genre</InputLabel>
          <Select
            id="select-small"
            value={genre}
            label="Genre"
            variant="outlined"
            onChange={handleChange}
          >
            <MenuItem value={"action"}>Action</MenuItem>
            <MenuItem value={"horror"}>Horror</MenuItem>
            <MenuItem value={"comedy"}>Comedy</MenuItem>
          </Select>
        </FormControl>
      );
    }

    function Sort() {
      const handleChange = (event) => {
        setSortOption(event.target.value);
      };

      return (
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small" id="sort-select">
          <InputLabel id="select-small-label">Sort</InputLabel>
          <Select
            id="select-small"
            value={sortOption}
            label="Sort"
            variant="outlined"
            onChange={handleChange}
          >
            <MenuItem
              value={"default"}
              onClick={() => {
                setSorted(movieList);
              }}
            >
              Default
            </MenuItem>
            <MenuItem
              value={"imDbRatingUp"}
              onClick={() => {
                setSorted(sort(movieList).asc((u) => u.imDbRating));
              }}
            >
              Rating{" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                fill="currentColor"
                class="bi bi-sort-down-alt"
                viewBox="0 0 16 16"
              >
                <path d="M3.5 3.5a.5.5 0 0 0-1 0v8.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L3.5 12.293V3.5zm4 .5a.5.5 0 0 1 0-1h1a.5.5 0 0 1 0 1h-1zm0 3a.5.5 0 0 1 0-1h3a.5.5 0 0 1 0 1h-3zm0 3a.5.5 0 0 1 0-1h5a.5.5 0 0 1 0 1h-5zM7 12.5a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 0-1h-7a.5.5 0 0 0-.5.5z" />
              </svg>
            </MenuItem>
            <MenuItem
              value={"imDbRatingDown"}
              onClick={() => {
                setSorted(sort(movieList).desc((u) => u.imDbRating));
              }}
            >
              Rating
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                fill="currentColor"
                class="bi bi-sort-down"
                viewBox="0 0 16 16"
              >
                <path d="M3.5 2.5a.5.5 0 0 0-1 0v8.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L3.5 11.293V2.5zm3.5 1a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zM7.5 6a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zm0 3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3zm0 3a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1z" />
              </svg>
            </MenuItem>
            <MenuItem
              value={"descriptionUp"}
              onClick={() => {
                setSorted(sort(movieList).asc((u) => u.description));
              }}
            >
              Release date{"  "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                fill="currentColor"
                class="bi bi-sort-down-alt"
                viewBox="0 0 16 16"
              >
                <path d="M3.5 3.5a.5.5 0 0 0-1 0v8.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L3.5 12.293V3.5zm4 .5a.5.5 0 0 1 0-1h1a.5.5 0 0 1 0 1h-1zm0 3a.5.5 0 0 1 0-1h3a.5.5 0 0 1 0 1h-3zm0 3a.5.5 0 0 1 0-1h5a.5.5 0 0 1 0 1h-5zM7 12.5a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 0-1h-7a.5.5 0 0 0-.5.5z" />
              </svg>
            </MenuItem>
            <MenuItem
              value={"descriptionDown"}
              onClick={() => {
                setSorted(sort(movieList).desc((u) => u.description));
              }}
            >
              Release date
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                fill="currentColor"
                class="bi bi-sort-down"
                viewBox="0 0 16 16"
              >
                <path d="M3.5 2.5a.5.5 0 0 0-1 0v8.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L3.5 11.293V2.5zm3.5 1a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zM7.5 6a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zm0 3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3zm0 3a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1z" />
              </svg>
            </MenuItem>
          </Select>
        </FormControl>
      );
    }

    const savedMoviesList = savedMovies.map((item, index) => {
      return (
        <li key={index} className="saved-movies-list-item">
          <div>
            <img src={item.image} className="saved-movie-poster" />
            {item.title}
            <CloseButton
              className="remove-saved-movie-button"
              onClick={async () => {
                try {
                  await axios
                    .delete(`http://localhost:3000/movies_list`, {
                      data: {
                        title: item.title,
                        movieId: item.movieId
                      }
                    })
                    .then((res) => {
                      if (res.data === "Deleted!") {
                        updateSavedMovies();
                      }
                    });
                } catch (err) {
                  console.log(err);
                }
              }}
            />
          </div>
        </li>
      );
    });

    function OffCanvasExample({ name, ...props }) {
      const [show, setShow] = useState(false);

      const handleClose = () => setShow(false);
      const handleShow = () => setShow(true);

      return (
        <>
          <Button
            variant="secondary"
            onClick={handleShow}
            className="me-2 "
            id="profile-button"
          >
            {name}
          </Button>

          <Offcanvas show={show} onHide={handleClose} {...props}>
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>Profile</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <h6>
                {user[0]} {user[1]}
              </h6>
              <h6>Saved movies</h6>
              <ul className="saved-movies-list">{savedMoviesList}</ul>
              <Button
                variant="primary"
                onClick={async () => {
                  deleteCookie("user");
                  window.location.href = "http://localhost:3001/login";
                }}
              >
                Log out
              </Button>
            </Offcanvas.Body>
          </Offcanvas>
        </>
      );
    }

    const itemList = sorted.map((item, index) => {
      //movieList
      return (
        <Col xs={6} sm={4} md={3} lg={2} key={index} className="movie-card">
          <Card>
            <Card.Img variant="top" src={item.image} className="movie-poster" />
            <Card.Body>
              {/*<Card.Title>{item.title}</Card.Title>*/}

              <Button
                variant="primary"
                onClick={async (e) => {
                  e.preventDefault();
                  try {
                    await axios
                      .post(
                        "http://localhost:3000/movie",
                        {
                          movieId: item.id,
                          image: item.image,
                          title: item.title,
                          actors: item.crew,
                          year: item.year,
                          rating: item.imDbRating,
                          runtime: item.runtimeStr,
                          plot: item.plot,
                          genre: item.genres
                        },
                        {
                          headers: {
                            Authorization: `Bearer ${getCookie("user")}`
                          }
                        }
                      )
                      .then((window.location.href = "/movie"));
                  } catch (err) {
                    return console.log(err);
                  }
                }}
              >
                Details
              </Button>
            </Card.Body>
          </Card>
        </Col>
      );
    });
    return (
      <div className="movie-list-container">
        {/*<header className="app-header">
          List of movies
          <SelectSmall />
          <OffCanvasExample placement={"end"} name="Profile" />
    </header>*/}
        <h5 style={{ color: "white" }}>List of movies</h5>
        <Navbar
          expand={"sm"}
          bg="light"
          variant="light"
          id="nav-bar"
          sticky="top"
        >
          <Container>
            <Nav className="me-auto">
              <Nav.Item>
                <Filter />
              </Nav.Item>
              <Nav.Item>
                <Sort />
              </Nav.Item>
              <Nav.Item>
                <OffCanvasExample placement={"end"} name="Profile" />
              </Nav.Item>
            </Nav>
          </Container>
        </Navbar>

        <Container fluid>
          <Row>{itemList}</Row>
        </Container>
      </div>
    );
  }
}

export default MoviesList;
