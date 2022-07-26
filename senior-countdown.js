(function() {
  const COUNTDOWN_INTERVAL = 10;

  class SeniorCountdown {
    constructor() {
      this.init()
    }

    prepareCountdown() {
      const handler = {
        set: (currentContext, propertyKey, currentValue) => {
          if (!currentContext.value) {
            currentContext.stopCountdown()
          }
          currentContext[propertyKey] = currentValue;
          return true;
        }
      }

      return new Proxy({
        value: 100,
        stopCountdown: () => {}
      }, handler);
    }

    stopCountDown = ({ output, countdown }) => {
      return () => {
        output.innerHTML = `Restarting in ${countdown.value--}`
      }
    }

    stopCountdown({ output, intervalId }) {
      return () => {
        output.innerHTML = '';
        clearInterval(intervalId);
        this.toggleRestartButton(false)
      }
    }

    prepareRestartButton(restartBtn, initialFn) {
      restartBtn.addEventListener('click', initialFn.bind(this));
      return (value = true) => {
        restartBtn.removeEventListener('click', initialFn.bind(this));
        if (value) {
          restartBtn.setAttribute('disabled', true);
          return;
        }
        restartBtn.removeAttribute('disabled');
      }
    }

    init() {
      console.log('Initialized');
      const restartBtn = document.getElementById('restart-btn');
      const output = document.getElementById('output');
      const countdown = this.prepareCountdown();

      const params = {
        output,
        countdown
      }

      const updateCountdownFn = this.stopCountDown(params)
      const intervalId = setInterval(updateCountdownFn, COUNTDOWN_INTERVAL);

      {
        const params = { output, intervalId }
        const restartButtonFn = this.prepareRestartButton(restartBtn, this.init)
        restartButtonFn()
        const stopCountdownFn = this.stopCountdown.apply({ toggleRestartButton: restartButtonFn }, [params]);
        countdown.stopCountdown = stopCountdownFn
      }
    }
  }

  window.SeniorCountdown = SeniorCountdown
})();