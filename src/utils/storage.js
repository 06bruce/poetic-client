const KEY = 'poem_studio_saved'

export function loadSaved() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    return JSON.parse(raw)
  } catch (e) {
    console.warn('Failed to load saved poems', e)
    return []
  }
}

export function saveSaved(items) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items))
  } catch (e) {
    console.warn('Failed to save poems', e)
  }
}
