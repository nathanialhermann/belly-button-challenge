// Pull data, place URL in constant variable

const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";


// Fetch JSON data and console log it
d3.json(url).then(function(data) {
  console.log(data);

});


//Create initial function with dropdown names

function init() {
  let dropDown = d3.select("#selDataset");
  d3.json(url).then((data) => {
    let names = data.names;
    names.forEach((id) => {
    console.log(id);
    dropDown.append("option").text(id).property("value",id);
    });

    let firstSample= names[0];
    console.log(firstSample);

    // Build plots for first sample
    meta(firstSample);
    barChart(firstSample);
    bubbleChart(firstSample);
  })
  

};


//Build bar chart function
function barChart(samples) {
    d3.json(url).then(function(data){
        let samps= Object.values(data.samples);   
            console.log(samps);
        let sample_id= samps.filter(s=>s.id === samples)[0];
        console.log(sample_id) ;  
        let otu_ids= Object.values(sample_id.otu_ids).map(id=>`OTU ${id}`);
        let sample_values= Object.values(sample_id.sample_values);
        let otu_labels= Object.values(sample_id.otu_labels); 
        let bar = [{
            x: sample_values.slice(0,10).reverse(),
            y: otu_ids.slice(0,10).reverse(),
            type: "bar",
            orientation:"h",
            text: otu_labels.slice(0,10).reverse(),
            color: otu_ids,
          }];
        
          let layout = {
            width: 800,
            title: "Top 10 OTUs",
            margin: {
              t: 30, l: 150, r: 10
            }
            
          };
        
          Plotly.newPlot("bar", bar, layout);
    })

};



//Build bubble chart function
function bubbleChart(samples) {
    d3.json(url).then(function(data){
        let samps= Object.values(data.samples);   
            console.log(samps);
        let sample_id= samps.filter(s=>s.id === samples)[0];
        console.log(sample_id) ;  
        let otu_ids= Object.values(sample_id.otu_ids).map(id=>id);
        let sample_values= Object.values(sample_id.sample_values);
        let otu_labels= Object.values(sample_id.otu_labels); 
        let bubble = [{
            x: otu_ids,
            y: sample_values,
            mode: `markers`,
            text: otu_labels,
            marker: {
              color: otu_ids,
              colorscale: "Blues",
              size: sample_values,
              opacity: 0.5
            }
          }];
        
          let layout = {
            //height: 800,
            //width: 800,
            title: "Sample Value by ID",
            xaxis: {
              showgrid: false,
              zeroline: false
            },
            margin: {
              t: 25, l:50
            },
            yaxis: {
              showline: false
            }
          };
        
          Plotly.newPlot("bubble", bubble, layout);
    })

};


//Create function that looks at metadata
function meta(demo_data) {
  d3.json(url).then((data) => {
    const metadata = data.metadata;
    const data_array = metadata.filter((samp) => samp.id == demo_data);
    const result = data_array[0]; 
    const table = d3.select("#sample-metadata").html("");
    for (const [key,value] of Object.entries(result)) {
      table.append("h5").text(`${key}:${value}`);
    };
  });
};

//Function that updates the data for each selection
function optionChanged(value) {

  console.log(value);

  selection = value;
  meta(selection);
  barChart(selection);
  bubbleChart(selection);

};

init();