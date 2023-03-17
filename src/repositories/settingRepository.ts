export class SettingRepository {
  private static readonly laserPointerEnabledKey = 'laserPointerEnabled'

  async getLaserPointerEnabled() {
    const items = await chrome.storage.local.get()
    if (
      SettingRepository.laserPointerEnabledKey in items &&
      typeof items.laserPointerEnabled === 'boolean'
    ) {
      return items.laserPointerEnabled
    } else {
      return false
    }
  }
  async setLaserPointerEnabled(enabled: boolean) {
    await chrome.storage.local.set({ [SettingRepository.laserPointerEnabledKey]: enabled })
  }
}
