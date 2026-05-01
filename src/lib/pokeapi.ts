const POKEAPI_BASE = "https://pokeapi.co/api/v2";

// Types
export interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  baseExperience: number;
  isDefault: boolean;
  order: number;
  species: { name: string; url: string };
  sprites: {
    frontDefault: string | null;
    frontShiny: string | null;
    backDefault: string | null;
    backShiny: string | null;
    other?: {
      "official-artwork"?: {
        frontDefault: string | null;
        frontShiny: string | null;
      };
    };
  };
  stats: Array<{
    baseStat: number;
    effort: number;
    stat: { name: string; url: string };
  }>;
  types: Array<{
    slot: number;
    type: { name: string; url: string };
  }>;
  abilities: Array<{
    isHidden: boolean;
    slot: number;
    ability: { name: string; url: string };
  }>;
  moves: Array<{
    move: { name: string; url: string };
    versionGroupDetails: Array<{
      levelLearnedAt: number;
      moveLearnMethod: { name: string; url: string };
      versionGroup: { name: string; url: string };
    }>;
  }>;
  held_items: Array<{
    item: { name: string; url: string };
    versionDetails: Array<{
      rarity: number;
      version: { name: string; url: string };
    }>;
  }>;
}

export interface PokemonSpecies {
  id: number;
  name: string;
  order: number;
  genderRate: number;
  captureRate: number;
  baseHappiness: number;
  isMainSeries: boolean;
  hatchCounter: number;
  hasGenderDifferences: boolean;
  formsSwitchable: boolean;
  growthRate: { name: string; url: string };
  pokedexNumbers: Array<{
    entryNumber: number;
    pokedex: { name: string; url: string };
  }>;
  eggGroups: Array<{ name: string; url: string }>;
  color: { name: string; url: string };
  shape: { name: string; url: string };
  evolvesFromSpecies: { name: string; url: string } | null;
  evolutionChain: { url: string };
  flavorTextEntries: Array<{
    flavorText: string;
    language: { name: string; url: string };
    version: { name: string; url: string };
  }>;
  formDescriptions: Array<{
    description: string;
    language: { name: string; url: string };
  }>;
  genera: Array<{
    genus: string;
    language: { name: string; url: string };
  }>;
  names: Array<{
    name: string;
    language: { name: string; url: string };
  }>;
  palParkEncounters: Array<{
    area: { name: string; url: string };
    baseScore: number;
    rate: number;
  }>;
}

export interface EvolutionChain {
  id: number;
  babyTriggerItem: { name: string; url: string } | null;
  chain: EvolutionChainLink;
}

export interface EvolutionChainLink {
  isBaby: boolean;
  species: { name: string; url: string };
  evolutionDetails: Array<{
    item: { name: string; url: string } | null;
    trigger: { name: string; url: string };
    gender: number | null;
    heldItem: { name: string; url: string } | null;
    knownMove: { name: string; url: string } | null;
    knownMoveType: { name: string; url: string } | null;
    location: { name: string; url: string } | null;
    minAffection: number | null;
    minBeauty: number | null;
    minHappiness: number | null;
    minLevel: number | null;
    needsOverworldRain: boolean;
    partySpecies: { name: string; url: string } | null;
    partyType: { name: string; url: string } | null;
    relativePhysicalStats: number | null;
    timeOfDay: string;
    tradeSpecies: { name: string; url: string } | null;
    turnUpsideDown: boolean;
  }>;
  evolveDetails?: Array<{ trigger: { name: string; url: string } }>;
  evolvesTo: EvolutionChainLink[];
}

export interface PokemonType {
  id: number;
  name: string;
  damageRelations: {
    doubleDamageTo: Array<{ name: string; url: string }>;
    doubleDamageFrom: Array<{ name: string; url: string }>;
    halfDamageTo: Array<{ name: string; url: string }>;
    halfDamageFrom: Array<{ name: string; url: string }>;
    noDamageTo: Array<{ name: string; url: string }>;
    noDamageFrom: Array<{ name: string; url: string }>;
  };
  moves: Array<{ name: string; url: string }>;
  pokemon: Array<{
    slot: number;
    pokemon: { name: string; url: string };
  }>;
}

export interface Ability {
  id: number;
  name: string;
  isMainSeries: boolean;
  generation: { name: string; url: string };
  names: Array<{
    name: string;
    language: { name: string; url: string };
  }>;
  effectEntries: Array<{
    effect: string;
    shortEffect: string;
    language: { name: string; url: string };
  }>;
  effectChanges: Array<{
    effectEntries: Array<{
      effect: string;
      language: { name: string; url: string };
    }>;
    versionGroup: { name: string; url: string };
  }>;
  pokemon: Array<{
    isHidden: boolean;
    slot: number;
    pokemon: { name: string; url: string };
  }>;
}

export interface Move {
  id: number;
  name: string;
  accuracy: number | null;
  power: number | null;
  pp: number;
  priority: number;
  type: { name: string; url: string };
  category: { name: string; url: string };
  effectEntries: Array<{
    effect: string;
    shortEffect: string;
    language: { name: string; url: string };
  }>;
  generation: { name: string; url: string };
  machines: Array<{
    machine: { url: string };
    versionGroup: { name: string; url: string };
  }>;
  statChanges: Array<{
    change: number;
    stat: { name: string; url: string };
  }>;
  target: { name: string; url: string };
  effectChance: number | null;
}

