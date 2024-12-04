//@ts-check

/**
 * Put this in the "Custom Commands" field in the table settings
 * @example
 * ...TablePressCustomCommands()
 */
// eslint-disable-next-line no-unused-vars
function TablePressCustomCommands() {
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
    const table = $('table[id^="tablepress-"]').DataTable();
    const rowData = table.row(Number(buttonElement.data("row-id"))).data();

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

  return /** @type {import("datatables.net").Config} */ ({
    columns: [
      { data: "Agency Name" },
      {
        data: "Department Name"
      },
      {
        data: "Project Name",
        createdCell: function (td, _cellData, _rowData, row) {
          $(td).append(
            $("<p>")
              .addClass("MoreInfoButton")
              .attr("tabindex", "0")
              .data("row-id", row)
              .text("More details")
              .on("click", triggerMoreDetails)
              .on("keydown", function (e) {
                if (e.key === "Enter" || e.key === " ") triggerMoreDetails(e);
              })
          );
        }
      },
      {
        data: "Total Cost",
        defaultContent: "N/A",
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
        defaultContent: "N/A",
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
    ],
    // trigger donut charts function after table press is done rendering
    initComplete: function () {
      renderDonutChartsWithDynamicNumbers();
    }
  });
}

/* Donut charts function */
const setDdValue = value => {
  const ddRisk = /** @type {HTMLSelectElement} */ (
    document.getElementById("ddRisk")
  );
  ddRisk.value = value;
  ddRisk.dispatchEvent(new Event("change"));
};

/**
 *
 */
function renderDonutChartsWithDynamicNumbers() {
  const tablePressData = $('table[id^="tablepress-"]')
    .DataTable()
    .rows()
    .data();
  const riskData = tablePressData.map(x => x["Criticality Level"]);

  const chartData = [
    {
      Risk: "High",
      Value: riskData.filter(x => x === "High").count(),
      color: "#f2b23e", // yellow
      hovercolor: "#C4840E"
    },
    {
      Risk: "Medium",
      Value: riskData.filter(x => x === "Medium").count(),
      color: "#1a3e62", // cdt blue
      hovercolor: "#17385b"
    },
    {
      Risk: "Low",
      Value: riskData.filter(x => x === "Low").count(),
      color: "#4590ca", // light blue
      hovercolor: "#3786C3"
    },
    {
      Risk: "Delegated",
      Value: riskData.filter(x => x === "Delegated").count(),
      color: "#666666", // gray
      hovercolor: "#595959"
    }
  ];

  const width = 370;
  const height = 370;
  const radius = Math.min(width, height) / 2;

  const svg = d3
    .select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`);

  //const colorScale = d3
  //  .scaleOrdinal()
  //  .domain(chartData.map(d => d.Risk))
  //  .range(d3.schemeCategory10);

  const pie = d3.pie().value(d => d.Value);

  const arc = d3
    .arc()
    .innerRadius(radius * 0.7) // Adjust inner radius for thinner slices
    .outerRadius(radius * 0.85);

  const arcs = svg
    .selectAll("arc")
    .data(pie(chartData))
    .enter()
    .append("g")
    .attr("class", "arc");
  // Make slices focusable

  arcs
    .append("path")
    .attr("d", arc)
    .attr("fill", d => d.data.color) // Use the specified color
    .attr("tabindex", "0")

    // update table when clicking on donut sections
    .on("click", (event, d) => setDdValue(d.data.Risk))

    .on("mouseover focus", function (event, d) {
      d3.select(this).attr("fill", d.data.hovercolor);
      // Show tooltip with percentage
      const percentage = ((d.endAngle - d.startAngle) / (2 * Math.PI)) * 100;
      const tooltipLine1 = `${d.data.Risk}`; // New line for percentage
      const tooltipLine2 = `${percentage.toFixed(2)}%`; // New line for percentage
      d3.select("#tooltip")
        .text(tooltipLine1)
        .style("visibility", "visible")
        .style("font-size", ".85em");
      d3.select("#percent")
        .text(tooltipLine2)
        .style("visibility", "visible")
        .style("font-size", "2em")
        .style("fill", d.data.hovercolor);
      d3.select("#totalValueText").style("visibility", "hidden");
      d3.select("#totalValue").style("visibility", "hidden");
    })

    .on("mouseout blur", function () {
      d3.select(this).attr("fill", d => d.data.color);
      // Hide tooltip
      d3.select("#tooltip").style("visibility", "hidden");
      d3.select("#percent").style("visibility", "hidden");
      d3.select("#totalValueText").style("visibility", "visible");
      d3.select("#totalValue").style("visibility", "visible");
    });

  // Calculate the total value
  const totalValue = chartData.reduce((sum, d) => sum + d.Value, 0);

  // Add text for the total projects value text inside of the donut
  svg
    .append("text")
    .attr("id", "totalValueText")
    .attr("text-anchor", "middle")
    .attr("dy", "-1.5em")
    .style("font-size", ".85em")
    .text(`Total IT Projects`);

  svg
    .append("text")
    .attr("id", "totalValue")
    .attr("text-anchor", "middle")
    .attr("dy", "0.5em") // Adjust vertical position for percentage
    .style("font-size", "2em") // Adjust font size for total value
    .text(`${totalValue}`);

  // Add labels outside of the donut
  const labelArc = d3
    .arc()
    .innerRadius(radius * 0.79) // Adjust inner radius for label position
    .outerRadius(radius * 1.09);

  // Labels next to the slices
  arcs
    .append("text")
    .attr("transform", d => `translate(${labelArc.centroid(d)})`)
    .attr("dy", "0.35em")
    .attr("text-anchor", "middle")
    .style("font-size", "1rem") // Adjust font size for labels
    .text(d => d.data.Value);

  // Add tooltips
  svg
    .append("text")
    .attr("id", "tooltip")
    .attr("text-anchor", "middle")
    .attr("dy", "-1.5em") // Adjust vertical position for tooltip
    .style("visibility", "hidden");

  svg
    .append("text")
    .attr("id", "percent")
    .attr("text-anchor", "middle")
    .attr("dy", "0.5em") // Adjust vertical position for percentage
    .style("visibility", "hidden");
}
