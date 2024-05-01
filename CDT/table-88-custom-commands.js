// eslint-disable-next-line no-unused-vars
let CustomCommands = {
  //Place this in "Custom Commands"
  // https://cdt.ca.gov/wp-admin/admin.php?page=tablepress&action=edit&table_id=86

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
        if (type === "display") {
          return data
            .replace(
              /(Delegated)/,
              "<div class='mt-1 float-start height-20 width-20 m-r-sm' style='background-color: #666666''></div> $1"
            )
            .replace(
              /(Medium)/,
              "<div class='mt-1 float-start height-20 width-20 m-r-sm' style='background-color: #1a3e62'></div> $1"
            )
            .replace(
              /(Low)/,
              "<div class='mt-1 float-start height-20 width-20 m-r-sm' style='background-color: #4590ca'></div> $1"
            )
            .replace(
              /(High)/,
              "<div class='mt-1 float-start height-20 width-20 m-r-sm' style='background-color: #f2b23e'></div> $1"
            );
        } else if (type === "sort") {
          switch (data) {
            case "High":
              return "3";
            case "Medium":
              return "2";
            case "Low":
              return "1";
            default:
              return "-1";
          }
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

  //End
};
