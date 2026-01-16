import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DurationFormatPipe } from '../../shared/pipes/duration-format-pipe';
import { CategoryPicker } from '../../shared/components/category-picker/category-picker';
import { ColorPickerComponent } from '../../shared/components/color-picker/color-picker';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventsRoutingModule { }
