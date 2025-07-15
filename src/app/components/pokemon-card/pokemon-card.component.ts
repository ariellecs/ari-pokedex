import { Component, Input, OnInit, inject, input} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Pokemon } from '../../models/pokemon.model';
import { Observable } from 'rxjs';
import { Router, RouterLink } from '@angular/router';


@Component({
  selector: 'app-pokemon-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './pokemon-card.component.html',
  styleUrls: ['./pokemon-card.component.scss']
})
export class PokemonCardComponent implements OnInit {
  private http = inject(HttpClient);

  @Input() pokemonUrl!: string;
  public pokemon$!: Observable<Pokemon>;

  ngOnInit(): void {
    if (this.pokemonUrl){
      this.pokemon$ = this.http.get<Pokemon>(this.pokemonUrl);
    }
  }
}
