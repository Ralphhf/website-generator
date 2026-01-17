// Marketing Library - Agency-Grade Ad Creation System
// Industry-specific prompts, audiences, copy frameworks, and best practices

export interface IndustryProfile {
  id: string
  name: string
  keywords: string[] // For matching business types
  audience: {
    primary: string
    demographics: string
    psychographics: string
    painPoints: string[]
    desires: string[]
  }
  visualStyle: {
    mood: string
    colors: string
    lighting: string
    subjects: string[]
    avoid: string[]
  }
  copyFrameworks: {
    headlines: string[]
    hooks: string[]
    ctas: string[]
    hashtags: string[]
  }
  platformStrategy: {
    facebook: { focus: string; format: string; tone: string }
    instagram: { focus: string; format: string; tone: string }
    youtube: { focus: string; format: string; tone: string }
    tiktok: { focus: string; format: string; tone: string }
  }
  // Audience Targeting Data
  targeting: {
    facebook: {
      ageRange: { min: number; max: number }
      genders: ('all' | 'male' | 'female')[]
      interests: string[]
      behaviors: string[]
      excludeInterests: string[]
      customAudiences: string[]
    }
    google: {
      searchKeywords: string[]
      negativeKeywords: string[]
      displayTopics: string[]
      inMarketAudiences: string[]
      affinity: string[]
    }
    tiktok: {
      ageRange: { min: number; max: number }
      interests: string[]
      behaviors: string[]
      creatorCategories: string[]
    }
    instagram: {
      ageRange: { min: number; max: number }
      interests: string[]
      behaviors: string[]
    }
    youtube: {
      topics: string[]
      placements: string[]
      keywords: string[]
      inMarketAudiences: string[]
    }
    general: {
      bestDays: string[]
      bestTimes: string[]
      seasonality: string
      budgetRange: { min: number; max: number; currency: string }
    }
  }
}

