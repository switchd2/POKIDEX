import * as cheerio from 'cheerio';

export function parseEvolutionChain($: cheerio.CheerioAPI) {
  const evolution: any = {
    chain: []
  };

  const evoTable = $('h3 span:contains("Evolution")').parent().nextAll('table').first();
  evoTable.find('td').each((_, el) => {
    const name = $(el).find('span[style*="font-weight:bold"] a').text().trim();
    if (name) {
      evolution.chain.push({ species: name });
    }
  });

  return evolution;
}
