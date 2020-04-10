import { Component, OnInit } from '@angular/core';
import { PokemonService } from './services/pokemon.service';
import { Observable } from 'rxjs/internal/Observable';
import { PokemonListItem, Pokemon } from './services/pokemon';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit{
  title = 'pokemon-indexes-app';

  pokemonList: Observable<PokemonListItem[]>;
  pokemonDetails: Observable<Pokemon>;

  constructor(private pokemonService: PokemonService) { }
  ngOnInit()  {
    this.getPokemons();
    console.log(this.pokemonList);
  }

  getPokemons() {
    this.pokemonList = this.pokemonService.fetchAllPokemon();
    this.pokemonDetails = this.pokemonService.fetchPokemonDetails('pikachu');
  }
}
