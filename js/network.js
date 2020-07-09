d3.selection.prototype.moveToFront = function() {
    return this.each(function(){
        this.parentNode.appendChild(this);
    });
};


const labels = ['birdCall',
    'blueSunglasses',
    'canadaPencil',
    'cloudSign',
    'cupcakePaper',
    'eyeball',
    'hairClip',
    'lavenderDie',
    'metalKey',
    'noisemaker',
    'paperPlate',
    'partyFavor',
    'pinkCandle',
    'pumpkinNotes',
    'redWhistle',
    'sign',
    'silverStraw',
    'stickerBox',
    'trophy',
    'vancouverCards',
    'yellowBag',
    'yellowBalloon'];

const margin ={
    "top": 10,
    "bottom": 10,
    "left": 10,
    "right": 10};


const config = {
    "width": 1000 - margin.left - margin.right,
    "height": 1000 - margin.top - margin.bottom,
    "rect_width": 40,
    "rect_height": 14,
    "link_width": "5px",
    "diameter": 1200,
    // "colors": ["#a50026","#d73027","#f46d43","#fdae61","#fee090","#ffffbf","#e0f3f8","#abd9e9","#74add1","#4575b4","#313695"],
    "iLength": 40,
    "oLength": 43,
    "mid": 23
}



// Draw network using concept map

function drawConMap(data, selector){
    let svg = d3.select(selector).append("svg")
        .attr("width", config.diameter)
        .attr("height", config.diameter)
        .append("g")
        .attr("transform", "translate(" + config.diameter / 2 + "," + config.diameter / 2 + ")");

    // Set the y scale of rectangles
    let innerY = d3.scaleLinear()
        .domain([0, 40])
        .range([-40 * config.rect_height/ 2, 40 * config.rect_height / 2]);

    // Set the x scale of outer nodes
    let outerX = d3.scaleLinear()
        .domain([0, config.mid, config.mid, config.oLength])
        .range([15, 170, 200 ,355]);

    let outerY = d3.scaleLinear()
        .domain([0, config.oLength])
        .range([0, config.diameter / 2 - 120]);

    // Setup the positions of inner nodes
    data.inner = data.inner.map(function(d, i) {
        d.x = -(config.rect_width / 2);
        d.y = innerY(i);
        return d;
    });

    // Setup the positions of outer nodes
    data.outer = data.outer.map(function(d, i) {
        d.x = outerX(i);
        d.y = config.diameter/3;
        // d.y = outerY(i);

        return d;
    });
    console.log(data.inner);
    console.log(data.outer);

    // create  links data, including source nodes, target nodes and their positions
    let links = [];
    data.inner.forEach((d, i)=>{
        // links.push({"x": d.x, "y": d.y, "link": d.links })
        d.links.map(v=>{
            v.sourceX = d.x;
            v.sourceY = d.y;
            return d;
        })
        d.links.forEach(e=>{
            links.push(e);
        })
        // links.push(d.links);
        return links
    });
    // console.log(links);

    // Create the mapping of target nodes and their positions
    let targetPos = [];
    data.outer.forEach((d, i)=>{
        targetPos.push({"targetX": d.x, "targetY": d.y, "target": d.node })
        return targetPos
    });
    // console.log(targetPos);

    // Join target positions with links data by target nodes
    links.forEach(d=>{
        targetPos.forEach((v=>{
            if (d.target === v.target){
              d.targetX = v.targetX;
              d.targetY = v.targetY;
            }
        }))
    })

    // Define link layout
    let link = d3.linkHorizontal()
        .source(d=>[-d.targetY * Math.sin(projectX(d.targetX)), d.targetY * Math.cos(projectX(d.targetX))])
        .target(d=>[d.targetX > 180 ? d.sourceX : d.sourceX + config.rect_width, d.sourceY + config.rect_height / 2])

    // Append links between inner nodes and outer nodes
    let nodeLink = svg
        .append("g").attr("class", "links")
        .selectAll(".link")
        .data(links)
        .enter()
        .append("path")
        .attr("class", "link")
        .attr("id", d=>`${d.source}-${d.target}`)
        .attr("fill", "none")
        .attr("stroke", "#457b9d")
        .attr("stroke-width", d=>d.width/3)
        // .attr("d", d=>diagonal(d))
        .attr("d", link);

    // Append outer nodes (circles)
    let onode = svg.append('g').selectAll(".outer_node")
        .data(data.outer)
        .enter().append("g")
        .attr("class", "outer_node")
        .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })
        .on("mouseover", mouseover)
        .on("mouseout", mouseout);

    onode.append("circle")
        .attr('id', d=>d.node)
        .attr("r", 5);

    onode.append("text")
        .attr('id', d=>d.node + '-txt')
        .attr("dy", ".31em")
        .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
        .attr("transform", function(d) { return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)"; })
        .text(function(d) { return d.node; });


    // draw inner node
    let inode = svg.append('g').selectAll(".inner_node")
        .data(data.inner)
        .enter().append("g")
        .attr("class", "inner_node")
        .attr("transform", (d, i)=> "translate(" + d.x + "," + d.y + ")")
        .on("mouseover", mouseover)
        .on("mouseout", mouseout);

    inode.append('rect')
        .attr('width', config.rect_width)
        .attr('height', config.rect_height)
        // .attr("x", 20 )
        // .attr("y", (d, i)=> i * config.rect_height)
        .attr('id', d=>d.node)
        // .attr("stroke", "black")
        // .attr('fill',"#32d3eb");
    // Append user icons
    // inode.append("image")
    //     .attr("class", "userIcon")
    //     .attr("id", d=>d.node)
    //     .attr("width", config.rect_width)
    //     .attr("height", config.rect_height)
    //     // .attr("x", 20 )
    //     // .attr("y", (d, i)=> i * config.rect_height)
    //     .attr("xlink:href", "img/user.png")


    d3.select(self.frameElement).style("height", config.diameter - 150 + "px");

    inode.append("text")
        // .attr('id', d=>d.node)
        .attr('text-anchor', 'middle')
        .attr("transform", "translate(" + config.rect_width/2 + ", " + config.rect_height * .75 + ")")
        .text(d=>d.node);
}


