/* eslint-disable jsdoc/require-jsdoc */
//@ts-check

/**
 * Put this in the "Custom Commands" field in the table settings
 * @example
 * ...TablePressCustomCommands()
 */
// eslint-disable-next-line no-unused-vars
function TablePressCustomCommands() {
  const tableid = "43"; //Make sure to set this to the right tablepress id
  /**
   * Removes the popover, if it's there
   */
  function removePopover() {
    $("#fundingPopover").remove();
  }

  /**
   * display popover
   * @param {JQuery<HTMLElement>} buttonElement
   */
  function showMoreInfo(buttonElement) {
    const rowData = $(`#tablepress-${tableid}`)
      .DataTable()
      .row(Number(buttonElement.data("row-id")))
      .data();

    // Creates the content string, <dt><dd>
    const content = ["Project Name", "Description"]
      .map(function (x) {
        return `<dt>${x}</dt><dd>${rowData[x]}</dd>`;
      })
      .join("");

    removePopover(); // close any existing popover

    buttonElement.parent().append(
      $("<div>")
        .on("click", function (e) {
          // don't close when user clicks on popover content
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
   *
   * @param {JQuery.TriggeredEvent} e
   */
  function triggerMoreDetails(e) {
    showMoreInfo($(e.target));
    e.preventDefault();
    e.stopPropagation(); // stop click propogation
  }

  const aServiceTypeRows = [
    "Get a computer or device",
    "Get tech help",
    "Find training or class",
    "Find a public computer"
  ];

  return /** @type {import("datatables.net").Config} */ ({
    search: {
      exact: true,
      smart: false
    },
    columns: [
      { data: "Organization" },
      {
        data: "Organization Description",
        visible: false
      },
      {
        data: "Website",
        visible: false
      },
      {
        data: "Service Area",
        visible: false
      },
      {
        data: "Organization Location",
        name: "County",
        title: "County"
      },
      {
        data: "Program Description(s)",
        visible: false
      },
      {
        //Using this column for the combined "Service Type" column
        data: `Service type: ${aServiceTypeRows[0]}`,
        title: "Service type",
        name: "ServiceType",
        defaultContent: "N/A",
        render: function (data, type, row) {
          const types = aServiceTypeRows.filter(
            x => row[`Service type: ${x}`] === "1"
          );

          return types.length ? types.join(", ") : null;
        }
      },
      {
        data: `Service type: ${aServiceTypeRows[1]}`,
        visible: false
      },
      {
        data: `Service type: ${aServiceTypeRows[2]}`,
        visible: false
      },
      {
        data: `Service type: ${aServiceTypeRows[3]}`,
        visible: false
      }
    ],
    initComplete: function (settings) {
      const counties = [
        ...new Set([
          ...Array.from(settings.aoData).map(
            x => x["_aData"]["Organization Location"]
          )
        ])
      ]
        .filter(x => x !== "")
        .sort();

      const ddCounty = /** @type {HTMLSelectElement} */ (
        document.getElementById("ddCounty")
      );
      counties.forEach(x => {
        const el = document.createElement("option");
        el.text = x;

        ddCounty.options.add(el);
      });

      function filterCounty() {
        $(`#tablepress-${tableid}`)
          .DataTable()
          .column("County:name")
          .search(this.value)
          .draw();
      }

      ddCounty.addEventListener("change", filterCounty);

      const ddServiceType = /** @type {HTMLSelectElement} */ (
        document.getElementById("ddServiceType")
      );
      aServiceTypeRows.forEach(x => {
        const el = document.createElement("option");
        el.text = x;

        ddServiceType.options.add(el);
      });

      function filterServiceTypes() {
        $(`#tablepress-${tableid}`)
          .DataTable()
          .column("ServiceType:name")
          .search(this.value)
          .draw();
      }

      ddServiceType.addEventListener("change", filterServiceTypes);
    }
  });
}
