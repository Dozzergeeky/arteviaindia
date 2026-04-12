import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

type EventsPageProps = {
  arteviaLogo: string
  contactNumber: string
  onNavigateHome: () => void
}

type PortfolioFilter = 'all' | 'wedding' | 'corporate' | 'product' | 'personal'
type PortfolioItem = {
  id: number
  title: string
  category: Exclude<PortfolioFilter, 'all'>
  type: 'image' | 'video'
  src: string
  poster?: string
}

const portfolioItems: PortfolioItem[] = []

const faqItems = [
  {
    q: 'Do you provide services outside Kolkata?',
    a: 'Yes, Artevia offers pan-India event coverage.'
  },
  {
    q: 'Do you cover product shoots?',
    a: 'Yes, we specialize in both product photography and product videography.'
  },
  {
    q: 'How early should we book?',
    a: 'We recommend booking at least 6-12 months in advance depending on the event type.'
  }
]

function ensureMeta(name: string, content: string) {
  let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null
  if (!meta) {
    meta = document.createElement('meta')
    meta.name = name
    document.head.appendChild(meta)
  }
  meta.content = content
}

function EventsPage({ arteviaLogo, contactNumber, onNavigateHome }: EventsPageProps) {
  const [activeFilter, setActiveFilter] = useState<PortfolioFilter>('all')
  const [activeItem, setActiveItem] = useState<PortfolioItem | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const fieldShellClasses =
    'w-full rounded-xl border border-white/12 bg-white/[0.08] px-4 text-base text-foreground/90 placeholder:text-foreground/55 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition-all focus-visible:border-accent focus-visible:ring-accent/25 focus-visible:ring-[3px] focus-visible:ring-offset-0 focus-visible:outline-none backdrop-blur-md'
  const inputClasses = `${fieldShellClasses} h-12`
  const textareaClasses = `${fieldShellClasses} min-h-[140px] py-3 resize-y`

  useEffect(() => {
    document.title = 'Artevia Events | Wedding, Corporate & Product Shoot Photography & Videography in India'
    ensureMeta('description', 'Artevia offers professional event photography, videography & editing services across India. Weddings, corporate events, product shoots & more. Capture every moment with Artevia.')
    ensureMeta('keywords', 'event photography India, wedding photography India, corporate event videography, product shoot services India, event videographer India, pre wedding shoot India, birthday photography, engagement shoot, cinematic videography, brand event coverage, product photography services, pan India event coverage')
  }, [])

  const filteredItems = useMemo(() => {
    if (activeFilter === 'all') return portfolioItems
    return portfolioItems.filter(item => item.category === activeFilter)
  }, [activeFilter])

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Artevia Events Photography & Videography Services',
    description:
      'Professional event photography, videography and post-production services across India for weddings, corporate events and product shoots.',
    provider: {
      '@type': 'Organization',
      name: 'ARTEVIA',
      url: 'https://arteviaindia.com/events'
    },
    areaServed: {
      '@type': 'Country',
      name: 'India'
    },
    serviceType: ['Event Photography', 'Event Videography', 'Product Shoot', 'Post Production']
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map(item => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a
      }
    }))
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <nav className="fixed top-0 left-0 right-0 z-50 glass-nav">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-3">
          <button type="button" onClick={onNavigateHome} className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-secondary via-accent to-primary flex items-center justify-center">
              <img src={arteviaLogo} alt="ARTEVIA" className="h-9 w-9 rounded-full object-contain" />
            </div>
            <span className="text-lg font-bold">ARTEVIA Events</span>
          </button>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={onNavigateHome}>Home</Button>
            <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <a href="#lead-form">Book Now</a>
            </Button>
          </div>
        </div>
      </nav>

      <main className="pt-24">
        <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden px-6 py-24">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute top-24 left-10 h-80 w-80 rounded-full bg-primary/30 blur-3xl animate-glow" />
            <div className="absolute right-10 bottom-20 h-96 w-96 rounded-full bg-accent/30 blur-3xl animate-glow" style={{ animationDelay: '2s' }} />
            <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary/20 blur-3xl animate-glow" style={{ animationDelay: '4s' }} />
          </div>

          <div className="relative z-10 max-w-6xl mx-auto text-center space-y-8">
            <p className="text-sm uppercase tracking-[0.18em] text-accent font-semibold">Pan India Event Coverage with Creative Excellence</p>
            <div className="glass-card rounded-[2rem] px-8 py-12 md:px-14 md:py-16">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
                Professional Event Photography & <span className="text-gradient">Videography</span> Services Across India
              </h1>
              <p className="text-xl text-foreground/75 mt-5">From personal celebrations to brand experiences — we capture it all.</p>
              <p className="text-lg text-foreground/70 max-w-4xl mx-auto mt-5 leading-relaxed">
                Artevia delivers premium photography, videography, and editing services for events across India. Whether it’s a wedding, corporate function, or product shoot, we transform every moment into a powerful visual story with creativity, precision, and emotion.
              </p>
              <div className="flex flex-wrap justify-center gap-4 mt-8">
                <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold shadow-lg shadow-accent/30">
                  <a href="#lead-form">Book Your Event</a>
                </Button>
                <Button asChild size="lg" variant="outline" className="font-semibold">
                  <a href="#portfolio">View Portfolio</a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 py-24">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-5">India-Wide Event Coverage with Creative Excellence</h2>
            <p className="text-foreground/75 leading-relaxed text-lg">
              Artevia is a creative-driven agency specializing in event coverage, offering end-to-end photography, videography, and post-production services across India.
            </p>
            <p className="text-foreground/75 leading-relaxed text-lg mt-4">
              We don’t just document events — we craft stories that reflect emotions, energy, and brand identity. With a strong foundation in design, marketing, and content creation, our team ensures that every output is visually engaging, professional, and impactful.
            </p>
          </div>
        </section>

        <section className="px-6 py-24">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-10">Our Event Photography & Videography Services</h2>
            <div className="grid lg:grid-cols-3 gap-6">
              <Card className="glass-card p-6 h-full hover:scale-[1.02] transition-all duration-300 hover:shadow-2xl hover:shadow-accent/10">
                <h3 className="text-2xl font-semibold mb-4 text-gradient">📸 Event Photography Services</h3>
                <ul className="space-y-2 text-foreground/75">
                  <li>Candid Photography</li><li>Traditional Photography</li><li>Portrait & Couple Shoots</li><li>Product Photography (E-commerce & Branding)</li><li>Event Highlight Shots</li>
                </ul>
              </Card>
              <Card className="glass-card p-6 h-full hover:scale-[1.02] transition-all duration-300 hover:shadow-2xl hover:shadow-accent/10">
                <h3 className="text-2xl font-semibold mb-4 text-gradient">🎥 Videography Services</h3>
                <ul className="space-y-2 text-foreground/75">
                  <li>Cinematic Wedding Films</li><li>Corporate Event Coverage</li><li>Product Shoot Videos</li><li>Brand Event Coverage</li><li>Drone Shoots (if applicable)</li>
                </ul>
              </Card>
              <Card className="glass-card p-6 h-full hover:scale-[1.02] transition-all duration-300 hover:shadow-2xl hover:shadow-accent/10">
                <h3 className="text-2xl font-semibold mb-4 text-gradient">🎬 Editing & Post-Production</h3>
                <ul className="space-y-2 text-foreground/75">
                  <li>High-End Photo Editing</li><li>Cinematic Video Editing</li><li>Color Grading</li><li>Teaser & Trailer Creation</li><li>Social Media Reels & Ads</li>
                </ul>
              </Card>
            </div>
          </div>
        </section>

        <section className="px-6 py-24">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">Types of Events We Cover Across India</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: '💍 Wedding & Pre-Wedding Events',
                  items: ['Wedding', 'Pre-Wedding', 'Reception', 'Engagement']
                },
                {
                  title: '🎉 Personal Events',
                  items: ['Birthday Parties', 'Anniversary Celebrations', 'Rice Ceremony', 'Private & One-Day Events']
                },
                {
                  title: '🏢 Corporate & Brand Events',
                  items: ['Corporate Functions', 'Conferences & Seminars', 'Brand Launch Events', 'Office Events']
                },
                {
                  title: '🛍️ Product & Commercial Shoots',
                  items: ['E-commerce Product Photography', 'Product Ad Shoots', 'Brand Campaign Shoots', 'Catalogue & Portfolio Shoots']
                }
              ].map(block => (
                <Card key={block.title} className="glass-card p-6 h-full hover:scale-[1.02] transition-all duration-300 hover:shadow-2xl hover:shadow-accent/10">
                  <h3 className="font-semibold text-lg mb-4">{block.title}</h3>
                  <ul className="space-y-2 text-foreground/75 text-sm">
                    {block.items.map(item => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-24">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">Why Artevia is the Right Choice for Your Event</h2>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {[
                'Pan India Service Availability',
                'Creative Storytelling Approach',
                'High-Quality Cinematic Output',
                'Fast & Professional Delivery',
                'Experienced Team with Marketing Understanding',
                'One-Stop Solution: Shoot + Edit + Content'
              ].map(item => (
                <Card
                  key={item}
                  className="glass-card rounded-[18px] border-white/12 p-0 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-accent/10"
                >
                  <div className="flex min-h-[104px] items-center gap-3 px-5 py-4">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-accent shadow-[0_0_14px_rgba(124,93,250,0.6)]" />
                    <p className="text-[1.15rem] font-semibold leading-snug text-foreground/95">{item}</p>
                  </div>
                </Card>
              ))}
            </div>
            <p className="text-foreground/65 mt-6">“From Weddings to Product Shoots — We Capture Everything”</p>
          </div>
        </section>

        <section className="px-6 py-24">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Event Coverage Process</h2>
            <ol className="grid gap-3 md:grid-cols-2">
              {[
                'Requirement Discussion & Planning',
                'Creative Strategy & Shot Design',
                'On-Ground Professional Execution',
                'Editing & Post-Production',
                'Final Delivery with Premium Output'
              ].map((step, idx) => (
                <li key={step} className="glass-card rounded-xl px-5 py-4 hover:scale-[1.01] transition-all duration-300"><span className="text-accent font-semibold mr-2">{idx + 1}.</span>{step}</li>
              ))}
            </ol>
          </div>
        </section>

        <section id="portfolio" className="px-6 py-24">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Our Event & Product Shoot Portfolio</h2>
            <p className="text-foreground/70 mb-6">Explore our work across weddings, corporate events, and product shoots — crafted with creativity and precision.</p>

            {portfolioItems.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {[
                  { key: 'all', label: 'All' },
                  { key: 'wedding', label: 'Wedding' },
                  { key: 'corporate', label: 'Corporate' },
                  { key: 'product', label: 'Product' },
                  { key: 'personal', label: 'Personal' }
                ].map(filter => (
                  <Button
                    key={filter.key}
                    type="button"
                    variant={activeFilter === filter.key ? 'default' : 'outline'}
                    className={activeFilter === filter.key ? 'bg-accent text-accent-foreground hover:bg-accent/90' : ''}
                    onClick={() => setActiveFilter(filter.key as PortfolioFilter)}
                  >
                    {filter.label}
                  </Button>
                ))}
              </div>
            )}

            {filteredItems.length === 0 ? (
              <Card className="glass-card border-dashed p-10 text-center">
                <p className="text-lg font-semibold">Portfolio coming soon</p>
                <p className="mt-2 text-foreground/70">
                  We are currently curating our latest event and product shoot showcases.
                </p>
              </Card>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredItems.map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveItem(item)}
                    className="group text-left"
                  >
                    <Card className="glass-card overflow-hidden">
                      <div className="h-56 relative overflow-hidden">
                        <img
                          src={item.type === 'image' ? item.src : item.poster || '/static/img/artevia-logo.png'}
                          alt={item.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        {item.type === 'video' && <div className="absolute inset-0 bg-black/30 grid place-items-center text-white text-sm font-medium">Video Preview</div>}
                      </div>
                      <div className="p-4">
                        <p className="text-xs uppercase text-accent mb-1">{item.category}</p>
                        <h3 className="font-semibold">{item.title}</h3>
                      </div>
                    </Card>
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="px-6 py-24">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Let’s Capture Your Next Event</h2>
            <p className="text-foreground/70 mb-6">
              From once-in-a-lifetime celebrations to brand-driven events and product shoots — Artevia ensures every frame tells a story.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold shadow-lg shadow-accent/30"><a href="#lead-form">Book Now</a></Button>
              <Button asChild variant="outline"><a href={`https://wa.me/${contactNumber.replace(/\D/g, '')}`} target="_blank" rel="noreferrer">Contact Us</a></Button>
            </div>
          </div>
        </section>

        <section className="px-6 py-24">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Event Photography Services Available Across India</h2>
            <p className="text-foreground/75 leading-relaxed">
              Artevia provides event photography and videography services across major cities and regions in India. Whether your event is in metro cities or destination locations, our team is equipped to deliver consistent, high-quality results anywhere in the country.
            </p>
            <p className="text-foreground/65 mt-5">“Turning Every Event into a Story Worth Remembering”</p>
          </div>
        </section>

        <section className="px-6 py-24">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Frequently Asked Questions (FAQ)</h2>
            <Card className="glass-card rounded-3xl border border-border/40 px-5 py-2 md:px-6">
              <Accordion type="multiple" className="w-full">
                {faqItems.map((item, index) => (
                  <AccordionItem key={item.q} value={`faq-${index}`} className="px-1 md:px-2">
                    <AccordionTrigger className="text-base md:text-lg font-semibold hover:no-underline py-5">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-foreground/75 text-sm md:text-base leading-relaxed pb-6">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Card>
          </div>
        </section>

        <section id="lead-form" className="px-6 py-24 pb-24">
          <div className="max-w-3xl mx-auto">
            <Card className="glass-card relative overflow-hidden p-8 md:p-10">
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-accent/12 blur-3xl" />
                <div className="absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
              </div>
              <h2 className="text-3xl font-bold mb-6">Book Your Event</h2>
              <form
                className="relative grid gap-4"
                onSubmit={(event) => {
                  event.preventDefault()
                  setSubmitted(true)
                }}
              >
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2"><Label htmlFor="name">Name</Label><Input id="name" className={inputClasses} required /></div>
                  <div className="space-y-2"><Label htmlFor="phone">Phone</Label><Input id="phone" className={inputClasses} required /></div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2"><Label htmlFor="eventType">Event Type</Label><Input id="eventType" className={inputClasses} required /></div>
                  <div className="space-y-2"><Label htmlFor="location">Location</Label><Input id="location" className={inputClasses} required /></div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2"><Label htmlFor="date">Date</Label><Input id="date" className={inputClasses} type="date" required /></div>
                  <div className="space-y-2"><Label htmlFor="budget">Budget</Label><Input id="budget" className={inputClasses} required /></div>
                </div>
                <div className="space-y-2"><Label htmlFor="notes">Additional Notes</Label><Textarea id="notes" className={textareaClasses} rows={4} /></div>
                <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold shadow-lg shadow-accent/30">Submit Lead</Button>
                {submitted && <p className="text-emerald-400 text-sm">Thanks! We received your request and will contact you soon.</p>}
              </form>
            </Card>
          </div>
        </section>
      </main>

      <a
        href={`https://wa.me/${contactNumber.replace(/\D/g, '')}`}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-50 rounded-full bg-[#25D366] text-white px-5 py-3 font-semibold shadow-xl hover:brightness-95"
        aria-label="Chat on WhatsApp"
      >
        WhatsApp
      </a>

      <Dialog open={!!activeItem} onOpenChange={(open) => !open && setActiveItem(null)}>
        <DialogContent className="max-w-4xl p-3 bg-background border-white/10">
          <DialogTitle className="sr-only">Portfolio Preview</DialogTitle>
          {activeItem?.type === 'video' ? (
            <div className="aspect-video">
              <iframe
                src={activeItem.src}
                title={activeItem.title}
                className="w-full h-full rounded-lg"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          ) : (
            <img
              src={activeItem?.src}
              alt={activeItem?.title}
              className="w-full max-h-[80vh] object-contain rounded-lg"
              loading="lazy"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default EventsPage
