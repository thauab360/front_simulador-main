import React, { useState } from "react";
import AxiosInstance from "../core/axiosInstance";
import "./LoginScreen.css";
import LogoSCC from "./Assets/logoSCC.png";
import { Link } from "@mui/material";

const LoginScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading] = useState(false);
  const onChangeUsername = (e) => {
    setUsername(e.target.value);
  };

  const onChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = async () => {
    try {
      const config = {
        auth: {
          username: username,
          password: password,
        },
      };
      console.log(username, password);

      const response = await AxiosInstance.get(
        "http://localhost:5000/login/authorization", config
      );
      console.log(response);
      const accessToken = response.data;

      localStorage.setItem("accessToken", accessToken);

      window.location.href = "/simulation";
    } catch (error) {
      console.error("Erro ao fazer login:", error);
    }
  };

  return (
    <div className="container">
      <div className="screen">
        <div className="screen__content">
          <img src={LogoSCC} alt="Logo da Empresa" className="logo" />
          <form className="login">
            <div className="login__field">
              <i className="login__icon fas fa-user"></i>
              <input
                type="text"
                className="login__input"
                placeholder="Usuário"
                onChange={onChangeUsername}
              />
            </div>
            <div className="login__field">
              <i className="login__icon fas fa-lock"></i>
              <input
                type="password"
                className="login__input"
                placeholder="Senha"
                onChange={onChangePassword}
              />
            </div>
            <Link to="/Simulation">
              <button
                type="button"
                className="button login__submit"
                onClick={handleLogin}
                disabled={loading}
              >
                <span className="button__text">
                  {loading ? "Carregando..." : "ENTRAR"}
                </span>
                <i className="button__icon fas fa-chevron-right"></i>
              </button>
            </Link>
          </form>
        </div>
        <div className="screen__background">
          <span className="screen__background__shape screen__background__shape4"></span>
          <span className="screen__background__shape screen__background__shape3"></span>
          <span className="screen__background__shape screen__background__shape2"></span>
          <span className="screen__background__shape screen__background__shape1"></span>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
