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
    options: {
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
              stepSize: 1
            },
            gridLines: {
              color: '#F4F5F9'
            }
          }
        ],
        yAxes: [
          {
            display: false,
            barThickness: 30,
            ticks: {
              beginAtZero: true,
              stepSize: 1
            },
            gridLines: {
              display: false
            }
          }
        ]
      }
    }
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
        });

        const chartHeight = `${resp.statistics.length * 150}px`;
        this.renderChart(chartHeight);
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  // render chart chart
  renderChart(height: string): void {
    const ctx = document.getElementById('chart');
    ctx.style.height = height;
    const chart = new Chart(ctx, this.chartData);
  }
}
