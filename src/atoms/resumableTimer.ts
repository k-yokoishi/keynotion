import { useAtom } from 'jotai'
import { atomWithImmer } from 'jotai-immer'

type ResumableTimer = {
  key: string
  state: 'running' | 'paused'
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
  const finish = (key: string) => setTimers((prev) => prev.filter((timer) => timer.key !== key))
  return { timers, pause, start, finish, setTimers }
}
