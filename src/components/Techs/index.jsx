import axios from "axios";
import "./style.css";
import { BsTrash } from "react-icons/bs";

function Techs({ techs, setTechs }) {
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
    <ul className="tech-list">
      {techs?.map((elem) => (
        <li key={elem.id} className="techs">
          <div>{elem.title}</div>
          <div className="tech-info">
            <span className="tech-status">{elem.status}</span>
            <BsTrash
              className="trash-btn"
              onClick={() => {
                deleteTech(elem.id);
              }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

export default Techs;
