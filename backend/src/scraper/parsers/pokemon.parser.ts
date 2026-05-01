import * as cheerio from 'cheerio';

export function parseInfobox($: cheerio.CheerioAPI) {
  const data: any = {};
  
  // Extract National Dex Number
  const dexText = $('.roundy th a[title="List of Pokémon by National Pokédex number"] span').first().text();
  data.nationalDex = parseInt(dexText.replace('#', ''), 10);

  // Extract Japanese Name
  data.nameJapanese = $('.roundy th b span[lang="ja"]').text();

  // Extract Types
  const types: string[] = [];
  $('.roundy td a[title*="(type)"] span').each((_, el) => {
    const type = $(el).text().trim();
    if (type && !types.includes(type) && type !== 'Unknown') {
      types.push(type);
    }
  });
  data.types = types;

  // Extract Genera
  data.genus = $('.roundy td a[title="Pokémon category"] span').text();

  // Extract Height/Weight
  const heightText = $('.roundy th:contains("Height")').next().text();
  data.height = parseFloat(heightText.match(/(\d+\.?\d*)\s*m/)?.[1] || '0');

  const weightText = $('.roundy th:contains("Weight")').next().text();
  data.weight = parseFloat(weightText.match(/(\d+\.?\d*)\s*kg/)?.[1] || '0');

  // Abilities
  const abilities: any[] = [];
  $('.roundy th:contains("Abilities")').next().find('a').each((_, el) => {
    const name = $(el).text().trim();
    const isHidden = $(el).parent().text().includes('(Hidden ability)');
    if (name && name !== 'Unknown') {
      abilities.push({ name, isHidden });
    }
  });
  data.abilities = abilities;

  // Catch Rate
  const catchRateText = $('.roundy th:contains("Catch rate")').next().text();
  data.catchRate = parseInt(catchRateText.match(/(\d+)/)?.[1] || '0', 10);

  // Base Friendship
  const friendshipText = $('.roundy th:contains("Base friendship")').next().text();
  data.baseFriendship = parseInt(friendshipText.match(/(\d+)/)?.[1] || '0', 10);

  // Base Exp
  const expText = $('.roundy th:contains("Base Exp")').next().text();
  data.baseExp = parseInt(expText.match(/(\d+)/)?.[1] || '0', 10);

  // Growth Rate
  data.growthRate = $('.roundy th:contains("Growth rate")').next().text().trim();

  // Gender Ratio
  data.genderRatio = $('.roundy th:contains("Gender ratio")').next().text().trim();

  // Egg Groups
  const eggGroups: string[] = [];
  $('.roundy th:contains("Egg Groups")').next().find('a').each((_, el) => {
    const group = $(el).text().trim();
    if (group && group !== 'Unknown') {
      eggGroups.push(group);
    }
  });
  data.eggGroups = eggGroups;

  // Hatch Time
  const hatchTimeText = $('.roundy th:contains("Egg cycles")').next().text();
  data.hatchTime = parseInt(hatchTimeText.match(/(\d+)/)?.[1] || '0', 10);

  return data;
}

export function parseBiology($: cheerio.CheerioAPI) {
  const biology: any = {};
  const biologySection = $('#Biology').parent().nextUntil('h2');
  biology.description = biologySection.text().trim();
  return biology;
}

export function parseOrigin($: cheerio.CheerioAPI) {
  const origin: any = {};
  const originSection = $('#Origin').parent().nextUntil('h2');
  origin.designOrigin = originSection.text().trim();
  
  const etymologySection = $('#Name_origin').parent().nextUntil('h2');
  origin.nameEtymology = etymologySection.text().trim();
  
  return origin;
}
