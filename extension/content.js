(function() {
  const src = chrome.extension.getURL('sounds/mario-coin.mp3')
  const sound = new Howl({ src, volume: 0.5 })
  sound.play()
})()
