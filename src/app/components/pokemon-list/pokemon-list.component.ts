import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokemonService } from '../../services/pokemon.service';
import { PokemonCardComponent } from '../pokemon-card/pokemon-card.component';
import { BehaviorSubject, map, Observable, switchMap } from 'rxjs';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [CommonModule, PokemonCardComponent],
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.scss'],
})
export class PokemonListComponent implements OnInit {
  private pokemonService = inject(PokemonService);

  private selectedType = new BehaviorSubject<string>('all');

  public selectedType$ = this.selectedType.asObservable();

  public types$ = this.pokemonService
    .getAllTypes()
    .pipe(map((res) => res.results));

  public pokemons$!: Observable<{ name: string; url: string }[]>;

  ngOnInit(): void {
    const getPokemonIdFromUrl = (url: string): number | null => {
      const match = url.match(/\/(\d+)\/$/);
      return match ? parseInt(match[1], 10) : null;
    };

    this.pokemons$ = this.selectedType.pipe(
      switchMap((type) => {
        if (type === 'all') {
          return this.pokemonService
            .getPokemons()
            .pipe(map((response) => response.results));
        } else {
          return this.pokemonService.getPokemonsByType(type).pipe(
            map((response) => {
              const allPokemonsOfType = response.pokemon.map((p) => p.pokemon);

              const filteredPokemons = allPokemonsOfType.filter((pokemon) => {
                const pokemonId = getPokemonIdFromUrl(pokemon.url);
                return pokemonId !== null && pokemonId <= 151;
              });

              return filteredPokemons;
            })
          );
        }
      })
    );
  }

  filterByType(type: string): void {
    this.selectedType.next(type);
  }
}
