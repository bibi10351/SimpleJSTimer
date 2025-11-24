let timerInterval;
let endTime;

const minutesInput = document.getElementById('minutesInput');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const timerDisplay = document.getElementById('timerDisplay');

// Audio Context for the "ding" sound
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playDing() {
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
    oscillator.frequency.exponentialRampToValueAtTime(130.81, audioCtx.currentTime + 1); // Drop to C3

    gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 1);
}

function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function startTimer() {
    const minutes = parseFloat(minutesInput.value);
    
    if (isNaN(minutes) || minutes <= 0) {
        alert('Please enter a valid number of minutes.');
        return;
    }

    // Clear any existing timer
    clearInterval(timerInterval);

    // Calculate absolute end time
    const now = Date.now();
    const durationMs = Math.round(minutes * 60 * 1000);
    endTime = now + durationMs;

    // Initial display update
    const secondsLeft = Math.ceil(durationMs / 1000);
    timerDisplay.textContent = formatTime(secondsLeft);
    
    // Disable input and start button while running
    minutesInput.disabled = true;
    startBtn.disabled = true;

    timerInterval = setInterval(() => {
        const remainingMs = endTime - Date.now();
        const remainingSeconds = Math.ceil(remainingMs / 1000);
        
        if (remainingSeconds <= 0) {
            clearInterval(timerInterval);
            timerDisplay.textContent = "Time's Up!";
            minutesInput.disabled = false;
            startBtn.disabled = false;
            playDing();
        } else {
            timerDisplay.textContent = formatTime(remainingSeconds);
        }
    }, 100); // Check more frequently for better responsiveness
}

function resetTimer() {
    clearInterval(timerInterval);
    timerDisplay.textContent = "00:00";
    minutesInput.value = '';
    minutesInput.disabled = false;
    startBtn.disabled = false;
}

startBtn.addEventListener('click', startTimer);
resetBtn.addEventListener('click', resetTimer);
