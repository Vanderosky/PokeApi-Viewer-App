export interface Pokemon {
  name: string;
  id: number;
  weight: number;
  height: number;
  image: string;
  types: string[];
  moves: string[];
  stats: Stats[];
}

export interface PokemonListItem {
  name: string;
}

export interface PokemonWithTypeListItem {
  name: string;
  types: string[];
}

export interface Stats {
  base_stat: number;
  name: string;
}

