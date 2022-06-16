import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Techs from "../Techs";
import Modal from "react-modal";
import "./style.css";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";

Modal.setAppElement("#root");

function Home({ userInfo, setUserInfo, setLoggedIn, loggedIn }) {
  let history = useHistory();

  const [techs, setTechs] = useState(
    !localStorage.techs ? userInfo?.techs : JSON.parse(localStorage.techs)
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
      height: "400px",
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
    console.log("verificou login na home");
    !loggedIn && history.push("/");
  }, []);

  useEffect(() => {
    console.log("atualizou techs no localStorage");
    localStorage.techs = JSON.stringify(techs);
  }, [techs]);

  const formSchema = yup.object().shape({
    title: yup.string().required("Insira uma técnologia"),
    status: yup.string().required("Selecione uma técnologia"),
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
        console.log(res.data);
        setTechs([...techs, res.data]);
      })
      .catch((err) => console.log(err.response.data.message));
  }

  return (
    <>
      <header>
        <h1>Kenzie Hub</h1>
        <button
          onClick={() => {
            handleQuit();
          }}
        >
          Sair
        </button>
      </header>
      <main>
        <section>
          <h2>Olá, {userInfo?.name}</h2>
          <span>{userInfo?.course_module}</span>
        </section>
        <section>
          <div>
            <h3>Tecnologias</h3>
            <button onClick={openModal}>+</button>
          </div>
          <Techs techs={techs} setTechs={setTechs} />
        </section>
      </main>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
      >
        <div>
          <h4>Cadastrar Tecnologia</h4>
          <button onClick={closeModal}>Fechar</button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label>Nome</label>
            <input {...register("title")} />
          </div>
          <div>
            <label>Selecionar status</label>
            <select {...register("status")}>
              <option></option>
              <option>Iniciante</option>
              <option>Intermediário</option>
              <option>Avançado</option>
            </select>
          </div>
          <button type="submit">Cadastrar Tecnologia</button>
        </form>
      </Modal>
    </>
  );
}

export default Home;
