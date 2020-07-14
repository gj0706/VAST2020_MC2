//
// Plotly.d3.json("data/data.json", function(err, rows){
//
//     function unpack(rows, key) {
//         return rows.map(function(row) { return row[key]; });
//     }
//
//     var data = [{
//         type: 'violin',
//         x: unpack(rows, 'PersonId'),
//         y: unpack(rows, 'Score'),
//         points: 'none',
//         box: {
//             visible: true
//         },
//         line: {
//             color: 'green',
//         },
//         meanline: {
//             visible: true
//         },
//         transforms: [{
//             type: 'groupby',
//             groups: unpack(rows, 'PersonId'),
//             styles: [
//                 {target: '1', value: {line: {color: 'blue'}}},
//                 {target: '2', value: {line: {color: 'orange'}}},
//                 {target: '3', value: {line: {color: 'green'}}},
//                 {target: '4', value: {line: {color: 'red'}}},
//                 {target: '5', value: {line: {color: 'red'}}},
//                 {target: '6', value: {line: {color: 'red'}}},
//                 {target: '7', value: {line: {color: 'red'}}},
//                 {target: '8', value: {line: {color: 'red'}}},
//                 {target: '9', value: {line: {color: 'red'}}},
//                 {target: '10', value: {line: {color: 'red'}}},
//                 {target: '11', value: {line: {color: 'red'}}},
//                 {target: '12', value: {line: {color: 'red'}}},
//                 {target: '13', value: {line: {color: 'red'}}},
//                 {target: '14', value: {line: {color: 'red'}}},
//                 {target: '15', value: {line: {color: 'red'}}},
//                 {target: '16', value: {line: {color: 'red'}}},
//                 {target: '17', value: {line: {color: 'red'}}},
//                 {target: '18', value: {line: {color: 'red'}}},
//                 {target: '19', value: {line: {color: 'red'}}},
//                 {target: '20', value: {line: {color: 'red'}}},
//                 {target: '21', value: {line: {color: 'red'}}},
//                 {target: '22', value: {line: {color: 'red'}}},
//                 {target: '23', value: {line: {color: 'red'}}},
//                 {target: '24', value: {line: {color: 'red'}}},
//                 {target: '25', value: {line: {color: 'red'}}},
//                 {target: '26', value: {line: {color: 'red'}}},
//                 {target: '27', value: {line: {color: 'red'}}},
//                 {target: '28', value: {line: {color: 'red'}}},
//                 {target: '29', value: {line: {color: 'red'}}},
//                 {target: '30', value: {line: {color: 'red'}}},
//                 {target: '31', value: {line: {color: 'red'}}},
//                 {target: '32', value: {line: {color: 'red'}}},
//                 {target: '33', value: {line: {color: 'red'}}},
//                 {target: '34', value: {line: {color: 'red'}}},
//                 {target: '35', value: {line: {color: 'red'}}},
//                 {target: '36', value: {line: {color: 'red'}}},
//                 {target: '37', value: {line: {color: 'red'}}},
//                 {target: '38', value: {line: {color: 'red'}}},
//                 {target: '39', value: {line: {color: 'red'}}},
//                 {target: '40', value: {line: {color: 'red'}}},
//
//             ]
//         }]
//     }]
//
//     var layout = {
//         title: "Multiple Traces Violin Plot",
//         yaxis: {
//             zeroline: false
//         }
//     }
//
//     Plotly.newPlot('violin', data, layout);
// });
//





function drawViolin(data, selector){

    // set the dimensions and margins of the graph
    let margin = {top: 10, right: 30, bottom: 30, left: 40},
        width = 560 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    let svg = d3.select(selector)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");


    let colors = ["#1b70fc", "#faff16", "#d50527", "#158940", "#f898fd", "#24c9d7", "#cb9b64", "#866888", "#22e67a", "#e509ae", "#9dabfa", "#437e8a", "#b21bff", "#ff7b91", "#94aa05", "#ac5906", "#82a68d", "#fe6616", "#7a7352", "#f9bc0f", "#b65d66", "#07a2e6", "#c091ae", "#8a91a7", "#88fc07", "#ea42fe", "#9e8010", "#10b437", "#c281fe", "#f92b75", "#07c99d", "#a946aa", "#bfd544", "#16977e", "#ff6ac8", "#a88178", "#5776a9", "#678007", "#fa9316", "#85c070"]

    let users = _.uniq(_.map(data, d=>d.PersonId));

    let colorScale = d3.scaleOrdinal()
        .domain(users)
        .range(colors);

    let tip = d3.tip()
        .attr("class", "d3-tip")
        .html(d=>"Score: " + d.map(function(g) { return g.Score;}) );

    // Build and Show the X scale. It is a band scale like for a boxplot: each group has an dedicated RANGE on the axis. This range has a length of x.bandwidth
    let x = d3.scaleBand()
        .range([ 0, width ])
        .domain(users)
        .padding(0.05)     // This is important: it is the space between 2 groups. 0 means no padding. 1 is the maximum.

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))


    // Build and Show the Y scale
    let y = d3.scaleLinear()
        .domain([0, d3.max(data, d=>d.Score)])
        .range([height, 0])
    svg.append("g").call( d3.axisLeft(y) )

    // Features of the histogram
    let histogram = d3.histogram()
        .domain(y.domain())
        .thresholds(y.ticks(20))    // Important: how many bins approx are going to be made? It is the 'resolution' of the violin plot
        .value(d => d)

    // Compute the binning for each group of the dataset
    let sumstat = d3.nest()  // nest function allows to group the calculation per level of a factor
        .key(function(d) { return d.PersonId;})
        .rollup(function(d) {   // For each key..
            input = d.map(function(g) { return g.Score;})    // Keep the variable called Sepal_Length
            bins = histogram(input)   // And compute the binning on it.
            return(bins)
        })
        .entries(data)

    // What is the biggest number of value in a bin? We need it cause this value will have a width of 100% of the bandwidth.
    let maxNum = 0
    for ( i in sumstat ){
        allBins = sumstat[i].value
        lengths = allBins.map(function(a){return a.length;})
        longuest = d3.max(lengths)
        if (longuest > maxNum) { maxNum = longuest }
    }

    // The maximum width of a violin must be x.bandwidth = the width dedicated to a group
    let xNum = d3.scaleLinear()
        .range([0, x.bandwidth()])
        .domain([-maxNum,maxNum])

    // Add the shape to this svg!
    svg
        .selectAll("myViolin")
        .data(sumstat)
        .enter()        // So now we are working group per group
        .append("g")
        .attr("transform", function(d){ return("translate(" + x(d.key) +" ,0)") } ) // Translation on the right to be at the group position
        .append("path")
        .datum(function(d){ return(d.value)})     // So now we are working bin per bin
        .style("stroke", "none")
        .style("fill","#69b3a2")
        .attr("d", d3.area()
            .x0(function(d){ return(xNum(-d.length)) } )
            .x1(function(d){ return(xNum(d.length)) } )
            .y(function(d){ return(y(d.x0)) } )
            .curve(d3.curveCatmullRom))   // This makes the line smoother to give the violin appearance. Try d3.curveStep to see the difference
        .on("mouseover", tip.show)
        .on("mouseout", tip.hide)

}