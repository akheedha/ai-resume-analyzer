import { useState } from "react";
import axios from "axios";

function UploadResume() {

    const [name, setName] = useState("");
    const [file, setFile] = useState(null);
    const [result, setResult] = useState("");

    const handleUpload = async () => {

        const formData = new FormData();

        formData.append("name", name);
        formData.append("resume_file", file);

        try {

            const response = await axios.post(
                "http://127.0.0.1:8000/api/resumes/",
                formData
            );

            console.log(response.data);

            setResult(response.data.resume_text);

        } catch (error) {

            console.log(error);

        }
    };

    return (

        <div style={{ padding: "40px" }}>

            <h1>AI Resume Analyzer</h1>

            <input
                type="text"
                placeholder="Enter name"
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

            <button onClick={handleUpload}>
                Upload Resume
            </button>

            <br /><br />

            <h3>Extracted Resume Text:</h3>

            <p>{result}</p>

        </div>
    );
}

export default UploadResume;