"use client";

import { useState, useEffect, Fragment } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { TConductorInstance } from "react-canvas-confetti/dist/types";
import Fireworks from "react-canvas-confetti/dist/presets/fireworks";

import { GameType } from "@/utils/enums";
import type { DataTypes } from "../../page";
import styles from "./styles.module.scss";

const KeyboardInteraction = (Shortcuts: any) => {
  useEffect(() => {
    const KeyupEvent = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.shiftKey || e.altKey || e.metaKey) return;
      Shortcuts(e);
    };

    document.addEventListener("keyup", KeyupEvent);
    return () => document.removeEventListener("keyup", KeyupEvent);
  }, [Shortcuts]);
};

export default function QuizyBoardComponent({ id }: { id: number }) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<DataTypes[]>([]);

  useEffect(() => {
    const localData = localStorage.getItem(GameType.QUIZY);

    if (localData) {
      try {
        const parsed = JSON.parse(localData);
        setData(parsed.data);
      } catch {
        window.close();
      }
    } else {
      window.close();
    }

    setIsLoading(false);
  }, [id]);

  KeyboardInteraction((e: KeyboardEvent) => {
    // console.log(e.key);

    if (e.key === "Escape") {
      close();
    }
    if (e.key === "ArrowLeft" && id > 0) {
      router.push(`/quizy/board/${Number(id) - 1}`);
    }
    if (e.key === "ArrowRight" && id <= data.length) {
      router.push(`/quizy/board/${Number(id) + 1}`);
    }
  });

  const StartLayout = () => {
    const nextPage = () => router.push(`/quizy/board/1`);

    KeyboardInteraction((e: KeyboardEvent) => {
      if (e.key === " ") nextPage();
    });

    return (
      <div className={styles.simpleLayout}>
        <h1>Quizy</h1>

        <button onClick={nextPage}>
          <p>Rozpocznij grę</p>
        </button>
      </div>
    );
  };

  const EndLayout = () => {
    const exitGame = () => window.close();

    KeyboardInteraction((e: KeyboardEvent) => {
      if (e.key === " ") exitGame();
    });

    return (
      <div className={styles.simpleLayout}>
        <h1>Quizy</h1>

        <button onClick={exitGame}>
          <p>Zakończ grę</p>
        </button>
      </div>
    );
  };

  const ClosedBoard = ({ params }: { params: DataTypes }) => {
    const [selected, setSelected] = useState(-1);
    const [conductor, setConductor] = useState<TConductorInstance>();

    // game win effect
    useEffect(() => {
      if (selected >= 0 && params.answers[selected].checked) {
        setTimeout(() => conductor?.shoot(), 0);
        setTimeout(() => conductor?.shoot(), 500);
      }
    }, [params.answers, selected, conductor]);

    // keyboard navigation
    KeyboardInteraction((e: KeyboardEvent) => {
      if (selected < 0) {
        if (["A", "1"].includes(e.key.toUpperCase())) setSelected(0);
        if (["B", "2"].includes(e.key.toUpperCase())) setSelected(1);
        if (["C", "3"].includes(e.key.toUpperCase())) setSelected(2);
        if (["D", "4"].includes(e.key.toUpperCase())) setSelected(3);
      }

      if (e.key === " ") {
        if (selected < 0) {
          setSelected(params.answers.findIndex((answer) => answer.checked));
        } else {
          router.push(`/quizy/board/${Number(id) + 1}`);
        }
      }
    });

    return (
      <>
        <Fireworks
          onInit={({ conductor }: { conductor: TConductorInstance }) => {
            return setConductor(conductor);
          }}
        />

        <h1 className={styles.question}>{params.question}</h1>

        <div className={styles.answersGrid}>
          {params.answers.map((answer, i) => (
            <button
              key={i}
              disabled={selected >= 0}
              className={
                selected >= 0 && params.answers[i].checked
                  ? styles.correct
                  : (selected === i && styles.selected) || ""
              }
              onClick={() => setSelected(i)}
            >
              <p>{`${["A", "B", "C", "D"][i]}: ${answer.value}`}</p>
            </button>
          ))}
        </div>
      </>
    );
  };

  const GapBoard = ({ params }: { params: DataTypes }) => {
    const [reveal, setReveal] = useState(false);

    KeyboardInteraction((e: KeyboardEvent) => {
      if (e.key === " ") {
        if (!reveal) setReveal(true);
        else router.push(`/quizy/board/${Number(id) + 1}`);
      }
    });

    const partsTable = params.question
      .split(/(\[[^\]]*\])/g)
      .map((value, i) => ({
        value: value.replace(/^\[|\]$/g, ""),
        hidden: i % 2 !== 0,
      }));

    return (
      <>
        <div className={styles.center}>
          <h1>
            {partsTable.map((part, index) => (
              <Fragment key={index}>
                {(part.hidden && (
                  <span
                    className={`
                      ${part.hidden && styles.hidden}
                      ${reveal && styles.reveal}
                    `}
                  >
                    {part.value}
                  </span>
                )) || <>{part.value}</>}
              </Fragment>
            ))}
          </h1>
        </div>

        <div className={styles.controls}>
          <button disabled={reveal} onClick={() => setReveal(true)}>
            <Image
              className="icon"
              alt=""
              src="/icons/magnifying-glass.svg"
              width={18}
              height={18}
              draggable={false}
            />

            <p>Pokaż odpowiedź</p>
          </button>
        </div>
      </>
    );
  };

  const OpenBoard = ({ params }: { params: DataTypes }) => {
    const [showAnswer, setShowAnswer] = useState(false);

    KeyboardInteraction((e: KeyboardEvent) => {
      if (e.key === " ") {
        if (!showAnswer) setShowAnswer(true);
        else router.push(`/quizy/board/${Number(id) + 1}`);
      }
    });

    return (
      <>
        <div className={styles.center}>
          <h1 className={styles.openQuestion}>{params.question}</h1>

          <h2
            style={{
              visibility: showAnswer ? "visible" : "hidden",
              opacity: showAnswer ? 1 : 0,
              height: showAnswer ? "20%" : 0,
              transition: "opacity 150ms ease-out, height 200ms ease-in-out",
            }}
            className={styles.openAnswer}
          >
            {params.answers[0].value}
          </h2>
        </div>

        <div className={styles.controls}>
          <button disabled={showAnswer} onClick={() => setShowAnswer(true)}>
            <Image
              className="icon"
              alt=""
              src="/icons/thought-balloon.svg"
              width={18}
              height={18}
              draggable={false}
            />

            <p>Pokaż odpowiedź</p>
          </button>
        </div>
      </>
    );
  };

  return (
    <>
      {isLoading && (
        <div className={styles.loading}>
          <div className={styles.spinner} />
        </div>
      )}

      <div
        className={styles.game}
        style={{
          visibility: isLoading ? "hidden" : "visible",
          opacity: isLoading ? 0 : 1,
          transition: "top 150ms ease-out, opacity 200ms ease-out",
        }}
      >
        {id <= 0 && <StartLayout />}
        {id > data.length && <EndLayout />}

        {data[id - 1]?.type === "closed" && (
          <ClosedBoard params={data[id - 1]} />
        )}
        {data[id - 1]?.type === "gap" && <GapBoard params={data[id - 1]} />}
        {data[id - 1]?.type === "open" && <OpenBoard params={data[id - 1]} />}
      </div>

      <div className={styles.navigation}>
        <button
          disabled={id <= 0}
          onClick={() => router.push(`/quizy/board/${Number(id) - 1}`)}
        >
          <Image
            style={{ rotate: "-90deg" }}
            className="icon"
            alt="W lewo"
            src="/icons/arrow.svg"
            width={50}
            height={50}
            draggable={false}
          />
        </button>

        <button
          disabled={id > data.length}
          onClick={() => router.push(`/quizy/board/${Number(id) + 1}`)}
        >
          <Image
            style={{ rotate: "90deg" }}
            className="icon"
            alt="W prawo"
            src="/icons/arrow.svg"
            width={50}
            height={50}
            draggable={false}
          />
        </button>
      </div>
    </>
  );
}
