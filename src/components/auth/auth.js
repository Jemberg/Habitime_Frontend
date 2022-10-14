import Cookie from "js-cookie";

// Set token and user in cookies and localStorage upon authentication.
export const authenticate = (response, next) => {
  if (response.token !== undefined || response.user !== undefined) {
    Cookie.set("token", response.token, {
      expires: 7,
    });

    localStorage.setItem("user", JSON.stringify(response.user));
    next();
  }
};

// Checks if token and user objects are in storage.
export const checkAuthentication = () => {
  if (Cookie.get() && localStorage.getItem("user")) {
    return JSON.parse(localStorage.getItem("user"));
  } else return false;
};

// Removes locally stored token and user when logging out.
export const logOut = (next) => {
  Cookie.remove("token");
  localStorage.removeItem("user");
  next();
};
