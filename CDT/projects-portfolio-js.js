//@ts-check

/**
 * Removes the popover, if it's there
 */
function removePopover() {
  $("#fundingPopover").remove();
}

/**
 * display popover
 * @param {HTMLElement} target
 */
function showMoreInfo(target) {
  const buttonElement = $(target);

  const table = $("#tablepress-86").DataTable();

  const rowData = table.row(Number(buttonElement.data("row-id"))).data();

  const content = `
  <dt>Project Name</dt><dd>${rowData["Project Name"]}</dd>
  <dt>Description</dt><dd>${rowData.Description}</dd>
  `;

  removePopover();
  buttonElement.parent().append(
    $("<div>")
      // don't close when user clicks on popover content
      .on("click", function (e) {
        e.stopPropagation();
      })
      .attr("id", "fundingPopover")
      .append(
        content,
        $("<button>")
          .addClass("btn btn-secondary wp-block-button__link")
          .text("Close")
          .on("click", removePopover)
      )
  );
}

window.addEventListener("keydown", function (e) {
  if (e.key === "Escape") removePopover();
});

// close popover when clicking anywhere
window.addEventListener("click", removePopover);

/**
 * Put this in the "Custom Commands" field in the table settings
 * @example
 * ...TablePressCustomCommands()
 */
// eslint-disable-next-line no-unused-vars
function TablePressCustomCommands() {
  return /** @type {import("datatables.net").Config} */ ({
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
        data: "Project Name",
        createdCell: function (td, cellData, rowData, row) {
          $(td).append(
            $("<p>")
              .addClass("MoreInfoButton")
              .attr("tabindex", "0")
              .data("row-id", row)
              .text("More details")
              .on("click", function (e) {
                showMoreInfo(/** @type {HTMLElement} */ (e.target));
                e.preventDefault();
                e.stopPropagation(); // stop click propogation
              })
              .on("keydown", function (e) {
                if (e.key === "Enter" || e.key === " ") {
                  showMoreInfo(/** @type {HTMLElement} */ (e.target));
                  e.preventDefault();
                  e.stopPropagation(); // stop click propogation
                }
              })
          );
        }
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
  });
}
