import styles from "./camera.module.css";
import { Loader2, Play, X } from "lucide-react";
import { ProgressTrack } from "../progress-track/progress-track";
import { useCameraControls } from "../../hook/use-camera-controls";

interface CameraViewProps {
  closeCamera: () => void;
}

export function CameraView({ closeCamera }: CameraViewProps) {
  const {
    handleCameraControls,
    playVideo,
    recordedVideoUrl,
    elapsedTime,
    isRecording,
    isPlayingPreview,
    videoRef,
    isLoading,
  } = useCameraControls();

  // Constants for the progress circle
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(elapsedTime / 180, 1);

  const isPreviewMode = !isRecording && recordedVideoUrl !== null;

  if (isLoading) {
    return <Loader2 className={styles.loader} />;
  }

  return (
    <div className={styles.container}>
      <video
        className={styles.video}
        ref={videoRef}
        autoPlay={isRecording || recordedVideoUrl === null}
        muted={!isPreviewMode}
        src={recordedVideoUrl ?? undefined}
      />
      {isPreviewMode && (
        <>
          {!isPlayingPreview && (
            <button
              className={styles.playButton}
              onClick={playVideo}
              title="Tocar vídeo"
            >
              <Play />
            </button>
          )}
          <button className={styles.confirmButton}>Avançar</button>
        </>
      )}

      <div onClick={closeCamera} className={styles.closeButtonContainer}>
        <X className={styles.closeButton} />
      </div>

      {!isPreviewMode && (
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
      )}
    </div>
  );
}
