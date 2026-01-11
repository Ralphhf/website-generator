import { BusinessInfo, Testimonial, PortfolioSection } from './types'
import { slugify, formatPhoneNumber } from './utils'

// Generate a complete static HTML website for a business
export function generateStaticWebsite(businessInfo: BusinessInfo): Record<string, string> {
  const files: Record<string, string> = {}

  // Main HTML pages
  files['index.html'] = generateIndexPage(businessInfo)
  files['about.html'] = generateAboutPage(businessInfo)
  files['services.html'] = generateServicesPage(businessInfo)
  files['contact.html'] = generateContactPage(businessInfo)

  // CSS
  files['css/styles.css'] = generateStyles(businessInfo)

  // JavaScript
  files['js/main.js'] = generateMainScript()

  // SEO files
  files['robots.txt'] = generateRobotsTxt(businessInfo)
  files['sitemap.xml'] = generateSitemap(businessInfo)

  return files
}

function getBaseStyles(): string {
  return `
    :root {
      --primary: #2563eb;
      --primary-dark: #1d4ed8;
      --secondary: #7c3aed;
      --accent: #06b6d4;
      --text: #1f2937;
      --text-light: #6b7280;
      --bg: #ffffff;
      --bg-alt: #f9fafb;
      --border: #e5e7eb;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    html {
      scroll-behavior: smooth;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      color: var(--text);
      line-height: 1.6;
      background: var(--bg);
    }

    a {
      color: var(--primary);
      text-decoration: none;
      transition: color 0.2s;
    }

    a:hover {
      color: var(--primary-dark);
    }

    img {
      max-width: 100%;
      height: auto;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }

    .section {
      padding: 80px 0;
    }

    .section-title {
      font-size: 2.5rem;
      font-weight: 700;
      text-align: center;
      margin-bottom: 1rem;
    }

    .section-subtitle {
      text-align: center;
      color: var(--text-light);
      max-width: 600px;
      margin: 0 auto 3rem;
    }

    .btn {
      display: inline-block;
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      border: none;
      font-size: 1rem;
    }

    .btn-primary {
      background: var(--primary);
      color: white;
    }

    .btn-primary:hover {
      background: var(--primary-dark);
      color: white;
    }

    .btn-secondary {
      background: white;
      color: var(--primary);
      border: 2px solid var(--primary);
    }

    .btn-secondary:hover {
      background: var(--primary);
      color: white;
    }

    .grid {
      display: grid;
      gap: 2rem;
    }

    .grid-2 { grid-template-columns: repeat(2, 1fr); }
    .grid-3 { grid-template-columns: repeat(3, 1fr); }
    .grid-4 { grid-template-columns: repeat(4, 1fr); }

    @media (max-width: 768px) {
      .grid-2, .grid-3, .grid-4 {
        grid-template-columns: 1fr;
      }
      .section { padding: 60px 0; }
      .section-title { font-size: 2rem; }
    }
  `
}

function generateNavbar(businessInfo: BusinessInfo, currentPage: string = 'home'): string {
  const pages = [
    { name: 'Home', href: 'index.html', key: 'home' },
    { name: 'About', href: 'about.html', key: 'about' },
    { name: 'Services', href: 'services.html', key: 'services' },
    { name: 'Contact', href: 'contact.html', key: 'contact' },
  ]

  return `
    <nav class="navbar">
      <div class="container nav-container">
        <a href="index.html" class="logo">${businessInfo.name}</a>
        <button class="mobile-toggle" aria-label="Toggle menu">
          <span></span><span></span><span></span>
        </button>
        <ul class="nav-links">
          ${pages.map(p => `
            <li><a href="${p.href}" class="${currentPage === p.key ? 'active' : ''}">${p.name}</a></li>
          `).join('')}
        </ul>
        <a href="contact.html" class="btn btn-primary nav-cta">Get a Quote</a>
      </div>
    </nav>
  `
}

function generateFooter(businessInfo: BusinessInfo): string {
  const year = new Date().getFullYear()

  return `
    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <h3>${businessInfo.name}</h3>
            ${businessInfo.tagline ? `<p>${businessInfo.tagline}</p>` : ''}
          </div>
          <div class="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="index.html">Home</a></li>
              <li><a href="about.html">About</a></li>
              <li><a href="services.html">Services</a></li>
              <li><a href="contact.html">Contact</a></li>
            </ul>
          </div>
          <div class="footer-contact">
            <h4>Contact</h4>
            <ul>
              ${businessInfo.phone ? `<li>${formatPhoneNumber(businessInfo.phone)}</li>` : ''}
              ${businessInfo.email ? `<li>${businessInfo.email}</li>` : ''}
              ${businessInfo.address ? `<li>${businessInfo.address}${businessInfo.city ? `, ${businessInfo.city}` : ''}${businessInfo.state ? `, ${businessInfo.state}` : ''} ${businessInfo.zipCode || ''}</li>` : ''}
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; ${year} ${businessInfo.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `
}

