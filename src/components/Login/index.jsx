import axios from "axios";
import { useHistory } from "react-router-dom";
import "./style.css";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

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
        setLoggedIn(true);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setUserInfo(res.data.user);
        console.log(res.data);
      })
      .catch((err) => console.log(err));
  }

  function togglePassword() {
    setPasswordShown(!passwordShown);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Login</h2>
      <div className="email-box">
        <label htmlFor="email">Email</label>
        <input name="email" {...register("email")} />
        <span className="error">{errors.email?.message}</span>
      </div>
      <div className="password-box">
        <label htmlFor="password">Senha</label>
        <input
          name="password"
          {...register("password")}
          type={passwordShown ? "text" : "password"}
        />
        {!passwordShown ? (
          <AiFillEye onClick={togglePassword} />
        ) : (
          <AiFillEyeInvisible onClick={togglePassword} />
        )}
        <span className="error">{errors.password?.message}</span>
      </div>
      <button type="submit">Entrar</button>
      <span>Ainda não possui uma conta?</span>
      <button
        type="button"
        onClick={() => {
          history.push("/register");
        }}
      >
        Cadastre-se
      </button>
    </form>
  );
}

export default Login;
