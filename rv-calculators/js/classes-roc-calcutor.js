(function( $ ) {
  const __divID = `roc-calculator`;
  const __calcClass = `calculate-btn`;
  const __disabled = `disabled`;
  const __dateContainer = `datecontainer`;
  const __mainDiv = $(`#` + __divID);
  const __loadingGIF = __mainDiv.data(`gif`);
  const __h4List = {
    dateElement: `When does your conditional 2 year green card expire?`
  }

  let ___greenCardExpire = ``;
  

  const ninetyDaysEarlier = (currentDate) => {
    return currentDate - 90;
  }
  
  const formatDateMoment = ({ currentDate = ``, formatString = `MMMM DD, YYYY` }) => {
    return moment(currentDate).format(formatString);
  }

  class Elements {
    aButton = ({ title = ``, url = ``, className = `button` }) => {
      return $("<a/>")
        .addClass(className)
        .attr('href', url)
        .append(title);
    }
    bElement = ({ value = `` }) => {
      return $(`<b/>`).append(value);
    }
    h4Element = ({ value = `` }) => {
      return $(`<h4/>`).append(value);
    }
    divElement = ({ className = `` }) => {
      return $(`<div/>`).addClass(className);
    }
    buttonElement = ({ id = ``, className = ``, value = `` }) => {
      return $(`<button>`)
      .addClass(`button`)
      .addClass(`conditional`)
      .addClass(className)
      .html(value)
      .attr(`id`, id);
    }
    dateElement =  ({ id = ``, className = `` }) => {
      return $(`<input />`)
      .attr(`id`, id)
      .attr(`type`, `text`)
      .addClass(`form-control`)
      .addClass(className)
      .datetimepicker({ format: `YYYY-MM-DD` })
      .on(`dp.change`, function() {
        if ($(this).val().length > 0) {
          ___greenCardExpire = $(this).val();
        }
      })
      .on(`dp.hide`, function() {
        if ($(this).val().length > 0) {
          __mainDiv.children().children(`button`).removeAttr(__disabled);
        }
      });
    }
    loaderImg = ({ src = `` }) => {
      return $(`<img />`).attr(`src`, src);
    }
  }

  class Layout extends Elements {
    constructor() {
      super();
    }
    dateDisplay = () => {
      const displayContainer = this.divElement({ className: `main` });
      const h4Ele = this.h4Element({ value: __h4List.dateElement });
      const dateContainer = this.divElement({ className: __dateContainer });
      const inputDate = this.dateElement({ id: `roc-datepicker`});
      const buttonCalc = this.buttonElement({ 
        id: `calculate`, 
        className: __calcClass, 
        value: `Calculate` 
      }).attr(__disabled, __disabled);
      displayContainer.append(h4Ele).append(dateContainer.append(inputDate)).append(buttonCalc)
      __mainDiv.html(``).append(displayContainer);
    }
    loadingBar = () => {
      const loader = this.loaderImg({ src: __loadingGIF });
      __mainDiv.html(``).append(loader).delay(1000).promise().done(() => {
        const convDate = this.calculateROC({ datePick: ___greenCardExpire });
        this.successfullDisplay({ currentDate: convDate });
      });
    }
    progressBar = () => {
      const mainDiv = this.divElement({ className: `progress-bar` });
      const barDiv = this.divElement({ className: `bar` });
      const fillerDiv = this.divElement({ className: `filler` });
      mainDiv.append(barDiv.append(fillerDiv));
      __mainDiv.html(``).append(mainDiv).delay(500).promise().done(function() {
        $(this).children(`.progress-bar`).children(`.bar`).children(`.filler`).animate({ width: `100%` }, {
          duration: 500,
          complete: () => {
            ___greenCardExpire = ``;
            ROC.main();
          }
        });
      });
    }
    calculateROC = ({ datePick = `` }) => {
      let convtDate;
      if (datePick.length > 0) {
        const currentDate = datePick.toString().split(`-`);
        const tempYear = currentDate[0];
        const tempMonth = currentDate[1]-1; //monthly starts with zero
        const tempDay = currentDate[2];
        convtDate = new Date( tempYear, tempMonth, tempDay );
        convtDate.setDate(ninetyDaysEarlier(convtDate.getDate()));
      }
      return convtDate;
    }
    successfullDisplay = ({ currentDate = Date.now() }) => {
      const mainDiv = this.divElement({ className: `success` });
      const infoDiv = this.divElement({ className: `info` });
      const bEle = this.bElement({ value: formatDateMoment({  currentDate: ___greenCardExpire}) })
      infoDiv.append(`2 Year green card expiry date: `).append(bEle);
      const bEleSoonest = this.bElement({ value: formatDateMoment({ currentDate })});
      const h4EleSoonest = this.h4Element({ value: `The soonest you can file for removal of conditions is: `}).addClass(`output`).append(bEleSoonest);
      const aBtn = this.aButton({ 
        className: `button orange`,
        url: `https://rapidvisa.com/start-free-roc/`,
        title: `Start my Removal of Condition`
      });
      const buttonReset = this.buttonElement({
        id: `rv-reset`,
        className: `rv-reset-btn`,
        value: `Reset`
      });
      mainDiv.append(infoDiv).append(h4EleSoonest).append(buttonReset).append(aBtn);
      const prgressBar =this.progressBar;
      __mainDiv.html(``).append(mainDiv).delay(500).promise().done(function() {
        $(this).children().children(`.rv-reset-btn`).click(() => {
          prgressBar();
        });
      });
    }
  }
  class RemovalOfCondition extends Layout {
    constructor() {
      super();
    }
    main = () => {
      this.dateDisplay();
      const loadingBarFunc = this.loadingBar;
      __mainDiv.delay(500).promise().done(function() {
        $(this).children().children(`button`).click(function() {
          loadingBarFunc();
        });
      });
    }
  }
  const ROC = new RemovalOfCondition();
  $(document).ready(function(){
    ROC.main();
  });
})( jQuery );