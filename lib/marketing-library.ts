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
// DALL-E PROMPT GENERATOR - PLATFORM + TYPE SPECIFIC
// ===========================================
// Each image type serves a DISTINCT purpose:
// - HERO: Brand identity, the face of the business, WHO they are
// - SERVICE: The work itself, craftsmanship, process, WHAT they do
// - TESTIMONIAL: Customer success, social proof, relatable results
// - PROMO: Offer-ready, urgency, seasonal, call-to-action focused

export function generateImagePrompt(
  industry: IndustryProfile,
  businessName: string,
  platform: 'facebook' | 'instagram' | 'youtube' | 'tiktok' | 'google',
  promptType: 'hero' | 'service' | 'testimonial' | 'promo'
): string {
  const industryStyle = industry.visualStyle
  const platformPsych = PLATFORM_PSYCHOLOGY[platform]
  const platformVisual = platformPsych.visualStyle
  const specs = PLATFORM_SPECS[platform]
  const primaryFormat = specs.imageFormats[0]
  const platformStrategy = industry.platformStrategy[platform === 'google' ? 'facebook' : platform]

  // ===========================================
  // IMAGE TYPE DEFINITIONS - What each type IS
  // ===========================================
  const imageTypePurpose = {
    hero: {
      purpose: 'BRAND IDENTITY - The face of the business',
      focus: 'WHO they are, not what they do',
      feeling: 'Trust, competence, "I want to work with these people"',
      useCase: 'Profile pictures, headers, about us pages, brand awareness ads',
    },
    service: {
      purpose: 'CRAFTSMANSHIP SHOWCASE - The work itself',
      focus: 'WHAT they do and HOW WELL they do it',
      feeling: 'Expertise, quality, attention to detail, "They know their craft"',
      useCase: 'Service pages, portfolio, consideration-stage ads, proof of quality',
    },
    testimonial: {
      purpose: 'SOCIAL PROOF - Customer success stories',
      focus: 'The CUSTOMER and their satisfaction',
      feeling: 'Relatability, trust, "That could be me"',
      useCase: 'Reviews section, trust-building ads, retargeting campaigns',
    },
    promo: {
      purpose: 'PROMOTIONAL - Drive immediate action',
      focus: 'URGENCY and OFFER with clear CTA space',
      feeling: 'Excitement, limited time, "I need to act now"',
      useCase: 'Sales, discounts, seasonal offers, conversion campaigns',
    },
  }

  const typePurpose = imageTypePurpose[promptType]

  // ===========================================
  // PLATFORM + TYPE SPECIFIC SUBJECTS
  // ===========================================

  // Helper to get age-appropriate subjects based on platform
  const getAgeRange = () => {
    switch (platform) {
      case 'facebook': return { worker: '40-55', customer: '45-65' }
      case 'instagram': return { worker: '28-40', customer: '25-38' }
      case 'tiktok': return { worker: '22-32', customer: '20-30' }
      case 'youtube': return { worker: '35-50', customer: '30-50' }
      case 'google': return { worker: '35-50', customer: '35-55' }
    }
  }
  const ages = getAgeRange()

  let subject = ''
  let composition = ''
  let mood = ''
  let mustInclude = ''
  let criticalNote = ''

  // ===========================================
  // HERO - Brand Identity Images
  // ===========================================
  if (promptType === 'hero') {
    switch (platform) {
      case 'facebook':
        subject = `Confident ${industry.name.toLowerCase()} business owner or lead technician, age ${ages.worker}, standing proudly in clean uniform or professional attire. Warm genuine smile, direct eye contact with camera. Behind them: organized workspace or branded vehicle (blurred). This person IS the brand - trustworthy, experienced, the neighbor you'd recommend.`
        composition = 'Subject centered or rule-of-thirds, upper body portrait style, clean background that suggests professionalism'
        mood = 'Trustworthy, established, competent, approachable - like meeting a recommended professional'
        mustInclude = 'Clean professional appearance, genuine confident expression, subtle business context in background'
        criticalNote = 'This is a PORTRAIT of the business owner/team lead - NOT a photo of work being done. The person IS the brand.'
        break
      case 'instagram':
        subject = `Stylish ${industry.name.toLowerCase()} professional, age ${ages.worker}, in an aspirational setting. Modern aesthetic, fashionable work attire that looks both professional and Instagram-worthy. Confident pose, lifestyle photography feel. The setting feels elevated - like this person runs a premium, modern business.`
        composition = 'Editorial/lifestyle portrait style, beautiful lighting, aspirational setting, magazine-cover energy'
        mood = 'Aspirational, modern, elevated, "I want my service provider to look this good"'
        mustInclude = 'Stylish appearance, beautiful composition, lifestyle feeling, premium brand energy'
        criticalNote = 'Think influencer meets professional. This should make people WANT to follow and hire this business.'
        break
      case 'tiktok':
        subject = `Real ${industry.name.toLowerCase()} worker, age ${ages.worker}, in a candid authentic moment - maybe mid-laugh, or looking at camera like they are about to tell you something. Phone-camera selfie style. Real person, not a model. Slightly imperfect but genuine and likeable.`
        composition = 'Selfie-style or candid shot, slightly off-center, natural phone lighting, raw authentic feel'
        mood = 'Authentic, relatable, "this person is real and I trust them", NOT polished or corporate'
        mustInclude = 'Genuine expression, real person energy, casual but competent appearance'
        criticalNote = 'MUST look like a real person took this with their phone. If it looks professionally shot, it will fail on TikTok.'
        break
      case 'youtube':
        subject = `Expert ${industry.name.toLowerCase()} professional, age ${ages.worker}, in a well-lit setting ready to share knowledge. Approachable expert vibe - like someone about to teach you something valuable. Good lighting, professional but not corporate.`
        composition = 'YouTube thumbnail style - clear subject, good contrast, room for text overlay on side'
        mood = 'Expert but approachable, trustworthy educator, "I can learn from this person"'
        mustInclude = 'Professional appearance, good lighting, approachable expression, expert positioning'
        criticalNote = 'This should look like a professional YouTube creator who happens to be an expert in ${industry.name.toLowerCase()}.'
        break
      case 'google':
        subject = `Professional ${industry.name.toLowerCase()} business representative, age ${ages.worker}, clean professional headshot or upper body shot. Trustworthy, competent appearance. Clean solid background or professional setting. The face of a business you would trust.`
        composition = 'Clean professional portrait, high contrast, solid or minimal background, corporate but not cold'
        mood = 'Trustworthy, professional, competent, established business'
        mustInclude = 'Professional appearance, clean background, confidence-inspiring expression'
        criticalNote = 'High-intent searchers are comparing options. This needs to look like the professional choice.'
        break
    }
  }

  // ===========================================
  // SERVICE - Craftsmanship/Process Images
  // ===========================================
  if (promptType === 'service') {
    const craftSubject = industryStyle.subjects[0]

    switch (platform) {
      case 'facebook':
        subject = `Detailed shot of ${industry.name.toLowerCase()} work in progress: skilled hands performing the craft, quality materials visible, professional tools being used correctly. Alternatively: dramatic before/after split showing transformation. The CRAFTSMANSHIP is the star - showing WHY this business is worth hiring.`
        composition = 'Close-up on the work itself, or split-screen before/after, details visible'
        mood = 'Quality craftsmanship, attention to detail, pride in work, "these people know what they are doing"'
        mustInclude = 'Visible quality, professional tools/materials, craftsmanship details, proof of skill'
        criticalNote = 'This is about the WORK, not the person. Show the craft, the quality, the transformation.'
        break
      case 'instagram':
        subject = `Stunning ${industry.name.toLowerCase()} transformation or beautiful finished result. Aesthetic photography of ${craftSubject}. The kind of before/after or result shot that makes people save and share. Magazine-quality detail shots showing the beauty of quality work.`
        composition = 'Aesthetic composition, beautiful lighting on the work, satisfying before/after or detail shot'
        mood = 'Satisfying, beautiful, shareable, "save this for inspiration"'
        mustInclude = 'Beautiful result, aesthetic composition, transformation or detail that wows'
        criticalNote = 'This needs to be visually stunning enough that people screenshot and share it.'
        break
      case 'tiktok':
        subject = `Oddly satisfying ${industry.name.toLowerCase()} moment: could be cleaning reveal, perfect technique, satisfying transformation, or ASMR-worthy work moment. The kind of clip that makes people watch on loop. Raw, unpolished capture of ${craftSubject} that is visually addictive.`
        composition = 'Frame from a video, action shot, satisfying moment captured, raw phone-camera feel'
        mood = 'Oddly satisfying, addictive, "I watched this 5 times", shareable'
        mustInclude = 'Satisfying visual moment, transformation or process that hooks viewers'
        criticalNote = 'Think: what moment from the work would go viral on r/oddlysatisfying? Capture THAT moment.'
        break
      case 'youtube':
        subject = `Educational demonstration of ${industry.name.toLowerCase()} technique: clear setup showing the process, good angles for learning, visible steps. Like a frame from a tutorial video showing HOW the work is done properly.`
        composition = 'Clear demonstration setup, tutorial-ready framing, visible process steps'
        mood = 'Educational, clear, "I can learn from this", expert technique on display'
        mustInclude = 'Clear process visibility, professional technique, educational value'
        criticalNote = 'This should make someone think "I want to watch a video about how they do this".'
        break
      case 'google':
        subject = `Crystal clear ${industry.name.toLowerCase()} service photo: professional quality shot of ${craftSubject}, no distractions, clean demonstration of what the service delivers. Immediately communicates what the business does and that they do it well.`
        composition = 'Clean, clear, professional service representation, no visual clutter'
        mood = 'Professional, clear, trustworthy, "this is exactly what I need"'
        mustInclude = 'Clear service representation, professional quality, immediate understanding'
        criticalNote = 'High-intent searchers need to instantly understand what service they will get.'
        break
    }
  }

  // ===========================================
  // TESTIMONIAL - Customer Success Images
  // ===========================================
  if (promptType === 'testimonial') {
    switch (platform) {
      case 'facebook':
        subject = `Genuinely happy customer, age ${ages.customer}, in their home/space after receiving ${industry.name.toLowerCase()} service. Real person (not a model), authentic grateful smile, natural home environment. Standing near the completed work if relevant. The look of someone who would genuinely recommend this business to their neighbors.`
        composition = 'Customer is the focus, natural home/business setting, completed work visible if relevant'
        mood = 'Genuine satisfaction, relief, gratitude, "I made the right choice"'
        mustInclude = 'Real-looking person, authentic happy expression, relatable setting, believable scenario'
        criticalNote = 'Must look like a REAL customer, not a stock photo model. Authenticity is everything.'
        break
      case 'instagram':
        subject = `Stylish satisfied customer, age ${ages.customer}, in a beautiful setting with visible ${industry.name.toLowerCase()} results. Lifestyle photography feel - the customer looks good, the result looks good, everything is aesthetic. Could be posing near the finished work or in a lifestyle moment.`
        composition = 'Lifestyle photography, beautiful setting, customer looks aspirational but relatable'
        mood = 'Aspirational satisfaction, lifestyle upgrade, "hiring them improved my life/space"'
        mustInclude = 'Attractive but relatable customer, beautiful result visible, lifestyle-elevated feeling'
        criticalNote = 'The customer should look like someone the Instagram audience wants to BE.'
        break
      case 'tiktok':
        subject = `Real person, age ${ages.customer}, genuine reaction to ${industry.name.toLowerCase()} results - could be surprise, delight, showing off to camera. Selfie or friend-filming style, authentic unfiltered reaction, the kind of moment someone would actually post on TikTok.`
        composition = 'Selfie style or candid reaction, phone-camera quality, authentic moment'
        mood = 'Genuine reaction, authentic delight, "OMG you have to see this", shareable moment'
        mustInclude = 'Real reaction, authentic person, unpolished genuine moment'
        criticalNote = 'Should look like a real TikTok someone posted showing off their results. NOT produced.'
        break
      case 'youtube':
        subject = `Trustworthy customer, age ${ages.customer}, interview-style setting, sharing their experience. Well-lit, good audio implied, like a testimonial video thumbnail. Genuine expression, believable person sharing real feedback.`
        composition = 'Interview thumbnail style, clear face, good lighting, trust-building setup'
        mood = 'Trustworthy testimonial, genuine feedback, "this person is being honest"'
        mustInclude = 'Interview setup feel, trustworthy appearance, genuine expression'
        criticalNote = 'Should look like a thumbnail for a testimonial video worth watching.'
        break
      case 'google':
        subject = `Professional-looking satisfied customer, age ${ages.customer}, clean portrait style, confident and happy expression. Represents the ideal customer who chose this business and is satisfied. Trust-building appearance.`
        composition = 'Clean customer portrait, professional background, confident satisfied expression'
        mood = 'Satisfied customer, confident choice, "I chose wisely"'
        mustInclude = 'Professional appearance, satisfied expression, trustworthy customer image'
        criticalNote = 'Should reinforce that professionals/smart people choose this business.'
        break
    }
  }

  // ===========================================
  // PROMO - Promotional/Offer Images
  // ===========================================
  if (promptType === 'promo') {
    switch (platform) {
      case 'facebook':
        subject = `Eye-catching ${industry.name.toLowerCase()} promotional scene with LARGE CLEAR SPACE for text overlay (at least 40% of image). Seasonal or urgent feeling - could show busy service scene, limited availability implied, or premium service moment. Background action with clear text space.`
        composition = 'LEFT or RIGHT 40% of image is clean/simple for text overlay, action on opposite side'
        mood = 'Urgency, value, limited time, "dont miss this opportunity"'
        mustInclude = 'CLEAR TEXT SPACE (critical), promotional energy, urgency or value implied'
        criticalNote = 'The #1 requirement is CLEAR SPACE FOR PROMOTIONAL TEXT. Without this, the image is useless for promos.'
        break
      case 'instagram':
        subject = `Visually striking ${industry.name.toLowerCase()} scene designed for promotional overlay. Bold, attention-grabbing visual with clean space for offer text. Could be dramatic result, premium service moment, or aesthetic scene with clear text area.`
        composition = 'Strong visual impact with 35-40% clean space for text, Instagram-optimized layout'
        mood = 'Excitement, premium offer, exclusive deal, "this is special"'
        mustInclude = 'CLEAN TEXT SPACE, visually striking imagery, promotional energy'
        criticalNote = 'Must stop the scroll AND have space for offer text. Both are required.'
        break
      case 'tiktok':
        subject = `Thumbnail-ready ${industry.name.toLowerCase()} scene for promotional content - could be before a reveal, exciting moment, or attention-grabbing scene. Raw, authentic feel but composed to work as video thumbnail with text overlay space.`
        composition = 'Video thumbnail style, clear top or bottom for text, attention-grabbing subject'
        mood = 'Curiosity, "you need to see this deal", authentic promotional energy'
        mustInclude = 'Thumbnail-ready composition, text overlay space, attention-grabbing subject'
        criticalNote = 'Should work as a video thumbnail that makes people want to tap. Space for "SALE" or offer text.'
        break
      case 'youtube':
        subject = `High-contrast ${industry.name.toLowerCase()} thumbnail for promotional video - bold, clear, with obvious space for offer text. Could show excited reaction, amazing deal visual, or dramatic before/after with promo energy.`
        composition = 'YouTube thumbnail optimized - high contrast, bold subject, clear text overlay area'
        mood = 'Click-worthy, value-packed, "I need to watch this deal video"'
        mustInclude = 'High contrast, bold composition, CLEAR TEXT SPACE, click-worthy energy'
        criticalNote = 'Must work as a YouTube thumbnail that screams "DEAL" or "OFFER" at a glance.'
        break
      case 'google':
        subject = `Clean, professional ${industry.name.toLowerCase()} promotional image with high-contrast design. Clear visual with prominent space for CTA button and offer text. Conversion-optimized composition - immediately communicates value.`
        composition = 'Conversion-optimized layout, clear CTA space, high contrast, clean design'
        mood = 'Professional value, clear offer, "click here for this deal"'
        mustInclude = 'High contrast, CTA button space, clean professional design, clear text area'
        criticalNote = 'Designed for conversion. Must have clear space for CTA button and offer text.'
        break
    }
  }

  // ===========================================
  // BUILD THE COMPLETE PROMPT
  // ===========================================
  const avoidList = [...industryStyle.avoid, platformVisual.avoid].join(', ')

  return `CREATE A ${promptType.toUpperCase()} IMAGE FOR ${platform.toUpperCase()}

====================================
IMAGE TYPE: ${promptType.toUpperCase()}
====================================
Purpose: ${typePurpose.purpose}
Focus: ${typePurpose.focus}
Desired feeling: ${typePurpose.feeling}
Use case: ${typePurpose.useCase}

====================================
PLATFORM: ${platform.toUpperCase()}
====================================
Audience: ${platformPsych.audienceAge} - ${platformPsych.audienceDescription}
They expect: ${platformPsych.contentExpectation}
Platform aesthetic: ${platformVisual.aesthetic}
Platform mood: ${platformVisual.mood}
Lighting style: ${platformVisual.lighting}

====================================
BUSINESS CONTEXT
====================================
Business: "${businessName}"
Industry: ${industry.name}
Industry vibe: ${industryStyle.mood}
Color palette: ${industryStyle.colors}

====================================
SPECIFIC REQUIREMENTS
====================================
SUBJECT: ${subject}

COMPOSITION: ${composition}

MOOD TO CONVEY: ${mood}

MUST INCLUDE: ${mustInclude}

CRITICAL NOTE: ${criticalNote}

====================================
TECHNICAL SPECIFICATIONS
====================================
Aspect ratio: ${primaryFormat.ratio} (${primaryFormat.width}x${primaryFormat.height}px)
Quality: Ultra high quality, sharp focus, professional grade
Style: ${platform === 'tiktok' ? 'Raw, authentic, phone-camera feel - NOT polished' : 'High quality but authentic feeling - NOT generic stock photo'}

====================================
ABSOLUTELY AVOID
====================================
${avoidList}, generic stock photo feel, overly posed, artificial looking, cheesy, low quality, blurry, any text or watermarks in the image, anything that looks fake or staged${platform === 'tiktok' ? ', anything that looks professionally produced or like an ad' : ''}`
}

