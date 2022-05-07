import Cookies from "js-cookie";

const deleteCookie = (name) => {
  return Cookies.remove(name);
};

export default deleteCookie;
