import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';
import am4themes_animated from '@amcharts/amcharts4/themes/spiritedaway';
import React from 'react';
import { colorCodes, CONNECTORS, MAP_DATA } from './data/Microsoft';
// d3 = Object.assign(d3, { tubemap: tubeMap.tubeMap });

class App extends React.Component {
  componentDidMount() {
    am4core.ready(function () {
      // Themes begin
      am4core.useTheme(am4themes_animated);
      // Themes end

      /**
       * The XYChart for transit schema
       */

      // Create chart instance
      const chart = am4core.create('chartdiv', am4charts.XYChart);
      chart.padding(10, 10, 10, 10);

      function createAxis(list) {
        const axis = list.push(new am4charts.ValueAxis());
        axis.min = 0;
        axis.max = 300;
        axis.strictMinMax = true;
        axis.renderer.grid.template.disabled = false;
        axis.renderer.labels.template.disabled = false;
        axis.renderer.baseGrid.disabled = false;
        return axis;
      }

      // Create axes
      const xAxis = createAxis(chart.xAxes);
      const yAxis = createAxis(chart.yAxes);

      function createLineSeries(name, color, data, isBase = false) {
        // Create series
        const series = chart.series.push(new am4charts.StepLineSeries());
        series.data = data;
        series.name = name;

        // Set up binding to data
        series.dataFields.valueX = 'x';
        series.dataFields.valueY = 'y';

        // Set up appearance
        series.stroke = color;
        series.strokeDasharray = '0,0';
        series.strokeWidth = 4;
        series.connect = true;
        // series.tensionX = 0.5;
        // series.tensionY = 0.5;

        // Add bullets (stations)
        const bullet = series.bullets.push(new am4charts.CircleBullet());

        const circleBullet = bullet.circle;
        circleBullet.radius = 6;
        circleBullet.fill = am4core.color('#fff');
        circleBullet.strokeWidth = 2;
        bullet.valign = 'middle';

        // Circle Adapters

        /**
         * Label Bullet Creation for stations
         */

        const labelBullet = series.bullets.push(new am4charts.LabelBullet());
        labelBullet.label.text = '{station}';

        labelBullet.label.verticalCenter = 'top';
        labelBullet.label.horizontalCenter = 'middle';
        labelBullet.label.fontSize = '10px';
        labelBullet.label.fontWeight = '400';
        labelBullet.label.dy = 20;
        labelBullet.zIndex = 999;
        chart.maskBullets = true;
      }

      function createConnector(data, color, name) {
        // Create series
        const series = chart.series.push(new am4charts.LineSeries());
        series.data = data;
        series.name = name;
        series.hiddenInLegend = true;

        // Set up binding to data
        series.dataFields.valueX = 'x';
        series.dataFields.valueY = 'y';

        // Set up appearance
        series.stroke = color;
        // series.strokeDasharray = "9,9";
        series.strokeWidth = 4;
        series.connect = true;

        // ENable Events
        series.segments.template.interactionsEnabled = true;
      }

      // Responsive
      chart.responsive.enabled = true;
      // Enable export
      chart.exporting.menu = new am4core.ExportMenu();
      // Animations

      function loadData() {
        MAP_DATA.forEach(({ data, name, color, isBase }) => {
          createLineSeries(name, color, data, isBase);
        });
      }

      CONNECTORS.forEach(({ data, name, color }) => {
        createConnector(data, color, name);
      });

      chart.svgContainer.autoResize = false;
      loadData();
    }); // end am4core.ready()
  }

  render() {
    return <div id="chartdiv" style={{ width: 1200, height: 800 }}></div>;
  }
}

export default App;
