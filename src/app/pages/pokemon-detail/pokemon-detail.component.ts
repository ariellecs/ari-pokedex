import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PokemonService } from '../../services/pokemon.service';
import { Pokemon } from '../../models/pokemon.model';
import { Observable, switchMap } from 'rxjs';

@Component({
  selector: 'app-pokemon-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './pokemon-detail.component.html',
  styleUrls: ['./pokemon-detail.component.scss']
})
export class PokemonDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private pokemonService = inject(PokemonService);
  public pokemon$!: Observable<Pokemon>;

  ngOnInit(): void {
    this.pokemon$ = this.route.paramMap.pipe(
      switchMap(params => {
        const pokemonName = params.get('name')!;
        return this.pokemonService.getPokemonDetails(pokemonName);
      })
    )
  }

}
