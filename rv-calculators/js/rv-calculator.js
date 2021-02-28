(function( $ ) {
  const __divID = `nat-calculator-2`;
  const __progressBar = `progress-bar`;
  const __bar = `bar`;
  const __filler = `filler`;
  const __process = `process`;
  const __dateContainer = `datecontainer`;
 
  const mainDiv = $(`#` +__divID);
  
  class ProgressBar {
    constructor() {
      this.progress = 0;
      this.complete = 100;
      this.mainDiv = $(`<div/>`);
      this.timerID = setInterval(this.tick);
      this.start();
    }
    start = () => {
      const barDiv = $(`<div/>`);
      const fillerDiv = $(`<div/>`);
      barDiv.addClass(__bar).append(fillerDiv.addClass(__filler));
      this.mainDiv.addClass(__progressBar).append(barDiv);
    }
    tick = () => {
      const { progress, complete, timerID } = this;
      if (progress < complete) {
        this.progress++; 
        $(`.` + __progressBar + ` .` + __bar + ` .` + __filler).css(`width`, this.progress + '%');
      } else {
        clearInterval(timerID);
      }
    }
  }

  class DateTimerSection {
    constructor() {
      this.mainDiv = $(`<div/>`).addClass(__process);
      this.start();
    }
    start  = () => {
      const dateInput = $(`<input/>`)
        .attr(`id`, `ns-datepicker`)
        .attr(`type`, `text`)
        .addClass(`form-control`)
        .datetimepicker({ format: `YYYY-MM-DD` })
        .on(`dp.change`, function() {
          if ($(this).val().length > 0) {
            $(this).data("DateTimePicker").hide();
          }
        })
        .on(`dp.hide`, function() {
          console.log(`on datepicker hide`);
        });
      const h4Ele = $(`<h4/>`).html(`When was your first green card issued?`);
      const dateContainerDiv = $(`<div/>`).addClass(__dateContainer).append(dateInput);
      this.mainDiv.append(h4Ele).append(dateContainerDiv);
    }
  }

  $(document).ready(()=>{
    let greenCardIssued = '';
    const progressBar = new ProgressBar();
    const dateSection = new DateTimerSection();
    mainDiv.append(dateSection.mainDiv);
  });
})( jQuery );