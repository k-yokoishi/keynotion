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
    setTimers((prev) => {
      const timer = prev.find((v) => v.key === key)
      if (timer) {
        timer.state = 'paused'
      }
    })
  const start = (key: string) =>
    setTimers((prev) => {
      const timer = prev.find((v) => v.key === key)
      if (timer) {
        timer.state = 'running'
      } else {
        prev.push({ key, state: 'running' })
      }
    })
  const finish = (key: string) =>
    setTimers((prev) => {
      const timer = prev.find((timer) => timer.key !== key)
      if (timer) {
        timer.state = 'finished'
      }
    })
  return {
    timers: timers.filter((timer) => timer.state !== 'finished'),
    pause,
    start,
    finish,
    setTimers,
  }
}