export const INDUSTRY_PROFILES: IndustryProfile[] = [
  // HOME SERVICES
  {
    id: 'plumbing',
    name: 'Plumbing Services',
    keywords: ['plumber', 'plumbing', 'drain', 'pipe', 'water heater', 'sewer'],
    audience: {
      primary: 'Homeowners 30-65 experiencing water/plumbing emergencies or planning upgrades',
      demographics: 'Homeowners, median income $60K+, suburban and urban areas',
      psychographics: 'Value reliability, hate uncertainty, want problems fixed fast and right',
      painPoints: ['Emergency leaks causing damage', 'Fear of being overcharged', 'Unreliable contractors who dont show up', 'Not knowing if repair is done right'],
      desires: ['Fast response time', 'Upfront pricing', 'Licensed and insured peace of mind', 'Long-term fix not a bandaid'],
    },
    visualStyle: {
      mood: 'Professional, trustworthy, clean, efficient',
      colors: 'Blue (trust), white (clean), orange or yellow accents (urgency/energy)',
      lighting: 'Bright, clean, professional - shows quality workmanship',
      subjects: ['Clean uniformed technician', 'Before/after pipe repairs', 'Modern equipment', 'Happy relieved homeowner', 'Pristine bathroom/kitchen'],
      avoid: ['Dirty/messy work areas', 'Unprofessional appearance', 'Stock photos that look fake', 'Overly staged scenes'],
    },
    copyFrameworks: {
      headlines: [
        '24/7 Emergency Plumbing - We Answer When Others Dont',
        'Upfront Pricing. No Surprises. Guaranteed.',
        'Your Neighbors Trust Us. You Will Too.',
        'Licensed Plumbers Who Show Up On Time',
        'Stop the Leak Before It Stops Your Life',
      ],
      hooks: [
        'That drip is costing you $X/month...',
        'Emergency at 2am? We answer.',
        'Tired of plumbers who dont show up?',
        'Before you call another plumber, read this...',
        'The #1 mistake homeowners make with leaks',
      ],
      ctas: [
        'Call Now - Free Estimate',
        'Book Online in 60 Seconds',
        'Get Your Free Quote',
        'Schedule Same-Day Service',
        'Chat With a Plumber Now',
      ],
      hashtags: ['#plumber', '#plumbing', '#emergencyplumber', '#homerepair', '#fixitright', '#localplumber', '#24hourplumber'],
    },
    platformStrategy: {
      facebook: { focus: 'Trust and reliability', format: 'Before/after carousels, video testimonials', tone: 'Professional, reassuring' },
      instagram: { focus: 'Quality craftsmanship', format: 'Reels showing satisfying repairs, clean results', tone: 'Confident, skilled' },
      youtube: { focus: 'Education and expertise', format: 'How-to tips, common problem explanations', tone: 'Helpful expert' },
      tiktok: { focus: 'Satisfying transformations', format: 'Quick before/after reveals, oddly satisfying drain cleaning', tone: 'Entertaining, relatable' },
    },
    targeting: {
      facebook: {
        ageRange: { min: 30, max: 65 },
        genders: ['all'],
        interests: ['Home improvement', 'DIY', 'Homeownership', 'Home maintenance', 'House & Garden', 'Home repair'],
        behaviors: ['Homeowners', 'Likely to move', 'Recently moved', 'Home improvement enthusiasts'],
        excludeInterests: ['Renters', 'Apartment living', 'Student housing'],
        customAudiences: ['Past customers', 'Website visitors', 'Engaged with plumbing content'],
      },
      google: {
        searchKeywords: ['plumber near me', 'emergency plumber', 'plumbing repair', 'water heater repair', 'drain cleaning', 'leak repair', 'toilet repair', 'pipe repair', '24 hour plumber', 'licensed plumber'],
        negativeKeywords: ['plumber jobs', 'plumbing courses', 'DIY plumbing', 'plumber salary', 'how to become a plumber', 'plumbing supplies wholesale'],
        displayTopics: ['Home & Garden', 'Home Improvement', 'Home Services'],
        inMarketAudiences: ['Plumbing services', 'Home services', 'Home maintenance & repair'],
        affinity: ['Home & Garden Enthusiasts', 'Do-It-Yourselfers', 'Home Improvement Enthusiasts'],
      },
      tiktok: {
        ageRange: { min: 25, max: 45 },
        interests: ['Home improvement', 'DIY', 'Homeowner tips', 'Satisfying videos'],
        behaviors: ['Engaged with home content', 'Homeowners'],
        creatorCategories: ['Home & Garden', 'DIY & Life Hacks'],
      },
      instagram: {
        ageRange: { min: 28, max: 55 },
        interests: ['Home decor', 'Home improvement', 'Interior design', 'House renovation'],
        behaviors: ['Homeowners', 'Engaged shoppers', 'Home improvement enthusiasts'],
      },
      youtube: {
        topics: ['Home & Garden', 'Home Improvement'],
        placements: ['Home repair channels', 'DIY channels', 'Home improvement shows'],
        keywords: ['plumbing repair', 'fix leak', 'water heater', 'drain cleaning', 'home repair'],
        inMarketAudiences: ['Home services', 'Plumbing services'],
      },
      general: {
        bestDays: ['Monday', 'Tuesday', 'Wednesday'],
        bestTimes: ['7am-9am', '12pm-2pm', '6pm-9pm'],
        seasonality: 'Year-round with spikes in winter (frozen pipes) and spring (water heater issues)',
        budgetRange: { min: 20, max: 50, currency: 'USD' },
      },
    },
  },

  {
    id: 'hvac',
    name: 'HVAC & Air Conditioning',
    keywords: ['hvac', 'air conditioning', 'ac', 'heating', 'furnace', 'air quality', 'ductwork'],
    audience: {
      primary: 'Homeowners 35-65 dealing with comfort issues or equipment replacement',
      demographics: 'Homeowners with systems 8+ years old, income $70K+',
      psychographics: 'Value comfort, energy efficiency, worry about big repair bills',
      painPoints: ['Uncomfortable temperatures', 'High energy bills', 'Fear of complete system failure', 'Uncertainty about repair vs replace'],
      desires: ['Consistent comfort', 'Lower utility bills', 'Reliable equipment', 'Honest assessment'],
    },
    visualStyle: {
      mood: 'Cool, comfortable, professional, modern',
      colors: 'Blue (cool/trust), green (efficiency), white (clean air)',
      lighting: 'Bright, airy, comfortable home settings',
      subjects: ['Happy family in comfortable home', 'Modern HVAC equipment', 'Technician explaining to homeowner', 'Energy efficiency graphics', 'Clean air vents'],
      avoid: ['Sweating/uncomfortable people', 'Old rusty equipment', 'Dark cramped spaces'],
    },
    copyFrameworks: {
      headlines: [
        'Cool Comfort. Fair Prices. Guaranteed.',
        'Is Your AC Working Harder Than It Should?',
        'Save Up to 30% on Energy Bills',
        'Comfort You Can Count On',
        'Your Home Comfort Experts Since [Year]',
      ],
      hooks: [
        'Your AC is trying to tell you something...',
        'This one setting can cut your bill by 20%',
        'Why your upstairs is always hotter',
        'The repair vs replace decision made easy',
        'Signs your furnace wont make it through winter',
      ],
      ctas: [
        'Schedule Free Comfort Assessment',
        'Get Your Efficiency Score',
        'Book AC Tune-Up - $X',
        'Request Free Quote',
        'Call for Same-Day Service',
      ],
      hashtags: ['#hvac', '#airconditioning', '#homecomfort', '#energyefficiency', '#acrepair', '#heatingandcooling'],
    },
    platformStrategy: {
      facebook: { focus: 'Energy savings and reliability', format: 'Customer testimonials, seasonal maintenance reminders', tone: 'Trustworthy, educational' },
      instagram: { focus: 'Modern equipment and clean installs', format: 'Installation timelapses, tech tips in Stories', tone: 'Professional, modern' },
      youtube: { focus: 'Educational content', format: 'Maintenance tutorials, buying guides', tone: 'Expert advisor' },
      tiktok: { focus: 'Quick tips and satisfying content', format: 'Filter change reminders, duct cleaning reveals', tone: 'Helpful, quick' },
    },
    targeting: {
      facebook: {
        ageRange: { min: 35, max: 65 },
        genders: ['all'],
        interests: ['Home improvement', 'Energy efficiency', 'Smart home', 'Home comfort', 'Green living'],
        behaviors: ['Homeowners', 'Recently moved', 'Home improvement enthusiasts', 'Energy conscious consumers'],
        excludeInterests: ['Renters', 'Apartment living', 'HVAC technician careers'],
        customAudiences: ['Past service customers', 'Maintenance plan members', 'Quote requesters'],
      },
      google: {
        searchKeywords: ['ac repair near me', 'hvac service', 'air conditioning repair', 'furnace repair', 'heating and cooling', 'ac not working', 'hvac maintenance', 'new ac unit cost', 'central air installation', 'ductless mini split'],
        negativeKeywords: ['hvac jobs', 'hvac training', 'hvac certification', 'hvac technician salary', 'hvac school', 'wholesale hvac'],
        displayTopics: ['Home & Garden', 'Home Improvement', 'Home Services'],
        inMarketAudiences: ['HVAC services', 'Home services', 'Home improvement'],
        affinity: ['Home & Garden Enthusiasts', 'Green Living Enthusiasts', 'Smart Home Enthusiasts'],
      },
      tiktok: {
        ageRange: { min: 25, max: 45 },
        interests: ['Home improvement', 'Energy saving tips', 'Smart home', 'Life hacks'],
        behaviors: ['Homeowners', 'Engaged with home content'],
        creatorCategories: ['Home & Garden', 'DIY & Life Hacks'],
      },
      instagram: {
        ageRange: { min: 28, max: 55 },
        interests: ['Home decor', 'Smart home', 'Modern living', 'Home improvement'],
        behaviors: ['Homeowners', 'Tech enthusiasts', 'Home improvement enthusiasts'],
      },
      youtube: {
        topics: ['Home & Garden', 'Home Improvement', 'Technology'],
        placements: ['Home improvement channels', 'HVAC education channels', 'Home tech channels'],
        keywords: ['ac repair', 'hvac maintenance', 'furnace troubleshooting', 'energy efficiency', 'smart thermostat'],
        inMarketAudiences: ['HVAC services', 'Home services'],
      },
      general: {
        bestDays: ['Monday', 'Tuesday', 'Saturday'],
        bestTimes: ['7am-9am', '5pm-8pm'],
        seasonality: 'Peak in summer (AC) and winter (heating). Spring/fall for maintenance campaigns',
        budgetRange: { min: 25, max: 60, currency: 'USD' },
      },
    },
  },

  {
    id: 'electrical',
    name: 'Electrical Services',
    keywords: ['electrician', 'electrical', 'wiring', 'panel', 'outlet', 'lighting'],
    audience: {
      primary: 'Homeowners 30-60 with electrical concerns or upgrade needs',
      demographics: 'Homeowners, especially those with older homes or renovating',
      psychographics: 'Safety-conscious, value expertise, understand DIY electrical is dangerous',
      painPoints: ['Fear of electrical fires', 'Flickering lights/tripping breakers', 'Outdated wiring concerns', 'Need more outlets/capacity'],
      desires: ['Safe home', 'Modern electrical capacity', 'Reliable power', 'Code compliance'],
    },
    visualStyle: {
      mood: 'Safe, professional, precise, modern',
      colors: 'Yellow (caution/energy), blue (trust), orange (safety)',
      lighting: 'Bright, clear, showcasing clean work',
      subjects: ['Clean panel installations', 'Modern lighting upgrades', 'Safety inspections', 'Licensed technician at work', 'Smart home features'],
      avoid: ['Dangerous situations', 'Messy wiring', 'Sparks or fire imagery', 'Intimidating electrical panels'],
    },
    copyFrameworks: {
      headlines: [
        'Your Familys Safety Is Our Priority',
        'Licensed. Insured. Code Compliant.',
        'Powering Homes Safely for X Years',
        'Electrical Problems? We Fix Them Right.',
        'Upgrade Your Home. Upgrade Your Life.',
      ],
      hooks: [
        'These 5 signs mean call an electrician NOW',
        'Is your home wired for 2024?',
        'That flickering light isnt just annoying...',
        'Why your breaker keeps tripping',
        'The hidden danger in homes built before 1980',
      ],
      ctas: [
        'Book Free Safety Inspection',
        'Get Your Quote Today',
        'Schedule Electrical Checkup',
        'Call 24/7 for Emergencies',
        'Request Expert Assessment',
      ],
      hashtags: ['#electrician', '#electrical', '#homesafety', '#electricalrepair', '#licensedelectrician', '#smarthhome'],
    },
    platformStrategy: {
      facebook: { focus: 'Safety and trust', format: 'Safety tips, customer reviews, before/after panels', tone: 'Professional, safety-focused' },
      instagram: { focus: 'Quality craftsmanship', format: 'Clean installations, lighting transformations', tone: 'Skilled, precise' },
      youtube: { focus: 'Safety education', format: 'Warning sign videos, upgrade guides', tone: 'Expert educator' },
      tiktok: { focus: 'Quick safety tips', format: 'Outlet testing, panel reveals, myth busting', tone: 'Informative, engaging' },
    },
    targeting: {
      facebook: {
        ageRange: { min: 30, max: 65 },
        genders: ['all'],
        interests: ['Home improvement', 'Home safety', 'Smart home', 'Renovation', 'Home ownership'],
        behaviors: ['Homeowners', 'Recently moved', 'Home improvement enthusiasts', 'Older home owners'],
        excludeInterests: ['Renters', 'Electrician careers', 'Trade schools'],
        customAudiences: ['Past customers', 'Website visitors', 'Safety inspection requesters'],
      },
      google: {
        searchKeywords: ['electrician near me', 'electrical repair', 'panel upgrade', 'outlet installation', 'lighting installation', 'electrical inspection', 'rewiring house', 'emergency electrician', 'licensed electrician', 'ceiling fan installation'],
        negativeKeywords: ['electrician jobs', 'electrician training', 'electrical apprenticeship', 'electrician salary', 'electrical supplies wholesale', 'DIY electrical'],
        displayTopics: ['Home & Garden', 'Home Improvement', 'Home Services'],
        inMarketAudiences: ['Electrical services', 'Home services', 'Home renovation'],
        affinity: ['Home & Garden Enthusiasts', 'Smart Home Enthusiasts', 'Do-It-Yourselfers'],
      },
      tiktok: {
        ageRange: { min: 25, max: 45 },
        interests: ['Home improvement', 'Home safety', 'Smart home', 'DIY'],
        behaviors: ['Homeowners', 'Engaged with home content'],
        creatorCategories: ['Home & Garden', 'DIY & Life Hacks', 'Education'],
      },
      instagram: {
        ageRange: { min: 28, max: 55 },
        interests: ['Home decor', 'Lighting design', 'Smart home', 'Interior design', 'Modern home'],
        behaviors: ['Homeowners', 'Home improvement enthusiasts'],
      },
      youtube: {
        topics: ['Home & Garden', 'Home Improvement', 'Technology'],
        placements: ['Home improvement channels', 'DIY channels', 'Smart home channels'],
        keywords: ['electrical safety', 'panel upgrade', 'home wiring', 'smart lighting', 'outlet installation'],
        inMarketAudiences: ['Electrical services', 'Home services'],
      },
      general: {
        bestDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
        bestTimes: ['8am-10am', '5pm-8pm'],
        seasonality: 'Year-round. Spikes during home buying season (spring) and holiday lighting season (fall)',
        budgetRange: { min: 20, max: 50, currency: 'USD' },
      },
    },
  },

  {
    id: 'roofing',
    name: 'Roofing Services',
    keywords: ['roofing', 'roof', 'shingles', 'gutter', 'leak', 'roof repair'],
    audience: {
      primary: 'Homeowners 40-70 with aging roofs or storm damage',
      demographics: 'Homeowners with homes 15+ years old, property investors',
      psychographics: 'Protective of investment, fear major damage, want long-term solutions',
      painPoints: ['Fear of leaks damaging interior', 'Storm damage uncertainty', 'Big expense anxiety', 'Finding trustworthy contractor'],
      desires: ['Protect home investment', 'Peace of mind during storms', 'Fair pricing', 'Quality materials'],
    },
    visualStyle: {
      mood: 'Strong, protective, reliable, quality',
      colors: 'Deep blue (trust), brown/earth tones (materials), green (home)',
      lighting: 'Natural daylight, clear weather showcasing work',
      subjects: ['Beautiful completed roofs', 'Team at work (safely)', 'Material quality close-ups', 'Happy homeowners', 'Drone shots of clean roofs'],
      avoid: ['Dangerous heights without safety gear', 'Damaged/ugly roofs as main image', 'Storm damage as primary focus'],
    },
    copyFrameworks: {
      headlines: [
        'Roofs That Protect What Matters Most',
        'Storm Season Ready? We Can Help.',
        'Quality Roofing. Honest Pricing.',
        'Your Roof. Our Reputation.',
        'Free Inspection. No Obligation.',
      ],
      hooks: [
        'Your roof is talking. Are you listening?',
        'What insurance doesnt tell you about storm damage',
        'The 5-minute roof check that could save thousands',
        'How to spot a bad roofing contractor',
        'Why cheap roof repairs cost more long-term',
      ],
      ctas: [
        'Get Free Roof Inspection',
        'Request Storm Damage Assessment',
        'Schedule Your Free Estimate',
        'Call Before the Next Storm',
        'Book Drone Inspection',
      ],
      hashtags: ['#roofing', '#roofrepair', '#newroof', '#stormready', '#roofingcontractor', '#protectyourhome'],
    },
    platformStrategy: {
      facebook: { focus: 'Trust and community reputation', format: 'Project completions, 5-star reviews, storm prep tips', tone: 'Reliable neighbor' },
      instagram: { focus: 'Visual transformations', format: 'Drone shots, before/after, material showcases', tone: 'Quality-focused' },
      youtube: { focus: 'Education and transparency', format: 'Inspection walkthroughs, material comparisons', tone: 'Transparent expert' },
      tiktok: { focus: 'Satisfying reveals', format: 'Power washing, shingle installations, drone flybys', tone: 'Satisfying, impressive' },
    },
    targeting: {
      facebook: {
        ageRange: { min: 40, max: 70 },
        genders: ['all'],
        interests: ['Home improvement', 'Homeownership', 'Storm preparedness', 'Home insurance', 'Property investment'],
        behaviors: ['Homeowners', 'Homes built 15+ years ago', 'Recently experienced storm damage', 'Home improvement enthusiasts'],
        excludeInterests: ['Renters', 'Roofing contractor careers', 'Apartment living'],
        customAudiences: ['Past customers', 'Free inspection requesters', 'Insurance claim filers'],
      },
      google: {
        searchKeywords: ['roof repair near me', 'roofing contractor', 'roof replacement', 'storm damage roof', 'roof inspection', 'new roof cost', 'roof leak repair', 'shingle repair', 'roofing company', 'emergency roof repair'],
        negativeKeywords: ['roofing jobs', 'roofer salary', 'roofing materials wholesale', 'how to roof', 'DIY roofing', 'roofing courses'],
        displayTopics: ['Home & Garden', 'Home Improvement', 'Real Estate'],
        inMarketAudiences: ['Roofing services', 'Home services', 'Home insurance'],
        affinity: ['Home & Garden Enthusiasts', 'Property Investors', 'Home Improvement Enthusiasts'],
      },
      tiktok: {
        ageRange: { min: 28, max: 50 },
        interests: ['Home improvement', 'Satisfying videos', 'Before and after', 'Home renovation'],
        behaviors: ['Homeowners', 'Engaged with home content'],
        creatorCategories: ['Home & Garden', 'DIY & Life Hacks'],
      },
      instagram: {
        ageRange: { min: 30, max: 60 },
        interests: ['Home exterior', 'Curb appeal', 'Home improvement', 'Architecture'],
        behaviors: ['Homeowners', 'Home improvement enthusiasts'],
      },
      youtube: {
        topics: ['Home & Garden', 'Home Improvement'],
        placements: ['Home improvement channels', 'Real estate channels', 'Storm chaser channels'],
        keywords: ['roof replacement', 'roofing materials', 'storm damage', 'roof inspection', 'shingles vs metal'],
        inMarketAudiences: ['Roofing services', 'Home services'],
      },
      general: {
        bestDays: ['Tuesday', 'Wednesday', 'Thursday', 'Saturday'],
        bestTimes: ['9am-11am', '4pm-7pm'],
        seasonality: 'Peak after storm seasons. Spring and fall for planned replacements. Insurance claim spikes after major weather events',
        budgetRange: { min: 30, max: 75, currency: 'USD' },
      },
    },
  },

  {
    id: 'landscaping',
    name: 'Landscaping & Lawn Care',
    keywords: ['landscaping', 'lawn', 'garden', 'yard', 'tree', 'hardscape', 'irrigation'],
    audience: {
      primary: 'Homeowners 35-65 who want beautiful outdoor spaces',
      demographics: 'Homeowners with yards, income $70K+, suburban areas',
      psychographics: 'Take pride in curb appeal, want outdoor living space, may lack time for DIY',
      painPoints: ['No time for yard work', 'Dont know what plants work', 'Yard looks worse than neighbors', 'Previous bad contractor experience'],
      desires: ['Beautiful curb appeal', 'Low-maintenance landscape', 'Outdoor entertainment space', 'Envy of the neighborhood'],
    },
    visualStyle: {
      mood: 'Lush, vibrant, peaceful, aspirational',
      colors: 'Greens (nature), earth tones, pops of flower colors',
      lighting: 'Golden hour, bright sunny days, dramatic landscape lighting',
      subjects: ['Stunning completed landscapes', 'Before/after transformations', 'Happy family in yard', 'Detail shots of plants/stonework', 'Outdoor living spaces'],
      avoid: ['Dead/brown grass', 'Overgrown messy yards', 'Heavy equipment dominating shot'],
    },
    copyFrameworks: {
      headlines: [
        'Your Dream Yard Is Closer Than You Think',
        'Curb Appeal That Makes Neighbors Jealous',
        'Landscapes Designed for Living',
        'From Eyesore to Paradise',
        'Professional Results. Personal Touch.',
      ],
      hooks: [
        'This yard transformation took just 3 days...',
        'The secret to a lawn your neighbors will envy',
        'Stop wasting weekends on yard work',
        'Why your plants keep dying (and the fix)',
        'The landscaping mistake thats killing your curb appeal',
      ],
      ctas: [
        'Get Free Design Consultation',
        'See Our Portfolio',
        'Request Yard Assessment',
        'Start Your Transformation',
        'Book Spring Cleanup',
      ],
      hashtags: ['#landscaping', '#lawncare', '#curbappeal', '#outdoorliving', '#yardgoals', '#landscapedesign', '#beforeandafter'],
    },
    platformStrategy: {
      facebook: { focus: 'Transformations and trust', format: 'Before/after albums, seasonal tips, reviews', tone: 'Friendly professional' },
      instagram: { focus: 'Visual inspiration', format: 'Stunning portfolio shots, Reels of progress, Stories of daily work', tone: 'Aspirational, artistic' },
      youtube: { focus: 'Design inspiration and tips', format: 'Project walkthroughs, plant guides, design reveals', tone: 'Inspiring expert' },
      tiktok: { focus: 'Satisfying transformations', format: 'Timelapse cleanups, power washing, before/after reveals', tone: 'Satisfying, viral-worthy' },
    },
    targeting: {
      facebook: {
        ageRange: { min: 35, max: 65 },
        genders: ['all'],
        interests: ['Gardening', 'Home improvement', 'Outdoor living', 'Curb appeal', 'Home & Garden', 'Patio furniture'],
        behaviors: ['Homeowners', 'Outdoor enthusiasts', 'Home improvement enthusiasts', 'Recently moved'],
        excludeInterests: ['Apartment living', 'Landscaping careers', 'Renters'],
        customAudiences: ['Past customers', 'Quote requesters', 'Seasonal service subscribers'],
      },
      google: {
        searchKeywords: ['landscaping near me', 'lawn care service', 'landscape design', 'yard cleanup', 'tree trimming', 'lawn mowing service', 'garden design', 'patio installation', 'sprinkler system', 'sod installation'],
        negativeKeywords: ['landscaping jobs', 'landscaper salary', 'lawn care equipment', 'landscaping courses', 'DIY landscaping', 'wholesale plants'],
        displayTopics: ['Home & Garden', 'Gardening', 'Outdoor Living'],
        inMarketAudiences: ['Landscaping services', 'Lawn care services', 'Home services'],
        affinity: ['Home & Garden Enthusiasts', 'Outdoor Enthusiasts', 'Green Living Enthusiasts'],
      },
      tiktok: {
        ageRange: { min: 25, max: 45 },
        interests: ['Satisfying videos', 'Before and after', 'Gardening', 'Home improvement', 'Outdoor living'],
        behaviors: ['Homeowners', 'Engaged with satisfying content'],
        creatorCategories: ['Home & Garden', 'DIY & Life Hacks', 'ASMR & Satisfying'],
      },
      instagram: {
        ageRange: { min: 28, max: 55 },
        interests: ['Garden design', 'Outdoor living', 'Home exterior', 'Landscape photography', 'Curb appeal'],
        behaviors: ['Homeowners', 'Home decor enthusiasts', 'Lifestyle focused'],
      },
      youtube: {
        topics: ['Home & Garden', 'Gardening', 'DIY'],
        placements: ['Garden channels', 'Home improvement channels', 'Satisfying transformation channels'],
        keywords: ['landscape transformation', 'yard makeover', 'garden design', 'lawn care tips', 'outdoor living'],
        inMarketAudiences: ['Landscaping services', 'Lawn care services'],
      },
      general: {
        bestDays: ['Thursday', 'Friday', 'Saturday'],
        bestTimes: ['10am-12pm', '5pm-8pm'],
        seasonality: 'Peak in spring (cleanups, planting) and fall (prep). Summer for maintenance contracts. Winter for planning/hardscape',
        budgetRange: { min: 15, max: 45, currency: 'USD' },
      },
    },
  },

  // PROFESSIONAL SERVICES
  {
    id: 'legal',
    name: 'Law Firm / Legal Services',
    keywords: ['lawyer', 'attorney', 'law firm', 'legal', 'law office', 'counsel'],
    audience: {
      primary: 'Individuals and businesses needing legal representation',
      demographics: 'Adults 25-65, varies by practice area (family, business, injury, etc.)',
      psychographics: 'Stressed, need guidance, want someone to fight for them, value expertise',
      painPoints: ['Overwhelming legal situation', 'Dont understand their rights', 'Fear of losing case/money', 'Past bad lawyer experience'],
      desires: ['Someone in their corner', 'Clear communication', 'Fair outcome', 'Expertise they can trust'],
    },
    visualStyle: {
      mood: 'Professional, authoritative, trustworthy, approachable',
      colors: 'Navy blue, burgundy, gold accents, white',
      lighting: 'Professional, warm but serious',
      subjects: ['Attorney portraits', 'Office/conference room', 'Handshake moments', 'Scales of justice subtle', 'Team collaboration'],
      avoid: ['Aggressive imagery', 'Gavels/cliches overused', 'Intimidating poses', 'Stock courtroom drama'],
    },
    copyFrameworks: {
      headlines: [
        'Your Fight. Our Experience.',
        'Justice Shouldnt Be Complicated',
        'Trusted Legal Counsel for X Years',
        'When It Matters Most, Experience Matters',
        'Protecting Your Rights. Protecting Your Future.',
      ],
      hooks: [
        'What your insurance company doesnt want you to know',
        'The biggest mistake people make after an accident',
        'Before you sign anything, read this',
        '3 rights you didnt know you had',
        'Why most people settle for less than they deserve',
      ],
      ctas: [
        'Free Confidential Consultation',
        'Call 24/7 - We Answer',
        'Get Your Free Case Review',
        'Speak With an Attorney Today',
        'No Fee Unless We Win',
      ],
      hashtags: ['#attorney', '#lawyer', '#legalhelp', '#justice', '#lawfirm', '#yourfightourfight'],
    },
    platformStrategy: {
      facebook: { focus: 'Trust and results', format: 'Case results, community involvement, educational posts', tone: 'Authoritative but approachable' },
      instagram: { focus: 'Humanize the firm', format: 'Team spotlights, office culture, quick legal tips', tone: 'Professional, personable' },
      youtube: { focus: 'Educational authority', format: 'Legal explainers, know your rights series', tone: 'Expert educator' },
      tiktok: { focus: 'Accessible legal info', format: 'Quick myth busting, rights explanations, relatable scenarios', tone: 'Approachable, informative' },
    },
    targeting: {
      facebook: {
        ageRange: { min: 25, max: 65 },
        genders: ['all'],
        interests: ['Legal services', 'Consumer rights', 'Business ownership', 'Real estate', 'Family matters'],
        behaviors: ['Small business owners', 'Recently engaged', 'Recently divorced', 'New parents', 'Property owners'],
        excludeInterests: ['Law school', 'Paralegal careers', 'Legal assistant jobs'],
        customAudiences: ['Consultation requesters', 'Website visitors', 'Past clients'],
      },
      google: {
        searchKeywords: ['lawyer near me', 'attorney consultation', 'personal injury lawyer', 'divorce attorney', 'business lawyer', 'estate planning attorney', 'criminal defense lawyer', 'free legal consultation', 'best lawyer', 'law firm near me'],
        negativeKeywords: ['law school', 'lawyer salary', 'how to become a lawyer', 'paralegal jobs', 'legal assistant jobs', 'bar exam'],
        displayTopics: ['Law & Government', 'Legal Services', 'Business Services'],
        inMarketAudiences: ['Legal services', 'Business services', 'Family services'],
        affinity: ['Business Professionals', 'Family-Focused', 'News Junkies'],
      },
      tiktok: {
        ageRange: { min: 21, max: 40 },
        interests: ['Know your rights', 'Life advice', 'Money tips', 'Legal tips'],
        behaviors: ['Engaged with educational content', 'Self-improvement focused'],
        creatorCategories: ['Education', 'News & Current Events', 'Business & Finance'],
      },
      instagram: {
        ageRange: { min: 25, max: 50 },
        interests: ['Professional services', 'Business', 'Self improvement', 'Life planning'],
        behaviors: ['Business owners', 'Career focused', 'Life milestone events'],
      },
      youtube: {
        topics: ['Law & Government', 'Business', 'Education'],
        placements: ['Legal education channels', 'Business channels', 'News channels'],
        keywords: ['legal rights', 'lawyer explained', 'how to sue', 'legal advice', 'know your rights'],
        inMarketAudiences: ['Legal services', 'Business services'],
      },
      general: {
        bestDays: ['Monday', 'Tuesday', 'Wednesday'],
        bestTimes: ['9am-11am', '1pm-4pm', '7pm-9pm'],
        seasonality: 'Year-round. Tax season for business law. January for divorce. Summer for personal injury',
        budgetRange: { min: 40, max: 100, currency: 'USD' },
      },
    },
  },

  {
    id: 'dental',
    name: 'Dental Practice',
    keywords: ['dentist', 'dental', 'teeth', 'orthodontist', 'cosmetic dentistry', 'oral'],
    audience: {
      primary: 'Families and individuals needing dental care',
      demographics: 'All ages, families with children, adults 25-65 for cosmetic',
      psychographics: 'May have dental anxiety, want painless experience, value aesthetics',
      painPoints: ['Fear of pain', 'Embarrassed about teeth', 'Bad past experiences', 'Cost concerns'],
      desires: ['Confident smile', 'Painless visits', 'Friendly staff', 'Modern technology'],
    },
    visualStyle: {
      mood: 'Clean, friendly, modern, calming',
      colors: 'Teal/aqua (fresh), white (clean), soft blues (calm)',
      lighting: 'Bright, clean, welcoming',
      subjects: ['Genuine smiles (not stock)', 'Modern clean office', 'Friendly team', 'Before/after smiles', 'Comfortable patient experience'],
      avoid: ['Clinical/scary equipment', 'Open mouth procedures', 'Anxious patients', 'Old dated offices'],
    },
    copyFrameworks: {
      headlines: [
        'Smile With Confidence Again',
        'Gentle Care. Beautiful Results.',
        'Dentistry You Can Actually Look Forward To',
        'Your Comfort Is Our Priority',
        'Modern Dentistry. Timeless Smiles.',
      ],
      hooks: [
        'What if going to the dentist didnt feel like going to the dentist?',
        'The smile transformation that changed her life',
        'Why people are switching dentists to us',
        'Dental anxiety? We get it. Heres how we help.',
        'The thing nobody tells you about teeth whitening',
      ],
      ctas: [
        'Book Your Free Consultation',
        'New Patient Special - $X Exam',
        'Schedule Your Smile Assessment',
        'Claim Your Free Whitening',
        'Request Appointment Online',
      ],
      hashtags: ['#dentist', '#smile', '#dentalcare', '#cosmeticdentistry', '#smilemakeover', '#gentledentist'],
    },
    platformStrategy: {
      facebook: { focus: 'Trust and family-friendly', format: 'Patient testimonials, team intros, smile reveals', tone: 'Warm, trustworthy' },
      instagram: { focus: 'Smile transformations', format: 'Before/after, office tour Reels, team fun', tone: 'Friendly, aspirational' },
      youtube: { focus: 'Education and comfort', format: 'Procedure explainers, patient stories, office tours', tone: 'Reassuring expert' },
      tiktok: { focus: 'Fun and relatable', format: 'Smile reveals, dental myths, day-in-life, humor', tone: 'Fun, approachable' },
    },
    targeting: {
      facebook: {
        ageRange: { min: 25, max: 65 },
        genders: ['all'],
        interests: ['Health & Wellness', 'Family', 'Cosmetic procedures', 'Self improvement', 'Parenting'],
        behaviors: ['Parents', 'Health conscious', 'Recently moved', 'Dental insurance holders'],
        excludeInterests: ['Dental school', 'Dental hygienist careers', 'Dental assistant jobs'],
        customAudiences: ['Past patients', 'Appointment bookers', 'Website visitors'],
      },
      google: {
        searchKeywords: ['dentist near me', 'teeth whitening', 'dental cleaning', 'emergency dentist', 'cosmetic dentist', 'family dentist', 'dental implants', 'invisalign', 'dentist accepting new patients', 'best dentist'],
        negativeKeywords: ['dental school', 'dental hygienist salary', 'dental assistant jobs', 'how to become a dentist', 'dental supplies wholesale'],
        displayTopics: ['Health', 'Beauty & Fitness', 'Family'],
        inMarketAudiences: ['Dental services', 'Health services', 'Cosmetic procedures'],
        affinity: ['Health & Fitness Buffs', 'Beauty Mavens', 'Family-Focused'],
      },
      tiktok: {
        ageRange: { min: 18, max: 35 },
        interests: ['Smile makeover', 'Self improvement', 'Beauty', 'Health tips', 'Transformation'],
        behaviors: ['Beauty focused', 'Self improvement focused', 'Engaged with transformation content'],
        creatorCategories: ['Beauty', 'Health & Wellness', 'Education'],
      },
      instagram: {
        ageRange: { min: 22, max: 45 },
        interests: ['Smile aesthetics', 'Beauty', 'Self care', 'Cosmetic procedures', 'Confidence'],
        behaviors: ['Beauty enthusiasts', 'Self improvement focused', 'Engaged shoppers'],
      },
      youtube: {
        topics: ['Health', 'Beauty & Fitness', 'Family'],
        placements: ['Health channels', 'Beauty channels', 'Family vlog channels'],
        keywords: ['dental procedure', 'teeth whitening', 'smile makeover', 'dental anxiety', 'cosmetic dentistry'],
        inMarketAudiences: ['Dental services', 'Health services'],
      },
      general: {
        bestDays: ['Tuesday', 'Wednesday', 'Thursday'],
        bestTimes: ['10am-12pm', '6pm-9pm'],
        seasonality: 'Year-round. Peaks before school starts, before weddings, year-end (insurance benefits expiring)',
        budgetRange: { min: 20, max: 60, currency: 'USD' },
      },
    },
  },

  {
    id: 'medical',
    name: 'Medical Practice',
    keywords: ['doctor', 'medical', 'clinic', 'healthcare', 'physician', 'family medicine', 'urgent care'],
    audience: {
      primary: 'Individuals and families seeking healthcare',
      demographics: 'All ages, families, elderly for primary care',
      psychographics: 'Want to be heard, value convenience, trust is paramount',
      painPoints: ['Long wait times', 'Feeling rushed', 'Difficulty getting appointments', 'Impersonal care'],
      desires: ['Doctor who listens', 'Convenient access', 'Clear communication', 'Whole-person care'],
    },
    visualStyle: {
      mood: 'Caring, professional, modern, welcoming',
      colors: 'Blue (trust/health), green (wellness), white (clean)',
      lighting: 'Warm, welcoming, professional',
      subjects: ['Doctor-patient interaction', 'Caring medical team', 'Modern facility', 'Diverse patients', 'Wellness imagery'],
      avoid: ['Sick/suffering patients', 'Cold clinical settings', 'Intimidating equipment', 'Stock photos that feel fake'],
    },
    copyFrameworks: {
      headlines: [
        'Healthcare That Puts You First',
        'Your Health. Your Schedule. Your Doctor.',
        'Medicine With a Personal Touch',
        'Caring for Families for X Years',
        'Modern Care. Old-Fashioned Values.',
      ],
      hooks: [
        'Remember when doctors actually listened?',
        'The health screening everyone over 40 needs',
        'Why we spend 30+ minutes with every patient',
        'What your body might be telling you',
        'The appointment that could save your life',
      ],
      ctas: [
        'Accepting New Patients',
        'Book Same-Day Appointment',
        'Schedule Your Wellness Visit',
        'Request Appointment Online',
        'Meet Your New Doctor',
      ],
      hashtags: ['#healthcare', '#familydoctor', '#primarycare', '#wellness', '#healthyliving', '#patientcare'],
    },
    platformStrategy: {
      facebook: { focus: 'Trust and accessibility', format: 'Health tips, team intros, patient education', tone: 'Caring, educational' },
      instagram: { focus: 'Humanize the practice', format: 'Behind the scenes, wellness tips, team culture', tone: 'Warm, approachable' },
      youtube: { focus: 'Health education', format: 'Condition explainers, prevention tips, provider intros', tone: 'Expert educator' },
      tiktok: { focus: 'Accessible health info', format: 'Quick health tips, myth busting, day-in-life', tone: 'Relatable, informative' },
    },
    targeting: {
      facebook: {
        ageRange: { min: 25, max: 65 },
        genders: ['all'],
        interests: ['Health & Wellness', 'Family health', 'Preventive care', 'Parenting', 'Senior care'],
        behaviors: ['Parents', 'Health insurance holders', 'Recently moved', 'Health conscious consumers'],
        excludeInterests: ['Medical school', 'Nursing careers', 'Healthcare administration jobs'],
        customAudiences: ['Current patients', 'Appointment requesters', 'Website visitors'],
      },
      google: {
        searchKeywords: ['doctor near me', 'family doctor', 'primary care physician', 'urgent care near me', 'clinic near me', 'accepting new patients', 'same day appointment doctor', 'walk in clinic', 'annual physical', 'health checkup'],
        negativeKeywords: ['medical school', 'doctor salary', 'how to become a doctor', 'nursing jobs', 'medical assistant jobs', 'healthcare careers'],
        displayTopics: ['Health', 'Family', 'Fitness'],
        inMarketAudiences: ['Healthcare services', 'Family services', 'Health insurance'],
        affinity: ['Health & Fitness Buffs', 'Family-Focused', 'Wellness Enthusiasts'],
      },
      tiktok: {
        ageRange: { min: 20, max: 40 },
        interests: ['Health tips', 'Wellness', 'Self care', 'Medical information', 'Life hacks'],
        behaviors: ['Health conscious', 'Engaged with educational content'],
        creatorCategories: ['Health & Wellness', 'Education', 'Science'],
      },
      instagram: {
        ageRange: { min: 25, max: 50 },
        interests: ['Wellness', 'Healthy living', 'Self care', 'Family health', 'Preventive care'],
        behaviors: ['Health conscious', 'Wellness focused', 'Parents'],
      },
      youtube: {
        topics: ['Health', 'Science', 'Family'],
        placements: ['Health education channels', 'Wellness channels', 'Medical information channels'],
        keywords: ['health tips', 'medical advice', 'preventive care', 'doctor explains', 'health checkup'],
        inMarketAudiences: ['Healthcare services', 'Health insurance'],
      },
      general: {
        bestDays: ['Monday', 'Tuesday', 'Wednesday'],
        bestTimes: ['7am-9am', '12pm-2pm', '6pm-8pm'],
        seasonality: 'Year-round. Flu season (fall/winter), back-to-school physicals (summer), new year wellness',
        budgetRange: { min: 25, max: 65, currency: 'USD' },
      },
    },
  },

  {
    id: 'accounting',
    name: 'Accounting & Tax Services',
    keywords: ['accountant', 'accounting', 'cpa', 'tax', 'bookkeeping', 'financial'],
    audience: {
      primary: 'Small business owners and individuals needing tax/financial help',
      demographics: 'Business owners, high-income individuals, 30-65',
      psychographics: 'Want to save money legally, fear IRS, value accuracy',
      painPoints: ['Tax complexity/overwhelm', 'Fear of mistakes/audits', 'Overpaying taxes', 'Messy books'],
      desires: ['Maximize deductions', 'Peace of mind', 'Clear financial picture', 'Strategic tax planning'],
    },
    visualStyle: {
      mood: 'Professional, trustworthy, organized, modern',
      colors: 'Navy blue, green (money/growth), gold accents',
      lighting: 'Professional, clean office settings',
      subjects: ['Professional team meetings', 'Modern office', 'Relaxed business owner', 'Growth charts', 'Organized workspace'],
      avoid: ['Piles of messy papers', 'Stressed people', 'Old calculators/cliches', 'Boring spreadsheet close-ups'],
    },
    copyFrameworks: {
      headlines: [
        'Keep More of What You Earn',
        'Tax Strategy, Not Just Tax Prep',
        'Numbers You Can Trust',
        'Your Business Deserves a Financial Partner',
        'Clarity in Your Finances. Confidence in Your Future.',
      ],
      hooks: [
        'The deduction most business owners miss',
        'What the IRS doesnt want you to know',
        'Are you overpaying your taxes?',
        'Why DIY tax software is costing you money',
        '3 tax moves to make before December 31',
      ],
      ctas: [
        'Get Free Tax Assessment',
        'Schedule Strategy Session',
        'Book Your Tax Consultation',
        'Request Free Business Review',
        'Start Saving Today',
      ],
      hashtags: ['#accountant', '#taxpro', '#smallbusiness', '#taxsavings', '#cpa', '#financialplanning'],
    },
    platformStrategy: {
      facebook: { focus: 'Trust and tax tips', format: 'Tax deadline reminders, saving tips, testimonials', tone: 'Trustworthy advisor' },
      instagram: { focus: 'Modern firm image', format: 'Team culture, quick tips, myth busting', tone: 'Professional, approachable' },
      youtube: { focus: 'Tax education', format: 'Tax strategy videos, deduction guides, Q&A', tone: 'Expert educator' },
      tiktok: { focus: 'Quick money tips', format: 'Tax hacks, deduction tips, relatable business content', tone: 'Helpful, quick' },
    },
    targeting: {
      facebook: {
        ageRange: { min: 30, max: 65 },
        genders: ['all'],
        interests: ['Small business', 'Entrepreneurship', 'Investing', 'Personal finance', 'Tax planning'],
        behaviors: ['Small business owners', 'Self-employed', 'High income earners', 'Business page admins'],
        excludeInterests: ['Accounting careers', 'CPA exam', 'Bookkeeping courses'],
        customAudiences: ['Current clients', 'Tax consultation requesters', 'Website visitors'],
      },
      google: {
        searchKeywords: ['accountant near me', 'tax preparer', 'cpa near me', 'small business accountant', 'bookkeeping services', 'tax planning', 'business tax help', 'quarterly taxes', 'tax deductions', 'payroll services'],
        negativeKeywords: ['accounting jobs', 'cpa exam', 'bookkeeping courses', 'accountant salary', 'how to become an accountant', 'accounting software free'],
        displayTopics: ['Business & Industrial', 'Finance', 'Small Business'],
        inMarketAudiences: ['Accounting services', 'Business services', 'Tax services'],
        affinity: ['Business Professionals', 'Aspiring Entrepreneurs', 'Investors'],
      },
      tiktok: {
        ageRange: { min: 25, max: 45 },
        interests: ['Money tips', 'Business advice', 'Side hustle', 'Tax tips', 'Entrepreneurship'],
        behaviors: ['Business owners', 'Self-employed', 'Finance focused'],
        creatorCategories: ['Business & Finance', 'Education', 'Career & Money'],
      },
      instagram: {
        ageRange: { min: 28, max: 55 },
        interests: ['Entrepreneurship', 'Business growth', 'Financial planning', 'Professional services'],
        behaviors: ['Business owners', 'Career focused', 'High earners'],
      },
      youtube: {
        topics: ['Business & Industrial', 'Finance', 'Education'],
        placements: ['Business channels', 'Finance education channels', 'Entrepreneurship channels'],
        keywords: ['tax tips', 'business deductions', 'small business taxes', 'CPA advice', 'bookkeeping'],
        inMarketAudiences: ['Accounting services', 'Business services'],
      },
      general: {
        bestDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
        bestTimes: ['8am-10am', '12pm-2pm', '7pm-9pm'],
        seasonality: 'Peak Jan-April (tax season). Q4 for year-end planning. Quarterly for estimated taxes',
        budgetRange: { min: 25, max: 70, currency: 'USD' },
      },
    },
  },

  {
    id: 'realestate',
    name: 'Real Estate Services',
    keywords: ['realtor', 'real estate', 'realty', 'property', 'homes', 'broker'],
    audience: {
      primary: 'Home buyers and sellers',
      demographics: 'First-time buyers 28-40, move-up buyers 35-55, sellers 45-70',
      psychographics: 'Emotional decision, want guidance, fear making wrong choice',
      painPoints: ['Overwhelming process', 'Fear of overpaying/underselling', 'Competitive market', 'Finding the right home'],
      desires: ['Dream home', 'Best deal', 'Smooth process', 'Trusted guide'],
    },
    visualStyle: {
      mood: 'Aspirational, warm, trustworthy, professional',
      colors: 'Navy, gold, white, warm neutrals',
      lighting: 'Golden hour, bright welcoming interiors',
      subjects: ['Beautiful home exteriors', 'Happy families at new home', 'Agent with clients', 'Stunning interiors', 'Neighborhood shots'],
      avoid: ['Empty sterile rooms', 'For sale signs alone', 'Dated homes as hero images', 'Overly salesy poses'],
    },
    copyFrameworks: {
      headlines: [
        'Your Home Journey Starts Here',
        'Local Expert. Global Reach.',
        'Selling Homes, Building Dreams',
        'The Right Home at the Right Price',
        'Your Trusted Guide in Real Estate',
      ],
      hooks: [
        'The mistake first-time buyers always make',
        'Why homes in [area] are selling so fast',
        'What sellers dont know about pricing',
        'Is now the right time to buy?',
        'How I sold this home for $X over asking',
      ],
      ctas: [
        'Get Your Free Home Valuation',
        'Search Homes Now',
        'Schedule a Buyer Consultation',
        'See New Listings First',
        'Lets Find Your Dream Home',
      ],
      hashtags: ['#realestate', '#realtor', '#homesforsale', '#dreamhome', '#firsttimehomebuyer', '#sold', '#househunting'],
    },
    platformStrategy: {
      facebook: { focus: 'Listings and market expertise', format: 'New listings, market updates, just sold, tips', tone: 'Local expert' },
      instagram: { focus: 'Lifestyle and aspiration', format: 'Beautiful property tours, neighborhood guides, behind-the-scenes', tone: 'Aspirational, personal' },
      youtube: { focus: 'Property tours and education', format: 'Home tours, buyer/seller guides, market reports', tone: 'Informative host' },
      tiktok: { focus: 'Quick tips and tours', format: 'Home tour clips, real estate tips, day-in-life', tone: 'Engaging, quick' },
    },
    targeting: {
      facebook: {
        ageRange: { min: 28, max: 65 },
        genders: ['all'],
        interests: ['Real estate', 'Home buying', 'Home decor', 'Interior design', 'Investment property', 'Moving'],
        behaviors: ['Likely to move', 'First-time home buyers', 'Recent mortgage inquiries', 'Newlyweds', 'New parents'],
        excludeInterests: ['Real estate agent careers', 'Real estate license', 'Property management careers'],
        customAudiences: ['Home valuation requesters', 'Property search users', 'Open house attendees'],
      },
      google: {
        searchKeywords: ['homes for sale near me', 'realtor near me', 'houses for sale', 'real estate agent', 'sell my house', 'home value', 'first time home buyer', 'condos for sale', 'townhomes for sale', 'open houses near me'],
        negativeKeywords: ['real estate license', 'realtor salary', 'how to become a realtor', 'real estate courses', 'property management jobs'],
        displayTopics: ['Real Estate', 'Home & Garden', 'Finance'],
        inMarketAudiences: ['Residential properties', 'Real estate services', 'Moving services'],
        affinity: ['Home & Garden Enthusiasts', 'Property Investors', 'Family-Focused'],
      },
      tiktok: {
        ageRange: { min: 23, max: 40 },
        interests: ['House hunting', 'Home tours', 'Interior design', 'Moving tips', 'Adulting'],
        behaviors: ['First-time buyers', 'Engaged with real estate content', 'Life milestone events'],
        creatorCategories: ['Home & Garden', 'Lifestyle', 'Finance'],
      },
      instagram: {
        ageRange: { min: 25, max: 50 },
        interests: ['Home design', 'Interior design', 'Architecture', 'Luxury lifestyle', 'Home decor'],
        behaviors: ['Home seekers', 'Aspirational lifestyle', 'Engaged with real estate content'],
      },
      youtube: {
        topics: ['Real Estate', 'Home & Garden', 'Travel'],
        placements: ['Home tour channels', 'Real estate channels', 'Lifestyle vlog channels'],
        keywords: ['home tour', 'house hunting', 'first time buyer', 'home buying tips', 'real estate market'],
        inMarketAudiences: ['Residential properties', 'Real estate services'],
      },
      general: {
        bestDays: ['Thursday', 'Friday', 'Saturday', 'Sunday'],
        bestTimes: ['10am-12pm', '5pm-8pm'],
        seasonality: 'Peak spring through fall. January for new year movers. Summer for families before school',
        budgetRange: { min: 30, max: 80, currency: 'USD' },
      },
    },
  },

  // FOOD & HOSPITALITY
  {
    id: 'restaurant',
    name: 'Restaurant',
    keywords: ['restaurant', 'dining', 'food', 'eatery', 'cuisine', 'bistro', 'cafe', 'grill'],
    audience: {
      primary: 'Local diners looking for food experiences',
      demographics: 'Adults 25-55, foodies, families, date-night couples',
      psychographics: 'Seeking experiences, influenced by reviews/photos, value atmosphere',
      painPoints: ['Same old restaurants', 'Finding good food nearby', 'Special occasion planning', 'Dietary accommodations'],
      desires: ['Delicious food', 'Great atmosphere', 'Memorable experience', 'Value for money'],
    },
    visualStyle: {
      mood: 'Appetizing, warm, inviting, authentic',
      colors: 'Warm tones, rich food colors, cozy lighting',
      lighting: 'Warm ambient, natural light for food shots',
      subjects: ['Hero food shots', 'Plating details', 'Warm interior', 'Happy diners', 'Chef at work'],
      avoid: ['Flash photography', 'Empty restaurant', 'Messy plates', 'Stock food photos'],
    },
    copyFrameworks: {
      headlines: [
        'Taste the Difference',
        'Where Flavor Meets Soul',
        'Your Table Is Waiting',
        'Food Worth Talking About',
        'Made Fresh. Made With Love.',
      ],
      hooks: [
        'The dish everyone comes back for',
        'Our secret ingredient? Love. (And butter.)',
        'This is what fresh looks like',
        'The brunch spot your friends dont know about yet',
        'When was the last time food made you close your eyes?',
      ],
      ctas: [
        'Make a Reservation',
        'View Our Menu',
        'Order Online Now',
        'Book Your Table',
        'Join Us Tonight',
      ],
      hashtags: ['#foodie', '#restaurant', '#eatlocal', '#foodporn', '#yum', '#dinnertime', '#foodstagram'],
    },
    platformStrategy: {
      facebook: { focus: 'Community and events', format: 'Daily specials, events, reviews, behind-scenes', tone: 'Friendly neighbor' },
      instagram: { focus: 'Food photography', format: 'Beautiful dish photos, Reels of cooking, Stories of daily prep', tone: 'Appetizing, authentic' },
      youtube: { focus: 'Recipe and story', format: 'Chef stories, recipe reveals, restaurant tour', tone: 'Passionate foodie' },
      tiktok: { focus: 'Viral food content', format: 'Cooking ASMR, plating reveals, menu hacks', tone: 'Trendy, fun' },
    },
    targeting: {
      facebook: {
        ageRange: { min: 21, max: 65 },
        genders: ['all'],
        interests: ['Food & Dining', 'Restaurants', 'Cooking', 'Foodies', 'Local events', 'Date nights'],
        behaviors: ['Frequent diners', 'Foodies', 'Recent birthday', 'Recent anniversary', 'Restaurant check-ins'],
        excludeInterests: ['Restaurant jobs', 'Culinary school', 'Food service careers'],
        customAudiences: ['Past diners', 'Reservation makers', 'Loyalty members'],
      },
      google: {
        searchKeywords: ['restaurants near me', 'best food near me', 'dinner near me', 'lunch spots', 'date night restaurant', 'brunch near me', 'takeout near me', 'restaurant reservations', 'best [cuisine] near me', 'food delivery'],
        negativeKeywords: ['restaurant jobs', 'restaurant for sale', 'food service careers', 'chef jobs', 'waiter jobs', 'restaurant equipment'],
        displayTopics: ['Food & Drink', 'Restaurants', 'Local'],
        inMarketAudiences: ['Restaurants', 'Food delivery', 'Dining'],
        affinity: ['Foodies', 'Cooking Enthusiasts', 'Nightlife Enthusiasts'],
      },
      tiktok: {
        ageRange: { min: 18, max: 40 },
        interests: ['Food', 'Foodie', 'Eating out', 'Food reviews', 'Mukbang', 'Restaurant reviews'],
        behaviors: ['Foodies', 'Engaged with food content', 'Local explorers'],
        creatorCategories: ['Food & Drink', 'Lifestyle', 'ASMR'],
      },
      instagram: {
        ageRange: { min: 21, max: 45 },
        interests: ['Food photography', 'Foodie', 'Dining out', 'Brunch', 'Date night', 'Local gems'],
        behaviors: ['Foodies', 'Lifestyle focused', 'Frequent restaurant visitors'],
      },
      youtube: {
        topics: ['Food & Drink', 'Travel', 'Lifestyle'],
        placements: ['Food review channels', 'Local guide channels', 'Mukbang channels'],
        keywords: ['food review', 'restaurant review', 'best restaurants', 'must try food', 'local food'],
        inMarketAudiences: ['Restaurants', 'Food delivery'],
      },
      general: {
        bestDays: ['Wednesday', 'Thursday', 'Friday', 'Saturday'],
        bestTimes: ['11am-1pm', '4pm-7pm'],
        seasonality: 'Year-round. Peaks on holidays, Valentines, Mothers Day. Summer for outdoor dining. Winter for comfort food',
        budgetRange: { min: 10, max: 35, currency: 'USD' },
      },
    },
  },

  {
    id: 'fitness',
    name: 'Gym / Fitness Studio',
    keywords: ['gym', 'fitness', 'workout', 'training', 'yoga', 'crossfit', 'personal training'],
    audience: {
      primary: 'Adults seeking fitness transformation or maintenance',
      demographics: 'Adults 20-50, health-conscious, various fitness levels',
      psychographics: 'Motivated by results, community-driven, value accountability',
      painPoints: ['Lack of motivation', 'Not seeing results', 'Intimidating gym culture', 'Busy schedule'],
      desires: ['Visible results', 'Supportive community', 'Expert guidance', 'Confidence in body'],
    },
    visualStyle: {
      mood: 'Energetic, motivational, inclusive, strong',
      colors: 'Bold colors, energetic contrast, black/white for drama',
      lighting: 'Dynamic, high-energy, dramatic shadows',
      subjects: ['Real members working out', 'Transformation photos', 'Community moments', 'Trainers in action', 'Equipment in use'],
      avoid: ['Intimidating bodybuilder focus only', 'Empty gym photos', 'Stock fitness models', 'Overly posed shots'],
    },
    copyFrameworks: {
      headlines: [
        'Your Transformation Starts Here',
        'Stronger Every Day',
        'More Than a Gym. A Community.',
        'Results You Can See. Support You Can Feel.',
        'The Only Bad Workout Is the One You Didnt Do',
      ],
      hooks: [
        'She lost 30 lbs and gained confidence...',
        'What happens when you commit for 30 days',
        'The workout everyone is talking about',
        'Why our members actually show up',
        'Before you quit, watch this transformation',
      ],
      ctas: [
        'Start Your Free Trial',
        'Book Free Fitness Assessment',
        'Join Our Community',
        'Claim Your First Week Free',
        'Get Started Today',
      ],
      hashtags: ['#fitness', '#gym', '#workout', '#transformation', '#fitfam', '#strongnotskinny', '#fitnessmotivation'],
    },
    platformStrategy: {
      facebook: { focus: 'Community and transformation stories', format: 'Member spotlights, transformation posts, class schedules', tone: 'Supportive community' },
      instagram: { focus: 'Inspiration and results', format: 'Workout clips, transformations, motivational Reels', tone: 'Motivating, aspirational' },
      youtube: { focus: 'Workout content', format: 'Follow-along workouts, trainer tips, member stories', tone: 'Coach/trainer' },
      tiktok: { focus: 'Viral fitness content', format: 'Quick workout tips, gym humor, transformation reveals', tone: 'Relatable, energetic' },
    },
    targeting: {
      facebook: {
        ageRange: { min: 20, max: 55 },
        genders: ['all'],
        interests: ['Fitness', 'Health & Wellness', 'Working out', 'Weight loss', 'Healthy living', 'Sports'],
        behaviors: ['Health conscious', 'Fitness app users', 'Gym members', 'Active lifestyle', 'New Year resolvers'],
        excludeInterests: ['Personal trainer certification', 'Fitness instructor jobs', 'Gym management'],
        customAudiences: ['Trial members', 'Past members', 'Class attendees'],
      },
      google: {
        searchKeywords: ['gym near me', 'fitness classes', 'personal trainer', 'yoga studio', 'crossfit gym', 'weight loss program', 'gym membership', 'workout classes', 'fitness studio', '24 hour gym'],
        negativeKeywords: ['gym equipment for sale', 'personal trainer certification', 'fitness instructor jobs', 'gym franchise', 'how to open a gym'],
        displayTopics: ['Health & Fitness', 'Sports', 'Nutrition'],
        inMarketAudiences: ['Fitness services', 'Health & fitness', 'Gym memberships'],
        affinity: ['Health & Fitness Buffs', 'Sports Fans', 'Running Enthusiasts'],
      },
      tiktok: {
        ageRange: { min: 18, max: 40 },
        interests: ['Fitness', 'Workout', 'Gym life', 'Weight loss journey', 'Health', 'Motivation'],
        behaviors: ['Fitness focused', 'Self improvement', 'Transformation seekers'],
        creatorCategories: ['Sports & Fitness', 'Health & Wellness', 'Lifestyle'],
      },
      instagram: {
        ageRange: { min: 18, max: 45 },
        interests: ['Fitness motivation', 'Workout routines', 'Healthy lifestyle', 'Body transformation', 'Gym life'],
        behaviors: ['Fitness enthusiasts', 'Active lifestyle', 'Health conscious'],
      },
      youtube: {
        topics: ['Health & Fitness', 'Sports', 'Lifestyle'],
        placements: ['Fitness channels', 'Workout channels', 'Health & wellness channels'],
        keywords: ['workout', 'gym motivation', 'fitness transformation', 'exercise routine', 'home workout'],
        inMarketAudiences: ['Fitness services', 'Gym memberships'],
      },
      general: {
        bestDays: ['Sunday', 'Monday', 'Tuesday'],
        bestTimes: ['6am-8am', '5pm-8pm'],
        seasonality: 'Peak in January (New Year), May (summer bodies), September (back to routine). Low in December',
        budgetRange: { min: 15, max: 45, currency: 'USD' },
      },
    },
  },

  // DEFAULT FALLBACK
  {
    id: 'general',
    name: 'General Local Business',
    keywords: [],
    audience: {
      primary: 'Local customers seeking quality products/services',
      demographics: 'Adults 25-65 in service area',
      psychographics: 'Value quality, support local, want reliable service',
      painPoints: ['Finding trustworthy businesses', 'Quality consistency', 'Customer service issues', 'Value for money'],
      desires: ['Quality product/service', 'Great experience', 'Reliable business', 'Personal touch'],
    },
    visualStyle: {
      mood: 'Professional, trustworthy, welcoming, authentic',
      colors: 'Professional blues and greens, warm accents',
      lighting: 'Bright, clean, natural',
      subjects: ['Team at work', 'Happy customers', 'Quality products/service', 'Business exterior', 'Behind the scenes'],
      avoid: ['Generic stock photos', 'Empty spaces', 'Overly corporate feel', 'Low quality images'],
    },
    copyFrameworks: {
      headlines: [
        'Quality You Can Count On',
        'Your Local [Service] Experts',
        'Proudly Serving [City] for [X] Years',
        'Where Quality Meets Service',
        'Experience the Difference',
      ],
      hooks: [
        'What makes us different from the rest?',
        'The reason our customers keep coming back',
        'Why [city] trusts us for [service]',
        'See why we have X 5-star reviews',
        'The [service] experience you deserve',
      ],
      ctas: [
        'Get Your Free Quote',
        'Contact Us Today',
        'Learn More',
        'Schedule Appointment',
        'Visit Us Today',
      ],
      hashtags: ['#smallbusiness', '#local', '#supportlocal', '#qualityservice', '#shoplocal'],
    },
    platformStrategy: {
      facebook: { focus: 'Community presence', format: 'Updates, reviews, community involvement', tone: 'Friendly neighbor' },
      instagram: { focus: 'Visual storytelling', format: 'Products/services, team, behind-scenes', tone: 'Authentic, personal' },
      youtube: { focus: 'About the business', format: 'How-tos, about us, customer stories', tone: 'Helpful expert' },
      tiktok: { focus: 'Personality and trends', format: 'Day-in-life, trending sounds, quick tips', tone: 'Fun, authentic' },
    },
    targeting: {
      facebook: {
        ageRange: { min: 25, max: 65 },
        genders: ['all'],
        interests: ['Local businesses', 'Shopping', 'Community events', 'Small business support'],
        behaviors: ['Local shoppers', 'Small business supporters', 'Recently moved', 'Community engaged'],
        excludeInterests: ['Competitors in area'],
        customAudiences: ['Past customers', 'Website visitors', 'Email subscribers'],
      },
      google: {
        searchKeywords: ['[service] near me', 'best [service] in [city]', 'local [service]', '[service] reviews', '[service] open now'],
        negativeKeywords: ['[service] jobs', '[service] careers', '[service] training', 'how to become a [service]'],
        displayTopics: ['Local', 'Shopping', 'Services'],
        inMarketAudiences: ['Local services', 'Business services'],
        affinity: ['Shoppers', 'Local enthusiasts', 'Small business supporters'],
      },
      tiktok: {
        ageRange: { min: 20, max: 45 },
        interests: ['Local businesses', 'Small business', 'Shop local', 'Community'],
        behaviors: ['Local explorers', 'Small business supporters'],
        creatorCategories: ['Lifestyle', 'Business', 'Local'],
      },
      instagram: {
        ageRange: { min: 22, max: 55 },
        interests: ['Local businesses', 'Shop local', 'Community', 'Lifestyle'],
        behaviors: ['Local shoppers', 'Community engaged', 'Small business supporters'],
      },
      youtube: {
        topics: ['Local', 'Business', 'How-to'],
        placements: ['Local channels', 'Business channels', 'Review channels'],
        keywords: ['local business', 'small business', '[city] business', 'best [service]'],
        inMarketAudiences: ['Local services', 'Business services'],
      },
      general: {
        bestDays: ['Tuesday', 'Wednesday', 'Thursday', 'Saturday'],
        bestTimes: ['9am-11am', '12pm-2pm', '6pm-8pm'],
        seasonality: 'Varies by business type. Consider local events, holidays, and seasonal demand',
        budgetRange: { min: 15, max: 50, currency: 'USD' },
      },
    },
  },
]

