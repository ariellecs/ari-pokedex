import { Routes } from '@angular/router';
import { PokemonListComponent } from './components/pokemon-list/pokemon-list.component';
import { PokemonDetailComponent } from './pages/pokemon-detail/pokemon-detail.component';

export const routes: Routes = [
    {path: '', component: PokemonListComponent },
    {path: 'pokemon/:name', component: PokemonDetailComponent},
    {path: '**', redirectTo: '', pathMatch: 'full'}
];