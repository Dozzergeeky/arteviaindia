# Planning Guide

A stunning home page for Artevia, a creative design studio, featuring liquid glass aesthetics inspired by macOS Sequoia with immersive Projects and About Us sections.

**Experience Qualities**:
1. **Luxurious** - Premium glass morphism effects that evoke high-end design sophistication
2. **Fluid** - Seamless animations and transitions that feel organic and responsive
3. **Inspiring** - Visual storytelling that showcases creativity and innovation

**Complexity Level**: Content Showcase (information-focused)
  - Primary focus on presenting the studio's identity, team, and projects through rich visual design with glass morphism effects and minimal interactivity.

## Essential Features

### Hero Section with Liquid Glass
- **Functionality**: Large hero area with company logo, tagline, and floating glass elements
- **Purpose**: Immediately establish brand identity with stunning visual impact
- **Trigger**: Page load
- **Progression**: Page loads → Animated glass elements fade in → Subtle floating animations continue
- **Success criteria**: Hero captures attention within 2 seconds, glass effects are smooth

### Navigation Bar
- **Functionality**: Fixed glass navigation with links to sections (Home, Our Services, Our Work, About Us, Contact)
- **Purpose**: Provide intuitive site navigation with premium aesthetic
- **Trigger**: Page load, persists on scroll
- **Progression**: Always visible → Hover reveals enhanced glow → Click scrolls to section
- **Success criteria**: Navigation is accessible and visually cohesive with glass theme

### Projects Section
- **Functionality**: Showcases portfolio projects in glass cards with hover effects
- **Purpose**: Display creative work to potential clients
- **Trigger**: Scroll into view
- **Progression**: Section enters viewport → Cards animate in → Hover reveals project details
- **Success criteria**: Projects are clearly visible, hover states feel responsive

### About Us Section
- **Functionality**: Company description with mission statement in glass container
- **Purpose**: Communicate brand values and story
- **Trigger**: Scroll into view
- **Progression**: Section enters viewport → Content fades in with glass effect
- **Success criteria**: Text is readable against glass background, hierarchy is clear

### Meet the Core Team Section
- **Functionality**: Three team member cards with photos, names, titles, and descriptions
- **Purpose**: Build trust by introducing leadership team
- **Trigger**: Scroll into view
- **Progression**: Section enters viewport → Team cards animate in sequentially
- **Success criteria**: Team members are clearly presented, photos load correctly

### Footer
- **Functionality**: Social media links and company name in glass container
- **Purpose**: Provide additional contact methods and branding
- **Trigger**: Scroll to bottom
- **Progression**: Always visible at bottom → Hover on social icons shows glow
- **Success criteria**: Links are functional, footer complements overall design

## Edge Case Handling
- **Missing Images**: Placeholder gradients with initials for team photos if assets don't exist
- **Long Content**: Text truncation with smooth overflow in glass containers
- **Slow Connections**: Progressive enhancement - content visible before animations
- **Small Screens**: Responsive grid layouts, single column on mobile with preserved glass effects
- **Reduced Motion**: Respects prefers-reduced-motion for accessibility

## Design Direction
The design should evoke the premium, ethereal quality of macOS Sequoia's liquid glass aesthetic - sophisticated, cutting-edge, and elegant with generous use of translucent surfaces, subtle depth, and ambient lighting effects that create a sense of floating UI elements in 3D space.

## Color Selection
Custom palette - Vibrant yet sophisticated colors that work with glass morphism

- **Primary Color**: Deep Purple `oklch(0.45 0.15 290)` - Represents creativity and innovation, used for key brand moments
- **Secondary Colors**: 
  - Soft Pink `oklch(0.75 0.12 340)` - Warmth and approachability in accents
  - Electric Blue `oklch(0.60 0.18 240)` - Technology and modernity in highlights
- **Accent Color**: Vibrant Magenta `oklch(0.65 0.25 330)` - CTAs and important interactive elements
- **Foreground/Background Pairings**:
  - Background (Dark Navy `oklch(0.15 0.03 270)`): White text `oklch(0.98 0 0)` - Ratio 13.5:1 ✓
  - Card Glass (Translucent White 10-15% opacity): White text `oklch(0.98 0 0)` with backdrop blur
  - Primary (Deep Purple): White text `oklch(0.98 0 0)` - Ratio 8.2:1 ✓
  - Accent (Vibrant Magenta): White text `oklch(0.98 0 0)` - Ratio 5.1:1 ✓

## Font Selection
Clean, modern sans-serif typography that conveys professionalism while maintaining approachability - using Inter for its excellent readability and SF Pro Display characteristics.

- **Typographic Hierarchy**:
  - H1 (Hero Title): Inter Bold / 64px / -0.02em letter spacing / 1.1 line height
  - H2 (Section Titles): Inter Bold / 48px / -0.01em letter spacing / 1.2 line height
  - H3 (Team Names): Inter SemiBold / 28px / -0.01em letter spacing / 1.3 line height
  - Body (Descriptions): Inter Regular / 18px / 0em letter spacing / 1.6 line height
  - Small (Roles): Inter Medium / 16px / 0em letter spacing / 1.5 line height

## Animations
Animations should feel like they're responding to physics - smooth easing with subtle spring-like qualities that enhance the liquid glass metaphor without distracting from content.

- **Purposeful Meaning**: Glass elements float gently, creating depth; hover interactions produce subtle glow and lift effects that reinforce the 3D glass aesthetic
- **Hierarchy of Movement**: 
  - Primary: Hero glass elements with continuous subtle floating
  - Secondary: Section fade-ins as they enter viewport
  - Tertiary: Hover states on interactive elements with glow and scale

## Component Selection
- **Components**: 
  - Card (shadcn) - Modified with glass morphism (backdrop-blur-xl, bg-white/10, border with gradient)
  - Button (shadcn) - Custom glass variant with glow effects
  - Separator (shadcn) - Subtle dividers with glass aesthetic
- **Customizations**: 
  - Glass morphism utility classes for consistent blur/transparency
  - Floating animation keyframes for ambient motion
  - Glow effects using CSS filters and shadows
  - Gradient borders for glass containers
- **States**: 
  - Buttons: default (glass), hover (enhanced glow + lift), active (pressed with reduced glow)
  - Cards: default (subtle glass), hover (enhanced glass + lift + glow border)
- **Icon Selection**: 
  - Phosphor icons for social media (FacebookLogo, InstagramLogo, LinkedinLogo, YoutubeLogo)
  - Sparkle or Cube icons for decorative glass elements
- **Spacing**: 
  - Section padding: py-24 (96px) for generous breathing room
  - Container max-width: 1280px with px-6 horizontal padding
  - Card gaps: gap-8 (32px) between cards
  - Text spacing: space-y-6 for paragraphs
- **Mobile**: 
  - Hero text scales to 36px on mobile
  - Team cards stack in single column below 768px
  - Navigation becomes hamburger menu (or simplified) below 768px
  - Reduced blur effects on mobile for performance
