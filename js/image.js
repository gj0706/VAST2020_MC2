function appendImages(data, selector){
    let imgId = data.imageId;
    debugger
    // d3.select("#images").select("svg").remove();
    let margin = {top: 0, right: 20, bottom: 20, left: 30},
        // width = 450 - margin.left - margin.right,
        // height = 200 - margin.top - margin.bottom;
        width = 450 - margin.left - margin.right,
        height = 200 - margin.top - margin.bottom;
        // width = 1000 - margin.left - margin.right,
        // height =1000 - margin.top - margin.bottom;

    let tip = d3.tip()
        .attr("class", "d3-tip")
        .html(d=>"Score: " + d.info.Score.toString() + "</br>" +
            "Label: " + d.label);

    let svg = d3.select(selector).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    let images = svg.selectAll("image")
        .data(imgId)
        .join("image")
        .attr("class", "images")
        .attr("id", imgId)
        .attr("width", width )
        .attr("height", height)
        // .attr("xlink:href", `MC2-Image-Data/Person${imgId.split("_")[0]}/Person${imgId}.jpg`)
        .attr("xlink:href", `data/images/Person${imgId}.jpg`)

        svg.append("text")
        .attr("x", margin.left/2)
        .attr("y", 10)
        .attr("text-anchor", "middle")
        .style("font-size", "10px")
        // .style("text-decoration", "underline")
        .text(d=>`ImageId: ${imgId}`);


    svg.selectAll("rect")
        // .append("g")
        // .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .data(data.objects)
        .join("rect")
        .attr("class", "bboxes")
        .attr("id", d=>d.imageId)
        .attr("width", d=>d.info.Width*0.1)
        .attr("height", d=>d.info.Height*0.1)
        .attr("x", d=>d.info.x * 0.1)
        .attr("y", d=>d.info.y * 0.1)
        .attr("fill", "none")
        .attr("stroke", "yellow")
        .on("mouseover", tip.show)
        .on("mouseout", tip.hide)
}


// function appendBBox(data){
//
// }
