function drawPCA(data, selector){
    let colors = ["#1b70fc", "#faff16", "#d50527", "#158940", "#f898fd", "#24c9d7", "#cb9b64", "#866888", "#22e67a", "#e509ae", "#9dabfa", "#437e8a", "#b21bff", "#ff7b91", "#94aa05", "#ac5906", "#82a68d", "#fe6616", "#7a7352", "#f9bc0f", "#b65d66", "#07a2e6", "#c091ae", "#8a91a7", "#88fc07", "#ea42fe", "#9e8010", "#10b437", "#c281fe", "#f92b75", "#07c99d", "#a946aa", "#bfd544", "#16977e", "#ff6ac8", "#a88178", "#5776a9", "#678007", "#fa9316", "#85c070"]
    let ids = _.uniq(_.map(data, d=>d.PersonId));

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


    let colorScale = d3.scaleOrdinal()
        .domain(ids)
        .range(colors);

    let tip = d3.tip()
        .attr("class", "d3-tip")
        .html(d=>"ImageId: " + d.ImageId + "<br>" +
        "PC1 value: " + d.PC1 + "<br>" +
        "PC2 value: " + d.PC2);

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
            .style("fill", d=>colorScale(d.PersonId))
            .on("mouseover", tip.show)
            .on("mouseout", tip.hide);







}