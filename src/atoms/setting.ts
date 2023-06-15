import { atom, useAtom } from 'jotai'
import { atomWithImmer } from 'jotai-immer'
import { useEffect } from 'react'
import { SettingRepository } from '../repositories/settingRepository'
import { addListenerOnUpdateSetting } from '../services/messageService'

export type Setting = {
  laserPointerEnabled: boolean
  sideBarEnabled: boolean
  lastSideBarFixed: boolean
}

const settingAtom = atomWithImmer<Setting | null>(null)

export const useSetting = () => {
  const [setting, setSetting] = useAtom(settingAtom)

  addListenerOnUpdateSetting((setting) => {
    setSetting((prev) => {
      if (prev) {
        prev.laserPointerEnabled = setting.laserPointerEnabled
        prev.sideBarEnabled = setting.sideBarEnabled
      }
    })
  })

  useEffect(() => {
    const repository = new SettingRepository()
    Promise.all([
      repository.getLaserPointerEnabled(),
      repository.getSideBarEnabled(),
      repository.getLastSideBarFixed(),
    ]).then(([laserPointerEnabled, sideBarEnabled, lastSideBarFixed]) => {
      setSetting(() => ({
        laserPointerEnabled,
        sideBarEnabled,
        lastSideBarFixed,
      }))
    })
  }, [setSetting])

  return {
    setting,
  }
}
