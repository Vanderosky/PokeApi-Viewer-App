import { Component, OnInit } from '@angular/core';
import { PokemonService } from 'src/app/services/pokemon.service';
import { Observable } from 'rxjs';
import { PokemonListItem, Pokemon, PokemonWithTypeListItem } from 'src/app/services/pokemon';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})

export class ItemListComponent implements OnInit {
  sortOptions: Option[] = [
    { value: 'byCharAsc', viewValue: 'Name ascending' },
    { value: 'byCharDesc', viewValue: 'Name descending' },
  ];

  pokeList: PokemonListItem[] = [];
  pokeListCopy: PokemonListItem[] = [];
  PokeListTiles: PokeTile[] = [];
  sortOption = 'byId';
  searchValue = '';
  gridBreakpoint: number;
  pokemonTypes: string[] = [];
  selectedPokemonTypes: string[] = [];
  pokemonsDetailsList: Pokemon[] = [];
  offset = 0;
  limit = 0;
  pokemonCount = 0;

  constructor(private pokemonService: PokemonService) { }

  ngOnInit() {
    this.gridBreakpoint = (window.innerWidth <= 1200) ? 2 : 3;
    this.getPokemons();
    this.getPokemonTypes();
    this.getPokemonsDetails();
  }

  getPokemons() {
    this.pokemonService.fetchAllPokemon(this.offset, this.limit).subscribe(data => {
      this.pokeList = data;
      this.pokeListCopy = data;
      this.transformPokemonsToTiles(this.pokeList);
      this.sortBy();
      this.pokemonCount = this.pokemonService.getPokemonCount();

    });
  }

  getPokemonsDetails() {
    this.pokeList.forEach(pokemon => {
      this.pokemonService.fetchPokemonDetails(pokemon.name).subscribe(data => {
        this.pokemonsDetailsList.push(data);
      });
    });
  }

  getPokemonTypes() {
    this.pokemonService.fetchPokemonTypes().subscribe(data => {
      this.pokemonTypes = data;
    });
  }

  transformPokemonsToTiles(data: PokemonListItem[]) {
    this.PokeListTiles = [];
    data.forEach(element => {
      this.PokeListTiles.push({
        text: element.name,
        cols: 1,
        rows: 3,
        color: '#efe5fd'
      });
    });
  }

  searchBy() {
    if (((this.searchValue === '' || this.searchValue === null) && this.selectedPokemonTypes.length === 0)) {
        this.transformPokemonsToTiles(this.pokeListCopy);
        return;
    }
    this.pokeList = this.pokeListCopy.filter(element => element.name.toLowerCase() === this.searchValue.toLowerCase());
    this.transformPokemonsToTiles(this.pokeList);
    const pokemonsForSearchedTypes: PokemonWithTypeListItem[] = [];
    this.selectedPokemonTypes.forEach(type => {
      this.pokemonService.fetchPokemonByType(type).subscribe(pokemonList => {
        pokemonList.forEach(pokemon => {
          pokemonsForSearchedTypes.push(pokemon);
        });
      });
    });
    // to finish
  }

  sortBy() {
    if (this.sortOption === 'byCharAsc') {
      this.pokeList = this.pokeListCopy.sort((a, b) => {
        if (a.name > b.name) {
          return 1;
        }
        if (a.name < b.name) {
          return -1;
        }
        return 0;
      });
    }
    if (this.sortOption === 'byCharDesc') {
      this.pokeList = this.pokeListCopy.sort((a, b) => {
        if (a.name < b.name) {
          return 1;
        }
        if (a.name > b.name) {
          return -1;
        }
        return 0;
      });
    }
    this.transformPokemonsToTiles(this.pokeList);
  }
  onResize(event) {
    this.gridBreakpoint = (event.target.innerWidth <= 1200) ? 2 : 3;
  }

  setOffset(offset: number) {
    if ((this.offset === 0 && offset < 0)) {
      return;
    }
    this.offset += offset;
    if (this.offset > this.pokemonCount) {
      return;
    }
    this.getPokemons();
  }
}

interface Option {
  value: string;
  viewValue: string;
}
export interface PokeTile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}
