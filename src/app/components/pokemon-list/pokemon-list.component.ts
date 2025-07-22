import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokemonService } from '../../services/pokemon.service';
import { PokemonResult } from '../../models/pokemon.model';
import { PokemonCardComponent } from '../pokemon-card/pokemon-card.component';
import { map } from 'rxjs';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [CommonModule, PokemonCardComponent],
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.scss']
})
export class PokemonListComponent {
  private pokemonService = inject(PokemonService);

  readonly pokemons$ = this.pokemonService.getPokemons().pipe(map(response => response.results));
}
