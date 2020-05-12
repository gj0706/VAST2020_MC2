

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
    "rect_width": 14,
    "rect_height": 14,
    "link_width": "1px",
    "diameter": 960,
    // "colors": ["#a50026","#d73027","#f46d43","#fdae61","#fee090","#ffffbf","#e0f3f8","#abd9e9","#74add1","#4575b4","#313695"],
    "iLength": 40,
    "oLength": 22,
    "mid": 11
}





function showLargeImage(thumbnail) {
    document.getElementById('wup').src = thumbnail.src
    document.querySelector("#wup").style.visibility = "visible";
    document.querySelector("button").style.visibility = "visible";
    document.querySelector("#cover").style.visibility = "visible";
}
// Load the data

d3.json('data/data.json').then(function(data){
    console.log(data);
    // let grouped = _.mapValues(_.groupBy(data, 'PersonId'), list => list.map(d=>_.omit(d, 'PersonId')));
    // console.log(grouped);

    // uses lodash `mapValues` and `groupBy` to recursively nest the data



// nest data
    let innerNode = _.values(nest(data, ['PersonId', 'Label']));
    let outerNode = nest(data, ['Label', 'PersonId']);
    console.log(innerNode);
    // document.write(JSON.stringify(nested, null, 4));
    // let arr = _.values(_.mapKeys(nested, function(value, key) { value.id = key; return value; }));
    // console.log(arr);
    // let n = _.values(innerNode.map((d, i)=>{return{"node": (i+1).toString(), "links": _.values(d)}}));
    // console.log(n);

    let links = [];
    innerNode.forEach((d, i)=>{

        d["node"] = (i+1).toString(),
        d["links"] = Object.keys(d).filter(d=>d !== "node").map((v)=>{ return {"source": (i+1).toString(), "target": v, "width": d[v].length }}),
        d["info"] = Object.values(d)
        links.push(Object.keys(d).filter(d=>d !== "node").map((v)=>{ return {"source": (i+1).toString(), "target": v, "width": d[v].length }}));

    });


    // let l = _.values(innerNode.map((d, i)=>{return{"node": (i+1).toString(), "links": d}}));
    // Transform data for outer nodes
    outerNode = _.map(outerNode, (obj, key)=>{
        obj.node = key;
        return obj
    });


    // let final = _.map(_.map(_.values(innerNode.map((d, i)=>{return{"node": (i+1).toString(), "links": d}})), d=>d.links), d=>{return{"target": _.keys(d), "info": _.values(d)}})

    outerNode.forEach((d)=>{
        // d["node"] = d["Label"],
        d["links"] = Object.keys(d).filter(d=>d !== "node").map((v,i)=>{ return {"source": d.node, "target": v, "width": d[v].length}}),
        d["info"] = Object.values(d)
    });



    data = {"inner": innerNode, "outer": outerNode}


    let d = {};
    drawConMap( data, "#conMap")

});


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

    // let outerX = d3.scaleLinear()
    //     .domain([0, 22])
    //     .range([0,  Math.PI * 2]);

    // Set the y scale of outer nodes
    let outerY = d3.scaleLinear()
        .domain([0, config.oLength])
        .range([0, config.diameter / 2 - 120]);

    // let outerY = d3.scaleLinear()
    //     .domain([0, config.oLength])
    //     .range([0, config.diameter / 2 - 120]);

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
    console.log(links);

    // Create the mapping of target nodes and their positions
    let targetPos = [];
    data.outer.forEach((d, i)=>{
        targetPos.push({"targetX": d.x, "targetY": d.y, "target": d.node })
        return targetPos
    });
    console.log(targetPos);

    // Join target positions with links data by target nodes
    links.forEach(d=>{
        targetPos.forEach((v=>{
            if (d.target === v.target){
              d.targetX = v.targetX;
              d.targetY = v.targetY;
            }
        }))
    })
    console.log(links);


    // Define link layout
    let link = d3.linkHorizontal()
        .source(d=>[-d.targetY * Math.sin(projectX(d.targetX)), d.targetY * Math.cos(projectX(d.targetX))])
        .target(d=>[d.targetX > 180 ? d.sourceX : d.sourceX + config.rect_width, d.sourceY + config.rect_height / 2])

    // Append links to svg
    svg.selectAll(".links")
        .data(links)
        .enter()
        .append("path")
        .attr("class", "links")
        .attr("id", d=>d.source + "-" + d.target)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
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
        .attr('id', function(d) { return d.node })
        .attr("r", 5);

    onode.append("circle")
        .attr('r', 20)
        .attr('visibility', 'hidden');

    onode.append("text")
        .attr('id', function(d) { return d.node + '-txt'; })
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

    // inode.append('rect')
    //     .attr('width', config.rect_width)
    //     .attr('height', config.rect_height)
    //     .attr("x", 20 )
    //     .attr("y", (d, i)=> i * config.rect_height)
    //     .attr('id', function(d,i) { return "Person-" + (i+1).toString(); })
    //     .attr("stroke", "black")
    //     .attr('fill', function(d, i) { return config.colors[i]; });
    // Append user icons
    inode.append("image")
        .attr("class", "userIcon")
        .attr("id", d=>`user-${d.node}`)
        .attr("width", config.rect_width)
        .attr("height", config.rect_height)
        // .attr("x", 20 )
        // .attr("y", (d, i)=> i * config.rect_height)
        .attr("xlink:href", "img/user.png");


        // .attr("transform", d=>"translate(" +)
    // inode.append("text")
    //     .attr('id', function(d, i) { return 'Person-'+ (i+1).toString() + '-txt'; })
    //     .attr('text-anchor', 'middle')
    //     .attr("transform", "translate(" + config.rect_width/2 + ", " + config.rect_height * .75 + ")")
    //     .text(function(d, i) { return  (i+1).toString(); });








}


// function get_color(name)
// {   let c = Math.round(color(name));
//     if (isNaN(c))
//         return '#dddddd';	// fallback color
//
//     return colors[c];
// }

let nest = function (seq, keys) {
    if (!keys.length)
        return seq;
    let first = keys[0];
    let rest = keys.slice(1);
    return _.mapValues(_.groupBy(seq, first), function (value) {
        return nest(value, rest)
    });
};

// let diagonal = function link(d) {
//     return "M" + d.sourceY + "," + d.sourceX
//         + "C" + (d.sourceY + d.targetY) / 2 + "," + d.sourceX
//         + " " + (d.sourceY + d.targetY) / 2 + "," + d.targetX
//         + " " + d.targetY + "," + d.targetX;
// }



function projectX(x)
{
    return ((x - 90) / 180 * Math.PI) - (Math.PI/2);
}

function mouseover(){

}

function mouseout(){

}