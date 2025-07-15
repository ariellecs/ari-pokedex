export interface PokemonListResponse {
    count: number;
    next: string;
    previous: string | null;
    results: PokemonResult[];
}

export interface PokemonResult {
    name: string;
    url: string;
}

export interface Pokemon {
    id: number;
    name: string;
    sprites: {
        front_default : string;
    };
    types: {
        type: { name: string;}
    }[];
}