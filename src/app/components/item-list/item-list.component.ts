import { Component, OnInit } from '@angular/core';
import { PokemonService } from 'src/app/services/pokemon.service';
import { Observable } from 'rxjs';
import { PokemonListItem, Pokemon, PokemonWithTypeListItem } from 'src/app/services/pokemon';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

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
  pokemonCount = 964;
  offsetParameter = null;

  constructor(private pokemonService: PokemonService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.getRouteParameter();
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

  getRouteParameter() {
    this.route.paramMap.subscribe(params => {
      this.offsetParameter = Number(params.get('number'));
      if (isNaN(this.offsetParameter || this.offsetParameter < 0)) {
        return;
      }
      this.setOffset(this.offsetParameter);
  });
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
    if (this.offset + offset < 0) {
      this.offset = 0;
      this.getPokemons();
      return;
    }
    if (this.offset + offset > this.pokemonCount) {
      return;
    }
    this.offset += offset;

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
