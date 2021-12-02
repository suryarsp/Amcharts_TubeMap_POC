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

      chart.dataSource.url =
        'https://s3-us-west-2.amazonaws.com/s.cdpn.io/t-160/sample_data_serial.csv';
      chart.dataSource.parser = new am4core.CSVParser();
      chart.dataSource.parser.options.useColumnNames = true;

      function createAxis(list) {
        const axis = list.push(new am4charts.ValueAxis());
        axis.min = -50;
        axis.max = 100;
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
        series.strokeWidth = 1;
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
        series.strokeWidth = 10;
        series.connect = true;

        // ENable Events
        series.segments.template.interactionsEnabled = true;

        const labelBullet = series.bullets.push(new am4charts.LabelBullet());
        labelBullet.adapter.add('visible', (_, e) => {
          const value = e.dataItem.dataContext;

          if (value && value.connector) {
            return true;
          }
          return false;
        });

        labelBullet.label.padding(5, 5, 5, 5);
        const titleLabel = labelBullet.createChild(am4core.Label);
        titleLabel.text = data.find((d) => d.connector)
          ? data.find((d) => d.connector).connector
          : '';
        titleLabel.fontSize = 14;
        titleLabel.isMeasured = false;
        titleLabel.padding(4, 4, 4, 4);
        titleLabel.verticalCenter = 'middle';
        titleLabel.horizontalCenter = 'middle';
        const rect = new am4core.RoundedRectangle();
        rect.cornerRadius(5, 5, 5, 5);
        rect.stroke = color;
        titleLabel.background = rect;
        titleLabel.stroke = am4core.color('#000');

        const segment = series.segments.template;
        segment.interactionsEnabled = true;

        const hoverState = segment.states.create('hover');
        hoverState.properties.strokeWidth = 10;
        hoverState.properties.strokeDasharray = '0,0';

        const dimmed = segment.states.create('dimmed');
        dimmed.properties.stroke = am4core.color('#dadada');

        segment.events.on('over', function (event) {
          processOver(event.target.parent.parent.parent);
        });

        segment.events.on('out', function (event) {
          processOut(event.target.parent.parent.parent);
        });
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

  createImageBullet = () => {};

  render() {
    return <div id="chartdiv" style={{ width: 1200, height: 800 }}></div>;
  }
}

export default App;
