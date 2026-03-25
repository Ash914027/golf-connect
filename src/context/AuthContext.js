import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Logout
  const logout = useCallback(async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/logout");
    } catch (error) {
      // ignore error
    }
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  }, []);

  // ✅ Refresh Token
  const refreshAccessToken = useCallback(async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) return false;

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/refresh",
        { refreshToken }
      );

      const { accessToken } = response.data;

      localStorage.setItem("token", accessToken);
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${accessToken}`;

      return true;
    } catch (error) {
      logout();
      return false;
    }
  }, [logout]);

  // ✅ Initialize Auth (Auto login)
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${token}`;
        await refreshAccessToken();
      }

      setLoading(false);
    };

    initAuth();
  }, [refreshAccessToken]);

  // ✅ Axios Interceptor
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (
          error.response?.status === 401 &&
          !error.config._retry
        ) {
          error.config._retry = true;

          const refreshed = await refreshAccessToken();

          if (refreshed) {
            error.config.headers[
              "Authorization"
            ] = axios.defaults.headers.common["Authorization"];
            return axios(error.config);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [refreshAccessToken]);

  // ✅ Login
  const login = async (email, password) => {
    const response = await axios.post(
      "http://localhost:5000/api/auth/login",
      { email, password }
    );

    const { accessToken, refreshToken, user: userData } =
      response.data;

    localStorage.setItem("token", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${accessToken}`;

    setUser(userData);
    return userData;
  };

  // ✅ Signup
  const signup = async (username, email, password, role) => {
    const response = await axios.post(
      "http://localhost:5000/api/auth/signup",
      { username, email, password, role }
    );

    const { accessToken, refreshToken, user: userData } =
      response.data;

    localStorage.setItem("token", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${accessToken}`;

    setUser(userData);
    return userData;
  };

  const value = {
    user,
    login,
    signup,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
