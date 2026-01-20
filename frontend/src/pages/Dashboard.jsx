import { useEffect, useState } from "react";
import api from "../services/api";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    api.get("/projects").then(res => setProjects(res.data));
  }, []);

  return (
    <div>
      <h2>Projects</h2>
      {projects.map(p => <div key={p._id}>{p.name}</div>)}
    </div>
  );
}
