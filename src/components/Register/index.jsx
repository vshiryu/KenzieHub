import axios from "axios";
import { useHistory } from "react-router-dom";
import "./style.css";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

function Register() {
  let history = useHistory();

  const formSchema = yup.object().shape({
    name: yup.string().required("Insira seu nome"),
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
        toast.success("Cadastro realizado com sucesso", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          onClose: () => history.push("/"),
        });
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

  return (
    <main className="register-container">
      <header className="register-header">
        <h1>Kenzie Hub</h1>
        <button onClick={() => history.push("/")} className="back-btn">
          Voltar
        </button>
      </header>
      <form onSubmit={handleSubmit(onSubmit)} className="register-form">
        <h2 className="register-title">Crie sua conta</h2>
        <span className="register-span">Rápido e grátis, vamos nessa</span>
        <div className="name-box">
          <label>Nome</label>
          <input
            {...register("name")}
            className="register-input"
            placeholder="Digite aqui seu nome"
          />
          <span className="error">{errors.name?.message}</span>
        </div>
        <div className="email-box">
          <label>Email</label>
          <input
            {...register("email")}
            className="register-input"
            placeholder="Digite aqui seu email"
          />
          <span className="error">{errors.email?.message}</span>
        </div>
        <div className="password-box">
          <label>Senha</label>
          <input
            {...register("password")}
            type="password"
            className="register-input"
            placeholder="Digite aqui sua senha"
          />
          <span className="error">{errors.password?.message}</span>
        </div>
        <div className="confirm-box">
          <label>Confirmar Senha</label>
          <input
            {...register("confirmPass")}
            type="password"
            className="register-input"
            placeholder="Confirme aqui sua senha"
          />
          <span className="error">{errors.confirmPass?.message}</span>
        </div>
        <div className="bio-box">
          <label>Bio</label>
          <input
            {...register("bio")}
            className="register-input"
            placeholder="Fale sobre você"
          />
          <span className="error">{errors.bio?.message}</span>
        </div>
        <div className="contact-box">
          <label>Contato</label>
          <input
            {...register("contact")}
            className="register-input"
            placeholder="Opção de contato"
          />
          <span className="error">{errors.contact?.message}</span>
        </div>
        <div className="module-box">
          <label>Selecionar módulo</label>
          <select {...register("course_module")} className="register-input">
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
        <button
          type="submit"
          className="register-btn"
          disabled={Object.keys(errors).length}
        >
          Cadastrar
        </button>
      </form>
      <ToastContainer theme="dark" />
    </main>
  );
}

export default Register;
