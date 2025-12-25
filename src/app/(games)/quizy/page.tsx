'use client'

import { useState, useEffect, Fragment } from 'react'
import Image from 'next/image'
import toast from 'react-hot-toast'
import TextareaAutosize from 'react-textarea-autosize'

import { GameType } from '@/utils/enums'
import PageLayout from '@/components/wrappers/page-layout'
import SavedGame from '@/components/saved-game'
import styles from './styles.module.scss'

export interface DataTypes {
  type: 'closed' | 'gap' | 'open'
  question: string
  answers: Array<{ value: string; checked: boolean }>
}

export default function QuizyPage() {
  const type = GameType.QUIZY

  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState<DataTypes[]>([])
  const [showDropdown, setShowDropdown] = useState(false)

  // load game data
  useEffect(() => {
    const localData = localStorage.getItem(type)

    if (localData) {
      try {
        const parsed = JSON.parse(localData)
        setData(parsed.data)
      } catch {
        localStorage.removeItem(type)
        window.location.reload()
      }
    }

    setIsLoading(false)
  }, [type])

  // save data on change
  useEffect(() => {
    if (isLoading) return

    const localData = JSON.parse(localStorage.getItem(type)!)
    localStorage.setItem(type, JSON.stringify({ ...localData, data }))
  }, [isLoading, data, type])

  // allow presentation only on valid form values
  const emptyForm = (params: DataTypes) => {
    if (params.type === 'closed') {
      return (
        params.question &&
        params.answers.some((answer) => answer.checked) &&
        params.answers.every((answer, index) => {
          if (index === 0) return true
          return answer.value ? params.answers[index - 1].value : true
        })
      )
    } else if (params.type === 'gap') {
      return /\[.*?\]/.test(params.question) // square brackets check
    } else if (params.type === 'open') {
      return params.question && params.answers[0].value
    }
  }

  // handle add buttons list show
  useEffect(() => {
    const hideButtonsList = () => setShowDropdown(false)

    if (showDropdown) document.addEventListener('click', hideButtonsList)
    return () => document.removeEventListener('click', hideButtonsList)
  }, [showDropdown])

  // inside form components
  const ClosedBoard = (i: number) => (
    <div className={styles.inputs}>
      <label>
        <h3>Pytanie:</h3>

        <TextareaAutosize
          name={`${i}-question`}
          value={data[i].question}
          placeholder='Wpisz treść pytania'
          autoComplete='off'
          maxLength={171}
          onChange={(e) => {
            const value = e.target.value
              .trimStart() // space as first character
              .replace(/\s\s+/g, ' ') // double space
              .replace(/\n/g, '') // enters

            setData((prev) => {
              const newData = [...prev]
              newData[i].question = value
              return newData
            })
          }}
        />
      </label>

      <div>
        <h3>Odpowiedzi (co najmniej jedna poprawna):</h3>

        <div className={styles.answersGrid}>
          {data[i].answers.map((answer, j) => (
            <div key={j} className={styles.answerBox}>
              <div
                className={styles.formValue}
                style={{
                  // disable if prev or current answer is empty
                  pointerEvents:
                    j === 0 || data[i].answers[j - 1].value || data[i].answers[j].value
                      ? 'unset'
                      : 'none',
                }}
              >
                <p>{`${['A', 'B', 'C', 'D'][j]}:`}</p>

                <textarea
                  name={`${i}-${j}-answer`}
                  tabIndex={j === 0 || data[i].answers[j - 1].value || answer.value ? 0 : -1}
                  value={answer.value}
                  placeholder={j === 0 ? 'Wpisz odpowiedź' : ''}
                  autoComplete='off'
                  maxLength={90}
                  onChange={(e) => {
                    const value = e.target.value
                      .trimStart() // space as first character
                      .replace(/\s\s+/g, ' ') // double space
                      .replace(/\n/g, '') // enters

                    setData((prev) => {
                      const newData = [...prev]
                      newData[i].answers[j] = {
                        ...newData[i].answers[j],
                        value,
                      }
                      return newData
                    })
                  }}
                  onBlur={(e) => {
                    if (!e.target.value) {
                      setData((prev) => {
                        const newData = [...prev]
                        newData[i].answers[j] = {
                          ...newData[i].answers[j],
                          checked: false,
                        }
                        return newData
                      })
                    }
                  }}
                />
              </div>

              <div className={styles.checkboxHandler}>
                <div
                  className={styles.checkbox}
                  style={{ pointerEvents: answer.value ? 'unset' : 'none' }}
                >
                  <input
                    type='checkbox'
                    id={`${i}-${j}-checkbox`}
                    checked={answer.checked}
                    onChange={(e) => {
                      const checked = e.target.checked

                      setData((prev) => {
                        const newData = [...prev]
                        newData[i].answers[j] = {
                          ...newData[i].answers[j],
                          checked,
                        }
                        return newData
                      })
                    }}
                  />

                  <label htmlFor={`${i}-${j}-checkbox`} className={styles.check}>
                    <p>poprawna odpowiedź</p>

                    <svg width='15px' height='15px' viewBox='0 0 18 18'>
                      <path d='M1,9 L1,3.5 C1,2 2,1 3.5,1 L14.5,1 C16,1 17,2 17,3.5 L17,14.5 C17,16 16,17 14.5,17 L3.5,17 C2,17 1,16 1,14.5 L1,9 Z'></path>
                      <polyline points='1 9 7 14 15 4'></polyline>
                    </svg>
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const GapBoard = (i: number) => (
    <>
      <TextareaAutosize
        name={`${i}-question`}
        value={data[i].question}
        placeholder='Wpisz zdanie z luką'
        autoComplete='off'
        maxLength={351}
        onChange={(e) => {
          const value = e.target.value
            .trimStart() // space as first character
            .replace(/\s\s+/g, ' ') // double space
            .replace(/\n/g, '') // enters

          setData((prev) => {
            const newData = [...prev]
            newData[i].question = value
            return newData
          })
        }}
      />

      <p className={styles.instruction}>
        {`Umieść ukryte fragmenty w kwadratowych nawiasach, na przykład: "Ala ma [kota] i psa".`}
      </p>
    </>
  )

  const OpenBoard = (i: number) => (
    <div className={styles.inputs}>
      <label>
        <h3>Pytanie:</h3>

        <TextareaAutosize
          name={`${i}-question`}
          value={data[i].question}
          placeholder='Wpisz treść pytania'
          autoComplete='off'
          maxLength={219}
          className={styles.question}
          onChange={(e) => {
            const value = e.target.value
              .trimStart() // space as first character
              .replace(/\s\s+/g, ' ') // double space
              .replace(/\n/g, '') // enters

            setData((prev) => {
              const newData = [...prev]
              newData[i].question = value
              return newData
            })
          }}
        />
      </label>

      <label>
        <h3>Odpowiedź:</h3>

        <TextareaAutosize
          name={`${i}-answer`}
          value={data[i].answers[0].value}
          placeholder='Wpisz poprawną odpowiedź'
          autoComplete='off'
          maxLength={235}
          className={styles.answer}
          onChange={(e) => {
            const value = e.target.value
              .trimStart() // space as first character
              .replace(/\s\s+/g, ' ') // double space
              .replace(/\n/g, '') // enters

            setData((prev) => {
              const newData = [...prev]
              data[i].answers[0].value = value
              return newData
            })
          }}
        />
      </label>
    </div>
  )

  // game form component
  const MainComponent = (i: number) => {
    if (!data[i]) return null

    let typeInfo: { src: string; name: string }

    switch (data[i].type) {
      case 'closed':
        typeInfo = { src: 'a-button', name: 'Pytanie zamknięte' }
        break
      case 'gap':
        typeInfo = { src: 'magnifying-glass', name: 'Uzupełnij lukę' }
        break
      case 'open':
        typeInfo = { src: 'thought-balloon', name: 'Pytanie otwarte' }
        break
    }

    return (
      <form
        id={`${i}`}
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault()

          if (!emptyForm(data[i])) return

          return open(`/quizy/board/${i + 1}`, 'game_window', 'width=960, height=540')
        }}
      >
        <div className={styles.controls}>
          <div className={styles.description}>
            <p>{`Plansza ${i + 1}/${data.length}`}</p>

            <p>{'•'}</p>

            <Image
              className='icon'
              alt=''
              src={`/icons/${typeInfo.src}.svg`}
              width={18}
              height={18}
              draggable={false}
            />

            <h2>{typeInfo.name}</h2>
          </div>

          <div className={styles.buttons}>
            <button
              type='button'
              onClick={() => {
                if (data[i].question || data[i].answers[0]?.value) {
                  setData((prev) => {
                    const newData = [...prev]
                    newData[i] = {
                      type: data[i].type,
                      question: '',
                      answers: data[i].answers.map(() => ({
                        value: '',
                        checked: false,
                      })),
                    }
                    return newData
                  })
                } else {
                  setData((prev) => {
                    const newData = [...prev]
                    newData.splice(i, 1)

                    const scrollIndex = i + 1 === data.length ? data.length - 2 : ''

                    setTimeout(() => {
                      document.getElementById(scrollIndex.toString())?.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center',
                      })
                    }, 1)

                    return newData
                  })
                }
              }}
            >
              <Image
                className='icon'
                alt='Usuń'
                src='/icons/trashcan.svg'
                width={20}
                height={20}
                draggable={false}
              />
            </button>

            <button
              type='button'
              disabled={i + 1 === data.length}
              onClick={() => {
                setData((prev) => {
                  const newData = [...prev]
                  ;[newData[i], newData[i + 1]] = [newData[i + 1], newData[i]]
                  return newData
                })
              }}
            >
              <Image
                style={{ rotate: '180deg' }}
                className='icon'
                alt='W dół'
                src='/icons/arrow.svg'
                width={20}
                height={20}
                draggable={false}
              />
            </button>

            <button
              type='button'
              disabled={i === 0}
              onClick={() => {
                setData((prev) => {
                  const newData = [...prev]
                  ;[newData[i], newData[i - 1]] = [newData[i - 1], newData[i]]
                  return newData
                })
              }}
            >
              <Image
                className='icon'
                alt='W górę'
                src='/icons/arrow.svg'
                width={20}
                height={20}
                draggable={false}
              />
            </button>

            <p>{'•'}</p>

            <button
              type='submit'
              className={styles.presentationButton}
              disabled={!emptyForm(data[i])}
            >
              <p>Prezentuj</p>
            </button>
          </div>
        </div>

        <div className={styles.content}>
          {data[i].type === 'closed' && ClosedBoard(i)}
          {data[i].type === 'gap' && GapBoard(i)}
          {data[i].type === 'open' && OpenBoard(i)}
        </div>
      </form>
    )
  }

  // main component render
  return (
    <PageLayout>
      <SavedGame type={type} data={JSON.stringify(data)} />

      <h1 className={styles.title}>
        Gra w <span>Quizy</span>
      </h1>

      {isLoading && (
        <div className='loading'>
          <p>Trwa ładowanie...</p>
        </div>
      )}

      <div
        className={styles.container}
        style={{
          visibility: isLoading ? 'hidden' : 'visible',
          position: 'relative',
          top: isLoading ? 10 : 0,
          opacity: isLoading ? 0 : 1,
          transition: 'top 150ms ease-out, opacity 200ms ease-out',
        }}
      >
        {data.length > 0 && (
          <>
            <button
              className={`${styles.formButton} ${styles.start}`}
              onClick={() => {
                if (!data.some(emptyForm)) {
                  return toast.error('Uzupełnij co najmniej jedną planszę')
                }

                return open('/quizy/board/0', 'game_window', 'width=960, height=540')
              }}
            >
              <p>Rozpocznij grę</p>
            </button>

            <div className={styles.formsContainer}>
              {Array.from({ length: data.length }).map((_, index) => (
                <Fragment key={index}>{MainComponent(index)}</Fragment>
              ))}
            </div>
          </>
        )}

        <div className={styles.dropdownHandler}>
          <button
            className={styles.formButton}
            onClick={() => {
              if (data.length >= 99) {
                toast.error('Osiągnięto limit 99 dodanych pytań')
              } else {
                setShowDropdown(true)
              }
            }}
          >
            {data.length > 0 ? (
              <>
                <Image
                  className='icon'
                  alt='+'
                  src='/icons/plus.svg'
                  width={16}
                  height={16}
                  draggable={false}
                />
                <p>Dodaj...</p>
              </>
            ) : (
              <p>Rozpocznij</p>
            )}
          </button>

          <div style={{ display: showDropdown ? '' : 'none' }} className={styles.dropdown}>
            <hr />

            <button
              onClick={() => {
                setData([
                  ...data,
                  {
                    type: 'closed',
                    question: '',
                    answers: new Array(4).fill({
                      value: '',
                      checked: false,
                    }),
                  },
                ])

                setTimeout(() => {
                  document.getElementById(data.length.toString())?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                  })
                }, 1)
              }}
            >
              <p>pytanie zamknięte</p>
            </button>

            <button
              onClick={() => {
                setData([
                  ...data,
                  {
                    type: 'gap',
                    question: '',
                    answers: [],
                  },
                ])

                setTimeout(() => {
                  document.getElementById(data.length.toString())?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                  })
                }, 1)
              }}
            >
              <p>uzupełnij lukę</p>
            </button>

            <button
              onClick={() => {
                setData([
                  ...data,
                  {
                    type: 'open',
                    question: '',
                    answers: [{ value: '', checked: false }],
                  },
                ])

                setTimeout(() => {
                  document.getElementById(data.length.toString())?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                  })
                }, 1)
              }}
            >
              <p>pytanie otwarte</p>
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
