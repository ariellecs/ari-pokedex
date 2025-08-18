import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokemonService } from '../../services/pokemon.service';
import { PokemonCardComponent } from '../pokemon-card/pokemon-card.component';
import {
  BehaviorSubject,
  map,
  Observable,
  switchMap,
  combineLatest,
  tap,
  of,
} from 'rxjs';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [CommonModule, PokemonCardComponent],
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.scss'],
})
export class PokemonListComponent implements OnInit {
  private pokemonService = inject(PokemonService);

  public readonly pageSize = 20;
  private currentPage = new BehaviorSubject<number>(1);
  public currentPage$ = this.currentPage.asObservable();
  public totalPokemons = 0;

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

    this.pokemons$ = combineLatest([this.selectedType, this.currentPage]).pipe(
      switchMap(([type, page]) => {
        if (type === 'all') {
          const offset = (page - 1) * this.pageSize;
          this.totalPokemons = 151;

          const remainingPokemons = this.totalPokemons - offset;

          const limit = Math.min(this.pageSize, remainingPokemons);

          if (limit <= 0) {
            return of([]);
          }

          return this.pokemonService
            .getPokemons(limit, offset)
            .pipe(map((response) => response.results));
        } else {
          return this.pokemonService.getPokemonsByType(type).pipe(
            map((response) => {
              const allPokemonsOfType = response.pokemon.map((p) => p.pokemon);

              const filteredById = allPokemonsOfType.filter((pokemon) => {
                const pokemonId = getPokemonIdFromUrl(pokemon.url);
                return pokemonId !== null && pokemonId <= 151;
              });

              this.totalPokemons = filteredById.length;

              const startIndex = (page - 1) * this.pageSize;
              const endIndex = startIndex + this.pageSize;

              return filteredById.slice(startIndex, endIndex);
            })
          );
        }
      })
    );
  }

  filterByType(type: string): void {
    this.currentPage.next(1);
    this.selectedType.next(type);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.next(page);
    }
  }

  totalPages(): number {
    if (this.totalPokemons === 0) return 1;
    return Math.ceil(this.totalPokemons / this.pageSize);
  }
}
