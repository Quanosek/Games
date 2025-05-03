"use client";

import { useState, useEffect, Fragment } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import TextareaAutosize from "react-textarea-autosize";

import { GameType } from "@/utils/enums";
import PageLayout from "@/components/wrappers/page-layout";
import SavedGame from "@/components/saved-game";
import styles from "./styles.module.scss";

export interface DataTypes {
  mistakes: number;
  time: string;
  category: string;
  phrase: string;
}

export default function WisielecPage() {
  const type = GameType.WISIELEC;

  const emptyData: DataTypes = {
    mistakes: 10,
    time: "2m",
    category: "",
    phrase: "",
  };

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<DataTypes[]>([emptyData]);

  // load game data
  useEffect(() => {
    const localData = localStorage.getItem(type);

    if (localData) {
      try {
        const parsed = JSON.parse(localData);
        setData(parsed.data);
      } catch {
        localStorage.removeItem(type);
        window.location.reload();
      }
    }

    setIsLoading(false);
  }, [type]);

  // save data on change
  useEffect(() => {
    if (isLoading) return;

    const localData = JSON.parse(localStorage.getItem(type)!);
    localStorage.setItem(type, JSON.stringify({ ...localData, data }));
  }, [isLoading, data, type]);

  // check if board is empty
  const emptyBoardCheck = (data: DataTypes) => {
    return JSON.stringify(data) === JSON.stringify(emptyData);
  };

  // game form component
  const MainComponent = (index: number) => {
    const params = data[index];
    if (!params) return null;

    const wordsCount = params.phrase.trim().split(/\s+/).filter(Boolean).length;

    const polishAlphabet = "aąbcćdeęfghijklłmnńoópqrsśtuvwxyzźż";
    const vowels = "aąeęioóuy";

    const letters = Array.from(params.phrase.toLowerCase()).filter((letter) => {
      return polishAlphabet.includes(letter);
    });

    const uniqueLetters = new Set(letters);

    const vowelsCount = Array.from(uniqueLetters).filter((letter) => {
      return vowels.includes(letter);
    }).length;

    const phraseStats = {
      wordsCount,
      uniqueLetters: uniqueLetters.size,
      vowelsCount,
      consonantsCount: uniqueLetters.size - vowelsCount,
    };

    return (
      <form
        id={`${index}`}
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault();

          if (!(params.category && params.phrase)) return;

          return open(
            `/wisielec/board/${index + 1}`,
            "game_window",
            "width=960, height=540"
          );
        }}
      >
        <div className={styles.controls}>
          <h2>{`Plansza ${index + 1}/${data.length}`}</h2>

          <div className={styles.buttons}>
            <button
              type="button"
              disabled={data.length === 1 && emptyBoardCheck(params)}
              onClick={() => {
                if (!emptyBoardCheck(params)) {
                  setData((prev) => {
                    const newData = [...prev];
                    newData[index] = emptyData;
                    return newData;
                  });
                } else {
                  setData((prev) => {
                    const newData = [...prev];
                    if (newData.length > 1) newData.splice(index, 1);

                    const scrollIndex =
                      index + 1 === data.length ? data.length - 2 : "";

                    setTimeout(() => {
                      document
                        .getElementById(scrollIndex.toString())
                        ?.scrollIntoView({
                          behavior: "smooth",
                          block: "center",
                        });
                    }, 1);

                    return newData;
                  });
                }
              }}
            >
              <Image
                className="icon"
                alt="Usuń"
                src="/icons/trashcan.svg"
                width={20}
                height={20}
                draggable={false}
              />
            </button>

            <button
              type="button"
              disabled={index + 1 === data.length}
              onClick={() => {
                setData((prev) => {
                  const newData = [...prev];

                  [newData[index], newData[index + 1]] = [
                    newData[index + 1],
                    newData[index],
                  ];

                  return newData;
                });
              }}
            >
              <Image
                style={{ rotate: "180deg" }}
                className="icon"
                alt="W dół"
                src="/icons/arrow.svg"
                width={20}
                height={20}
                draggable={false}
              />
            </button>

            <button
              type="button"
              disabled={index === 0}
              onClick={() => {
                setData((prev) => {
                  const newData = [...prev];

                  [newData[index], newData[index - 1]] = [
                    newData[index - 1],
                    newData[index],
                  ];

                  return newData;
                });
              }}
            >
              <Image
                className="icon"
                alt="W górę"
                src="/icons/arrow.svg"
                width={20}
                height={20}
                draggable={false}
              />
            </button>

            <p>{"•"}</p>

            <button
              type="submit"
              className={styles.presentationButton}
              disabled={!(params.category && params.phrase)}
            >
              <p>Prezentuj</p>
            </button>
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.params}>
            <label>
              <p>Dozwolone błędy:</p>

              <select
                id={`${index}-mistakes`}
                value={params.mistakes}
                onChange={(e) => {
                  const value = parseInt(e.target.value);

                  setData((prev) => {
                    const newData = [...prev];
                    newData[index].mistakes = value;
                    return newData;
                  });
                }}
              >
                <option value="1">1</option>
                <option value="3">3</option>
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
              </select>
            </label>

            <label>
              <p>Czas:</p>

              <select
                id={`${index}-time`}
                value={params.time}
                onChange={(e) => {
                  const value = e.target.value;

                  setData((prev) => {
                    const newData = [...prev];
                    newData[index].time = value;
                    return newData;
                  });
                }}
              >
                <option value="-1">bez limitu</option>
                <option value="1m">1 min</option>
                <option value="2m">2 min</option>
                <option value="3m">3 min</option>
                <option value="4m">4 min</option>
                <option value="5m">5 min</option>
                <option value="10m">10 min</option>
              </select>
            </label>
          </div>

          <div className={styles.inputs}>
            <label>
              <h3>Kategoria:</h3>

              <input
                name={`${index}-category`}
                value={params.category}
                placeholder="Wpisz kategorię"
                autoComplete="off"
                maxLength={39}
                onChange={(e) => {
                  const value = e.target.value
                    .trimStart() // space as first character
                    .replace(/\s\s+/g, " "); // double space

                  setData((prev) => {
                    const newData = [...prev];
                    newData[index].category = value;
                    return newData;
                  });
                }}
                onBlur={() => {
                  setData((prev) => {
                    const newData = [...prev];
                    newData[index].category =
                      newData[index].category.toUpperCase();
                    return newData;
                  });
                }}
              />
            </label>

            <label>
              <h3>Hasło:</h3>

              <TextareaAutosize
                name={`${index}-phrase`}
                value={params.phrase}
                placeholder="Wpisz hasło"
                autoComplete="off"
                maxLength={119}
                onChange={(e) => {
                  const value = e.target.value
                    .trimStart() // space as first character
                    .replace(/\s\s+/g, " ") // double space
                    .replace(/\n/g, ""); // enters

                  setData((prev) => {
                    const newData = [...prev];
                    newData[index].phrase = value;
                    return newData;
                  });
                }}
                onBlur={() => {
                  setData((prev) => {
                    const newData = [...prev];
                    newData[index].phrase = newData[index].phrase.toUpperCase();
                    return newData;
                  });
                }}
              />
            </label>
          </div>

          <hr />

          <div className={styles.phraseStats}>
            <p>wyrazy: {phraseStats.wordsCount}</p>
            <p>litery: {phraseStats.uniqueLetters}</p>
            <p>samogłoski: {phraseStats.vowelsCount} </p>
            <p>spółgłoski: {phraseStats.consonantsCount} </p>
          </div>
        </div>
      </form>
    );
  };

  // main component render
  return (
    <PageLayout>
      <SavedGame type={type} data={JSON.stringify(data)} />

      <h1 className={styles.title}>
        Gra w <span>wisielca</span>
      </h1>

      {isLoading && (
        <div className="loading">
          <p>Trwa ładowanie...</p>
        </div>
      )}

      <div
        className={styles.container}
        style={{
          visibility: isLoading ? "hidden" : "visible",
          position: "relative",
          top: isLoading ? 10 : 0,
          opacity: isLoading ? 0 : 1,
          transition: "top 150ms ease-out, opacity 200ms ease-out",
        }}
      >
        <button
          className={`${styles.formButton} ${styles.start}`}
          onClick={() => {
            const filteredData = data.filter((item: DataTypes) => {
              return item.category && item.phrase;
            });

            if (filteredData.length <= 0) {
              return toast.error("Uzupełnij co najmniej jedną planszę");
            }

            return open(
              "/wisielec/board/0",
              "game_window",
              "width=960, height=540"
            );
          }}
        >
          <p>Rozpocznij grę</p>
        </button>

        <div className={styles.formsContainer}>
          {Array.from({ length: data.length }).map((_, index) => (
            <Fragment key={index}>{MainComponent(index)}</Fragment>
          ))}
        </div>

        <button
          className={styles.formButton}
          disabled={emptyBoardCheck(data[data.length - 1])}
          onClick={() => {
            if (data.length >= 99) {
              return toast.error("Osiągnięto limit 99 dodanych haseł");
            }

            setData([...data, emptyData]);

            setTimeout(() => {
              document.getElementById(data.length.toString())?.scrollIntoView({
                behavior: "smooth",
                block: "center",
              });
            }, 1);
          }}
        >
          <Image
            className="icon"
            alt="+"
            src="/icons/plus.svg"
            width={16}
            height={16}
            draggable={false}
          />

          <p>Dodaj hasło</p>
        </button>
      </div>
    </PageLayout>
  );
}
