import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pokemon } from '../models/pokemon.model';

export interface PokemonListResponse {
    count: number;
    next: string;
    previous: string | null;
    results: { name: string; url: string; }[];
}

export interface TypeResponse {
  results: { name:string; url:string; }[];
}

export interface PokemonsByTypeResponse {
  pokemon: {
    pokemon: {
      name: string;
      url: string;
    };
  }[];
}


@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private http = inject(HttpClient);
  private apiUrl = 'https://pokeapi.co/api/v2';

  constructor() { }

  getPokemons(limit: number = 151): Observable<PokemonListResponse> {
    return this.http.get<PokemonListResponse>(`${this.apiUrl}/pokemon?limit=${limit}`);
  }

  getAllTypes(): Observable<TypeResponse> {
    return this.http.get<TypeResponse>(`${this.apiUrl}/type`);
  }

  getPokemonsByType(type: string ): Observable<PokemonsByTypeResponse> {
    return this.http.get<PokemonsByTypeResponse>(`${this.apiUrl}/type/${type}`);
  }

  getPokemonDetails(name: string): Observable<Pokemon> {
    return this.http.get<Pokemon>(`${this.apiUrl}/pokemon/${name}`);
  }

  getDataFromUrl<T>(url: string): Observable<T> {
    return this.http.get<T>(url);
  }
}
