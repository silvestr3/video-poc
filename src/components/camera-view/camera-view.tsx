import styles from "./camera.module.css";
import { Loader2, X } from "lucide-react";
import { ProgressTrack } from "../progress-track/progress-track";
import { useCameraControls } from "../../hook/use-camera-controls";

interface CameraViewProps {
  closeCamera: () => void;
}

export function CameraView({ closeCamera }: CameraViewProps) {
  const {
    handleCameraControls,
    downloadVideo,
    elapsedTime,
    isRecording,
    recordedChunks,
    videoRef,
    isLoading,
  } = useCameraControls();

  // Constants for the progress circle
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(elapsedTime / 180, 1);

  if (isLoading) {
    return <Loader2 className={styles.loader} />;
  }

  return (
    <div className={styles.container}>
      <video className={styles.video} ref={videoRef} autoPlay muted />
      {recordedChunks.length > 0 && !isRecording && (
        <button className={styles.confirmButton} onClick={downloadVideo}>
          Avançar
        </button>
      )}

      <div onClick={closeCamera} className={styles.closeButtonContainer}>
        <X className={styles.closeButton} />
      </div>

      <div className={styles.cameraButtonContainer}>
        {isRecording && (
          <ProgressTrack
            radius={radius}
            circumference={circumference}
            progress={progress}
          />
        )}
        <button
          className={styles.cameraButton}
          onClick={handleCameraControls}
          title={isRecording ? "Parar gravação" : "Iniciar gravação"}
        />
      </div>
    </div>
  );
}
