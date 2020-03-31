import {Component} from '@angular/core';
import {BarChartData} from './models/bar-chart-data';
import {BarChartMockData} from './shared';
import {BarChartConfig} from './config/bar.chart.config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'iCharts';

  data: BarChartData[];

  barChartConfig: BarChartConfig = {
    width: 0,
    height: 200,
    autoResize: false
  }

  constructor() {
    this.data = BarChartMockData;
  }

}
