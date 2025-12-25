'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

import AnimatedBoard from '../animated-board'
import styles from '../styles.module.scss'

export default function PnmStartBoard() {
  const [showIntro, setShowIntro] = useState(true)

  const IntroComponent = () => {
    // video params
    const videoRef = useRef<HTMLVideoElement>(null)
    const [videoPlaying, setVideoPlaying] = useState(false)

    // update video playing state
    useEffect(() => {
      if (videoPlaying) videoRef.current?.play()
      else videoRef.current?.pause()
    }, [videoPlaying])

    // mouse behavior
    const [showCursor, setShowCursor] = useState(false)
    const cursorHideTimeout = useRef<NodeJS.Timeout | undefined>(undefined)

    useEffect(() => {
      const mouseMoveEvent = (e: MouseEvent) => {
        if ((e.movementX && e.movementY) === 0) return

        setShowCursor(true)

        clearTimeout(cursorHideTimeout.current)
        cursorHideTimeout.current = setTimeout(() => {
          return setShowCursor(false)
        }, 1500)
      }

      document.addEventListener('mousemove', mouseMoveEvent)
      return () => document.removeEventListener('mousemove', mouseMoveEvent)
    }, [])

    // keyboard interactions
    useEffect(() => {
      const KeyupEvent = (e: KeyboardEvent) => {
        if (e.ctrlKey || e.shiftKey || e.altKey || e.metaKey) return
        if (e.key === ' ') setVideoPlaying((prev) => !prev)
      }

      document.addEventListener('keyup', KeyupEvent)
      return () => document.removeEventListener('keyup', KeyupEvent)
    }, [])

    // component return
    return (
      <div style={{ cursor: showCursor ? '' : 'none' }} className={styles.introComponent}>
        {!videoPlaying && (
          <div
            className={styles.videoOverlay}
            onClick={() => {
              videoRef.current?.play()
              setShowCursor(false)
            }}
          >
            <button title='Odtwórz czołówkę teleturnieju [Spacja]' className={styles.playButton}>
              <Image
                className='icon'
                alt='Odtwórz'
                src='/icons/play.svg'
                width={100}
                height={100}
              />
            </button>

            <div className={styles.skipButton}>
              <button onClick={() => setShowIntro(false)}>
                <p>Pomiń czołówkę</p>
              </button>
            </div>
          </div>
        )}

        <video
          ref={videoRef}
          onPlaying={() => setVideoPlaying(true)}
          onEnded={() => setShowIntro(false)}
          onClick={() => {
            setVideoPlaying(false)
            setShowCursor(true)
          }}
        >
          <source src='/pnm/video/intro.mp4' type='video/mp4' />
          <p>Twoja przeglądarka nie obsługuje odtwarzania plików wideo</p>
        </video>
      </div>
    )
  }

  // show intro component
  if (showIntro) return <IntroComponent />

  // show start board
  return (
    <AnimatedBoard>
      <Image
        className={styles.logo}
        alt=''
        src='/pnm/images/logo.webp'
        width={949}
        height={628}
        draggable={false}
        priority
      />

      <audio src='/pnm/audio/entrance.mp3' autoPlay />
    </AnimatedBoard>
  )
}
