import * as cheerio from 'cheerio';

export function parseLearnset($: cheerio.CheerioAPI) {
  const learnset: any = {
    levelUp: [],
    tm: [],
    egg: [],
    tutor: []
  };

  // Level up moves
  const levelUpTable = $('h3 span:contains("By leveling up")').parent().nextAll('table').first();
  levelUpTable.find('tr').slice(1).each((_, el) => {
    const level = $(el).find('td').first().text().trim();
    const move = $(el).find('td').eq(1).text().trim();
    if (move && level) {
      learnset.levelUp.push({ level: parseInt(level, 10) || 0, move });
    }
  });

  // TM moves
  const tmTable = $('h3 span:contains("By TM")').parent().nextAll('table').first();
  tmTable.find('tr').slice(1).each((_, el) => {
    const tm = $(el).find('td').first().text().trim();
    const move = $(el).find('td').eq(1).text().trim();
    if (move) {
      learnset.tm.push({ tm, move });
    }
  });

  return learnset;
}
