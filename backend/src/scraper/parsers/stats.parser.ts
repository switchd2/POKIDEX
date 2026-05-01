import * as cheerio from 'cheerio';

export function parseBaseStats($: cheerio.CheerioAPI) {
  const stats: any = {};
  const statsTable = $('h3 span:contains("Base stats")').parent().nextAll('table').first();
  
  const statNames = ['hp', 'attack', 'defense', 'sp_atk', 'sp_def', 'speed'];
  
  statsTable.find('tr').each((i, el) => {
    const label = $(el).find('th').text().trim().toLowerCase();
    if (statNames.includes(label.replace(' ', '_').replace('.', ''))) {
      const val = parseInt($(el).find('div[style*="width"]').first().parent().text().trim(), 10);
      stats[label.replace(' ', '_').replace('.', '')] = val;
    }
  });

  return stats;
}
