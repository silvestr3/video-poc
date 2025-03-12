import { CameraView } from "./components/camera-view/camera-view";
import "./App.css";
import { useState } from "react";
import { Camera } from "lucide-react";
import ReactPlayer from "react-player";
import { Analytics } from "@vercel/analytics/react";

const App = () => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [videoSource, setVideoSource] = useState<string | null>(null);

  return (
    <>
      <Analytics />
      {isCameraOpen ? (
        <CameraView
          closeCamera={() => setIsCameraOpen(false)}
          setVideoSource={setVideoSource}
        />
      ) : (
        <>
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
              marginBottom: "16px",
            }}
            onClick={() => setIsCameraOpen(true)}
          >
            <Camera />
          </button>
          {videoSource && <ReactPlayer controls url={videoSource} />}
        </>
      )}
    </>
  );
};

export default App;
