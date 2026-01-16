import { NgModule } from '@angular/core.component';
import { RouterModule, Routes } from '@angular/router.component';
import { MonthView } from './month-view/month-view.component';

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
