import styles from "./progress-track.module.css";

interface ProgressTrackProps {
  radius: number;
  circumference: number;
  progress: number;
}

export function ProgressTrack({
  radius,
  circumference,
  progress,
}: ProgressTrackProps) {
  return (
    <svg
      className={styles.progressSvg}
      width="90"
      height="90"
      viewBox="-5 -5 80 80"
    >
      <circle
        cx="35"
        cy="35"
        r={radius}
        strokeWidth="5"
        fill="none"
        stroke="transparent"
      />
      <circle
        cx="35"
        cy="35"
        r={radius}
        stroke="#00c899"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={circumference * (1 - progress)}
        transform="rotate(-90 35 35)"
      />
    </svg>
  );
}
