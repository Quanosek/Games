"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

import { GameType } from "@/utils/enums";
import { Familiada } from "@/utils/fonts";
import type { DataTypes } from "../../page";
import styles from "../styles.module.scss";

export default function FamiliadaBoardComponent({ id }: { id: number }) {
  const [data, setData] = useState<DataTypes>();
  const [visible, setVisible] = useState<Array<number>>([]);

  const pointsAmount = useRef(0);
  const mainScore = useRef(0);

  const [redMistakes, setRedMistakes] = useState(0);
  const [blueMistakes, setBlueMistakes] = useState(0);

  const audioCorrect = useRef<HTMLAudioElement>(null);
  const audioWrong = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const localData = localStorage.getItem(GameType.FAMILIADA);

    if (localData) {
      const parsed = JSON.parse(localData);
      let data = parsed.data[id - 1] as DataTypes;

      if (data) {
        const answers = data.answers.filter((el) => el.value);
        data = { ...data, answers };
        setData(data);
      }
    } else {
      window.close();
    }
  }, [id]);

  useEffect(() => {
    if (!data) return;

    const KeyupEvent = (e: KeyboardEvent) => {
      if (e.shiftKey || e.altKey || e.metaKey) return;

      // show answer
      if ([1, 2, 3, 4, 5, 6].includes(Number(e.key))) {
        const number = Number(e.key);

        if (!data.answers[number - 1]) return;

        if (!visible.includes(number)) {
          if (audioCorrect.current) {
            audioCorrect.current.play();
          }

          setVisible([...visible, number]);

          if (!e.ctrlKey) {
            const points = data.answers[number - 1].points;
            const multiply = data.multiply || 1;

            pointsAmount.current += points;
            mainScore.current += points * multiply;
          }
        }
      }

      if (!audioWrong.current) return;

      // manage teams mistakes
      switch (e.key.toUpperCase()) {
        case "Q":
          if (redMistakes > 3) return;
          setRedMistakes(-1);
          audioWrong.current.play();
          break;
        case "W":
          if (redMistakes >= 3) return;
          setRedMistakes(redMistakes + 1);
          audioWrong.current.play();
          break;
        case "E":
          setRedMistakes(0);
          setBlueMistakes(0);
          break;
        case "R":
          if (blueMistakes >= 3) return;
          setBlueMistakes(blueMistakes + 1);
          audioWrong.current.play();
          break;
        case "T":
          if (blueMistakes > 3) return;
          setBlueMistakes(-1);
          audioWrong.current.play();
          break;
      }
    };

    document.addEventListener("keyup", KeyupEvent);
    return () => document.removeEventListener("keyup", KeyupEvent);
  }, [data, visible, blueMistakes, redMistakes]);

  const FormatPoints = (value: number) => {
    const size = value.toString().length;
    const newValue = value.toString().split("");

    if (size <= 2) return ["", ...(size === 1 ? [""] : []), ...newValue];
    else return newValue;
  };

  const handleMistakes = (counter: number) => {
    return (
      <div className={styles.mistakes}>
        {(counter < 0 && (
          <Image
            className={styles.big}
            alt=""
            src="/familiada/images/x-big.webp"
            width={111}
            height={283}
            draggable={false}
          />
        )) ||
          Array.from({ length: counter }).map((_, i) => (
            <Image
              key={i}
              alt=""
              src="/familiada/images/x-small.webp"
              width={111}
              height={163}
              draggable={false}
            />
          ))}
      </div>
    );
  };

  const backgroundImage = `url("/familiada/images/background-empty.webp")`;

  return (
    <div
      className={`${Familiada.className} ${styles.game}`}
      style={{ backgroundImage }}
    >
      <div className={styles.totalPoints}>
        <div>
          {FormatPoints(mainScore.current).map((el, i) => (
            <p key={i}>{el}</p>
          ))}
        </div>
      </div>

      {data && (
        <div className={styles.data}>
          <div className={styles.mistakes}>{handleMistakes(redMistakes)}</div>

          <div
            className={`${styles.main} ${
              data.answers.length < 5 && styles.doublePadding
            }`}
          >
            {data.answers.map((el, i) => {
              const answer = el.value.split("");
              const points = FormatPoints(el.points);
              const dots = Array(17).fill("...");

              return (
                <div key={i}>
                  <p>{i + 1}</p>

                  {(visible.includes(i + 1) && (
                    // show answer
                    <>
                      <div className={styles.answer}>
                        {answer.map((word, i) => (
                          <p key={i}>{word}</p>
                        ))}
                      </div>

                      <div className={styles.points}>
                        {points.map((word, i) => (
                          <p key={i}>{word}</p>
                        ))}
                      </div>
                    </>
                  )) || (
                    // show dots
                    <div className={styles.dots}>
                      {dots.map((cell, i) => (
                        <p key={i}>{cell}</p>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            <div className={styles.pointsAmount}>
              <div>
                {"SUMA".split("").map((el, i) => (
                  <p key={i}>{el}</p>
                ))}
              </div>

              <div>
                {FormatPoints(pointsAmount.current).map((el, i) => (
                  <p key={i}>{el}</p>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.mistakes}>{handleMistakes(blueMistakes)}</div>
        </div>
      )}

      {/* audio effects */}
      <audio src="/familiada/audio/new-round.mp3" autoPlay />
      <audio ref={audioCorrect} src="/familiada/audio/correct.mp3" />
      <audio ref={audioWrong} src="/familiada/audio/wrong.mp3" />
    </div>
  );
}