// Helper function to find the best matching industry profile
export function findIndustryProfile(businessType: string, businessName: string, services: string[]): IndustryProfile {
  const searchText = `${businessType} ${businessName} ${services.join(' ')}`.toLowerCase()

  for (const profile of INDUSTRY_PROFILES) {
    for (const keyword of profile.keywords) {
      if (searchText.includes(keyword.toLowerCase())) {
        return profile
      }
    }
  }

  return INDUSTRY_PROFILES.find(p => p.id === 'general')!
}

// Platform specifications for ad sizing
export const PLATFORM_SPECS = {
  facebook: {
    name: 'Facebook',
    icon: 'facebook',
    color: '#1877F2',
    imageFormats: [
      { name: 'Feed Post', width: 1200, height: 1200, ratio: '1:1' },
      { name: 'Feed Landscape', width: 1200, height: 628, ratio: '1.91:1' },
      { name: 'Story/Reels', width: 1080, height: 1920, ratio: '9:16' },
      { name: 'Carousel', width: 1080, height: 1080, ratio: '1:1' },
    ],
    videoFormats: [
      { name: 'Feed Video', width: 1080, height: 1080, ratio: '1:1', duration: '15-60s' },
      { name: 'Story/Reels', width: 1080, height: 1920, ratio: '9:16', duration: '15-60s' },
      { name: 'In-Stream', width: 1280, height: 720, ratio: '16:9', duration: '5-15s' },
    ],
    bestPractices: [
      'Lead with value in first 3 seconds',
      'Include captions (85% watch without sound)',
      'Use faces and emotion',
      'Clear CTA in image/video',
    ],
  },
  instagram: {
    name: 'Instagram',
    icon: 'instagram',
    color: '#E4405F',
    imageFormats: [
      { name: 'Feed Square', width: 1080, height: 1080, ratio: '1:1' },
      { name: 'Feed Portrait', width: 1080, height: 1350, ratio: '4:5' },
      { name: 'Story/Reels', width: 1080, height: 1920, ratio: '9:16' },
      { name: 'Carousel', width: 1080, height: 1080, ratio: '1:1' },
    ],
    videoFormats: [
      { name: 'Reels', width: 1080, height: 1920, ratio: '9:16', duration: '15-90s' },
      { name: 'Feed Video', width: 1080, height: 1080, ratio: '1:1', duration: '3-60s' },
      { name: 'Story', width: 1080, height: 1920, ratio: '9:16', duration: '15s max' },
    ],
    bestPractices: [
      'Hook in first 1-2 seconds',
      'Vertical video performs best',
      'Trending audio boosts reach',
      'Aesthetic consistency matters',
    ],
  },
  youtube: {
    name: 'YouTube',
    icon: 'youtube',
    color: '#FF0000',
    imageFormats: [
      { name: 'Thumbnail', width: 1280, height: 720, ratio: '16:9' },
      { name: 'Display Ad', width: 300, height: 250, ratio: '1.2:1' },
    ],
    videoFormats: [
      { name: 'Standard Video', width: 1920, height: 1080, ratio: '16:9', duration: '30s-3min' },
      { name: 'Shorts', width: 1080, height: 1920, ratio: '9:16', duration: '15-60s' },
      { name: 'Bumper Ad', width: 1920, height: 1080, ratio: '16:9', duration: '6s max' },
      { name: 'Skippable Ad', width: 1920, height: 1080, ratio: '16:9', duration: '12s-3min' },
    ],
    bestPractices: [
      'Hook viewers in first 5 seconds (before skip)',
      'Deliver value immediately',
      'Clear branding throughout',
      'Strong CTA at multiple points',
    ],
  },
  tiktok: {
    name: 'TikTok',
    icon: 'tiktok',
    color: '#000000',
    imageFormats: [
      { name: 'In-Feed Image', width: 1080, height: 1920, ratio: '9:16' },
    ],
    videoFormats: [
      { name: 'In-Feed Video', width: 1080, height: 1920, ratio: '9:16', duration: '9-15s optimal' },
      { name: 'TopView', width: 1080, height: 1920, ratio: '9:16', duration: '5-60s' },
      { name: 'Spark Ads', width: 1080, height: 1920, ratio: '9:16', duration: '9-15s optimal' },
    ],
    bestPractices: [
      'Hook in first 1 second',
      'Native/authentic feel crucial',
      'Trending sounds boost reach 30%+',
      'Text overlays for silent viewing',
    ],
  },
  google: {
    name: 'Google Ads',
    icon: 'google',
    color: '#4285F4',
    imageFormats: [
      { name: 'Square', width: 1200, height: 1200, ratio: '1:1' },
      { name: 'Landscape', width: 1200, height: 628, ratio: '1.91:1' },
      { name: 'Portrait', width: 960, height: 1200, ratio: '4:5' },
    ],
    videoFormats: [
      { name: 'YouTube Ad', width: 1920, height: 1080, ratio: '16:9', duration: '15-30s' },
    ],
    bestPractices: [
      'Clear value proposition',
      'Minimal text on images',
      'Consistent branding',
      'High contrast CTA button',
    ],
  },
}

