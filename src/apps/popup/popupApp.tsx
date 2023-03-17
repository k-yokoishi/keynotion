import { styled } from '@stitches/react'
import React, { useEffect, useState } from 'react'
import { Switch } from '../../components/ui/switch.tsx/switch'
import { SettingRepository } from '../../repositories/settingRepository'
import { sendMessageToCurrentTab } from '../../services/messageService'
import { globalStyles } from '../../styles/global'
export const PopupApp = () => {
  const [laserPointerEnabled, setLaserPointerEnabled] = useState(false)

  useEffect(() => {
    const settingRepository = new SettingRepository()
    settingRepository.getLaserPointerEnabled().then(setLaserPointerEnabled)
  }, [])

  const onChangeLaserPointerEnabled = async (enabled: boolean) => {
    const settingRepository = new SettingRepository()
    setLaserPointerEnabled(enabled)
    console.log(enabled)
    settingRepository.setLaserPointerEnabled(enabled)
    sendMessageToCurrentTab({ type: 'updateSetting', payload: { laserPointerEnabled: enabled } })
  }
  globalStyles()
  return (
    <StyledAppContainer>
      <StyledHeader>Keynotion setting</StyledHeader>
      <SettingItem>
        <SettingItemLabel>Show laser pointer</SettingItemLabel>
        <Switch checked={laserPointerEnabled} onChange={onChangeLaserPointerEnabled}></Switch>
      </SettingItem>
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

const SettingItem = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
})
const SettingItemLabel = styled('div', {})
