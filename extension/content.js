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

  const bastionSounds = {
    heart: chrome.extension.getURL('sounds/bastion-heart.mp3'),
    '+1': chrome.extension.getURL('sounds/bastion-+1.mp3'),
    '-1': chrome.extension.getURL('sounds/bastion--1.mp3'),
    laugh: chrome.extension.getURL('sounds/bastion-laugh.mp3'),
    hooray: chrome.extension.getURL('sounds/bastion-hooray.mp3'),
    confused: chrome.extension.getURL('sounds/bastion-confused.mp3'),
    unreact: chrome.extension.getURL('sounds/bastion-unreact.mp3'),
  }

  const dvaSounds = {
    heart: chrome.extension.getURL('sounds/dva-heart.mp3'),
    '+1': chrome.extension.getURL('sounds/dva-+1.mp3'),
    '-1': chrome.extension.getURL('sounds/dva--1.mp3'),
    laugh: chrome.extension.getURL('sounds/dva-laugh.mp3'),
    hooray: chrome.extension.getURL('sounds/dva-hooray.mp3'),
    confused: chrome.extension.getURL('sounds/dva-confused.mp3'),
    unreact: chrome.extension.getURL('sounds/dva-unreact.mp3'),
  }

  class SoundsOfGitHub {
    constructor(volume, soundPack, unreactSound) {
      this.volume = volume || '0.5'
      this.soundPack = soundPack || 'mario'
      this.unreactSound = typeof unreactSound === 'undefined' ? true : unreactSound
    }

    getSource(type) {
      if (this.soundPack === 'mario') {
        return marioSounds[type]
      }
      if (this.soundPack === 'overwatch-bastion') {
        return bastionSounds[type]
      }
      if (this.soundPack === 'overwatch-dva') {
        return dvaSounds[type]
      }
      return null
    }

    playSound(src) {
      const sound = new Howl({ src, volume: this.volume })
      sound.play()
    }

    getReactionType(button) {
      let type = button.getAttribute('data-reaction-label') || button.value
      type = type.split(' ')[0].toLowerCase()
      if (type === 'smile') {
        return 'laugh'
      }
      if (type === 'tada') {
        return 'hooray'
      }
      if (type === 'thinking_face') {
        return 'confused'
      }
      return type
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
      if (!this.unreactSound) {
        return
      }
      const source = this.getSource('unreact')
      if (source) {
        this.playSound(source)
      }
    }
  }

  SoundsOfGitHubStorage.load().then(options => {
    let unreactSound = true
    if (options.unreactSound === 'no') {
      unreactSound = false
    }
    const soundsOfGitHub = new SoundsOfGitHub(options.volume, options.soundPack, unreactSound)

    // Add reaction
    $('body').on('click', '.js-reaction-option-item', e => soundsOfGitHub.addReaction(e))
    $('body').on('click',
                 'button.reaction-summary-item:not(.user-has-reacted):not(.add-reaction-btn)',
                 e => soundsOfGitHub.addReaction(e))

    // Remove reaction
    $('body').on('click', 'button.user-has-reacted', () => soundsOfGitHub.removeReaction())
  })
})()
