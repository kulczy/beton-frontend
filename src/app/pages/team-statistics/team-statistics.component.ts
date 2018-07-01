import { Component, OnInit, OnDestroy } from '@angular/core';
import { Team, Member } from '../../models';
import { TeamStoreService } from '../../services/team.store.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AppInfoService } from '../../services/appinfo.service';
import { TeamApiService } from '../../services/team.api.service';
import Chart from 'chart.js';
import * as moment from 'moment';

@Component({
  selector: 'app-team-statistics',
  templateUrl: './team-statistics.component.html'
})
export class TeamStatisticsComponent implements OnInit, OnDestroy {
  private unsubscribe = new Subject<void>();
  stat: any;

  // Chart options
  chartOptions = {
    legend: {
      display: false
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [
        {
          ticks: {
            beginAtZero: true,
            stepSize: 10,
          },
          gridLines: {
            color: '#F4F5F9',
            zeroLineColor: '#F4F5F9'
          }
        }
      ],
      yAxes: [
        {
          display: false,
          barThickness: 30,
          ticks: {
            beginAtZero: true,
            stepSize: 10
          },
          gridLines: {
            display: false
          }
        }
      ]
    }
  };

  // Chart setting
  chartData: any = {
    type: 'horizontalBar',
    data: {
      labels: [],
      datasets: [
        {
          label: 'Wins',
          backgroundColor: 'rgb(95, 255, 225)',
          borderColor: 'rgb(95, 255, 225)',
          data: []
        },
        {
          label: 'Games',
          backgroundColor: 'rgb(81, 101, 249)',
          borderColor: 'rgb(81, 101, 249)',
          data: []
        }
      ]
    },
    options: this.chartOptions
  };

  // Points chart setting
  pointsChartData: any = {
    type: 'horizontalBar',
    data: {
      labels: [],
      datasets: [
        {
          label: 'Points',
          backgroundColor: [],
          borderColor: 'rgb(95, 255, 225)',
          data: []
        }
      ]
    },
    options: this.chartOptions
  };

  constructor(
    private teamStoreService: TeamStoreService,
    private teamApiService: TeamApiService,
    private appInfoService: AppInfoService
  ) {}

  ngOnInit(): void {
    // Get statistics from API
    this.teamApiService
      .getTeamStatistics(this.teamStoreService.getTeamURL())
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((resp) => {
        this.stat = resp;
        this.stat.info.created_at = moment(
          this.stat.info.created_at
        ).format('DD.MM.YYYY');

        // Set chart labels
        resp.statistics.forEach((member) => {
          this.chartData.data.labels.push(member.username); // Set chart labels
          this.chartData.data.datasets[0].data.push(member.wins); // Set chart games wins
          this.chartData.data.datasets[1].data.push(member.games); // Set chart games number

          this.pointsChartData.data.labels.push(member.username); // Set chart labels
          this.pointsChartData.data.datasets[0].data.push(member.points); // Set chart points
          const color = member.points > 0 ? 'rgb(95, 255, 225)' : '#C54970';
          this.pointsChartData.data.datasets[0].backgroundColor.push(color); // Set colors
        });

        const chartHeight = `${resp.statistics.length * 100}px`;
        const pointsChartHeight = `${resp.statistics.length * 80}px`;

        this.renderChart(this.chartData, 'chart', chartHeight);
        this.renderChart(this.pointsChartData, 'points-chart', pointsChartHeight);
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  // render chart chart
  renderChart(chartObject: any, chartID: string, height: string): void {
    const ctx = document.getElementById(chartID);
    ctx.style.height = height;
    const chart = new Chart(ctx, chartObject);
  }
}
