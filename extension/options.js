class OptionsPage {
  constructor() {
    this.findElements()
  }

  findElements() {
    this.volumeSlider = document.getElementById('volume')
    this.soundPackMenu = document.getElementById('sound-pack')
    this.versionEl = document.getElementById('extension-version')
    this.successEl = document.getElementById('save-message')
  }

  getManifest() {
    const url = chrome.extension.getURL('manifest.json')
    return window.fetch(url).then(response => response.json())
  }

  setup() {
    SoundsOfGitHubStorage.load().then(options => {
      this.options = options
      this.setSelectedVolume()
      this.setSelectedSoundPack()
      this.listenForChanges()
    })
    this.getManifest().then(this.showExtensionVersion.bind(this))
  }

  showExtensionVersion(manifest) {
    this.versionEl.textContent = manifest.version
  }

  setSelectedVolume() {
    this.volumeSlider.value = this.options.volume || '0.5'
  }

  setSelectedSoundPack() {
    const soundPack = this.options.soundPack || 'mario'
    for (let opt, i = 0; opt = this.soundPackMenu.options[i]; i++) {
      if (opt.value === soundPack) {
        this.soundPackMenu.selectedIndex = i
        break
      }
    }
  }

  listenForChanges() {
    this.volumeSlider.addEventListener('change', () => this.saveOptions())
    this.soundPackMenu.addEventListener('change', () => this.saveOptions())
  }

  saveOptions() {
    this.options.volume = this.volumeSlider.value
    this.options.soundPack = this.soundPackMenu.value
    SoundsOfGitHubStorage.save(this.options).then(() => {
      this.successEl.style.opacity = 1
      setTimeout(() => {
        this.successEl.style.opacity = 0
      }, 1500)
    })
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const page = new OptionsPage()
  page.setup()
});
