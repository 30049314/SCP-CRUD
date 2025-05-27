import { Link } from "react-router-dom"; // Import Link from react-router-dom
import { useState, useEffect } from "react"; // Import useState and useEffect from React
import { useNavigate, useParams } from "react-router-dom"; // Import useNavigate and useParams from react-router-dom
import { supabase } from "../supabase"; // Import supabase client
import "../App.css"; // Import CSS styles

// Importing CSS styles
function UpdateSCP() {
    const { item } = useParams(); // Get the item parameter from the URL
    const [form, setForm] = useState(null); // Initialize form state
    const [error, setError] = useState(""); // Initialize error state
    const navigate = useNavigate(); // Initialize navigate function

    // Fetch SCP data from Supabase when the component mounts
    useEffect(() => {
        const fetchSCP = async () => {
            const { data, error } = await supabase
                .from("scp_subjects")
                .select("*")
                .eq("item", item)
                .single();
            if (error) setError(error.message); // Set error if any
            else {
                // Always parse images as an array
                let images = []; 
                if (Array.isArray(data.images)) { 
                    images = data.images; // If images is already an array, use it directly
                } else if (typeof data.images === "string" && data.images.trim().startsWith("[")) {
                    try {
                        images = JSON.parse(data.images); // Attempt to parse images as JSON array
                    } catch {
                        images = data.images ? [data.images] : []; // Fallback to single image if parsing fails
                    }
                } else if (typeof data.images === "string" && data.images.trim() !== "") {
                    images = [data.images]; // Fallback to single image if it's a non-empty string
                }
                const imageUrls = images.map(img =>
                    supabase.storage.from("images").getPublicUrl(img).data?.publicUrl || ""
                );
                setForm({ ...data, images, imageUrls }); // Set form state with fetched data
            }
        };
        fetchSCP(); 
    }, [item]); 

    // Handle input changes
    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value }); // Update form state on input change
    };

    // Handle image upload
    const handleImageUpload = async (e) => {
        try {
            const files = Array.from(e.target.files); // Convert FileList to an array for easier processing
            if (!files.length) {
                setError('No files selected'); // Handle no files selected error
                return; 
            }

            const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']; 
            const maxSize = 25 * 1024 * 1024; // 25MB
            let uploadedUrls = []; 
            let uploadedNames = []; 

            // Validate file types and sizes
            for (const file of files) {
                // Check file type
                if (!validTypes.includes(file.type)) {
                    setError(`Invalid file type for ${file.name}. Only JPEG, PNG, WEBP, or GIF allowed.`); // Handle invalid file type error
                    continue;
                }
                // Check file size
                if (file.size > maxSize) {
                    setError(`File ${file.name} exceeds 25MB limit.`); // Handle file size error
                    continue;
                }

                // Use the original file name and upsert to overwrite
                const {error} = await supabase.storage
                    .from('images')
                    .upload(file.name, file, {
                        contentType: file.type,
                        upsert: true
                    });

                // Check for upload errors
                if (error) {
                    setError(`Failed to upload ${file.name}: ${error.message}`); // Handle upload error
                    continue;
                }

                uploadedNames.push(file.name); // Collect successfully uploaded file names
                uploadedUrls.push(
                    supabase.storage.from('images').getPublicUrl(file.name).data.publicUrl
                ); 
            }

            // Append new images to the existing arrays
            if (uploadedNames.length > 0) {
                setForm({
                    ...form,
                    images: [...(form.images || []), ...uploadedNames],
                    imageUrls: [...(form.imageUrls || []), ...uploadedUrls],
                }); 
            }
        } catch (error) {
            setError('Unexpected error during upload: ' + error.message); // Handle unexpected errors
        }
    };

    // Handle form submission
    const handleSubmit = async e => {
        e.preventDefault(); // Prevent default form submission

        // Remove imageUrls before updating
        const { imageUrls, ...formToSave } = form; // Destructure form to save
        if (!formToSave.images || formToSave.images.length === 0) {
            formToSave.images = []; // Ensure images is an empty array
        }

        // Update the SCP subject in Supabase
        const { error } = await supabase
            .from("scp_subjects")
            .update(formToSave)
            .eq("item", item); // Update the SCP subject in Supabase

        // Check for errors
        if (error) {
            setError(error.message); // Set error if any
        } else {
            navigate(`/${item}`); // Redirect to the SCP page after update
            window.location.reload(); // Reload the page after successful submission
        }
    };

    // Handle delete action
    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this SCP? This action cannot be undone.")) {
            const { error } = await supabase
                .from("scp_subjects")
                .delete()
                .eq("item", item); // Delete the SCP subject from Supabase
            if (error) {
                setError(error.message); // Set error if any
            } else {
                navigate("/"); // Redirect to home after delete
                window.location.reload(); // Reload the page after successful submission
            }
        }
    };

    // Handle image removal
    const handleRemoveImage = (idx) => {
        if (!Array.isArray(form.images) || !Array.isArray(form.imageUrls)) return; 
        const newImages = form.images.filter((_, i) => i !== idx); 
        const newImageUrls = form.imageUrls.filter((_, i) => i !== idx); 
        setForm({ ...form, images: newImages, imageUrls: newImageUrls }); 
    };

    // Render the component
    return (
        <div className="content">
            <div className="page">
                <h1>Update SCP</h1>
                {!form ? (
                    // Skeleton or placeholder while loading
                    <div style={{ minHeight: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span>Loading... </span>
                    </div>
                ) : (
                    <form className="form" onSubmit={handleSubmit}>
                        <label>
                            SCP Item:
                            <input name="item" value={form.item} disabled readOnly />
                        </label>
                        <label>
                            Name:
                            <input name="name" value={form.name} onChange={handleChange} required />
                        </label>
                        <label>
                            Object Class:
                            <input name="objectClass" value={form.objectClass} onChange={handleChange} />
                        </label>
                        <label>
                            Current Images:
                            {Array.isArray(form.imageUrls) && form.imageUrls.length > 0 ? (
                                <div>
                                    {form.imageUrls.map((url, idx) => (
                                        <div key={idx} style={{ display: "flex", alignItems: "center" }}>
                                            <img
                                                src={url}
                                                alt={`Current Image ${idx + 1}`}
                                                style={{ maxWidth: 100, marginRight: 8 }}
                                                loading="lazy"
                                            />
                                            <span>{form.images[idx]}</span>
                                            <button
                                                type="button"
                                                style={{ marginLeft: 8, color: "red", fontWeight: "bold", cursor: "pointer" }}
                                                onClick={() => handleRemoveImage(idx)}
                                                aria-label="Remove image"
                                            >✕</button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div>No images uploaded.</div>
                            )}
                        </label>
                        <label>
                            Replace Images:
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
                        <button type="submit">Update</button>
                        <button
                            onClick={handleDelete}
                            style={{
                                background: "#c00",
                                color: "#fff",
                                border: "none",
                                borderRadius: "6px",
                                cursor: "pointer",
                                padding: "12px 20px",
                                fontSize: "16px",
                                fontWeight: "bold",
                                transition: "background 0.2s"
                            }}>Delete SCP
                        </button>
                        <br />
                    </form>
                )}
                {error && <p style={{ color: "red" }}>{error}</p>}
                <Link to="/" className="folder-link"><strong>CLOSE</strong></Link>
            </div>
        </div>
    );
}

export default UpdateSCP;