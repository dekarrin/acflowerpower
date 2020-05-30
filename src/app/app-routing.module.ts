import { RouterModule, Routes, Router } from '@angular/router';
import { NgModule } from '@angular/core';

import { BreederComponent } from './breeder/breeder.component';
import { PhenotypesComponent } from './phenotypes/phenotypes.component';
import { HomeComponent } from './home/home.component';
import { PhenotypeSearchComponent } from './phenotype-search/phenotype-search.component';
import { PhenotypeSelectorComponent } from './phenotype-selector/phenotype-selector.component';
import { BreederSingleComponent } from './breeder-single/breeder-single.component';
import { BreederMultiComponent } from './breeder-multi/breeder-multi.component';
import { BreederPlannerComponent } from './breeder-planner/breeder-planner.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'breeder',
    component: BreederComponent,
    children: [
      {
        path: "",
        pathMatch: "full",
        redirectTo: "/breeder/single"
      },
      {
        path: "single",
        component: BreederSingleComponent
      },
      {
        path: "multi",
        component: BreederMultiComponent
      },
      {
        path: "planner",
        component: BreederPlannerComponent
      }
    ]
  },
  { path: 'phenotypes',
    component: PhenotypesComponent,
    children: [
      { path: '',
        pathMatch: "full",
        redirectTo: '/phenotypes/search'
      },
      {
        path: 'search',
        component: PhenotypeSearchComponent
      },
      {
        path: 'selector',
        component: PhenotypeSelectorComponent
      }
    ]}
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
