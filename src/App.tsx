import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import emailjs from '@emailjs/browser'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { FacebookLogo, InstagramLogo, LinkedinLogo, YoutubeLogo, Sparkle, CaretDown, List, X } from '@phosphor-icons/react'

const contactFormSchema = z.object({
  fullName: z.string().min(2, 'Please enter your full name.'),
  companyName: z.string().optional(),
  email: z.string().email('Enter a valid email address.'),
  phone: z.string().min(7, 'Enter a valid phone number.'),
  serviceType: z.string().min(1, 'Select a service type.'),
  requirement: z.string().min(10, 'Tell us a bit more about your requirement.'),
  budget: z.string().min(1, 'Share an estimated budget.'),
  timeline: z.string().min(1, 'Let us know the delivery timeline.'),
  deliveryMode: z.string().min(1, 'Select a delivery mode.'),
  discoveryChannel: z.string().min(1, 'Let us know how you heard about us.')
})

type ContactFormValues = z.infer<typeof contactFormSchema>

type TeamMember = {
  name: string
  role: string
  description: string
  gradient: string
  image?: string
  imagePosition?: string
}

function App() {
  const [activeSection, setActiveSection] = useState('home')
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { scrollY } = useScroll()
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0])
  const heroScale = useTransform(scrollY, [0, 300], [1, 0.95])

  const arteviaLogo = '/static/img/artevia-logo.png'
  const contactNumbers = ['+91 70030 80422', '+91 94337 11367', '+91 83485 25053']
  const navItems = [
    { id: 'home', label: 'Home Page' },
    { id: 'services', label: 'Our Services' },
    { id: 'work', label: 'Our Work' },
    { id: 'about', label: 'About Us' },
    { id: 'contact', label: 'Inquiry Form' },
    { id: 'faq', label: 'FAQ' }
  ] as const
  const serviceTypes = [
    'Branding & Identity Design',
    'Social Media Design',
    'Printing & Packaging',
    'Event / Campaign Design',
    'Merchandise & Custom Orders',
    'Others (please specify)'
  ]
  const deliveryModes = [
    'Digital Delivery (Design files only)',
    'Printed Materials (PAN India Delivery – MOQ applies)'
  ]
  const discoveryChannels = ['Instagram', 'Referral', 'Google', 'Returning Client', 'Other']
  const coreTeamMembers: TeamMember[] = [
    {
      name: 'Krishu Shah',
      role: 'Founder & Creative Visionary',
      description: "The heart of ARTEVIA's creative direction, bringing imagination to life through design that inspires and connects.",
      gradient: 'from-secondary to-accent',
      image: '/static/img/krishu.JPG'
    },
    {
      name: 'Raghav Jaiswal',
      role: 'Chief Executive Officer (CEO)',
      description: "The strategic mind behind ARTEVIA's growth, blending business insight and marketing leadership to drive brand success.",
      gradient: 'from-accent to-primary',
      image: '/static/img/raghav.jpg',
      imagePosition: 'center 30%'
    },
    {
      name: 'Atanu Pal',
      role: 'Chief Technology Officer (CTO)',
      description: 'The tech innovator ensuring every creative idea is backed by powerful digital execution and modern tools.',
      gradient: 'from-primary to-secondary',
      image: '/static/img/atanu.jpg'
    }
  ]
  const extendedTeamMembers: TeamMember[] = [
    {
      name: 'Debargha Bhattacharjee',
      role: 'Chief Technical Advisor',
      description: 'Merging creativity with technology to keep ARTEVIA ahead of the curve.',
      gradient: 'from-secondary to-primary',
      image: '/static/img/Debargha.png'
    },
    {
      name: 'Arnab Mondal',
      role: 'Sales Intern',
      description: 'A passionate communicator learning the art of turning ideas into collaborations and connections.',
      gradient: 'from-accent to-secondary',
      image: '/static/img/Arnab.jpeg'
    },
    {
      name: 'Aniruddha Mukherjee',
      role: 'Graphics Intern',
      description: 'Bringing imagination to life through bold visuals and creative precision.',
      gradient: 'from-primary to-accent',
      image: '/static/img/Aniruddha.jpeg'
    },
    {
      name: 'Ishita Shaw',
      role: 'Graphics Intern',
      description: 'Designing stories that speak, inspire, and leave a lasting impression.',
      gradient: 'from-secondary to-accent',
      image: '/static/img/Ishita.jpeg'
    }
  ]
  const extendedTeamCount = extendedTeamMembers.length
  const fieldShellClasses =
    'w-full rounded-xl border border-white/12 bg-white/[0.08] px-4 text-base text-foreground/90 placeholder:text-foreground/55 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition-all focus-visible:border-accent focus-visible:ring-accent/25 focus-visible:ring-[3px] focus-visible:ring-offset-0 focus-visible:outline-none backdrop-blur-md'
  const inputClasses = `${fieldShellClasses} h-12`
  const textareaClasses = `${fieldShellClasses} min-h-[200px] py-12 resize-none text-left placeholder:text-center placeholder:leading-relaxed`
  const selectClasses = `${fieldShellClasses} h-12 appearance-none pr-14`
  const faqItems = [
    {
      question: 'What services does ARTEVIA offer?',
      content: (
        <div className="space-y-3 text-foreground/70">
          <p>
            ARTEVIA provides a full range of creative and promotional services - including Graphic Design, Branding,
            Social Media Marketing, Video Editing, Printing Solutions, and Digital Campaign Management.
          </p>
          <p>We help businesses strengthen their brand identity and connect meaningfully with their audience.</p>
        </div>
      )
    },
    {
      question: 'How can I place an order or inquire about a service?',
      content: (
        <p className="text-foreground/70">
          Simply fill out the inquiry form on our Contact Us page - select your required service, mention your budget and deadline,
          and our team will reach out within 24 hours to discuss details.
        </p>
      )
    },
    {
      question: 'Do you work with clients outside Kolkata or pan India?',
      content: (
        <p className="text-foreground/70">
          Yes! ARTEVIA works with clients across India and globally. All designs, videos, and communication are handled digitally
          through email, WhatsApp, or Google Meet for a smooth and efficient experience.
        </p>
      )
    },
    {
      question: 'How long does it take to complete a project?',
      content: (
        <div className="space-y-3 text-foreground/70">
          <p>Timelines vary based on the project type and complexity:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Logo Design & Branding: 3–5 business days</li>
            <li>Social Media Creatives / Reels: 1–3 days</li>
            <li>Video Editing & Print Designs: 2–5 days</li>
            <li>Bulk Campaigns or Retainer Work: Custom timeline shared after discussion</li>
          </ul>
          <p>We always ensure timely delivery while maintaining premium quality.</p>
        </div>
      )
    },
    {
      question: 'What information do you need before starting a project?',
      content: (
        <div className="space-y-3 text-foreground/70">
          <p>To begin, we usually ask for:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>A short business or brand description</li>
            <li>Design preferences or references (if any)</li>
            <li>Target audience and purpose of the design</li>
            <li>Preferred colors or style themes</li>
            <li>Budget and delivery timeline</li>
          </ul>
          <p>This helps us deliver creative designs that match your exact vision.</p>
        </div>
      )
    },
    {
      question: 'What are ARTEVIA’s pricing and payment options?',
      content: (
        <p className="text-foreground/70">
          Pricing depends on project type and requirements. Once we receive your details, we’ll share a customized quotation.
          We accept UPI, Bank Transfer, and Paytm for Indian clients, and PayPal for international payments.
        </p>
      )
    },
    {
      question: 'Does ARTEVIA provide printing and delivery services?',
      content: (
        <div className="space-y-3 text-foreground/70">
          <p>
            Yes! We provide end-to-end printing solutions - from business cards, flyers, banners, packaging, menus, and standees to customized print materials.
          </p>
          <p>Pan-India delivery is available, with a minimum order quantity (MOQ) depending on the print type and order size.</p>
        </div>
      )
    },
    {
      question: 'Can ARTEVIA handle bulk or long-term design requirements?',
      content: (
        <p className="text-foreground/70">
          Definitely! We specialize in retainer-based partnerships for brands needing consistent design and marketing support every week or month - ideal for restaurants, startups, real estate firms, and retail chains.
        </p>
      )
    },
    {
      question: 'What makes ARTEVIA different from other design agencies?',
      content: (
        <p className="text-foreground/70">
          At ARTEVIA – Where Art Meets Vision, creativity meets purpose. We blend design aesthetics with marketing impact, ensuring every project not only looks great but delivers results.
        </p>
      )
    },
    {
      question: 'How can I contact ARTEVIA for quick assistance or urgent orders?',
      content: (
        <div className="space-y-2 text-foreground/70">
          <p>Reach out directly via:</p>
          <p>
            Phone: {contactNumbers.join(' | ')}
            <br />Email: <a href="mailto:artevia.india@gmail.com" className="text-accent hover:underline">artevia.india@gmail.com</a>
          </p>
          <p>Or send us a DM on Instagram - <span className="font-medium text-foreground">@artevia.india</span></p>
        </div>
      )
    }
  ]

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      fullName: '',
      companyName: '',
      email: '',
      phone: '',
      serviceType: '',
      requirement: '',
      budget: '',
      timeline: '',
      deliveryMode: '',
      discoveryChannel: ''
    }
  })

  const renderTeamMemberCard = (member: TeamMember, index: number, baseDelay = 0) => (
    <motion.div
      key={member.name}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: baseDelay + index * 0.2 }}
      whileHover={{ scale: 1.05 }}
    >
      <Card className="glass-card p-8 h-full hover:shadow-2xl hover:shadow-accent/10 transition-all duration-300">
        {member.image ? (
          <div className="mx-auto mb-6 h-36 w-36 overflow-hidden rounded-full border border-white/15 bg-background/40 shadow-lg">
            <img
              src={member.image}
              alt={member.name}
              className="h-full w-full object-cover"
              style={member.imagePosition ? { objectPosition: member.imagePosition } : undefined}
            />
          </div>
        ) : (
          <div className={`relative mx-auto mb-6 flex h-36 w-36 items-center justify-center rounded-full bg-gradient-to-br ${member.gradient} p-[6px]`}>
            <div className="flex h-full w-full items-center justify-center rounded-full bg-background/90 text-3xl font-bold text-gradient">
              {member.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="absolute -bottom-3 left-1/2 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full border border-white/20 bg-background/95 shadow-lg">
              <img src={arteviaLogo} alt="ARTEVIA logo" className="h-9 w-9 object-contain" />
            </div>
          </div>
        )}
        <h3 className="text-2xl font-bold mb-2 text-center">{member.name}</h3>
        <p className="text-accent font-medium text-center mb-4">{member.role}</p>
        <p className="text-foreground/70 leading-relaxed text-center">{member.description}</p>
      </Card>
    </motion.div>
  )

  const handleFormSubmit = async (values: ContactFormValues) => {
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

    if (!serviceId || !templateId || !publicKey) {
      setSubmitStatus('error')
      setSubmitError('Email service is not configured. Please add your EmailJS keys to the environment variables.')
      return
    }

    setSubmitStatus('idle')
    setSubmitError(null)

    try {
      await emailjs.send(
        serviceId,
        templateId,
        {
          full_name: values.fullName,
          company_name: values.companyName || 'N/A',
          email: values.email,
          phone: values.phone,
          service_type: values.serviceType,
          requirement: values.requirement,
          budget: values.budget,
          timeline: values.timeline,
          delivery_mode: values.deliveryMode,
          discovery_channel: values.discoveryChannel
        },
        {
          publicKey
        }
      )

      setSubmitStatus('success')
      reset()
    } catch (error) {
      console.error('EmailJS error:', error)
      setSubmitStatus('error')
      setSubmitError('We could not send your message right now. Please try again or contact us directly.')
    }
  }


  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'services', 'work', 'about', 'contact', 'faq']
      const current = sections.find(section => {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          return rect.top <= 100 && rect.bottom >= 100
        }
        return false
      })
      if (current) setActiveSection(current)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const scrollToSection = (sectionId: string) => {
    setIsMobileMenuOpen(false)
    const element = document.getElementById(sectionId)
    if (element) {
      const offset = 80
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      <nav className="fixed top-0 left-0 right-0 z-50 glass-nav">
        <div className="max-w-7xl mx-auto px-6 py-4 relative">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary via-accent to-primary flex items-center justify-center">
                <img src={arteviaLogo} alt="ARTEVIA" className="h-10 w-10 rounded-full object-contain" />
              </div>
              <span className="text-xl font-bold">ARTEVIA</span>
            </motion.div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-8">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`text-sm font-medium transition-all hover:text-accent relative ${
                      activeSection === item.id ? 'text-accent' : 'text-foreground/80'
                    }`}
                  >
                    {item.label}
                    {activeSection === item.id && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </button>
                ))}
                <Button 
                  onClick={() => scrollToSection('footer')}
                  className="bg-accent hover:bg-accent/90 text-accent-foreground font-medium shadow-lg shadow-accent/20"
                >
                  Contact Us
                </Button>
              </div>

              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(prev => !prev)}
                className="md:hidden inline-flex items-center justify-center rounded-full border border-white/15 bg-background/60 p-2 text-foreground transition hover:border-accent/50 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? <X size={22} weight="bold" /> : <List size={22} weight="bold" />}
              </button>
            </div>
          </div>

          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="md:hidden absolute left-0 right-0 top-full mt-3 overflow-hidden rounded-2xl border border-white/15 bg-background/95 shadow-2xl backdrop-blur-xl"
            >
              <div className="px-6 py-5 space-y-4">
                {navItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`flex w-full items-center justify-between rounded-xl border border-transparent px-4 py-3 text-base font-medium transition hover:border-accent/40 hover:bg-accent/10 ${
                      activeSection === item.id ? 'text-accent' : 'text-foreground/80'
                    }`}
                  >
                    {item.label}
                    {activeSection === item.id && <span className="h-2 w-2 rounded-full bg-accent" />}
                  </button>
                ))}
                <Button
                  onClick={() => scrollToSection('footer')}
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold shadow-lg shadow-accent/30"
                >
                  Contact Us
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </nav>

      <section id="home" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-glow" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/30 rounded-full blur-3xl animate-glow" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/20 rounded-full blur-3xl animate-glow" style={{ animationDelay: '4s' }} />
        </div>

        <div className="absolute inset-0 pointer-events-none">
          <motion.div 
            className="absolute top-40 right-1/4 w-32 h-32 glass-card rounded-3xl animate-float"
            style={{ opacity: heroOpacity }}
          >
            <div className="w-full h-full bg-gradient-to-br from-secondary/30 to-accent/30 rounded-3xl" />
          </motion.div>
          <motion.div 
            className="absolute bottom-40 left-1/4 w-24 h-24 glass-card rounded-2xl animate-float-slow"
            style={{ opacity: heroOpacity }}
          >
            <div className="w-full h-full bg-gradient-to-br from-primary/30 to-secondary/30 rounded-2xl" />
          </motion.div>
          <motion.div 
            className="absolute top-1/3 left-20 w-16 h-16 glass-card rounded-xl animate-float"
            style={{ animationDelay: '1s', opacity: heroOpacity }}
          >
            <Sparkle className="w-full h-full p-3 text-accent" weight="fill" />
          </motion.div>
        </div>

        <motion.div 
          className="relative z-10 text-center px-6 max-w-5xl"
          style={{ opacity: heroOpacity, scale: heroScale }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8"
          >
            <div className="inline-block glass-card px-10 py-16 rounded-[2rem]">
              <div className="w-36 h-36 mx-auto mb-8 rounded-[2rem] bg-gradient-to-br from-secondary via-accent to-primary p-2 glow-effect">
                <div className="w-full h-full rounded-[1.8rem] bg-background flex items-center justify-center">
                  <img src={arteviaLogo} alt="ARTEVIA logo" className="h-28 w-auto object-contain" />
                </div>
              </div>
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-4 tracking-tight">
                ARTEVIA
              </h1>
              <p className="text-2xl md:text-3xl text-gradient font-semibold">
                Where Art Meets Vision
              </p>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-xl md:text-2xl text-foreground/80 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            A new-age creative design studio crafting ideas that leave an impression
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            <Button 
              onClick={() => scrollToSection('work')}
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-lg px-8 py-6 rounded-2xl shadow-2xl shadow-accent/30 transition-all hover:scale-105"
            >
              Explore Our Work
            </Button>
          </motion.div>
        </motion.div>
      </section>

      <section id="services" className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6">Our Services</h2>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
              Comprehensive creative solutions for modern brands
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'Logo & Brand Identity', description: 'Logos and complete branding solutions that capture your essence' },
              { title: 'Social Media Creatives', description: 'Eye-catching content that drives engagement and growth' },
              {title:'Posters,Flyers & Brochures','description':'Creative and impactful poster, flyer, and brochure designs that elevate your brand'},
              { title: 'Video Editing & Thumbnails', description: 'Professional video production and post-production services' },
              { title: 'Marketing Campaigns', description: 'Strategic campaigns that connect and convert audiences' },
              { title: 'T-Shirt and Merchandise', description: 'Unique and stylish T-shirt and merchandise designs that showcase your brand identity' },
              { title: 'Custom Cards & Books', description: 'Elegant and personalized custom card and books for individuals and companies' },
              { title: 'Digital Strategy', description: 'Technology-driven approaches to amplify your brand presence' },
              { title: 'Printing Solutions', description: 'High-quality printing solutions for banners, flex, ID cards, and more with perfect finish' },
            ].map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="glass-card p-8 h-full hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-accent/10">
                  <h3 className="text-2xl font-semibold mb-4 text-gradient">{service.title}</h3>
                  <p className="text-foreground/70 leading-relaxed">{service.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="work" className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6">Featured Projects</h2>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
              Showcasing innovation, clarity, and impact
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'Promotional Reel', category: 'Branding', image: '/static/img/biriyani.jpg', url: 'https://www.instagram.com/p/DOU8dU5iUUi/' },
              { title: 'Social Campaign', category: 'Social Media', image: '/static/img/pizza poster.png', gradient: 'from-accent to-primary' },
              { title: 'Product Launch Video', category: 'Video Production', image: '/static/img/codepup-vid.png', gradient: 'from-primary to-secondary', url: 'https://youtu.be/-CNNE5YbLAo?si=ONkYuxsmc7UT27k-' },
              { title: 'Printed T-Shirts', category: 'Print Design', image: '/static/img/codepup.png', gradient: 'from-secondary via-accent to-primary' },
              { title: 'Digital Marketing', category: 'Strategy', image: '/static/img/bbq.jpeg', gradient: 'from-primary to-accent', url: 'https://youtube.com/shorts/GoL8CraqDeQ?si=YRA22tkdDaA7C2BC' },
              { title: 'Corporate Identity', category: 'Branding',  image: '/static/img/business card.png' }
            ].map((project, index) => {
              const media = project.image ? (
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={project.image}
                    alt={`${project.title} preview`}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-background/20" />
                </div>
              ) : (
                <div className={`h-64 bg-gradient-to-br ${project.gradient ?? 'from-secondary to-accent'} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-background/10 backdrop-blur-sm" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkle className="w-16 h-16 text-white/60 group-hover:scale-125 transition-transform duration-300" weight="fill" />
                  </div>
                </div>
              )

              const cardContent = (
                <>
                  {media}
                  <div className="p-6">
                    <p className="text-sm text-accent font-medium mb-2">{project.category}</p>
                    <h3 className="text-xl font-semibold">{project.title}</h3>
                  </div>
                </>
              )

              return (
                <motion.div
                  key={project.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -10 }}
                  className="group cursor-pointer"
                >
                  <Card className="glass-card overflow-hidden h-full transition-all duration-300">
                    {project.url ? (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${project.title} project link`}
                        className="block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      >
                        {cardContent}
                      </a>
                    ) : (
                      cardContent
                    )}
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      <section id="about" className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-20"
          >
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-5xl md:text-6xl font-bold mb-8">About ARTEVIA</h2>
                <div className="space-y-6 text-lg text-foreground/80 leading-relaxed">
                  <p className="text-2xl font-semibold text-gradient">
                    ARTEVIA - Where Art Meets Vision.
                  </p>
                  <p>
                    We're a new-age creative design studio crafting ideas that leave an impression.
                    At ARTEVIA, we blend creativity, technology, and strategy to help brands communicate better and grow faster.
                  </p>
                  <p>
                    From logos, branding, and social media creatives to video editing, marketing campaigns, and print solutions, our work speaks innovation, clarity, and impact.
                  </p>
                  <p className="text-xl font-medium text-foreground">
                    We don't just design - we create experiences that tell stories, build brands, and connect with audiences.
                  </p>
                </div>
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                <Card className="glass-card p-8 aspect-square flex items-center justify-center">
                  <div className="w-64 h-64 rounded-full bg-gradient-to-br from-secondary via-accent to-primary p-2 animate-float-slow glow-effect">
                    <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden">
                      <img src={arteviaLogo} alt="ARTEVIA logo" className="h-full w-full object-cover" />
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>
          </motion.div>

          <Separator className="my-16 bg-border" />

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">MEET THE CORE TEAM</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {coreTeamMembers.map((member, index) => renderTeamMemberCard(member, index))}
            </div>

            <Accordion type="single" collapsible className="mt-12">
              <AccordionItem value="all-members" className="glass-card border border-white/8 rounded-2xl px-4 py-1">
                <AccordionTrigger className="group flex items-center justify-between gap-6 rounded-full border border-accent/40 bg-accent/15 px-6 py-4 text-base font-semibold text-accent transition-all hover:border-accent/60 hover:bg-accent/25 hover:no-underline focus-visible:outline-none [&>svg]:hidden">
                  <span className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-accent/50 bg-accent/25 text-lg text-accent transition-transform group-data-[state=open]:rotate-45">
                      +
                    </span>
                    <span className="tracking-wide">Meet the rest of Team ARTEVIA</span>
                  </span>
                  <span className="ml-auto flex items-center gap-3">
                    <span className="inline-flex items-center rounded-full border border-accent/50 bg-accent/20 px-4 py-1 text-sm font-medium text-accent">
                      {extendedTeamCount} members
                    </span>
                    <CaretDown className="h-5 w-5 text-accent transition-transform group-data-[state=open]:rotate-180" />
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pt-6">
                  <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {extendedTeamMembers.map((member, index) => renderTeamMemberCard(member, index, 0.1))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </motion.div>
        </div>
      </section>

      <section id="contact" className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6">Inquiry Form</h2>
            <p className="text-xl text-foreground/70 max-w-3xl mx-auto leading-relaxed">
              We’d love to collaborate with you! Whether you need design, printing, or complete branding solutions, tell us about your requirements and our team will respond within 24 hours.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-4xl mx-auto"
          >
            <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
                <Card className="glass-card relative overflow-hidden p-10 space-y-10">
                  <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-accent/12 blur-3xl" />
                    <div className="absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
                  </div>

                  <div className="relative space-y-3">
                    <h3 className="text-3xl font-semibold">Inquiry / Order Form</h3>
                    <p className="text-foreground/70">
                      Share the details below so we can tailor the perfect solution.
                    </p>
                  </div>

                  <div className="relative grid gap-6">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Your Full Name*</Label>
                        <Input
                          id="fullName"
                          placeholder="e.g. Alex Sharma"
                          aria-invalid={errors.fullName ? 'true' : 'false'}
                          className={inputClasses}
                          {...register('fullName')}
                        />
                        {errors.fullName && (
                          <p className="mt-1 text-sm text-destructive">{errors.fullName.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="companyName">Company / Brand Name (optional)</Label>
                        <Input
                          id="companyName"
                          placeholder="e.g. Artevia"
                          className={inputClasses}
                          {...register('companyName')}
                        />
                      </div>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address*</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          aria-invalid={errors.email ? 'true' : 'false'}
                          className={inputClasses}
                          {...register('email')}
                        />
                        {errors.email && (
                          <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number (Preferably WhatsApp)*</Label>
                        <Input
                          id="phone"
                          placeholder="e.g. +91 70030 80422"
                          aria-invalid={errors.phone ? 'true' : 'false'}
                          className={inputClasses}
                          {...register('phone')}
                        />
                        {errors.phone && (
                          <p className="mt-1 text-sm text-destructive">{errors.phone.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="relative space-y-2">
                        <Label htmlFor="serviceType">Select Service Type*</Label>
                        <select
                          id="serviceType"
                          aria-invalid={errors.serviceType ? 'true' : 'false'}
                          className={selectClasses}
                          {...register('serviceType')}
                        >
                          <option value="" disabled>
                            Select an option
                          </option>
                          {serviceTypes.map((service) => (
                            <option key={service} value={service}>
                              {service}
                            </option>
                          ))}
                        </select>
                        <CaretDown className="pointer-events-none absolute top-1/2 right-4 h-5 w-5 -translate-y-1/2 text-foreground/50" />
                        {errors.serviceType && (
                          <p className="mt-1 text-sm text-destructive">{errors.serviceType.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="budget">Budget Range*</Label>
                        <Input
                          id="budget"
                          placeholder="e.g. ₹5,000 - ₹50,000"
                          aria-invalid={errors.budget ? 'true' : 'false'}
                          className={inputClasses}
                          {...register('budget')}
                        />
                        {errors.budget && (
                          <p className="mt-1 text-sm text-destructive">{errors.budget.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="timeline">Delivery Timeline / Deadline*</Label>
                        <Input
                          id="timeline"
                          placeholder="e.g. 3 weeks"
                          aria-invalid={errors.timeline ? 'true' : 'false'}
                          className={inputClasses}
                          {...register('timeline')}
                        />
                        {errors.timeline && (
                          <p className="mt-1 text-sm text-destructive">{errors.timeline.message}</p>
                        )}
                      </div>
                      <div className="relative space-y-2">
                        <Label htmlFor="deliveryMode">Delivery Location / Mode*</Label>
                        <select
                          id="deliveryMode"
                          aria-invalid={errors.deliveryMode ? 'true' : 'false'}
                          className={selectClasses}
                          {...register('deliveryMode')}
                        >
                          <option value="" disabled>
                            Select an option
                          </option>
                          {deliveryModes.map((mode) => (
                            <option key={mode} value={mode}>
                              {mode}
                            </option>
                          ))}
                        </select>
                        <CaretDown className="pointer-events-none absolute top-1/2 right-4 h-5 w-5 -translate-y-1/2 text-foreground/50" />
                        {errors.deliveryMode && (
                          <p className="mt-1 text-sm text-destructive">{errors.deliveryMode.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="relative space-y-2">
                      <Label htmlFor="discoveryChannel">How did you hear about us?*</Label>
                      <select
                        id="discoveryChannel"
                        aria-invalid={errors.discoveryChannel ? 'true' : 'false'}
                        className={selectClasses}
                        {...register('discoveryChannel')}
                      >
                        <option value="" disabled>
                          Select an option
                        </option>
                        {discoveryChannels.map((channel) => (
                          <option key={channel} value={channel}>
                            {channel}
                          </option>
                        ))}
                      </select>
                      <CaretDown className="pointer-events-none absolute top-1/2 right-4 h-5 w-5 -translate-y-1/2 text-foreground/50" />
                      {errors.discoveryChannel && (
                        <p className="mt-1 text-sm text-destructive">{errors.discoveryChannel.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="requirement">Describe Your Requirement*</Label>
                      <Textarea
                        id="requirement"
                        placeholder="Tell us about the project - e.g., brochure design, restaurant branding, event creatives, etc."
                        rows={5}
                        aria-invalid={errors.requirement ? 'true' : 'false'}
                        className={textareaClasses}
                        {...register('requirement')}
                      />
                      {errors.requirement && (
                        <p className="mt-1 text-sm text-destructive">{errors.requirement.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="relative space-y-3">
                    <Button
                      type="submit"
                      size="lg"
                      disabled={isSubmitting}
                      className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold shadow-lg shadow-accent/30"
                    >
                      {isSubmitting ? 'Sending details…' : 'Submit Inquiry'}
                    </Button>
                    {submitStatus === 'success' && (
                      <p className="text-sm text-emerald-400">
                        Thanks for reaching out! Our team will contact you within 24 hours.
                      </p>
                    )}
                    {submitStatus === 'error' && (
                      <p className="text-sm text-destructive">
                        {submitError || 'Something went wrong. Please try again later or contact us directly.'}
                      </p>
                    )}
                  </div>
                </Card>
              </form>
          </motion.div>
        </div>
      </section>

      <section id="faq" className="py-24 px-6 relative">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6">Frequently Asked Questions</h2>
            <p className="text-xl text-foreground/70 max-w-3xl mx-auto leading-relaxed">
              Answers to help you get started quickly with Artevia’s creative, print, and branding services.
            </p>
          </motion.div>

          <Accordion type="multiple" className="glass-card rounded-3xl border border-border/40">
            {faqItems.map((item, index) => (
              <AccordionItem key={item.question} value={`faq-${index}`} className="px-6">
                <AccordionTrigger className="text-lg font-semibold text-foreground py-6">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="pb-6">
                  {item.content}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <footer id="footer" className="py-12 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <Card className="glass-card p-8 md:p-10 space-y-8">
            <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:items-start">
              <div className="space-y-5">
                <div className="space-y-1">
                  <h3 className="text-2xl font-semibold">Contact Us</h3>
                  <p className="text-sm text-foreground/70">
                    Email us, call us, or drop a message - we’re always ready to bring your ideas to life.
                  </p>
                </div>

                <div className="rounded-xl border border-accent/25 bg-accent/5 px-5 py-3 text-sm text-foreground/70">
                  <p className="font-medium text-foreground mb-1">Note</p>
                  <p>
                    Pan-India printing & merchandise delivery available. Minimum order quantity applies by order type.
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <div className="grid gap-4 text-sm text-foreground/80 md:grid-cols-2">
                  <div className="space-y-1">
                    <p className="font-medium text-foreground/90">Email</p>
                    <a href="mailto:artevia.india@gmail.com" className="text-accent hover:underline">artevia.india@gmail.com</a>
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-foreground/90">Phone</p>
                    <p>{contactNumbers.join(' | ')}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-foreground/90">Location</p>
                    <p>Kolkata, India</p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-foreground/90">Business Hours</p>
                    <p>Mon–Sat · 10:00 AM – 7:00 PM</p>
                  </div>
                  <div className="md:col-span-2 flex justify-center pt-2">
                    <Button asChild size="lg" className="w-full px-8 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
                      <a href="mailto:artevia.india@gmail.com">Start a Project</a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="bg-border" />

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-sm text-foreground/60">
              <div className="flex items-center justify-center md:justify-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary via-accent to-primary flex items-center justify-center">
                  <img src={arteviaLogo} alt="ARTEVIA" className="h-8 w-8 rounded-full object-contain" />
                </div>
                <div className="text-center md:text-left">
                  <p className="text-base font-semibold text-foreground">ARTEVIA</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-foreground/50">Where Art Meets Vision</p>
                </div>
              </div>
              <p className="text-center md:flex-1">© 2025 ARTEVIA</p>
              <div className="flex items-center justify-center md:justify-end gap-4">
                {[
                  { Icon: FacebookLogo, label: 'Facebook', url: 'https://www.facebook.com/share/15n7MUpraB/' },
                  { Icon: InstagramLogo, label: 'Instagram', url: 'https://www.instagram.com/artevia.india?igsh=cHlhcXA2bTZibWxs' },
                  { Icon: LinkedinLogo, label: 'LinkedIn', url: 'https://www.linkedin.com/company/artevia-india/' },
                  { Icon: YoutubeLogo, label: 'YouTube', url: 'https://www.youtube.com/@ArteviaIndia' }
                ].map(({ Icon, label, url }) => (
                  <motion.a
                    key={label}
                    href={url}
                    aria-label={label}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.96 }}
                    className="text-foreground/50 hover:text-accent transition-colors"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Icon size={22} weight="fill" />
                  </motion.a>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </footer>
    </div>
  )
}

export default App
