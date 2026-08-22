import { useEffect, useMemo, useState, type FormEvent } from 'react'
import emailjs from '@emailjs/browser'
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

type EventLeadValues = {
  name: string
  email: string
  phone: string
  eventType: string
  location: string
  date: string
  budget: string
  notes: string
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

const eventsInstagramUrl = 'https://www.instagram.com/artevia.events/?utm_source=ig_web_button_share_sheet'
const eventsPortfolioDriveUrl = 'https://drive.google.com/drive/folders/1nrNYvYizAyYiZVVXt8wvabsE5rvN582E?usp=sharing'
const eventTypeOptions = ['Wedding Event', 'Personal Event', 'Corporate Event', 'Commercial Shoot', 'Others']

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
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [fallbackMailtoUrl, setFallbackMailtoUrl] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fieldShellClasses =
    'w-full rounded-xl border border-white/12 bg-white/[0.08] px-4 text-base text-foreground/90 placeholder:text-foreground/55 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition-all focus-visible:border-accent focus-visible:ring-accent/25 focus-visible:ring-[3px] focus-visible:ring-offset-0 focus-visible:outline-none backdrop-blur-md'
  const inputClasses = `${fieldShellClasses} h-12`
  const selectClasses = `${fieldShellClasses} h-12 appearance-none`
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

  const buildFallbackMailto = (values: EventLeadValues) => {
    const subject = encodeURIComponent(`New Event Lead - ${values.eventType}`)
    const body = encodeURIComponent(
      [
        `Name: ${values.name}`,
        `Email: ${values.email}`,
        `Phone: ${values.phone}`,
        `Event Type: ${values.eventType}`,
        `Location: ${values.location}`,
        `Date: ${values.date}`,
        `Budget: ${values.budget}`,
        '',
        'Additional Notes:',
        values.notes || 'N/A'
      ].join('\n')
    )

    return `mailto:artevia.india@gmail.com?subject=${subject}&body=${body}`
  }

  const handleEventLeadSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)
    const value = (key: string) => String(formData.get(key) || '').trim()

    const leadValues: EventLeadValues = {
      name: value('name'),
      email: value('email'),
      phone: value('phone'),
      eventType: value('eventType'),
      location: value('location'),
      date: value('date'),
      budget: value('budget'),
      notes: value('notes')
    }

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    const hasPlaceholderConfig = [serviceId, templateId, publicKey].some(config => !config || String(config).startsWith('your_'))

    setFallbackMailtoUrl(buildFallbackMailto(leadValues))

    if (hasPlaceholderConfig) {
      setSubmitStatus('error')
      setSubmitError('Email service is not configured. Add real EmailJS keys in `.env` (not placeholder values).')
      return
    }

    setIsSubmitting(true)
    setSubmitStatus('idle')
    setSubmitError(null)

    try {
      let lastError: unknown

      for (let attempt = 1; attempt <= 2; attempt += 1) {
        try {
          await emailjs.send(
            serviceId,
            templateId,
            {
              full_name: leadValues.name,
              company_name: 'N/A',
              email: leadValues.email,
              phone: leadValues.phone,
              service_type: leadValues.eventType,
              requirement: [
                `Location: ${leadValues.location}`,
                `Date: ${leadValues.date}`,
                `Additional Notes: ${leadValues.notes || 'N/A'}`
              ].join('\n'),
              budget: leadValues.budget,
              timeline: leadValues.date,
              delivery_mode: leadValues.location,
              discovery_channel: 'Events Page',
              event_type: leadValues.eventType,
              event_location: leadValues.location,
              event_date: leadValues.date,
              notes: leadValues.notes || 'N/A'
            },
            {
              publicKey
            }
          )

          lastError = null
          break
        } catch (error) {
          lastError = error
          if (attempt < 2) {
            await new Promise(resolve => window.setTimeout(resolve, 700))
          }
        }
      }

      if (lastError) {
        throw lastError
      }

      setSubmitStatus('success')
      setFallbackMailtoUrl(null)
      form.reset()
    } catch (error) {
      console.error('Event lead EmailJS error:', error)
      const emailError = error as { status?: number; text?: string; message?: string }
      const issueText = `${emailError?.text || ''} ${emailError?.message || ''}`.toLowerCase()

      setSubmitStatus('error')

      if (issueText.includes('service') || emailError?.status === 503) {
        setSubmitError('Email service is temporarily unstable. Please use the fallback email button below while we restore delivery.')
      } else {
        setSubmitError('We could not send your event request right now. Please try again or use the fallback email option below.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <nav className="fixed top-0 left-0 right-0 z-50 glass-nav">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <button type="button" onClick={onNavigateHome} className="flex items-center gap-3 min-w-0 self-start">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-secondary via-accent to-primary flex items-center justify-center">
              <img src={arteviaLogo} alt="ARTEVIA" className="h-8 w-8 sm:h-9 sm:w-9 rounded-full object-contain" />
            </div>
            <span className="text-base sm:text-lg font-bold leading-tight tracking-wide">
              ARTEVIA <span className="block sm:inline">EVENTS</span>
            </span>
          </button>
          <div className="grid grid-cols-2 gap-2 w-full sm:w-auto sm:flex sm:items-center sm:gap-3">
            <Button variant="outline" onClick={onNavigateHome} className="w-full sm:w-auto">Home</Button>
            <Button asChild className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
              <a href="#lead-form">Book Now</a>
            </Button>
          </div>
        </div>
      </nav>

      <main className="pt-32 sm:pt-24">
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
                Professional Event <span className="text-gradient">Photography & Videography</span> Services Across India
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

            <div className="mb-8">
              <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold shadow-lg shadow-accent/30">
                <a
                  href={eventsPortfolioDriveUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Open ARTEVIA Events portfolio on Google Drive"
                >
                  Open Full Portfolio on Drive
                </a>
              </Button>
            </div>

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

            {filteredItems.length > 0 && (
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
                          src={item.type === 'image' ? item.src : item.poster || '/static/img/artevia-logo.webp'}
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
              <form className="relative grid gap-4" onSubmit={handleEventLeadSubmit}>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2"><Label htmlFor="name">Name</Label><Input id="name" name="name" className={inputClasses} required /></div>
                  <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" className={inputClasses} required /></div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2"><Label htmlFor="phone">Phone</Label><Input id="phone" name="phone" className={inputClasses} required /></div>
                  <div className="space-y-2">
                    <Label htmlFor="eventType">Event Type</Label>
                    <select id="eventType" name="eventType" className={selectClasses} defaultValue="" required>
                      <option value="" disabled>
                        Select event type
                      </option>
                      {eventTypeOptions.map((eventType) => (
                        <option key={eventType} value={eventType}>
                          {eventType}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2"><Label htmlFor="location">Location</Label><Input id="location" name="location" className={inputClasses} required /></div>
                  <div className="space-y-2"><Label htmlFor="date">Date</Label><Input id="date" name="date" className={inputClasses} type="date" required /></div>
                </div>
                <div className="space-y-2"><Label htmlFor="budget">Budget</Label><Input id="budget" name="budget" className={inputClasses} required /></div>
                <div className="space-y-2"><Label htmlFor="notes">Additional Notes</Label><Textarea id="notes" name="notes" className={textareaClasses} rows={4} /></div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold shadow-lg shadow-accent/30"
                >
                  {isSubmitting ? 'Submitting…' : 'Submit Lead'}
                </Button>
                {submitStatus === 'success' && (
                  <p className="text-emerald-400 text-sm">Thanks! We received your request and will contact you soon.</p>
                )}
                {submitStatus === 'error' && (
                  <div className="space-y-3">
                    <p className="text-sm text-destructive">
                      {submitError || 'Something went wrong. Please try again later or contact us directly.'}
                    </p>
                    {fallbackMailtoUrl && (
                      <Button asChild variant="outline" className="w-full">
                        <a href={fallbackMailtoUrl}>Send via Email App (Fallback)</a>
                      </Button>
                    )}
                  </div>
                )}
              </form>
            </Card>
          </div>
        </section>
      </main>

      <footer className="px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <Card className="glass-card p-6 md:p-8">
            <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-secondary via-accent to-primary flex items-center justify-center">
                    <img src={arteviaLogo} alt="ARTEVIA EVENTS" className="h-9 w-9 rounded-full object-contain" />
                  </div>
                  <div>
                    <p className="text-base font-semibold text-foreground">ARTEVIA EVENTS</p>
                    <p className="text-xs uppercase tracking-[0.2em] text-foreground/55">CAPTURING EVERY MOMENT</p>
                  </div>
                </div>
                <p className="text-sm text-foreground/70">
                  Event photography, videography, and post-production services across India.
                </p>
                <p className="text-sm text-foreground/70">Phone: {contactNumber}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
                  <a href={eventsInstagramUrl} target="_blank" rel="noreferrer">
                    Follow us on Instagram
                  </a>
                </Button>
                <Button asChild variant="outline" className="w-full sm:w-auto">
                  <a href={eventsPortfolioDriveUrl} target="_blank" rel="noreferrer">
                    Portfolio
                  </a>
                </Button>
              </div>
            </div>

            <div className="mt-6 border-t border-border/70 pt-4 text-center text-sm text-foreground/60">
              © {new Date().getFullYear()} ARTEVIA EVENTS
            </div>
          </Card>
        </div>
      </footer>

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
