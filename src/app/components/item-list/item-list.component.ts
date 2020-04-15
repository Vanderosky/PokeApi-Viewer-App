import { Component, OnInit } from '@angular/core';
import { PokemonService } from 'src/app/services/pokemon.service';
import { Observable } from 'rxjs';
import { PokemonListItem, Pokemon } from 'src/app/services/pokemon';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})

export class ItemListComponent implements OnInit {
  searchOptions: Option[] = [
    {value: 'name', viewValue: 'Name'},
    {value: 'power', viewValue: 'Power'},
    {value: 'element', viewValue: 'Element'}
  ];
  sortOptions: Option[] = [
    {value: 'byId', viewValue: 'ID'},
    {value: 'byChar', viewValue: 'Name'},
    {value: 'byWeight', viewValue: 'Weight'},
  ];

  pokeList: PokemonListItem[];
  pokeListCopy: PokemonListItem[];
  PokeListTiles: PokeTile[] = [];
  sortOption = 'byId';
  searchOption = 'name';
  searchValue = '';
  gridBreakpoint: number;

  constructor(private pokemonService: PokemonService) { }

  ngOnInit()  {
    this.gridBreakpoint = (window.innerWidth <= 1200) ? 2 : 3;
    this.getPokemons();
  }

  getPokemons() {
    this.pokemonService.fetchAllPokemon().subscribe(data => {
      this.pokeList = data;
      this.pokeListCopy = data;
      this.transformPokemonsToTiles(this.pokeList);
    });
  }

  transformPokemonsToTiles(data: PokemonListItem[]) {
    this.PokeListTiles = [];
    data.forEach(element => {
      this.PokeListTiles.push({
        text: element.name,
        cols: 1,
        rows: 3,
        color: 'lightblue'
      });
    });
  }

  searchBy() {
    if (this.searchValue === '' || this.searchValue === null) {
      this.transformPokemonsToTiles(this.pokeListCopy);
      return;
    }
    this.pokeList = this.pokeListCopy.filter(element => element.name.toLowerCase() === this.searchValue.toLowerCase());
    this.transformPokemonsToTiles(this.pokeList);
  }

  sortBy() {
    if (this.sortOption === 'byChar') {
      this.pokeList = this.pokeListCopy.sort((a, b) =>
      {
        if (a.name > b.name) {
            return 1;
        }
        if (a.name < b.name) {
            return -1;
        }
        return 0;
    });
    }
    if (this.sortOption === 'byId') {
      this.transformPokemonsToTiles(this.pokeListCopy);
    }
    if (this.sortOption === 'byWeight') {
      this.transformPokemonsToTiles(this.pokeListCopy);
    }
    this.transformPokemonsToTiles(this.pokeList);
  }
  onResize(event) {
    this.gridBreakpoint = (event.target.innerWidth <= 1200) ? 2 : 3;
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