// Deep Platform Psychology - The REAL differences between platforms
export const PLATFORM_PSYCHOLOGY = {
  facebook: {
    name: 'Facebook',
    audienceAge: '35-65+',
    audienceDescription: 'Older adults, parents, homeowners, established professionals',
    userBehavior: 'Scroll slowly, read captions, value information, share with family',
    attentionSpan: '3-5 seconds to hook, willing to watch longer content',
    contentExpectation: 'Informative, trustworthy, community-oriented, family-friendly',
    visualStyle: {
      aesthetic: 'Clean, professional, warm, trustworthy',
      colors: 'Blues (trust), greens (growth), warm earth tones, conservative palette',
      lighting: 'Bright, natural, warm - like a well-lit home or office',
      subjects: 'Real people (not models), families, professionals at work, before/after results',
      mood: 'Reliable, established, community-focused, practical',
      avoid: 'Trendy filters, chaotic compositions, overly youthful energy, meme formats',
    },
    copyStyle: {
      tone: 'Professional but warm, like talking to a trusted neighbor',
      length: 'Medium to long - they will read if valuable',
      format: 'Clear paragraphs, bullet points, complete sentences',
      cta: 'Direct and clear - "Call Now", "Get Free Quote", "Learn More"',
      emoji: 'Minimal - checkmarks, phone, professional symbols only',
    },
    whatWorks: 'Trust signals, testimonials, before/after, educational content, community involvement',
    whatFails: 'Trendy slang, chaotic energy, anything that feels "too young", clickbait',
  },
  instagram: {
    name: 'Instagram',
    audienceAge: '18-40',
    audienceDescription: 'Young professionals, lifestyle-focused, aesthetically-driven, aspirational',
    userBehavior: 'Fast scroll, judge in 0.5 seconds, save for later, influenced by aesthetics',
    attentionSpan: '1-2 seconds to hook, visual-first judgment',
    contentExpectation: 'Beautiful, aspirational, lifestyle-integrated, Instagram-worthy',
    visualStyle: {
      aesthetic: 'Polished, curated, magazine-quality, lifestyle-focused',
      colors: 'Cohesive palette, trending colors, high contrast or soft pastels',
      lighting: 'Golden hour, studio quality, aesthetic and intentional',
      subjects: 'Lifestyle moments, aspirational scenes, beautiful results, influencer-style',
      mood: 'Aspirational, desirable, "I want that life" feeling',
      avoid: 'Cluttered images, poor lighting, corporate stock photos, text-heavy images',
    },
    copyStyle: {
      tone: 'Casual, relatable, lifestyle-focused, slightly aspirational',
      length: 'Short hook + optional longer caption (most wont read past line 2)',
      format: 'Line breaks for readability, storytelling style',
      cta: 'Soft CTAs - "Link in bio", "DM us", "Save this for later"',
      emoji: 'Liberal use, adds personality: ✨💫🙌',
    },
    whatWorks: 'Aesthetic transformations, lifestyle integration, relatable moments, trending formats',
    whatFails: 'Corporate messaging, walls of text, ugly visuals, desperate sales pitches',
  },
  tiktok: {
    name: 'TikTok',
    audienceAge: '16-35',
    audienceDescription: 'Gen Z and young millennials, entertainment-first, trend-aware, authenticity-obsessed',
    userBehavior: 'Extremely fast scroll, judge in 0.3 seconds, skip immediately if bored, reward authenticity',
    attentionSpan: '0.5-1 second to hook - BRUTAL. If not hooked instantly, they scroll.',
    contentExpectation: 'Raw, authentic, entertaining, NOT polished, trend-aware, human',
    visualStyle: {
      aesthetic: 'Raw, unpolished, authentic, filmed-on-phone look, NOT professional',
      colors: 'Natural, unfiltered, or trending filter of the moment',
      lighting: 'Natural/phone lighting, NOT studio - too polished = instant skip',
      subjects: 'Real person talking to camera, POV shots, behind-scenes, raw moments',
      mood: 'Authentic, relatable, slightly chaotic, human, entertaining',
      avoid: 'Corporate polish, stock photos, overly produced content, anything that feels like an "ad"',
    },
    copyStyle: {
      tone: 'Ultra-casual, conversational, trend-aware, slightly unhinged energy OK',
      length: 'VERY short - they read fast. 1-2 sentences max on screen',
      format: 'Text overlays synced to video, punchy phrases',
      cta: 'Casual - "Follow for more", "Link in bio if you need this"',
      emoji: 'Trendy use, but text overlays more common than captions',
    },
    whatWorks: 'Authenticity, trending sounds, POV format, satisfying content, story time, humor',
    whatFails: 'Polished ads, corporate speak, anything that feels scripted or fake',
  },
  youtube: {
    name: 'YouTube',
    audienceAge: '25-55',
    audienceDescription: 'Intentional viewers actively seeking content, researchers, learners',
    userBehavior: 'Actively chose to watch, willing to invest time, searching for value',
    attentionSpan: '5 seconds before skip button, but will watch 10+ minutes if valuable',
    contentExpectation: 'Valuable, educational, worth their time, professional but personal',
    visualStyle: {
      aesthetic: 'Professional but approachable, good production quality expected',
      colors: 'Clean, readable, good contrast for thumbnails',
      lighting: 'Professional lighting expected, shows you take content seriously',
      subjects: 'Talking head, demonstrations, tutorials, storytelling visuals',
      mood: 'Expert but relatable, helpful, trustworthy educator',
      avoid: 'Clickbait that doesnt deliver, poor audio quality, wasting their time',
    },
    copyStyle: {
      tone: 'Educational, helpful, expert positioning, conversational',
      length: 'Can be longer - they came to learn',
      format: 'Clear structure, chapters, value-first',
      cta: 'Subscribe, like, comment - plus clear business CTA',
      emoji: 'Thumbnails use them strategically, descriptions minimal',
    },
    whatWorks: 'Value delivery, expertise demonstration, solving problems, tutorials',
    whatFails: 'Wasting time, clickbait without delivery, poor production quality',
  },
  google: {
    name: 'Google Ads',
    audienceAge: '25-65',
    audienceDescription: 'Active searchers with intent, ready to take action',
    userBehavior: 'Searching for solutions, high intent, comparing options',
    attentionSpan: '1-2 seconds - scanning search results quickly',
    contentExpectation: 'Clear, direct, answers their search query, trustworthy',
    visualStyle: {
      aesthetic: 'Clean, professional, high contrast, readable',
      colors: 'Brand colors with high contrast CTA buttons',
      lighting: 'Clean, professional product/service photography',
      subjects: 'Clear product/service representation, trust badges, results',
      mood: 'Professional, trustworthy, direct, solution-focused',
      avoid: 'Cluttered designs, unclear value proposition, stock photo clichés',
    },
    copyStyle: {
      tone: 'Direct, benefit-focused, keyword-aware',
      length: 'Concise - every word must earn its place',
      format: 'Headline + value prop + CTA',
      cta: 'Action-oriented: "Get Quote", "Call Now", "Book Today"',
      emoji: 'None or minimal',
    },
    whatWorks: 'Clear value proposition, trust signals, strong CTAs, keyword relevance',
    whatFails: 'Vague messaging, weak CTAs, irrelevant to search intent',
  },
}

// Ad copy templates
export interface AdCopyTemplate {
  platform: string
  format: string
  structure: {
    hook: string
    body: string
    cta: string
    hashtags?: string
  }
}

export function generateAdCopy(
  industry: IndustryProfile,
  businessName: string,
  services: string[],
  city: string,
  platform: 'facebook' | 'instagram' | 'youtube' | 'tiktok'
): { headline: string; body: string; cta: string; hashtags: string[] } {
  const strategy = industry.platformStrategy[platform]
  const serviceList = services.slice(0, 3).join(', ')

  const headlines = industry.copyFrameworks.headlines.map(h =>
    h.replace('[Year]', '2024').replace('[X]', '15+')
  )
  const hooks = industry.copyFrameworks.hooks
  const ctas = industry.copyFrameworks.ctas

  // Randomly select but in a deterministic way based on business name
  const seed = businessName.length
  const headline = headlines[seed % headlines.length]
  const hook = hooks[(seed + 1) % hooks.length]
  const cta = ctas[(seed + 2) % ctas.length]

  let body = ''
  switch (platform) {
    case 'facebook':
      body = `${hook}\n\n${businessName} brings you ${strategy.focus.toLowerCase()}. Serving ${city} with:\n✓ ${services[0] || 'Quality service'}\n✓ ${services[1] || 'Expert team'}\n✓ ${services[2] || 'Customer satisfaction'}\n\n${cta}`
      break
    case 'instagram':
      body = `${hook}\n\n${businessName} | ${city}\n${serviceList}\n\n${cta} 👇`
      break
    case 'youtube':
      body = `${hook}\n\n${businessName} has been serving ${city} with professional ${industry.name.toLowerCase()}. Whether you need ${services[0]?.toLowerCase() || 'expert help'} or ${services[1]?.toLowerCase() || 'quality service'}, our team is here for you.\n\n${cta} - Link in description!`
      break
    case 'tiktok':
      body = `${hook} ${businessName} ${city} ${cta}`
      break
  }

  return {
    headline,
    body,
    cta,
    hashtags: [...industry.copyFrameworks.hashtags, `#${city.toLowerCase().replace(/\s/g, '')}`, '#ad'],
  }
}

// ===========================================
// INDUSTRY-SPECIFIC VISUAL SCENARIOS
// ===========================================
// Concrete, detailed image descriptions for each industry + image type
// These replace vague descriptions with specific, DALL-E-ready scenes

interface IndustryVisualScenarios {
  hero: {
    person: string
    setting: string
    props: string
    expression: string
  }
  service: {
    action: string
    details: string
    tools: string
    result: string
  }
  testimonial: {
    customer: string
    location: string
    proof: string
    emotion: string
  }
  promo: {
    scene: string
    urgency: string
    value: string
  }
}

const INDUSTRY_VISUAL_SCENARIOS: Record<string, IndustryVisualScenarios> = {
  plumbing: {
    hero: {
      person: 'experienced plumber in crisp blue uniform shirt with embroidered company logo, tool belt around waist',
      setting: 'standing in front of white service van with ladder rack, residential neighborhood visible',
      props: 'professional clipboard in hand, wrench visible on belt, clean work boots',
      expression: 'confident smile, direct eye contact, trustworthy dad-next-door energy',
    },
    service: {
      action: 'hands installing gleaming chrome faucet, or repairing copper pipes with precision torch work',
      details: 'water droplets catching light, pipe fittings perfectly aligned, blue shop towels nearby',
      tools: 'pipe wrench, adjustable pliers, leak detection equipment, bright LED work light',
      result: 'pristine white sink basin, gleaming fixtures, perfectly sealed joints, no water spots',
    },
    testimonial: {
      customer: 'relieved homeowner in their 50s, casual home clothes',
      location: 'standing in updated bathroom or kitchen, new fixtures visible behind them',
      proof: 'gesturing toward new water heater or repaired sink with gratitude',
      emotion: 'genuine relief and happiness, "my emergency is solved" expression',
    },
    promo: {
      scene: 'dramatic water leak being stopped, or beautiful new bathroom fixtures installed',
      urgency: '24/7 emergency response theme, water damage prevention',
      value: 'before/after transformation, old rusty pipes vs new copper',
    },
  },
  hvac: {
    hero: {
      person: 'HVAC technician in professional polo shirt, safety glasses pushed up on forehead',
      setting: 'next to modern high-efficiency AC unit, clean mechanical room or rooftop',
      props: 'digital manifold gauges, tablet for diagnostics, clean uniform',
      expression: 'knowledgeable and approachable, technical expert energy',
    },
    service: {
      action: 'hands adjusting thermostat wiring, or installing sleek ductless mini-split unit',
      details: 'clean ductwork, organized wiring, digital readouts showing optimal temperatures',
      tools: 'manifold gauges with blue and red hoses, refrigerant recovery machine, multimeter',
      result: 'modern smart thermostat glowing, family comfortable in background, frost-free coils',
    },
    testimonial: {
      customer: 'comfortable family in living room, light clothing suggesting perfect temperature',
      location: 'cozy home interior, subtle view of modern thermostat on wall',
      proof: 'relaxed posture indicating comfort, maybe holding warm drink in winter or cold drink in summer',
      emotion: 'comfortable contentment, no more sweating or shivering',
    },
    promo: {
      scene: 'split image of sweating person vs comfortable person, or old unit vs new efficient unit',
      urgency: 'seasonal urgency - beating the summer heat or winter freeze',
      value: 'energy bills comparison, rebate themes, efficiency ratings',
    },
  },
  electrical: {
    hero: {
      person: 'licensed electrician in safety-conscious attire, insulated gloves tucked in belt',
      setting: 'standing by modern electrical panel with neat wire organization visible',
      props: 'voltage tester, wire strippers, headlamp, safety glasses',
      expression: 'serious but approachable, safety-first professional',
    },
    service: {
      action: 'hands installing elegant recessed lighting, or wiring smart home panel',
      details: 'color-coded wires perfectly organized, junction box with clean connections',
      tools: 'wire strippers, voltage tester with green light, fish tape, level',
      result: 'beautiful chandelier illuminated, smart switches glowing, perfectly flush outlets',
    },
    testimonial: {
      customer: 'homeowner proudly showing off new lighting or home office setup',
      location: 'beautifully lit room, dramatic lighting transformation visible',
      proof: 'hand on new dimmer switch, or gesturing at pendant lights over island',
      emotion: 'pride in their upgraded space, impressed with the transformation',
    },
    promo: {
      scene: 'dramatic lighting transformation, dark room vs beautifully illuminated space',
      urgency: 'safety inspection themes, holiday lighting installation season',
      value: 'energy savings with LED upgrades, smart home convenience',
    },
  },
  roofing: {
    hero: {
      person: 'roofing contractor in polo shirt, hard hat in hand or on head',
      setting: 'standing before completed roof with dimensional shingles, ladder visible',
      props: 'drone for inspections, tablet with roof diagram, safety harness',
      expression: 'confident, weather-tough, reliable neighbor energy',
    },
    service: {
      action: 'skilled hands laying architectural shingles in perfect alignment, or sealing flashing',
      details: 'crisp shingle lines, copper flashing around chimney, proper nail placement visible',
      tools: 'pneumatic nail gun, chalk line, roofing hammer, magnetic sweeper',
      result: 'aerial view of pristine new roof, clean gutters, perfect ridge cap line',
    },
    testimonial: {
      customer: 'homeowner standing in driveway looking up at their new roof with satisfaction',
      location: 'curb appeal shot showing beautiful home exterior with new roof',
      proof: 'pointing at roof or holding inspection report, new gutters visible',
      emotion: 'relief and pride, protected home feeling',
    },
    promo: {
      scene: 'dramatic storm damage vs repaired roof, or aging roof vs beautiful new installation',
      urgency: 'storm season preparation, winter leak prevention',
      value: 'insurance claim assistance, warranty protection, curb appeal boost',
    },
  },
  landscaping: {
    hero: {
      person: 'landscape designer in earth-toned work clothes, work gloves tucked in back pocket',
      setting: 'standing in beautifully designed garden, stone pathway visible',
      props: 'landscape plan rolled under arm, pruning shears, quality work boots',
      expression: 'creative and capable, artistic yet hardworking energy',
    },
    service: {
      action: 'hands planting vibrant flowers in prepared bed, or laying natural stone pavers',
      details: 'rich dark mulch, color-coordinated plantings, drip irrigation visible',
      tools: 'quality spade, landscape rake, soil amendment bags, measuring tape',
      result: 'lush green lawn with crisp edges, blooming flower beds, elegant hardscape',
    },
    testimonial: {
      customer: 'proud homeowner relaxing on new patio, enjoying transformed backyard',
      location: 'beautiful outdoor living space, string lights or fire pit visible',
      proof: 'holding drink on new patio, kids playing on perfect lawn in background',
      emotion: 'pure enjoyment of their outdoor oasis, entertaining-ready pride',
    },
    promo: {
      scene: 'dramatic before/after yard transformation, overgrown mess vs paradise',
      urgency: 'spring planting season, fall cleanup, holiday lighting installation',
      value: 'curb appeal transformation, outdoor living lifestyle upgrade',
    },
  },
  legal: {
    hero: {
      person: 'attorney in tailored suit, confident but approachable demeanor',
      setting: 'professional office with law books visible, warm wood tones',
      props: 'elegant pen, quality leather portfolio, subtle diplomas on wall',
      expression: 'authoritative yet compassionate, "I will fight for you" energy',
    },
    service: {
      action: 'attorney reviewing documents with client, pointing at important clause',
      details: 'legal documents, quality conference table, professional lighting',
      tools: 'elegant pen, legal pad with notes, laptop showing case research',
      result: 'signed settlement, handshake of resolution, relieved client',
    },
    testimonial: {
      customer: 'relieved client outside courthouse or in attorney office',
      location: 'law office lobby, courthouse steps, or professional meeting room',
      proof: 'holding favorable verdict document, or shaking hands with attorney',
      emotion: 'justice served relief, vindication, weight lifted off shoulders',
    },
    promo: {
      scene: 'powerful imagery of justice scales, gavel, or confident attorney ready to fight',
      urgency: 'statute of limitations warning, free consultation offer',
      value: 'no win no fee messaging, millions recovered, justice served',
    },
  },
  dental: {
    hero: {
      person: 'friendly dentist in modern scrubs or white coat, warm smile showing perfect teeth',
      setting: 'modern dental office with contemporary design, calming colors',
      props: 'latest dental technology visible, ergonomic chair, gentle lighting',
      expression: 'warm, caring, "I make this painless" reassuring energy',
    },
    service: {
      action: 'gentle examination with patient at ease, or showing whitening results in mirror',
      details: 'modern equipment, patient comfort visible, sterile but not clinical',
      tools: 'intraoral camera, modern overhead light, digital x-ray display',
      result: 'brilliant white smile close-up, perfect teeth, confident happy patient',
    },
    testimonial: {
      customer: 'beaming patient showing off new smile, natural happy expression',
      location: 'modern dental office or lifestyle setting showing off results',
      proof: 'pointing to smile, before/after comparison, hand mirror reflection',
      emotion: 'confidence restored, cant stop smiling, life-changing happiness',
    },
    promo: {
      scene: 'stunning smile transformation, whitening results, or Invisalign progress',
      urgency: 'new patient specials, year-end insurance benefits expiring',
      value: 'free whitening, consultation offers, financing available',
    },
  },
  medical: {
    hero: {
      person: 'caring physician in white coat with stethoscope, genuine warm expression',
      setting: 'modern medical office, clean and welcoming, not sterile-cold',
      props: 'stethoscope, tablet for patient records, calming artwork visible',
      expression: 'compassionate listener, knowledgeable healer, trustworthy caregiver',
    },
    service: {
      action: 'doctor listening to patient with full attention, or explaining results kindly',
      details: 'modern exam room, patient-centered care visible, comfortable setting',
      tools: 'stethoscope, blood pressure cuff, modern diagnostic equipment',
      result: 'reassured patient, clear diagnosis, treatment plan in hand',
    },
    testimonial: {
      customer: 'healthy patient with family, active lifestyle, vitality restored',
      location: 'outdoor active setting or cozy home, showing quality of life',
      proof: 'active with grandchildren, exercising, enjoying life fully',
      emotion: 'gratitude for health, energy restored, enjoying life again',
    },
    promo: {
      scene: 'welcoming office entrance, accepting new patients imagery',
      urgency: 'annual checkup reminders, flu season, wellness visits',
      value: 'same-day appointments, telehealth convenience, accepting insurance',
    },
  },
  accounting: {
    hero: {
      person: 'professional CPA in business attire, confident and approachable',
      setting: 'modern office with clean desk, dual monitors showing data',
      props: 'professional calculator, organized files, credentials visible',
      expression: 'sharp analytical mind meets personable advisor, trustworthy with your money',
    },
    service: {
      action: 'reviewing financial statements with client, showing tax savings opportunities',
      details: 'organized spreadsheets, charts showing growth, neat documentation',
      tools: 'professional software on screen, quality pen, financial reports',
      result: 'relieved client seeing refund, business growth charts, organized books',
    },
    testimonial: {
      customer: 'successful small business owner or relieved individual taxpayer',
      location: 'their thriving business, or comfortable home showing financial peace',
      proof: 'holding refund check, or showing business growth, relaxed about finances',
      emotion: 'financial peace of mind, stress-free about taxes, business confidence',
    },
    promo: {
      scene: 'tax deadline calendar, organized vs chaotic desk comparison',
      urgency: 'tax deadline countdown, quarterly filing reminders, year-end planning',
      value: 'maximize refund, audit protection, free consultation',
    },
  },
  realestate: {
    hero: {
      person: 'polished real estate agent in professional attire, warm confident smile',
      setting: 'standing before beautiful home entrance or in stunning property',
      props: 'tablet with listings, elegant keybox, professional signage',
      expression: 'trustworthy guide, local expert, "I will find your dream home" energy',
    },
    service: {
      action: 'showing home features to excited buyers, or handing keys to new homeowners',
      details: 'beautiful home interior, staging highlights, natural light flooding rooms',
      tools: 'tablet showing listings, professional camera for photos, measuring tape',
      result: 'SOLD sign on beautiful property, happy family at new front door',
    },
    testimonial: {
      customer: 'ecstatic new homeowners holding keys, family celebrating',
      location: 'front porch of their new home, or inside empty house ready to move in',
      proof: 'holding keys, SOLD sign visible, standing at threshold of new chapter',
      emotion: 'dream achieved, overwhelming joy, new chapter beginning',
    },
    promo: {
      scene: 'stunning property showcase, just listed urgency, market opportunity',
      urgency: 'hot market conditions, interest rate timing, just listed',
      value: 'free home valuation, sold over asking, multiple offers',
    },
  },
  restaurant: {
    hero: {
      person: 'passionate chef in pristine whites and toque, or welcoming owner at entrance',
      setting: 'beautiful restaurant interior, warm lighting, inviting ambiance',
      props: 'signature dish presentation, quality glassware, elegant decor',
      expression: 'passionate about food, welcoming host, proud of their craft',
    },
    service: {
      action: 'chef plating beautiful dish with precision, or flames in action on pan',
      details: 'colorful fresh ingredients, steam rising, artistic plating',
      tools: 'quality cookware, fresh herbs, professional plating tweezers',
      result: 'stunning finished plate, food photography worthy presentation',
    },
    testimonial: {
      customer: 'happy diners enjoying meal together, celebration moment',
      location: 'beautiful table setting, restaurant atmosphere, good lighting',
      proof: 'phones out photographing food, clean plates, wine glasses raised',
      emotion: 'food joy, celebration, memorable dining experience',
    },
    promo: {
      scene: 'signature dish hero shot, seasonal special, date night ambiance',
      urgency: 'limited time menu, reservation availability, special event',
      value: 'special offers, prix fixe menu, celebration packages',
    },
  },
  fitness: {
    hero: {
      person: 'fit trainer in athletic wear, energetic and motivating presence',
      setting: 'modern gym floor or studio, quality equipment visible',
      props: 'resistance bands, kettlebells, fitness tracker, water bottle',
      expression: 'motivating energy, "you can do this" encouragement, approachable athlete',
    },
    service: {
      action: 'trainer guiding client through exercise with perfect form correction',
      details: 'proper alignment, focused concentration, supportive spotting',
      tools: 'free weights, resistance bands, exercise mat, foam roller',
      result: 'transformation progress, strong confident pose, achievement moment',
    },
    testimonial: {
      customer: 'transformed member showing progress, confident in workout clothes',
      location: 'gym setting or active lifestyle moment showing new capabilities',
      proof: 'before/after comparison, lifting heavier, running further, confident pose',
      emotion: 'pride in transformation, body confidence, life changed',
    },
    promo: {
      scene: 'energetic class in action, transformation results, motivating group energy',
      urgency: 'new year resolution, summer body, limited membership spots',
      value: 'free trial, no enrollment fee, transformation challenge',
    },
  },
  general: {
    hero: {
      person: 'professional business owner in appropriate attire for their industry',
      setting: 'clean professional environment representing their business',
      props: 'tools or items relevant to their specific trade',
      expression: 'confident, trustworthy, professional yet approachable',
    },
    service: {
      action: 'skilled hands performing the core service with expertise',
      details: 'quality materials, attention to detail, professional standards',
      tools: 'professional-grade equipment specific to the trade',
      result: 'completed quality work, satisfied outcome, professional finish',
    },
    testimonial: {
      customer: 'satisfied customer appropriate to the demographic',
      location: 'relevant setting showing the service results',
      proof: 'visible evidence of quality service received',
      emotion: 'genuine satisfaction, trust validated, would recommend',
    },
    promo: {
      scene: 'compelling service imagery with space for promotional text',
      urgency: 'seasonal relevance or limited time nature',
      value: 'clear value proposition visualization',
    },
  },
}

// Helper to get industry scenarios (with fallback to general)
function getIndustryScenarios(industryId: string): IndustryVisualScenarios {
  return INDUSTRY_VISUAL_SCENARIOS[industryId] || INDUSTRY_VISUAL_SCENARIOS.general
}

// ===========================================
// PLATFORM CAMERA/QUALITY SPECIFICATIONS
// ===========================================
// Specific technical instructions for each platform's visual style

const PLATFORM_CAMERA_SPECS: Record<string, {
  camera: string
  lighting: string
  quality: string
  postProcessing: string
  doNot: string
}> = {
  facebook: {
    camera: 'Professional DSLR, 50mm lens, f/2.8 aperture, eye-level angle',
    lighting: 'Soft natural window light or professional softbox, warm color temperature 5500K',
    quality: 'Sharp focus on subject, gentle background bokeh, high resolution',
    postProcessing: 'Minimal editing, true-to-life colors, slight warmth added',
    doNot: 'No heavy filters, no artificial HDR, no glamour retouching',
  },
  instagram: {
    camera: 'Professional mirrorless or high-end phone camera, varied creative angles',
    lighting: 'Golden hour natural light, or dramatic studio lighting with shadows',
    quality: 'Magazine-editorial quality, intentional composition, color graded',
    postProcessing: 'Cohesive color grading (warm tones or moody), enhanced contrast, lifestyle aesthetic',
    doNot: 'No flat lighting, no boring angles, no unintentional elements in frame',
  },
  tiktok: {
    camera: 'iPhone or Samsung phone camera, slightly grainy, selfie or handheld POV',
    lighting: 'Ring light visible in eyes, or natural phone flash, slightly overexposed',
    quality: 'Authentically imperfect, slight motion blur acceptable, vertical framing',
    postProcessing: 'Minimal or none - raw phone camera output, maybe a basic filter',
    doNot: 'NO professional photography look, NO perfect lighting, NO studio setup visible',
  },
  youtube: {
    camera: 'YouTube creator setup - Sony/Canon mirrorless, 24mm wide angle, high contrast',
    lighting: 'Three-point lighting setup, key light visible, clean shadows',
    quality: 'Thumbnail-optimized: high contrast, saturated colors, clear at small size',
    postProcessing: 'Boosted saturation, sharpened, high contrast, pop off the page',
    doNot: 'No muted colors, no low contrast, no details that disappear at thumbnail size',
  },
  google: {
    camera: 'Commercial photography, medium format feel, perfectly balanced exposure',
    lighting: 'Clean professional lighting, no harsh shadows, even illumination',
    quality: 'Crisp, clean, professional stock photo quality but not generic',
    postProcessing: 'Clean white balance, professional color correction, conversion-optimized',
    doNot: 'No artistic filters, no mood lighting, no ambiguity about what is shown',
  },
}

// ===========================================
// DALL-E PROMPT GENERATOR - 10/10 VERSION
// ===========================================
// Fully utilizes industry data, platform specs, and business context

