export interface Pokemon {
    name: string;
    id: number;
    weight: number;
    height: number;
    image: string;
    types: string[];
    moves: string[];
  }

export interface PokemonListItem {
    name: string;
  }