function generateHeroSection(businessInfo: BusinessInfo): string {
  return `
    <section class="hero">
      <div class="container hero-content">
        <h1>${businessInfo.name}</h1>
        ${businessInfo.tagline ? `<p class="hero-tagline">${businessInfo.tagline}</p>` : ''}
        <p class="hero-description">${businessInfo.description || `Professional ${businessInfo.businessType?.replace(/_/g, ' ')} services in ${businessInfo.city || 'your area'}.`}</p>
        <div class="hero-buttons">
          <a href="contact.html" class="btn btn-primary">Get Started</a>
          <a href="services.html" class="btn btn-secondary">Our Services</a>
        </div>
      </div>
    </section>
  `
}

function generateServicesSection(businessInfo: BusinessInfo): string {
  if (!businessInfo.services || businessInfo.services.length === 0) {
    return ''
  }

  const serviceIcons: Record<number, string> = {
    0: '🔧',
    1: '⭐',
    2: '🏆',
    3: '💡',
    4: '🛠️',
    5: '✨',
  }

  return `
    <section class="section services-section" id="services">
      <div class="container">
        <h2 class="section-title">Our Services</h2>
        <p class="section-subtitle">We provide top-quality ${businessInfo.businessType?.replace(/_/g, ' ')} services tailored to your needs.</p>
        <div class="grid grid-3 services-grid">
          ${businessInfo.services.map((service, i) => `
            <div class="service-card">
              <div class="service-icon">${serviceIcons[i % 6]}</div>
              <h3>${service}</h3>
              <p>Professional ${service.toLowerCase()} services delivered with excellence and attention to detail.</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `
}

function generateTestimonialsSection(businessInfo: BusinessInfo): string {
  if (!businessInfo.testimonials || businessInfo.testimonials.length === 0) {
    return ''
  }

  return `
    <section class="section testimonials-section">
      <div class="container">
        <h2 class="section-title">What Our Clients Say</h2>
        <p class="section-subtitle">Don't just take our word for it - hear from our satisfied customers.</p>
        <div class="grid grid-3 testimonials-grid">
          ${businessInfo.testimonials.map(t => `
            <div class="testimonial-card">
              <div class="stars">${'★'.repeat(t.rating)}${'☆'.repeat(5 - t.rating)}</div>
              <p class="testimonial-content">"${t.content}"</p>
              <div class="testimonial-author">
                <strong>${t.author}</strong>
                ${t.role ? `<span>${t.role}</span>` : ''}
                ${t.company ? `<span>${t.company}</span>` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `
}

function generatePortfolioSection(businessInfo: BusinessInfo): string {
  if (!businessInfo.portfolioSections || businessInfo.portfolioSections.length === 0) {
    return ''
  }

  const allImages: { url: string; title: string; description?: string }[] = []
  businessInfo.portfolioSections.forEach(section => {
    section.images.forEach(img => {
      allImages.push({
        url: img.url,
        title: section.title,
        description: section.description,
      })
    })
  })

  if (allImages.length === 0) return ''

  return `
    <section class="section portfolio-section">
      <div class="container">
        <h2 class="section-title">Our Work</h2>
        <p class="section-subtitle">Browse through some of our recent projects and see the quality of our work.</p>
        <div class="grid grid-3 portfolio-grid">
          ${allImages.slice(0, 6).map(img => `
            <div class="portfolio-item">
              <img src="${img.url}" alt="${img.title}" loading="lazy">
              <div class="portfolio-overlay">
                <h3>${img.title}</h3>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `
}

function generateCTASection(businessInfo: BusinessInfo): string {
  return `
    <section class="cta-section">
      <div class="container cta-content">
        <h2>Ready to Get Started?</h2>
        <p>Contact us today for a free consultation and quote.</p>
        <div class="cta-buttons">
          <a href="contact.html" class="btn btn-primary">Contact Us</a>
          ${businessInfo.phone ? `<a href="tel:${businessInfo.phone}" class="btn btn-secondary">Call ${formatPhoneNumber(businessInfo.phone)}</a>` : ''}
        </div>
      </div>
    </section>
  `
}

function generateIndexPage(businessInfo: BusinessInfo): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${businessInfo.name} - ${businessInfo.tagline || `Professional ${businessInfo.businessType?.replace(/_/g, ' ')} Services`}</title>
  <meta name="description" content="${businessInfo.description || `${businessInfo.name} provides professional ${businessInfo.businessType?.replace(/_/g, ' ')} services in ${businessInfo.city || 'your area'}.`}">
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>
  ${generateNavbar(businessInfo, 'home')}

  <main>
    ${generateHeroSection(businessInfo)}
    ${generateServicesSection(businessInfo)}
    ${generateTestimonialsSection(businessInfo)}
    ${generatePortfolioSection(businessInfo)}
    ${generateCTASection(businessInfo)}
  </main>

  ${generateFooter(businessInfo)}
  <script src="js/main.js"></script>
</body>
</html>`
}

function generateAboutPage(businessInfo: BusinessInfo): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>About Us - ${businessInfo.name}</title>
  <meta name="description" content="Learn more about ${businessInfo.name} and our commitment to excellence in ${businessInfo.businessType?.replace(/_/g, ' ')} services.">
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>
  ${generateNavbar(businessInfo, 'about')}

  <main>
    <section class="page-hero">
      <div class="container">
        <h1>About ${businessInfo.name}</h1>
        <p>Learn more about our story and commitment to excellence.</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="about-content">
          <h2>Our Story</h2>
          <p>${businessInfo.description || `${businessInfo.name} has been providing exceptional ${businessInfo.businessType?.replace(/_/g, ' ')} services to our community. We take pride in our work and are committed to delivering the highest quality results for every project.`}</p>

          ${businessInfo.yearsInBusiness ? `
          <div class="about-stats">
            <div class="stat">
              <span class="stat-number">${businessInfo.yearsInBusiness}+</span>
              <span class="stat-label">Years of Experience</span>
            </div>
            <div class="stat">
              <span class="stat-number">100%</span>
              <span class="stat-label">Customer Satisfaction</span>
            </div>
          </div>
          ` : ''}

          <h2>Why Choose Us</h2>
          <ul class="about-features">
            <li>✓ Professional and experienced team</li>
            <li>✓ Quality workmanship guaranteed</li>
            <li>✓ Competitive pricing</li>
            <li>✓ Excellent customer service</li>
            <li>✓ Licensed and insured</li>
          </ul>
        </div>
      </div>
    </section>

    ${generateCTASection(businessInfo)}
  </main>

  ${generateFooter(businessInfo)}
  <script src="js/main.js"></script>
</body>
</html>`
}

function generateServicesPage(businessInfo: BusinessInfo): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Our Services - ${businessInfo.name}</title>
  <meta name="description" content="Explore the professional ${businessInfo.businessType?.replace(/_/g, ' ')} services offered by ${businessInfo.name}.">
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>
  ${generateNavbar(businessInfo, 'services')}

  <main>
    <section class="page-hero">
      <div class="container">
        <h1>Our Services</h1>
        <p>Professional solutions tailored to your needs.</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        ${businessInfo.services && businessInfo.services.length > 0 ? `
        <div class="services-detailed">
          ${businessInfo.services.map((service, i) => `
            <div class="service-detail">
              <h2>${service}</h2>
              <p>Our ${service.toLowerCase()} service delivers exceptional results with attention to detail and professional execution. We work closely with you to understand your needs and provide customized solutions.</p>
              <ul>
                <li>Professional assessment and consultation</li>
                <li>Quality materials and workmanship</li>
                <li>Timely completion</li>
                <li>Satisfaction guaranteed</li>
              </ul>
            </div>
          `).join('')}
        </div>
        ` : `
        <p>Contact us to learn more about our comprehensive ${businessInfo.businessType?.replace(/_/g, ' ')} services.</p>
        `}
      </div>
    </section>

    ${generateCTASection(businessInfo)}
  </main>

  ${generateFooter(businessInfo)}
  <script src="js/main.js"></script>
</body>
</html>`
}

function generateContactPage(businessInfo: BusinessInfo): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Contact Us - ${businessInfo.name}</title>
  <meta name="description" content="Get in touch with ${businessInfo.name} for a free quote or consultation.">
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>
  ${generateNavbar(businessInfo, 'contact')}

  <main>
    <section class="page-hero">
      <div class="container">
        <h1>Contact Us</h1>
        <p>We'd love to hear from you. Get in touch today!</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="contact-grid">
          <div class="contact-info">
            <h2>Get In Touch</h2>
            <p>Ready to start your project? Have questions about our services? We're here to help!</p>

            <div class="contact-details">
              ${businessInfo.phone ? `
              <div class="contact-item">
                <strong>Phone</strong>
                <a href="tel:${businessInfo.phone}">${formatPhoneNumber(businessInfo.phone)}</a>
              </div>
              ` : ''}

              ${businessInfo.email ? `
              <div class="contact-item">
                <strong>Email</strong>
                <a href="mailto:${businessInfo.email}">${businessInfo.email}</a>
              </div>
              ` : ''}

              ${businessInfo.address ? `
              <div class="contact-item">
                <strong>Address</strong>
                <p>${businessInfo.address}${businessInfo.city ? `<br>${businessInfo.city}` : ''}${businessInfo.state ? `, ${businessInfo.state}` : ''} ${businessInfo.zipCode || ''}</p>
              </div>
              ` : ''}
            </div>

            ${businessInfo.openingHours && Object.keys(businessInfo.openingHours).length > 0 ? `
            <div class="business-hours">
              <h3>Business Hours</h3>
              <ul>
                ${Object.entries(businessInfo.openingHours).map(([day, hours]) => `
                  <li><strong>${day}:</strong> ${hours}</li>
                `).join('')}
              </ul>
            </div>
            ` : ''}
          </div>

          <div class="contact-form-container">
            <h2>Send Us a Message</h2>
            <form class="contact-form" id="contactForm">
              <div class="form-group">
                <label for="name">Name</label>
                <input type="text" id="name" name="name" required>
              </div>
              <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" name="email" required>
              </div>
              <div class="form-group">
                <label for="phone">Phone</label>
                <input type="tel" id="phone" name="phone">
              </div>
              <div class="form-group">
                <label for="message">Message</label>
                <textarea id="message" name="message" rows="5" required></textarea>
              </div>
              <button type="submit" class="btn btn-primary">Send Message</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  </main>

  ${generateFooter(businessInfo)}
  <script src="js/main.js"></script>
</body>
</html>`
}

function generateStyles(businessInfo: BusinessInfo): string {
  return `${getBaseStyles()}

/* Navbar */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: white;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  z-index: 1000;
  padding: 1rem 0;
}

