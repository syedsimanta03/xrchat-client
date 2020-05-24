import './style.scss'
import { useState, useEffect } from 'react'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import PauseIcon from '@material-ui/icons/Pause'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import Link from 'next/link'
import isExternalUrl from '../../../utils/isExternalUrl'

type Props = {
  playing: boolean,
  onTogglePlay: (playing: boolean) => void,
  onSeekChange?: (seekTimeSeconds: number) => void,
  videoLengthSeconds: number,
  currentTimeSeconds: number,
  bufferedBars: Array<{ start: number, end: number }>,
  backButtonHref: string
}

const VideoSeeker = ({ playing, onTogglePlay, onSeekChange, videoLengthSeconds, currentTimeSeconds, bufferedBars, backButtonHref }: Props) => {
  const [seekPercentage, setSeekPercentage] = useState(0)

  useEffect(() => {
    setSeekPercentage((currentTimeSeconds / videoLengthSeconds) * 100)
  }, [videoLengthSeconds, currentTimeSeconds])
  const backButton = isExternalUrl(backButtonHref)
    ? <a href={backButtonHref}><ArrowBackIcon style={{ color: 'white' }} /></a>
    : <Link href={backButtonHref}><ArrowBackIcon style={{ color: 'white' }} /></Link>
  return (
    <div className="VideoSeeker">
      <div className="seek-bar-container">
        <div className="seek-bar full-bar" style={{
          width: '100%'
        }} />
        {bufferedBars.map(({ start, end }, index) => <div
          className="seek-bar buffer-bar"
          key={'buffered-bar' + index}
          style={{
            left: start * 100 + '%',
            width: (end - start) * 100 + '%'
          }} />)}
        <div className="seek-bar current-time-bar" style={{
          width: seekPercentage + '%'
        }} />
        <div className="seek-bar clickable-bar" onClick={e => {
          if (typeof onSeekChange === 'function') {
            const rect = (e.target as HTMLElement).getBoundingClientRect()
            const left = rect.left
            const width = rect.width
            const t = ((e.clientX - left) / width) * videoLengthSeconds
            onSeekChange(t)
          }
        }} />
      </div>
      {!playing && (<div className="back-button-container video-control-button">
        {backButton}
      </div>)}
      <div className="play-controls video-control-button">
        {
          playing ? <PauseIcon onClick={() => onTogglePlay(false)} style={{ color: 'white' }} />
            : <PlayArrowIcon onClick={() => onTogglePlay(true)} style={{ color: 'white' }} />
        }
      </div>
    </div>
  )
}

export default VideoSeeker
