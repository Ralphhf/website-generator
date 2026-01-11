# AI Website Generator

An AI-powered website generator that creates Awwwards-level, SEO-optimized websites for local businesses that have Google Business Profiles but no website.

## Features

- **Google Business Profile Search**: Find businesses without websites by location, radius, and business type
- **Smart Form Wizard**: Guided forms for collecting business information, testimonials, and portfolio images
- **AI Website Generation**: Creates professional Next.js websites with:
  - Responsive, mobile-first design
  - Framer Motion animations
  - Tailwind CSS styling
  - SEO optimization (meta tags, JSON-LD schema, semantic HTML)
  - Local business schema markup
- **One-Click Deployment**: Push to GitHub and deploy to Netlify automatically

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **UI Components**: Custom Aceternity-inspired components

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- API Keys (see below)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/website-generator.git
cd website-generator

# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local
```

### Environment Variables

Edit `.env.local` and add your API keys:

```env
# Google Maps API Key (required for business search)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here

# GitHub Personal Access Token (required for deployment)
GITHUB_API_KEY=your_token_here
GITHUB_USERNAME=your_username

# Netlify Personal Access Token (required for deployment)
NETLIFY_API_KEY=your_token_here

# Claude API Key (optional, for enhanced content generation)
CLAUDE_API_KEY=your_key_here
```

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Search for Businesses**
   - Enter a location (city, state, or zip code)
   - Select a search radius
   - Choose a business type
   - The system will find businesses without websites

2. **Select a Business**
   - Review the list of businesses found
   - Select one to create a website for

3. **Enter Business Information**
   - Fill in basic business details (name, description, services)
   - Add contact information
   - Add customer testimonials
   - Upload portfolio images organized by category

4. **Preview & Generate**
   - Review all entered information
   - Click "Generate Website" to create the site
   - The system will push to GitHub and deploy to Netlify

5. **Share the Result**
   - Get the live website URL
   - Get the GitHub repository URL
   - Share with the business owner

## Project Structure

```
website-generator/
├── app/
│   ├── api/
│   │   ├── search-businesses/    # Google Places API integration
│   │   └── generate-website/     # Website generation endpoint
│   ├── generator/                # Main generator wizard
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Landing page
├── components/
│   ├── generator/               # Wizard step components
│   └── ui/                      # Reusable UI components
├── lib/
│   ├── types.ts                 # TypeScript types
│   ├── utils.ts                 # Utility functions
│   ├── google-places.ts         # Google Places API helpers
│   ├── seo.ts                   # SEO utilities
│   ├── deployment.ts            # GitHub/Netlify deployment
│   └── website-generator.ts     # Website code generation
└── public/                      # Static assets
```

## Generated Website Features

Each generated website includes:

- **Home Page**: Hero section, services, testimonials, CTA
- **About Page**: Business story and statistics
- **Services Page**: Detailed service listings
- **Contact Page**: Contact form, map, business info
- **SEO**: Meta tags, Open Graph, Twitter Cards, JSON-LD schema
- **Performance**: Optimized images, minimal JS, fast loading
- **Responsive**: Mobile-first design that works on all devices

## API Keys Setup

### Google Maps Platform

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable these APIs:
   - Places API
   - Geocoding API
4. Create credentials (API Key)
5. Restrict the key to your domain

### GitHub

1. Go to [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. Generate a new token with `repo` scope
3. Copy the token to your `.env.local`

### Netlify

1. Go to [Netlify User Settings > Applications](https://app.netlify.com/user/applications)
2. Create a new personal access token
3. Copy the token to your `.env.local`

## Deployment

### Deploy the Generator App

```bash
# Build for production
npm run build

# Push to your GitHub repo
git add .
git commit -m "Deploy website generator"
git push origin main
```

Then connect your GitHub repo to Netlify for automatic deployments.

## License

MIT License - feel free to use this for your business!

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.
