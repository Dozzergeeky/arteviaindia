import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { FacebookLogo, InstagramLogo, LinkedinLogo, YoutubeLogo, Sparkle } from '@phosphor-icons/react'

function App() {
  const [activeSection, setActiveSection] = useState('home')
  const { scrollY } = useScroll()
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0])
  const heroScale = useTransform(scrollY, [0, 300], [1, 0.95])

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'services', 'work', 'about']
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

  const scrollToSection = (sectionId: string) => {
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
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary via-accent to-primary flex items-center justify-center">
                <span className="text-xl font-bold">A</span>
              </div>
              <span className="text-xl font-bold">Artevia</span>
            </motion.div>

            <div className="hidden md:flex items-center gap-8">
              {[
                { id: 'home', label: 'Home Page' },
                { id: 'services', label: 'Our Services' },
                { id: 'work', label: 'Our Work' },
                { id: 'about', label: 'About Us' }
              ].map((item) => (
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
                onClick={() => scrollToSection('about')}
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-medium shadow-lg shadow-accent/20"
              >
                Contact Us
              </Button>
            </div>
          </div>
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
            <div className="inline-block glass-card px-8 py-16 rounded-[2rem]">
              <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-secondary via-accent to-primary p-1 glow-effect">
                <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                  <span className="text-6xl font-bold text-gradient">A</span>
                </div>
              </div>
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-4 tracking-tight">
                Artevia
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
              { title: 'Brand Identity', description: 'Logos and complete branding solutions that capture your essence' },
              { title: 'Social Media Creatives', description: 'Eye-catching content that drives engagement and growth' },
              { title: 'Video Editing', description: 'Professional video production and post-production services' },
              { title: 'Marketing Campaigns', description: 'Strategic campaigns that connect and convert audiences' },
              { title: 'Print Solutions', description: 'High-quality print designs from business cards to billboards' },
              { title: 'Digital Strategy', description: 'Technology-driven approaches to amplify your brand presence' }
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
              { title: 'Brand Refresh 2024', category: 'Branding', color: 'from-secondary to-accent' },
              { title: 'Social Campaign', category: 'Social Media', color: 'from-accent to-primary' },
              { title: 'Product Launch Video', category: 'Video Production', color: 'from-primary to-secondary' },
              { title: 'Print Collateral Suite', category: 'Print Design', color: 'from-secondary via-accent to-primary' },
              { title: 'Digital Marketing', category: 'Strategy', color: 'from-primary to-accent' },
              { title: 'Corporate Identity', category: 'Branding', color: 'from-accent to-secondary' }
            ].map((project, index) => (
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
                  <div className={`h-64 bg-gradient-to-br ${project.color} relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-background/10 backdrop-blur-sm" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkle className="w-16 h-16 text-white/60 group-hover:scale-125 transition-transform duration-300" weight="fill" />
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-sm text-accent font-medium mb-2">{project.category}</p>
                    <h3 className="text-xl font-semibold">{project.title}</h3>
                  </div>
                </Card>
              </motion.div>
            ))}
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
                <h2 className="text-5xl md:text-6xl font-bold mb-8">About Artevia</h2>
                <div className="space-y-6 text-lg text-foreground/80 leading-relaxed">
                  <p className="text-2xl font-semibold text-gradient">
                    Artevia — Where Art Meets Vision.
                  </p>
                  <p>
                    We're a new-age creative design studio crafting ideas that leave an impression.
                    At Artevia, we blend creativity, technology, and strategy to help brands communicate better and grow faster.
                  </p>
                  <p>
                    From logos, branding, and social media creatives to video editing, marketing campaigns, and print solutions, our work speaks innovation, clarity, and impact.
                  </p>
                  <p className="text-xl font-medium text-foreground">
                    We don't just design — we create experiences that tell stories, build brands, and connect with audiences.
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
                    <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                      <span className="text-8xl font-bold text-gradient">A</span>
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
              {[
                {
                  name: 'Krishu Shah',
                  role: 'Founder & Creative Visionary',
                  description: 'The heart of Artevia\'s creative direction — bringing imagination to life through design that inspires and connects.',
                  gradient: 'from-secondary to-accent'
                },
                {
                  name: 'Raghav Jaiswal',
                  role: 'Chief Executive Officer (CEO)',
                  description: 'The strategic mind behind Artevia\'s growth — blending business insight and marketing leadership to drive brand success.',
                  gradient: 'from-accent to-primary'
                },
                {
                  name: 'Atanu Pal',
                  role: 'Chief Technology Officer (CTO)',
                  description: 'The tech innovator ensuring every creative idea is backed by powerful digital execution and modern tools.',
                  gradient: 'from-primary to-secondary'
                }
              ].map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Card className="glass-card p-8 h-full hover:shadow-2xl hover:shadow-accent/10 transition-all duration-300">
                    <div className={`w-32 h-32 rounded-full bg-gradient-to-br ${member.gradient} mx-auto mb-6 flex items-center justify-center text-4xl font-bold`}>
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <h3 className="text-2xl font-bold mb-2 text-center">{member.name}</h3>
                    <p className="text-accent font-medium text-center mb-4">{member.role}</p>
                    <p className="text-foreground/70 leading-relaxed text-center">{member.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="py-12 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <Card className="glass-card p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary via-accent to-primary flex items-center justify-center">
                  <span className="text-2xl font-bold">A</span>
                </div>
                <span className="text-2xl font-bold">Artevia</span>
              </div>

              <div className="flex items-center gap-6">
                {[
                  { Icon: FacebookLogo, label: 'Facebook' },
                  { Icon: InstagramLogo, label: 'Instagram' },
                  { Icon: LinkedinLogo, label: 'LinkedIn' },
                  { Icon: YoutubeLogo, label: 'YouTube' }
                ].map(({ Icon, label }) => (
                  <motion.a
                    key={label}
                    href="#"
                    aria-label={label}
                    whileHover={{ scale: 1.2, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-foreground/60 hover:text-accent transition-colors"
                  >
                    <Icon size={28} weight="fill" />
                  </motion.a>
                ))}
              </div>
            </div>

            <Separator className="my-6 bg-border" />

            <p className="text-center text-foreground/60 text-sm">
              © 2024 Artevia. Where Art Meets Vision.
            </p>
          </Card>
        </div>
      </footer>
    </div>
  )
}

export default App