export function generateImagePrompt(
  industry: IndustryProfile,
  businessName: string,
  platform: 'facebook' | 'instagram' | 'youtube' | 'tiktok' | 'google',
  promptType: 'hero' | 'service' | 'testimonial' | 'promo'
): string {
  // Get all the rich data sources
  const industryStyle = industry.visualStyle
  const scenarios = getIndustryScenarios(industry.id)
  const cameraSpecs = PLATFORM_CAMERA_SPECS[platform]
  const specs = PLATFORM_SPECS[platform]
  const primaryFormat = specs.imageFormats[0]

  // Platform-specific age ranges for authenticity
  const ageRanges: Record<string, { worker: string; customer: string }> = {
    facebook: { worker: '42-58', customer: '45-65' },
    instagram: { worker: '28-38', customer: '26-40' },
    tiktok: { worker: '23-32', customer: '21-30' },
    youtube: { worker: '35-48', customer: '30-50' },
    google: { worker: '38-52', customer: '35-58' },
  }
  const ages = ageRanges[platform]

  // ===========================================
  // BUILD INDUSTRY-SPECIFIC VISUAL DESCRIPTION
  // ===========================================
  let mainSubject = ''
  let sceneDetails = ''
  let emotionalTone = ''
  let textSpace = ''

  if (promptType === 'hero') {
    const heroData = scenarios.hero
    mainSubject = `${heroData.person}, age ${ages.worker}`
    sceneDetails = `${heroData.setting}. Props: ${heroData.props}`
    emotionalTone = heroData.expression

    // Platform-specific hero adjustments
    if (platform === 'tiktok') {
      mainSubject = `Real authentic ${industry.name.toLowerCase()} worker, age ${ages.worker}, selfie-style, phone in hand, mid-conversation expression like they're about to share something with you`
      sceneDetails = `${heroData.setting}, but captured with phone camera - ring light reflection in eyes, slightly grainy`
    } else if (platform === 'instagram') {
      mainSubject = `Stylish modern ${heroData.person}, age ${ages.worker}, editorial lifestyle portrait`
      sceneDetails = `${heroData.setting} - elevated, aspirational version. Golden hour lighting, magazine-worthy composition`
    } else if (platform === 'youtube') {
      mainSubject = `Approachable expert: ${heroData.person}, age ${ages.worker}, ready to teach`
      textSpace = 'Clear space on right third for text overlay and subscribe button'
    }
  }

  if (promptType === 'service') {
    const serviceData = scenarios.service
    mainSubject = serviceData.action
    sceneDetails = `Details visible: ${serviceData.details}. Tools: ${serviceData.tools}. End result quality: ${serviceData.result}`
    emotionalTone = `Craftsmanship pride, quality visible, ${industryStyle.mood}`

    // Platform-specific service adjustments
    if (platform === 'tiktok') {
      mainSubject = `Oddly satisfying ${industry.name.toLowerCase()} moment: ${serviceData.action} - the kind of shot that loops perfectly`
      sceneDetails = `Raw phone capture of ${serviceData.details}, ASMR-worthy precision, satisfying transformation moment`
      emotionalTone = 'Addictively watchable, satisfying, viral-worthy moment'
    } else if (platform === 'instagram') {
      mainSubject = `Stunning beauty shot: ${serviceData.result} - magazine-quality finished work photography`
      sceneDetails = `${serviceData.details}, dramatic lighting highlighting quality, aesthetic composition`
      emotionalTone = 'Shareable, saveable, inspiration-worthy'
    } else if (platform === 'youtube') {
      mainSubject = `Tutorial-style demonstration: ${serviceData.action}`
      sceneDetails = `Clear view of ${serviceData.tools} being used, educational angle showing technique, ${serviceData.details}`
      textSpace = 'Clean area for "HOW TO" text overlay'
    }
  }

  if (promptType === 'testimonial') {
    const testimonialData = scenarios.testimonial
    mainSubject = `${testimonialData.customer}, age ${ages.customer}`
    sceneDetails = `Location: ${testimonialData.location}. Proof of service: ${testimonialData.proof}`
    emotionalTone = testimonialData.emotion

    // Platform-specific testimonial adjustments
    if (platform === 'tiktok') {
      mainSubject = `Real person age ${ages.customer} filming genuine reaction on their phone - ${testimonialData.customer} energy`
      sceneDetails = `Phone POV, showing off ${testimonialData.proof}, authentic excitement, slightly shaky authentic feel`
      emotionalTone = `Genuine "OMG you have to see this" energy, ${testimonialData.emotion}`
    } else if (platform === 'instagram') {
      mainSubject = `Stylish happy customer, age ${ages.customer}, lifestyle portrait with results visible`
      sceneDetails = `Beautiful setting: ${testimonialData.location}, ${testimonialData.proof} visible, elevated lifestyle moment`
      emotionalTone = `Aspirational satisfaction - "this could be my life"`
    } else if (platform === 'facebook') {
      mainSubject = `Relatable neighbor, ${testimonialData.customer}, age ${ages.customer}`
      sceneDetails = `Natural home setting: ${testimonialData.location}, genuine moment with ${testimonialData.proof}`
      emotionalTone = `"My neighbor recommended them and was right" - ${testimonialData.emotion}`
    }
  }

  if (promptType === 'promo') {
    const promoData = scenarios.promo
    mainSubject = promoData.scene
    sceneDetails = `Urgency theme: ${promoData.urgency}. Value shown: ${promoData.value}`
    emotionalTone = 'Excitement, limited time energy, must-act-now'
    textSpace = 'CRITICAL: 40% of image must be clean/simple area for promotional text overlay'

    // Platform-specific promo adjustments
    if (platform === 'tiktok') {
      mainSubject = `Attention-grabbing thumbnail moment: ${promoData.scene}`
      textSpace = 'Top or bottom 30% clean for "SALE" or deal text'
      emotionalTone = 'Curiosity-inducing, makes you want to tap'
    } else if (platform === 'youtube') {
      mainSubject = `High-contrast YouTube thumbnail: ${promoData.scene} with dramatic lighting`
      textSpace = 'Bold clear space for offer text, readable at small size'
      emotionalTone = 'Click-worthy, value-packed thumbnail energy'
    } else if (platform === 'google') {
      mainSubject = `Clean conversion-focused: ${promoData.scene}`
      textSpace = 'Prominent CTA button space, high contrast text area'
      emotionalTone = 'Professional value proposition, clear offer'
    }
  }

  // ===========================================
  // BUILD CONCISE, FRONT-LOADED DALL-E PROMPT
  // ===========================================
  // DALL-E works best with specific, front-loaded instructions

  const colorInstruction = industryStyle.colors.includes('Blue')
    ? industryStyle.colors
    : `Color palette: ${industryStyle.colors}`

  const avoidList = industryStyle.avoid.slice(0, 4).join(', ')

  // Build the prompt with most important info first
  let prompt = ''

  // LINE 1: The core subject (most important - DALL-E weighs early text heavily)
  prompt += `${mainSubject}.\n\n`

  // LINE 2: Scene and setting details
  prompt += `SCENE: ${sceneDetails}\n\n`

  // LINE 3: Technical camera/quality specs for this platform
  prompt += `CAMERA: ${cameraSpecs.camera}. ${cameraSpecs.lighting}. ${cameraSpecs.quality}.\n\n`

  // LINE 4: Industry-specific visual style
  prompt += `STYLE: ${industryStyle.mood}. ${colorInstruction}. Lighting: ${industryStyle.lighting}.\n\n`

  // LINE 5: Emotional tone
  prompt += `MOOD: ${emotionalTone}.\n\n`

  // LINE 6: Text space if needed (for promo/youtube)
  if (textSpace) {
    prompt += `COMPOSITION: ${textSpace}\n\n`
  }

  // LINE 7: Aspect ratio
  prompt += `FORMAT: ${primaryFormat.ratio} aspect ratio (${primaryFormat.width}x${primaryFormat.height}px), ${cameraSpecs.postProcessing}.\n\n`

  // LINE 8: What to avoid (keep short, DALL-E can ignore long negative lists)
  prompt += `AVOID: ${avoidList}, ${cameraSpecs.doNot}, generic stock photo feel, text/watermarks in image.`

  // Platform-specific final notes
  if (platform === 'tiktok') {
    prompt += ` CRITICAL: Must look like phone camera footage, NOT professional photography. Authentically imperfect.`
  }
  if (platform === 'instagram') {
    prompt += ` Make it beautiful enough to save and share.`
  }
  if (platform === 'youtube') {
    prompt += ` High contrast, readable at thumbnail size, bold and clear.`
  }
  if (platform === 'google') {
    prompt += ` Clean, professional, conversion-optimized, immediately understood.`
  }

  return prompt
}

// ===========================================
// 2026 VIDEO MARKETING FRAMEWORK
// ===========================================
// Complete system for modern short-form video ads

// HOOK TAXONOMY - 12 proven hook types for 2026
export const HOOK_TYPES = {
  pov: {
    name: 'POV Hook',
    format: 'POV: You just [situation]',
    examples: [
      'POV: You just found water under your sink',
      'POV: Your AC dies on the hottest day of the year',
      'POV: You finally called a real professional',
    ],
    bestFor: ['tiktok', 'instagram'],
    energy: 'Immersive, first-person, relatable',
  },
  controversy: {
    name: 'Hot Take / Controversy',
    format: '[Controversial opinion about industry]',
    examples: [
      'Most plumbers are overcharging you. Here\'s why.',
      'Stop calling the first contractor you find on Google.',
      'Your dentist isn\'t telling you this...',
    ],
    bestFor: ['tiktok', 'youtube'],
    energy: 'Bold, attention-grabbing, debate-starting',
  },
  storytime: {
    name: 'Storytime Hook',
    format: 'Storytime: [Intriguing situation]',
    examples: [
      'Storytime: A customer called us crying at 2am...',
      'Let me tell you about the worst job I ever saw',
      'This homeowner saved $5,000 because of one phone call',
    ],
    bestFor: ['tiktok', 'instagram', 'youtube'],
    energy: 'Narrative, curiosity-building, human',
  },
  didYouKnow: {
    name: 'Did You Know',
    format: 'Did you know [surprising fact]?',
    examples: [
      'Did you know a dripping faucet wastes 3,000 gallons a year?',
      'Most people don\'t know this about their roof...',
      '90% of homeowners make this mistake',
    ],
    bestFor: ['facebook', 'youtube', 'instagram'],
    energy: 'Educational, eye-opening, valuable',
  },
  thisOrThat: {
    name: 'This vs That',
    format: '[Option A] vs [Option B] - which would you choose?',
    examples: [
      '$200 repair now vs $5,000 replacement later',
      'DIY fix vs professional fix - watch this',
      'Cheap contractor vs licensed pro - the difference',
    ],
    bestFor: ['tiktok', 'instagram', 'facebook'],
    energy: 'Comparative, decision-making, engaging',
  },
  satisfying: {
    name: 'Satisfying Reveal',
    format: 'Watch this [satisfying action]',
    examples: [
      'Watch this drain finally clear',
      'The most satisfying roof clean you\'ll see today',
      'Before and after that\'ll blow your mind',
    ],
    bestFor: ['tiktok', 'instagram'],
    energy: 'Visual, addictive, shareable',
  },
  mistake: {
    name: 'Common Mistake',
    format: 'Stop doing [common mistake]',
    examples: [
      'Stop ignoring that small leak',
      'If you\'re doing this with your AC, stop immediately',
      'The #1 mistake homeowners make with their roof',
    ],
    bestFor: ['tiktok', 'youtube', 'facebook'],
    energy: 'Urgent, protective, expert',
  },
  costReveal: {
    name: 'Cost/Price Reveal',
    format: 'How much does [service] actually cost?',
    examples: [
      'Here\'s what a new roof ACTUALLY costs in 2026',
      'Real price breakdown: bathroom remodel',
      'Stop overpaying. Here\'s what you should pay for...',
    ],
    bestFor: ['youtube', 'tiktok', 'google'],
    energy: 'Transparent, valuable, trust-building',
  },
  waitForIt: {
    name: 'Wait For It',
    format: 'Wait for it... [setup for reveal]',
    examples: [
      'They said it couldn\'t be fixed. Wait for it...',
      'Watch what we found behind the wall...',
      'This is what 20 years of buildup looks like...',
    ],
    bestFor: ['tiktok', 'instagram'],
    energy: 'Suspenseful, curiosity-driven, viral',
  },
  social_proof: {
    name: 'Social Proof Hook',
    format: '[Number] customers/reviews/years',
    examples: [
      '500 five-star reviews can\'t be wrong',
      'After 20 years in business, here\'s what I\'ve learned',
      'We\'ve helped 1,000+ families in [city]',
    ],
    bestFor: ['facebook', 'google', 'youtube'],
    energy: 'Credible, established, trustworthy',
  },
  relatable: {
    name: 'Relatable Situation',
    format: 'When [relatable situation]...',
    examples: [
      'When you Google the problem instead of calling a pro...',
      'When you realize the "quick fix" wasn\'t so quick...',
      'When your spouse asks if you called someone yet...',
    ],
    bestFor: ['tiktok', 'instagram', 'facebook'],
    energy: 'Humorous, relatable, shareable',
  },
  urgency: {
    name: 'Urgency/Warning',
    format: 'If you see [warning sign], call now',
    examples: [
      'If your water heater is making this sound, call NOW',
      'These 3 signs mean your roof is failing',
      'Don\'t wait until it becomes an emergency',
    ],
    bestFor: ['facebook', 'google', 'youtube'],
    energy: 'Urgent, protective, action-driving',
  },
}

// PLATFORM-SPECIFIC VIDEO PACING (2026 standards)
export const VIDEO_PACING = {
  tiktok: {
    hookWindow: '0.5-1 second (BRUTAL - if not hooked, they scroll)',
    idealLength: '15-21 seconds for ads, 30-60 for organic',
    cutFrequency: 'Every 1.5-2 seconds MAX or you lose them',
    patternInterrupts: 'Every 2-3 seconds (zoom, angle change, text pop, sound effect)',
    textOnScreen: 'ALWAYS - 80% watch muted. Text must tell the story alone.',
    pacing: 'Fast, punchy, no breathing room. Dead air = scroll.',
    energy: 'High energy start, maintain throughout, quick CTA',
    musicVolume: 'Trending sound prominent, voice can be secondary',
  },
  instagram: {
    hookWindow: '1-2 seconds',
    idealLength: '15-30 seconds for Reels, up to 90 for engaged audiences',
    cutFrequency: 'Every 2-3 seconds',
    patternInterrupts: 'Every 3-4 seconds (smoother than TikTok)',
    textOnScreen: 'Essential - clean, aesthetic text overlays',
    pacing: 'Slightly more polished than TikTok, still fast',
    energy: 'Aspirational, aesthetic, lifestyle-forward',
    musicVolume: 'Balanced - trending audio helps but quality matters',
  },
  youtube: {
    hookWindow: '5 seconds (before skip button)',
    idealLength: 'Shorts: 30-60s. Ads: 15-30s. Content: 8-15min',
    cutFrequency: 'Every 3-5 seconds for Shorts, can be slower for long-form',
    patternInterrupts: 'Every 5-8 seconds for Shorts, 15-30 for long-form',
    textOnScreen: 'Titles and key points, not constant',
    pacing: 'Can breathe more, but front-load value',
    energy: 'Educational, valuable, personality-driven',
    musicVolume: 'Background only, voice clarity is king',
  },
  facebook: {
    hookWindow: '3 seconds',
    idealLength: '15-30 seconds for ads, up to 3min for engaged',
    cutFrequency: 'Every 3-4 seconds',
    patternInterrupts: 'Every 5-6 seconds (audience is more patient)',
    textOnScreen: 'Essential for silent autoplay, larger text',
    pacing: 'Moderate, can be more informational',
    energy: 'Trustworthy, warm, community-focused',
    musicVolume: 'Low or none - voice and text primary',
  },
}

// INDUSTRY-SPECIFIC B-ROLL SHOT LISTS
export const INDUSTRY_BROLL: Record<string, {
  problemShots: string[]
  processShots: string[]
  resultShots: string[]
  trustShots: string[]
  humanShots: string[]
}> = {
  plumbing: {
    problemShots: [
      'Water dripping under sink (close-up, slow motion)',
      'Homeowner looking stressed at leak',
      'Water damage on ceiling/wall',
      'Old corroded pipes (dramatic lighting)',
      'Overflowing toilet (implication only)',
      'Water bill close-up showing high amount',
    ],
    processShots: [
      'Hands turning off water valve',
      'Professional tools laid out neatly',
      'Cutting pipe with precision',
      'Soldering/connecting new fittings',
      'Camera inspection of drain',
      'Water heater installation timelapse',
    ],
    resultShots: [
      'Crystal clear water flowing',
      'Gleaming new faucet',
      'Water pressure test (satisfying)',
      'Before/after split screen',
      'Dry area where leak was',
      'Happy water meter reading',
    ],
    trustShots: [
      'License/certification on wall',
      'Branded van pulling up',
      'Clean uniform close-up',
      'Shaking hands with homeowner',
      'Team photo/group shot',
      '5-star review screenshot scroll',
    ],
    humanShots: [
      'Homeowner relief expression',
      'Tech explaining to customer',
      'Family using fixed bathroom',
      'Kids washing hands (working sink)',
      'Homeowner testimonial face',
      'Thank you wave at door',
    ],
  },
  hvac: {
    problemShots: [
      'Person sweating, fanning themselves',
      'Thermostat showing extreme temp',
      'Old rusty AC unit',
      'Ice buildup on coils',
      'High energy bill close-up',
      'Person wrapped in blanket (cold house)',
    ],
    processShots: [
      'Opening AC unit panel',
      'Checking refrigerant levels',
      'Cleaning coils (satisfying)',
      'Installing new thermostat',
      'Ductwork inspection camera',
      'New unit being positioned',
    ],
    resultShots: [
      'Thermostat showing perfect 72°',
      'Family comfortable on couch',
      'Cool air flowing from vent (ribbon test)',
      'Energy bill comparison',
      'Quiet operation demonstration',
      'Modern smart thermostat interface',
    ],
    trustShots: [
      'EPA certification',
      'Branded vehicle with equipment',
      'Tech in safety gear',
      'Explaining options to customer',
      'Years in business badge',
      'Manufacturer partner logos',
    ],
    humanShots: [
      'Kid playing comfortably inside',
      'Elderly person comfortable at home',
      'Homeowner sleeping peacefully',
      'Customer testimonial',
      'Pet relaxing in cool home',
      'Family dinner in comfortable home',
    ],
  },
  electrical: {
    problemShots: [
      'Flickering lights (dramatic)',
      'Sparking outlet',
      'Overloaded power strip',
      'Old fuse box close-up',
      'Burn marks near outlet',
      'Extension cord maze',
    ],
    processShots: [
      'Voltage testing with meter',
      'Clean wire connections',
      'Panel upgrade installation',
      'Running wire through wall',
      'Installing recessed lighting',
      'Smart switch programming',
    ],
    resultShots: [
      'Room dramatically lit (before/after)',
      'Clean modern panel',
      'Perfectly aligned outlets',
      'Smart home app control',
      'EV charger installation complete',
      'Under-cabinet lighting reveal',
    ],
    trustShots: [
      'Licensed electrician badge',
      'Safety inspection passing',
      'Insurance documentation',
      'Code book reference',
      'Permit on clipboard',
      'Explaining safety to customer',
    ],
    humanShots: [
      'Family movie night (great lighting)',
      'Home office well-lit',
      'Kid safely using outlet',
      'Homeowner showing off lights',
      'Peace of mind expression',
      'Customer testimonial about safety',
    ],
  },
  roofing: {
    problemShots: [
      'Water dripping from ceiling',
      'Missing/damaged shingles',
      'Moss/algae growth on roof',
      'Sagging roof line',
      'Storm damage aftermath',
      'Bucket catching leak inside',
    ],
    processShots: [
      'Drone roof inspection',
      'Tearing off old shingles',
      'Laying underlayment precisely',
      'Nail gun in action',
      'Flashing installation',
      'Final shingle alignment',
    ],
    resultShots: [
      'Aerial view of completed roof',
      'Clean roof line close-up',
      'Rain rolling off new roof',
      'Curb appeal before/after',
      'Happy gutter flow',
      'Inspection passing document',
    ],
    trustShots: [
      'GAF/manufacturer certification',
      'Team on roof (safety gear)',
      'Insurance claim assistance',
      'Warranty documentation',
      '25-year guarantee badge',
      'Before/after portfolio scroll',
    ],
    humanShots: [
      'Homeowner looking up proudly',
      'Family safe inside during rain',
      'Neighbors complimenting',
      'Customer testimonial outside home',
      'Kids playing in rain (dry inside shown)',
      'New homeowner confidence',
    ],
  },
  landscaping: {
    problemShots: [
      'Overgrown messy yard',
      'Dead grass patches',
      'Weed-filled flower beds',
      'Cracked old patio',
      'Neighbor comparison (theirs nice)',
      'HOA violation notice',
    ],
    processShots: [
      'Power washing (satisfying)',
      'Laying sod precisely',
      'Planting flowers in pattern',
      'Stone paver installation',
      'Mulch spreading even',
      'Irrigation system install',
    ],
    resultShots: [
      'Drone shot of finished yard',
      'Lush green lawn wide shot',
      'Colorful flower bed close-up',
      'Completed patio with furniture',
      'Night lighting reveal',
      'Before/after split dramatic',
    ],
    trustShots: [
      'Landscape design on tablet',
      'Team working together',
      'Quality plants at nursery',
      'Equipment (professional grade)',
      'Portfolio scroll on phone',
      'Design consultation meeting',
    ],
    humanShots: [
      'Family BBQ on new patio',
      'Kids playing on lawn',
      'Homeowner relaxing outside',
      'Neighbors admiring',
      'Proud walkthrough with owner',
      'Dog enjoying the yard',
    ],
  },
  dental: {
    problemShots: [
      'Person hiding smile',
      'Coffee-stained teeth close-up',
      'Avoiding photos/turning away',
      'Wincing when drinking cold/hot',
      'Old dental work visible',
      'Crooked teeth in mirror',
    ],
    processShots: [
      'Modern dental chair (inviting)',
      'Gentle examination',
      'Whitening treatment application',
      'Digital smile preview on screen',
      'Invisalign fitting',
      'Comfortable patient during procedure',
    ],
    resultShots: [
      'Brilliant smile reveal (mirror)',
      'Before/after teeth close-up',
      'Confident smile in photos',
      'First reaction to new smile',
      'Whitening comparison chart',
      'Perfect alignment final result',
    ],
    trustShots: [
      'Degrees on wall',
      'Modern equipment tour',
      'Friendly staff greeting',
      'Sterilization process',
      'Comfort amenities (TV, blanket)',
      'Google review screenshots',
    ],
    humanShots: [
      'Laughing freely with friends',
      'Job interview confidence',
      'Wedding photos smiling',
      'Dating profile photo (smiling)',
      'First date confidence',
      'Patient hugging dentist/staff',
    ],
  },
  legal: {
    problemShots: [
      'Accident scene (tasteful)',
      'Person overwhelmed by paperwork',
      'Insurance denial letter',
      'Worried family at table',
      'Medical bills stacking up',
      'Person on phone frustrated',
    ],
    processShots: [
      'Attorney reviewing documents',
      'Team meeting about case',
      'Research on computer screens',
      'Client consultation (supportive)',
      'Courtroom preparation',
      'Evidence organization',
    ],
    resultShots: [
      'Settlement check signing',
      'Happy client handshake',
      'Case won celebration',
      'Client relief/tears of joy',
      'Family hugging after verdict',
      '"Justice Served" concept',
    ],
    trustShots: [
      'Law degrees on wall',
      'Years of experience badge',
      'Successful verdicts/amounts',
      'Team of attorneys',
      'Client testimonial video',
      'Community involvement photos',
    ],
    humanShots: [
      'Family recovering/healing',
      'Return to normal life',
      'Medical care being received',
      'Financial burden lifted expression',
      'Client thanking attorney',
      'New chapter beginning',
    ],
  },
  restaurant: {
    problemShots: [
      'Empty fridge "nothing to eat"',
      'Failed home cooking attempt',
      'Long line at fast food',
      'Boring meal at desk',
      'Scrolling Yelp undecided',
      '"What should we eat?" conversation',
    ],
    processShots: [
      'Fresh ingredients being prepped',
      'Chef cooking with flames',
      'Plating with precision',
      'Drinks being crafted',
      'Food coming out of kitchen',
      'Server bringing dish to table',
    ],
    resultShots: [
      'Hero dish shot (steam rising)',
      'Table full of food',
      'First bite reaction',
      'Friends clinking glasses',
      'Food photography moment',
      'Clean plates (food was good)',
    ],
    trustShots: [
      'Kitchen cleanliness tour',
      'Chef credentials/training',
      'Fresh ingredient sources',
      'Packed restaurant ambiance',
      'Awards/reviews on wall',
      'Yelp/Google rating overlay',
    ],
    humanShots: [
      'Date night couple enjoying',
      'Family celebration',
      'Friends laughing at table',
      'Birthday surprise moment',
      'Proposal setup',
      'Regular customer greeted by name',
    ],
  },
  fitness: {
    problemShots: [
      'Clothes not fitting',
      'Tired climbing stairs',
      'Avoiding mirror',
      'Old unhappy photo',
      'Gym intimidation',
      'Failed home workout attempt',
    ],
    processShots: [
      'Trainer demonstrating exercise',
      'Form correction (supportive)',
      'Group class energy',
      'Progress measurement',
      'Nutrition planning',
      'High-five with trainer',
    ],
    resultShots: [
      'Before/after transformation',
      'Clothes fitting great',
      'Confident mirror selfie',
      'Achievement celebration',
      'New personal record',
      'Energy in daily life',
    ],
    trustShots: [
      'Trainer certifications',
      'Gym facility tour',
      'Success story wall',
      'Member testimonials',
      'Supportive community vibe',
      'Transformation portfolio',
    ],
    humanShots: [
      'Playing with kids (energy)',
      'Beach confidence',
      'Running a race',
      'Social event confidence',
      'Dating life improved',
      'Community workout high-fives',
    ],
  },
  general: {
    problemShots: [
      'Customer looking frustrated',
      'Problem visible',
      'Searching on phone',
      'Comparison shopping',
      'Previous bad experience implied',
      'DIY attempt failed',
    ],
    processShots: [
      'Professional at work',
      'Quality tools/materials',
      'Attention to detail',
      'Communication with client',
      'Problem being solved',
      'Expertise in action',
    ],
    resultShots: [
      'Completed quality work',
      'Happy customer reveal',
      'Before/after comparison',
      'Problem solved',
      'Satisfying final result',
      'Clean professional finish',
    ],
    trustShots: [
      'Credentials displayed',
      'Professional appearance',
      'Customer testimonials',
      'Years in business',
      'Reviews/ratings',
      'Community presence',
    ],
    humanShots: [
      'Customer satisfaction',
      'Relief expression',
      'Recommendation to friend',
      'Repeat customer greeting',
      'Thank you moment',
      'Life improved',
    ],
  },
}

