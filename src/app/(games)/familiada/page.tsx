"use client";

import { useState, useEffect, Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import TextareaAutosize from "react-textarea-autosize";

import { GameType } from "@/utils/enums";
import PageLayout from "@/components/wrappers/page-layout";
import SavedGame from "@/components/saved-game";
import styles from "./styles.module.scss";

export interface DataTypes {
  checked: boolean;
  question: string;
  answers: Array<{ value: string; points: number }>;
  multiply: number | undefined;
}

export default function FamiliadaPage() {
  const type = GameType.FAMILIADA;

  const emptyData: DataTypes = {
    question: "",
    checked: false,
    answers: new Array(6).fill({ value: "", points: 0 }),
    multiply: undefined,
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

    return (
      <div id={`${index}`} className={styles.form}>
        <div className={styles.controls}>
          <h2>{`Plansza ${index + 1}/${data.length}`}</h2>

          <div className={styles.buttons}>
            <button
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
                    newData[index].checked = false;
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
              disabled={index + 1 === data.length}
              onClick={() => {
                data[index].multiply = undefined;
                data[index + 1].multiply = undefined;

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
              disabled={index === 0}
              onClick={() => {
                data[index - 1].multiply = undefined;
                data[index].multiply = undefined;

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
              className={styles.presentationButton}
              disabled={!params.checked}
              onClick={() => {
                return open(
                  `/familiada/board/${index + 1}`,
                  "game_window",
                  "width=960, height=540"
                );
              }}
            >
              <p>Prezentuj</p>
            </button>
          </div>
        </div>

        <form
          className={styles.content}
          onSubmit={(e) => {
            e.preventDefault();

            // form validation
            if (
              params.answers.filter((el) => el.value && el.points).length < 3
            ) {
              return toast.error(
                "Plansza musi zawierać co najmniej 3 uzupełnione odpowiedzi z punktami"
              );
            }

            toast.success("Plansza jest gotowa do prezentacji");

            // sort answers by points
            const sorted = [...params.answers].sort((a, b) => {
              return b.points - a.points;
            });

            // count filled answers
            const filled = sorted.filter((el) => el.value && el.points).length;

            // update saved data
            setData((prev) => {
              const newData = [...prev];
              newData[index] = {
                ...data[index],
                checked: true,
                answers: sorted,
                multiply: filled === 6 ? 1 : filled > 3 ? 2 : 3,
              };
              return newData;
            });
          }}
        >
          <label className={styles.question}>
            <p>{`${index + 1}.`}</p>

            <TextareaAutosize
              name={`${index}-question`}
              value={params.question}
              placeholder="Wpisz treść pytania"
              autoComplete="off"
              maxLength={219}
              onChange={(e) => {
                const value = e.target.value
                  .trimStart() // space as first character
                  .replace(/\s\s+/g, " ") // double space
                  .replace(/\n/g, ""); // enters

                setData((prev) => {
                  const newData = [...prev];
                  newData[index].question = value;
                  return newData;
                });
              }}
            />
          </label>

          <hr />

          <div className={styles.answers}>
            {params.answers.map((answer, i) => (
              <div key={i}>
                <label className={styles.value}>
                  <p>Odpowiedź {i + 1}:</p>

                  <input
                    name={`${index}-${i}-answer`}
                    value={params.answers[i].value}
                    placeholder={i === 0 ? "Wpisz odpowiedź" : ""}
                    autoComplete="off"
                    maxLength={17}
                    required={!!answer.points}
                    onChange={(e) => {
                      const regex =
                        /[^A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż\s!-/:-@\[-`{-~]/g;

                      const value = e.target.value
                        .replace(regex, "") // special characters
                        .trimStart() // space as first character
                        .replace(/\s\s+/g, " "); // double space

                      setData((prev) => {
                        const newData = [...prev];
                        newData[index].checked = false;
                        newData[index].answers[i] = {
                          ...newData[index].answers[i],
                          value,
                        };
                        return newData;
                      });
                    }}
                    onBlur={() => {
                      setData((prev) => {
                        const newData = [...prev];
                        newData[index].answers[i].value =
                          newData[index].answers[i].value.toUpperCase();
                        return newData;
                      });
                    }}
                  />
                </label>

                <label className={styles.points}>
                  <p>punkty:</p>

                  <input
                    type="number"
                    name={`${index}-${i}-points`}
                    value={answer.points || ""}
                    placeholder={i === 0 ? "0" : ""}
                    autoComplete="off"
                    max={99} // board limit
                    min={0}
                    required={!!answer.value}
                    onInput={(e) => {
                      e.currentTarget.value = e.currentTarget.value.replace(
                        /[^0-9]/g,
                        ""
                      );
                    }}
                    onChange={(e) => {
                      if (e.target.value.length > 2) return;
                      const points = Number(e.target.value);

                      setData((prev) => {
                        const newData = [...prev];
                        newData[index].checked = false;
                        newData[index].answers[i] = {
                          ...newData[index].answers[i],
                          points,
                        };
                        return newData;
                      });
                    }}
                  />
                </label>
              </div>
            ))}
          </div>

          <hr />

          <div className={styles.pointsAmount}>
            <button type="submit">
              <Image
                style={{ rotate: "90deg" }}
                className="icon"
                alt=""
                src="/icons/magnifying-glass.svg"
                width={16}
                height={16}
                draggable={false}
              />

              <p>Sprawdź</p>
            </button>

            <div className={styles.multiplier}>
              <p>
                {"Suma: "}
                {data[index].answers.reduce((acc, curr) => {
                  return acc + (curr.points || 0);
                }, 0)}
                /100
              </p>

              <select
                style={{ display: data[index].checked ? "" : "none" }}
                name={`${index}-multiply`}
                value={data[index].multiply}
                onChange={(e) => {
                  const value = parseInt(e.target.value);

                  setData((prev) => {
                    const newData = [...prev];
                    newData[index].multiply = value;
                    return newData;
                  });
                }}
              >
                <option value={1}>{"× 1"}</option>
                <option value={2}>{"× 2"}</option>
                <option value={3}>{"× 3"}</option>
                <option value={4}>{"× 4"}</option>
                <option value={5}>{"× 5"}</option>
              </select>
            </div>
          </div>
        </form>
      </div>
    );
  };

  // main component render
  return (
    <PageLayout>
      <SavedGame type={type} data={JSON.stringify(data)} />

      <div className={styles.logo}>
        <p onClick={() => document.getElementById("legal")?.scrollIntoView()}>
          {"*"}
        </p>

        <Image
          alt="Familiada"
          src="/familiada/images/logo.svg"
          width={800}
          height={130}
          draggable={false}
          priority={true}
        />
      </div>

      <div className={styles.navigation}>
        <Link href="/familiada/rules">
          <p>{"📖 Zasady gry"}</p>
        </Link>

        <button
          onClick={() => {
            return open(
              "/familiada/board/start",
              "game_window",
              "width=960, height=540"
            );
          }}
        >
          <p>{"▶️ Tablica tytułowa"}</p>
        </button>
      </div>

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
              return toast.error("Osiągnięto limit 99 dodanych planszy");
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

          <p>Dodaj planszę</p>
        </button>
      </div>

      <div id="legal" className={styles.legal}>
        <p>
          <b>{"*"}</b> Gra została stworzona na podstawie polskiego teleturnieju{" "}
          <Link
            href="https://pl.wikipedia.org/wiki/Familiada"
            target="_blank"
          >{`"Familiada"`}</Link>
          , emitowanego na antenie{" "}
          <Link href="https://pl.wikipedia.org/wiki/TVP2" target="_blank">
            TVP2
          </Link>
          . Wszystkie prawa do emisji oraz znaki towarowe należą do ich prawnych
          właścicieli.
        </p>
      </div>
    </PageLayout>
  );
}
