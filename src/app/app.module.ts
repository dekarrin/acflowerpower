import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavigationComponent } from './navigation/navigation.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { OverlayModule } from '@angular/cdk/overlay';
import { AppRoutingModule } from './app-routing.module';
import { PhenotypesComponent } from './phenotypes/phenotypes.component';
import { BreederComponent } from './breeder/breeder.component';
import { HomeComponent } from './home/home.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { GeneselectorComponent } from './geneselector/geneselector.component';
import { GeneLabelPipe } from './gene-label-pipe';
import { GeneSequenceLabelPipe } from './gene-sequence-label-pipe';
import { GeneSequenceShorthandPipe } from './gene-sequence-shorthand-pipe';
import { FlowerIconComponent } from './flower-icon/flower-icon.component';
import { PhenotypeSelectorComponent } from './phenotype-selector/phenotype-selector.component';
import { PhenotypeSearchComponent } from './phenotype-search/phenotype-search.component';
import { BreederSingleComponent } from './breeder-single/breeder-single.component';
import { BreederMultiComponent } from './breeder-multi/breeder-multi.component';
import { BreederPlannerComponent } from './breeder-planner/breeder-planner.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    PhenotypesComponent,
    BreederComponent,
    HomeComponent,
    GeneselectorComponent,
    GeneLabelPipe,
    GeneSequenceLabelPipe,
    GeneSequenceShorthandPipe,
    FlowerIconComponent,
    PhenotypeSelectorComponent,
    PhenotypeSearchComponent,
    BreederSingleComponent,
    BreederMultiComponent,
    BreederPlannerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    OverlayModule,
    AppRoutingModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatTabsModule,
    MatListModule,
    MatExpansionModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
