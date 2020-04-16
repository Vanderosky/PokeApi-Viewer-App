import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ItemListComponent } from './components/item-list/item-list.component';
import { PokemonDetailsComponent } from './components/pokemon-details/pokemon-details.component';


const routes: Routes = [
  { path: '', component: ItemListComponent },
  { path: 'pokemon', component: ItemListComponent },
  { path: 'pokemon/:name', component: PokemonDetailsComponent },
  { path: '**', component: ItemListComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
