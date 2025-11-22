document.addEventListener('DOMContentLoaded', function() {
  const slider = document.getElementById('speedSlider');
  const currentSpeedDisplay = document.getElementById('currentSpeed');
  const manualInput = document.getElementById('manualSpeed');
  const applyManual = document.getElementById('applyManual');
  const resetButton = document.getElementById('resetSpeed');
  const muteButton = document.getElementById('muteButton');

  let isMuted = false;

  function executeInTab(func, args = []) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.scripting.executeScript({
        target: {tabId: tabs[0].id},
        func: func,
        args: args
      });
    });
  }

  function setSpeed(speed) {
    executeInTab((s) => {
      const video = document.querySelector('video');
      if (video) video.playbackRate = s;
    }, [speed]);
    currentSpeedDisplay.textContent = speed.toFixed(2);
    slider.value = speed;
  }

  function toggleMute() {
    isMuted = !isMuted;
    executeInTab((mute) => {
      const video = document.querySelector('video');
      if (video) video.muted = mute;
    }, [isMuted]);
    muteButton.textContent = isMuted ? "🔊 Unmute" : "🔇 Mute";
  }

  // Set speed after releasing slider
  slider.addEventListener('change', function() {
    const speed = parseFloat(slider.value);
    setSpeed(speed);
    manualInput.value = speed;
  });

  applyManual.addEventListener('click', function() {
    const speed = parseFloat(manualInput.value);
    if (!isNaN(speed)) setSpeed(speed);
  });

  resetButton.addEventListener('click', function() {
    setSpeed(1);
    manualInput.value = 1;
  });

  muteButton.addEventListener('click', toggleMute);
});
