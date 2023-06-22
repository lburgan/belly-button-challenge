const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

//add names of subjects to drop down menu
let dropdownMenu = d3.select("#selDataset");
d3.json(url).then((data) => {
    
    // An array of id names
    let names = data.names;
    console.log(names);
    // Iterate through the names Array, adding each name to drop down menu
    names.forEach((name) => {  
        dropdownMenu.append("option").text(name).property("value", name);
    });
});

function demoInfo(sample){
    d3.json(url).then((data)=>{
       let meta = data.metadata;
       console.log("this function gets called")
       //get data specific to the sample number
       let metadata = meta.filter((person)=> person.id == sample);
       //get the data out of the list (learned this the hard way)
       let values = metadata[0];
       console.log("this is value data",values);
       //clear anything already in there 
       d3.select("#sample-metadata").html("");
        // add info to menu (this took a long time)
       Object.entries(values).forEach(([key,value]) => {
        d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`)
    });

    });
};

function hbar(sample){
    d3.json(url).then((data)=>{
        //grab data and filter to our sample number
        let overallData = data.samples;
        let ourSample = overallData.filter((person)=> person.id ==sample);
        //take it out of the list
        let ourSample2 = ourSample[0];
        //grab individual arrays that we need
        let sample_values = ourSample2.sample_values;
        let otu_ids = ourSample2.otu_ids;
        let otu_labels = ourSample2.otu_labels;
        //Slice to take only the first ten, reverse order so it is the most instead of the least
        let topTenY = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
        let topTenX = sample_values.slice(0,10).reverse();
        let labels = otu_labels.slice(0,10).reverse();
        //create trace for bar graph
        let barData = {
            x: topTenX,
            y: topTenY,
            type: "bar",
            orientation:"h",
            text: labels,
            //I love purple
            marker: {
                color: 'rgb(142,124,195)'
              }
          };
        //Add the title, and the best font
          let layout = {
            height: 600,
            width: 800,
            title: "Top 10 OTU",
            font:{
                family: 'Comic Sans MS, cursive'
              },
          };
        //plot
          Plotly.newPlot("bar", [barData], layout);
    });

};

function bubbles(sample){
    d3.json(url).then((data)=>{
        //Grab data we need and filter it
        let overallData = data.samples;
        let ourSample = overallData.filter((person)=> person.id ==sample);
        //take it out of the list
        let ourSample2 = ourSample[0];
        console.log("our sample 2 is actually being grabbed",ourSample2);
        //get arrays we need(same code as before, now we aren't slicing)
        let sample_values = ourSample2.sample_values;
        let otu_ids = ourSample2.otu_ids;
        let otu_labels = ourSample2.otu_labels;
        //trace for bubble chart 
        let bubbleTrace = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            //looked up cool js colorscales 
            marker:{
                color: otu_ids,
                colorscale: "Electric",
                size: sample_values
            }
        };
        console.log("This is bubble",bubbleTrace);
        //add a title and the best font
        let layout = {
            title: "Bacteria Per Sample",
            font:{
                family: 'Comic Sans MS, cursive'
              }
            
        };
        Plotly.newPlot("bubble",[bubbleTrace],layout);
    });
   
}

//Took me forever to figure out the "this" thing in index.html....lol 
function optionChanged(sampleNum){
demoInfo(sampleNum);
hbar(sampleNum);
bubbles(sampleNum);
};

//Finally, initialize the page with data, so there is something to see! 

function init(){
    d3.json(url).then((data)=>{
        let names = data.names;
        let startName = names[0];
        demoInfo(startName);
        hbar(startName);
        bubbles(startName);
       
    });

}
init();