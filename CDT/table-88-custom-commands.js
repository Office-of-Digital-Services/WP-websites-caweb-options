    search: {
    boundary: true
  },
  columns: [
    {
      data: "Department Name"
    },
    { data: "Agency Name"},
    {
      data: "Project Name"
    },
    {
      data: "Total Cost",
      render: (data, type) => {
        if (type === "display") {
          return data.replace(/.000000000000000/, "");
        }
        return data;
      }
    },
    {
      data: "Criticality Level",
      render: function (data, type) {
        if (type === "display") {
          return data
            .replace(/High/, "🔴 Red")
            .replace(/Low/, "🟢 Green")
            .replace(/Medium/, "🟡 Yellow");
        }
        return data;
      }
    },
    {
      data: "Delegation/Risk",
      render: function (data, type) {
        if (type === "display") {
          return data.replace(/Dept Delegation/, "<div class='mt-1 float-start height-20 width-20 m-r-sm' style='background-color: #666666''></div> Dept Delegation")
          .replace(/CDT Oversight - Medium Risk/, "<div class='mt-1 float-start height-20 width-20 m-r-sm' style='background-color: #1a3e62'></div> CDT Oversight - Medium Risk")
          .replace(/CDT Oversight - Low Risk/, "<div class='mt-1 float-start height-20 width-20 m-r-sm' style='background-color: #4590ca'></div> CDT Oversight - Low Risk")
          .replace(/CDT Oversight - High Risk/, "<div class='mt-1 float-start height-20 width-20 m-r-sm' style='background-color: #f2b23e'></div> CDT Oversight - High Risk");
        }
        return data;
      }
    }
  ]