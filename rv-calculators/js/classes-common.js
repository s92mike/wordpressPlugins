export default class Elements {
  progressBar = ({ displayDiv, completeFunc }) => {
    const mainDiv = this.divElement({ className: `progress-bar` });
    const barDiv = this.divElement({ className: `bar` });
    const fillerDiv = this.divElement({ className: `filler` });
    mainDiv.append(barDiv.append(fillerDiv));
    displayDiv
      .html(``)
      .append(mainDiv)
      .delay(500)
      .promise()
      .done(function () {
        jQuery(this)
          .children(`.progress-bar`)
          .children(`.bar`)
          .children(`.filler`)
          .animate(
            { width: `100%` },
            {
              duration: 500,
              complete: () => {
                completeFunc();
              },
            }
          );
      });
  };
  aButton = ({ title = ``, url = ``, className = `button` }) => {
    return jQuery("<a/>").addClass(className).attr("href", url).append(title);
  };
  bElement = ({ value = `` }) => {
    return jQuery(`<b/>`).append(value);
  };
  h4Element = ({ value = `` }) => {
    return jQuery(`<h4/>`).append(value);
  };
  divElement = ({ className = `` }) => {
    return jQuery(`<div/>`).addClass(className);
  };
  buttonElement = ({ id = ``, className = ``, value = `` }) => {
    return jQuery(`<button>`)
      .addClass(`button`)
      .addClass(`conditional`)
      .addClass(className)
      .html(value)
      .attr(`id`, id);
  };
  dateElement = ({ id = ``, updateGlobal = null, displayDiv = null, className = `` }) => {
    return jQuery(`<input />`)
      .attr(`id`, id)
      .attr(`type`, `text`)
      .addClass(`form-control`)
      .addClass(className)
      .datetimepicker({ format: `YYYY-MM-DD` })
      .on(`dp.change`, function () {
        if (jQuery(this).val().length > 0) {
          updateGlobal({ type: `greenCard`, value: jQuery(this).val() });
        }
      })
      .on(`dp.hide`, function () {
        if (jQuery(this).val().length > 0) {
          displayDiv.children().children(`button`).removeAttr(`disabled`);
        }
      });
  };
  loaderImg = ({ src = `` }) => {
    return jQuery(`<img />`).attr(`src`, src);
  };
  loadingBar = ({ displayDiv = null, doneFunc = null, loadingGIF = `` }) => {
    const loader = this.loaderImg({ src: loadingGIF });
    displayDiv.html(``).append(loader).delay(1000).promise().done(doneFunc);
  }
}