let nest = function (seq, keys) {
    if (!keys.length)
        return seq;
    let first = keys[0];
    let rest = keys.slice(1);
    return _.mapValues(_.groupBy(seq, first), function (value) {
        return nest(value, rest)
    });
};


function projectX(x)
{
    return ((x - 90) / 180 * Math.PI) - (Math.PI/2);
}

function mouseover(d){
    // Bring to front
    d3.selectAll('.links .link').sort(function(a, b){ return d.relatedLinks.indexOf(a.node); });

    for (let i = 0; i < d.relatedNodes.length; i++)
    {
        d3.select(`#${d.relatedNodes[i]}`).classed('highlight', true);
            // .attr("width", 18).attr("height", 18);
        d3.select(`#${d.relatedNodes[i]}-txt`).attr("font-weight", 'bold');
    }

    for (let i = 0; i < d.relatedLinks.length; i++){
        d3.select(`#${d.relatedLinks[i]}`).moveToFront().attr('stroke', '#fc4903');
    }
}


function mouseout(d){
    for (let i = 0; i < d.relatedNodes.length; i++)
    {
        d3.select(`#${d.relatedNodes[i]}`).classed('highlight', false);
            // .attr("width", config.rect_width).attr("height", config.rect_height);
        d3.select(`#${d.relatedNodes[i]}-txt`).attr("font-weight", 'normal');
    }

    for (let i = 0; i < d.relatedLinks.length; i++){
        d3.select(`#${d.relatedLinks[i]}`).attr("stroke", "#457b9d" );
    }
}


// function showLargeImage(thumbnail) {
//     document.getElementById('wup').src = thumbnail.src
//     document.querySelector("#wup").style.visibility = "visible";
//     document.querySelector("button").style.visibility = "visible";
//     document.querySelector("#cover").style.visibility = "visible";
// }
