import { Component, OnInit, Input } from '@angular/core';
import { PokemonService } from 'src/app/services/pokemon.service';
import { Observable } from 'rxjs';
import { Pokemon } from 'src/app/services/pokemon';

@Component({
  selector: 'app-pokemon',
  templateUrl: './pokemon.component.html',
  styleUrls: ['./pokemon.component.css']
})
export class PokemonComponent implements OnInit {
  @Input() pokemonName: string;
  pokemonDetails: Pokemon;
  pokemonDetailsFetched = false;

  constructor(private pokemonService: PokemonService) { }

  ngOnInit(): void {
    this.getPokemonDetails();
  }

  getPokemonDetails(): void {
    this.pokemonService.fetchPokemonDetails(this.pokemonName).subscribe(details => {
      this.pokemonDetails = details;
      this.pokemonDetailsFetched = true;
    });
  }
}
