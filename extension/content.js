(function() {
  const src = chrome.extension.getURL('sounds/mario-coin.mp3')

  $('body').on('click', '.js-reaction-option-item', function(event) {
    const sound = new Howl({ src, volume: 0.5 })
    sound.play()
  })
})()
