import { useState, ChangeEvent } from "react";
import * as XLSX from "xlsx";
import { backendUrl } from "../constants";

const ExcelUploader = () => {
  const [sheets, setSheets] = useState<string[]>([]);
  const [selectedSheets, setSelectedSheets] = useState<string[]>([]);
  const [fileName, setFileName] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<
    "success" | "failure" | null
  >(null);
  const [message, setMessage] = useState<string>("");

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      setFileName(uploadedFile.name);
      setFile(uploadedFile);

      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetNames = workbook.SheetNames;
        setSheets(sheetNames);
      };

      reader.readAsArrayBuffer(uploadedFile);
    }
  };

  const handleSubmit = async () => {
    if (!file || selectedSheets.length === 0) {
      setMessage("Please select a file and at least one sheet.");
      setUploadStatus("failure");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("sheets", JSON.stringify(selectedSheets));

    try {
      const response = await fetch(`${backendUrl}/upload/`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setMessage("Upload successful!");
        setUploadStatus("success");
        console.log("Success:", result);
      } else {
        setMessage("Upload failed. Please try again.");
        setUploadStatus("failure");
        console.error("Upload failed:", response);
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
      setUploadStatus("failure");
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <h2>Upload Excel File</h2>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
      <p>File: {fileName}</p>

      {sheets.length > 0 && (
        <div>
          <h3>Select Sheets</h3>
          {sheets.map((sheet, index) => (
            <div key={index}>
              <input
                type="checkbox"
                value={sheet}
                onChange={(e) => {
                  const { checked, value } = e.target;
                  setSelectedSheets((prev) =>
                    checked ? [...prev, value] : prev.filter((s) => s !== value)
                  );
                }}
              />
              {sheet}
            </div>
          ))}
          <button onClick={handleSubmit}>Submit</button>
        </div>
      )}

      {uploadStatus && (
        <div style={{ color: uploadStatus === "success" ? "green" : "red" }}>
          {message}
        </div>
      )}
    </div>
  );
};

export default ExcelUploader;
