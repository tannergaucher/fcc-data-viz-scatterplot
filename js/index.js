let dataset = []
let myRequest = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json'

stringToTime = (dataset) => {
  let time = dataset.Time.split(":")
  let minutes = Number(time[0])
  let seconds = Number(time[1] / 60)
  return minutes + seconds
} 

fetch(myRequest)
  .then(response => {
    if (response.status === 200) {
      return response.json();
    } else {
      throw new Error('oops...')
    }
  })
  .then(response => {
    response.forEach(obj => dataset.push(obj))
    console.table(dataset)
    plot()  
  })

const h = 500
const w = 700
const p = 0

//x axis: time d.Time
//y axis years d.Year

plot = () => {
  
  const svg = d3.select('body')
              .append('svg')
              .attr('id', 'svg-container')
              .attr('height', h)
              .attr('width', w)
              .style('padding', '35px')
              
  const div = d3.select('body')
                  .append('div')
                  .attr('class', 'tooltip')
                  .style('opacity', 0)
                  
              
  const xScale = d3.scaleLinear()
                  .domain([1993, 2015])
                  .range([p, w - p])
                  
  const yScale = d3.scaleLinear()
                  .domain([
                    d3.min(dataset, (d) => stringToTime(d)),
                    d3.max(dataset, (d) => stringToTime(d))
                  ])
                  .range([p, h - p])
                  
  const xAxis = d3.axisBottom(xScale)
                    //ticks
                    
  const yAxis = d3.axisLeft(yScale)
                    //.ticks

  //make circles for data
  svg.selectAll('circle')
    .data(dataset)
    .enter()
    .append('circle')
    .attr('class', 'circle')
    .attr('fill', (d) => d.Doping ? 'tomato' : 'dodgerblue')
    .attr('cx', (d) => xScale(d.Year))
    .attr('cy', (d) => yScale(stringToTime(d)))
    .attr('r', (d) => 6)
    .on('mouseover', (d) => {
        div.transition()
              .duration(200)
              .style("opacity", .9)
        div.html(`
          ${d.Name}: ${d.Nationality}, ${d.Year}
          <br>
          ${d.Time}  
          <br>
          ${d.Doping}
          `
        )
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY) - 30 + "px")
    })
    .on('mouseout', (d) => {
      div.transition()
        .duration(500)
        .style("opacity", 0)
    })
    
    svg.append("g")
      .attr("class", "x-axis")
      .attr("transform", "translate(0, "+ h +")")
      .call(xAxis)
      
    svg.append("g")
      .attr("class", "y-axis")
      .call(yAxis)
      
      
}




                  
        