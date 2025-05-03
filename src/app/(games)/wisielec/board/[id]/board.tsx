"use client";

import { useState, useEffect } from "react";
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

export default function WisielecBoardComponent({ id }: { id: number }) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<DataTypes[]>([]);

  useEffect(() => {
    const localData = localStorage.getItem(GameType.WISIELEC);

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
      router.push(`/wisielec/board/${Number(id) - 1}`);
    }
    if (e.key === "ArrowRight" && id <= data.length) {
      router.push(`/wisielec/board/${Number(id) + 1}`);
    }
  });

  const StartLayout = () => {
    const nextPage = () => router.push(`/wisielec/board/1`);

    KeyboardInteraction((e: KeyboardEvent) => {
      if (e.key === " ") nextPage();
    });

    return (
      <div className={styles.simpleLayout}>
        <h1>Wisielec</h1>

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
        <h1>Wisielec</h1>

        <button onClick={exitGame}>
          <p>Zakończ grę</p>
        </button>
      </div>
    );
  };

  const MainComponent = ({ params }: { params: DataTypes }) => {
    const [remainingTime, setRemainingTime] = useState<number>(
      params.time as any
    );

    const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
    const [mistakes, setMistakes] = useState(0);
    const [gameResult, setGameResult] = useState<"win" | "lose">();
    const [conductor, setConductor] = useState<TConductorInstance>();

    // time countdown
    useEffect(() => {
      if (remainingTime === -1 || gameResult) return;

      const interval = setInterval(() => {
        setRemainingTime((prevTime) => {
          const newTime = prevTime - 1000;

          if (newTime <= 0) {
            clearInterval(interval);
            setGameResult("lose");
            return 0;
          }

          return newTime;
        });
      }, 1000);

      return () => clearInterval(interval);
    }, [remainingTime, gameResult]);

    // checking game state result
    useEffect(() => {
      if (mistakes === params.mistakes) return setGameResult("lose");

      const lettersToGuess = params.phrase.split("").filter((value) => {
        return value.match(/[A-ZĄĆĘŁŃÓŚŹŻ]/) && !guessedLetters.includes(value);
      });

      if (!lettersToGuess.length) return setGameResult("win");
    }, [params, mistakes, guessedLetters]);

    // game win effect
    useEffect(() => {
      if (gameResult === "win") {
        setTimeout(() => conductor?.shoot(), 0);
        setTimeout(() => conductor?.shoot(), 500);
      }
    }, [gameResult, conductor]);

    KeyboardInteraction((e: KeyboardEvent) => {
      if (e.key === " ") {
        if (gameResult === undefined) setGameResult("win");
        else router.push(`/wisielec/board/${Number(id) + 1}`);
      }
    });

    const checkLetter = (letter: string) => {
      if (guessedLetters.includes(letter)) return;

      setGuessedLetters([...guessedLetters, letter]);

      if (!params.phrase.includes(letter)) setMistakes(mistakes + 1);
    };

    const polishAlphabet = "AĄBCĆDEĘFGHIJKLŁMNŃOÓPQRSŚTUVWXYZŹŻ";
    const vowels = "AĄEĘIOÓUY";

    const image = Math.ceil((15 / params.mistakes) * mistakes);

    return (
      <>
        <input
          className={styles.hiddenInput}
          ref={(input) => input?.focus()}
          onBlur={(e) => e.target.focus()}
          onInput={(e) => {
            if (gameResult) return;
            const input = e.target as HTMLInputElement;
            const value = input.value.toUpperCase();
            if (polishAlphabet.includes(value)) checkLetter(value);
            input.value = "";
          }}
        />

        <Fireworks
          onInit={({ conductor }: { conductor: TConductorInstance }) => {
            return setConductor(conductor);
          }}
        />

        <div className={styles.gameInfo}>
          <p>
            Kategoria: <span>{params.category}</span>
          </p>
          {remainingTime >= 0 && (
            <>
              <p>{"•"}</p>
              <p>
                Pozostały czas:{" "}
                <span style={{ color: remainingTime === 0 ? "red" : "" }}>
                  {`${Math.floor(remainingTime / 60_000)
                    .toString()
                    .padStart(2, "0")}:${Math.floor(
                    (remainingTime % 60_000) / 1_000
                  )
                    .toString()
                    .padStart(2, "0")}`}
                </span>
              </p>
            </>
          )}
        </div>

        <div className={styles.phraseContainer}>
          <div className={styles.phrase}>
            {params.phrase.split(" ").map((word, i) => (
              <div key={i}>
                {word.split("").map((sign, j) => {
                  const isLetter = sign.match(/[A-ZĄĆĘŁŃÓŚŹŻ]/);

                  if (isLetter) {
                    const letter =
                      guessedLetters.includes(sign) || gameResult !== undefined
                        ? sign
                        : "";

                    return (
                      <p
                        key={j}
                        style={{ color: gameResult === "win" ? "green" : "" }}
                        className={styles.letter}
                      >
                        {letter}
                      </p>
                    );
                  } else {
                    return (
                      <p key={j} className={styles.sign}>
                        {sign}
                      </p>
                    );
                  }
                })}
              </div>
            ))}
          </div>
        </div>

        <div className={styles.gameProgress}>
          <p className={styles.mistakes}>
            {"Błędy: "}
            <span style={{ color: mistakes === params.mistakes ? "red" : "" }}>
              {mistakes}/{params.mistakes}
            </span>
          </p>

          <div className={styles.letters}>
            {polishAlphabet.split("").map((letter, index) => (
              <button
                key={index}
                disabled={
                  guessedLetters.includes(letter) || gameResult !== undefined
                }
                className={vowels.includes(letter) ? styles.vowel : ""}
                onClick={() => checkLetter(letter)}
              >
                <p>{letter}</p>
              </button>
            ))}
          </div>
        </div>

        {mistakes > 0 && (
          <div className={styles.backgroundImage}>
            <Image
              alt=""
              src={`/wisielec/${image}.svg`}
              width={800}
              height={750}
              draggable={false}
            />
          </div>
        )}
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

        {data[id - 1] && <MainComponent params={data[id - 1]} />}
      </div>

      <div className={styles.navigation}>
        <button
          disabled={id <= 0}
          onClick={() => router.push(`/wisielec/board/${Number(id) - 1}`)}
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
          onClick={() => router.push(`/wisielec/board/${Number(id) + 1}`)}
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
