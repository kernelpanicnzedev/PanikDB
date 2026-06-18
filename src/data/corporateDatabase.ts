// Corporate intelligence database compiled from documented public records.
// Sources: SEC filings, DOJ settlements, EPA enforcement, court records.

export interface CorporateRecord {
  name: string;
  aliases: string[];
  hq?: string;
  founded?: string;
  ticker?: string;
  revenue?: string;
  employees?: string;
  brands: string[];
  violations: Violation[];
  totalFines: string;
  ethicsRating: 'poor' | 'concerning' | 'mixed' | 'moderate' | 'good';
}

export interface Violation {
  type: 'environmental' | 'labor' | 'consumer-fraud' | 'antitrust' | 'financial' | 'human-rights' | 'product-safety' | 'healthcare-fraud';
  agency: string;
  year: number;
  penalty?: string;
  severity: 1 | 2 | 3 | 4 | 5;
  description: string;
}

export const CORPORATE_DB: Record<string, CorporateRecord> = {
  'procter & gamble': {
    name: 'Procter & Gamble',
    aliases: ['p&g', 'procter and gamble'],
    hq: 'Cincinnati, OH, USA',
    founded: '1837',
    ticker: 'NYSE: PG',
    revenue: '$84B (FY2024)',
    employees: '107,000',
    brands: ['Tide', 'Pampers', 'Gillette', 'Oral-B', 'Crest', 'Febreze', 'Ariel', 'Pantene', 'Olay', 'Vicks', 'Bounty', 'Dawn', 'Braun', 'Always', 'Old Spice', 'Head & Shoulders', 'Herbal Essences', 'Metamucil', 'Pepto-Bismol', 'Puffs', 'Swiffer', 'NyQuil', 'DayQuil', 'Sudafed PE'],
    violations: [
      { type: 'product-safety', agency: 'CPSC/Litigation', year: 2015, severity: 3, description: 'Tide Pods product-liability suits — chemical burns to children who mistake colorful pods for candy; class action over staining of clothing.' },
      { type: 'product-safety', agency: 'Class Action', year: 2015, severity: 2, description: 'Old Spice class action alleging over 100 people suffered chemical burns from deodorant products.' },
      { type: 'consumer-fraud', agency: 'FDA/Class Actions', year: 2023, penalty: 'Pending', severity: 3, description: 'NyQuil, Sudafed PE, and other phenylephrine-based decongestants sued after FDA advisory committee unanimously concluded oral phenylephrine "works no better than a placebo."' },
    ],
    totalFines: '$100M+ (estimated litigation costs)',
    ethicsRating: 'mixed',
  },

  'unilever': {
    name: 'Unilever',
    aliases: ['unilever plc'],
    hq: 'London, UK',
    founded: '1929',
    ticker: 'NYSE: UL',
    revenue: '€60.1B',
    employees: '127,000',
    brands: ['Dove', 'Axe', 'Lifebuoy', 'Vaseline', 'Sunsilk', 'TRESemmé', 'Degree', 'Hellmann\'s', 'Knorr', 'Ben & Jerry\'s', 'Magnum', 'Cornetto', 'Lipton', 'PG Tips', 'Marmite', 'Domestos', 'Cif', 'Persil (non-US)', 'Signal', 'Surf', 'Simple', 'St. Ives', 'TIGI'],
    violations: [
      { type: 'environmental', agency: 'Indian Regulators', year: 2001, severity: 5, description: 'Hindustan Unilever operated mercury thermometer plant in Kodaikanal, India — 7.4-ton mercury dump exposed; factory shut 2001 after whistleblowers and Greenpeace. Workers settled 2016 after 15 years of litigation. Communities remain affected by mercury contamination.' },
      { type: 'human-rights', agency: 'Public/Greenpeace', year: 2008, severity: 4, description: 'Dove\'s palm-oil sourcing linked to Borneo deforestation by Greenpeace "Dove Onslaught(er)" campaign. Unilever forced to commit to sustainable palm-oil.' },
      { type: 'consumer-fraud', agency: 'Public', year: 2017, severity: 2, description: 'Dove Facebook ad appeared to show a Black woman transforming into a white woman after using product — triggered boycott. Unilever apologized: "We missed the mark."' },
    ],
    totalFines: 'Undisclosed (settlements with workers)',
    ethicsRating: 'concerning',
  },

  'nestle': {
    name: 'Nestlé',
    aliases: ['nestle', 'nestlé s.a.'],
    hq: 'Vevey, Switzerland',
    founded: '1866',
    ticker: 'SIX: NESN',
    revenue: 'CHF 93B',
    employees: '275,000',
    brands: ['Nescafé', 'Nespresso', 'KitKat', 'Maggi', 'Milo', 'Purina', 'Gerber', 'Perrier', 'S.Pellegrino', 'Häagen-Dazs', 'Toll House', 'Coffee-Mate', 'Poland Spring', 'Vittel', 'Butterfinger', 'Smarties', 'Lion Bar', 'Aero', 'After Eight'],
    violations: [
      { type: 'human-rights', agency: 'US Courts/Supreme Court', year: 2021, severity: 5, description: 'Child slavery litigation — Malian children trafficked to Ivorian cocoa farms. Nestlé USA v. Doe: Supreme Court ruled 8-1 on jurisdictional grounds without adjudicating the underlying allegations of benefiting from child slavery. Cocoa child labor at Nestlé suppliers remains documented and ongoing.' },
      { type: 'human-rights', agency: 'Channel 4 Dispatches', year: 2020, severity: 4, description: 'Nespresso: children as young as 8 found working on Guatemalan farms supplying Nespresso. Nestlé acknowledged finding child labor at three suppliers.' },
      { type: 'product-safety', agency: 'Indian FSSAI', year: 2015, penalty: '$100M lawsuit', severity: 4, description: 'Maggi instant noodles recalled nationwide in India — 9/10 samples contained MSG and lead above legal limits. Government lawsuit (ultimately dismissed). Recall depressed sales for years.' },
      { type: 'consumer-fraud', agency: 'Class Action (US)', year: 2017, severity: 3, description: 'Poland Spring brand accused of "colossal fraud" — selling "common groundwater" rather than genuine spring water.' },
    ],
    totalFines: '$100M+ (Maggi India) + ongoing litigation',
    ethicsRating: 'poor',
  },

  'johnson & johnson': {
    name: 'Johnson & Johnson',
    aliases: ['j&j', 'jnj', 'johnson and johnson', 'kenvue'],
    hq: 'New Brunswick, NJ, USA',
    founded: '1886',
    ticker: 'NYSE: JNJ',
    revenue: '$88.8B',
    employees: '130,000',
    brands: ['Tylenol', 'Band-Aid', 'Neutrogena', 'Listerine', 'Johnson\'s Baby', 'Aveeno', 'Benadryl', 'Imodium', 'Motrin', 'Pepcid', 'Nicorette', 'Nicotinell', 'Rogaine'],
    violations: [
      { type: 'product-safety', agency: 'Federal/State Courts', year: 2024, penalty: '$700M (state AG settlement) + $966M verdict', severity: 5, description: 'Talc/baby powder cancer: 63,000+ families suing alleging asbestos contamination in Johnson\'s Baby Powder caused ovarian cancer and mesothelioma. Multiple bankruptcy "Texas Two-Step" attempts failed. $700M paid to 42 states\' AGs. $966M verdict for one family (2025).' },
      { type: 'healthcare-fraud', agency: 'DOJ', year: 2013, penalty: '$2.2B', severity: 4, description: 'Risperdal off-label marketing — illegal promotion for unapproved uses including dementia in elderly and behavioral disorders in children. Criminal fines plus civil penalties.' },
      { type: 'healthcare-fraud', agency: 'Multi-state Settlement', year: 2022, penalty: '$5B (J&J portion)', severity: 4, description: 'Opioid crisis: J&J paid up to $5B over 9 years as part of $26B nationwide settlement involving 46 states for its role as opioid manufacturer.' },
      { type: 'consumer-fraud', agency: 'Texas AG/Kenvue litigation', year: 2025, severity: 3, description: 'Tylenol/acetaminophen: Texas AG sued Kenvue (J&J consumer spinoff) alleging failure to warn pregnant consumers of alleged link between prenatal Tylenol use and autism/ADHD. Stock fell ~10%.' },
    ],
    totalFines: '$8B+ (documented settlements)',
    ethicsRating: 'poor',
  },

  'bayer': {
    name: 'Bayer AG',
    aliases: ['bayer', 'bayer ag', 'monsanto'],
    hq: 'Leverkusen, Germany',
    founded: '1863',
    ticker: 'XETRA: BAYN',
    revenue: '€47.6B',
    employees: '100,000',
    brands: ['Aspirin', 'Aleve', 'Claritin', 'Coppertone', 'Dr. Scholl\'s', 'MiraLAX', 'One A Day', 'Phillips\' Milk of Magnesia', 'Roundup', 'Alka-Seltzer'],
    violations: [
      { type: 'product-safety', agency: 'US Courts/Global', year: 2018, penalty: '$11B+ (ongoing)', severity: 5, description: 'Roundup (glyphosate) cancer litigation: ~100,000 lawsuits alleging herbicide causes non-Hodgkin lymphoma. $11B+ paid in settlements. Feb 2026: proposed $7.25B additional settlement. Individual verdicts include $78M (Pennsylvania, 2024). 61,000+ cases still pending.' },
      { type: 'environmental', agency: 'Municipal Courts', year: 2020, penalty: '$650M', severity: 4, description: 'PCB (polychlorinated biphenyls) contamination: Monsanto manufactured PCBs for decades before 1979 ban. $650M settlement with ~2,500 municipalities over waterway contamination. Ongoing school district and individual litigation.' },
    ],
    totalFines: '$11B+ (Roundup) + $650M+ (PCBs)',
    ethicsRating: 'poor',
  },

  'reckitt': {
    name: 'Reckitt Benckiser Group',
    aliases: ['reckitt', 'reckitt benckiser', 'rb'],
    hq: 'Slough, UK',
    founded: '1938',
    ticker: 'LSE: RKT',
    revenue: '£14.6B',
    employees: '43,000',
    brands: ['Lysol', 'Dettol', 'Finish', 'Mucinex', 'Durex', 'Scholl', 'Strepsils', 'Nurofen', 'Clearasil', 'Veet', 'Harpic', 'Enfamil (via Mead Johnson)'],
    violations: [
      { type: 'healthcare-fraud', agency: 'DOJ', year: 2019, penalty: '$1.4B', severity: 5, description: 'Suboxone (Indivior subsidiary): fraudulently marketed buprenorphine film as safer and less abusable than competing opioid formulations. $1.4B settlement — the largest opioid-related corporate recovery before Purdue. $700M criminal + $500M civil.' },
      { type: 'product-safety', agency: 'Courts (US)', year: 2024, penalty: '$60M verdict (and counting)', severity: 5, description: 'NEC baby formula: Mead Johnson\'s Enfamil linked to necrotizing enterocolitis (NEC) in premature infants. Illinois jury awarded $60M (March 2024). Combined verdicts against Mead Johnson and Abbott exceed $555M.' },
    ],
    totalFines: '$1.4B+ (Suboxone) + $300M+ (NEC)',
    ethicsRating: 'poor',
  },

  'coca-cola': {
    name: 'The Coca-Cola Company',
    aliases: ['coca cola', 'coke', 'ccep'],
    hq: 'Atlanta, GA, USA',
    founded: '1892',
    ticker: 'NYSE: KO',
    revenue: '$46B',
    employees: '79,000',
    brands: ['Coca-Cola', 'Diet Coke', 'Coke Zero', 'Sprite', 'Fanta', 'Minute Maid', 'Powerade', 'Dasani', 'Smartwater', 'Topo Chico', 'Schweppes', 'Fuze Tea', 'Honest Tea', 'Costa Coffee', 'Vitaminwater'],
    violations: [
      { type: 'environmental', agency: 'Break Free From Plastic', year: 2023, severity: 5, description: 'World\'s #1 corporate plastic polluter for 6+ consecutive years per Break Free From Plastic annual audit. Sells 100B+ single-use plastic bottles/year. Plastic use projected to reach ~91B pounds annually.' },
      { type: 'environmental', agency: 'Kerala State Government', year: 2004, penalty: '$47M (sought)', severity: 4, description: 'Plachimada bottling plant shut 2004 after severe groundwater depletion and contamination. Kerala enacted special legislation to sue Coca-Cola. Indian traders organized boycotts.' },
      { type: 'product-safety', agency: 'Consumer Reports', year: 2020, severity: 3, description: 'Topo Chico sparkling water: 9.76 ppt PFAS detected — highest of any bottled water tested. Levels reduced but remain detectable.' },
    ],
    totalFines: 'Regulatory actions, no major monetary settlement',
    ethicsRating: 'concerning',
  },

  'pepsico': {
    name: 'PepsiCo',
    aliases: ['pepsi', 'pepsico inc'],
    hq: 'Purchase, NY, USA',
    founded: '1898',
    ticker: 'NASDAQ: PEP',
    revenue: '$91B',
    employees: '318,000',
    brands: ['Pepsi', 'Diet Pepsi', 'Mountain Dew', 'Gatorade', 'Tropicana', 'Lay\'s', 'Doritos', 'Cheetos', 'Fritos', 'Tostitos', 'Sun Chips', 'Quaker', 'Life Cereal', 'Lipton (partnership)', 'Bubly', '7UP (non-US)', 'Mirinda'],
    violations: [
      { type: 'environmental', agency: 'NY Attorney General', year: 2023, severity: 3, description: 'First-of-its-kind lawsuit: NY AG accused PepsiCo of "harming the public and the environment" with single-use plastic packaging along Buffalo River. Dismissed 2024.' },
      { type: 'consumer-fraud', agency: 'Class Action', year: 2023, severity: 2, description: 'Gatorade class action challenging claim that the sports drink "hydrates better than water" as misleading.' },
    ],
    totalFines: 'Minimal (most cases dismissed)',
    ethicsRating: 'mixed',
  },

  'kraft heinz': {
    name: 'The Kraft Heinz Company',
    aliases: ['kraft', 'heinz', 'kraft heinz', 'khe'],
    hq: 'Chicago, IL, USA',
    founded: '2015',
    ticker: 'NASDAQ: KHC',
    revenue: '$26B',
    employees: '37,000',
    brands: ['Heinz', 'Kraft', 'Oscar Mayer', 'Philadelphia', 'Lunchables', 'Jell-O', 'Kool-Aid', 'Velveeta', 'Maxwell House', 'Planters', 'Capri Sun'],
    violations: [
      { type: 'financial', agency: 'SEC', year: 2021, penalty: '$62M', severity: 3, description: 'SEC charged Kraft Heinz and two former executives with years-long accounting scheme — inflating cost-cutting figures. $62M penalty, individual executive sanctions.' },
      { type: 'product-safety', agency: 'Class Action/Consumer Reports', year: 2024, severity: 4, description: 'Lunchables meal kits found to contain elevated levels of lead and cadmium in Consumer Reports testing. Class action filed alleging unsafe heavy metals in products heavily marketed to children and school cafeterias.' },
    ],
    totalFines: '$62M (SEC) + ongoing Lunchables litigation',
    ethicsRating: 'concerning',
  },

  'tyson foods': {
    name: 'Tyson Foods',
    aliases: ['tyson'],
    hq: 'Springdale, AR, USA',
    founded: '1935',
    ticker: 'NYSE: TSN',
    revenue: '$53B',
    employees: '139,000',
    brands: ['Tyson', 'Jimmy Dean', 'Hillshire Farm', 'Ball Park', 'Sara Lee', 'State Fair', 'Aidells', 'Wright'],
    violations: [
      { type: 'antitrust', agency: 'DOJ/Class Actions', year: 2021, penalty: '$221.5M (chicken) + $85M (pork) + $82.5M (beef)', severity: 4, description: 'Antitrust settlements: chicken price-fixing and wage-suppression ($221.5M, 2021), pork price-fixing ($85M), beef price-fixing ($82.5M to direct purchasers, Jan 2026).' },
      { type: 'labor', agency: 'ProPublica/Courts', year: 2020, severity: 5, description: 'COVID-19 at Waterloo, Iowa plant: 1,500-1,800 of 2,800 workers infected, at least 8 died. Managers allegedly organized betting pool on how many workers would get COVID while infected employees were pressured to keep working. Iowa Supreme Court (May 2025): executives can be held personally liable.' },
    ],
    totalFines: '$389M+ (antitrust settlements)',
    ethicsRating: 'poor',
  },

  'mondelez': {
    name: 'Mondelēz International',
    aliases: ['mondelez', 'mondelēz', 'kraft foods'],
    hq: 'Chicago, IL, USA',
    founded: '2012',
    ticker: 'NASDAQ: MDLZ',
    revenue: '$36B',
    employees: '91,000',
    brands: ['Oreo', 'Cadbury', 'Milka', 'Toblerone', 'Ritz', 'Chips Ahoy!', 'Trident', 'Halls', 'Belvita', 'LU', 'Nabisco', 'Sour Patch Kids', 'Triscuit', 'Wheat Thins', 'Club Social'],
    violations: [
      { type: 'human-rights', agency: 'B4Ukraine/Guardian', year: 2022, severity: 4, description: 'Continued ~$1B annual Russian sales despite Ukraine invasion. B4Ukraine campaign; protests to revoke Cadbury\'s Royal Warrant. Appeals to King Charles III.' },
      { type: 'human-rights', agency: 'Class Action/Guardian', year: 2022, severity: 4, description: 'Child labor and deforestation in Ghanaian cocoa farms reported. Class action contradicting "Cocoa Life" sustainability program claims on packaging.' },
    ],
    totalFines: 'Reputational/ongoing litigation',
    ethicsRating: 'concerning',
  },

  'mars': {
    name: 'Mars, Incorporated',
    aliases: ['mars inc', 'mars incorporated'],
    hq: 'McLean, VA, USA',
    founded: '1911',
    revenue: '$50B+',
    employees: '150,000',
    brands: ['M&M\'s', 'Snickers', 'Twix', 'Milky Way', 'Bounty', 'Skittles', 'Starburst', 'Juicy Fruit', 'Wrigley\'s', 'Extra', 'Orbit', 'Pedigree', 'Whiskas', 'Iams', 'Royal Canin', 'Cesar', 'Nutro', 'Ben\'s Original'],
    violations: [
      { type: 'product-safety', agency: 'California Courts/EU', year: 2022, severity: 3, description: 'Skittles class action: California lawsuit alleged Skittles "unfit for human consumption" due to titanium dioxide — banned in EU in 2022. Mars confirmed removal from US Skittles in 2025.' },
      { type: 'human-rights', agency: 'US Courts/Global', year: 2021, severity: 4, description: 'Co-defendant in cocoa child-slavery litigation (Nestlé USA, Inc. v. Doe) — alleged to benefit from child trafficking on West African cocoa farms. Case dismissed on jurisdictional grounds without adjudicating merits.' },
    ],
    totalFines: 'Minimal (most cases dismissed)',
    ethicsRating: 'mixed',
  },

  'loreal': {
    name: "L'Oréal",
    aliases: ["l'oreal", 'loreal', "l'oréal"],
    hq: 'Clichy, France',
    founded: '1909',
    ticker: 'EPA: OR',
    revenue: '€42.2B',
    employees: '89,000',
    brands: ["L'Oréal Paris", 'Maybelline', 'Garnier', 'NYX', 'Lancôme', 'Kiehl\'s', 'Urban Decay', 'Redken', 'Matrix', 'Kerastase', 'Vichy', 'La Roche-Posay', 'CeraVe', 'Valentino Beauty', 'Ralph Lauren Fragrances'],
    violations: [
      { type: 'product-safety', agency: 'Federal MDL/State Courts', year: 2022, penalty: 'Trials expected 2026', severity: 5, description: 'Hair relaxer cancer: 11,500+ lawsuits alleging lye-based chemical relaxers — heavily marketed to Black women, often from childhood — caused uterine, ovarian, and endometrial cancers. 2022 NIH study found ~double the uterine cancer risk among frequent users. Federal MDL certified 2025.' },
    ],
    totalFines: 'Pending (trials expected 2026)',
    ethicsRating: 'concerning',
  },

  'jbs': {
    name: 'JBS S.A.',
    aliases: ['jbs', "pilgrim's pride"],
    hq: 'São Paulo, Brazil',
    founded: '1953',
    ticker: 'BVMF: JBSS3',
    revenue: '$73B',
    employees: '270,000',
    brands: ["Pilgrim's", 'Swift', 'Friboi', 'Seara', 'Primo', '1855', 'Plumrose', 'Moy Park'],
    violations: [
      { type: 'financial', agency: 'SEC/DOJ', year: 2020, penalty: '$256M+ (FCPA)', severity: 5, description: 'FCPA bribery: J&F Investimentos and controlling Batista brothers charged with paying tens of millions in bribes to Brazilian officials. Combined penalties exceeded $280M.' },
      { type: 'environmental', agency: 'Brazilian IBAMA + NY AG', year: 2024, penalty: '$64M (Brazil) + $1.1M (NY)', severity: 4, description: 'Amazon deforestation: ~$64M in Brazilian fines for buying cattle from illegally deforested Amazon land. Greenwashing: NY AG sued JBS for fraudulent "net zero by 2040" claims while planning production expansion. Settled $1.1M (2025).' },
    ],
    totalFines: '$280M+ (FCPA) + $65M+ (environmental)',
    ethicsRating: 'poor',
  },

  'ferrero': {
    name: 'Ferrero Group',
    aliases: ['ferrero'],
    hq: 'Alba, Italy',
    founded: '1946',
    revenue: '€17.2B',
    employees: '47,000',
    brands: ['Nutella', 'Ferrero Rocher', 'Kinder', 'Kinder Surprise', 'Kinder Bueno', 'Kinder Joy', 'Raffaello', 'Tic Tac', 'Mon Chéri', 'Thorntons', 'Butterfinger', 'Baby Ruth'],
    violations: [
      { type: 'product-safety', agency: 'WHO/EU Regulators', year: 2022, severity: 4, description: 'Kinder salmonella outbreak: Ferrero\'s Arlon, Belgium plant implicated in multi-country Salmonella Typhimurium outbreak. WHO documented cases in 113+ countries. Kinder Surprise, Kinder Mini Eggs, Kinder Schoko-Bons recalled. Contamination known December 2021-January 2022 but continued sale. Salmonella detected at same site again in 2023.' },
    ],
    totalFines: 'Recall costs + ongoing litigation',
    ethicsRating: 'mixed',
  },

  'colgate-palmolive': {
    name: 'Colgate-Palmolive',
    aliases: ['colgate'],
    hq: 'New York, NY, USA',
    founded: '1806',
    ticker: 'NYSE: CL',
    revenue: '$20B',
    employees: '34,000',
    brands: ["Colgate", "Palmolive", "Speed Stick", "Softsoap", "Tom's of Maine", "Ajax", "Murphy Oil Soap", "Hill's Science Diet", "Hill's Prescription Diet"],
    violations: [
      { type: 'product-safety', agency: 'FDA/MDL', year: 2019, penalty: '$12.5M settlement', severity: 4, description: "Hill's Pet Nutrition (owned by Colgate-Palmolive): 675,000 cases of Science Diet and Prescription Diet canned dog food recalled for dangerously elevated vitamin D levels. Pet deaths and illnesses reported. Seven class actions, FDA warning letter." },
    ],
    totalFines: '$12.5M (Hill\'s pet food)',
    ethicsRating: 'moderate',
  },

  'clorox': {
    name: 'The Clorox Company',
    aliases: ['clorox'],
    hq: 'Oakland, CA, USA',
    founded: '1913',
    ticker: 'NYSE: CLX',
    revenue: '$7.4B',
    employees: '8,700',
    brands: ["Clorox", "Pine-Sol", "Liquid-Plumr", "Formula 409", "Burt's Bees", "Brita", "Glad", "Kingsford", "Hidden Valley", "KC Masterpiece"],
    violations: [
      { type: 'product-safety', agency: 'CPSC', year: 2026, penalty: '$14.15M', severity: 3, description: "Pine-Sol Scented Multi-Surface: Clorox failed to immediately report bacterial hazard to CPSC. $14.15M civil penalty — a serious CPSC reporting violation." },
      { type: 'consumer-fraud', agency: 'Cyberattack Disclosure', year: 2023, severity: 3, description: "Scattered Spider cyberattack crippled production for months, causing widespread shortages of Pine-Sol, Brita, Glad, Burt's Bees. Clorox's 2030 plastic/waste reduction goals derailed." },
    ],
    totalFines: '$14.15M (CPSC)',
    ethicsRating: 'moderate',
  },

  'henkel': {
    name: 'Henkel AG',
    aliases: ['henkel'],
    hq: 'Düsseldorf, Germany',
    founded: '1876',
    ticker: 'XETRA: HENKY',
    revenue: '€21.4B',
    employees: '50,000',
    brands: ['Persil', 'Schwarzkopf', 'Right Guard', 'Dial', 'Purex', 'Snuggle', 'all (detergent)', 'Bref', 'Loctite', 'Pritt', 'Sellotape', 'Syoss'],
    violations: [
      { type: 'consumer-fraud', agency: 'Class Action', year: 2024, severity: 2, description: 'Persil Pro Clean class action: "64 loads" claim on 100-fl-oz bottles alleged to be misleading.' },
      { type: 'product-safety', agency: 'Class Action Settlement', year: 2023, penalty: '$1.95M', severity: 2, description: 'Right Guard body spray: benzene contamination class action settlement.' },
    ],
    totalFines: '$1.95M+',
    ethicsRating: 'moderate',
  },

  'beiersdorf': {
    name: 'Beiersdorf AG',
    aliases: ['beiersdorf'],
    hq: 'Hamburg, Germany',
    founded: '1882',
    ticker: 'XETRA: BEI',
    revenue: '€9.5B',
    employees: '21,000',
    brands: ['NIVEA', 'Eucerin', 'La Prairie', 'Hansaplast', 'Labello', 'Coppertone', '8x4', 'Aquaphor', 'Florena'],
    violations: [
      { type: 'product-safety', agency: 'FDA/Class Action', year: 2021, penalty: '$2.3M settlement', severity: 3, description: 'Coppertone sunscreen: benzene contamination detected by independent testing (Valisure). Five products recalled. $2.3M class action settlement with 18 months ongoing benzene testing requirement.' },
    ],
    totalFines: '$2.3M (Coppertone benzene)',
    ethicsRating: 'moderate',
  },

  'amazon': {
    name: 'Amazon.com, Inc.',
    aliases: ['amazon', 'amazon inc', 'whole foods'],
    hq: 'Seattle, WA, USA',
    founded: '1994',
    ticker: 'NASDAQ: AMZN',
    revenue: '$575B',
    employees: '1,500,000',
    brands: ['Amazon', 'Amazon Fresh', 'Amazon Basics', 'Whole Foods Market', 'Alexa', 'Ring', 'Kindle', 'Audible', 'Zappos', 'IMDb'],
    violations: [
      { type: 'labor', agency: 'OSHA/DOJ', year: 2024, penalty: '$145,000', severity: 4, description: 'OSHA: largest ergonomics settlement of its kind — corporate-wide ergonomic measures required to reduce warehouse worker injuries. Earlier citations at Aurora, Nampa, Castleton facilities for "operating methods creating hazardous work" environments.' },
    ],
    totalFines: '$145,000 (OSHA) — nominal given scale',
    ethicsRating: 'concerning',
  },

  'walmart': {
    name: 'Walmart Inc.',
    aliases: ['walmart', 'wal-mart', "sam's club"],
    hq: 'Bentonville, AR, USA',
    founded: '1962',
    ticker: 'NYSE: WMT',
    revenue: '$648B',
    employees: '2,100,000',
    brands: ['Walmart', "Sam's Club", 'Vudu', 'Bonobos', 'Hayneedle', 'Jet.com'],
    violations: [
      { type: 'healthcare-fraud', agency: 'Court Settlement', year: 2024, penalty: '$123M (shareholder derivative)', severity: 3, description: 'Opioid crisis: Walmart named in nationwide opioid litigation. $123M shareholder derivative settlement over opioid-oversight failures.' },
    ],
    totalFines: '$123M+',
    ethicsRating: 'mixed',
  },

  'danone': {
    name: 'Danone S.A.',
    aliases: ['danone', 'dannon'],
    hq: 'Paris, France',
    founded: '1919',
    ticker: 'EPA: BN',
    revenue: '€27.7B',
    employees: '100,000',
    brands: ['Activia', 'Actimel', 'Evian', 'Volvic', 'Badoit', 'Danette', 'Oikos', 'Two Good', 'Horizon Organic', 'Silk', 'Alpro', 'Nutricia', 'Aptamil', 'Cow & Gate'],
    violations: [
      { type: 'consumer-fraud', agency: 'FTC', year: 2010, severity: 3, description: 'Activia probiotic yogurt: FTC case — Dannon agreed to drop "clinically proven" health claims about digestive and immune benefits alleged to be "exaggerated."' },
      { type: 'product-safety', agency: 'Chinese/International Authorities', year: 2008, severity: 5, description: '2008 Chinese melamine crisis: Danone\'s joint-venture Dumex infant formula investigated for melamine contamination — scandal sickened ~300,000 babies and killed at least 6. Two participants in broader scandal executed by China.' },
    ],
    totalFines: 'Regulatory action (FTC)',
    ethicsRating: 'mixed',
  },

  'abbvie': {
    name: 'AbbVie Inc.',
    aliases: ['abbvie'],
    hq: 'North Chicago, IL, USA',
    founded: '2013',
    ticker: 'NYSE: ABBV',
    revenue: '$56B',
    employees: '50,000',
    brands: ['Humira', 'Skyrizi', 'Rinvoq', 'Imbruvica', 'Venclexta', 'Botox', 'Juvederm', 'Latisse', 'Restasis'],
    violations: [
      { type: 'antitrust', agency: 'House Oversight Committee/FTC', year: 2021, severity: 4, description: 'Humira patent thicket: Congressional investigation concluded AbbVie filed ~250 patents around Humira to delay biosimilar entry for two decades, extending monopoly pricing. EU foundation sued over "excess profits translating to 14,000 lost years of healthy life."' },
    ],
    totalFines: 'FTC case withdrawn; EU litigation ongoing',
    ethicsRating: 'concerning',
  },

  'anheuser-busch inbev': {
    name: 'Anheuser-Busch InBev',
    aliases: ['ab inbev', 'anheuser busch', 'abinbev'],
    hq: 'Leuven, Belgium',
    founded: '2008',
    ticker: 'NYSE: BUD',
    revenue: '$59.4B',
    employees: '86,000',
    brands: ['Budweiser', 'Bud Light', 'Stella Artois', 'Corona', 'Beck\'s', 'Hoegaarden', 'Leffe', 'Brahma', 'Modelo (US license)', 'Michelob Ultra', 'Natural Light', 'Busch'],
    violations: [
      { type: 'consumer-fraud', agency: 'Market/Boycott', year: 2023, penalty: '$1.4B+ in lost sales', severity: 3, description: 'Bud Light crisis: brief promotion with transgender influencer Dylan Mulvaney triggered right-wing boycott. 17.3% US revenue decline Q4 2023; 9.5% annual decline. Modelo overtook Bud Light as #1 US beer. Internal staff described response as "panic and rash decision-making."' },
    ],
    totalFines: '$1.4B+ (estimated sales loss)',
    ethicsRating: 'mixed',
  },

  'pfizer': {
    name: 'Pfizer Inc.',
    aliases: ['pfizer'],
    hq: 'New York, NY, USA',
    founded: '1849',
    ticker: 'NYSE: PFE',
    revenue: '$58.5B',
    employees: '83,000',
    brands: ['Advil', 'Centrum', 'Caltrate', 'Chapstick', 'Preparation H', 'Robitussin', 'Nexium 24HR', 'Theraflu', 'Emergen-C'],
    violations: [
      { type: 'healthcare-fraud', agency: 'DOJ', year: 2009, penalty: '$2.3B', severity: 5, description: 'Largest healthcare fraud case in US history at the time: fraudulent marketing of Bextra, Geodon, Zyvox, Lyrica. $1.195B criminal fine + civil penalties. Covered off-label promotion of arthritis drug Bextra (later pulled from market) and kickbacks on Aricept, Celebrex, Lipitor, Norvasc.' },
      { type: 'antitrust', agency: 'Federal Courts', year: 2024, penalty: '$50M direct purchaser + $345M consumer', severity: 3, description: 'EpiPen price-gouging: price rose from ~$100 (2008) to $600+ (2016). $50M Pfizer settlement (direct purchasers, 2024) + $345M consumer class action. Mylan separately paid $465M (Medicaid fraud).' },
    ],
    totalFines: '$2.3B+ (healthcare fraud) + $395M (EpiPen)',
    ethicsRating: 'concerning',
  },
};