.nav-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary);
}

.nav-links {
  display: flex;
  list-style: none;
  gap: 2rem;
}

.nav-links a {
  color: var(--text);
  font-weight: 500;
}

.nav-links a.active,
.nav-links a:hover {
  color: var(--primary);
}

.mobile-toggle {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
}

.mobile-toggle span {
  width: 25px;
  height: 3px;
  background: var(--text);
  transition: 0.3s;
}

@media (max-width: 768px) {
  .mobile-toggle {
    display: flex;
  }

  .nav-links {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    flex-direction: column;
    padding: 1rem;
    gap: 1rem;
    display: none;
    box-shadow: 0 5px 10px rgba(0,0,0,0.1);
  }

  .nav-links.active {
    display: flex;
  }

  .nav-cta {
    display: none;
  }
}

/* Hero */
.hero {
  padding: 150px 0 100px;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  text-align: center;
}

.hero h1 {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-tagline {
  font-size: 1.5rem;
  color: var(--text-light);
  margin-bottom: 1rem;
}

.hero-description {
  max-width: 600px;
  margin: 0 auto 2rem;
  font-size: 1.1rem;
  color: var(--text-light);
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .hero h1 { font-size: 2.5rem; }
  .hero-tagline { font-size: 1.2rem; }
}

/* Page Hero */
.page-hero {
  padding: 150px 0 60px;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  text-align: center;
}

.page-hero h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.page-hero p {
  color: var(--text-light);
}

/* Services */
.service-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  text-align: center;
  transition: transform 0.3s, box-shadow 0.3s;
}

