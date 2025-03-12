import { CameraView } from "./components/camera-view";
import "./App.css";
import { useState } from "react";
import { Camera } from "lucide-react";

const App = () => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  if (isCameraOpen) {
    return <CameraView closeCamera={() => setIsCameraOpen(false)} />;
  }

  return (
    <button
      style={{
        padding: "4px 12px",
        borderRadius: "8px",
        border: "none",
        backgroundColor: "#00c899",
        color: "#fff",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={() => setIsCameraOpen(true)}
    >
      <Camera />
    </button>
  );
};

export default App;
