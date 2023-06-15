export class SettingRepository {
  private static readonly laserPointerEnabledKey = 'laserPointerEnabled'
  private static readonly sideBarEnabledKey = 'sideBarEnabled'
  private static readonly lastSideBarFixed = 'lastSideBarFixed'

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
      : true
  }
  async setSideBarEnabled(enabled: boolean) {
    await chrome.storage.local.set({ [SettingRepository.sideBarEnabledKey]: enabled })
  }

  async getLastSideBarFixed() {
    const items = await chrome.storage.local.get()
    return SettingRepository.lastSideBarFixed in items &&
      typeof items.lastSideBarFixed === 'boolean'
      ? items.lastSideBarFixed
      : true
  }
  async setLastSideBarFixed(fixed: boolean) {
    await chrome.storage.local.set({ [SettingRepository.lastSideBarFixed]: fixed })
  }
}
