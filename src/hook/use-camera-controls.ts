import { useCallback } from "react";

import { useRef } from "react";

import { useState } from "react";

import { useEffect } from "react";

export const useCameraControls = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [, setRecordedChunks] = useState<Blob[]>([]);
  const [elapsedTime, setElapsedTime] = useState(0); // New state for elapsed time
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);

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

        streamRef.current = stream;
      } catch (error) {
        alert(
          "Você precisa permitir o acesso à câmera e ao microfone para gravar videos"
        );
        console.error("Erro ao acessar a câmera e/ou microfone:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const stopRecording = useCallback(() => {
    if (!mediaRecorder) return;

    mediaRecorder.stop();
    setIsRecording(false);
  }, [mediaRecorder]);

  const startRecording = useCallback(() => {
    try {
      if (!streamRef.current) {
        console.error("Stream não está disponível");
        return;
      }

      // Clean up previous recording
      if (recordedVideoUrl) {
        URL.revokeObjectURL(recordedVideoUrl);
        setRecordedVideoUrl(null);
      }

      chunksRef.current = [];
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
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        setRecordedVideoUrl(url);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      console.error("Erro ao iniciar a gravação:", error);
    }
  }, [recordedVideoUrl]);

  const handleCameraControls = useCallback(() => {
    if (!isRecording) return startRecording();

    stopRecording();
  }, [isRecording, startRecording, stopRecording]);

  const playVideo = useCallback(() => {
    if (videoRef.current && recordedVideoUrl) {
      videoRef.current.play();
      setIsPlayingPreview(true);
    }
  }, [recordedVideoUrl]);

  const discardRecording = () => {
    if (recordedVideoUrl) {
      URL.revokeObjectURL(recordedVideoUrl);
    }
    setRecordedVideoUrl(null);
    chunksRef.current = [];
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.onpause = () => {
        setIsPlayingPreview(false);
      };

      if (isRecording || recordedVideoUrl === null) {
        videoRef.current.srcObject = streamRef.current;
        videoRef.current.src = ""; // Clear previous src
        videoRef.current.play();
        setIsPlayingPreview(false);
      } else {
        videoRef.current.srcObject = null;
        videoRef.current.src = recordedVideoUrl;
        videoRef.current.load();
        setIsPlayingPreview(false);
      }
    }
  }, [isRecording, recordedVideoUrl]);

  useEffect(() => {
    if (elapsedTime >= 180 && isRecording) {
      stopRecording(); // Stop recording after 3 minutes
    }
  }, [elapsedTime, isRecording, stopRecording]);

  // Manage elapsed time and enforce 3-minute limit
  useEffect(() => {
    if (isRecording) {
      const interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
      return () => {
        clearInterval(interval);
        setElapsedTime(0); // Reset elapsed time when recording stops
      };
    }
  }, [isRecording]);

  return {
    handleCameraControls,
    playVideo,
    discardRecording,
    isPlayingPreview,
    recordedVideoUrl,
    elapsedTime,
    isRecording,
    isLoading,
    videoRef,
  };
};
