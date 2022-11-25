import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import {
  Row,
  Col,
  Button,
  Form,
  Container,
  FloatingLabel,
  Spinner
} from "react-bootstrap";
import axios from "axios";
import $ from "jquery";
import { useCookies } from "react-cookie";
import Cookies from "js-cookie";
import getCookie from "./Cookies/getCookie";

function Movie() {
  const [movieId, setMovieId] = useState("");
  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");
  const [actors, setActors] = useState("");
  const [year, setYear] = useState("");
  const [rating, setRating] = useState("");
  const [runtime, setRuntime] = useState("");
  const [genre, setGenre] = useState("");
  const [plot, setPlot] = useState("");
  const [loadedComments, setLoadedComments] = useState([]);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [videoUrl, setVideoUrl] = useState("");
  const [savedStatus, setSavedStatus] = useState("");
  //const [user, setUser] = useState([]);

  useEffect(async () => {
    try {
      await axios
        .get("http://localhost:3000/movie", {
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
            const movieInfo = JSON.parse(res.data.movieInfo);

            setMovieId(movieInfo.movieId);
            setImage(movieInfo.image);
            setTitle(movieInfo.title);
            setActors(movieInfo.actors);
            setRating(movieInfo.rating);
            setYear(movieInfo.year);
            setRuntime(movieInfo.runtime);
            setGenre(movieInfo.genre);
            setPlot(movieInfo.plot);
            setLoadedComments(JSON.parse(res.data.comments));
            setSavedStatus(res.data.status);
          }
        });

      await axios
        .get(
          "https://imdb-api.com/en/API/YouTubeTrailer/k_o8ktb4x4/" +
            `${movieId}`
        )
        .then((res) => {
          setVideoUrl("https://www.youtube.com/embed/" + res.data.videoId);
        });
      console.log(title);

      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  }, [loading, savedStatus, movieId]);

  const loadNewComment = async () => {
    await axios
      .get("http://localhost:3000/movie", {
        headers: { Authorization: `Bearer ${getCookie("user")}` }
      })
      .then((res) => {
        setLoadedComments(JSON.parse(res.data.comments));
      });
  };

  const handleSave = () => {
    return (
      <Button
        variant="primary"
        className="save-button"
        onClick={async (e) => {
          e.preventDefault();
          try {
            await axios
              .post(
                "http://localhost:3000/movie",
                {
                  movieId: movieId,
                  title: title,
                  saved: "true"
                },
                {
                  headers: { Authorization: `Bearer ${getCookie("user")}` }
                }
              )
              .then((res) => {
                if (res.data === "Saved!") {
                  console.log("Saved!");
                  $(".save-button").prop("disabled", true);
                  $(".save-button").text("Saved");
                  $(".save-button").css("background", "transparent");
                }
              });
          } catch (err) {
            return console.log(err);
          }
        }}
      >
        Save
      </Button>
    );
  };

  const handleSavedStatus = () => {
    if (savedStatus === "true") {
      return (
        <Button variant="primary" id="disabled-save-button" disabled="true">
          Saved
        </Button>
      );
    } else {
      return handleSave();
    }
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
    const showComments = loadedComments.map((item, index) => {
      return (
        <li key={index}>
          <div>
            <b> {item.user} </b>
            <p> {item.comment} </p>
          </div>
        </li>
      );
    });

    return (
      <div className="movie-page-body">
        <Container fluid>
          <Row
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Col
              xs={12}
              sm={9}
              md={3}
              lg={2}
              style={{ marginRight: "20px" }}
              className="movie-poster-container"
            >
              <div>
                <img src={image} className="movie-page-poster" />
              </div>
            </Col>
            <Col xs={12} sm={9} md={8} lg={9}>
              <h3 className="movie-page-title">{title}</h3>
              <h5>Runtime: {runtime}</h5>
              <h5>Imdb rating: {rating}</h5>
              <h5>{genre}</h5>
              <h6>{actors}</h6>
              <p>{plot}</p>
              {handleSavedStatus()}
            </Col>
          </Row>
          <hr />
          <Row
            style={{
              display: "flex",
              justifyContent: "space-between",
              margin: "0 10px 0 10px"
            }}
          >
            <Col
              xs={12}
              sm={12}
              md={5}
              lg={5}
              className="trailer"
              style={{ padding: "0px", marginRight: "5px", height: "40vh" }}
            >
              <p className="section-name">Trailer</p>
              <iframe title="nn" width="100%" height="100%" src={videoUrl} />
            </Col>

            <Col
              xs={12}
              sm={12}
              md={5}
              lg={5}
              className="comment-section"
              style={{ padding: "0px", marginLeft: "5px", height: "40vh" }}
            >
              <p className="section-name">Comments</p>
              <Row className="comments">
                <ul className="comment">{showComments}</ul>
              </Row>
              <Col
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "0px",
                  height: "40px"
                }}
                className="comment-input"
              >
                <div
                  style={{
                    width: "90%",
                    height: "100%",
                    marginRight: "5px"
                  }}
                >
                  <textarea
                    placeholder="Leave a comment..."
                    value={comment}
                    onChange={(e) => {
                      setComment(e.target.value);
                    }}
                    style={{ width: "100%", height: "100%" }}
                  />
                </div>
                <div style={{ width: "60px", height: "100%" }}>
                  <Button
                    variant="primary"
                    onClick={async (e) => {
                      e.preventDefault();
                      try {
                        await axios
                          .post(
                            "http://localhost:3000/movie",
                            {
                              movieId: movieId,
                              comment: comment
                            },
                            {
                              headers: {
                                Authorization: `Bearer ${getCookie("user")}`
                              }
                            }
                          )
                          .then((res) => {
                            if (res.data === "New post!") {
                              setComment("");
                              //setLoading(true);
                              loadNewComment();
                            }
                          });
                      } catch (err) {
                        return console.log(err);
                      }
                    }}
                    style={{ width: "100%" }}
                  >
                    Post
                  </Button>
                </div>
              </Col>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Movie;
