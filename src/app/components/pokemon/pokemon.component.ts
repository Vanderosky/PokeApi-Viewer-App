import { Component, OnInit, Input } from '@angular/core';
import { PokemonService } from 'src/app/services/pokemon.service';
import { Observable } from 'rxjs';
import { Pokemon } from 'src/app/services/pokemon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pokemon',
  templateUrl: './pokemon.component.html',
  styleUrls: ['./pokemon.component.css']
})
export class PokemonComponent implements OnInit {
  @Input() pokemonName: string;
  pokemonDetails: Pokemon;
  pokemonDetailsFetched = false;

  constructor(private pokemonService: PokemonService, private router: Router) { }

  ngOnInit(): void {
    this.getPokemonDetails();
  }

  getPokemonDetails(): void {
    this.pokemonService.fetchPokemonDetails(this.pokemonName).subscribe(details => {
      this.pokemonDetails = details;
      this.pokemonDetailsFetched = true;
    });
  }

  goToPokemonDetails() {
    this.router.navigateByUrl('/pokemon/' + this.pokemonName);
  }
}