// Brand-to-company lookup index
export const BRAND_TO_COMPANY: Record<string, string> = {};

Object.entries(CORPORATE_DB).forEach(([companyKey, record]) => {
  record.brands.forEach(brand => {
    BRAND_TO_COMPANY[brand.toLowerCase()] = companyKey;
  });
  record.aliases.forEach(alias => {
    BRAND_TO_COMPANY[alias.toLowerCase()] = companyKey;
  });
  BRAND_TO_COMPANY[record.name.toLowerCase()] = companyKey;
});

export function lookupCorporateRecord(brandOrCompany: string): CorporateRecord | null {
  const key = brandOrCompany.toLowerCase().trim();
  const companyKey = BRAND_TO_COMPANY[key];
  if (companyKey) return CORPORATE_DB[companyKey];

  // Partial match
  for (const [dbKey, record] of Object.entries(BRAND_TO_COMPANY)) {
    if (key.includes(dbKey) || dbKey.includes(key)) {
      return CORPORATE_DB[record];
    }
  }
  return null;
}

export function lookupCompanyKey(brandOrCompany: string): string | undefined {
  const key = brandOrCompany.toLowerCase().trim();
  if (!key) return undefined;
  if (BRAND_TO_COMPANY[key]) return BRAND_TO_COMPANY[key];
  for (const [dbKey, companyKey] of Object.entries(BRAND_TO_COMPANY)) {
    if (key.includes(dbKey) || dbKey.includes(key)) return companyKey;
  }
  return undefined;
}