export interface PokemonListResult {
  count: number;
  next: string | null;
  previous: string | null;
  results: Array<{ name: string; url: string }>;
}

export interface Generation {
  id: number;
  name: string;
  mainRegion: { name: string; url: string };
  moves: Array<{ name: string; url: string }>;
  names: Array<{
    name: string;
    language: { name: string; url: string };
  }>;
  pokemonSpecies: Array<{ name: string; url: string }>;
  types: Array<{ name: string; url: string }>;
  versionGroups: Array<{ name: string; url: string }>;
}

function toCamelCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map((v) => toCamelCase(v));
  } else if (obj !== null && obj !== undefined && obj.constructor === Object) {
    return Object.keys(obj).reduce((result, key) => {
      const camelKey = key.replace(/([-_][a-z])/g, (group) =>
        group.toUpperCase().replace("-", "").replace("_", "")
      );
      result[camelKey] = toCamelCase(obj[key]);
      return result;
    }, {} as any);
  }
  return obj;
}

// Fetch functions with ISR revalidation
async function fetchPokéAPI<T>(
  endpoint: string,
  revalidate = 86400
): Promise<T> {
  const url = `${POKEAPI_BASE}${endpoint}`;
  const response = await fetch(url, {
    next: { revalidate },
    headers: {
      "Accept-Encoding": "gzip",
    },
  });

  if (!response.ok) {
    throw new Error(
      `PokéAPI error: ${response.status} on ${endpoint}`
    );
  }

  const data = await response.json();
  return toCamelCase(data) as T;
}

export async function getPokemon(nameOrId: string | number): Promise<Pokemon> {
  return fetchPokéAPI<Pokemon>(`/pokemon/${nameOrId}/`);
}

export async function getPokemonSpecies(
  nameOrId: string | number
): Promise<PokemonSpecies> {
  return fetchPokéAPI<PokemonSpecies>(`/pokemon-species/${nameOrId}/`);
}

export async function getPokemonList(
  limit = 20,
  offset = 0
): Promise<PokemonListResult> {
  return fetchPokéAPI<PokemonListResult>(
    `/pokemon?limit=${limit}&offset=${offset}`
  );
}

export async function getEvolutionChain(chainId: number): Promise<EvolutionChain> {
  return fetchPokéAPI<EvolutionChain>(`/evolution-chain/${chainId}/`);
}

export async function getType(name: string): Promise<PokemonType> {
  return fetchPokéAPI<PokemonType>(`/type/${name}`);
}

export async function getAllTypes(): Promise<PokemonListResult> {
  return fetchPokéAPI<PokemonListResult>(`/type?limit=100`);
}

export async function getAbility(name: string): Promise<Ability> {
  return fetchPokéAPI<Ability>(`/ability/${name}`);
}

export async function getMove(name: string): Promise<Move> {
  return fetchPokéAPI<Move>(`/move/${name}`);
}

export async function getGeneration(genId: number | string): Promise<Generation> {
  return fetchPokéAPI<Generation>(`/generation/${genId}`);
}

export async function getAllGenerations(): Promise<PokemonListResult> {
  return fetchPokéAPI<PokemonListResult>(`/generation?limit=20`);
}

// Helper: get all Pokémon names for generateStaticParams
export async function getAllPokemonNames(): Promise<string[]> {
  const allNames: string[] = [];
  let offset = 0;
  const limit = 100;

  while (offset < 1025) {
    const result = await getPokemonList(limit, offset);
    allNames.push(...result.results.map((r) => r.name));
    offset += limit;

    if (!result.next) break;
  }

  return allNames;
}

// Helper: get flavor text in English
export function getEnglishFlavorText(
  flavorTextEntries: PokemonSpecies["flavorTextEntries"]
): string {
  const entry = flavorTextEntries.find(
    (e) => e.language.name === "en"
  );
  return entry
    ? entry.flavorText.replace(/\f/g, " ").replace(/\n/g, " ").trim()
    : "";
}

// Helper: get ability description
export function getAbilityEffect(effectEntries: Ability["effectEntries"]): string {
  const entry = effectEntries.find((e) => e.language.name === "en");
  return entry ? entry.shortEffect || entry.effect : "";
}

// Helper: extract stat value by name
export function getStatByName(
  stats: Pokemon["stats"],
  statName: string
): number {
  const stat = stats.find((s) => s.stat.name === statName);
  return stat ? stat.baseStat : 0;
}

// Helper: get official artwork URL
export function getOfficialArtwork(pokemon: Pokemon): string {
  return (
    pokemon.sprites.other?.["official-artwork"]?.frontDefault ||
    pokemon.sprites.frontDefault ||
    ""
  );
}

// Helper: format height in meters
export function formatHeight(heightDecimeters: number): string {
  const meters = (heightDecimeters / 10).toFixed(1);
  return `${meters} m`;
}

// Helper: format weight in kg
export function formatWeight(hectograms: number): string {
  const kg = (hectograms / 10).toFixed(1);
  return `${kg} kg`;
}
