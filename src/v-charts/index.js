export default {
  install: function (Vue) {
    Vue.prototype.$helpers = {
      barChart: {
      /**
       * $helpers.barchart.update
       * bind data to a bar graph.
       * @param {string} d3 - reference to d3 object.
       * @param {string} ds - dataset for the graph.
       * @param {Object} options - options for bar graph.
       * @param {string} options.selector - selector name to place the graph.
       * @param {string} options.metric - value you are measuring.
       * @param {string} options.dim - value you will be categorizing the data by.
       * @param {string} options.width - width of the chart.
       * @param {string} options.height - height of the chart.
       */
        update: function(d3, ds, options) {
          var domainArr = [];
          var rangeArr = [];

          var svg = d3.select(options.selector)
          var g = svg.selectAll("rect")
          .data(ds);

          var maxVal = Math.max.apply(Math,ds.map(function(o){
            return o[options.metric];
          }));

          ds.forEach(function(t){domainArr.push(t[options.dim])})
          ds.forEach(function(t, i){rangeArr.push(options.width * i / ds.length)})

          var xScale = d3.scaleOrdinal()
              .domain(domainArr)
              .range(rangeArr);

          var yScale = d3.scaleLinear()
            .domain([0,maxVal])
            .range([options.height, 0]);

          var yAxis = d3.axisLeft()
              .scale(yScale);

          var xAxis = d3.axisBottom()
              .scale(xScale)

          svg.selectAll("g").remove();

          g.enter()
          .append("rect")
          .merge(g)
          .attr('class', 'bar')
          .attr("width", function(d, i){
            return (options.width / ds.length) - 1
          })
          .attr("height", function(d) {
            return options.height - yScale(d[options.metric])
          })
          .attr("x", function(d, i){
            return (i * (options.width / ds.length)) + 60
          })
          .attr("y", function(d) {
            return yScale(d[options.metric]);
          })

          svg.append("g")
            .attr("transform", "translate(50,0)")
            .call(yAxis);

          svg.append("g")
            .attr("transform", "translate(70,"+ (options.height + 5) + ")")
            .call(xAxis);

          g.exit().remove();
        }
      }
    }
  }
}
