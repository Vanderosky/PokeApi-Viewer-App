import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';
import { Observable } from 'rxjs';
import { PokemonListItem, Pokemon } from './pokemon';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  private API_URL = 'https://pokeapi.co/api/v2/';

  constructor(private http: HttpClient) { }

  performGet(URL: string, params: HttpParams = null): Observable<Response> {
    return this.http.get(URL, {params}).pipe(
      map((response: Response) => {
        return response;
      }),
      catchError((error: Response) => {
        return throwError('An error occurred');
      })
    );
  }

  fetchAllPokemon(): Observable<PokemonListItem[]> {
    return this.performGet(this.API_URL + 'pokemon')
      .pipe(
        map((response: Response) => {
          return this.mapPokemonList(response);
        })
      );
  }

  fetchPokemonDetails(name: string): Observable<Pokemon> {
    const API = (this.API_URL + 'pokemon/:name').replace(':name', name);
    return this.performGet(API)
      .pipe(
        map((response: Response) => {
          return this.mapPokemon(response);
        })
      );
  }

  fetchPokemonByType(name: string): Observable<PokemonListItem[]> {
    const API = (this.API_URL + 'type/:name').replace(':name', name);
    return this.performGet(API)
      .pipe(
        map((response: Response) => {
          return this.mapPokemonsByType(response);
        })
      );
  }

  fetchPokemonTypes(): Observable<string[]> {
    return this.performGet(this.API_URL + 'type')
    .pipe(
      map((response: Response) => {
        return this.mapPokemonTypes(response);
      })
    );
  }

  mapPokemon(details: any): Pokemon {
    const types: string[] = [];
    for (const i in details.types) {
      if (details.types[i].type) {
        types.push(details.types[i].type.name);
      }
    }
    const moves: string[] = [];
    for (const j in details.moves) {
      if (details.moves[j].move) {
        moves.push(details.moves[j].move.name);
      }
    }

    const pokemon: Pokemon = {
      name: details.name,
      id: details.id,
      weight: details.weight,
      height: details.height,
      image: details.sprites.front_default,
      types,
      moves
    };
    return pokemon;
  }

  mapPokemonList(list: any): PokemonListItem[] {
    const pokemonList: PokemonListItem[] = [];
    for (const i in list.results) {
      if (list.results[i]) {
        pokemonList.push({name: list.results[i].name});
      }
    }
    return pokemonList;
  }

  mapPokemonsByType(details: any): PokemonListItem[] {
    const pokemons: PokemonListItem[] = [];
    for (const i in details.pokemon) {
      if (details.pokemon[i].pokemon) {
        pokemons.push({name: details.pokemon[i].pokemon.name});
      }
    }
    return pokemons;
  }

  mapPokemonTypes(details: any): string[] {
    const types: string[] = [];
    for (const i in details.results) {
      if (details.results[i].name) {
        types.push(details.results[i].name);
      }
    }
    return types;
  }
}
