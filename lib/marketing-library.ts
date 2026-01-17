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

// DALL-E prompt generator
export function generateImagePrompt(
  industry: IndustryProfile,
  businessName: string,
  platform: 'facebook' | 'instagram' | 'youtube' | 'tiktok' | 'google',
  promptType: 'hero' | 'service' | 'testimonial' | 'promo'
): string {
  const style = industry.visualStyle
  const specs = PLATFORM_SPECS[platform]
  const primaryFormat = specs.imageFormats[0]

  let subject = ''
  switch (promptType) {
    case 'hero':
      subject = style.subjects[0]
      break
    case 'service':
      subject = style.subjects[Math.floor(Math.random() * style.subjects.length)]
      break
    case 'testimonial':
      subject = 'Happy satisfied customer giving genuine smile, authentic moment'
      break
    case 'promo':
      subject = `${style.subjects[0]}, promotional feel with space for text overlay`
      break
  }

  const avoid = style.avoid.join(', ')

  return `Professional ${platform} ad photo for ${industry.name}:

SUBJECT: ${subject}

STYLE: ${style.mood}
COLORS: ${style.colors}
LIGHTING: ${style.lighting}

COMPOSITION: ${primaryFormat.ratio} aspect ratio, ${primaryFormat.width}x${primaryFormat.height}px, clean composition with rule of thirds, space for text overlay on one side

QUALITY: Ultra high quality, professional photography, sharp focus, natural look, NOT stock photo style, authentic and genuine feeling

AVOID: ${avoid}, generic stock photo feel, overly posed, artificial lighting, low quality, blurry, text or watermarks in image`
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
