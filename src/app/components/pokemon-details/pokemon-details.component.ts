import { Component, OnInit } from '@angular/core';
import { PokemonService } from 'src/app/services/pokemon.service';
import { Pokemon } from 'src/app/services/pokemon';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pokemon-details',
  templateUrl: './pokemon-details.component.html',
  styleUrls: ['./pokemon-details.component.css']
})
export class PokemonDetailsComponent implements OnInit {
  pokemonDetails: Pokemon;
  pokemonNameParameter: string;
  pokemonFetched = false;

  constructor(private pokemonService: PokemonService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.getRouteParameter();
    this.getPokemonDetails();
  }

  getPokemonDetails() {
    this.pokemonService.fetchPokemonDetails(this.pokemonNameParameter).subscribe(details => {
      this.pokemonDetails = details;
      this.pokemonFetched = true;
    });
  }

  getRouteParameter() {
    this.route.paramMap.subscribe(params => {
      this.pokemonNameParameter = params.get('name').toLocaleLowerCase();
  });
  }

}
