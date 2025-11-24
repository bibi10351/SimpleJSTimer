let timerInterval;
let endTime;

const minutesInput = document.getElementById('minutesInput');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');

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

function flip(flipCard, newNumber) {
    const topHalf = flipCard.querySelector('.top');
    const startNumber = parseInt(topHalf.textContent);

    if (newNumber === startNumber) return;

    const bottomHalf = flipCard.querySelector('.bottom');
    const topFlip = flipCard.querySelector('.top-flip');
    const bottomFlip = flipCard.querySelector('.bottom-flip');

    topFlip.textContent = startNumber;
    bottomFlip.textContent = newNumber;

    topFlip.addEventListener('animationstart', () => {
        topHalf.textContent = newNumber;
    }, { once: true });

    topFlip.addEventListener('animationend', () => {
        topFlip.textContent = newNumber;
        bottomHalf.textContent = newNumber;
        topFlip.classList.remove('flip'); // Reset if needed, though we use keyframes
    }, { once: true });

    // Reset animations by removing and re-adding elements or classes
    // A simpler way for this specific CSS setup:

    // 1. Set initial state
    topHalf.textContent = startNumber;
    bottomHalf.textContent = startNumber;
    topFlip.textContent = startNumber;
    bottomFlip.textContent = newNumber;

    // 2. Trigger animation
    topFlip.classList.remove('animating');
    bottomFlip.classList.remove('animating');

    void topFlip.offsetWidth; // Trigger reflow
    void bottomFlip.offsetWidth;

    topFlip.classList.add('animating');
    bottomFlip.classList.add('animating');

    // 3. Update static values halfway through or at end
    // Based on our CSS animation:
    // .top-flip animates 0.25s
    // .bottom-flip animates 0.25s with 0.25s delay

    setTimeout(() => {
        topHalf.textContent = newNumber;
    }, 240); // Just before top flip finishes

    setTimeout(() => {
        bottomHalf.textContent = newNumber;
        topFlip.classList.remove('animating');
        bottomFlip.classList.remove('animating');
        // Clean up
        topFlip.textContent = newNumber;
    }, 500);
}

// Simplified flip logic that matches the CSS structure provided in the plan
function updateFlipCard(unit, value) {
    const card = document.querySelector(`[data-unit="${unit}"]`);
    const top = card.querySelector('.top');
    const bottom = card.querySelector('.bottom');
    const topFlip = card.querySelector('.top-flip');
    const bottomFlip = card.querySelector('.bottom-flip');

    const currentValue = parseInt(top.textContent);
    if (value === currentValue) return;

    // Setup flip elements
    topFlip.textContent = currentValue;
    bottomFlip.textContent = value;

    // Trigger animation
    topFlip.classList.add('flip-top-anim');
    bottomFlip.classList.add('flip-bottom-anim');

    // Update static elements when animation is halfway/done
    // Top flip finishes at 250ms
    setTimeout(() => {
        top.textContent = value;
    }, 250);

    // Bottom flip finishes at 500ms
    setTimeout(() => {
        bottom.textContent = value;
        topFlip.classList.remove('flip-top-anim');
        bottomFlip.classList.remove('flip-bottom-anim');
        topFlip.textContent = value; // Ready for next
    }, 500);
}

function updateTimeDisplay(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;

    const mTens = Math.floor(m / 10);
    const mOnes = m % 10;
    const sTens = Math.floor(s / 10);
    const sOnes = s % 10;

    updateFlipCard('minutes-tens', mTens);
    updateFlipCard('minutes-ones', mOnes);
    updateFlipCard('seconds-tens', sTens);
    updateFlipCard('seconds-ones', sOnes);
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
    updateTimeDisplay(secondsLeft);

    // Disable input and start button while running
    minutesInput.disabled = true;
    startBtn.disabled = true;

    timerInterval = setInterval(() => {
        const remainingMs = endTime - Date.now();
        const remainingSeconds = Math.ceil(remainingMs / 1000);

        if (remainingSeconds <= 0) {
            clearInterval(timerInterval);
            updateTimeDisplay(0); // Ensure it shows 00:00
            // timerDisplay.textContent = "Time's Up!"; // Removed text update
            // For flip clock, we might want to show 00:00 or handle "Time's Up" differently.
            // Let's stick to 00:00 for the flip clock visual.

            minutesInput.disabled = false;
            startBtn.disabled = false;
            playDing();
        } else {
            updateTimeDisplay(remainingSeconds);
        }
    }, 100);
}

function resetTimer() {
    clearInterval(timerInterval);
    updateTimeDisplay(0);
    minutesInput.value = '';
    minutesInput.disabled = false;
    startBtn.disabled = false;
}

startBtn.addEventListener('click', startTimer);
resetBtn.addEventListener('click', resetTimer);
