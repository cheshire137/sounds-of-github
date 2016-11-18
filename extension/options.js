class OptionsPage {
  constructor() {
    this.findElements()
  }

  findElements() {
    this.volumeSlider = document.getElementById('volume')
    this.soundPackMenu = document.getElementById('sound-pack')
    this.versionEl = document.getElementById('extension-version')
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
}

document.addEventListener('DOMContentLoaded', () => {
  const page = new OptionsPage()
  page.setup()
});
