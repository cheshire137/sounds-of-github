(function() {
  const coin = chrome.extension.getURL('sounds/mario-coin.mp3')
  const fireball = chrome.extension.getURL('sounds/mario-fireball.wav')
  const gift = chrome.extension.getURL('sounds/mario-gift.mp3')
  const kick = chrome.extension.getURL('sounds/mario-kick.wav')
  const oneUp = chrome.extension.getURL('sounds/mario-one-up.mp3')
  const stamp = chrome.extension.getURL('sounds/mario-stamp.mp3')
  const pause = chrome.extension.getURL('sounds/mario-pause.wav')

  const soundSources = {
    heart: oneUp,
    '+1': coin,
    '-1': fireball,
    laugh: stamp,
    hooray: gift,
    confused: pause,
  }

  function playSound(src) {
    const sound = new Howl({ src, volume: 0.5 })
    sound.play()
  }

  function getReactionType(button) {
    const type = button.getAttribute('data-reaction-label') || button.value
    return type.split(' ')[0].toLowerCase()
  }

  function addReaction(event) {
    const button = event.currentTarget
    const type = getReactionType(button)
    const source = soundSources[type]
    if (source) {
      playSound(source)
    }
  }

  function removeReaction(event) {
    playSound(kick)
  }

  // Add reaction
  $('body').on('click', '.js-reaction-option-item', addReaction)
  $('body').on('click',
               'button.reaction-summary-item:not(.user-has-reacted):not(.add-reaction-btn)',
               addReaction)

  // Remove reaction
  $('body').on('click', 'button.user-has-reacted', removeReaction)
})()
