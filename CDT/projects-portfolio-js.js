/* eslint-disable jsdoc/require-jsdoc */
// Note: tablepress columns classnames start at 1, DataTable starts at 0.

// display popover
function showMoreInfo(buttonElement) {
  let table = $("#tablepress-86").DataTable();
  let row = buttonElement.parent();

  //checking the "row-" class
  let rowIndex =
    $(buttonElement)
      .closest("tr")
      .attr("class")
      .match(/row-(\d+)/)[1] - 2;
  let rowData = table.row(rowIndex).data();

  let content = `
  <dt>Project Name</dt><dd>${rowData["Project Name"]}</dd>
  <dt>Description</dt><dd>${rowData.Description}</dd>
  `;

  content +=
    '<button class="btn btn-secondary wp-block-button__link">Close</button>';

  $("#fundingPopover").remove();
  row.append('<div id="fundingPopover"></div>');
  $("#fundingPopover").append(content); // insert new content

  jQuery("button.btn").click(function () {
    $("#fundingPopover").remove();
  });

  // don't close when user clicks on popover content
  jQuery("#fundingPopover").click(function (ev) {
    ev.stopPropagation();
  });
}

document.addEventListener("DOMContentLoaded", function (event) {
  // insert "More details" link
  $("#funding_container td.column-3")
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
window.onclick = function () {
  $("#fundingPopover").remove();
};

// close popover when user hits esc
document.body.onkeydown = function () {
  if (event.code === "Escape") {
    $("#fundingPopover").remove();
  }
};


