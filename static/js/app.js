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
       //get the data out of the list
       let values = metadata[0];
       console.log("this is value data",values);
       //clear anything already in there 
       d3.select("#sample-metadata").html("");
        // add info to menu
       Object.entries(values).forEach(([key,value]) => {
        d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`)
    });

    });
};

function hbar(sample){
    d3.json(url).then((data)=>{
        let overallData = data.samples;
        let ourSample = overallData.filter((person)=> person.id ==sample);
        let ourSample2 = ourSample[0];
        let sample_values = ourSample2.sample_values;
        let otu_ids = ourSample2.otu_ids;
        let otu_labels = ourSample2.otu_labels;
        let topTenY = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
        let topTenX = sample_values.slice(0,10).reverse();
        let labels = otu_labels.slice(0,10).reverse();
        let barData = [{
            x: topTenX,
            y: topTenY,
            type: "bar",
            orientation:"h",
            text: labels
          }];
        
          let layout = {
            height: 600,
            width: 800,
            title: "Top 10 OTU"
          };
        
          Plotly.newPlot("bar", barData, layout);
    });

};

function bubbles(sample){
    d3.json(url).then((data)=>{
        let overallData = data.samples;
        let ourSample = overallData.filter((person)=> person.id ==sample);
        let ourSample2 = ourSample[0];
        console.log("our sample 2",ourSample2);
        let sample_values = ourSample2.sample_values;
        let otu_ids = ourSample2.otu_ids;
        let otu_labels = ourSample2.otu_labels;
        let bubbleTrace = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker:{
                color: otu_ids,
                size: sample_values
            }
        };
        console.log("This is bubble",bubbleTrace);
        let layout = {
            title: "Bacteria Per Sample",
            
        };
        Plotly.newPlot("bubble",[bubbleTrace],layout);
    });
   
}
function optionChanged(sampleNum){
demoInfo(sampleNum);
hbar(sampleNum);
bubbles(sampleNum);
};
