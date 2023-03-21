import { useAtom } from 'jotai'
import { atomWithImmer } from 'jotai-immer'

export type TimerState = 'running' | 'paused' | 'finished'

export type ResumableTimer = {
  key: string
  state: TimerState
}

const timersAtom = atomWithImmer<ResumableTimer[]>([])

export const useResumableTimers = () => {
  const [timers, setTimers] = useAtom(timersAtom)
  const pause = (key: string) =>
    setTimers((prev) =>
      prev.map((timer) => ({ ...timer, state: timer.key === key ? 'paused' : timer.state }))
    )
  const start = (key: string) => {
    setTimers((prev) => {
      const timer = prev.find((v) => v.key === key)
      if (timer) {
        timer.state = 'running'
      } else {
        prev.push({ key, state: 'running' })
      }
    })
  }

  const finish = (key: string) => {
    setTimers((prev) =>
      prev.map((timer) => ({ ...timer, state: timer.key === key ? 'finished' : timer.state }))
    )
  }
  return {
    timers: timers.filter((timer) => timer.state !== 'finished'),
    pause,
    start,
    finish,
    setTimers,
  }
}
