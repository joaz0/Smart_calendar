import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MonthView } from './month-view/month-view';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: MonthView,
      },
      {
        path: 'month',
        component: MonthView,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CalendarRoutingModule {}