.service-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0,0,0,0.12);
}

.service-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.service-card h3 {
  margin-bottom: 0.5rem;
}

.service-card p {
  color: var(--text-light);
  font-size: 0.95rem;
}

/* Testimonials */
.testimonials-section {
  background: var(--bg-alt);
}

.testimonial-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.stars {
  color: #fbbf24;
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.testimonial-content {
  font-style: italic;
  color: var(--text);
  margin-bottom: 1.5rem;
  line-height: 1.7;
}

.testimonial-author strong {
  display: block;
}

.testimonial-author span {
  color: var(--text-light);
  font-size: 0.9rem;
}

/* Portfolio */
.portfolio-item {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  aspect-ratio: 4/3;
}

.portfolio-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.portfolio-item:hover img {
  transform: scale(1.05);
}

.portfolio-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  background: linear-gradient(transparent, rgba(0,0,0,0.8));
  color: white;
}

.portfolio-overlay h3 {
  font-size: 1rem;
}

/* CTA */
.cta-section {
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  padding: 80px 0;
  text-align: center;
  color: white;
}

.cta-section h2 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.cta-section p {
  opacity: 0.9;
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.cta-section .btn-primary {
  background: white;
  color: var(--primary);
}

.cta-section .btn-secondary {
  border-color: white;
  color: white;
}

.cta-section .btn-secondary:hover {
  background: white;
  color: var(--primary);
}

/* Footer */
.footer {
  background: #1f2937;
  color: #d1d5db;
  padding: 60px 0 20px;
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 3rem;
  margin-bottom: 3rem;
}

.footer h3, .footer h4 {
  color: white;
  margin-bottom: 1rem;
}

.footer ul {
  list-style: none;
}

.footer ul li {
  margin-bottom: 0.5rem;
}

.footer a {
  color: #d1d5db;
}

.footer a:hover {
  color: white;
}

.footer-bottom {
  border-top: 1px solid #374151;
  padding-top: 20px;
  text-align: center;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .footer-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}

/* About Page */
.about-content h2 {
  margin: 2rem 0 1rem;
}

.about-content p {
  color: var(--text-light);
  line-height: 1.8;
  margin-bottom: 1rem;
}

.about-stats {
  display: flex;
  gap: 3rem;
  margin: 2rem 0;
}

.stat {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 3rem;
  font-weight: 700;
  color: var(--primary);
}

.stat-label {
  color: var(--text-light);
}

.about-features {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.about-features li {
  padding: 0.5rem 0;
}

@media (max-width: 768px) {
  .about-stats { flex-direction: column; gap: 1.5rem; }
  .about-features { grid-template-columns: 1fr; }
}

/* Services Page */
.services-detailed {
  display: grid;
  gap: 3rem;
}

.service-detail {
  padding: 2rem;
  background: var(--bg-alt);
  border-radius: 12px;
}

.service-detail h2 {
  color: var(--primary);
  margin-bottom: 1rem;
}

.service-detail p {
  color: var(--text-light);
  margin-bottom: 1rem;
}

.service-detail ul {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
}

.service-detail ul li::before {
  content: "✓ ";
  color: var(--primary);
}

/* Contact Page */
.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
}

.contact-info h2 {
  margin-bottom: 1rem;
}

.contact-details {
  margin: 2rem 0;
}

.contact-item {
  margin-bottom: 1.5rem;
}

.contact-item strong {
  display: block;
  margin-bottom: 0.25rem;
}

.business-hours ul {
  list-style: none;
}

.business-hours li {
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--border);
}

