/* eslint-disable jsdoc/require-jsdoc */
// Note: tablepress columns classnames start at 1, DataTable starts at 0.

// display popover
function showMoreInfo(buttonElement) {
  let row = buttonElement.parent();

  let content = `
  <dt>Department</dt><dd>${row.find(".column-1").html()}</dd>
  <dt>Project Name</dt><dd>${row.find(".column-2").html()}</dd>
  <dt>Total Project Cost</dt><dd>${row.find(".column-3").html()}</dd>
  <dt>Criticality Level</dt><dd>${row.find(".column-4").html()}</dd>
  <dt>Status</dt><dd>${row.find(".column-5").html()}</dd>
    <dt>Delegation/Risk</dt><dd>${row.find(".column-6").html()}</dd>
        <dt>Acronym</dt><dd>${row.find(".column-7").html()}</dd>
        <dt>Agency</dt><dd>${row.find(".column-9").html()}</dd>
        <dt>Description</dt><dd>${row.find(".column-8").html()}</dd>
  `;

  content +=
    '<button class="btn btn-secondary wp-block-button__link">Close</button>';

  $("#fundingPopover").remove();
  row.append('<div id="fundingPopover"></div>');
  $("#fundingPopover").append(content); // insert new content

  jQuery("button.btn").click(() => {
    $("#fundingPopover").remove();
  });

  // don't close when user clicks on popover content
  jQuery("#fundingPopover").click((ev) => {
    ev.stopPropagation();
  });
}

document.addEventListener("DOMContentLoaded", (event) => {
  // insert "More details" link
  $("#funding_container td.column-2")
    .append('<p class="MoreInfoButton" tabindex="0">More details</p>')
    .click(function (e) {
      showMoreInfo($(this));
      e.stopPropagation(); // stop click propogation
    })
    .keydown(function (e) {
      if (event.code === "Space" || event.code === "Enter") {
        showMoreInfo($(this));
        e.stopPropagation(); // stop click propogation
      }
    });
});

// close popover when clicking anywhere
window.onclick = () => {
  $("#fundingPopover").remove();
};

// close popover when user hits esc
document.body.onkeydown = function (e) {
  if (event.code === "Escape") {
    $("#fundingPopover").remove();
  }
};
