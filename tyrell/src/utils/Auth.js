import jwtDecode from "jwt-decode";

export const Auth = {
  setAuthToken: token => {
    if (token) {
      Auth.setAccessToken(token);
    }
  },

  token: () => {
    return localStorage.token;
  },

  setAccessToken: token => {
    localStorage.token = token;
  },

  getAccessToken: token => {
    return localStorage.token;
  },

  deleteAccessToken: () => {
    delete localStorage.token;
  },

  setRefreshToken: refreshToken => {
    localStorage.refreshToken = refreshToken;
  },

  getRefreshToken: refreshToken => {
    return localStorage.refreshToken;
  },

  deleteRefreshToken: () => {
    delete localStorage.refreshToken;
  },

  loggedIn: () => {
    const token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refreshToken");
    if (!token || !refreshToken) {
      return false;
    }

    try {
      const { exp } = jwtDecode(refreshToken);

      if (exp < new Date().getTime() / 1000) {
        return false;
      }
    } catch (e) {
      return false;
    }

    return true;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
  }
};

export default () => {
  const token = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refreshToken");
  if (!token || !refreshToken) {
    return false;
  }

  try {
    const { exp } = jwtDecode(refreshToken);

    if (exp < new Date().getTime() / 1000) {
      return false;
    }
  } catch (e) {
    return false;
  }

  return true;
};
