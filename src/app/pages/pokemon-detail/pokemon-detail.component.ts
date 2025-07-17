import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PokemonService } from '../../services/pokemon.service';
import { Pokemon, AbilityDetail } from '../../models/pokemon.model';
import { Observable, switchMap, map, forkJoin, of } from 'rxjs';

@Component({
  selector: 'app-pokemon-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './pokemon-detail.component.html',
  styleUrls: ['./pokemon-detail.component.scss'],
})
export class PokemonDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private pokemonService = inject(PokemonService);
  public pokemon$!: Observable<Pokemon>;

  ngOnInit(): void {
    this.pokemon$ = this.route.paramMap.pipe(
      switchMap((params) => {
        const pokemonName = params.get('name')!;
        return this.pokemonService.getPokemonDetails(pokemonName);
      }),
      switchMap((pokemon) => {
        const abilityObservables = pokemon.abilities.map((abilityInfo) =>
          this.pokemonService.getDataFromUrl<AbilityDetail>(
            abilityInfo.ability.url
          )
        );

        if (abilityObservables.length === 0) {
          return of(pokemon);
        }

        return forkJoin(abilityObservables).pipe(
          map((abilityDetails) => {
            abilityDetails.forEach((detail, index) => {
              const descriptionEntry = detail.flavor_text_entries.find(
                (entry) => entry.language.name === 'en'
              );

              pokemon.abilities[index].description = descriptionEntry
                ? descriptionEntry.flavor_text
                : 'Description not available';
            });
            return pokemon;
          })
        );
      })
    );
  }
}
