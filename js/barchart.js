



function drawBarchart(data, selector){

    // let grouped = _.values(nest(data, ['PersonId', "ImageId"]));
    let objectNames = _.uniq(_.flatten(_.map(data, d=>_.map(d.objects, v=>v.label))));
    let barPadding = 120;
    // let userData = _.filter(data.inner, d=>d.node === user)[0];
    // // Get unique object names
    // let objects = userData.relatedNodes.filter(d=>d !== "info" && d !== user);
    //
    // // Get unique image ids
    // let imageIds =_.uniq( _.flatten(_.map(userData, d=>_.map(d, v=>v.ImageId)))).filter(d=>d !== undefined );
    //
    // let groupData = _.map(Object.entries(userData), d=>{
    //     return{"objects": d[0], "images": _.map(d[1], v=>{return { "imageId":v["ImageId"], "score": v["Score"]  }})}});
    // console.log(groupData);

    for(let i = 0;i < data.length;i++){
        drawSingleChart(data.filter(d=>d.imageId === `1_${i+1}`), selector)
    }
    for(let i = 0;i < data.length;i++){
        appendImages(data.filter(d=>d.imageId === `1_${i+1}`), selector)
    }



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

function drawSingleChart(data, selector){
    let newData = data[0].objects;
    let margin = {top: 20, right: 20, bottom: 30, left: 30},
        width = 400 - margin.left - margin.right,
        height = 200 - margin.top - margin.bottom;
    let x = d3.scaleBand()
        .rangeRound([0, width], 0.1)
        .padding(0.4)
        .domain(_.map(newData, d=>d.label));

    // let x1 = d3.scaleBand()
    //         .padding(0.05)
    //         .domain(imageIds)
    //         .rangeRound([0, x0.bandwidth()])

    // let x1 = d3.scaleLinear()
    //     .range([0, width])
    //     .paddingInner(0.1)
    //     .domain([0, xImages.rangeBand() * rangeBands.length]);

    let y = d3.scaleLinear()
        .rangeRound([height, 0])
        .domain([0, d3.max(newData, d=>d.info.Score)])
        // .ticks(4);
    // let colors = d3.schemeSet3();

    let xAxis = d3.axisBottom(x);
    let yAxis = d3.axisLeft(y).ticks(4);



    // let x0  = d3.scaleBand().rangeRound([0, width], .5);
    // let x1  = d3.scaleBand();
    // let y   = d3.scaleLinear().rangeRound([height, 0]);
    //
    // let xAxis = d3.axisBottom().scale(x0)
    //     .tickFormat(d3.timeFormat("Week %V"))
    //     .tickValues(users);
    //
    // let yAxis = d3.axisLeft().scale(y);

    const color = d3.scaleOrdinal(d3.schemeSet3);

    let svg = d3.select(selector).append("div").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        // .append("text", d=>_.map(d.objects, v=>v.label))
        // .append("text")
        // .text(d=>d.label)
        // .attr("y", 0)
        // .attr("x", 9)
        // .attr("transform", "rotate(45)");


    svg.append("g")
        .attr("class", "y axis")
        // .style('opacity','0')
        .call(yAxis)
        // .append("text")
        // .attr("transform", "rotate(-90)")
        // .attr("y", 6)
        // .attr("dy", ".71em")
        // .style("text-anchor", "end")
        // .style('font-weight','bold')
        // .text(d=>d.imageId);

    // svg.select('.y').transition().duration(500).delay(1300).style('opacity','1');

    svg.selectAll(".bar")
        .data(newData)
        .enter().append("rect")
        // .attr("class", "bars")
        .attr("x", d=>x(d.label))
        .attr("y", d=>y(d.info.Score))
        .attr("width", x.bandwidth())
        .attr("height", d=>height - y(d.info.Score))
        .attr("fill", d=>color(d.info.Score));
    // .attr("transform",function(d) { return "translate(" + xObject(d) + ",0)"; });
}