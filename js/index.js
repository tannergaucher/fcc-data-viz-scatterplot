let dataset = []
let myRequest = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json'

fetch(myRequest)
  .then(response => {
    if (response.status === 200) {
      return response.json();
    } else {
      throw new Error('oops...')
    }
  })
  .then(response => {
    response.forEach(data => dataset.push(data))
     console.table(dataset)

    plot()
  })
    
parseMinutesSeconds = (d) => {
  let parseTime = d3.timeParse('%M:%S')
  return new Date(parseTime(d))
}

const h = 500
const w = 800
const p = 0

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
                  
              
  const xScale = d3.scaleTime()
                  .domain([new Date('1993'), new Date('2016')])
                  .range([p, w - p])
                  
  const yScale = d3.scaleTime()
                  .domain([ 
                    parseMinutesSeconds('36:50'), 
                    parseMinutesSeconds('39:50')
                  ])
                  .range([p, h - p])   

  const xAxis = d3.axisBottom(xScale)
                    .tickFormat(d3.timeFormat('%Y'))

                                  
  const yAxis = d3.axisLeft(yScale)
                    .tickFormat(d3.timeFormat('%M:%S'))

  svg.selectAll('circle')
    .data(dataset)
    .enter()
    .append('circle')
    .attr('class', 'circle')
    .attr('fill', (d) => d.Doping ? '#CC3937' : '#068B9D')
    .attr('cx', (d) => {
      let parseTime = d3.timeParse('%Y')
      xScale(parseTime(d.Year))
      return xScale(parseTime(d.Year))
    })
    .attr('cy', (d) => {
      return yScale(parseMinutesSeconds(d.Time))  
    })
    .attr('r', (d) => 7)
    .style('stroke', 'black')
    .on('mouseover', (d) => {
        div.transition()
           .duration(200)
           .style('opacity', .9)
        div.html(`
          ${d.Name}: ${d.Nationality}, ${d.Year}
          <br>
          ${d.Time}  
          <br>
          ${d.Doping}
          `
        )
          .style('left', (d3.event.pageX) + 'px')
          .style('top', (d3.event.pageY) - 30 + 'px')
    })
    .on('mouseout', (d) => {
      div.transition()
        .duration(500)
        .style('opacity', 0)
    })
    
    svg.append('g')
      .attr('class', 'x-axis')
      .attr('transform', 'translate(0, '+ h +')')
      .call(xAxis)

    svg.append('g')
      .attr('class', 'y-axis')
      .call(yAxis)
      
}




                  
        