    search: {
    boundary: true
  },
  columns: [
    {
      data: "Department Name"
    },
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
      data: "Criticality Level"
    },
    {
      data: "IPOR Health Rating",
      title: "Status",
      render: function (data, type) {
        if (type === "display") {
          return data
            .replace(/Red/, "🔴 Red")
            .replace(/Green/, "🟢 Green")
            .replace(/Yellow/, "🟡 Yellow");
        }
        return data;
      }
    },

    {
      data: "Delegation/Risk",
      render: function (data, type) {
        if (type === "display") {
          return data.replace(
            /Dept Delegation/,
            '<div class="height-30 width-30 m-r-sm" style="background-color: #666666;"></div> Dept Delegation'
          );
        }
        return data;
      }
    },
    { data: "Agency Acronym" },
    { data: "Description" },
    { data: "Agency Name" }
  ]