// 2026 VIDEO FORMAT TEMPLATES
export const VIDEO_FORMATS_2026 = {
  povStyle: {
    name: 'POV Style',
    structure: [
      { time: '0-1s', action: 'TEXT: "POV: [situation]"', visual: 'First-person camera angle' },
      { time: '1-5s', action: 'Show the problem from customer POV', visual: 'What they see' },
      { time: '5-10s', action: 'Solution appearing (you/your team)', visual: 'Relief moment' },
      { time: '10-15s', action: 'Quick result + CTA text overlay', visual: 'Satisfaction shot' },
    ],
    bestFor: ['tiktok', 'instagram'],
    hook: 'POV: You just discovered [problem]',
  },
  storytime: {
    name: 'Storytime',
    structure: [
      { time: '0-2s', action: 'TEXT: "Storytime..." + intriguing setup', visual: 'Face to camera or scene' },
      { time: '2-8s', action: 'Build the story (problem escalation)', visual: 'B-roll of problem/situation' },
      { time: '8-12s', action: 'Resolution (you saved the day)', visual: 'Solution footage' },
      { time: '12-15s', action: 'Lesson learned + CTA', visual: 'Result + contact' },
    ],
    bestFor: ['tiktok', 'instagram', 'facebook'],
    hook: 'Storytime: This [customer] called us at [time]...',
  },
  satisfyingTransform: {
    name: 'Satisfying Transformation',
    structure: [
      { time: '0-1s', action: 'TEXT: "Watch this..." or no text, just start', visual: 'Before state (ugly/broken)' },
      { time: '1-8s', action: 'Timelapse/quick cuts of transformation', visual: 'Process shots, satisfying moments' },
      { time: '8-12s', action: 'Slow reveal of final result', visual: 'Dramatic reveal, multiple angles' },
      { time: '12-15s', action: 'Logo + CTA overlay', visual: 'Beauty shot + contact' },
    ],
    bestFor: ['tiktok', 'instagram'],
    hook: '[No text needed - visual hook]',
  },
  mythBuster: {
    name: 'Myth Buster / Hot Take',
    structure: [
      { time: '0-2s', action: 'TEXT: "Stop believing this about [topic]"', visual: 'Direct to camera, bold' },
      { time: '2-7s', action: 'Explain the myth and why it is wrong', visual: 'B-roll proof / demonstrations' },
      { time: '7-12s', action: 'Show the truth / right way', visual: 'Correct method / result' },
      { time: '12-15s', action: 'CTA: "Follow for more truths"', visual: 'Expert positioning' },
    ],
    bestFor: ['tiktok', 'youtube', 'instagram'],
    hook: 'Nobody talks about this, but...',
  },
  costBreakdown: {
    name: 'Cost/Price Breakdown',
    structure: [
      { time: '0-2s', action: 'TEXT: "How much does [service] cost?"', visual: 'Calculator/money visual' },
      { time: '2-10s', action: 'Break down costs honestly, show what affects price', visual: 'Visual price list, examples' },
      { time: '10-13s', action: 'Give realistic range for your area', visual: 'Your pricing/value' },
      { time: '13-15s', action: 'CTA: Free quote offer', visual: 'Contact info' },
    ],
    bestFor: ['youtube', 'tiktok', 'facebook'],
    hook: 'Here\'s what [service] ACTUALLY costs in 2026...',
  },
  dayInLife: {
    name: 'Day in the Life',
    structure: [
      { time: '0-2s', action: 'TEXT: "Day in the life of a [profession]"', visual: 'Morning/starting work' },
      { time: '2-20s', action: 'Show real work moments, challenges, wins', visual: 'Multiple job clips' },
      { time: '20-28s', action: 'Satisfying completion / happy customer', visual: 'Best moments compilation' },
      { time: '28-30s', action: 'End of day satisfaction + CTA', visual: 'Wrap up + contact' },
    ],
    bestFor: ['tiktok', 'instagram'],
    hook: 'Come to work with me...',
  },
  tutorial: {
    name: 'Quick Tutorial / How-To',
    structure: [
      { time: '0-2s', action: 'TEXT: "How to [task] in 30 seconds"', visual: 'Problem or starting point' },
      { time: '2-20s', action: 'Step by step (numbered text overlays)', visual: 'Clear demonstration' },
      { time: '20-25s', action: 'Final result', visual: 'Completed task' },
      { time: '25-30s', action: 'CTA: "For bigger jobs, call us"', visual: 'Contact + logo' },
    ],
    bestFor: ['youtube', 'tiktok', 'instagram'],
    hook: '3 things you can do yourself (and 1 you shouldn\'t)...',
  },
  customerReaction: {
    name: 'Customer Reaction / Reveal',
    structure: [
      { time: '0-2s', action: 'Setup: Customer about to see result', visual: 'Anticipation moment' },
      { time: '2-8s', action: 'Build up (before state reminder)', visual: 'Before footage/photos' },
      { time: '8-12s', action: 'THE REVEAL - customer reaction', visual: 'Genuine reaction capture' },
      { time: '12-15s', action: 'CTA: "Want this reaction?"', visual: 'Contact info' },
    ],
    bestFor: ['tiktok', 'instagram', 'facebook'],
    hook: 'Watch their reaction when they see...',
  },
  behindScenes: {
    name: 'Behind the Scenes',
    structure: [
      { time: '0-2s', action: 'TEXT: "What really happens when you call us"', visual: 'Dispatch/prep moment' },
      { time: '2-15s', action: 'Show the process people never see', visual: 'Real work footage' },
      { time: '15-25s', action: 'The care and detail that goes into it', visual: 'Quality moments' },
      { time: '25-30s', action: 'That is why we\'re different + CTA', visual: 'Team pride shot' },
    ],
    bestFor: ['instagram', 'facebook', 'tiktok'],
    hook: 'Here\'s what happens after you book...',
  },
  vsComparison: {
    name: 'Us vs Them / Comparison',
    structure: [
      { time: '0-2s', action: 'TEXT: "Cheap vs Professional"', visual: 'Split screen setup' },
      { time: '2-10s', action: 'Show bad example (competitor/DIY)', visual: 'Poor quality work' },
      { time: '10-20s', action: 'Show your quality/approach', visual: 'Your superior work' },
      { time: '20-25s', action: 'Result comparison', visual: 'Side by side outcome' },
      { time: '25-30s', action: 'CTA: "Choose quality"', visual: 'Contact info' },
    ],
    bestFor: ['youtube', 'tiktok', 'facebook'],
    hook: 'What $50 gets you vs what $150 gets you...',
  },
}

// TEXT OVERLAY / CAPTION STRATEGY
export const CAPTION_STRATEGY = {
  tiktok: {
    position: 'Center of screen, avoid top 15% (username) and bottom 20% (controls)',
    style: 'Bold, high contrast, often with black outline/background',
    size: 'Large enough to read on phone without squinting',
    animation: 'Pop in, word by word for emphasis, shake for impact',
    frequency: 'Text on screen 90%+ of the time',
    colors: 'High contrast - white on black, yellow on black, brand colors OK',
    fonts: 'Bold sans-serif (Montserrat Bold, Impact-style)',
  },
  instagram: {
    position: 'Center or lower third, leave room for profile actions',
    style: 'Clean, aesthetic, matches brand colors',
    size: 'Readable but not overwhelming',
    animation: 'Smooth fade or slide, less aggressive than TikTok',
    frequency: '70-80% of the time',
    colors: 'Brand colors, aesthetic palette, less harsh than TikTok',
    fonts: 'Clean sans-serif, can be more elegant',
  },
  youtube: {
    position: 'Lower third or top for Shorts, traditional placement for long-form',
    style: 'Professional, readable, YouTube-native look',
    size: 'Larger for Shorts (phone viewing), standard for desktop',
    animation: 'Clean transitions, subscribe animations',
    frequency: '50-70% for Shorts, key points only for long-form',
    colors: 'Brand colors, high contrast for thumbnails',
    fonts: 'Bold, readable at thumbnail size',
  },
  facebook: {
    position: 'Center, larger text (older audience)',
    style: 'Clear, simple, easy to read quickly',
    size: 'Larger than other platforms (accessibility)',
    animation: 'Simple, not distracting',
    frequency: '90%+ (many watch without sound)',
    colors: 'High contrast, simple palette',
    fonts: 'Simple, clear sans-serif',
  },
}

// SOUND/MUSIC STRATEGY
export const SOUND_STRATEGY = {
  tiktok: {
    approach: 'Trending sounds can boost reach 30-50%. Check TikTok Creative Center weekly.',
    voiceStyle: 'Natural, conversational, NOT corporate. Can use AI voice if it sounds real.',
    musicRole: 'Often the star - can build entire video around a trending sound',
    originalAudio: 'Can create own trending sound with a catchy phrase',
    tips: [
      'Search "trending sounds for business" weekly',
      'Use sounds at peak trend (3-7 days after start)',
      'Match energy of sound to content',
      'Original sounds can go viral if catchy',
    ],
  },
  instagram: {
    approach: 'Trending audio matters but quality matters more. Check Reels tab for trends.',
    voiceStyle: 'Slightly more polished than TikTok, still authentic',
    musicRole: 'Supports the content, doesn\'t dominate',
    originalAudio: 'Good for brand consistency',
    tips: [
      'Save sounds you like for later use',
      'Match music energy to content mood',
      'Original voiceover builds personality',
      'Music helps with watch time',
    ],
  },
  youtube: {
    approach: 'Voice clarity is #1. Background music is subtle. No copyrighted music.',
    voiceStyle: 'Professional but personable, clear enunciation, good mic quality',
    musicRole: 'Background only, 10-20% volume vs voice',
    originalAudio: 'Essential for SEO and brand',
    tips: [
      'Invest in good microphone',
      'Use royalty-free music libraries',
      'Voice sets you apart from competitors',
      'Consistent intro music builds brand',
    ],
  },
  facebook: {
    approach: 'Many watch muted. Voice optional, text essential. Subtle background music.',
    voiceStyle: 'Warm, trustworthy, like talking to a friend/neighbor',
    musicRole: 'Minimal - emotional support only',
    originalAudio: 'Helpful but not critical',
    tips: [
      'Design for sound-off first',
      'Add captions always',
      'Music should enhance, not distract',
      'Natural sound from scene can work',
    ],
  },
}

// PATTERN INTERRUPT TECHNIQUES
export const PATTERN_INTERRUPTS = {
  visual: [
    'Zoom cut (punch in/out)',
    'Angle change (different camera position)',
    'B-roll insert (cut to detail shot)',
    'Speed ramp (slow mo to fast or vice versa)',
    'Jump cut (skip dead air)',
    'Split screen introduction',
    'Picture-in-picture',
    'Before/after wipe',
    'Text pop animation',
    'Color grade shift',
  ],
  audio: [
    'Sound effect on key word',
    'Music swell at reveal',
    'Silence before important point',
    'Voice pitch/pace change',
    'Trending sound drop',
    'Notification sound effect',
    'Record scratch/stop',
  ],
  timing: {
    tiktok: 'Every 1.5-2 seconds minimum',
    instagram: 'Every 2-3 seconds',
    youtube_shorts: 'Every 2-3 seconds',
    youtube_longform: 'Every 5-8 seconds',
    facebook: 'Every 3-5 seconds',
  },
}

// IMAGE STYLE OPTIONS (including UGC)
export const IMAGE_STYLES = {
  polished: {
    name: 'Polished Professional',
    description: 'Traditional high-quality marketing photography',
    bestFor: ['google', 'facebook', 'youtube thumbnails'],
    camera: 'Professional DSLR/mirrorless, studio or controlled lighting',
    editing: 'Color corrected, retouched, branded',
    trust: 'Established business, premium positioning',
  },
  ugc: {
    name: 'UGC (User-Generated Content) Style',
    description: 'Looks like a real customer or employee took it with their phone',
    bestFor: ['tiktok', 'instagram', 'facebook ads'],
    camera: 'iPhone/smartphone, natural lighting, handheld feel',
    editing: 'Minimal - basic phone filters at most',
    trust: 'Authentic, relatable, "real people not actors"',
    specifics: {
      lighting: 'Natural window light, ring light reflection OK, imperfect shadows OK',
      focus: 'Slight blur acceptable, subject clear but not razor sharp',
      composition: 'Off-center OK, not perfectly framed, authentic feeling',
      subjects: 'Real employees, real customers, real locations',
      props: 'Real phones visible, real environment, unpolished background OK',
    },
  },
  lifestyle: {
    name: 'Lifestyle Editorial',
    description: 'Magazine-quality but natural, aspirational',
    bestFor: ['instagram', 'pinterest', 'premium facebook'],
    camera: 'High-end phone or mirrorless, golden hour, editorial angles',
    editing: 'Color graded, cohesive aesthetic, lifestyle feel',
    trust: 'Premium, aspirational, modern business',
  },
  documentary: {
    name: 'Documentary / Behind-the-Scenes',
    description: 'Authentic capture of real work happening',
    bestFor: ['instagram', 'facebook', 'google'],
    camera: 'Any camera, capturing real moments',
    editing: 'Light editing, preserving authenticity',
    trust: 'Transparent, nothing to hide, real work',
  },
}

// Helper function to get B-roll for an industry
export function getIndustryBroll(industryId: string): typeof INDUSTRY_BROLL.general {
  return INDUSTRY_BROLL[industryId] || INDUSTRY_BROLL.general
}

// Helper function to get hooks for an industry
export function generateHooksForIndustry(
  industry: IndustryProfile,
  businessName: string,
  city: string
): Record<string, string[]> {
  const hooks: Record<string, string[]> = {}
  const painPoints = industry.audience.painPoints
  const desires = industry.audience.desires

  // POV hooks
  hooks.pov = [
    `POV: You just discovered ${painPoints[0]?.toLowerCase() || 'a problem at home'}`,
    `POV: You finally called a real ${industry.name.toLowerCase()} professional`,
    `POV: ${businessName} just showed up at your door`,
  ]

  // Controversy hooks
  hooks.controversy = [
    `Most ${industry.name.toLowerCase()} companies won't tell you this...`,
    `Stop overpaying for ${industry.name.toLowerCase()} services`,
    `The truth about ${industry.name.toLowerCase()} in ${city}`,
  ]

  // Storytime hooks
  hooks.storytime = [
    `Storytime: A customer called us at 2am because ${painPoints[0]?.toLowerCase() || 'of an emergency'}`,
    `This ${city} homeowner saved thousands because of one call...`,
    `Let me tell you about the worst ${industry.name.toLowerCase()} job I ever saw`,
  ]

  // Did you know hooks
  hooks.didYouKnow = [
    `Did you know ${painPoints[0]?.toLowerCase() || 'this common issue'} can cost you thousands?`,
    `90% of ${city} homeowners don't know this about ${industry.name.toLowerCase()}`,
    `${desires[0] || 'What you want'}? Here's what nobody tells you...`,
  ]

  // Cost reveal hooks
  hooks.costReveal = [
    `Here's what ${industry.name.toLowerCase()} ACTUALLY costs in ${city} in 2026`,
    `Real price breakdown: ${industry.name.toLowerCase()} services`,
    `How much should you pay for ${industry.name.toLowerCase()}?`,
  ]

  // Mistake hooks
  hooks.mistake = [
    `Stop making this ${industry.name.toLowerCase()} mistake`,
    `The #1 mistake ${city} homeowners make with ${industry.name.toLowerCase()}`,
    `If you're doing this, stop immediately`,
  ]

  // Satisfying hooks
  hooks.satisfying = [
    `The most satisfying ${industry.name.toLowerCase()} video you'll see today`,
    `Watch this transformation...`,
    `Before and after that'll blow your mind`,
  ]

  // Urgency hooks
  hooks.urgency = [
    `If you see this, call a ${industry.name.toLowerCase()} NOW`,
    `These signs mean you need ${industry.name.toLowerCase()} help ASAP`,
    `Don't wait until it's an emergency`,
  ]

  return hooks
}

// Video script generator - 2026 VERSION
// Complete rewrite with hooks, B-roll, pacing, captions, and format options

export interface VideoScript2026 {
  // Basic info
  hook: string
  hookType: string
  cta: string

  // Script structure
  scenes: {
    time: string
    action: string
    visual: string
    broll: string[]
    textOverlay: string
    patternInterrupt: string
  }[]

  // Voiceover
  voiceover: string
  voiceStyle: string

  // Technical specs
  pacing: typeof VIDEO_PACING.tiktok
  captionStrategy: typeof CAPTION_STRATEGY.tiktok
  soundStrategy: typeof SOUND_STRATEGY.tiktok

  // 2026 features
  format: keyof typeof VIDEO_FORMATS_2026
  formatDetails: typeof VIDEO_FORMATS_2026.povStyle
  hooks: Record<string, string[]>

  // Metadata
  platform: string
  duration: string
  industry: string
}

export function generateVideoScript(
  industry: IndustryProfile,
  businessName: string,
  services: string[],
  city: string,
  platform: 'facebook' | 'instagram' | 'youtube' | 'tiktok',
  duration: '15s' | '30s' | '60s',
  formatOverride?: keyof typeof VIDEO_FORMATS_2026
): VideoScript2026 {
  // Get platform-specific pacing and strategies
  const pacing = VIDEO_PACING[platform]
  const captionStrat = CAPTION_STRATEGY[platform]
  const soundStrat = SOUND_STRATEGY[platform]
  const broll = getIndustryBroll(industry.id)
  const allHooks = generateHooksForIndustry(industry, businessName, city)

  // Select best format based on platform and duration
  let format: keyof typeof VIDEO_FORMATS_2026 = formatOverride || 'storytime'
  if (!formatOverride) {
    if (platform === 'tiktok' && duration === '15s') {
      format = 'satisfyingTransform'
    } else if (platform === 'tiktok') {
      format = 'povStyle'
    } else if (platform === 'instagram') {
      format = 'storytime'
    } else if (platform === 'youtube' && duration === '15s') {
      format = 'satisfyingTransform'
    } else if (platform === 'youtube') {
      format = 'tutorial'
    } else if (platform === 'facebook') {
      format = 'customerReaction'
    }
  }

  const formatDetails = VIDEO_FORMATS_2026[format]
  const ctas = industry.copyFrameworks.ctas

  // Select hook based on format and platform
  let hookType = 'storytime'
  let hook = ''

  if (format === 'povStyle') {
    hookType = 'pov'
    hook = allHooks.pov[0]
  } else if (format === 'satisfyingTransform') {
    hookType = 'satisfying'
    hook = allHooks.satisfying[0]
  } else if (format === 'mythBuster') {
    hookType = 'controversy'
    hook = allHooks.controversy[0]
  } else if (format === 'costBreakdown') {
    hookType = 'costReveal'
    hook = allHooks.costReveal[0]
  } else if (format === 'customerReaction') {
    hookType = 'satisfying'
    hook = `Watch their reaction when they see the result...`
  } else if (format === 'tutorial') {
    hookType = 'didYouKnow'
    hook = allHooks.didYouKnow[0]
  } else {
    hookType = 'storytime'
    hook = allHooks.storytime[0]
  }

  const cta = ctas[businessName.length % ctas.length]

  // Build scenes based on duration and format
  const scenes: VideoScript2026['scenes'] = []

  if (duration === '15s') {
    // 15 SECOND SCRIPT - Ultra tight, every frame counts
    scenes.push({
      time: '0-1s',
      action: 'HOOK - Stop the scroll immediately',
      visual: formatDetails.structure[0]?.visual || 'Attention-grabbing opening',
      broll: [broll.problemShots[0], broll.humanShots[0]],
      textOverlay: hook.length > 50 ? hook.substring(0, 50) + '...' : hook,
      patternInterrupt: 'None - let hook land',
    })
    scenes.push({
      time: '1-4s',
      action: 'PROBLEM/SETUP - Show the pain point fast',
      visual: 'Quick cuts of problem state',
      broll: broll.problemShots.slice(0, 2),
      textOverlay: industry.audience.painPoints[0] || 'The problem everyone ignores',
      patternInterrupt: 'Zoom cut at 2.5s',
    })
    scenes.push({
      time: '4-9s',
      action: 'SOLUTION - Your business in action',
      visual: 'Satisfying process shots, transformation',
      broll: broll.processShots.slice(0, 3),
      textOverlay: `${businessName} fixes this`,
      patternInterrupt: 'Jump cuts every 1.5s, speed ramp on satisfying moment',
    })
    scenes.push({
      time: '9-12s',
      action: 'RESULT - The payoff',
      visual: 'Beautiful after shot, customer reaction',
      broll: [broll.resultShots[0], broll.humanShots[0]],
      textOverlay: 'The transformation',
      patternInterrupt: 'Slow motion on reveal',
    })
    scenes.push({
      time: '12-15s',
      action: 'CTA - Tell them what to do',
      visual: 'Logo, contact info, clear CTA',
      broll: [broll.trustShots[0]],
      textOverlay: `${cta} | ${city}`,
      patternInterrupt: 'Text pop animation',
    })
  } else if (duration === '30s') {
    // 30 SECOND SCRIPT - Room for story, still fast
    scenes.push({
      time: '0-2s',
      action: 'HOOK - Stop the scroll',
      visual: formatDetails.structure[0]?.visual || 'Bold opening',
      broll: [broll.problemShots[0]],
      textOverlay: hook,
      patternInterrupt: 'None - let hook breathe',
    })
    scenes.push({
      time: '2-7s',
      action: 'PROBLEM - Build the tension',
      visual: 'Show the problem getting worse',
      broll: broll.problemShots.slice(0, 3),
      textOverlay: `${industry.audience.painPoints[0]} sound familiar?`,
      patternInterrupt: 'Angle change at 4s, zoom at 6s',
    })
    scenes.push({
      time: '7-12s',
      action: 'AGITATE - Why this matters',
      visual: 'Consequences of not acting',
      broll: [broll.humanShots[1], broll.problemShots[2]],
      textOverlay: 'What happens if you wait...',
      patternInterrupt: 'B-roll insert, music tension build',
    })
    scenes.push({
      time: '12-18s',
      action: 'SOLUTION - Enter the hero',
      visual: `${businessName} to the rescue`,
      broll: broll.processShots.slice(0, 4),
      textOverlay: `${businessName} handles it`,
      patternInterrupt: 'Jump cuts, satisfying process moments',
    })
    scenes.push({
      time: '18-24s',
      action: 'PROOF - Show it works',
      visual: 'Results, testimonial, or transformation',
      broll: [...broll.resultShots.slice(0, 2), broll.humanShots[0]],
      textOverlay: '"Best decision I made" - Real customer',
      patternInterrupt: 'Before/after wipe, reaction shot',
    })
    scenes.push({
      time: '24-30s',
      action: 'CTA - Drive action',
      visual: 'Clear call to action with contact',
      broll: broll.trustShots.slice(0, 2),
      textOverlay: `${cta} | ${businessName} | ${city}`,
      patternInterrupt: 'Logo animation, contact info pop',
    })
  } else {
    // 60 SECOND SCRIPT - Full story arc
    scenes.push({
      time: '0-3s',
      action: 'HOOK - Grab attention',
      visual: formatDetails.structure[0]?.visual || 'Compelling opening',
      broll: [broll.problemShots[0], broll.humanShots[0]],
      textOverlay: hook,
      patternInterrupt: 'Strong opening visual, let it land',
    })
    scenes.push({
      time: '3-10s',
      action: 'SETUP - Introduce the problem',
      visual: 'Relatable situation building',
      broll: broll.problemShots,
      textOverlay: 'Ever dealt with this?',
      patternInterrupt: 'Cuts every 2-3s, zoom at 7s',
    })
    scenes.push({
      time: '10-18s',
      action: 'ESCALATE - Problem gets real',
      visual: 'Stakes become clear',
      broll: [broll.problemShots[2], broll.humanShots[1], broll.problemShots[3]],
      textOverlay: industry.audience.painPoints.slice(0, 2).join(' → '),
      patternInterrupt: 'Music builds, quick cuts',
    })
    scenes.push({
      time: '18-28s',
      action: 'SOLUTION - The answer arrives',
      visual: `${businessName} enters, process begins`,
      broll: broll.processShots,
      textOverlay: `This is where ${businessName} comes in`,
      patternInterrupt: 'Energy shift, satisfying process shots',
    })
    scenes.push({
      time: '28-40s',
      action: 'TRANSFORMATION - Watch it happen',
      visual: 'The work being done, progress shown',
      broll: [...broll.processShots.slice(2), ...broll.resultShots.slice(0, 2)],
      textOverlay: 'Watch this...',
      patternInterrupt: 'Timelapse, satisfying reveals, jump cuts',
    })
    scenes.push({
      time: '40-50s',
      action: 'RESULT + PROOF - The payoff',
      visual: 'Beautiful result, customer reaction, testimonial',
      broll: [...broll.resultShots, broll.humanShots[0]],
      textOverlay: '"I wish I called sooner"',
      patternInterrupt: 'Slow reveal, genuine reaction capture',
    })
    scenes.push({
      time: '50-55s',
      action: 'TRUST - Why us',
      visual: 'Credentials, experience, trust signals',
      broll: broll.trustShots,
      textOverlay: `${businessName} - Trusted in ${city}`,
      patternInterrupt: 'Badge/certification animations',
    })
    scenes.push({
      time: '55-60s',
      action: 'CTA - Clear next step',
      visual: 'Logo, contact, what to do next',
      broll: [broll.trustShots[0], broll.humanShots[4]],
      textOverlay: `${cta} | Call/Text Today`,
      patternInterrupt: 'Final logo sting, contact info clear',
    })
  }

  // Build voiceover
  const service = services[0]?.toLowerCase() || 'quality service'
  let voiceover = ''

  if (duration === '15s') {
    voiceover = `${hook.replace('...', '')}. ${businessName} in ${city}. ${cta}.`
  } else if (duration === '30s') {
    voiceover = `${hook} At ${businessName}, we've seen it all. ${industry.audience.painPoints[0]}? We fix that. Serving ${city} with ${industry.visualStyle.mood.toLowerCase()} results. ${cta}!`
  } else {
    voiceover = `${hook} Look, ${industry.audience.painPoints[0].toLowerCase()} - it happens. But here's what most people don't realize: the longer you wait, the worse it gets. That's where ${businessName} comes in. We've been helping ${city} families with ${service} for years. Real people, real results. Don't wait until it's an emergency. ${cta} - you'll be glad you did.`
  }

  // Determine voice style based on platform
  let voiceStyle = soundStrat.voiceStyle

  return {
    hook,
    hookType,
    cta,
    scenes,
    voiceover,
    voiceStyle,
    pacing,
    captionStrategy: captionStrat,
    soundStrategy: soundStrat,
    format,
    formatDetails,
    hooks: allHooks,
    platform,
    duration,
    industry: industry.name,
  }
}

