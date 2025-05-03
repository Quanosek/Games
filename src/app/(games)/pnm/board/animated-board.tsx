"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

import styles from "./styles.module.scss";

export default function AnimatedBoardComponent({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showBoard, setShowBoard] = useState(false);

  useEffect(() => {
    setTimeout(() => setShowBoard(true), 100);
  }, []);

  return (
    <div
      className={styles.animatedBoard}
      style={{
        opacity: showBoard ? 1 : 0,
        transition: "opacity 200ms ease-out",
      }}
    >
      <div className={styles.boardContainer}>
        <div className={styles.content}>{children}</div>

        <Image
          alt=""
          src="/pnm/images/board.webp"
          width={2560}
          height={1440}
          draggable={false}
          priority
        />
      </div>

      <video className={styles.animation} autoPlay loop muted>
        <source src="/pnm/video/animation.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
