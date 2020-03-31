import {Component, ElementRef, Input, OnChanges, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {BarChartData} from '../../models/bar-chart-data';

import * as d3 from 'd3';
import {BarChartConfig} from '../../config/bar.chart.config';

const defaults: BarChartConfig = {
  width: 100,
  height: 1000,
  autoResize: true
};

@Component({
  selector: 'app-bar-chart',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnInit, OnChanges {

  @Input()
  data: BarChartData[];

  @Input()
  config: BarChartConfig;

  margin = {top: 20, right: 20, bottom: 30, left: 40};
  @ViewChild('barChart')
  private chartContainer: ElementRef;

  constructor() {
    // this.config = {...defaults, ...this.config};
    console.log(this.config);
  }

  ngOnInit() {
  }

  ngOnChanges(): void {
    if (!this.data) {
      return;
    }
    this.createChart();
  }

  /**
   * 重新构建图表，监控浏览器状态
   */
  onResize() {
    this.createChart();
  }

  /**
   * 创建图表
   */
  private createChart(): void {
    const element = this.chartContainer.nativeElement;
    const data = this.data;

    const offsetWidth = element.offsetWidth;
    const offsetHeight = element.offsetHeight;

    if (offsetHeight <= 0) {
      offsetHeight = 300;
    }

    if (!this.config.autoResize) {
      if (this.config.width > 0) {
        offsetWidth = this.config.width;
      }
      if (this.config.height > 0) {
        offsetHeight = this.config.height;
      }
    }

    d3.select(element).select('svg').remove();

    const svg = d3.select(element).append('svg')
      .attr('width', offsetWidth)
      .attr('height', offsetHeight);

    const contentWidth = offsetWidth - this.margin.left - this.margin.right;
    const contentHeight = offsetHeight - this.margin.top - this.margin.bottom;

    const x = d3
      .scaleBand()
      .rangeRound([0, contentWidth])
      .padding(0.1)
      .domain(data.map(d => d.x));

    const y = d3
      .scaleLinear()
      .rangeRound([contentHeight, 0])
      .domain([0, d3.max(data, d => d.y)]);

    const g = svg.append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    // 图表X轴数据
    g.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', 'translate(0,' + contentHeight + ')')
      .call(d3.axisBottom(x));

    // 图表Y轴数据
    g.append('g')
      .attr('class', 'axis axis--y')
      .call(d3.axisLeft(y))
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '0.71em')
      .attr('text-anchor', 'end')
      .text('Frequency');

    // 提示信息
    const tooltip = d3.select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('z-index', '100')
      .style('visibility', 'hidden')
      .style('font-size', '12px')
      .style('font-weight', 'bold')
      .text('');

    // 绘制图表柱状图
    g.selectAll('.bar')
      .data(data)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.x))
      .attr('y', d => y(d.y))
      .attr('width', x.bandwidth())
      .attr('height', d => contentHeight - y(d.y))
      .style('cursor', 'pointer')
      .on('mouseover', function (d, i) {
        return tooltip
          .style('visibility', 'visible')
          .text(d.x + ' : ' + d.y);
      })
      .on('mousemove', function (d, i) {
        return tooltip.style('top', (event.pageY - 40) + 'px').style('left', (event.pageX - 10) + 'px');
      })
      .on('mouseout', function (d, i) {
        return tooltip.style('visibility', 'hidden');
      });
  }

}
