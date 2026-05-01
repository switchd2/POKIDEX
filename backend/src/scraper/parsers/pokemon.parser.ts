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

  return data;
}
