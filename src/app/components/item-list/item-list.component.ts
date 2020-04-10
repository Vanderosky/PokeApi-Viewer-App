import { Component, OnInit } from '@angular/core';
import { PokemonService } from 'src/app/services/pokemon.service';
import { Observable } from 'rxjs';
import { PokemonListItem, Pokemon } from 'src/app/services/pokemon';

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
@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})

export class ItemListComponent implements OnInit {
  options: Option[] = [
    {value: 'name', viewValue: 'Name'},
    {value: 'power', viewValue: 'Power'},
    {value: 'element', viewValue: 'Element'}
  ];

  pokeList: PokemonListItem[];
  PokeListTiles: PokeTile[] = [];
  constructor(private pokemonService: PokemonService) { }

  ngOnInit()  {
    this.getPokemons();
  }

  getPokemons() {
    this.pokemonService.fetchAllPokemon().subscribe(data => {
      this.pokeList = data;
      this.transformPokemonsToTiles(this.pokeList);
    });
  }

  transformPokemonsToTiles(data: PokemonListItem[]) {
    data.forEach(element => {
      this.PokeListTiles.push({
        text: element.name,
        cols: 1,
        rows: 3,
        color: 'lightblue'
      });
    });
  }

}
