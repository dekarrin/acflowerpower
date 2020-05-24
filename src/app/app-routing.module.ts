import { RouterModule, Routes, Router } from '@angular/router';
import { NgModule } from '@angular/core';

import { BreederComponent } from './breeder/breeder.component';
import { PhenotypesComponent } from './phenotypes/phenotypes.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'breeder', component: BreederComponent },
  { path: 'phenotypes', component: PhenotypesComponent}
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
