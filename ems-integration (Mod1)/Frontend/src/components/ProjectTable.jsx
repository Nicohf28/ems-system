import { useEffect, useState } from "react";
import api from "../services/api";
import SummaryCard from "./SummaryCard";

function ProjectTable() {

  const [projects, setProjects] = useState([]);

  useEffect(() => {

    getProjects();

  }, []);

  const getProjects = async () => {

    try {

      const response = await api.get("/projects");

      setProjects(response.data.data);

    } catch (error) {

      console.log(error);

    }
  };

  return (
    <div className="card">

      <h2>Lista de Proyectos</h2>

      <table>

        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
          </tr>
        </thead>

        <tbody>

          {projects.map((project) => (

            <tr key={project.id}>
              <td>{project.id}</td>
              <td>{project.name}</td>
              <td>{project.description}</td>
            </tr>

          ))}

        </tbody>

      </table>

      <SummaryCard />

    </div>
  );
}

export default ProjectTable;