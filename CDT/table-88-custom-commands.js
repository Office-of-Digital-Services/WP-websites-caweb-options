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
      data: "Project Name",
      render: (data, type, row) => {
        if (type === "display") {
          // Customize the rendered content (e.g., create a button with the project title)
          return `${data}<br/><br/><button class="MoreInfoButton" data-row-id="${row.id}">More Details</button>`;
        }
        return data; // For other types (sorting, filtering, etc.), return the raw data
      }
    },
    {
      data: "Total Cost"
    },
    {
      data: "Criticality Level",
      name: "Criticality Level",
      className: "column_criticality_level",
      render: (data, type) => {
        if (type === "display") {
          return data
            .replace(
              /Delegated/,
              "<div class='mt-1 float-start height-20 width-20 m-r-sm' style='background-color: #666666''></div> Delegated"
            )
            .replace(
              /Medium/,
              "<div class='mt-1 float-start height-20 width-20 m-r-sm' style='background-color: #1a3e62'></div> Medium"
            )
            .replace(
              /Low/,
              "<div class='mt-1 float-start height-20 width-20 m-r-sm' style='background-color: #4590ca'></div> Low"
            )
            .replace(
              /High/,
              "<div class='mt-1 float-start height-20 width-20 m-r-sm' style='background-color: #f2b23e'></div> High"
            );
        }
        return data;
      }
    },
    {
      data: "Description",
      name: "Description",
      searchable: true,
      visible: true,
      className: "column_description"
    }
  ]

  //End
};
