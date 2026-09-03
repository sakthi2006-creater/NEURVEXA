import { useState } from "react";
import { UPLOAD_SLOTS } from "../constants.js";

export default function StepUpload({ files, setFiles }) {
  const [errs, setErrs] = useState({});

  const handleFile = (key, maxMb, accept) => (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const okType = accept.some((ext) => f.name.toLowerCase().endsWith(ext));
    if (!okType) { setErrs((s) => ({ ...s, [key]: "File type is not supported." })); return; }
    if (f.size > maxMb * 1024 * 1024) { setErrs((s) => ({ ...s, [key]: `File size exceeds the maximum allowed limit (${maxMb} MB).` })); return; }
    setErrs((s) => ({ ...s, [key]: null }));
    setFiles((s) => ({ ...s, [key]: f }));
  };
  const removeFile = (key) => setFiles((s) => ({ ...s, [key]: null }));

  return (
    <div>
      <h2 className="step-title">PROJECT SUBMISSION</h2>
      <p className="step-hint">Files are uploaded to the backend when you complete registration — never stored only in the browser.</p>
      <div className="upload-grid">
        {UPLOAD_SLOTS.map(([key, label, types, maxMb, accept]) => {
          const f = files[key];
          return (
            <div className="upload-slot" key={key}>
              <div className="upload-slot-head"><span>{label}</span><span className="upload-types">{types} · max {maxMb}MB</span></div>
              {!f ? (
                <label className="upload-drop">
                  <input type="file" hidden onChange={handleFile(key, maxMb, accept)} />
                  <span>⬆ Drag & drop or click to upload</span>
                </label>
              ) : (
                <div className="upload-file">
                  <div className="upload-file-info"><span className="upload-file-name">{f.name}</span><span className="upload-file-size">{(f.size / 1024).toFixed(0)} KB</span></div>
                  <div className="upload-file-foot">
                    <span className="upload-success">✓ Ready to upload</span>
                    <button className="link-btn" onClick={() => removeFile(key)}>REMOVE</button>
                  </div>
                </div>
              )}
              {errs[key] && <span className="field-error">{errs[key]}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
