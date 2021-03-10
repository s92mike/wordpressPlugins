(function ($) {
  const __divID = `nat-calculator-2`;
  const __progressBar = `progress-bar`;
  const __truMarriage = `tru-marriage`;
  const __startOver = `startOver`;
  const __bar = `bar`;
  const __yes = `yes`;
  const __no = `no`;
  const __valid = `valid`;
  const __error = `error`;
  const __info = `info`;
  const __filler = `filler`;
  const __process = `process`;
  const __dateContainer = `datecontainer`;
  const __buttonContainer = `button-container`;
  const __buttonClass1 = `button`;
  const __buttonClass2 = `conditional`;
  const __messageDetailList = {
    callUsMessage: `(Call us at 800-872-1458 for help)`,
    eligibilityMessage: `you are not eligible to apply for citizenship`,
    valid: {
      message: `If your green card is no longer valid,`,
    },
  };
  const __processDataList = [
    {
      title: `When was your first green card issued?`,
      buttonLabel: [],
    },
    {
      title: `Is your current green card still valid?`,
      buttonLabel: [__yes, __no],
    },
    {
      title: `Did you obtain your green card through marriage to a US citizen?`,
      buttonLabel: [__yes, __no],
    },
    {
      title: `What is your current Green Card?`,
      buttonLabel: [
        `2 Years Green Card (Adjustment of Status)`,
        `10 Years Green Card (Removal of Conditions)`,
      ],
    },
  ];

  const mainDiv = $(`#` + __divID);
  let ___greenCardIssued = ``;
  let ___valid = null;
  let ___truMarriage = null;
  let ___currentGC = null;

  class ProgressBar {
    constructor() {
      this.complete = 100;
      this.mainDiv = $(`<div/>`);
    }
    start = () => {
      const barDiv = $(`<div/>`);
      const fillerDiv = $(`<div/>`);
      barDiv.addClass(__bar).append(fillerDiv.addClass(__filler));
      this.mainDiv
        .addClass(__progressBar)
        .append(barDiv)
        .delay(500)
        .promise()
        .done(this.tick);
    };
    tick = () => {
      const { complete } = this;
      $(
        `#` + __divID + ` .` + __progressBar + ` .` + __bar + ` .` + __filler
      ).animate(
        { width: complete + `%` },
        {
          duration: 1500,
          complete: () => {
            processSelector.displayProcess();
            processSelector.currentProcess++;
          },
        }
      );
    };
  }

  class ProcessSelector extends ProgressBar {
    constructor() {
      super();
      this.currentProcess = 0;
    }
    displayProcess = () => {
      switch (this.currentProcess) {
        case 2:
          this.commonMainDivSlide(__truMarriage);
          break;
        case 1:
          this.commonMainDivSlide(__valid);
          break;
        case 0:
          questionairSelector.greenCardIssue();
          this.commonMainDivProgressBarFirst(
            questionairSelector.mainDiv.slideUp(`fast`)
          );
          break;
        default:
          // this.start();
          // this.commonMainDivProgressBarFirst(this.mainDiv.fadeOut(`fast`));
          break;
      }
    };
    commonMainDivProgressBarFirst = (commonMainDiv = null) => {
      mainDiv.children().fadeOut(`slow`, () => {
        this.commonHeightScript(commonMainDiv, this.commonRemoveMainStyleSlide);
      });
    };
    commonMainDivDisplay = (commonMainDiv = null) => {
      mainDiv.children().hide(`fast`, () => {
        this.commonHeightScript(commonMainDiv, this.commonDisplayReset);
      });
    };
    commonMainDivSlide = function (id) {
      mainDiv.children().slideUp(`slow`, () => {
        const arg = { id, step: this.currentProcess };
        questionairSelector.twoButtonQuestion(arg);
        this.commonHeightScript(
          questionairSelector.mainDiv.slideUp(`fast`),
          this.commonRemoveMainStyleSlide,
          arg
        );
      });
    };
    commonDisplayReset = () => {
      ___valid = null;
      ___currentGC = null;
      ___greenCardIssued = ``;
      ___truMarriage = null;
      this.currentProcess = 0;
      $(`#` + __divID)
        .children()
        .fadeIn(`slow`, function () {
          mainDiv.removeAttr(`style`);
        });
      $(`#` + __divID + ` .` + __startOver).click(() => {
        this.start();
        mainDiv.html(``).append(this.mainDiv);
      });
    };
    commonRemoveMainStyleSlide = (arg = false) => {
      if (arg) {
        $(`#` + __divID + ` .` + arg.id).click(() => {
          questionairSelector.clickFunc({
            type: arg.id,
            value: $(this).data(`answer`),
          });
          if (___valid) {
            this.displayProcess();
            this.currentProcess++;
          } else {
            displaySelector.now(__valid);
            this.commonMainDivDisplay(displaySelector.mainDiv.fadeOut(`fast`));
          }
        });
      }
      $(`#` + __divID)
        .children()
        .slideDown(`slow`, function () {
          mainDiv.removeAttr(`style`);
        });
    };
    commonHeightScript = (
      commonMainDiv = null,
      doneFunc = () => {
        return;
      },
      arg = false
    ) => {
      mainDiv
        .css(`height`, mainDiv.height() + `px`)
        .html(``)
        .append(commonMainDiv)
        .delay(250)
        .promise()
        .done(doneFunc(arg));
    };
  }

  class ProcessStepsLayout {
    headerH4 = ({ title }) => {
      return $(`<h4/>`).html(title);
    };
    containerDiv = ({ classContainer, elementBox }) => {
      return $(`<div/>`).addClass(classContainer).append(elementBox);
    };
    greenButtonElement = ({ id, value }) => {
      return $(`<button/>`)
        .addClass(__buttonClass1)
        .addClass(__buttonClass2)
        .addClass(id)
        .html(value.charAt(0).toUpperCase() + value.slice(1))
        .attr(`data-id`, id)
        .attr(`data-answer`, value);
    };
    dateInputElement = () => {
      return $(`<input/>`)
        .attr(`id`, `ns-datepicker`)
        .attr(`type`, `text`)
        .addClass(`form-control`)
        .datetimepicker({ format: `YYYY-MM-DD` })
        .on(`dp.change`, function () {
          if ($(this).val().length > 0) {
            $(this).data("DateTimePicker").hide();
            ___greenCardIssued = $(this).val();
          }
        })
        .on(`dp.hide`, function () {
          if ($(this).val().length > 0) {
            processSelector.displayProcess();
          }
        });
    };
  }

  class QuestionaireBlock extends ProcessStepsLayout {
    constructor() {
      super();
      this.mainDiv = $(`<div/>`).addClass(__process);
    }
    greenCardIssue = () => {
      const h4Ele = this.headerH4({ title: __processDataList[0].title });
      const contentElement = this.dateInputElement();
      const dateContainerDiv = this.containerDiv({
        classContainer: __dateContainer,
        elementBox: contentElement,
      });
      this.mainDiv.html(``).append(h4Ele).append(dateContainerDiv);
    };
    twoButtonQuestion = ({ id, step }) => {
      const h4Ele = this.headerH4({ title: __processDataList[step].title });
      const ButtonElementYes = this.greenButtonElement({
        id,
        value: __processDataList[step].buttonLabel[0],
      });
      const ButtonElementNo = this.greenButtonElement({
        id,
        value: __processDataList[step].buttonLabel[1],
      });
      const questionaireContainerDiv = this.containerDiv({
        classContainer: __buttonContainer,
        elementBox: ButtonElementYes,
      });
      questionaireContainerDiv.append(ButtonElementNo);
      this.mainDiv.html(``).append(h4Ele).append(questionaireContainerDiv);
    };
    clickFunc({ type, value }) {
      const flagValue = value === __yes;
      switch (type) {
        case __valid:
          ___valid = flagValue;
          break;
        case __truMarriage:
          ___truMarriage = flagValue;
        default:
          break;
      }
    }
  }

  class DisplayMessages extends ProcessStepsLayout {
    constructor() {
      super();
      this.mainDiv = $(`<div/>`).addClass(`messages`);
    }
    now = (type) => {
      switch (type) {
        case __valid:
          const bElement = $(`<b/>`).append(__messageDetailList.callUsMessage);
          const container = $(`<div/>`).addClass(__error);
          const ButtonElement = this.greenButtonElement({
            id: __startOver,
            value: `Start Over`,
          });
          const btnContainer = $(`<div/>`)
            .addClass(`buttons`)
            .append(ButtonElement);
          container
            .append(
              __messageDetailList.valid.message +
                ` ` +
                __messageDetailList.eligibilityMessage +
                ` `
            )
            .append(bElement)
            .append(btnContainer);
          this.mainDiv.html(``).append(container);
          break;
        default:
          break;
      }
    };
  }

  const progressBar = new ProgressBar();
  const questionairSelector = new QuestionaireBlock();
  const processSelector = new ProcessSelector();
  const displaySelector = new DisplayMessages();

  $(document).ready(() => {
    progressBar.start();
    mainDiv.append(progressBar.mainDiv);
  });
})(jQuery);
