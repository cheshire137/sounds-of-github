(function() {
  const marioSounds = {
    heart: chrome.extension.getURL('sounds/mario-one-up.mp3'),
    '+1': chrome.extension.getURL('sounds/mario-coin.mp3'),
    '-1': chrome.extension.getURL('sounds/mario-fireball.wav'),
    laugh: chrome.extension.getURL('sounds/mario-stamp.mp3'),
    hooray: chrome.extension.getURL('sounds/mario-gift.mp3'),
    confused: chrome.extension.getURL('sounds/mario-pause.wav'),
    unreact: chrome.extension.getURL('sounds/mario-kick.wav'),
  }

  class SoundsOfGitHub {
    constructor(volume, soundPack) {
      this.volume = volume || '0.5'
      this.soundPack = soundPack || 'mario'
    }

    getSource(type) {
      if (this.soundPack === 'mario') {
        return marioSounds[type]
      }
      return null
    }

    playSound(src) {
      const sound = new Howl({ src, volume: this.volume })
      sound.play()
    }

    getReactionType(button) {
      const type = button.getAttribute('data-reaction-label') || button.value
      return type.split(' ')[0].toLowerCase()
    }

    addReaction(event) {
      const button = event.currentTarget
      const type = this.getReactionType(button)
      const source = this.getSource(type)
      if (source) {
        this.playSound(source)
      }
    }

    removeReaction() {
      const source = this.getSource('unreact')
      if (source) {
        this.playSound(source)
      }
    }
  }

  SoundsOfGitHubStorage.load().then(options => {
    const soundsOfGitHub = new SoundsOfGitHub(options.volume, options.soundPack)

    // Add reaction
    $('body').on('click', '.js-reaction-option-item', e => soundsOfGitHub.addReaction(e))
    $('body').on('click',
                 'button.reaction-summary-item:not(.user-has-reacted):not(.add-reaction-btn)',
                 e => soundsOfGitHub.addReaction(e))

    // Remove reaction
    $('body').on('click', 'button.user-has-reacted', () => soundsOfGitHub.removeReaction())
  })
})()
