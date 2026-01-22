import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MonthViewComponent } from './month-view/month-view.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: MonthViewComponent,
      },
      {
        path: 'month',
        component: MonthViewComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CalendarRoutingModule {}
