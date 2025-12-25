/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'

import { useState, useEffect, useRef } from 'react'

import { GameType } from '@/utils/enums'
import { Myriad } from '@/utils/fonts'
import type { DataTypes } from '../../page'
import AnimatedBoard from '../animated-board'
import styles from '../styles.module.scss'

const KeyboardInteraction = (Shortcuts: any) => {
  useEffect(() => {
    const KeyupEvent = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.shiftKey || e.altKey || e.metaKey) return
      Shortcuts(e)
    }

    document.addEventListener('keyup', KeyupEvent)
    return () => document.removeEventListener('keyup', KeyupEvent)
  }, [Shortcuts])
}

export default function PnmBoardComponent({ id }: { id: number }) {
  const [data, setData] = useState<DataTypes[]>()
  const [selectedQuestion, setQuestion] = useState<DataTypes>()

  const categoriesAudio = useRef<HTMLAudioElement>(null)
  const selectAudio = useRef<HTMLAudioElement>(null)
  const answerAudio = useRef<HTMLAudioElement>(null)
  const questionAudio = useRef<HTMLAudioElement>(null)
  const timerAudio = useRef<HTMLAudioElement>(null)
  const stopAudio = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const storedData = localStorage.getItem(GameType.PNM)!
    const data = JSON.parse(storedData).data[id - 1]

    if (data) setData(data)

    setTimeout(() => categoriesAudio.current?.play(), 300)
  }, [id])

  if (!data) return null

  // CATEGORY SELECT LAYOUT
  const CategoriesLayout = () => {
    const [selected, setSelected] = useState<number>(-1)

    // category selection handler
    const categorySelected = (index: number) => {
      setSelected(index)
      selectAudio.current?.play()
      setTimeout(() => setQuestion(data[index]), 1_500)
    }

    // keyboard interactions
    KeyboardInteraction((e: KeyboardEvent) => {
      if (e.key === '1') categorySelected(0)
      if (e.key === '2') categorySelected(1)
    })

    return (
      <AnimatedBoard>
        <div className={styles.categorySelect}>
          {data.map((question, index) => (
            <button
              key={index}
              onClick={() => categorySelected(index)}
              style={{
                zIndex: index === selected ? 1 : 0,
                transform: index === selected ? 'scale(1.1)' : 'none',
                pointerEvents: [0, 1].includes(selected) ? 'none' : 'auto',
                top: [0, 1].includes(selected)
                  ? index === selected
                    ? index === 0
                      ? '6vw'
                      : '-7vw'
                    : index === 1
                      ? '-7vw'
                      : '6vw'
                  : '',
              }}
            >
              <p>{question.category}</p>
            </button>
          ))}
        </div>
      </AnimatedBoard>
    )
  }

  // GAME BOARD LAYOUT
  const GameLayout = () => {
    const [showBoard, setShowBoard] = useState(false)
    const [displayCounter, setDisplayCounter] = useState(0)

    useEffect(() => {
      // delay showing the board
      setTimeout(() => setShowBoard(true), 150)

      // auto reveal board content
      const answersAvailable = selectedQuestion?.answers.filter((answer) => answer.value)
      const answersCounted = answersAvailable?.length || 0

      questionAudio.current?.play()

      const interval = setInterval(() => {
        setDisplayCounter((prev) => {
          if (!answerAudio.current) return prev
          const newValue = prev + 1

          if (newValue < answersCounted + 1) {
            answerAudio.current.currentTime = 0
            answerAudio.current.play()
            return newValue
          } else {
            categoriesAudio.current?.play()
            clearInterval(interval)
            return 5
          }
        })
      }, 2_400)

      return () => clearInterval(interval)
    }, [])

    // main timer
    const [remainingTime, setRemainingTime] = useState(60_000) // 60 seconds

    useEffect(() => {
      if (displayCounter !== 6) return

      timerAudio.current?.play()

      const interval = setInterval(() => {
        setRemainingTime((prev) => {
          const newValue = prev - 100

          if (newValue === 0) clearInterval(interval)
          return newValue
        })
      }, 100)

      return () => clearInterval(interval)
    }, [displayCounter])

    // money packages status
    const [packages, setPackages] = useState({
      left: 40,
      boxes: new Array(4).fill({ packages: 0 }),
    })

    // keyboard interactions
    KeyboardInteraction((e: KeyboardEvent) => {
      if (e.key === ' ') {
        // start counter
        if (displayCounter === 5) {
          setDisplayCounter(6)

          // smooth muting of the question loop
          const interval = setInterval(() => {
            if (!questionAudio.current) return

            if (questionAudio.current.volume > 0.05) {
              questionAudio.current.volume -= 0.05
            } else {
              questionAudio.current.pause()
              clearInterval(interval)
            }
          }, 1000)
        }

        // stop time before end
        if (remainingTime !== 0 && displayCounter === 6) {
          setDisplayCounter(7)
          setRemainingTime(0)

          setTimeout(() => stopAudio.current?.play(), 300)

          // smooth muting of all background music
          const interval = setInterval(() => {
            if (!questionAudio.current || !timerAudio.current) return

            if (questionAudio.current.volume > 0.05) {
              questionAudio.current.volume -= 0.05
            }

            if (timerAudio.current.volume > 0.05) {
              timerAudio.current.volume -= 0.05
            } else {
              clearInterval(interval)
              questionAudio.current.pause()
              timerAudio.current?.pause()
            }
          }, 100)
        }

        // reveal answers
        if ((remainingTime === 0 && displayCounter === 6) || displayCounter === 7) {
          setDisplayCounter(8)

          const packagesWon = selectedQuestion?.answers
            .map((answer, index) => {
              return answer.checked ? packages.boxes[index].packages : 0
            })
            .reduce((acc, curr) => acc + curr, 0)

          if (packagesWon) {
            console.log(`You won ${packagesWon * 25_000} PLN!`)
          } else {
            console.log('You lost!')
          }
        }
      }
    })

    // display time counter
    const DynamicClock = () => {
      const minutes = Math.floor((remainingTime / (1_000 * 60)) % 60)
      const seconds = Math.floor((remainingTime / 1_000) % 60)
      const milliseconds = (remainingTime % 1_000) / 100

      const showMinutes = minutes.toString().padStart(2, '0')
      const showSeconds = seconds.toString().padStart(2, '0')
      const showMilliseconds = milliseconds.toString().padStart(1, '0')

      return (
        <h3
          style={{ color: remainingTime <= 10_000 ? '#d50000' : '' }}
        >{`${showMinutes}:${showSeconds}.${showMilliseconds}`}</h3>
      )
    }

    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>()

    return (
      <div
        style={{
          opacity: showBoard ? 1 : 0,
          transition: 'opacity 300ms ease-out',
        }}
      >
        <div>
          {selectedQuestion?.answers
            .filter((answer) => answer.value)
            .map((answer, index) => (
              <div key={index} className={styles.answer}>
                <div className={styles.screen}>
                  <div
                    className={styles.text}
                    style={{
                      opacity: displayCounter >= index + 1 ? 1 : 0,
                      transition: 'opacity 300ms ease-in-out',
                    }}
                  >
                    <h2>{answer.value}</h2>
                  </div>

                  <div className={styles.amount}>
                    <p>{`${packages.boxes[index].packages * 25_000} ZŁ`}</p>
                  </div>
                </div>

                <div className={styles.trap}>
                  {
                    //TODO: dynamic packages images
                  }
                </div>

                <div
                  className={styles.packagesControls}
                  style={{
                    visibility: displayCounter < 6 || remainingTime === 0 ? 'hidden' : 'visible',
                  }}
                >
                  <button
                    onMouseDown={() => {
                      setPackages((prev) => {
                        return {
                          ...prev,
                          left: prev.left + prev.boxes[index].packages,
                          boxes: prev.boxes.map((box, i) => {
                            if (i === index) {
                              return { packages: 0 }
                            }
                            return box
                          }),
                        }
                      })
                    }}
                  >
                    <p>{'--'}</p>
                  </button>

                  <button
                    onMouseDown={() => {
                      let interval = 250
                      const endInterval = 50
                      const decayFactor = 0.85

                      const removePackage = () => {
                        setPackages((prev) => {
                          if (prev.left === 40 || prev.boxes[index].packages === 0) {
                            return prev
                          }

                          return {
                            ...prev,
                            left: prev.left + 1,
                            boxes: prev.boxes.map((box, i) => {
                              if (i === index) {
                                return { packages: box.packages - 1 }
                              }
                              return box
                            }),
                          }
                        })

                        interval = Math.max(endInterval, interval * decayFactor)
                        if (interval < endInterval) interval = endInterval

                        const id = setTimeout(removePackage, interval)
                        setTimeoutId(id)
                      }

                      removePackage()
                    }}
                    onMouseUp={() => clearTimeout(timeoutId)}
                  >
                    <p>{'-'}</p>
                  </button>

                  <button
                    onMouseDown={() => {
                      let interval = 250
                      const endInterval = 50
                      const decayFactor = 0.85

                      const addPackage = () => {
                        setPackages((prev) => {
                          const boxesWithPackages = prev.boxes.filter((box) => {
                            return box.packages > 0
                          })

                          if (
                            prev.left === 0 ||
                            prev.boxes[index].packages === 40 ||
                            (boxesWithPackages.length === 3 && !prev.boxes[index].packages)
                          ) {
                            return prev
                          }

                          return {
                            ...prev,
                            left: prev.left - 1,
                            boxes: prev.boxes.map((box, i) => {
                              if (i === index) {
                                return { packages: box.packages + 1 }
                              }
                              return box
                            }),
                          }
                        })

                        interval = Math.max(endInterval, interval * decayFactor)
                        if (interval < endInterval) interval = endInterval

                        const id = setTimeout(addPackage, interval)
                        setTimeoutId(id)
                      }

                      addPackage()
                    }}
                    onMouseUp={() => clearTimeout(timeoutId)}
                  >
                    <p>{'+'}</p>
                  </button>

                  <button
                    onMouseDown={() => {
                      setPackages((prev) => {
                        const boxesWithPackages = prev.boxes.filter((box) => {
                          return box.packages > 0
                        })

                        if (boxesWithPackages.length === 3 && !prev.boxes[index].packages) {
                          return prev
                        }

                        return {
                          ...prev,
                          left: 0,
                          boxes: prev.boxes.map((box, i) => {
                            if (i === index) {
                              return { packages: box.packages + prev.left }
                            }
                            return box
                          }),
                        }
                      })
                    }}
                  >
                    <p>{'++'}</p>
                  </button>
                </div>
              </div>
            ))}
        </div>

        <div className={styles.packagesLeft}>
          {
            //TODO: dynamic packages images
          }

          <p>{`${packages.left * 25_000} ZŁ`}</p>
        </div>

        <div
          className={styles.questionBoard}
          style={{
            opacity: displayCounter >= 5 ? 1 : 0,
            transition: 'opacity 300ms ease-in-out',
          }}
        >
          <div className={styles.question}>
            <h1>{selectedQuestion?.question}</h1>
          </div>

          <div className={styles.timer}>
            <button
              className={styles.additionalTime}
              onClick={(e) => {
                setRemainingTime((prev) => prev + 30_000)
                e.currentTarget.disabled = true
              }}
            >
              <p>+30s</p>
            </button>

            <DynamicClock />
          </div>
        </div>

        <div className={styles.fullscreenImages}>
          <div
            className={styles.questionImage}
            style={{
              opacity: displayCounter >= 5 ? 1 : 0,
              transition: 'opacity 300ms ease-in-out',
            }}
          />

          <div className={styles.answersImage} />

          <div>
            {new Array(4).fill('').map((_, index) => (
              <div key={index} className={styles.answer}>
                <div className={styles.screen}>
                  <video className={styles.animatedBackground} autoPlay loop muted>
                    <source src='/pnm/video/animation.mp4' type='video/mp4' />
                  </video>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // main return
  return (
    <div
      className={Myriad.className}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
      }}
    >
      {!selectedQuestion && <CategoriesLayout />}
      {selectedQuestion && <GameLayout />}

      <audio ref={categoriesAudio} src='/pnm/audio/categories.mp3' />
      <audio ref={selectAudio} src='/pnm/audio/category-select.mp3' />
      <audio ref={answerAudio} src='/pnm/audio/answer-reveal.mp3' />
      <audio ref={questionAudio} src='/pnm/audio/question-loop.mp3' loop />
      <audio ref={timerAudio} src='/pnm/audio/question-timer.mp3' />
      <audio ref={stopAudio} src='/pnm/audio/time-stop.mp3' />
    </div>
  )
}
