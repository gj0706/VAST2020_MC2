



function drawBarchart(data, selector){
    let margin = {top: 20, right: 20, bottom: 30, left: 30},
        width = 1800 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;
    let barPadding = 120;
    let userData = _.filter(data.inner, d=>d.node === user)[0];
    // Get unique object names
    let objects = userData.relatedNodes.filter(d=>d !== "info" && d !== user);
    // let images = userData[0].

    // Get unique image ids
    let imageIds =_.uniq( _.flatten(_.map(userData, d=>_.map(d, v=>v.ImageId)))).filter(d=>d !== undefined );
    // let newData = [];
    // _.each(userData, d=>{
    //     newData.push( _.map(objects, o=> {return {"key": o, "values": _.values(d) }}))
    //
    // })
    // console.log(newData);
    let groupData = _.map(Object.entries(userData), d=>{
        return{"objects": d[0], "images": _.map(d[1], v=>{return { "imageId":v["ImageId"], "score": v["Score"]  }})}});
    console.log(groupData);

    // Create a dummy scale to dynamically get the bar width
    // dummy array
    // let rangeBands = [];
    // // cummulative value to position our bars
    // let cummulative = 0;
    // userData.info.forEach(function(d, i) {
    //     if ([user, "info", "links", "node", "relatedLinks", "relatedNodes"].includes(d) === false ){
    //         d.cummulative = cummulative;
    //         cummulative += d.length;
    //         _.forEach(d, function(values) {
    //             rangeBands.push(i);
    //         })
    //     }
    // });
    // console.log(rangeBands);
// set scale to cover whole svg

    let x0 = d3.scaleBand()
        .rangeRound([0, width], 0.1)
        .domain(objects);

    let x1 = d3.scaleBand()
            .padding(0.05)
            .domain(imageIds)
            .rangeRound([0, x0.bandwidth()])

    // let x1 = d3.scaleLinear()
    //     .range([0, width])
    //     .paddingInner(0.1)
    //     .domain([0, xImages.rangeBand() * rangeBands.length]);

    let y = d3.scaleLinear()
        .rangeRound([height, 0])
        .domain([0, 1]);
    // let colors = d3.schemeSet3();

    let xAxis = d3.axisBottom(x0);
    let yAxis = d3.axisLeft(y);



    // let x0  = d3.scaleBand().rangeRound([0, width], .5);
    // let x1  = d3.scaleBand();
    // let y   = d3.scaleLinear().rangeRound([height, 0]);
    //
    // let xAxis = d3.axisBottom().scale(x0)
    //     .tickFormat(d3.timeFormat("Week %V"))
    //     .tickValues(users);
    //
    // let yAxis = d3.axisLeft().scale(y);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    let svg = d3.select(selector).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);


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






    // svg.select('.y').transition().duration(500).delay(1300).style('opacity','1');

    let slice = svg.selectAll(".slice")
        .data(userData)
        .enter().append("g")
        .attr("class", "g")
        .attr("transform",function(d) { return "translate(" + xObject(d) + ",0)"; });
    //
    // slice.selectAll("rect")
    //     .data(function(d) { return d.values; })
    //     .enter().append("rect")
    //     .attr("width", x1.bandwidth())
    //     .attr("x", function(d) { return x1(d.grpName); })
    //     .style("fill", function(d) { return color(d.grpName) })
    //     .attr("y", function(d) { return y(0); })
    //     .attr("height", function(d) { return height - y(0); })
    //     .on("mouseover", function(d) {
    //         d3.select(this).style("fill", d3.rgb(color(d.grpName)).darker(2));
    //     })
    //     .on("mouseout", function(d) {
    //         d3.select(this).style("fill", color(d.grpName));
    //     });
    //
    //
    // slice.selectAll("rect")
    //     .transition()
    //     .delay(function (d) {return Math.random()*1000;})
    //     .duration(1000)
    //     .attr("y", function(d) { return y(d.grpValue); })
    //     .attr("height", function(d) { return height - y(d.grpValue); });
    //
    // //Legend
    // var legend = svg.selectAll(".legend")
    //     .data(groupData[0].values.map(function(d) { return d.grpName; }).reverse())
    //     .enter().append("g")
    //     .attr("class", "legend")
    //     .attr("transform", function(d,i) { return "translate(0," + i * 20 + ")"; })
    //     .style("opacity","0");
    //
    // legend.append("rect")
    //     .attr("x", width - 18)
    //     .attr("width", 18)
    //     .attr("height", 18)
    //     .style("fill", function(d) { return color(d); });
    //
    // legend.append("text")
    //     .attr("x", width - 24)
    //     .attr("y", 9)
    //     .attr("dy", ".35em")
    //     .style("text-anchor", "end")
    //     .text(function(d) {return d; });
    //
    // legend.transition().duration(500).delay(function(d,i){ return 1300 + 100 * i; }).style("opacity","1");
}

