import { useState } from "react";
import '../../css/module3styles.css'
import ColorPicker from "./ColorPicker";
import Imegetypepicker from "./Imagetypepicker"

/**
 * ProjectForm
 *
 * A two-field form component:
 *  - projectName  : short text input for the project title
 *  - content      : multi-line textarea for descriptive text
 *
 * Props:
 *  onSubmit (function) – called with { projectName, content } on form submission
 */
export default function Text({ onSubmit }) {
    const [projectName, setProjectName] = useState("");
    const [content, setContent] = useState("");

    const handleSubmit = () => {
        if (!projectName.trim()) return;
        onSubmit?.({ projectName: projectName.trim(), content: content.trim() });
    };

    const isReady = projectName.trim().length > 0;
    const [color, setColor] = useState("#043F34");

    return (

        <div className={"top-m3"}>
            <div className="pf-wrapper">
                <div className="pf-card">




                    <div className="pf-fields">


                        <div className="pf-field">
                            <label className="pf-label" htmlFor="project-name">
                                <span className="pf-label-index"></span> Project Name
                            </label>
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

                        {/* Visual separator */}
                        <div className="pf-divider" aria-hidden="true">
                            <span className="pf-divider-dot" />
                        </div>


                        <div className="pf-field">
                            <label className="pf-label" htmlFor="project-content">
                                <span className="pf-label-index"></span> Content
                            </label>
                            <textarea
                                id="project-content"
                                className="pf-input pf-textarea"
                                placeholder="Describe your project, goals, or any relevant notes…"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                spellCheck="true"
                            />
                        </div>

                    </div>

                    <ColorPicker selectedColor={color} onChange={setColor} />

                    <Imegetypepicker></Imegetypepicker>

                    <div className="pf-footer">
          <span className="pf-hint">
            {isReady ? `"${projectName}" is ready` : " "}
          </span>
                        <button
                            className="pf-submit"
                            onClick={handleSubmit}
                            disabled={!isReady}
                            aria-label="Submit project form"
                        >
                            Submit →
                        </button>
                    </div>
                </div>





            </div>
        </div>
    );
}