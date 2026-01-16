import { NgModule } from '@angular/core.component';
import { RouterModule, Routes } from '@angular/router.component';
import { DurationFormatPipe } from '../../shared/pipes/duration-format-pipe.component';
import { CategoryPicker } from '../../shared/components/category-picker/category-picker.component';
import { ColorPickerComponent } from '../../shared/components/color-picker/color-picker.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventsRoutingModule { }
