import { useEffect, useState } from "react";
import "../../css/module3styles.css";
import ColorPicker from "./ColorPicker";
import Imegetypepicker from "./Imagetypepicker";

const IMAGE_TYPE_LABELS = {
    post: "Post",
    story: "Story",
    banner: "Banner",
    portrait: "Portrait",
    landscape: "Landscape",
    cinema: "Cinema",
};

export default function Text({ onSubmit , addNotification = () => {} }) {

    const [projectName, setProjectName] = useState("");
    const [content, setContent] = useState("");
    const [imageType, setImageType] = useState("post");
    const [color, setColor] = useState("#043F34");
    const [apiColorPayload, setApiColorPayload] = useState({
        hex: "#043F34",
        colorName: "very dark teal",
        promptText: "Use very dark teal as the main dominant color in the image design.",
        paletteText: "Match the visual style closely to a very dark teal palette. Avoid shifting to pink, purple, magenta, or unrelated colors.",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [generatedImage, setGeneratedImage] = useState(null);
    const [generationMeta, setGenerationMeta] = useState(null);
    const [imageLoadError, setImageLoadError] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [error, setError] = useState(null);

    // Cooldown state to (((prevent spamming the API)) when it's
    //  under heavy load or rate limiting requests.
    // wait 30 seconds before allowing another submission 
    // if the API indicates it's overwhelmed.

    const [cooldownSeconds, setCooldownSeconds] = useState(0);

// useEffect hook to manage the cooldown timer,
//  decrementing the cooldownSeconds state every 
// second until it reaches zero. This provides feedback 
// to the user on when they can try submitting again after 
// hitting a rate limit or server overload response from the API.
    useEffect(() => {
        if (cooldownSeconds <= 0) {
            return undefined;
        }

        // wait 1000 seconds before decrementing the cooldown timer,
         
        const timer = window.setTimeout(() => {
            
            setCooldownSeconds((current) => Math.max(0, current - 1));
        }, 1000);


        return () => window.clearTimeout(timer);
    }, [cooldownSeconds]);

    const handleSubmit = 

    // Async function to handle the form submission,
    //  sending the project details to the backend API
    //  and managing the response, including error handling 
    // and cooldown logic.
    async () => {
    
        if (!projectName.trim() || cooldownSeconds > 0) 
            return;
        // Reset state before making the API call
         //when cooldown is stop,
         //  reset all states to initial 
         // values to prepare for a new submission.
         //  This includes clearing any previous errors,
         // generated images, and metadata, as well as resetting
          //  the image load error state.
        setIsLoading(true);
        setError(null);
        setGeneratedImage(null);
        setGenerationMeta(null);
        setImageLoadError(false);

        try {
            const token = localStorage.getItem("access_token");

            // Make the API call to generate the image based on the 
            // project details and selected options.
            const response = await fetch("http://127.0.0.1:8000/api/generate-image", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({
                    projectName: projectName.trim(),
                    content: content.trim(),
                    color: apiColorPayload.colorName,
                    colorText: `${apiColorPayload.promptText} ${apiColorPayload.paletteText}`,
                    imageType,
                }),
            });

            const responseText = await response.text();
            let data = null;

            try {
                data = responseText ? JSON.parse(responseText) : null;
            } catch {
                data = null;
            }

            if (!response.ok) {
                const errorMessage = data?.error || data?.message || response.statusText || "Server returned an invalid response.";

                throw new Error(errorMessage);
            }

            if (!data || (!data.image && !data.image_url)) {
                throw new Error("The backend returned an unexpected response. Please check the API output.");
            }


            const imageUrl = data.image || data.image_url;

            if (!imageUrl) {
                throw new Error("No image returned");
            }

            setGeneratedImage(imageUrl);
            setGenerationMeta({
                color: data.color || color,
                imageType: data.image_type || imageType,
                size: data.size || null,
            });
            // it is to pass the project
            onSubmit?.({
                projectName: projectName.trim(),
                content: content.trim(),
                color: data.color || color,
                imageType: data.image_type || imageType,
                size: data.size || null,
                image: imageUrl,
            });
            addNotification({ type: "genarate" });

        } catch (err) {
            let message = err?.message;

if (message === "Failed to fetch") {
    message = "The app could not reach the backend server. Please make sure Laravel is running on http://localhost:8000 and try again.";
} else if (message === "free_limit_reached") {
    message = "You have reached the limit of 3 free image generations. Upgrade to Pro to continue.";
} else if (message === "subscription_expired") {
    message = "Your Pro subscription has expired. Please renew to continue generating images.";
}

            const shouldStartCooldown =
                message.includes("Queue full for IP") ||
                message.includes("Connection refused") ||
                message.includes("temporarily unreachable");

            if (shouldStartCooldown) {
                setCooldownSeconds(60);
            }

            setError(
                shouldStartCooldown
                    ? `${message} Please wait ${60} seconds before trying again.`
                    : message
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownload = async () => {
        if (!generatedImage) return;

        setIsDownloading(true);
        setError(null);

        try {
            const response = await fetch(generatedImage);
            if (!response.ok) {
                throw new Error("Unable to download generated image.");
            }

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `${projectName.trim() || "generated-image"}`
                .replace(/[^\w\-. ]/g, "")
                .slice(0, 80) + ".png";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (downloadError) {
            setError(downloadError.message || "Download failed. Please try again.");
        } finally {
            setIsDownloading(false);
        }
    };

    const isReady = projectName.trim().length > 0;
    const resultTitle = projectName.trim() || "Generated Result";
    const currentImageLabel = IMAGE_TYPE_LABELS[imageType] || imageType;
    const resultImageLabel = IMAGE_TYPE_LABELS[generationMeta?.imageType] || generationMeta?.imageType;
    const frameAspectRatio = generationMeta?.size?.ratio?.replace(":", " / ") || "1 / 1";

    return (
        <div className="pf-page">
            <div className="pf-wrapper">
                <section className="pf-card pf-card-compact">
                    <div className="pf-card-head">
                        <p className="pf-eyebrow">AI Image Generator</p>
                        <h2 className="pf-title">Create your next visual quickly</h2>
                       
                    </div>

                    <div className="pf-section pf-section-grid">
                        <div>
                            <label className="pf-label" htmlFor="project-name">Project Name</label>
                            <input
                                id="project-name"
                                className="pf-input"
                                type="text"
                                placeholder="e.g. Apollo Redesign"
                                value={projectName}
                                onChange={(e) => setProjectName(e.target.value)}
                                autoComplete="off"
                                spellCheck="false"
                            />
                        </div>

                        <div>
                            <label className="pf-label" htmlFor="project-content">Content</label>
                            <textarea
                                id="project-content"
                                className="pf-input pf-textarea"
                                placeholder="Describe the message, mood, or scene..."
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                spellCheck="true"
                            />
                        </div>
                    </div>

                    <div className="pf-section pf-controls-grid">
                        <div className="pf-box pf-box-inline">
                            {/* <div className="pf-box-title small">Color</div> */}
                            <ColorPicker
                                selectedColor={color}
                                onChange={(hex, payload) => {
                                    setColor(hex);
                                    if (payload) {
                                        setApiColorPayload(payload);
                                    }
                                }}
                            />
                        </div>
                        <div className="pf-box pf-box-inline">
                            {/* <div className="pf-box-title small">Format</div> */}
                            <Imegetypepicker value={imageType} onChange={setImageType} />
                        </div>
                    </div>

                    <div className="pf-section pf-box pf-box-soft pf-actions-panel">
                        

                        <div className="pf-footer pf-footer-inline">
                            <span className="pf-hint">
                                {cooldownSeconds > 0
                                    ? `Try again in ${cooldownSeconds}s`
                                    : isReady
                                        ? `Ready to generate your image`
                                        : "Add a project name to begin"}
                            </span>
                            <button
                                className="pf-submit"
                                onClick={handleSubmit}
                                disabled={!isReady || isLoading || cooldownSeconds > 0}
                                aria-label="Submit project form"
                            >
                                {isLoading ? "Generating..." : cooldownSeconds > 0 ? `Wait ${cooldownSeconds}s` : "Generate image"}
                            </button>
                        </div>
                    </div>
                </section>

                <aside className="pf-result-panel pf-result-compact">
                    <div className="pf-result-header">
                        <p className="pf-result-eyebrow">Preview</p>
                        <h3 className="pf-result-title">{resultTitle}</h3>
                        
                    </div>

                    {isLoading && <div className="pf-loading">Generating image...</div>}
                    {error && <div className="pf-error">{error}</div>}

                    {generatedImage ? (
                        <div className="pf-result-card">
                            <div className="pf-result-toolbar">
                                <div className="pf-result-chip">
                                    <span className="pf-selection-dot" style={{ backgroundColor: generationMeta?.color || color }}></span>
                                    <span>{generationMeta?.color || color}</span>
                                </div>
                                <div className="pf-result-chip">{resultImageLabel}</div>
                                {generationMeta?.size && (
                                    <div className="pf-result-chip">
                                        {generationMeta.size.width} x {generationMeta.size.height}
                                    </div>
                                )}
                            </div>

                            <div className="pf-image-frame">
                                <div className="pf-image-stage" style={{ aspectRatio: frameAspectRatio }}>
                                    {!imageLoadError ? (
                                        <img
                                            className="pf-generated-image"
                                            src={generatedImage}
                                            alt={resultTitle}
                                            loading="eager"
                                            referrerPolicy="no-referrer"
                                            onLoad={() => setImageLoadError(false)}
                                            onError={() => setImageLoadError(true)}
                                        />
                                    ) : (
                                        <div className="pf-image-fallback">
                                            <p className="pf-result-empty-title">Preview unavailable</p>
                                            <p className="pf-result-empty-copy">
                                                The image was generated, but the browser could not render the preview.
                                            </p>
                                            <a
                                                className="pf-open-image"
                                                href={generatedImage}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                Open generated image
                                            </a>
                                        </div>
                                    )}
                                </div>

                                <div className="pf-download-row">
                                    <button
                                        className="pf-download"
                                        type="button"
                                        onClick={handleDownload}
                                        disabled={isDownloading}
                                    >
                                        {isDownloading ? "Downloading..." : "Download image"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="pf-result-empty">
                            <div className="pf-result-placeholder"></div>
                            <p className="pf-result-empty-title">Your generated image will appear here</p>
                            <p className="pf-result-empty-copy">
                                Add a project name, choose a color, and hit generate.
                            </p>
                        </div>
                    )}
                </aside>
            </div>
        </div>
    );
}