// ===========================================
// TARGETING RECOMMENDATIONS GENERATOR
// ===========================================
// Generates platform-specific targeting recommendations
// that can be directly used in ad platforms

export interface TargetingRecommendation {
  platform: string
  location: {
    radius: string
    type: string
  }
  demographics: {
    ageRange: { min: number; max: number }
    genders: string[]
  }
  interests: string[]
  behaviors: string[]
  excludeInterests: string[]
  // Platform-specific fields
  keywords?: string[]
  negativeKeywords?: string[]
  topics?: string[]
  placements?: string[]
  inMarketAudiences?: string[]
  affinity?: string[]
  customAudiences: string[]
  // Timing & Budget
  bestDays: string[]
  bestTimes: string[]
  seasonality: string
  budgetRange: { min: number; max: number; currency: string; per: string }
  // Estimated reach
  estimatedReach: string
}

export function generateTargetingRecommendations(
  industry: IndustryProfile,
  platform: 'facebook' | 'instagram' | 'youtube' | 'tiktok' | 'google',
  city: string,
  businessType: string
): TargetingRecommendation {
  const targeting = industry.targeting
  const general = targeting.general

  // Base recommendation that applies to all platforms
  const baseRecommendation = {
    platform: platform.charAt(0).toUpperCase() + platform.slice(1),
    location: {
      radius: '15-25 miles',
      type: `Around ${city} and surrounding areas`,
    },
    bestDays: general.bestDays,
    bestTimes: general.bestTimes,
    seasonality: general.seasonality,
    budgetRange: { ...general.budgetRange, per: 'day' },
    estimatedReach: '10,000-50,000', // Will be customized below
  }

  // Platform-specific targeting
  switch (platform) {
    case 'facebook':
      return {
        ...baseRecommendation,
        demographics: {
          ageRange: targeting.facebook.ageRange,
          genders: targeting.facebook.genders,
        },
        interests: targeting.facebook.interests,
        behaviors: targeting.facebook.behaviors,
        excludeInterests: targeting.facebook.excludeInterests,
        customAudiences: targeting.facebook.customAudiences,
        estimatedReach: '25,000-75,000',
      }

    case 'instagram':
      return {
        ...baseRecommendation,
        demographics: {
          ageRange: targeting.instagram.ageRange,
          genders: ['all'],
        },
        interests: targeting.instagram.interests,
        behaviors: targeting.instagram.behaviors,
        excludeInterests: targeting.facebook.excludeInterests, // Use Facebook's exclude list
        customAudiences: ['Instagram engagers', 'Website visitors', 'Past customers'],
        estimatedReach: '15,000-50,000',
      }

    case 'tiktok':
      return {
        ...baseRecommendation,
        demographics: {
          ageRange: targeting.tiktok.ageRange,
          genders: ['all'],
        },
        interests: targeting.tiktok.interests,
        behaviors: targeting.tiktok.behaviors,
        excludeInterests: [],
        customAudiences: targeting.tiktok.creatorCategories.map(c => `${c} content viewers`),
        placements: targeting.tiktok.creatorCategories,
        estimatedReach: '20,000-80,000',
      }

    case 'youtube':
      return {
        ...baseRecommendation,
        demographics: {
          ageRange: { min: 25, max: 55 },
          genders: ['all'],
        },
        interests: targeting.youtube.keywords,
        behaviors: [],
        excludeInterests: [],
        topics: targeting.youtube.topics,
        placements: targeting.youtube.placements,
        keywords: targeting.youtube.keywords,
        inMarketAudiences: targeting.youtube.inMarketAudiences,
        customAudiences: ['YouTube channel subscribers', 'Video viewers', 'Website visitors'],
        estimatedReach: '30,000-100,000',
      }

    case 'google':
      return {
        ...baseRecommendation,
        demographics: {
          ageRange: { min: 25, max: 65 },
          genders: ['all'],
        },
        interests: [],
        behaviors: [],
        excludeInterests: [],
        keywords: targeting.google.searchKeywords.map(k =>
          k.replace('[city]', city).replace('[service]', businessType)
        ),
        negativeKeywords: targeting.google.negativeKeywords.map(k =>
          k.replace('[service]', businessType)
        ),
        topics: targeting.google.displayTopics,
        inMarketAudiences: targeting.google.inMarketAudiences,
        affinity: targeting.google.affinity,
        customAudiences: ['Website visitors', 'Converters', 'Similar to converters'],
        estimatedReach: '5,000-25,000 (high intent)',
      }

    default:
      return {
        ...baseRecommendation,
        demographics: {
          ageRange: { min: 25, max: 65 },
          genders: ['all'],
        },
        interests: [],
        behaviors: [],
        excludeInterests: [],
        customAudiences: [],
      }
  }
}

// Helper function to format targeting for display
export function formatTargetingForDisplay(
  recommendation: TargetingRecommendation,
  platform: string
): {
  title: string
  sections: { label: string; items: string[] }[]
} {
  const sections: { label: string; items: string[] }[] = []

  // Demographics
  sections.push({
    label: 'Demographics',
    items: [
      `Age: ${recommendation.demographics.ageRange.min}-${recommendation.demographics.ageRange.max}`,
      `Gender: ${recommendation.demographics.genders.join(', ')}`,
      `Location: ${recommendation.location.radius} around ${recommendation.location.type}`,
    ],
  })

  // Interests (if not empty)
  if (recommendation.interests && recommendation.interests.length > 0) {
    sections.push({
      label: platform === 'google' ? 'Keywords to Target' : 'Interests to Target',
      items: recommendation.interests,
    })
  }

  // Keywords for Google/YouTube
  if (recommendation.keywords && recommendation.keywords.length > 0 && platform !== 'google') {
    sections.push({
      label: 'Search Keywords',
      items: recommendation.keywords.slice(0, 10),
    })
  }

  // Negative keywords
  if (recommendation.negativeKeywords && recommendation.negativeKeywords.length > 0) {
    sections.push({
      label: 'Negative Keywords (Exclude)',
      items: recommendation.negativeKeywords,
    })
  }

  // Behaviors
  if (recommendation.behaviors && recommendation.behaviors.length > 0) {
    sections.push({
      label: 'Behaviors',
      items: recommendation.behaviors,
    })
  }

  // Topics/Placements
  if (recommendation.topics && recommendation.topics.length > 0) {
    sections.push({
      label: 'Topics',
      items: recommendation.topics,
    })
  }

  if (recommendation.placements && recommendation.placements.length > 0) {
    sections.push({
      label: 'Placements',
      items: recommendation.placements,
    })
  }

  // In-Market Audiences
  if (recommendation.inMarketAudiences && recommendation.inMarketAudiences.length > 0) {
    sections.push({
      label: 'In-Market Audiences',
      items: recommendation.inMarketAudiences,
    })
  }

  // Affinity Audiences
  if (recommendation.affinity && recommendation.affinity.length > 0) {
    sections.push({
      label: 'Affinity Audiences',
      items: recommendation.affinity,
    })
  }

  // Exclude
  if (recommendation.excludeInterests && recommendation.excludeInterests.length > 0) {
    sections.push({
      label: 'Exclude These Interests',
      items: recommendation.excludeInterests,
    })
  }

  // Custom Audiences
  if (recommendation.customAudiences && recommendation.customAudiences.length > 0) {
    sections.push({
      label: 'Custom Audiences (Create These)',
      items: recommendation.customAudiences,
    })
  }

  // Timing
  sections.push({
    label: 'Best Timing',
    items: [
      `Days: ${recommendation.bestDays.join(', ')}`,
      `Times: ${recommendation.bestTimes.join(', ')}`,
      `Seasonality: ${recommendation.seasonality}`,
    ],
  })

  // Budget
  sections.push({
    label: 'Recommended Budget',
    items: [
      `$${recommendation.budgetRange.min}-$${recommendation.budgetRange.max} ${recommendation.budgetRange.currency}/${recommendation.budgetRange.per}`,
      `Estimated Reach: ${recommendation.estimatedReach}`,
    ],
  })

  return {
    title: `${recommendation.platform} Targeting Recommendations`,
    sections,
  }
}

// ===========================================
// UGC (USER-GENERATED CONTENT) IMAGE STYLES
// ===========================================
// 2026 audiences trust authentic, phone-shot content over polished studio work

export const UGC_STYLES = {
  phoneShot: {
    name: 'Phone-Shot Authentic',
    description: 'Looks like a customer took this with their phone',
    cameraInstructions: 'Smartphone camera quality, slight grain, natural imperfections',
    lighting: 'Natural light only, no studio lighting, window light acceptable',
    composition: 'Slightly off-center, casual framing, not perfectly composed',
    subjects: 'Real people in real situations, no models, authentic expressions',
    postProcessing: 'Minimal editing, no heavy filters, slight warmth acceptable',
    bestFor: ['tiktok', 'instagram', 'facebook'],
  },
  selfieStyle: {
    name: 'Selfie POV',
    description: 'First-person selfie perspective, like showing a friend',
    cameraInstructions: 'Front-facing camera angle, arm-length distance, ring light reflection in eyes',
    lighting: 'Ring light or window light, face well-lit',
    composition: 'Face in frame with context behind, showing something to viewer',
    subjects: 'Real worker/technician, mid-conversation expression',
    postProcessing: 'None - raw is better',
    bestFor: ['tiktok', 'instagram'],
  },
  behindScenes: {
    name: 'Behind-the-Scenes Raw',
    description: 'Unpolished work-in-progress shots',
    cameraInstructions: 'Documentary style, candid captures, motion blur acceptable',
    lighting: 'Whatever lighting exists on-site, no added lights',
    composition: 'Action shots, process moments, real work happening',
    subjects: 'Workers doing actual work, tools in use, real job sites',
    postProcessing: 'None - authenticity is key',
    bestFor: ['tiktok', 'instagram', 'facebook'],
  },
  customerCapture: {
    name: 'Customer-Shot Style',
    description: 'Like the customer is showing off the result',
    cameraInstructions: 'Phone camera, slightly shaky feel acceptable, portrait mode optional',
    lighting: 'Home lighting conditions, natural daylight from windows',
    composition: 'Proud showing-off angle, result prominent in frame',
    subjects: 'Finished work, customer hands in shot, home environment',
    postProcessing: 'Maybe brightness boost, but no filters',
    bestFor: ['facebook', 'instagram', 'google'],
  },
  screenRecordStyle: {
    name: 'Screen Record Overlay',
    description: 'Mimics a screen recording or video capture screenshot',
    cameraInstructions: 'Sharp but compressed quality, UI elements acceptable',
    lighting: 'N/A - digital capture aesthetic',
    composition: 'Full-frame content with UI hints',
    subjects: 'Key moment from video, dramatic freeze frame',
    postProcessing: 'Add subtle phone UI elements, time stamp',
    bestFor: ['tiktok', 'youtube'],
  },
}

export type UGCStyleKey = keyof typeof UGC_STYLES

// ===========================================
// SCROLL-STOP TECHNIQUES (2026)
// ===========================================
// Visual patterns that break the endless scroll

export const SCROLL_STOP_TECHNIQUES = {
  visual: {
    contrastShock: {
      name: 'High Contrast Shock',
      description: 'Extreme light/dark contrast that pops against any feed',
      implementation: 'Deep blacks against bright whites or neons',
      effectiveness: 'Very High',
    },
    colorPop: {
      name: 'Unexpected Color Pop',
      description: 'One bold color in otherwise muted scene',
      implementation: 'Single orange, red, or yellow element against neutral background',
      effectiveness: 'High',
    },
    humanEyes: {
      name: 'Direct Eye Contact',
      description: 'Human eyes looking directly at viewer',
      implementation: 'Subject making eye contact with camera, close crop on face',
      effectiveness: 'Very High',
    },
    motionFreeze: {
      name: 'Frozen Motion',
      description: 'Capture a moment that implies movement',
      implementation: 'Water splash, debris flying, action mid-moment',
      effectiveness: 'High',
    },
    beforeAfterSplit: {
      name: 'Before/After Split',
      description: 'Side-by-side or diagonal split showing transformation',
      implementation: 'Clear visual divide, dramatic difference obvious',
      effectiveness: 'Very High',
    },
    textInImage: {
      name: 'Bold Text in Image',
      description: 'Large, readable text that creates curiosity',
      implementation: 'Question or hook embedded in image, high contrast',
      effectiveness: 'Medium-High',
    },
    unexpectedAngle: {
      name: 'Unusual Camera Angle',
      description: 'POV that viewers rarely see',
      implementation: 'Under, above, inside, extreme close-up, fisheye',
      effectiveness: 'Medium',
    },
    patternBreak: {
      name: 'Pattern Interruption',
      description: 'Something that breaks expected visual patterns',
      implementation: 'Unexpected object in scene, surreal element, visual anomaly',
      effectiveness: 'High',
    },
  },
  psychological: {
    curiosityGap: {
      name: 'Curiosity Gap',
      description: 'Shows partial information that demands completion',
      implementation: 'Cropped reveal, "what happens next" moment, hidden element',
      effectiveness: 'Very High',
    },
    socialProof: {
      name: 'Visible Social Proof',
      description: 'Numbers, reviews, or crowds visible in image',
      implementation: 'Star ratings, review quotes, "500+ served" overlays',
      effectiveness: 'High',
    },
    urgencySignal: {
      name: 'Urgency Visual',
      description: 'Visual that implies time-sensitivity',
      implementation: 'Clock, "limited time" badge, seasonal element',
      effectiveness: 'Medium-High',
    },
    identityTrigger: {
      name: 'Identity Recognition',
      description: 'Viewer sees themselves in the image',
      implementation: 'Relatable situation, "that\'s me" moment, local references',
      effectiveness: 'Very High',
    },
    problemPain: {
      name: 'Problem Visualization',
      description: 'Visual representation of the pain point',
      implementation: 'Broken thing, frustrated person, mess that needs fixing',
      effectiveness: 'High',
    },
  },
}

// ===========================================
// DIVERSITY & REPRESENTATION GUIDELINES (2026)
// ===========================================
// Required for compliance and authenticity

export const DIVERSITY_GUIDELINES = {
  requirements: {
    ageRepresentation: {
      description: 'Show diverse age ranges appropriate to the platform',
      guidelines: [
        'TikTok: Skew younger (25-40) but include 40+ occasionally',
        'Facebook: Include 40-65 regularly, they are the core audience',
        'Instagram: Mix of ages, slight skew to 25-45',
        'YouTube: Broad range depending on content type',
      ],
    },
    ethnicDiversity: {
      description: 'Reflect the actual diversity of service areas',
      guidelines: [
        'Research local demographics for the business\'s service area',
        'Avoid tokenism - diversity should feel natural, not forced',
        'Include diverse workers AND customers',
        'No stereotypical associations (race + profession)',
      ],
    },
    genderBalance: {
      description: 'Show gender diversity in non-stereotypical ways',
      guidelines: [
        'Women in trades (plumbing, electrical, HVAC) - normalize it',
        'Men in caregiving/service roles - equally valid',
        'Don\'t default to stereotypes (woman = homemaker, man = breadwinner)',
        'Include visible representation when natural to the scene',
      ],
    },
    bodyDiversity: {
      description: 'Represent real body types, not just fitness models',
      guidelines: [
        'Real workers have real bodies - show that',
        'Avoid only showing idealized body types',
        'Customers come in all shapes and sizes',
      ],
    },
    abilityInclusion: {
      description: 'Include people with visible and invisible disabilities',
      guidelines: [
        'Wheelchair users as customers occasionally',
        'Accessibility considerations in shown spaces',
        'Don\'t make disability the focus unless relevant',
      ],
    },
    familyStructures: {
      description: 'Recognize diverse family structures',
      guidelines: [
        'Single parents',
        'Same-sex couples',
        'Multi-generational households',
        'Child-free adults',
        'Chosen families',
      ],
    },
  },
  promptModifiers: {
    diverseWorker: 'diverse professional worker of varied ethnicity and age',
    diverseCustomer: 'relatable customer representing local community diversity',
    diverseFamily: 'modern family of diverse background',
    inclusiveScene: 'inclusive scene reflecting real community diversity',
  },
}

// ===========================================
// AI DISCLOSURE REQUIREMENTS (2026)
// ===========================================
// Platform-specific requirements for AI-generated content

export const AI_DISCLOSURE = {
  meta: {
    platforms: ['facebook', 'instagram'],
    requirement: 'REQUIRED for AI-generated images in ads',
    how: 'Use "AI-generated" label in Meta Ads Manager',
    consequences: 'Ad rejection, account penalties for non-compliance',
    disclosureText: 'This image was created with AI assistance',
    placement: 'Ad-level disclosure in platform, optional visible watermark',
  },
  google: {
    platforms: ['google', 'youtube'],
    requirement: 'REQUIRED for realistic AI content',
    how: 'Check "AI-generated content" box in Google Ads',
    consequences: 'Policy violation, ad disapproval',
    disclosureText: 'AI-generated imagery',
    placement: 'Platform disclosure required, visible label recommended',
  },
  tiktok: {
    platforms: ['tiktok'],
    requirement: 'REQUIRED for AI-generated content',
    how: 'Use #AIGenerated or platform\'s AI label feature',
    consequences: 'Content removal, account restrictions',
    disclosureText: '#AIGenerated',
    placement: 'Visible in post, hashtag or label',
  },
  bestPractices: [
    'Always disclose AI-generated images - it\'s the law in many jurisdictions',
    'Transparency builds trust - users appreciate honesty',
    'Keep records of AI generation for compliance audits',
    'Don\'t try to pass AI images as real photography',
    'Consider mixing AI images with real photos for authenticity',
  ],
  watermarkOptions: [
    'Small "AI" badge in corner',
    'Caption disclosure: "Image created with AI"',
    'Hashtag: #AIGenerated #AIArt',
  ],
}

// ===========================================
// SEASONAL TRIGGERS & TIMING
// ===========================================
// Industry-specific seasonal marketing opportunities

export const SEASONAL_TRIGGERS: Record<string, {
  seasons: {
    name: string
    months: number[]
    triggers: string[]
    hooks: string[]
    urgency: string
  }[]
}> = {
  plumbing: {
    seasons: [
      {
        name: 'Frozen Pipe Season',
        months: [12, 1, 2],
        triggers: ['First freeze warning', 'Temperature drops below 32°F', 'Polar vortex news'],
        hooks: [
          'Your pipes are about to freeze. Here\'s what to do.',
          'It\'s 28 degrees. Do you know where your main shutoff is?',
          'The $50 thing that prevents $5,000 in damage',
        ],
        urgency: 'Act NOW before the freeze',
      },
      {
        name: 'Spring Maintenance',
        months: [3, 4, 5],
        triggers: ['Spring cleaning season', 'Home inspection season', 'Moving season starts'],
        hooks: [
          'Spring cleaning? Don\'t forget what\'s under your sink.',
          'Moving soon? Get a plumbing inspection first.',
          'The spring maintenance checklist pros use',
        ],
        urgency: 'Schedule before the rush',
      },
      {
        name: 'Summer AC/Water Heater',
        months: [6, 7, 8],
        triggers: ['Heat waves', 'Vacation season', 'BBQ/outdoor season'],
        hooks: [
          'Going on vacation? Water damage happens while you\'re gone.',
          'Your water heater is working overtime. Is it up for it?',
        ],
        urgency: 'Don\'t let vacation become disaster',
      },
    ],
  },
  hvac: {
    seasons: [
      {
        name: 'Pre-Summer Rush',
        months: [4, 5],
        triggers: ['First warm week', 'Daylight savings', 'Allergy season'],
        hooks: [
          'Your AC hasn\'t run in 6 months. Is it ready?',
          'Book now or sweat later - summer slots filling fast',
          'The $89 tune-up that prevents $3,000 repairs',
        ],
        urgency: 'Book before the heat hits',
      },
      {
        name: 'Peak Summer Emergency',
        months: [6, 7, 8],
        triggers: ['Heat advisory', 'AC breakdowns spike', 'Record temperatures'],
        hooks: [
          'AC died? We have same-day emergency slots.',
          'It\'s 98 degrees and your AC just quit. Now what?',
          'How we\'re keeping [city] cool this summer',
        ],
        urgency: 'Emergency service available',
      },
      {
        name: 'Pre-Winter Prep',
        months: [9, 10, 11],
        triggers: ['First cold snap', 'Heating season begins', 'Fall energy bills'],
        hooks: [
          'Your furnace sat for 6 months. Will it work?',
          'The heating tune-up that pays for itself',
          'Don\'t wait for the first freeze to test your heat',
        ],
        urgency: 'Schedule before cold arrives',
      },
    ],
  },
  roofing: {
    seasons: [
      {
        name: 'Post-Storm Assessment',
        months: [4, 5, 6, 9, 10],
        triggers: ['Storm warnings', 'Hail reports', 'High wind events'],
        hooks: [
          'That storm last night? Your roof took hits. Free inspection.',
          'Hail damage isn\'t always visible. Here\'s what to look for.',
          'Insurance deadline approaching - get your claim filed',
        ],
        urgency: 'Insurance claims have deadlines',
      },
      {
        name: 'Spring Inspection Season',
        months: [3, 4, 5],
        triggers: ['Spring home prep', 'Real estate season', 'Tax refunds'],
        hooks: [
          'Winter did a number on your roof. Let\'s check.',
          'Selling soon? Roof problems kill deals.',
          'Tax refund? Smart homeowners invest in their roof.',
        ],
        urgency: 'Best weather for repairs',
      },
    ],
  },
  dental: {
    seasons: [
      {
        name: 'Back to School',
        months: [7, 8],
        triggers: ['School registration', 'Sports physicals', 'New school year'],
        hooks: [
          'School starts in 3 weeks. Is their smile ready?',
          'Sports require dental exams. Book now.',
          'New school year, new smile confidence',
        ],
        urgency: 'Slots filling fast before school',
      },
      {
        name: 'Year-End Benefits',
        months: [10, 11, 12],
        triggers: ['Use-it-or-lose-it benefits', 'FSA/HSA deadlines', 'Holiday photos'],
        hooks: [
          'Your dental benefits expire Dec 31. Don\'t waste $1,500.',
          'Holiday photos coming up. Time for that whitening?',
          'FSA dollars expiring? Use them on your smile.',
        ],
        urgency: 'Benefits expire - act now',
      },
      {
        name: 'Wedding Season',
        months: [4, 5, 6],
        triggers: ['Engagement announcements', 'Wedding planning', 'Spring events'],
        hooks: [
          'Getting married? Your smile will be in 500 photos.',
          'The smile makeover brides book 3 months ahead',
          'Wedding party? Group whitening packages available.',
        ],
        urgency: 'Book 3 months before the big day',
      },
    ],
  },
  accounting: {
    seasons: [
      {
        name: 'Tax Season',
        months: [1, 2, 3, 4],
        triggers: ['W-2s arriving', 'Tax deadline news', 'Refund season'],
        hooks: [
          'Still doing your own taxes? You\'re probably overpaying.',
          'Tax deadline is [X] days away. Are you ready?',
          'The average refund we find that DIY software misses: $1,847',
        ],
        urgency: 'File before the deadline',
      },
      {
        name: 'Q4 Planning',
        months: [10, 11, 12],
        triggers: ['Year-end approaching', 'Business planning', 'Tax strategy time'],
        hooks: [
          'December 31 is coming. These 5 moves could save you thousands.',
          'Year-end tax planning: What smart business owners do NOW',
          'Q4 profit? Here\'s how to keep more of it.',
        ],
        urgency: 'Year-end moves must happen by Dec 31',
      },
    ],
  },
  realestate: {
    seasons: [
      {
        name: 'Spring Market',
        months: [3, 4, 5],
        triggers: ['Inventory rising', 'School year ending', 'Best selling season'],
        hooks: [
          'Spring market is HERE. Inventory up 40% in [city].',
          'List now: Spring buyers are ready with pre-approvals.',
          'The 3-week window when homes sell fastest',
        ],
        urgency: 'Prime selling season NOW',
      },
      {
        name: 'Summer Family Moves',
        months: [6, 7],
        triggers: ['School\'s out', 'Relocation season', 'Family moves'],
        hooks: [
          'Relocating families are buying NOW to settle before school.',
          'Summer sellers: These families need to move fast.',
          'The sweet spot for family buyers is the next 6 weeks.',
        ],
        urgency: 'Beat the school deadline',
      },
    ],
  },
}

