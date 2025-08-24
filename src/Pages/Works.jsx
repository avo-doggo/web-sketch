import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function Works() {
  const [works, setWorks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = JSON.parse(sessionStorage.getItem("previousWorks") || "[]");
    setWorks(saved);
  }, []);

  const handleLoad = (project) => {
    sessionStorage.setItem("activeWork", JSON.stringify(project));
    navigate("/Canvas"); 
  };

  const handleDelete = (id) => {
    const updated = works.filter((work) => work.id !== id);
    setWorks(updated);
    sessionStorage.setItem("previousWorks", JSON.stringify(updated));
  };

  const handleNewWork = () => {
    sessionStorage.removeItem("activeWork");
    navigate("/Canvas"); 
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Previous Works</h2>
      <button onClick={handleNewWork} style={{ marginBottom: "15px" }}>
        ➕ Create New Work
      </button>

      {works.length === 0 && <p>No saved works yet.</p>}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        {works.map((work) => (
          <div key={work.id} style={{ textAlign: "center" }}>
            <img
              src={work.image}
              alt="Saved work"
              style={{ width: 200, height: "auto", border: "1px solid black" }}
            />
            <div style={{ marginTop: "5px" }}>
              <button onClick={() => handleLoad(work.project)}>Reopen(Non-Functional For Now)</button>
              <button
                onClick={() => handleDelete(work.id)}
                style={{ marginLeft: "5px", color: "red" }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
