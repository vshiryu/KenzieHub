import axios from "axios";
import Modal from "react-modal";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

function Techs({ techs, setTechs }) {
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

  const formSchema = yup.object().shape({
    status: yup.string().required("Selecione uma técnologia"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(formSchema),
  });

  function deleteTech(id) {
    axios
      .delete(`https://kenziehub.herokuapp.com/users/techs/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.token}`,
        },
      })
      .then((res) => {
        setTechs(techs.filter((elem) => elem.id !== id));
      })
      .catch((err) => console.log(err.response.data.message));
  }

  return (
    <ul>
      {techs?.map((elem) => (
        <li key={elem.id}>
          <div>{elem.title}</div>
          <div>
            <span>{elem.status}</span>
            <button
              onClick={() => {
                deleteTech(elem.id);
              }}
            >
              Remover
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default Techs;
