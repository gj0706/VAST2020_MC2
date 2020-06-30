// Function to draw bar charts for each image
function drawBarchart(data, selector){
    for(let i = 0;i < data.length;i++){
        drawSingleChart(data[i], selector)
    }
}


function drawSingleChart(data, selector){
    // let newData = data[0].objects;
    let newData = data.objects;

    let margin = {top: 20, right: 20, bottom: 30, left: 30},
        width = 450 - margin.left - margin.right,
        height = 200 - margin.top - margin.bottom;

    let tip = d3.tip()
        .attr("class", "d3-tip")
        .html(d=>"Score: " + d.info.Score.toString() + "</br>" +
                       "Label: " + d.label);

    let x = d3.scaleBand()
        .rangeRound([0, width], 0.1)
        .padding(0.4)
        .domain(_.map(newData, d=>d.label));

    let y = d3.scaleLinear()
        .rangeRound([height, 0])
        .domain([0, d3.max(newData, d=>d.info.Score)]);

    let xAxis = d3.axisBottom(x);
    let yAxis = d3.axisLeft(y).ticks(4);

    const color = d3.scaleOrdinal(d3.schemeSet3);

    let svg = d3.select(selector).append("div").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.call(tip);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text", d=>_.map(d.objects, v=>v.label))
        .attr("y", 0)
        .attr("x", 9)
        .attr("transform", "rotate(45)");

    svg.append("g")
        .attr("class", "y axis")
        // .style('opacity','0')
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .style('font-weight','bold')
        .text("Score");

    svg.selectAll(".bar")
        .data(newData)
        // .enter().append("rect")
        .join("rect")
        .attr("class", "bars")
        .attr("x", d=>x(d.label))
        .attr("y", d=>y(d.info.Score))
        .attr("width", x.bandwidth())
        .attr("height", d=>height - y(d.info.Score))
        .attr("fill", d=>color(d.info.Score))
        .on("mouseover", tip.show)
        .on("mouseout", tip.hide);
}


function appendImages(data, selector){
    let imgId = data.imageId;
    // d3.select("#images").select("svg").remove();
    let margin = {top: 0, right: 20, bottom: 20, left: 30},
        width = 450 - margin.left - margin.right,
        height = 200 - margin.top - margin.bottom;

    let svg = d3.select(selector).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    let images = svg.selectAll("image")
        .data(imgId)
        .join("image")
        .attr("class", "images")
        .attr("id", d=>d.imgId)
        .attr("width", width )
        .attr("height", height)
        .attr("xlink:href", `MC2-Image-Data/Person${imgId.split("_")[0]}/Person${imgId}.jpg`)

    svg.selectAll("rect")
        .append("g")
        .data(data.objects)
        .join("rect")
        .attr("class", "bboxes")
        .attr("id", d=>d.imageId)
        .attr("width", d=>d.info.Width/width)
        .attr("height", d=>d.info.Height/height)
        .attr("x", d=>d.info.x)
        .attr("y", d=>d.info.y)
        .attr("fill", "none")
        .attr("stroke", "yellow")
}


// function appendBBox(data){
//
// }
