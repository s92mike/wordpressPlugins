import Elements from "./classes-common.js";
(function ($) {
  const __divID = `roc-calculator`;
  const __calcClass = `calculate-btn`;
  const __disabled = `disabled`;
  const __dateContainer = `datecontainer`;
  const __mainDiv = $(`#` + __divID);
  const __loadingGIF = __mainDiv.data(`gif`);
  const __h4List = {
    dateElement: `When does your conditional 2 year green card expire?`,
  };

  let ___greenCardExpire = ``;

  const ninetyDaysEarlier = (currentDate) => {
    return currentDate - 90;
  };

  const formatDateMoment = ({
    currentDate = ``,
    formatString = `MMMM DD, YYYY`,
  }) => {
    return moment(currentDate).format(formatString);
  };

  class Layout extends Elements {
    constructor() {
      super();
    }
    updateData = ({ type, value }) => {
      switch (type) {
        case `greenCard`:
          ___greenCardExpire = value;
          break;
        default:
          break;
      }
    };
    dateDisplay = () => {
      const displayContainer = this.divElement({ className: `main` });
      const h4Ele = this.h4Element({ value: __h4List.dateElement });
      const dateContainer = this.divElement({ className: __dateContainer });
      const inputDate = this.dateElement({
        id: `roc-datepicker`,
        updateGlobal: this.updateData,
        displayDiv: __mainDiv,
      });
      const buttonCalc = this.buttonElement({
        id: `calculate`,
        className: __calcClass,
        value: `Calculate`,
      }).attr(__disabled, __disabled);
      displayContainer
        .append(h4Ele)
        .append(dateContainer.append(inputDate))
        .append(buttonCalc);
      __mainDiv.html(``).append(displayContainer);
    };
    calculateROC = ({ datePick = `` }) => {
      let convtDate;
      if (datePick.length > 0) {
        const currentDate = datePick.toString().split(`-`);
        const tempYear = currentDate[0];
        const tempMonth = currentDate[1] - 1; //monthly starts with zero
        const tempDay = currentDate[2];
        convtDate = new Date(tempYear, tempMonth, tempDay);
        convtDate.setDate(ninetyDaysEarlier(convtDate.getDate()));
      }
      return convtDate;
    };
    successfullDisplay = ({ currentDate = Date.now() }) => {
      const {
        progressBar,
        divElement,
        bElement,
        h4Element,
        aButton,
        buttonElement,
      } = this;
      const successDiv = divElement({ className: `success` });
      const infoDiv = divElement({ className: `info` });
      const bEle = bElement({
        value: formatDateMoment({ currentDate: ___greenCardExpire }),
      });
      const bEleSoonest = bElement({
        value: formatDateMoment({ currentDate }),
      });
      const h4EleSoonest = h4Element({
        value: `The soonest you can file for removal of conditions is: `,
      })
        .addClass(`output`)
        .append(bEleSoonest);
      const aBtn = aButton({
        className: `button orange`,
        url: `https://rapidvisa.com/start-free-roc/`,
        title: `Start my Removal of Condition`,
      });
      const buttonReset = buttonElement({
        id: `rv-reset`,
        className: `rv-reset-btn`,
        value: `Reset`,
      });
      infoDiv.append(`2 Year green card expiry date: `).append(bEle);
      successDiv
        .append(infoDiv)
        .append(h4EleSoonest)
        .append(buttonReset)
        .append(aBtn);
      __mainDiv
        .html(``)
        .append(successDiv)
        .delay(500)
        .promise()
        .done(function () {
          $(this)
            .children()
            .children(`.rv-reset-btn`)
            .click(() => {
              progressBar({
                displayDiv: __mainDiv,
                completeFunc: () => {
                  ___greenCardExpire = ``;
                  ROC.main();
                },
              });
            });
        });
    };
  }
  class RemovalOfCondition extends Layout {
    constructor() {
      super();
    }
    main = () => {
      this.dateDisplay();
      const { loadingBar, calculateROC, successfullDisplay } = this;
      __mainDiv
        .delay(500)
        .promise()
        .done(function () {
          $(this)
            .children()
            .children(`button`)
            .click(() => {
              loadingBar({
                displayDiv: __mainDiv,
                loadingGIF: __loadingGIF,
                doneFunc: () =>
                  successfullDisplay({
                    currentDate: calculateROC({ datePick: ___greenCardExpire }),
                  }),
              });
            });
        });
    };
  }
  const ROC = new RemovalOfCondition();
  $(document).ready(() => ROC.main());
})(jQuery);
