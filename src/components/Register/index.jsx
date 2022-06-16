import axios from "axios";
import { useHistory } from "react-router-dom";
import "./style.css";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

function Register() {
  let history = useHistory();

  const formSchema = yup.object().shape({
    email: yup
      .string()
      .required("Insira seu email")
      .email("Insira um email válido"),
    password: yup
      .string()
      .required("Insira uma senha")
      .min(6, "Mínimo 6 caractéres"),
    confirmPass: yup
      .string()
      .required("Confirme sua senha")
      .oneOf([yup.ref("password")], "Senhas não correspondem"),
    bio: yup.string().required("Escreva uma bio"),
    contact: yup.string().required("Insira um contato"),
    course_module: yup.string().required("Selecione seu módulo"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(formSchema),
  });

  function onSubmit(formData) {
    console.log(formData);
    axios
      .post("https://kenziehub.herokuapp.com/users", formData)
      .then((res) => {
        history.push("/");
      })
      .catch((err) => console.log(err.response.data.message));
  }

  return (
    <>
      <header>
        <h1>Kenzie Hub</h1>
        <button onClick={() => history.push("/")}>Voltar</button>
      </header>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2>Crie sua conta</h2>
        <div className="name-box">
          <label>Nome</label>
          <input {...register("name")} />
          <span className="error">{errors.name?.message}</span>
        </div>
        <div className="email-box">
          <label>Email</label>
          <input {...register("email")} />
          <span className="error">{errors.email?.message}</span>
        </div>
        <div className="password-box">
          <label>Senha</label>
          <input {...register("password")} type="password" />
          <span className="error">{errors.password?.message}</span>
        </div>
        <div className="confirm-box">
          <label>Confirmar Senha</label>
          <input {...register("confirmPass")} type="password" />
          <span className="error">{errors.confirmPass?.message}</span>
        </div>
        <div className="bio-box">
          <label>Bio</label>
          <input {...register("bio")} />
          <span className="error">{errors.bio?.message}</span>
        </div>
        <div className="contact-box">
          <label>Contato</label>
          <input {...register("contact")} />
          <span className="error">{errors.contact?.message}</span>
        </div>
        <div className="module-box">
          <select {...register("course_module")}>
            <option></option>
            <option>Primeiro Módulo</option>
            <option>Segundo Módulo</option>
            <option>Terceiro Módulo</option>
            <option>Quarto Módulo</option>
            <option>Quinto Módulo</option>
            <option>Sexto Módulo</option>
          </select>
          <span className="error">{errors.course_module?.message}</span>
        </div>
        <button type="submit">Cadastrar</button>
      </form>
    </>
  );
}

export default Register;
