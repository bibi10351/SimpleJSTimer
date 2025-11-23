let timerInterval;
let timeLeft;

const minutesInput = document.getElementById('minutesInput');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const timerDisplay = document.getElementById('timerDisplay');

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

    timeLeft = Math.round(minutes * 60);
    timerDisplay.textContent = formatTime(timeLeft);
    
    // Disable input and start button while running
    minutesInput.disabled = true;
    startBtn.disabled = true;

    timerInterval = setInterval(() => {
        timeLeft--;
        
        if (timeLeft < 0) {
            clearInterval(timerInterval);
            timerDisplay.textContent = "Time's Up!";
            minutesInput.disabled = false;
            startBtn.disabled = false;
        } else {
            timerDisplay.textContent = formatTime(timeLeft);
        }
    }, 1000);
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
