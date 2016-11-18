class SoundsOfGitHubStorage {
  static load() {
    return new Promise(resolve => {
      chrome.storage.sync.get('soundsOfGitHub', allOptions => {
        const options = allOptions.soundsOfGitHub || {}
        resolve(options)
      })
    })
  }

  static save(opts) {
    return new Promise(resolve => {
      chrome.storage.sync.set({ soundsOfGitHub: opts }, () => {
        resolve()
      })
    })
  }
}

window.SoundsOfGitHubStorage = SoundsOfGitHubStorage
