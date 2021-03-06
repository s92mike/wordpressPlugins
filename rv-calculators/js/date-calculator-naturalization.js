(function ($) {
  "use strict";
  $(document).ready(function () {
    /* Text Initialization */
    const nameVar = {
      no: "no",
      gcm: "gcm",
      yes: "yes",
      full: "full",
      type: "type",
      info: "info",
      error: "error",
      marriageYears: 3,
      personalYears: 5,
      filler: "filler",
      answer: "answer",
      gcDate: "gc_date",
      message: "message",
      loader: "loader",
      gcValid: "gc_valid",
      selected: "selected",
      successfull: "successfull",
      ncDatePicker: "nc-datepicker",
      mainWrapper: "nat-calc-wrapper",
      progressBar: "page-progress-bar",
      buttonCondition: ".button.conditional",
      steps: ["step-0", "step-1", "step-2", "step-3", "step-4"],
      commonYears: ["zero", "one", "two", "three", "four", "five"],
    };

    /* Functions */
    const displaySuccessfull = (schedDate) => {
      const summaryElement = $("<div/>")
        .html(
          "Green Card issued: <b>" +
            $("#" + nameVar.mainWrapper + " ." + nameVar.gcDate)
              .val()
              .toString() +
            "</b>"
        )
        .append(
          "<br/>Green Card obtained through marriage to a US citizen: <b>" +
            (yearsToCitizenship === 3 ? "Yes" : "No") +
            "</b>"
        )
        .append("<br/>Green Card validity: <b>Yes</b>");
      const spanDisclaimer = $("<span/>").html(
        "(90 days before your " +
          convertLess10(yearsToCitizenship) +
          " years permanent residency; Date format: YYYY/MM/DD)"
      );
      const aBtn = $("<a/>")
        .addClass("afc button orange")
        .attr("href", "https://rapidvisa.com/start-free/")
        .append("Apply for Citizenship");
      const bBtn = $("<button/>")
        .addClass("button")
        .html("Start Over")
        .click(resetButton.bind(this));
      const bEle = $("<b/>").append(schedDate);
      const h4Ele = $("<h3/>")
        .append("The soonest you can apply for citizenship is: ")
        .append(bEle);
      $("#" + nameVar.mainWrapper + " ." + nameVar.successfull)
        .html(h4Ele)
        .append(spanDisclaimer)
        .append("<br />")
        .append(bBtn)
        .append(aBtn)
        .prepend(summaryElement);
      $("#" + nameVar.mainWrapper + " ." + nameVar.steps[currentSteps]).fadeOut(
        "fast",
        () => {
          showProgressBar(nameVar.loader);
        }
      );
    };
    const displayMessage = () => {
      const ifStepsIs4 = currentSteps === 4;
      if (gcmDisabled || ifStepsIs4) {
        const currentMsg = ifStepsIs4
          ? `If you don't have 10 Years Green Card(Removal of Conditions)`
          : `If your green card is no longer valid`;
        const currentClass = ifStepsIs4 ? nameVar.info : nameVar.error;
        const bBtn = $("<button/>")
          .addClass("button")
          .html("Start Over")
          .click(resetButton.bind(this));
        $("#" + nameVar.mainWrapper + " ." + nameVar.message)
          .removeClass(nameVar.info)
          .removeClass(nameVar.error)
          .addClass(currentClass)
          .html(
            currentMsg +
              ", you are not eligible to apply for citizenship<b>(Call us at 800-872-1458 for help)</b>"
          )
          .append(bBtn)
          .show();
      } else {
        $("#" + nameVar.mainWrapper + " ." + nameVar.message)
          .html("")
          .hide();
      }
    };
    const disabledElement = () => {
      $("#" + nameVar.mainWrapper + " ." + nameVar.gcm).prop(
        "disabled",
        gcmDisabled
      );
    };
    const elementSwitch = (step) => {
      $("#" + nameVar.mainWrapper + " ." + nameVar.steps[step]).slideUp(
        "slow",
        () => {
          $("#" + nameVar.mainWrapper + " ." + nameVar.steps[step + 1]).fadeIn(
            "fast"
          );
        }
      );
    };
    const gcValidCond = ({ ifClass, currentClass, currentValue }) => {
      if (ifClass) {
        $(
          "#" +
            nameVar.mainWrapper +
            " ." +
            currentClass +
            nameVar.buttonCondition
        ).removeClass(nameVar.selected);
      }
      switch (currentClass) {
        case nameVar.gcm:
          yearsToCitizenship =
            currentValue.toLowerCase() === nameVar.yes
              ? nameVar.marriageYears
              : nameVar.personalYears;
          if (currentValue.toLowerCase() === nameVar.yes) {
            elementSwitch(3);
          } else {
            processNaturalizationDate();
          }
          break;
        case nameVar.gcValid:
          gcmDisabled =
            currentValue.toLowerCase() === nameVar.no ? true : false;
          disabledElement();
          clearDisplays([nameVar.successfull, nameVar.message]);
          if (currentValue.toLowerCase() === nameVar.yes) {
            elementSwitch(2);
          } else {
            $("#" + nameVar.mainWrapper + " ." + nameVar.steps[2]).slideUp(
              "slow",
              () => {
                displayMessage();
              }
            );
          }
          break;
        case nameVar.type:
          currentSteps = 4;
          if (currentValue.toLowerCase() === nameVar.yes) {
            $(
              "#" + nameVar.mainWrapper + " ." + nameVar.steps[currentSteps]
            ).slideUp("slow", () => {
              displayMessage();
            });
          } else {
            processNaturalizationDate();
          }
          break;
      }
    };
    const clearDisplays = (className) => {
      $.each(className, (ind, value) => {
        $("#" + nameVar.mainWrapper + " ." + value)
          .removeClass(nameVar.error)
          .data("index", ind)
          .html("")
          .hide();
      });
    };
    const numberLeadingZero = (num) => {
      return num < 10 ? "0" + num : num;
    };
    const convertLess10 = (num) => {
      return num < 10 ? nameVar.commonYears[num] : num;
    };
    const yearsOfResident = ({ tempYear, yearsToCitizenship }) => {
      return parseInt(tempYear) + parseInt(yearsToCitizenship);
    };
    const ninetyDaysEarlier = (currentDate) => {
      return currentDate - 90;
    };
    const displayDateFormat = (currentDate, separator) => {
      return (
        currentDate.getFullYear() +
        separator +
        numberLeadingZero(currentDate.getMonth() + 1) +
        separator +
        numberLeadingZero(currentDate.getDate())
      );
    };
    const processNaturalizationDate = () => {
      const currentDate = $("#" + nameVar.mainWrapper + " ." + nameVar.gcDate)
        .val()
        .toString()
        .split("-");
      const tempYear = currentDate[0];
      const tempMonth = currentDate[1] - 1; //monthly starts with zero
      const tempDay = currentDate[2];
      let convtDate = new Date(tempYear, tempMonth, tempDay);
      convtDate.setFullYear(yearsOfResident({ tempYear, yearsToCitizenship })); // 5 years for personal or 3 years for thru married to US citizen
      convtDate.setDate(ninetyDaysEarlier(convtDate.getDate())); //90 calendar days before for the complete your permanent resident
      displaySuccessfull(displayDateFormat(convtDate, "/"));
    };
    const showProgressBar = (showFlag = false) => {
      if (showFlag === nameVar.loader) {
        $("#" + nameVar.mainWrapper + " ." + nameVar.loader)
          .show()
          .delay(1500)
          .fadeOut("slow", () => {
            $("#" + nameVar.mainWrapper + " ." + nameVar.successfull).slideDown(
              "slow"
            );
          });
      } else {
        const withFiller = "." + nameVar.progressBar + " ." + nameVar.filler;
        $("#" + nameVar.mainWrapper + " ." + nameVar.progressBar).show();
        $(withFiller).delay(1500).addClass(nameVar.full);
        $("#" + nameVar.mainWrapper + " ." + nameVar.progressBar)
          .delay(2400)
          .fadeOut("slow", () => {
            $(withFiller).removeClass(nameVar.full);
            switch (showFlag) {
              case nameVar.successfull:
                $(
                  "#" + nameVar.mainWrapper + " ." + nameVar.successfull
                ).slideDown("slow");
                break;
              case nameVar.steps[1]:
                $(
                  "#" + nameVar.mainWrapper + " ." + nameVar.steps[1]
                ).slideDown("slow");
                break;
              default:
                break;
            }
          });
      }
    };
    const resetButton = () => {
      showProgressBar(nameVar.steps[1]);
      gcmDisabled = false;
      currentSteps = 3;
      disabledElement();
      yearsToCitizenship = nameVar.marriageYears;
      $("#" + nameVar.ncDatePicker)
        .data("DateTimePicker")
        .clear();
      $(nameVar.buttonCondition).removeClass(nameVar.selected);
      clearDisplays([nameVar.successfull, nameVar.message]);
    };

    /* Process Initialization*/
    let gcmDisabled = false;
    let yearsToCitizenship = nameVar.marriageYears;
    let currentSteps = 3;

    $("#" + nameVar.mainWrapper + " #" + nameVar.ncDatePicker)
      .datetimepicker({
        format: "YYYY-MM-DD",
      })
      .on("dp.change", function () {
        if ($(this).val().length > 0) {
          clearDisplays([nameVar.successfull, nameVar.message]);
          $(this).data("DateTimePicker").hide();
        }
      })
      .on("dp.hide", function () {
        if ($(this).val().length > 0) {
          setTimeout(2000, elementSwitch(1));
        }
      });

    $(nameVar.buttonCondition).click(function () {
      if (!$(this).hasClass(nameVar.selected)) {
        const currentClass = $(this).hasClass(nameVar.gcm)
          ? nameVar.gcm
          : $(this).hasClass(nameVar.gcValid)
          ? nameVar.gcValid
          : nameVar.type;
        const currentValue = $(this).data(nameVar.answer);
        gcValidCond({
          ifClass: $(this).hasClass(currentClass),
          currentClass,
          currentValue,
        });
        $(this).addClass(nameVar.selected);
      }
    });

    $("#" + nameVar.mainWrapper).ready(() => {
      showProgressBar();
      $("#" + nameVar.mainWrapper + " ." + nameVar.steps[1])
        .delay(2400)
        .slideDown("fast");
    });
  });
})(jQuery);
