import Navbar from "../components/Navbar";
import ProjectForm from "../components/ProjectForm";
import ProjectTable from "../components/ProjectTable";

function Home() {

  return (
    <div>

      <Navbar />

      <div className="container">

        <ProjectForm />

        <ProjectTable />

      </div>

    </div>
  );
}

export default Home;