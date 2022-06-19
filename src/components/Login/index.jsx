import axios from "axios";
import { useHistory } from "react-router-dom";
import "./style.css";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

function Login({ setUserInfo, setLoggedIn }) {
  let history = useHistory();

  const [passwordShown, setPasswordShown] = useState(false);

  const formSchema = yup.object().shape({
    email: yup.string().required("Insira seu email").email(),
    password: yup.string().required("Insira sua senha"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(formSchema),
  });

  function onSubmit(formData) {
    axios
      .post("https://kenziehub.herokuapp.com/sessions", formData)
      .then((res) => {
        toast.success("Login realizado com sucesso", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          onClose: () => setLoggedIn(true),
        });
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setUserInfo(res.data.user);
      })
      .catch((err) => {
        toast.error(err.response.data.message, {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
  }

  function togglePassword() {
    setPasswordShown(!passwordShown);
  }

  return (
    <main className="login-container">
      <h1 className="title">Kenzie Hub</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="login-form">
        <h2 className="login-title">Login</h2>
        <div className="email-box">
          <label htmlFor="email">Email</label>
          <input name="email" {...register("email")} className="login-input" />
          <span className="error">{errors.email?.message}</span>
        </div>
        <div className="password-box">
          <label htmlFor="password">Senha</label>
          <input
            className="login-input"
            name="password"
            {...register("password")}
            type={passwordShown ? "text" : "password"}
          />
          <span className="error">{errors.password?.message}</span>
          {!passwordShown ? (
            <AiFillEye onClick={togglePassword} className="pass-visible" />
          ) : (
            <AiFillEyeInvisible
              onClick={togglePassword}
              className="pass-visible"
            />
          )}
        </div>
        <button type="submit" className="login-btn">
          Entrar
        </button>
        <span className="btn-span">Ainda não possui uma conta?</span>
        <button
          className="redirect-register-btn"
          type="button"
          onClick={() => {
            history.push("/register");
          }}
        >
          Cadastre-se
        </button>
      </form>
      <ToastContainer theme="dark" />
    </main>
  );
}

export default Login;
