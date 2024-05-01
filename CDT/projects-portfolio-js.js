/* eslint-disable jsdoc/require-jsdoc */
// Note: tablepress columns classnames start at 1, DataTable starts at 0.

// display popover
function showMoreInfo(buttonElement) {
  let table = $("#tablepress-86").DataTable();
  let row = buttonElement.parent();

  //checking the "row-" class
  let rowIndex =
    Number(
      $(buttonElement)
        .closest("tr")
        .attr("class")
        .match(/row-(\d+)/)[1]
    ) - 2;
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

// eslint-disable-next-line no-unused-vars
function TablePressCustomCommands() {
  //Place this in "Custom Commands"
  // https://cdt.ca.gov/wp-admin/admin.php?page=tablepress&action=edit&table_id=86
  return {
    search: {
      exact: true,
      smart: false
    },
    columns: [
      { data: "Agency Name" },
      {
        data: "Department Name"
      },
      {
        data: "Project Name"
      },
      {
        data: "Total Cost",
        defaultContent: "<em>N/A</em>",
        render: function (data, type) {
          if (type === "display") {
            if (!data) return null; //shows defaultContent

            return Number(data).toLocaleString(navigator.language || "en-US", {
              style: "currency",
              currency: "USD",
              minimumFractionDigits: 0
            });
          } else if (type === "sort") {
            if (!data) {
              return "-1"; //puts N/A before $0
            }
          }

          return data;
        }
      },
      {
        data: "Criticality Level",
        name: "Criticality Level",
        className: "column_criticality_level",
        render: function (data, type) {
          const values = {
            High: { sort: 3, color: "#f2b23e" },
            Medium: { sort: 2, color: "#1a3e62" },
            Low: { sort: 1, color: "#4590ca" },
            Delegated: { sort: 0, color: "#666666" }
          };
          if (type === "display") {
            return `<div class='mt-1 float-start height-20 width-20 m-r-sm' style='background-color: ${values[data].color}'></div> ${data}`;
          } else if (type === "sort") {
            const found = values[data];
            if (found) {
              return found.sort.toString();
            } else return "-1";
          }
          return data;
        }
      },
      {
        data: "Description",
        name: "Description",
        searchable: true,
        visible: false
      },
      {
        data: "Condition",
        className: "column_condition",
        defaultContent: "<em>N/A</em>",
        render: function (data, type) {
          if (type === "display") {
            if (!data) return null; //shows defaultContent

            return data
              .replace(/Red/, "🔴 Red")
              .replace(/Green/, "🟢 Green")
              .replace(/Yellow/, "🟡 Yellow");
          } else if (type === "sort") {
            switch (data) {
              case "Red":
                return "3";
              case "Yellow":
                return "2";
              case "Green":
                return "1";
              default:
                return "-1";
            }
          }
          return data;
        }
      }
    ]
  };
}
