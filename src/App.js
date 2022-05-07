import logo from "./logo.svg";
import "./App.css";
import Profile from "./Components/Profile";
import Login from "./Components/Login";
import Registration from "./Components/Registration";
import MoviesList from "./Components/MoviesList";
import Movie from "./Components/Movie";
import { BrowserRouter, Route, Switch } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <header className="App-header"></header>
      <BrowserRouter>
        <Switch>
          <Route path="/registration">
            <Registration />
          </Route>
          <Route path="/profile">
            <Profile />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/movies_list">
            <MoviesList />
          </Route>
          <Route path="/movie">
            <Movie />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
