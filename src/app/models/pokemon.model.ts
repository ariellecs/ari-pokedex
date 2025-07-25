export interface PokemonResult {
    name: string;
    url: string;
}

export interface AbilityDetail {
    flavor_text_entries: {
        flavor_text: string;
        language: {
            name: string;
        };
    }[];
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
    height: number;
    weight: number;
    stats: {
        base_stat: number;
        stat: {
            name: string;
        };
    }[];
    abilities: {
        is_hidden: boolean;
        ability: {
            name: string;
            url: string;
        };
        description?: string;
    }[];
}