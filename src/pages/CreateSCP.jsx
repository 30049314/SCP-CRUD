import { Link } from "react-router-dom"; // Import Link from react-router-dom
import { useState } from "react"; // Import useState from react
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
import { supabase } from "../supabase"; // Import supabase client
import "../App.css"; // Import CSS styles

// This component allows users to create a new SCP entry
function CreateSCP() {
    const [form, setForm] = useState({
        item: "",
        name: "",
        objectClass: "",
        images: [],
        specialContainmentProcedure: "",
        description: "",
        reference: "",
        addendum: "",
        chronologicalHistory: "",
        spaceTimeAnomalies: "",
        additionalNotes: "",
        appendix: ""
    });
    const [error, setError] = useState(""); // State to hold error messages
    const navigate = useNavigate(); // Initialize useNavigate hook

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value }); // Update form state on input change
    };

    const handleImageUpload = async (e) => {
        try {
            const files = Array.from(e.target.files); // Convert FileList to an array for easier processing

            // Check if any files were selected
            if (!files.length) {
                setError('No files selected'); // Handle no files selected error
                return; 
            }

            // Define valid file types and maximum size
            const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']; 
            const maxSize = 25 * 1024 * 1024; // 25MB
            const uploadedNames = []; 

            // Validate file types and sizes
            for (const file of files) {
                if (!validTypes.includes(file.type)) {
                    setError(`Invalid file type for ${file.name}. Only JPEG, PNG, WEBP, or GIF allowed.`); // Handle invalid file type error
                    continue;
                }
                if (file.size > maxSize) {
                    setError(`File ${file.name} exceeds 25MB limit.`); // Handle file size error
                    continue;
                }

                // Use the original file name and upsert to overwrite
                const { error } = await supabase.storage
                    .from("images")
                    .upload(file.name, file, {
                        contentType: file.type,
                        upsert: true
                    }); 
                    
                if (error) {
                    setError(`Failed to upload ${file.name}: ${error.message}`); // Handle upload error
                    continue; 
                }

                uploadedNames.push(file.name); // Collect successfully uploaded file names
            }

            // If any files were successfully uploaded, update the form state
            if (uploadedNames.length > 0) {
                setForm({ ...form, images: [...form.images, ...uploadedNames] }); // Update form state with uploaded image names
            }
        } catch (error) {
            setError('Unexpected error during upload: ' + error.message); // Handle unexpected errors
        }
    };

    // Function to handle form submission
    const handleSubmit = async e => {
        e.preventDefault(); // Prevent default form submission
        const formToSend = { ...form }; // Create a copy of the form state
        if (!formToSend.images || formToSend.images.length === 0) {
            formToSend.images = []; // Ensure images is an empty array
        }
        const { error } = await supabase.from("scp_subjects").insert([formToSend]); // Insert the form data into the 'scp_subjects' table
        if (error) {
            setError(error.message); // Set error message if insertion fails
        } else {
            navigate("/"); // Navigate to the home page after successful submission
            window.location.reload(); // Reload the page after successful submission
        }
    };

    // Render the form
    return (
        <div className="content">
            <div className="page">
                <h1>Create New SCP</h1>
                <form className="form" onSubmit={handleSubmit}>
                    <label>
                        SCP Item:
                        <input name="item" value={form.item} onChange={handleChange} required />
                    </label>
                    <label>
                        Name:
                        <input name="name" value={form.name} onChange={handleChange} required />
                    </label>
                    <label>
                        Object Class:
                        <input name="objectClass" value={form.objectClass} onChange={handleChange} required />
                    </label>
                    <label>
                        Image (filename or URL):
                        <input
                            type="file"
                            name="images"
                            multiple
                            onChange={handleImageUpload}
                        />
                    </label>
                    <label>
                        Special Containment Procedure:
                        <textarea name="specialContainmentProcedure" value={form.specialContainmentProcedure} onChange={handleChange} />
                    </label>
                    <label>
                        Description:
                        <textarea name="description" value={form.description} onChange={handleChange} />
                    </label>
                    <label>
                        Reference:
                        <textarea name="reference" value={form.reference} onChange={handleChange} />
                    </label>
                    <label>
                        Addendum:
                        <textarea name="addendum" value={form.addendum} onChange={handleChange} />
                    </label>
                    <label>
                        Chronological History:
                        <textarea name="chronologicalHistory" value={form.chronologicalHistory} onChange={handleChange} />
                    </label>
                    <label>
                        Space-Time Anomalies:
                        <textarea name="spaceTimeAnomalies" value={form.spaceTimeAnomalies} onChange={handleChange} />
                    </label>
                    <label>
                        Additional Notes:
                        <textarea name="additionalNotes" value={form.additionalNotes} onChange={handleChange} />
                    </label>
                    <label>
                        Appendix:
                        <textarea name="appendix" value={form.appendix} onChange={handleChange} />
                    </label>
                    <button type="submit">Create</button>
                    <br />
                </form>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <Link to="/" className="folder-link"><strong>CLOSE</strong></Link>
            </div>
        </div>
    )
}

export default CreateSCP;