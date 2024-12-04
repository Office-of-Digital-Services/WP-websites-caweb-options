//@ts-check

/**
 * Put this in the "Custom Commands" field in the table settings
 * @example
 * ...TablePressCustomCommands()
 */
// eslint-disable-next-line no-unused-vars
function TablePressCustomCommands() {
  return /** @type {import("datatables.net").Config} */ ({
    columns: [
      { data: "Agency Name" },
      {
        data: "Department"
      },
      {
        data: "Project Name"
      },
      {
        data: "Cost",
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
        data: "Implementation Date",
        render: function (data, type) {
          if (type === "sort") {
            return Number(new Date(data));
          }
          return data;
        }
      },
      {
        data: "Outcome"
      }
    ]
  });
}
