import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrudfacturesComponent } from './crudfactures.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild([
		{ path: '', component: CrudfacturesComponent }
	])],
  exports: [RouterModule]
})
export class CrudfacturesRoutingModule { }
