// eslint-disable-next-line no-unused-vars
let CustomCommands = {
  //Place this in "Custom Commands"
  // https://cdtcdev.sites.ca.gov/wp-admin/admin.php?page=tablepress&action=edit&table_id=88

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
      data: "Total Cost"
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
      render: function (data, type) {
        if (type === "display") {
          return data
            .replace(/Red/, "🔴 Red")
            .replace(/Green/, "🟢 Green")
            .replace(/Yellow/, "🟡 Yellow");
        }
        return data;
      }
    }
  ]

  //End
};
