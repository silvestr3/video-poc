import { useCallback, useRef, useState, useEffect } from "react";
import styles from "./camera.module.css";
import { Loader2, X } from "lucide-react";

interface CameraViewProps {
  closeCamera: () => void;
}

export function CameraView({ closeCamera }: CameraViewProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Initialize camera when component mounts
  useEffect(() => {
    const initializeCamera = async () => {
      setIsLoading(true);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }

        // Store the stream reference for later use
        streamRef.current = stream;
      } catch (error) {
        alert("Você precisa permitir o acesso à câmera e ao microfone para gravar videos");
        console.error("Erro ao acessar a câmera e/ou microfone:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeCamera();

    // Cleanup function to stop all tracks when component unmounts
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const startRecording = useCallback(() => {
    try {
      if (!streamRef.current) {
        console.error("Stream não está disponível");
        return;
      }

      const mimeTypes = [
        "video/webm;codecs=vp9,opus",
        "video/webm;codecs=vp8,opus",
        "video/webm;codecs=h264,opus",
        "video/webm;codecs=vp9",
        "video/webm;codecs=vp8",
        "video/webm",
        "video/mp4",
      ];

      let mimeType = "";
      for (const type of mimeTypes) {
        if (MediaRecorder.isTypeSupported(type)) {
          mimeType = type;
          break;
        }
      }

      const recorder = new MediaRecorder(
        streamRef.current,
        mimeType ? { mimeType } : undefined
      );

      recorder.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          setRecordedChunks((prev) => [...prev, event.data]);
        }
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      console.error("Erro ao iniciar a gravação:", error);
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (!mediaRecorder) return;

    mediaRecorder.stop();
    setIsRecording(false);
  }, [mediaRecorder]);

  const downloadVideo = useCallback(() => {
    if (recordedChunks.length === 0) return;

    const blob = new Blob(recordedChunks, { type: "video/webm" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "video.webm";
    link.click();
  }, [recordedChunks]);

  const handleCameraControls = useCallback(() => {
    if (!isRecording) return startRecording();

    stopRecording();
  }, [isRecording, startRecording, stopRecording]);

  if (isLoading) {
    return (
      <div className={styles.container}>
        <Loader2 className={styles.loader} />
      </div>
    );
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

      <button
        className={styles.cameraButton}
        onClick={handleCameraControls}
        title={isRecording ? "Parar gravação" : "Iniciar gravação"}
      />
    </div>
  );
}
