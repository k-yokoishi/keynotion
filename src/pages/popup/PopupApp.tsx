import { useLayoutEffect, useState } from 'react'
import { SettingRepository } from '../../repositories/settingRepository'
import { sendMessageToCurrentTab } from '../../services/messageService'
import { globalStyles } from '../../styles/global'
import { styled } from '../../styles/theme'
import { Switch } from '../../components/ui/switch/Switch'
export const PopupApp = () => {
  const [laserPointerEnabled, setLaserPointerEnabled] = useState(false)
  const [sidebarEnabled, setSidebarEnabled] = useState(false)

  console.log('PopupApp')
  useLayoutEffect(() => {
    const settingRepository = new SettingRepository()
    settingRepository.getLaserPointerEnabled().then(setLaserPointerEnabled)
    settingRepository.getSideBarEnabled().then(setSidebarEnabled)
  }, [])

  const onChangeLaserPointerEnabled = async (enabled: boolean) => {
    const settingRepository = new SettingRepository()
    setLaserPointerEnabled(enabled)
    settingRepository.setLaserPointerEnabled(enabled)
    sendMessageToCurrentTab({
      type: 'updateSetting',
      payload: { laserPointerEnabled: enabled, sideBarEnabled: sidebarEnabled },
    })
  }
  const onChangeSidebarEnabled = async (enabled: boolean) => {
    const settingRepository = new SettingRepository()
    setSidebarEnabled(enabled)
    settingRepository.setSideBarEnabled(enabled)
    sendMessageToCurrentTab({
      type: 'updateSetting',
      payload: { sideBarEnabled: enabled, laserPointerEnabled: laserPointerEnabled },
    })
  }
  globalStyles()
  return (
    <StyledAppContainer>
      <StyledHeader>Keynotion setting</StyledHeader>
      <SettingItemContainer>
        <SettingItem>
          <SettingItemLabel>Show side bar</SettingItemLabel>
          <Switch checked={sidebarEnabled} onChange={onChangeSidebarEnabled}></Switch>
        </SettingItem>
        <SettingItem>
          <SettingItemLabel>Show laser pointer</SettingItemLabel>
          <Switch checked={laserPointerEnabled} onChange={onChangeLaserPointerEnabled}></Switch>
        </SettingItem>
      </SettingItemContainer>
    </StyledAppContainer>
  )
}

const StyledHeader = styled('header', {
  fontSize: 18,
  fontWeight: 500,
  paddingBottom: 12,
  marginBottom: 12,
  lineHeight: 1,
  borderBottom: 'solid 1px rgba(55, 53, 47, 0.16)',
})

const StyledAppContainer = styled('div', {
  borderRadius: 5,
  background: 'White',
  width: 300,
  padding: 16,
})

const SettingItemContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  rowGap: 8,
})

const SettingItem = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
})
const SettingItemLabel = styled('div', {})
