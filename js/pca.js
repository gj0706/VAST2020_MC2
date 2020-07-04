function drawPCA(data, selector){

// set the dimensions and margins of the graph
    let margin = {top: 10, right: 30, bottom: 30, left: 60},
        width = 460 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
    let svg = d3.select("#pca")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    let tip = d3.tip()
        .attr("class", "d3-tip")
        .html(d=>"ImageId: " + d.ImageId );

    svg.call(tip);

        // Add X axis
        let x = d3.scaleLinear()
            .domain(d3.extent(data, d=>d.PC1)).nice()
            .range([ 0, width ]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .append("text")
            .text("Principle component 1");

        // Add Y axis
        let y = d3.scaleLinear()
            .domain(d3.extent(data, d => d.PC2)).nice()
            .range([ height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y))


        svg.append("text")
            .attr("x", 10)
            .attr("y", 10)
            .text("PC1");
        svg.append("text")
            .attr("x", width)
            .attr("y", height-10)
            .attr("text-anchor", "end")
            .text("PC2")

        // Add dots
        svg.append('g')
            .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", function (d) { return x(d.PC1); } )
            .attr("cy", function (d) { return y(d.PC2); } )
            .attr("r", 3)
            .style("fill", "#69b3a2")
            .on("mouseover", tip.show)
            .on("mouseout", tip.hide);







}