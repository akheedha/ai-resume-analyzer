import React, { useState } from "react";
import axios from "axios";

function App() {

  const [name, setName] = useState("");
  const [file, setFile] = useState(null);

  const handleUpload = async (e) => {

    e.preventDefault();

    if (!file) {
      alert("Please select a PDF file");
      return;
    }

    const formData = new FormData();

    formData.append("name", name);
    formData.append("resume_file", file);

    try {

      const response = await axios.post(
        "http://127.0.0.1:8000/api/resumes/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response.data);

      alert("Resume uploaded successfully!");

    } catch (error) {

      console.log(error);

      if (error.response) {

        console.log(error.response.data);
        alert(JSON.stringify(error.response.data));

      } else {

        alert(error.message);

      }
    }
  };

  return (
    <div style={{ padding: "50px" }}>

      <h1>AI Resume Analyzer</h1>

      <form onSubmit={handleUpload}>

        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <br /><br />

        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <br /><br />

        <button type="submit">
          Upload Resume
        </button>

      </form>

    </div>
  );
}

export default App;