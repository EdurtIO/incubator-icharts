import {Component} from '@angular/core';
import {BarChartData} from './models/bar-chart-data';
import {BarChartMockData} from './shared';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'icharts';

  data: BarChartData[];

  constructor() {
    this.data = BarChartMockData;
  }

}
