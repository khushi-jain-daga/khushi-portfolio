import { lerp, smoothstep } from "../../../lib/motion";
import styles from "./ProblemToProductScene.module.css";

export default function ClientMessage({ message, progress, index }) {
  const enter = smoothstep(message.start, message.start + 0.05, progress);
  const pressure = smoothstep(0.30, 0.50, progress);
  const fragmentMorph = smoothstep(0.48, 0.62, progress);
  const exit = smoothstep(message.end - 0.035, message.end, progress);
  const opacity = Math.max(0, enter * (1 - exit));

  if (opacity <= 0.001) return null;

  const orbitX = Math.sin((progress * 9) + index * 1.7) * (1 - pressure) * 1.6;
  const orbitY = Math.cos((progress * 8) + index * 1.2) * (1 - pressure) * 1.2;
  const targetX = ((index % 3) - 1) * 5.2;
  const targetY = (Math.floor(index / 3) - 1) * 5.8 - 2;

  const x = lerp(message.x + orbitX, targetX, pressure);
  const y = lerp(message.y + orbitY, targetY, pressure);
  const rotate = lerp(message.rotate, (index % 2 ? 3 : -3), pressure);
  const scale = lerp(0.9 + enter * 0.1, 0.30, fragmentMorph);

  return (
    <div
      className={styles.clientMessage}
      style={{
        opacity,
        transform: `translate3d(calc(-50% + ${x}vw), calc(-50% + ${y}vh), ${lerp(0, -95, pressure)}px) rotate(${rotate}deg) scale(${scale})`,
      }}
    >
      <span className={styles.messageDot} />
      <span className={styles.messageText}>{message.text}</span>
      <span
        className={styles.messageFragmentMark}
        style={{ opacity: fragmentMorph }}
        aria-hidden="true"
      >
        {index % 3 === 0 ? "?" : index % 3 === 1 ? "UI" : "→"}
      </span>
    </div>
  );
}

