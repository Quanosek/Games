'use client'

import { useState, useEffect, Fragment } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import toast from 'react-hot-toast'

import { GameType } from '@/utils/enums'
import PageLayout from '@/components/wrappers/page-layout'
import SavedGame from '@/components/saved-game'
import styles from './styles.module.scss'

export interface DataTypes {
  category: string
  question: string
  answers: Array<{ value: string; checked: boolean }>
}

export default function PnmPage() {
  const type = GameType.PNM

  const emptyData: DataTypes[] = new Array(2).fill({
    category: '',
    question: '',
    answers: new Array(4).fill({ value: '', checked: false }),
  })

  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState<DataTypes[][]>([emptyData])

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

  // check if board is empty
  const emptyBoardCheck = (data: DataTypes[]) => {
    return JSON.stringify(data) === JSON.stringify(emptyData)
  }

  // game form component
  const MainComponent = (i: number) => {
    const params = data[i]
    if (!params) return null

    return (
      <form
        id={`${i}`}
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault()

          return open(`/pnm/board/${i + 1}`, 'game_window', 'width=960, height=540')
        }}
      >
        <div className={styles.controls}>
          <h2>{`Etap ${i + 1}/${data.length}`}</h2>

          <div className={styles.buttons}>
            <button
              type='button'
              disabled={data.length === 1 && emptyBoardCheck(params)}
              onClick={() => {
                if (!emptyBoardCheck(params)) {
                  setData((prev) => {
                    const newData = [...prev]
                    newData[i] = emptyData
                    return newData
                  })
                } else {
                  setData((prev) => {
                    const newData = [...prev]
                    if (newData.length > 1) newData.splice(i, 1)

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
              disabled={
                !params.every(({ category, question, answers }) => {
                  return [
                    category,
                    question,
                    answers[0].value,
                    answers[1].value,
                    answers.some((answer) => answer.checked),
                  ].every(Boolean)
                })
              }
            >
              <p>Prezentuj</p>
            </button>
          </div>
        </div>

        <div className={styles.content}>
          {params.map((stage, j) => (
            <Fragment key={j}>
              <div className={styles.inputs}>
                <label>
                  <h3>Kategoria:</h3>

                  <input
                    name={`${i}-${j}-category`}
                    value={stage.category}
                    placeholder='Wpisz kategorię'
                    autoComplete='off'
                    maxLength={25}
                    onChange={(e) => {
                      const category = e.target.value
                        .trimStart() // space as first character
                        .replace(/\s\s/g, ' ') // double space

                      setData((prev) => {
                        const newData = [...prev]
                        newData[i][j] = {
                          ...newData[i][j],
                          category,
                        }
                        return newData
                      })
                    }}
                  />
                </label>

                <label>
                  <h3>Pytanie:</h3>

                  <textarea
                    name={`${i}-${j}-question`}
                    value={stage.question}
                    placeholder='Wpisz treść pytania'
                    autoComplete='off'
                    maxLength={91}
                    onChange={(e) => {
                      const question = e.target.value
                        .trimStart() // space as first character
                        .replace(/\s\s/g, ' ') // double space
                        .replace(/\n/g, '') // enters

                      setData((prev) => {
                        const newData = [...prev]
                        newData[i][j] = {
                          ...newData[i][j],
                          question,
                        }
                        return newData
                      })
                    }}
                  />
                </label>

                <div className={styles.answers}>
                  <h3>Odpowiedzi (tylko jedna poprawna):</h3>

                  {stage.answers.map((answer, k) => (
                    <div
                      key={k}
                      className={styles.answer}
                      style={{
                        // disable if prev or curr answer is empty
                        pointerEvents:
                          k === 0 || params[j].answers[k - 1].value || answer.value
                            ? 'unset'
                            : 'none',
                      }}
                    >
                      <input
                        name={`${i}-${j}-${k}-answer`}
                        tabIndex={
                          k === 0 || params[j].answers[k - 1].value || answer.value ? 0 : -1
                        }
                        value={answer.value}
                        placeholder={k === 0 ? 'Wpisz odpowiedź' : ''}
                        autoComplete='off'
                        maxLength={29}
                        onChange={(e) => {
                          const value = e.target.value
                            .trimStart() // space as first character
                            .replace(/\s\s/g, ' ') // double space

                          setData((prev) => {
                            const newData = [...prev]
                            newData[i][j] = {
                              ...newData[i][j],
                              answers: newData[i][j].answers.map((answer, l) =>
                                l === k ? { ...answer, value } : answer
                              ),
                            }
                            return newData
                          })
                        }}
                        onBlur={(e) => {
                          if (!e.target.value) {
                            setData((prev) => {
                              const newData = [...prev]
                              newData[i][j].answers[k] = {
                                ...newData[i][j].answers[k],
                                checked: false,
                              }
                              return newData
                            })
                          }
                        }}
                      />

                      <input
                        type='radio'
                        name={`${i}-${j}-check`}
                        checked={answer.checked}
                        tabIndex={-1}
                        style={{
                          // disable if answer is empty
                          pointerEvents: answer.value ? 'unset' : 'none',
                        }}
                        onChange={() => {
                          setData((prev) => {
                            const newData = [...prev]
                            newData[i][j] = {
                              ...newData[i][j],
                              answers: newData[i][j].answers.map((a, l) => {
                                // find specific answer and check it
                                return { ...a, checked: l === k }
                              }),
                            }
                            return newData
                          })
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {j === 0 && <hr />}
            </Fragment>
          ))}
        </div>
      </form>
    )
  }

  // main component render
  return (
    <PageLayout>
      <SavedGame type={type} data={JSON.stringify(data)} />
      <div className={styles.logo}>
        <p onClick={() => document.getElementById('legal')?.scrollIntoView()}>{'*'}</p>

        <Image
          alt='Postaw na milion'
          src='/pnm/images/logo.webp'
          width={475}
          height={314}
          draggable={false}
          priority={true}
        />
      </div>

      <div className={styles.navigation}>
        <Link href='/pnm/rules'>
          <p>{'📖 Zasady gry'}</p>
        </Link>

        <button
          onClick={() => {
            return open('/pnm/board/start', 'game_window', 'width=960, height=540')
          }}
        >
          <p>{'▶️ Tablica tytułowa'}</p>
        </button>
      </div>

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
              return toast.error('Osiągnięto limit 99 dodanych etapów')
            }

            setData([...data, emptyData])

            setTimeout(() => {
              document.getElementById(data.length.toString())?.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
              })
            }, 1)
          }}
        >
          <Image
            className='icon'
            alt='+'
            src='/icons/plus.svg'
            width={16}
            height={16}
            draggable={false}
          />
          <p>Dodaj etap</p>
        </button>
      </div>

      <div id='legal' className={styles.legal}>
        <p>
          <b>{'*'}</b> Gra została stworzona na podstawie polskiego teleturnieju{' '}
          <Link
            href='https://pl.wikipedia.org/wiki/Postaw_na_milion'
            target='_blank'
          >{`"Postaw na milion"`}</Link>
          , emitowanego na antenach{' '}
          <Link href='https://pl.wikipedia.org/wiki/Telewizja_Polska' target='_blank'>
            Telewizji Polskiej
          </Link>
          . Wszystkie prawa do emisji oraz znaki towarowe należą do ich prawnych właścicieli.
        </p>
      </div>
    </PageLayout>
  )
}
