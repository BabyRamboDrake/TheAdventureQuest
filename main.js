
const timer = {
    pomodoro: 20,
    shortBreak: 5,
    longBreak: 15,
    longBreakInterval: 4,
  };

  const mainButton = document.getElementById('js-btn');
  const buttonSound = new Audio('button-sound.mp3');
  mainButton.addEventListener('click', () => {
    buttonSound.play();
    const { action } = mainButton.dataset;
    if (action === 'start') {
      startTimer();
      } else {
        stopTimer();
    }
  });

  const modeButtons = document.querySelector('#js-mode-buttons');
modeButtons.addEventListener('click', handleMode);

function handleMode(event) {
    const { mode } = event.target.dataset;
  
    if (!mode) return;
  
    switchMode(mode);
    stopTimer();
  }

function switchMode(mode) {
    timer.mode = mode;
    timer.remainingTime = {
      total: timer[mode] * 60,
      minutes: timer[mode],
      seconds: 0,
    };

  
    document
      .querySelectorAll('button[data-mode]')
      .forEach(e => e.classList.remove('active'));
    document.querySelector(`[data-mode="${mode}"]`).classList.add('active');
    document.body.style.backgroundColor = `var(--${mode})`;
  
    updateClock();
  }


  function getRemainingTime(endTime) {
    const currentTime = Date.parse(new Date());
    const difference = endTime - currentTime;
  
    const total = Number.parseInt(difference / 1000, 10);
    const minutes = Number.parseInt((total / 60) % 60, 10);
    const seconds = Number.parseInt(total % 60, 10);
  
    return {
      total,
      minutes,
      seconds,
    };
  }

  function startTimer() {
    let { total } = timer.remainingTime;
    const endTime = Date.parse(new Date()) + total * 1000;
  
    let account = 0; // initialize account balance
  
    mainButton.dataset.action = 'stop';
    mainButton.textContent = 'stop';
    mainButton.classList.add('active');
  
    interval = setInterval(function() {
      timer.remainingTime = getRemainingTime(endTime);
      updateClock();
  
      // add 585/60 to the account balance every minute
      account += 585/60;
  
      total = timer.remainingTime.total;
      if (total <= 0) {
        clearInterval(interval);
  
        switch (timer.mode) {
          case 'pomodoro':
            if (timer.sessions % timer.longBreakInterval === 0) {
              switchMode('longBreak');
            } else {
              switchMode('shortBreak');
            }
            break;
          default:
            switchMode('pomodoro');
        }
  
        document.querySelector(`[data-sound="${timer.mode}"]`).play();
  
        startTimer();
      }
    }, 1000);
  
    setInterval(function() {
      // update the account balance in the UI every minute
      let accountElement = document.getElementById('js-account-balance');
      accountElement.textContent = account.toFixed(2);
      //save the account balance to localStorage
      localStorage.setItem('accountBalance', account.toFixed(2));
    }, 60000); // execute this function every minute (60000 milliseconds)
  }

  function stopTimer() {
    clearInterval(interval);
  
    mainButton.dataset.action = 'start';
    mainButton.textContent = 'start';
    mainButton.classList.remove('active');
  }

  function updateClock() {
    const { remainingTime } = timer;
    const minutes = `${remainingTime.minutes}`.padStart(2, '0');
    const seconds = `${remainingTime.seconds}`.padStart(2, '0');
  
    const min = document.getElementById('js-minutes');
    const sec = document.getElementById('js-seconds');
    min.textContent = minutes;
    sec.textContent = seconds;
  }



document.addEventListener('DOMContentLoaded', () => {
    switchMode('pomodoro');

    // retrieve the account balance from localStorage
  let accountBalance = localStorage.getItem('accountBalance');
  if (accountBalance) {
    let accountElement = document.getElementById('js-account-balance');
    accountElement.textContent = accountBalance;
  }
});