// Video script generator
export function generateVideoScript(
  industry: IndustryProfile,
  businessName: string,
  services: string[],
  city: string,
  platform: 'facebook' | 'instagram' | 'youtube' | 'tiktok',
  duration: '15s' | '30s' | '60s'
): { hook: string; scenes: string[]; cta: string; voiceover: string } {
  const strategy = industry.platformStrategy[platform]
  const hooks = industry.copyFrameworks.hooks
  const ctas = industry.copyFrameworks.ctas

  const seed = businessName.length
  const hook = hooks[seed % hooks.length]
  const cta = ctas[(seed + 1) % ctas.length]

  let scenes: string[] = []
  let voiceover = ''

  if (duration === '15s') {
    scenes = [
      `0-3s: Hook - ${hook} (text overlay, trending sound)`,
      `3-10s: Quick cuts showing ${industry.visualStyle.subjects.slice(0, 2).join(' and ')}`,
      `10-15s: Logo + CTA: "${cta}" with contact info`,
    ]
    voiceover = `${hook} ${businessName} in ${city}. ${cta}!`
  } else if (duration === '30s') {
    scenes = [
      `0-5s: Hook - ${hook} (attention-grabbing visual)`,
      `5-15s: Problem/solution - Show the pain point, then ${businessName} solving it`,
      `15-25s: Social proof - Quick testimonial or results montage`,
      `25-30s: Strong CTA: "${cta}" - Logo, phone, website`,
    ]
    voiceover = `${hook} At ${businessName}, we specialize in ${services[0]?.toLowerCase() || 'quality service'}. Serving ${city} with ${industry.visualStyle.mood.toLowerCase()} results. ${cta}!`
  } else {
    scenes = [
      `0-5s: Hook - ${hook}`,
      `5-20s: Story/Problem - Relatable scenario your audience faces`,
      `20-35s: Solution - How ${businessName} solves it, show process`,
      `35-50s: Proof - Customer testimonial, before/after, or results`,
      `50-60s: CTA + Trust - "${cta}", show credentials, contact info`,
    ]
    voiceover = `${hook} When you need ${services[0]?.toLowerCase() || 'expert help'} in ${city}, ${businessName} delivers. With our focus on ${industry.visualStyle.mood.toLowerCase()} service, you get ${services.slice(0, 2).join(' and ').toLowerCase()}. Don't settle for less. ${cta}!`
  }

  return { hook, scenes, cta, voiceover }
}
