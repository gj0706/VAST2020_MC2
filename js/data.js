// Load the data

const dataArray = [
    d3.json('data/new_data.json'),
    d3.json('data/pca.json'),
    d3.json('data/gt.json')];

Promise.all(dataArray).then(function(allData){
    let data = allData[0];
    console.log(data);
    let pcaData = allData[1];
    let gtData = allData[2];
    // console.log(data);
    console.log(gtData);

    // nest the data into hierarchical structure
    let innerNode = _.values(nest(gtData, ['PersonId', 'Label']));
    let outerNode = nest(gtData, ['Label', 'PersonId']);
    let grouped = _.values(nest(data, ['PersonId', "ImageId"]));
    console.log(grouped);
    let nested = _.map(grouped, (d, i) => {
        return {
            "user": `user-${i + 1}`, "images": _.map(_.keys(d), v => {
                return {
                    "imageId": v, "objects": _.map(d[v], o => {
                        return {"label": o.Label, "info": o}
                    })
                }
            })
        }
    })
    // console.log(nested);

    // Extract ground truth data
    // let gt = nest(gtData, ["External ID"]);
    // console.log(gtData);
    // _.map(gtData, d=>{return {"user": d["External ID"].split(".")[0].slice(6).split("_")[0], "imageId": d["External ID"].split(".")[0].slice(6), "objects": d.Label.objects}})
    // let groupedGt = _.map(gt, d=>{return {"user": d["External ID"].split(".")[0].slice(6).split("_")[0], "imageId": d["External ID"].split(".")[0].slice(6), "objects": _.map(d.Label.objects, v=>{return {"name": v.title, "bbox": v.bbox}})}})
    // let nestedGt = _.values(nest(groupedGt, ["user", "imageId"]));
    // console.log(groupedGt);
    // console.log(innerNode);
    // // document.write(JSON.stringify(nested, null, 4));
    // let arr = _.values(_.mapKeys(nested, function(value, key) { value.id = key; return value; }));
    // console.log(arr);
    // let n = _.values(innerNode.map((d, i)=>{return{"node": (i+1).toString(), "links": _.values(d)}}));
    // console.log(n);
    // let gt = _.map(gtData, d=>{return {"node": d["External ID"].split(".")[0].slice(6).split("_")[0], "imageId": d["External ID"].split(".")[0].slice(6), "objects": _.map(d.Label.objects, v=>{return {"bbox": v.bbox, "name": v.title}})}})
    // let nestedGt = nest(gt, ["node"]);

    let links = [];
    innerNode.forEach((d, i) => {

        d["node"] = `user-${(i + 1).toString()}`;
        d["links"] = _.keys(d).filter(d => d !== "node").map((v) => {
            return {"source": `user-${(i + 1).toString()}`, "target": v, "width": d[v].length}
        });
        d["info"] = Object.values(d)
        links.push(_.keys(d).filter(d => d !== "node").map((v) => {
            return {"source": `user-${(i + 1).toString()}`, "target": v, "width": d[v].length}
        }));
        d["relatedNodes"] = _.keys(d).filter(v => (v !== "node") && (v !== "links"));
        d["relatedNodes"].push(d["node"]);
        d["relatedLinks"] = d["relatedNodes"].map(v => d["node"] + "-" + v);
    });


    // Transform data for outer nodes
    outerNode = _.map(outerNode, (obj, key) => {
        obj.node = key;
        return obj
    });

    outerNode.forEach((d) => {
        // d["node"] = d["Label"],
        d["links"] = _.keys(d).filter(d => (d !== "node") && (d !== "links")).map((v, i) => {
            return {"source": d.node, "target": `user-${v}`, "width": d[v].length}
        });
        d["relatedNodes"] = _.keys(d).filter(d => (d !== "node") && (d !== "links")).map(v => `user-${v}`);
        d["relatedLinks"] = d["relatedNodes"].filter(d => (d !== "node") && (d !== "links")).map(v => `${v}-${d["node"]}`);
        d["info"] = Object.values(d)
    });

    // Data for concept map
    gtData = {"inner": innerNode, "outer": outerNode}

    // Initialize bar charts
    let user1 = nested.filter(d => d.user === "user-1")[0].images;
    drawBarchart(user1, "#barChart");
    for (let i = 0; i < user1.length; i++) {
        appendImages(user1[i], "#images");
    }

    // Create drop down menu for each user
    let users = [];
    for (let i = 1; i < 41; i++) {
        users.push(`user-${i}`);
    }

    // Function in response to dropdown event listener
    let dropDownChange = function () {
        let selected = d3.select(this).property("value");
        let newData = _.filter(nested, d => d.user === selected)[0].images;
        d3.select("#barChart").selectAll("svg").remove();

        drawBarchart(newData, "#barChart");
        d3.select("#images").selectAll("svg").remove();

        for (let i = 0; i < newData.length; i++) {
            appendImages(newData[i], "#images");
        }
    }

    // Create dropdown selections and add event listener
    let selection = d3.select("#selection")
        .insert("select", "svg")
        .on("change", dropDownChange)
    selection.selectAll("option")
        .data(users)
        .enter().append("option")
        .attr("value", d => d)
        .text(d => d);

    // Draw network of users and items
    drawConMap(gtData, "#conMap");
    // })

    drawPCA(pcaData, "#pca");

})

//
// d3.json("data/data.json").then(function(data){
//     // d3.json("data/gt.json").then(function(gt) {
//     d3.json("data/pca.json").then(function(pcaData){
//
//
//
//     })
// })
