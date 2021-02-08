// @TODO: YOUR CODE HERE! 


var svgArea = d3.select("body").select("svg");
  
// Setup Chart Params
var width = parseInt(d3.select("#scatter").style("width"))
var height = (width - width /4)

    if (!svgArea.empty()) {
        svgArea.remove();
    }
      
 // Setup Chart/SVG Params
var svgHeight = height;
var svgWidth = width;
  
    // Define the chart's margins as an object
var chartMargin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50
    };
  
      // Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

// Import Data
d3.csv("assets/data/data.csv").then(function(Data) {

    // Parse Data/Cast as numbers
    // ==============================
    Data.forEach(function(data) {
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
    });

    // Create scale functions

    var xLinearScale = d3.scaleLinear()
        .domain([
                d3.min(Data, d => d.poverty)*.9,
                d3.max(Data, d => d.poverty)*1.1
              ])
        .range([0, chartWidth]);


      var yLinearScale = d3.scaleLinear()
      .domain([
              d3.min(Data, d => d.healthcare)*.9,
              d3.max(Data, d => d.healthcare)*1.1
            ])
      .range([chartHeight, 0]);

    // Create axis functions

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append Axes to the chart

    chartGroup.append("g")
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Create Circles

    var circlesGroup = chartGroup.append('g').selectAll("circle")
    .data(Data)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "12")
    .attr("opacity", ".8")
    .classed("stateCircle", true);


  // Add State Abbreviations Text to Circles

      chartGroup.append("g").selectAll("text")
        .data(Data)
        .enter()
        .append("text")
        .attr("x", d => xLinearScale(d.poverty))
        .attr("y", d => yLinearScale(d.healthcare))
        .classed("stateText", true)
        .text(d => d.abbr)
        .attr("font-size", 11)
        .style("font-weight", "bold");

    // Initialize tool tip

    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([90, -40])
        .html(function(d) {
          return (`${d.state}<br>Poverty: ${d.poverty}<br>No Healthcare: ${d.healthcare}`);
        });

    // Create tooltip in the chart

    chartGroup.call(toolTip);

    // Create event listeners to display and hide the tooltip

    // circlesGroup.on("mouseover", function(data) {
    //     toolTip.show(data, this)
    //     d3.select(this).style("fill", "blue").transition().duration(100);

    //   })
      
    //     // Event Listener for on-mouseout event
    //     .on("mouseout", function(data, index) {
    //       toolTip.hide(data)
    //       d3.select(this).style("fill","red").transition().duration(0);
    //     });

    // Create axes labels
    chartGroup
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -50)
        .attr("x", 0 - (chartHeight / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("No Healthcare (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`)
      .attr("class", "axisText")
      .attr("dy", "1em")
      .text("Poverty (%)");

  }).catch(function(error) {
    console.log(error);
  });
