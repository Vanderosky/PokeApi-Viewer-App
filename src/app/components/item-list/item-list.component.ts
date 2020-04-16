import { Component, OnInit } from '@angular/core';
import { PokemonService } from 'src/app/services/pokemon.service';
import { Observable, forkJoin } from 'rxjs';
import { PokemonListItem, Pokemon, PokemonWithTypeListItem } from 'src/app/services/pokemon';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { element } from 'protractor';

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

  constructor(private pokemonService: PokemonService, private route: ActivatedRoute, private router: Router) { }

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

  transformPokemonsToTiles(data: PokemonListItem[], slice?: boolean) {
    this.PokeListTiles = [];
    data.forEach(element => {
      this.PokeListTiles.push({
        text: element.name,
        cols: 1,
        rows: 3,
        color: '#efe5fd'
      });
    });
    if (slice) {
      this.PokeListTiles = this.PokeListTiles.slice(this.offset, this.offset + 20);
    }
  }

  searchBy() {
    if (((this.searchValue === '' || this.searchValue === null) && this.selectedPokemonTypes.length === 0)) {
      this.transformPokemonsToTiles(this.pokeListCopy);
      return;
    }
    this.pokeList = this.pokeListCopy.filter(element => element.name.toLowerCase() === this.searchValue.toLowerCase());
    this.transformPokemonsToTiles(this.pokeList);
    this.router.navigateByUrl('/pokemon/' + this.searchValue);
  }

  async filterByTypes() {
    if (this.selectedPokemonTypes.length === 0) {
      this.transformPokemonsToTiles(this.pokeListCopy);
    }
    else if (this.selectedPokemonTypes.length === 1) {
      this.pokemonService.fetchPokemonByType(this.selectedPokemonTypes[0]).subscribe(pokemonList => {
        this.transformPokemonsToTiles(pokemonList);
      });
    } else {
      const pokemonsForSearchedTypes: PokemonWithTypeListItem[] = [];
      this.selectedPokemonTypes.forEach(type => {
        (this.pokemonService.fetchPokemonByType(type).subscribe(pokemonList => {
          pokemonList.forEach(pokemon => {
            pokemonsForSearchedTypes.push(pokemon);
          });
        }));
      });
      await this.delay(500);
      const countedPokemons = pokemonsForSearchedTypes.reduce((a, e) => {
        a[e.name] = ++a[e.name] || 0;
        return a;
      }, {});
      const pokemonsFiltered = pokemonsForSearchedTypes.filter(e => countedPokemons[e.name]);
      this.transformPokemonsToTiles(pokemonsFiltered);
    }
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
    if (event.target.innerWidth <= 600) {
      this.gridBreakpoint = 1;
    }
    if (event.target.innerWidth <= 1024 && event.target.innerWidth > 600) {
      this.gridBreakpoint = 2;
    }
    if (event.target.innerWidth > 1400) {
      this.gridBreakpoint = 3;
    }
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

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
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
