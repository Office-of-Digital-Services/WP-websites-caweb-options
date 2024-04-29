/* eslint-disable jsdoc/require-jsdoc */
// Note: tablepress columns classnames start at 1, DataTable starts at 0.

// display popover
function showMoreInfo(buttonElement) {
  let table = $("#tablepress-88").DataTable();
  let row = buttonElement.parent();
  let rowIndex = $(buttonElement).closest("tr").index();
  let rowData = table.row(rowIndex).data();

  let content = `
  <dt>Agency</dt><dd>${rowData["Agency Name"]}</dd>
  <dt>Department</dt><dd>${rowData["Department Name"]}</dd>
  <dt>Project Name</dt><dd>${rowData["Project Name"]}</dd>
  <dt>Total Project Cost</dt><dd>${rowData["Total Cost"]}</dd>
  <dt>Criticality Level</dt><dd>${table.cell(rowIndex, "Criticality Level:name").render("display")}</dd>
 <dt>Description</dt><dd>${rowData.Description}</dd>
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
  jQuery("#fundingPopover").click(ev => {
    ev.stopPropagation();
  });
}

document.addEventListener("DOMContentLoaded", event => {
  // insert "More details" link
  $("#funding_container td.column-1")
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