// ===========================================
// COMPETITIVE DIFFERENTIATION PROMPTS
// ===========================================
// Help businesses articulate what makes them different

export const COMPETITIVE_DIFFERENTIATORS = {
  prompts: [
    'What do you do that your competitors DON\'T do?',
    'What complaint do customers have about OTHER businesses in your industry?',
    'Why do customers choose you OVER the competitor down the street?',
    'What\'s the one thing you\'d want people to know before they hire anyone else?',
    'What guarantee or promise do you make that others won\'t?',
  ],
  commonDifferentiators: {
    speed: {
      keywords: ['same-day', '24/7', 'emergency', 'fast response', 'on-time'],
      copyAngles: [
        'When others say "we\'ll get back to you," we show up.',
        'Same-day service isn\'t a promise. It\'s our standard.',
        'Your emergency is our priority.',
      ],
    },
    pricing: {
      keywords: ['upfront', 'no hidden fees', 'flat rate', 'free estimate', 'price match'],
      copyAngles: [
        'The price we quote is the price you pay. Period.',
        'No surprises. No hidden fees. No games.',
        'Free estimates because you deserve to know before you commit.',
      ],
    },
    quality: {
      keywords: ['licensed', 'certified', 'warranty', 'guarantee', 'premium'],
      copyAngles: [
        'We fix it right the first time, or we fix it free.',
        'Licensed, insured, and actually qualified.',
        'Quality costs less when you don\'t have to redo it.',
      ],
    },
    trust: {
      keywords: ['family-owned', 'local', 'years experience', 'reviews', 'background checked'],
      copyAngles: [
        'Your neighbor\'s been using us for 15 years. Ask them.',
        'We live here too. Our reputation is everything.',
        'Background-checked technicians. Because it\'s your home.',
      ],
    },
    service: {
      keywords: ['friendly', 'respectful', 'clean', 'communicative', 'professional'],
      copyAngles: [
        'We wear booties, clean up after ourselves, and actually show up on time.',
        'You\'ll know what\'s happening every step of the way.',
        'Friendly service that treats your home like our own.',
      ],
    },
    technology: {
      keywords: ['modern', 'advanced', 'latest', 'technology', 'equipment'],
      copyAngles: [
        'The latest equipment means faster, better results.',
        'We invested in technology so you don\'t have to wait.',
        'Modern solutions for modern problems.',
      ],
    },
  },
}

// ===========================================
// IMAGE FORMAT PRESETS (2026)
// ===========================================
// All the format options for each platform

export const IMAGE_FORMAT_PRESETS = {
  facebook: {
    formats: [
      { name: 'Feed Post', width: 1200, height: 630, ratio: '1.91:1', use: 'Standard feed ads' },
      { name: 'Square Post', width: 1080, height: 1080, ratio: '1:1', use: 'Versatile, works everywhere' },
      { name: 'Story/Reel', width: 1080, height: 1920, ratio: '9:16', use: 'Stories, Reels, full-screen' },
      { name: 'Carousel Card', width: 1080, height: 1080, ratio: '1:1', use: 'Carousel ad cards' },
      { name: 'Cover Photo', width: 820, height: 312, ratio: '2.63:1', use: 'Page cover' },
    ],
    recommended: 'Square Post',
  },
  instagram: {
    formats: [
      { name: 'Square Post', width: 1080, height: 1080, ratio: '1:1', use: 'Classic Instagram post' },
      { name: 'Portrait Post', width: 1080, height: 1350, ratio: '4:5', use: 'Taller feed presence' },
      { name: 'Story/Reel', width: 1080, height: 1920, ratio: '9:16', use: 'Stories, Reels' },
      { name: 'Landscape', width: 1080, height: 608, ratio: '1.91:1', use: 'Landscape photos' },
      { name: 'Carousel Card', width: 1080, height: 1080, ratio: '1:1', use: 'Swipeable carousel' },
    ],
    recommended: 'Portrait Post',
  },
  tiktok: {
    formats: [
      { name: 'Full Screen', width: 1080, height: 1920, ratio: '9:16', use: 'Standard TikTok format' },
      { name: 'Spark Ad', width: 1080, height: 1920, ratio: '9:16', use: 'Boosted organic content' },
    ],
    recommended: 'Full Screen',
  },
  youtube: {
    formats: [
      { name: 'Thumbnail', width: 1280, height: 720, ratio: '16:9', use: 'Video thumbnails' },
      { name: 'Display Ad', width: 300, height: 250, ratio: '6:5', use: 'Display network' },
      { name: 'Banner Ad', width: 728, height: 90, ratio: '8:1', use: 'Banner placements' },
      { name: 'Channel Art', width: 2560, height: 1440, ratio: '16:9', use: 'Channel banner' },
    ],
    recommended: 'Thumbnail',
  },
  google: {
    formats: [
      { name: 'Square', width: 1200, height: 1200, ratio: '1:1', use: 'Responsive display' },
      { name: 'Landscape', width: 1200, height: 628, ratio: '1.91:1', use: 'Responsive display' },
      { name: 'Portrait', width: 960, height: 1200, ratio: '4:5', use: 'Mobile display' },
      { name: 'Leaderboard', width: 728, height: 90, ratio: '8:1', use: 'Banner ads' },
      { name: 'Medium Rectangle', width: 300, height: 250, ratio: '6:5', use: 'Sidebar ads' },
    ],
    recommended: 'Square',
  },
}

// ===========================================
// BULK GENERATION HELPERS
// ===========================================

export interface BulkGenerationConfig {
  platforms: ('facebook' | 'instagram' | 'tiktok' | 'youtube' | 'google')[]
  imageTypes: ('hero' | 'service' | 'testimonial' | 'promo')[]
  ugcStyles: UGCStyleKey[]
  videoDurations: ('15s' | '30s' | '60s')[]
  videoFormats: (keyof typeof VIDEO_FORMATS_2026)[]
  copyVariationsPerPlatform: number
}

export function generateBulkConfig(
  scope: 'minimal' | 'standard' | 'comprehensive'
): BulkGenerationConfig {
  switch (scope) {
    case 'minimal':
      return {
        platforms: ['facebook', 'instagram'],
        imageTypes: ['hero', 'service'],
        ugcStyles: ['phoneShot'],
        videoDurations: ['15s'],
        videoFormats: ['satisfyingTransform'],
        copyVariationsPerPlatform: 2,
      }
    case 'standard':
      return {
        platforms: ['facebook', 'instagram', 'tiktok', 'google'],
        imageTypes: ['hero', 'service', 'testimonial', 'promo'],
        ugcStyles: ['phoneShot', 'selfieStyle', 'behindScenes'],
        videoDurations: ['15s', '30s'],
        videoFormats: ['satisfyingTransform', 'storytime', 'povStyle'],
        copyVariationsPerPlatform: 3,
      }
    case 'comprehensive':
      return {
        platforms: ['facebook', 'instagram', 'tiktok', 'youtube', 'google'],
        imageTypes: ['hero', 'service', 'testimonial', 'promo'],
        ugcStyles: ['phoneShot', 'selfieStyle', 'behindScenes', 'customerCapture'],
        videoDurations: ['15s', '30s', '60s'],
        videoFormats: ['satisfyingTransform', 'storytime', 'povStyle', 'tutorial', 'customerReaction', 'mythBuster'],
        copyVariationsPerPlatform: 3,
      }
  }
}

export function calculateBulkGenerationCount(config: BulkGenerationConfig): {
  images: number
  videos: number
  copyVariations: number
  total: number
  estimatedCost: string
} {
  const images = config.platforms.length * config.imageTypes.length * config.ugcStyles.length
  const videos = config.platforms.length * config.videoDurations.length * config.videoFormats.length
  const copyVariations = config.platforms.length * config.copyVariationsPerPlatform
  const total = images + videos + copyVariations

  // Rough cost estimate: $0.08 per DALL-E image, $0.01 per Claude call
  const imageCost = images * 0.08
  const copyCost = copyVariations * 0.01

  return {
    images,
    videos,
    copyVariations,
    total,
    estimatedCost: `~$${(imageCost + copyCost).toFixed(2)}`,
  }
}

// ===========================================
// EXPORT FORMATTERS
// ===========================================
// Format data for export to ad platforms

export interface ExportedAdSet {
  platform: string
  adName: string
  headline: string
  primaryText: string
  description?: string
  callToAction: string
  imagePrompt?: string
  videoScript?: string
  targeting: string
  placement: string
  format: string
}

export function exportToCsv(ads: ExportedAdSet[]): string {
  const headers = [
    'Platform',
    'Ad Name',
    'Headline',
    'Primary Text',
    'Description',
    'Call to Action',
    'Image Prompt',
    'Video Script',
    'Targeting',
    'Placement',
    'Format',
  ]

  const rows = ads.map(ad => [
    ad.platform,
    ad.adName,
    ad.headline,
    ad.primaryText,
    ad.description || '',
    ad.callToAction,
    ad.imagePrompt || '',
    ad.videoScript || '',
    ad.targeting,
    ad.placement,
    ad.format,
  ].map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))

  return [headers.join(','), ...rows].join('\n')
}

export function exportToMetaFormat(ads: ExportedAdSet[]): object[] {
  return ads
    .filter(ad => ad.platform === 'facebook' || ad.platform === 'instagram')
    .map(ad => ({
      'Ad Name': ad.adName,
      'Ad Status': 'PAUSED',
      'Headline': ad.headline,
      'Primary Text': ad.primaryText,
      'Description': ad.description,
      'Call to Action': ad.callToAction.toUpperCase().replace(/ /g, '_'),
      'Website URL': '[INSERT_URL]',
      'Image': '[INSERT_IMAGE_URL]',
    }))
}

export function exportToGoogleFormat(ads: ExportedAdSet[]): object[] {
  return ads
    .filter(ad => ad.platform === 'google')
    .map(ad => ({
      'Campaign': '[CAMPAIGN_NAME]',
      'Ad group': '[AD_GROUP_NAME]',
      'Headline 1': ad.headline.substring(0, 30),
      'Headline 2': ad.primaryText.substring(0, 30),
      'Headline 3': ad.callToAction.substring(0, 30),
      'Description 1': ad.description?.substring(0, 90) || '',
      'Description 2': ad.primaryText.substring(0, 90),
      'Final URL': '[INSERT_URL]',
      'Path 1': '',
      'Path 2': '',
    }))
}

// ===========================================
// PERFORMANCE TRACKING INTERFACES
// ===========================================
// Data structures for tracking ad performance

export interface AdPerformanceMetrics {
  id: string
  platform: string
  adType: 'image' | 'video' | 'copy'
  createdAt: Date
  // Engagement metrics
  impressions: number
  clicks: number
  ctr: number // click-through rate
  // Conversion metrics
  conversions: number
  conversionRate: number
  costPerConversion: number
  // Cost metrics
  spend: number
  cpm: number // cost per 1000 impressions
  cpc: number // cost per click
  // Video-specific
  videoViews?: number
  videoCompletionRate?: number
  // Content reference
  hookType?: string
  videoFormat?: string
  imageStyle?: string
  copyVariation?: number
}

export interface PerformanceInsight {
  type: 'winning' | 'losing' | 'opportunity'
  metric: string
  insight: string
  recommendation: string
  confidence: 'high' | 'medium' | 'low'
}

export function analyzePerformance(metrics: AdPerformanceMetrics[]): PerformanceInsight[] {
  const insights: PerformanceInsight[] = []

  if (metrics.length < 5) {
    insights.push({
      type: 'opportunity',
      metric: 'data volume',
      insight: 'Not enough data for reliable insights yet',
      recommendation: 'Continue running ads and check back after 100+ impressions per ad',
      confidence: 'low',
    })
    return insights
  }

  // Find top performing hook types
  const byHookType = metrics.reduce((acc, m) => {
    if (m.hookType) {
      if (!acc[m.hookType]) acc[m.hookType] = []
      acc[m.hookType].push(m)
    }
    return acc
  }, {} as Record<string, AdPerformanceMetrics[]>)

  const hookPerformance = Object.entries(byHookType).map(([hook, items]) => ({
    hook,
    avgCtr: items.reduce((sum, i) => sum + i.ctr, 0) / items.length,
    count: items.length,
  })).sort((a, b) => b.avgCtr - a.avgCtr)

  if (hookPerformance.length >= 2) {
    const best = hookPerformance[0]
    const worst = hookPerformance[hookPerformance.length - 1]

    if (best.avgCtr > worst.avgCtr * 1.5) {
      insights.push({
        type: 'winning',
        metric: 'hook type',
        insight: `"${best.hook}" hooks outperform "${worst.hook}" by ${((best.avgCtr / worst.avgCtr - 1) * 100).toFixed(0)}%`,
        recommendation: `Create more ads using "${best.hook}" style hooks`,
        confidence: best.count >= 3 ? 'high' : 'medium',
      })
    }
  }

  // Find platform performance
  const byPlatform = metrics.reduce((acc, m) => {
    if (!acc[m.platform]) acc[m.platform] = []
    acc[m.platform].push(m)
    return acc
  }, {} as Record<string, AdPerformanceMetrics[]>)

  const platformPerformance = Object.entries(byPlatform).map(([platform, items]) => ({
    platform,
    avgCpc: items.reduce((sum, i) => sum + i.cpc, 0) / items.length,
    avgConvRate: items.reduce((sum, i) => sum + i.conversionRate, 0) / items.length,
    count: items.length,
  })).sort((a, b) => a.avgCpc - b.avgCpc)

  if (platformPerformance.length >= 2) {
    const cheapest = platformPerformance[0]
    insights.push({
      type: 'opportunity',
      metric: 'platform efficiency',
      insight: `${cheapest.platform} has the lowest cost per click ($${cheapest.avgCpc.toFixed(2)})`,
      recommendation: `Consider increasing budget on ${cheapest.platform}`,
      confidence: cheapest.count >= 5 ? 'high' : 'medium',
    })
  }

  return insights
}

// ===========================================
// VOICEOVER SCRIPT GENERATOR
// ===========================================
// AI voice guidance for video scripts

export const VOICEOVER_STYLES = {
  conversational: {
    name: 'Conversational',
    description: 'Like talking to a friend',
    pacing: 'Natural, with pauses for emphasis',
    tone: 'Warm, relatable, slightly casual',
    aiVoiceRecommendation: 'ElevenLabs: Josh, Rachel | Play.ht: Davis',
    bestFor: ['tiktok', 'instagram'],
  },
  professional: {
    name: 'Professional',
    description: 'Authoritative but approachable',
    pacing: 'Measured, clear, confident',
    tone: 'Trustworthy, expert, reassuring',
    aiVoiceRecommendation: 'ElevenLabs: Antoni, Bella | Play.ht: Michael',
    bestFor: ['youtube', 'facebook', 'google'],
  },
  energetic: {
    name: 'High Energy',
    description: 'Excited, fast-paced, urgent',
    pacing: 'Fast but clear, building excitement',
    tone: 'Enthusiastic, motivating, action-oriented',
    aiVoiceRecommendation: 'ElevenLabs: Arnold, Domi | Play.ht: Emma',
    bestFor: ['tiktok'],
  },
  storyteller: {
    name: 'Storyteller',
    description: 'Narrative, drawing you in',
    pacing: 'Variable - slow for tension, faster for action',
    tone: 'Engaging, dramatic, compelling',
    aiVoiceRecommendation: 'ElevenLabs: Clyde, Dorothy | Play.ht: William',
    bestFor: ['youtube', 'facebook'],
  },
  local: {
    name: 'Local Expert',
    description: 'Your neighborhood pro',
    pacing: 'Relaxed, genuine',
    tone: 'Friendly, trustworthy, down-to-earth',
    aiVoiceRecommendation: 'ElevenLabs: Sam, Grace | Play.ht: James',
    bestFor: ['facebook', 'google'],
  },
}

export function generateVoiceoverScript(
  videoScript: VideoScript2026,
  style: keyof typeof VOICEOVER_STYLES = 'conversational'
): {
  script: string
  wordCount: number
  estimatedDuration: string
  speakingNotes: string[]
  aiVoiceSettings: {
    service: string
    voiceName: string
    speed: number
    stability: number
    clarity: number
  }
} {
  const voiceStyle = VOICEOVER_STYLES[style]
  const script = videoScript.voiceover
  const wordCount = script.split(' ').length

  // Average speaking rate: 130-150 words per minute
  // Adjust for style
  const wordsPerMinute = style === 'energetic' ? 170 : style === 'storyteller' ? 120 : 140
  const durationSeconds = Math.round((wordCount / wordsPerMinute) * 60)

  const speakingNotes: string[] = []

  // Add style-specific notes
  if (style === 'energetic') {
    speakingNotes.push('Start with HIGH energy from word one')
    speakingNotes.push('Emphasize action words')
    speakingNotes.push('Build to the CTA with increasing urgency')
  } else if (style === 'storyteller') {
    speakingNotes.push('Start slower to build intrigue')
    speakingNotes.push('Pause briefly before reveals')
    speakingNotes.push('Let the story breathe')
  } else if (style === 'conversational') {
    speakingNotes.push('Imagine talking to a friend over coffee')
    speakingNotes.push('Use natural pauses, not robotic rhythm')
    speakingNotes.push('Slight smile in your voice')
  }

  // Add hook-specific notes
  if (videoScript.hookType === 'pov') {
    speakingNotes.push('POV hook: Make it feel like THEIR experience')
  } else if (videoScript.hookType === 'controversy') {
    speakingNotes.push('Controversy hook: Lean into the boldness')
  }

  return {
    script,
    wordCount,
    estimatedDuration: `${durationSeconds}s (fits ${videoScript.duration} video)`,
    speakingNotes,
    aiVoiceSettings: {
      service: 'ElevenLabs',
      voiceName: voiceStyle.aiVoiceRecommendation.split(': ')[1].split(', ')[0],
      speed: style === 'energetic' ? 1.15 : style === 'storyteller' ? 0.9 : 1.0,
      stability: style === 'conversational' ? 0.6 : 0.75,
      clarity: 0.8,
    },
  }
}

// ===========================================
// ENHANCED IMAGE PROMPT WITH UGC SUPPORT
// ===========================================

export function generateImagePromptWithStyle(
  industry: IndustryProfile,
  businessName: string,
  platform: 'facebook' | 'instagram' | 'youtube' | 'tiktok' | 'google',
  promptType: 'hero' | 'service' | 'testimonial' | 'promo',
  ugcStyle?: UGCStyleKey,
  scrollStopTechnique?: keyof typeof SCROLL_STOP_TECHNIQUES.visual
): {
  prompt: string
  ugcInstructions: string | null
  scrollStopNote: string | null
  diversityNote: string
  aiDisclosure: string
  format: { width: number; height: number; ratio: string }
} {
  // Get base prompt from existing function
  const basePrompt = generateImagePrompt(industry, businessName, platform, promptType)

  // Get recommended format
  const platformFormats = IMAGE_FORMAT_PRESETS[platform]
  const recommendedFormat = platformFormats.formats.find(f => f.name === platformFormats.recommended) || platformFormats.formats[0]

  let finalPrompt = basePrompt
  let ugcInstructions: string | null = null
  let scrollStopNote: string | null = null

  // Add UGC style modifications
  if (ugcStyle && UGC_STYLES[ugcStyle]) {
    const style = UGC_STYLES[ugcStyle]
    ugcInstructions = `UGC STYLE: ${style.name}\n- Camera: ${style.cameraInstructions}\n- Lighting: ${style.lighting}\n- Composition: ${style.composition}`

    // Modify the prompt for UGC
    finalPrompt = finalPrompt.replace(
      /CAMERA:.*?\n/,
      `CAMERA: ${style.cameraInstructions}. ${style.lighting}. ${style.postProcessing || 'Natural processing'}.\n`
    )

    // Add authenticity markers
    finalPrompt += `\nAUTHENTICITY: This should look like ${style.description}. Avoid: overly polished, studio-perfect shots. Include: natural imperfections, real-world lighting.`
  }

  // Add scroll-stop technique
  if (scrollStopTechnique && SCROLL_STOP_TECHNIQUES.visual[scrollStopTechnique]) {
    const technique = SCROLL_STOP_TECHNIQUES.visual[scrollStopTechnique]
    scrollStopNote = `SCROLL-STOP: ${technique.name} - ${technique.implementation}`
    finalPrompt += `\n\nSCROLL-STOP TECHNIQUE: ${technique.implementation}.`
  }

  // Always add diversity guidance
  const diversityNote = `Include ${DIVERSITY_GUIDELINES.promptModifiers.diverseWorker} and/or ${DIVERSITY_GUIDELINES.promptModifiers.diverseCustomer} - reflect real community diversity naturally.`
  finalPrompt += `\n\nDIVERSITY: ${diversityNote}`

  // Get AI disclosure
  const platformDisclosure = platform === 'tiktok'
    ? AI_DISCLOSURE.tiktok
    : ['facebook', 'instagram'].includes(platform)
      ? AI_DISCLOSURE.meta
      : AI_DISCLOSURE.google

  const aiDisclosure = `${platformDisclosure.requirement}. ${platformDisclosure.disclosureText}`

  return {
    prompt: finalPrompt,
    ugcInstructions,
    scrollStopNote,
    diversityNote,
    aiDisclosure,
    format: {
      width: recommendedFormat.width,
      height: recommendedFormat.height,
      ratio: recommendedFormat.ratio,
    },
  }
}

// ===========================================
// GET SEASONAL CONTENT FOR INDUSTRY
// ===========================================

export function getSeasonalContent(
  industryId: string,
  currentMonth?: number
): {
  activeSeason: typeof SEASONAL_TRIGGERS.plumbing.seasons[0] | null
  hooks: string[]
  urgencyMessage: string | null
  isHighSeason: boolean
} {
  const month = currentMonth || new Date().getMonth() + 1
  const industrySeasons = SEASONAL_TRIGGERS[industryId]

  if (!industrySeasons) {
    return {
      activeSeason: null,
      hooks: [],
      urgencyMessage: null,
      isHighSeason: false,
    }
  }

  const activeSeason = industrySeasons.seasons.find(s => s.months.includes(month))

  if (!activeSeason) {
    return {
      activeSeason: null,
      hooks: [],
      urgencyMessage: null,
      isHighSeason: false,
    }
  }

  return {
    activeSeason,
    hooks: activeSeason.hooks,
    urgencyMessage: activeSeason.urgency,
    isHighSeason: true,
  }
}
