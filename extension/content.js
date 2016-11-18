(function() {
  const coin = chrome.extension.getURL('sounds/mario-coin.mp3')
  const fireball = chrome.extension.getURL('sounds/mario-fireball.wav')
  const gift = chrome.extension.getURL('sounds/mario-gift.mp3')
  const kick = chrome.extension.getURL('sounds/mario-kick.wav')
  const oneUp = chrome.extension.getURL('sounds/mario-one-up.mp3')
  const stamp = chrome.extension.getURL('sounds/mario-stamp.mp3')
  const pause = chrome.extension.getURL('sounds/mario-pause.wav')

  const marioSounds = {
    heart: oneUp,
    '+1': coin,
    '-1': fireball,
    laugh: stamp,
    hooray: gift,
    confused: pause,
    unreact: kick,
  }

  function getSource(type, soundPack) {
    if (soundPack === 'mario') {
      return marioSounds[type]
    }
    return null
  }

  function playSound(src, volume) {
    const sound = new Howl({ src, volume })
    sound.play()
  }

  function getReactionType(button) {
    const type = button.getAttribute('data-reaction-label') || button.value
    return type.split(' ')[0].toLowerCase()
  }

  function addReaction(event, volume, soundPack) {
    const button = event.currentTarget
    const type = getReactionType(button)
    const source = getSource(type, soundPack)
    if (source) {
      playSound(source, volume)
    }
  }

  function removeReaction(volume, soundPack) {
    const source = getSource('unreact', soundPack)
    if (source) {
      playSound(source, volume)
    }
  }

  SoundsOfGitHubStorage.load().then(options => {
    const volume = options.volume || '0.5'
    const soundPack = options.soundPack || 'mario'

    // Add reaction
    $('body').on('click', '.js-reaction-option-item', e => addReaction(e, volume, soundPack))
    $('body').on('click',
                 'button.reaction-summary-item:not(.user-has-reacted):not(.add-reaction-btn)',
                 e => addReaction(e, volume, soundPack))

    // Remove reaction
    $('body').on('click', 'button.user-has-reacted', () => removeReaction(volume, soundPack))
  })
})()
