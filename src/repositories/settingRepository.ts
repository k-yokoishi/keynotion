export class SettingRepository {
  private static readonly laserPointerEnabledKey = 'laserPointerEnabled'
  private static readonly sideBarEnabledKey = 'sideBarEnabled'

  async getLaserPointerEnabled() {
    const items = await chrome.storage.local.get()
    return SettingRepository.laserPointerEnabledKey in items &&
      typeof items.laserPointerEnabled === 'boolean'
      ? items.laserPointerEnabled
      : false
  }
  async setLaserPointerEnabled(enabled: boolean) {
    await chrome.storage.local.set({ [SettingRepository.laserPointerEnabledKey]: enabled })
  }

  async getSideBarEnabled() {
    const items = await chrome.storage.local.get()
    return SettingRepository.sideBarEnabledKey in items && typeof items.sideBarEnabled === 'boolean'
      ? items.sideBarEnabled
      : false
  }

  async setSideBarEnabled(enabled: boolean) {
    await chrome.storage.local.set({ [SettingRepository.sideBarEnabledKey]: enabled })
  }
}
