import React, { useEffect, useCallback } from "react";
import axios from "axios";
import { Chart } from "chart.js";
import * as d3 from "d3";

function HomePage() {
  var dataSource = {
    datasets: [
      {
        data: [],
        backgroundColor: [
          "#ffcd56",
          "#ff6384",
          "#36a2eb",
          "#fd6b19",
          "#0000FF",
          "#008080",
          "#800000",
        ],
      },
    ],
    labels: [],
  };

  const renderPieChart = useCallback(() => {
    var ctx = document.getElementById("myChart").getContext("2d");
    new Chart(ctx, {
      type: "pie",
      data: dataSource,
    });
  }, [dataSource]);

  const renderDonutChart = useCallback(() => {
    var svg = d3.select("#ChartD3JS").append("svg").append("g");

    svg.append("g").attr("class", "slices");
    svg.append("g").attr("class", "labels");
    svg.append("g").attr("class", "lines");

    var width = 960,
      height = 450,
      radius = Math.min(width, height) / 2;

    var pie = d3.layout
      .pie()
      .sort(null)
      .value(function (d) {
        return d.value;
      });

    var arc = d3.svg
      .arc()
      .outerRadius(radius * 0.8)
      .innerRadius(radius * 0.4);

    var outerArc = d3.svg
      .arc()
      .innerRadius(radius * 0.9)
      .outerRadius(radius * 0.9);

    svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var key = function (d) {
      return d.data.label;
    };
    var color = d3.scale
      .ordinal()
      .domain(dataSource.labels)
      .range(dataSource.datasets[0].backgroundColor);

    var labels = color.domain();
    var i = 0;
    const data = labels.map(function (label) {
      return { label: label, value: dataSource.datasets[0].data[i++] };
    });

    /* ------- PIE SLICES -------*/
    var slice = svg
      .select(".slices")
      .selectAll("path.slice")
      .data(pie(data), key);

    slice
      .enter()
      .insert("path")
      .style("fill", function (d) {
        return color(d.data.label);
      })
      .attr("class", "slice");

    slice
      .transition()
      .duration(1000)
      .attrTween("d", function (d) {
        this._current = this._current || d;
        var interpolate = d3.interpolate(this._current, d);
        this._current = interpolate(0);
        return function (t) {
          return arc(interpolate(t));
        };
      });

    slice.exit().remove();

    /* ------- TEXT LABELS -------*/
    var text = svg.select(".labels").selectAll("text").data(pie(data), key);

    text
      .enter()
      .append("text")
      .attr("dy", ".35em")
      .text(function (d) {
        return d.data.label;
      });

    function midAngle(d) {
      return d.startAngle + (d.endAngle - d.startAngle) / 2;
    }

    text
      .transition()
      .duration(1000)
      .attrTween("transform", function (d) {
        this._current = this._current || d;
        var interpolate = d3.interpolate(this._current, d);
        this._current = interpolate(0);
        return function (t) {
          var d2 = interpolate(t);
          var pos = outerArc.centroid(d2);
          pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
          return "translate(" + pos + ")";
        };
      })
      .styleTween("text-anchor", function (d) {
        this._current = this._current || d;
        var interpolate = d3.interpolate(this._current, d);
        this._current = interpolate(0);
        return function (t) {
          var d2 = interpolate(t);
          return midAngle(d2) < Math.PI ? "start" : "end";
        };
      });

    text.exit().remove();

    /* ------- SLICE TO TEXT POLYLINES -------*/
    var polyline = svg
      .select(".lines")
      .selectAll("polyline")
      .data(pie(data), key);

    polyline.enter().append("polyline");

    polyline
      .transition()
      .duration(1000)
      .attrTween("points", function (d) {
        this._current = this._current || d;
        var interpolate = d3.interpolate(this._current, d);
        this._current = interpolate(0);
        return function (t) {
          var d2 = interpolate(t);
          var pos = outerArc.centroid(d2);
          pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
          return [arc.centroid(d2), outerArc.centroid(d2), pos];
        };
      });

    polyline.exit().remove();
  }, [dataSource.datasets, dataSource.labels]);

  useEffect(() => {
    axios.get("http://localhost:3001/budget").then(function (res) {
      for (var i = 0; i < res.data.myBudget.length; i++) {
        dataSource.datasets[0].data[i] = res.data.myBudget[i].budget;
        dataSource.labels[i] = res.data.myBudget[i].title;
      }
      renderPieChart();
      renderDonutChart();
    });
  }, [dataSource, renderPieChart, renderDonutChart]);

  return (
    <main className="container center" id="main">
      <div className="page-area">
        <p id="main_content" tabIndex="-1" />
        <article className="text-box">
          <h1>Stay on track</h1>
          <p>
            Do you know where you are spending your money? If you really stop to
            track it down, you would get surprised! Proper budget management
            depends on real data... and this app will help you with that!
          </p>
        </article>

        <article className="text-box">
          <h1>Alerts</h1>
          <p>
            What if your clothing budget ended? You will get an alert. The goal
            is to never go over the budget.
          </p>
        </article>

        <article className="text-box">
          <h1>Results</h1>
          <p>
            People who stick to a financial plan, budgeting every expense, get
            out of debt faster! Also, they to live happier lives... since they
            expend without guilt or fear... because they know it is all good and
            accounted for.
          </p>
        </article>

        <article className="text-box">
          <h1>Free</h1>
          <p>This app is free!!! And you are the only one holding your data!</p>
        </article>

        <article className="text-box">
          <h1>Stay on track</h1>
          <p>
            Do you know where you are spending your money? If you really stop to
            track it down, you would get surprised! Proper budget management
            depends on real data... and this app will help you with that!
          </p>
        </article>

        <article className="text-box">
          <h1>Alerts</h1>
          <p>
            What if your clothing budget ended? You will get an alert. The goal
            is to never go over the budget.
          </p>
        </article>

        <article className="text-box">
          <h1>Results</h1>
          <p>
            People who stick to a financial plan, budgeting every expense, get
            out of debt faster! Also, they to live happier lives... since they
            expend without guilt or fear... because they know it is all good and
            accounted for.
          </p>
        </article>

        <article className="text-box">
          <h1>Chart</h1>
          <p>
            <canvas id="myChart" width="400" height="400"></canvas>
          </p>
        </article>
      </div>
      <h1>Chart-D3JS</h1>
      <div id="ChartD3JS"></div>
    </main>
  );
}

export default HomePage;