.contact-form-container {
  background: var(--bg-alt);
  padding: 2rem;
  border-radius: 12px;
}

.contact-form {
  display: grid;
  gap: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--primary);
}

@media (max-width: 768px) {
  .contact-grid { grid-template-columns: 1fr; }
}
`
}

function generateMainScript(): string {
  return `// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', function() {
      navLinks.classList.toggle('active');
    });
  }

  // Close mobile menu when clicking outside
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.nav-container') && navLinks) {
      navLinks.classList.remove('active');
    }
  });

  // Contact form handling
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      alert('Thank you for your message! We will get back to you soon.');
      contactForm.reset();
    });
  }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
`
}

function generateRobotsTxt(businessInfo: BusinessInfo): string {
  const slug = slugify(businessInfo.name)
  return `User-agent: *
Allow: /

Sitemap: https://${slug}.netlify.app/sitemap.xml
`
}

function generateSitemap(businessInfo: BusinessInfo): string {
  const slug = slugify(businessInfo.name)
  const baseUrl = `https://${slug}.netlify.app`
  const today = new Date().toISOString().split('T')[0]

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${today}</lastmod>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/about.html</loc>
    <lastmod>${today}</lastmod>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/services.html</loc>
    <lastmod>${today}</lastmod>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/contact.html</loc>
    <lastmod>${today}</lastmod>
    <priority>0.8</priority>
  </url>
</urlset>
`
}
