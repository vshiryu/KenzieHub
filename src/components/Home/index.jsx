import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Techs from "../Techs";
import Modal from "react-modal";
import "./style.css";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

Modal.setAppElement("#root");

function Home({ userInfo, setLoggedIn, loggedIn }) {
  let history = useHistory();

  const [techs, setTechs] = useState(
    !localStorage.techs || localStorage.techs === "undefined"
      ? userInfo?.techs
      : JSON.parse(localStorage.techs)
  );

  const [modalIsOpen, setModalIsOpen] = useState(false);

  function openModal() {
    setModalIsOpen(true);
  }

  function closeModal() {
    setModalIsOpen(false);
  }

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      width: "90%",
      maxWidth: "400px",
      height: "350px",
      backgroundColor: "rgba(33, 37, 41, 1)",
      borderRadius: "5px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "0",
      color: "white",
    },
  };

  function handleQuit() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("techs");
    setLoggedIn(false);
    history.push("/");
  }

  useEffect(() => {
    !loggedIn && history.push("/");
  }, []);

  useEffect(() => {
    localStorage.techs = JSON.stringify(techs);
  }, [techs]);

  const formSchema = yup.object().shape({
    title: yup.string().required("Insira uma tecnologia"),
    status: yup.string().required("Selecione um status"),
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
      .post("https://kenziehub.herokuapp.com/users/techs", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.token}`,
        },
      })
      .then((res) => {
        toast.success("Tecnologia cadastrada com sucesso", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          onClose: () => {
            closeModal();
          },
        });
        setTechs([...techs, res.data]);
      })
      .catch((err) =>
        toast.error(err.response.data.message, {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })
      );
  }

  return (
    <main className="home-container">
      <header className="home-header">
        <div className="header-content">
          <h1>Kenzie Hub</h1>
          <button
            className="quit-btn"
            onClick={() => {
              handleQuit();
            }}
          >
            Sair
          </button>
        </div>
      </header>
      <main className="content-container">
        <section className="user-section">
          <div className="user-info">
            <h2>Olá, {userInfo?.name}</h2>
            <span className="user-module">{userInfo?.course_module}</span>
          </div>
        </section>
        <section className="techs-section">
          <div className="techs-header">
            <h3>Tecnologias</h3>
            <button onClick={openModal} className="add-btn">
              +
            </button>
          </div>
          <Techs techs={techs} setTechs={setTechs} />
        </section>
      </main>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
      >
        <header className="modal-header">
          <h4>Cadastrar Tecnologia</h4>
          <button onClick={closeModal} className="close-modal-btn">
            Fechar
          </button>
        </header>
        <form onSubmit={handleSubmit(onSubmit)} className="modal-form">
          <div className="name-box">
            <label>Nome</label>
            <input {...register("title")} className="input-modal" />
            <span className="error">{errors.title?.message}</span>
          </div>
          <div className="status-box">
            <label>Selecionar status</label>
            <select {...register("status")} className="input-modal">
              <option></option>
              <option>Iniciante</option>
              <option>Intermediário</option>
              <option>Avançado</option>
            </select>
            <span className="error">{errors.status?.message}</span>
          </div>
          <button type="submit" className="register-tech-btn">
            Cadastrar Tecnologia
          </button>
        </form>
      </Modal>
      <ToastContainer theme="dark" />
    </main>
  );
}

export default Home;
