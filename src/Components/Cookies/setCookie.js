import Cookies from "js-cookie";

const setCookie = (name, value) => {
  Cookies.set(name, value, { path: "/" });
};

export default setCookie;
