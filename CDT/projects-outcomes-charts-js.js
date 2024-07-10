// Get all rows from the table body
const rows = document.querySelectorAll("#tablepress-89 tbody tr");
// Filter rows where the outcome is "Successful"
const successfulRows = Array.from(rows).filter(row => {
  const outcomeCell = row.querySelector("td:nth-child(6)");
  return outcomeCell && outcomeCell.textContent.trim() === "Successful";
});
const totalProjects = rows.length;
const totalSuccessful = successfulRows.length;
const percentSuccessful = Math.floor((totalSuccessful / totalProjects) * 100);
const percentChallenged = 100 - percentSuccessful;

// BAR CHART START
const stateValues = [
  { categ: "Successful projects", percent1: percentSuccessful },
  { categ: "Challenged projects", percent1: percentChallenged },
  { categ: "Failed projects", percent1: 0 }
];

const industryValues = [
  { categ: "Successful projects", percent2: 31 },
  { categ: "Challenged projects", percent2: 50 },
  { categ: "Failed projects", percent2: 19 }
];
const barsvg = d3.select(".bar-chart");
const barmargin = 200;
const barwidth = barsvg.attr("width") - barmargin;
const barheight = barsvg.attr("height") - 100;

const xScale = d3.scaleBand().range([0, barwidth]).padding(0.4);
const yScale = d3.scaleLinear().range([barheight, 0]);

const internalMargin = 50;

const barg = barsvg
  .append("g")
  .attr(
    "transform",
    "translate(" + internalMargin + "," + internalMargin + ")"
  );

// Define colors for share values and profits
const stateColor = "#6d8aa1"; // Greenish color
const industryColor = "#dad4c5"; // Orangish color

const combinedData = stateValues.map(d => ({
  categ: d.categ,
  percent1: d.percent1,
  percent2: industryValues.find(p => p.categ === d.categ).percent2
}));
xScale.domain(combinedData.map(d => d.categ));
yScale.domain([0, d3.max(combinedData, d => Math.max(d.percent1, d.percent2))]);

barg
  .append("g")
  .attr("transform", "translate(0," + barheight + ")")
  .call(d3.axisBottom(xScale))
  .selectAll("text")
  .attr("dy", "1.2em")
  .style("font-size", "1.2rem");
// Customize the y-axis ticks
barg.append("g").call(
  d3
    .axisLeft(yScale)
    .ticks(2) // Set the desired number of ticks (e.g., 5)
    .tickFormat(d => d + "%") // Format the tick labels as percentages
);

// Create bars for share values
barg
  .selectAll(".bar-share")
  .data(combinedData)
  .enter()
  .append("rect")
  .attr("class", "bar-share")
  .attr("x", d => xScale(d.categ))
  .attr("y", d => yScale(d.percent1))
  .attr("width", xScale.bandwidth() / 2)
  .style("fill", stateColor)
  .attr("height", d => barheight - yScale(d.percent1));

// Create bars for profits
barg
  .selectAll(".bar-profit")
  .data(combinedData)
  .enter()
  .append("rect")
  .attr("class", "bar-profit")
  .attr("x", d => xScale(d.categ) + xScale.bandwidth() / 2)
  .attr("y", d => yScale(d.percent2))
  .attr("width", xScale.bandwidth() / 2)
  .style("fill", industryColor)
  .attr("height", d => barheight - yScale(d.percent2));

// Create text labels for share values
barg
  .selectAll(".bar-share-label")
  .data(combinedData)
  .enter()
  .append("text")
  .attr("class", "bar-share-label")
  .attr("x", d => xScale(d.categ) + xScale.bandwidth() / 4)
  .attr("y", d => yScale(d.percent1) - 10)
  .text(d => d.percent1 + "%")
  .style("text-anchor", "middle"); // Center-align the text

// Create text labels for profits
barg
  .selectAll(".bar-profit-label")
  .data(combinedData)
  .enter()
  .append("text")
  .attr("class", "bar-profit-label")
  .attr("x", d => xScale(d.categ) + (3 * xScale.bandwidth()) / 4)
  .attr("y", d => yScale(d.percent2) - 10)
  .text(d => d.percent2 + "%")
  .style("text-anchor", "middle"); // Center-align the text
