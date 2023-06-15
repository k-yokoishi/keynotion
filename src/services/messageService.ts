export type MessageType = 'updateSetting'

type MessageBase<Type extends MessageType, Payload extends object> = {
  type: Type
  payload: Payload
}

export type UpdateSettingMessage = MessageBase<
  'updateSetting',
  {
    laserPointerEnabled: boolean
    sideBarEnabled: boolean
  }
>

export type Message = UpdateSettingMessage

export const sendMessageToCurrentTab = async (message: Message) => {
  const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true })
  if (tab.id) {
    const res = await chrome.tabs.sendMessage(tab.id, message)
    return res
  }
}

const addListerOnReceiveMessage = <T extends MessageType>(
  type: T,
  callback: (payload: Message['payload']) => void
) => {
  chrome.runtime.onMessage.addListener((message: Message) => {
    if (message.type === type) {
      callback(message.payload)
    }
  })
}

export const addListenerOnUpdateSetting = (
  callback: (payload: UpdateSettingMessage['payload']) => void
) => {
  addListerOnReceiveMessage('updateSetting', callback)
}
