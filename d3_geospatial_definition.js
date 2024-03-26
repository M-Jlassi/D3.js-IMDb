var w = 1500
var h = 750
var centered // verify if the map is already centered on the selected country

var svg = d3.select("body")
            .append("svg")
            .attr("width", w)
            .attr("height", h)

var projection = d3.geoMercator()
                    .scale(200)
                    .translate([w / 2, (h / 2) + 100]) //centers

var path = d3.geoPath().projection(projection)

d3.json("map.json", function(error, map) {
  if(error) return console.error(error)

  var countries = svg.selectAll("path")
    .data(map.features)
    .enter().append("path")
    .attr("d", path)
    .attr("region", function(d) {return d.properties.FIPS_10_})
    .attr("stroke", "black")
    .attr("stroke-width", "0.5px")

    // Importing IMDB data

    d3.json("regions_count.json", function(error, regions) {
      if(error) return console.error(error)

      for(i = 0; i < map.features.length; i++) {
        for(j = 0; j < regions.length; j++) {
          if(map.features[i].properties.FIPS_10_ == regions[j].region) {
            map.features[i].properties.count = regions[j].count
          }
        }
      }

      // Country names (hidden, displayed when clicked on)
      var info = svg.selectAll("g")
                  .data(map.features)
                  .enter().append("g")
                  .attr("id", function(d) {return d.properties.FIPS_10_})

      info.append("text")
                  .text(function(d) {return d.properties.ADMIN})
                  .attr("text-anchor", "middle")
                  .attr("x", w/2)
                  .attr("y", h/2 - 220)
                  .attr("fill", "blue")
                  .attr("font-size", "20px")
                  .attr("fill-opacity", "0")
                  .attr("id", function(d) {
                    return "name " + d.properties.FIPS_10_
                  })

      info.append("text")
        .text(function(d) {return d.properties.count === undefined ? "No title found." : d.properties.count.toLocaleString() + " titles"})
        .attr("text-anchor", "middle")
        .attr("x", w/2)
        .attr("y", h/2 - 180)
        .attr("fill", "blue")
        .attr("font-size", "20px")
        .attr("fill-opacity", "0")
        .attr("id", function(d) {
          return "count " + d.properties.FIPS_10_
        })

      var colorScale = d3.scaleSqrt()
                        .domain([0, d3.max(regions, function(d) {
                          return d.count
                        })])
                        .range(["#ffffff", "#8b0000"])

      countries.attr("fill", function(d) {
        if('count' in d.properties) {
          return colorScale(d.properties.count)
        }
        else return 'grey'
      })

      countries.on("mouseover", handleMouseOver)
        .on("mouseout", handleMouseOut)

      function handleMouseOver() {
        d3.select(this).attr("stroke", "blue")
          .attr("stroke-width", "1.5px")
      }

      function handleMouseOut() {
        d3.select(this).attr("stroke", "black")
          .attr("stroke-width", "0.5px")
      }

        countries.on("click", clicked)

        function clicked(d) {
          svg.selectAll("g").selectAll("text")
            .attr("fill-opacity", "0")
          var x, y, k, op // coordinates, scale, and opacity
          // If the country is now selected and was not previously selected
          if(d && d !== centered) {
            var centroid = path.centroid(d)
            x = centroid[0]
            y = centroid[1]
            k = 4
            op = 1
            centered = d
          }else { // If the country was already selected
            x = w / 2
            y = h / 2
            k = 1
            op = 0
            centered = null
          }

          countries.transition()
            .duration(1000)
            .attr("transform",
            "translate(" + w / 2 + "," + h / 2 + ") scale(" +
            k + ") translate(" + (-x) + "," + (-y) + ")")

            svg.select("#" + d.properties.FIPS_10_).selectAll("text")
              .attr("fill-opacity", op)

        }
    })

})

var newSvg = d3.select("body")
              .append("svg")
              .attr("width", "100")
              .attr("height", "100")

svg.append("rect")
    .attr("x", "10")
    .attr("y", "10")
    .attr("width", "35")
    .attr("height", "25")
    .attr("rx", "15")
    .attr("ry", "0")
    .attr("fill", "grey")
    .attr("stroke", "black")

svg.append("text")
    .text("No data")
    .attr("x", "50")
    .attr("y", "30")

    svg.append("text")
        .text("Click on countries!")
        .attr("x", "0")
        .attr("y", "60")
