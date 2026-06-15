import { useState, useEffect, useRef } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

// ─── SVG Icon helper ─────────────────────────────────────────────────────────
function Icon({ id, size = 20, className = '' }) {
  return (
    <svg
      width={size} height={size}
      className={`tt-icon ${className}`}
      aria-hidden="true"
      focusable="false"
    >
      <use href={`/icons.svg#${id}`} />
    </svg>
  )
}

// ─── Data ────────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { id: 'home',    label: 'Home'    },
  { id: 'about',   label: 'About'   },
  { id: 'reviews', label: 'Reviews' },
  { id: 'contact', label: 'Contact' },
]

const FEATURES = [
  { icon: 'calendar-icon', title: 'Group Dining Events',  desc: 'Restaurants and hosts create curated dining experiences for 2–10 people — dinners, lunches, BBQs, and networking nights.' },
  { icon: 'search-icon',   title: 'Smart Discovery',      desc: 'Filter by location, interests, budget, event type, restaurant rating, and host rating to find your perfect table.' },
  { icon: 'shield-icon',   title: 'Verified Hosts',       desc: 'Users with strong trust scores become Verified Hosts and can organise their own events at restaurants or at home.' },
  { icon: 'star-icon',     title: 'Community Trust Score',desc: 'A dynamic score based on attendance, reviews, and community behaviour keeps every experience safe and genuine.' },
  { icon: 'card-icon',     title: 'Secure Payments',      desc: 'Reserve and pay instantly via cards, mobile wallets, or digital banking. Refunds are automatic if an event is cancelled.' },
  { icon: 'award-icon',    title: 'Badges & Rewards',     desc: 'Earn Explorer, Foodie, Social Connector, Community Builder, and Elite Ambassador badges as you attend more events.' },
]

const STEPS = [
  { num: '01', icon: 'user-icon',     title: 'Create Your Profile', desc: 'Sign up, add your interests, photo, and a short introduction so others know who they are dining with.' },
  { num: '02', icon: 'search-icon',   title: 'Discover Events',     desc: 'Browse nearby group dining events that match your interests, schedule, and budget.' },
  { num: '03', icon: 'card-icon',     title: 'Reserve Your Seat',   desc: 'Book instantly and pay securely. You will receive a confirmation with all event details.' },
  { num: '04', icon: 'qr-icon',       title: 'Show Up & Connect',   desc: 'Arrive, scan the QR check-in, meet new people, and enjoy a great meal together.' },
]

const TRUST_LEVELS = [
  { level: 'New Member',       pct: 20,  color: '#6b7280' },
  { level: 'Active Member',    pct: 40,  color: '#f59e0b' },
  { level: 'Trusted Member',   pct: 60,  color: '#fb923c' },
  { level: 'Community Leader', pct: 80,  color: '#ea580c' },
  { level: 'Elite Member',     pct: 100, color: '#dc2626' },
]

const REVIEWS = [
  { name: 'Sarah M.',  role: 'Remote worker, Karachi',     rating: 5, text: 'I moved here six months ago and knew nobody. TableTogether got me to a dinner for four within my first week — I still meet those people regularly.', avatar: 'SM' },
  { name: 'Ahmed R.',  role: 'Student, Lahore',            rating: 5, text: 'The networking dinner concept is brilliant. Met two co-founders at a single event. The trust system made me comfortable from the very first message.', avatar: 'AR' },
  { name: 'Zara K.',   role: 'Traveller & photographer',   rating: 5, text: 'As someone who travels solo I used to eat alone every night. Now I find a TableTogether event wherever I go. The community feels warm and genuine.', avatar: 'ZK' },
  { name: 'Hassan T.', role: 'Restaurant owner, Islamabad',rating: 5, text: 'Our Monday tables were always empty. Since partnering with TableTogether those slots are consistently full with engaged guests who come back.', avatar: 'HT' },
  { name: 'Nadia F.',  role: 'Entrepreneur, Karachi',      rating: 4, text: 'Clean app, smooth booking, lovely community. I hosted my first home dining event last month and earned great reviews. Highly recommended.', avatar: 'NF' },
  { name: 'Omar S.',   role: 'Software engineer, Lahore',  rating: 5, text: 'Remote work can be very isolating. TableTogether gives me a reason to go out and actually talk to people. It genuinely improved my week.', avatar: 'OS' },
]

const FAQ = [
  { q: 'Is TableTogether free to join?',                         a: 'Yes. Creating a profile and browsing events is completely free. A small platform fee applies only when you reserve a paid seat at an event.' },
  { q: 'How does the trust and safety system work?',             a: "Every user has a dynamic Trust Score built from attendance history, peer reviews, account verification, and community behaviour. Hosts and guests can see each other's scores before committing to an event." },
  { q: 'Can I host my own dining event?',                        a: 'Yes — once you have built up a strong trust score you can apply to become a Verified Host and create events at partner restaurants or at your own home.' },
  { q: 'What if an event does not reach minimum participants?',  a: 'Events require a minimum number of confirmed reservations. If the threshold is not met, all reservations are automatically cancelled and payments refunded.' },
  { q: 'When is the platform launching?',                        a: 'We are finalising the MVP and planning to launch in late 2025. Sign up on the waitlist to get early access.' },
]

const SOCIAL_ICONS = [
  { id: 'x-icon',       label: 'X / Twitter' },
  { id: 'github-icon',  label: 'GitHub'      },
  { id: 'discord-icon', label: 'Discord'     },
  { id: 'bluesky-icon', label: 'Bluesky'     },
]

// ─── Scroll-reveal hook ──────────────────────────────────────────────────────
function useReveal() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return [ref, visible]
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function Stars({ count }) {
  return (
    <span aria-label={`${count} out of 5 stars`} className="d-inline-flex gap-1">
      {Array.from({ length: 5 }, (_, i) => (
        <Icon key={i} id="star-icon" size={16} className={i < count ? 'star-on' : 'star-off'} />
      ))}
    </span>
  )
}

function SectionHeader({ tag, title, sub }) {
  const [ref, vis] = useReveal()
  return (
    <div ref={ref} className={`text-center mb-5 reveal ${vis ? 'revealed' : ''}`}>
      <span className="tt-tag d-inline-block mb-2">{tag}</span>
      <h2 className="tt-section-title">{title}</h2>
      {sub && <p className="tt-section-sub mx-auto">{sub}</p>}
    </div>
  )
}

function RevealCard({ children, className = '', delay = 0 }) {
  const [ref, vis] = useReveal()
  return (
    <div ref={ref} className={`reveal ${vis ? 'revealed' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive]     = useState('home')
  const [open, setOpen]         = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 30)
      for (const { id } of [...NAV_LINKS].reverse()) {
        const el = document.getElementById(id)
        if (el && window.scrollY >= el.offsetTop - 110) { setActive(id); break }
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const go = (e, id) => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setOpen(false); setActive(id)
  }

  return (
    <nav className={`tt-navbar ${scrolled ? 'tt-navbar-scrolled' : ''}`} aria-label="Main navigation">
      <div className="container d-flex align-items-center justify-content-between gap-3">

        {/* Brand */}
        <a href="#home" className="tt-brand text-decoration-none d-flex align-items-center gap-2" onClick={e => go(e, 'home')}>
          <Icon id="fork-knife" size={26} className="tt-brand-icon" />
          <span className="tt-brand-name">TableTogether</span>
        </a>

        {/* Desktop nav */}
        <ul className="nav nav-pills d-none d-md-flex tt-nav-pills">
          {NAV_LINKS.map(({ id, label }) => (
            <li className="nav-item" key={id}>
              <a
                href={`#${id}`}
                className={`nav-link tt-nav-link ${active === id ? 'active tt-nav-active' : ''}`}
                onClick={e => go(e, id)}
                aria-current={active === id ? 'page' : undefined}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        <div className="d-flex align-items-center gap-2">
          <a href="#contact" className="btn tt-btn-primary d-none d-md-inline-flex align-items-center gap-2" onClick={e => go(e, 'contact')}>
            <Icon id="rocket-icon" size={16} /> Join Waitlist
          </a>
          <button className="btn tt-hamburger d-md-none" onClick={() => setOpen(o => !o)} aria-expanded={open} aria-label="Toggle menu">
            <span /><span /><span />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div className={`tt-drawer ${open ? 'tt-drawer-open' : ''}`}>
        {NAV_LINKS.map(({ id, label }) => (
          <a key={id} href={`#${id}`}
            className={`tt-drawer-link ${active === id ? 'tt-drawer-active' : ''}`}
            onClick={e => go(e, id)}
          >{label}</a>
        ))}
        <a href="#contact" className="btn tt-btn-primary mt-3 w-100 d-flex align-items-center justify-content-center gap-2" onClick={e => go(e, 'contact')}>
          <Icon id="rocket-icon" size={16} /> Join Waitlist
        </a>
      </div>
    </nav>
  )
}

// ─── HOME ─────────────────────────────────────────────────────────────────────
function HomeSection() {
  const STATS = [
    { value: '2–10', label: 'Guests per event' },
    { value: '5',    label: 'Trust levels'     },
    { value: '5+',   label: 'Badge tiers'      },
    { value: '100%', label: 'Verified hosts'   },
  ]

  return (
    <section id="home" className="tt-hero">
      <div className="tt-blob tt-blob-1" aria-hidden="true" />
      <div className="tt-blob tt-blob-2" aria-hidden="true" />
      <div className="tt-blob tt-blob-3" aria-hidden="true" />

      <div className="container text-center tt-hero-inner">
        {/* Badge */}
        <span className="badge tt-hero-badge mb-3 d-inline-flex align-items-center gap-2">
          <Icon id="fork-knife" size={14} /> Coming Soon — Join the Waitlist
        </span>

        <h1 className="tt-headline mb-3">
          Dining is better<br />
          <span className="tt-highlight">together.</span>
        </h1>

        <p className="tt-subtext mx-auto mb-4">
          TableTogether is a social dining platform that turns shared meals into meaningful
          connections — for students, remote workers, travellers, and anyone looking to meet
          new people in their city.
        </p>

        {/* CTAs */}
        <div className="d-flex flex-wrap gap-3 justify-content-center mb-5">
          <a href="#contact" className="btn btn-lg tt-btn-primary d-inline-flex align-items-center gap-2">
            <Icon id="rocket-icon" size={18} /> Join the Waitlist
          </a>
          <a href="#about" className="btn btn-lg tt-btn-outline d-inline-flex align-items-center gap-2">
            Learn More <Icon id="arrow-right" size={18} />
          </a>
        </div>

        {/* Stats */}
        <div className="row g-3 justify-content-center">
          {STATS.map(({ value, label }) => (
            <div key={label} className="col-6 col-sm-3">
              <div className="tt-stat-card card border-0 h-100 text-center p-3">
                <div className="tt-stat-value">{value}</div>
                <div className="tt-stat-label text-uppercase small mt-1">{label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── ABOUT ────────────────────────────────────────────────────────────────────
function AboutSection() {
  return (
    <section id="about" className="tt-section tt-section-about py-5">
      <div className="container py-5">

        <SectionHeader
          tag="About TableTogether"
          title="Why we built this"
          sub="Modern urban life has made it easy to feel isolated even in a crowd. We are solving that — one shared table at a time."
        />

        {/* Problem / Solution */}
        <div className="row g-4 mb-5 align-items-stretch">
          <div className="col-md-6">
            <RevealCard className="card h-100 tt-glass-card tt-card-red-border">
              <div className="card-body p-4">
                <span className="badge bg-danger mb-3 tt-label-badge">The Problem</span>
                <ul className="list-unstyled mb-0">
                  {[
                    { icon: 'users-icon',    text: 'People moving to new cities without a social circle' },
                    { icon: 'social-icon',   text: 'Remote workers lacking daily social interaction' },
                    { icon: 'user-icon',     text: 'Solo travellers looking for companionship' },
                    { icon: 'documentation-icon', text: 'Students and professionals feeling disconnected' },
                    { icon: 'fork-knife',    text: 'Restaurants operating with unused seating capacity' },
                  ].map(({ icon, text }, i) => (
                    <li key={i} className="d-flex align-items-start gap-2 mb-2">
                      <Icon id={icon} size={18} className="tt-list-icon-red flex-shrink-0 mt-1" />
                      <span className="tt-body-text">{text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </RevealCard>
          </div>

          <div className="col-md-6">
            <RevealCard delay={100} className="card h-100 tt-glass-card tt-card-green-border">
              <div className="card-body p-4">
                <span className="badge tt-badge-green mb-3 tt-label-badge">Our Solution</span>
                <p className="tt-body-text">
                  TableTogether bridges the gap by enabling restaurants, hosts, and community
                  organisers to create group dining experiences where strangers can safely meet,
                  dine, socialise, and build meaningful connections.
                </p>
                <p className="tt-body-text">
                  The platform combines restaurant reservations, social networking, community
                  building, trust systems, and event management into a single ecosystem.
                </p>
                <p className="tt-body-text mb-0">
                  In a future phase, trusted users will also host private dining experiences
                  from their own home — earning income while building community.
                </p>
              </div>
            </RevealCard>
          </div>
        </div>

        {/* Features */}
        <SectionHeader tag="Core Features" title="Everything you need to connect" />
        <div className="row g-4 mb-5">
          {FEATURES.map(({ icon, title, desc }, i) => (
            <div key={title} className="col-12 col-sm-6 col-lg-4">
              <RevealCard delay={i * 60} className="card h-100 tt-glass-card text-center tt-feature-card">
                <div className="card-body p-4">
                  <div className="tt-feat-icon mb-3 d-flex justify-content-center">
                    <Icon id={icon} size={40} className="tt-icon-amber" />
                  </div>
                  <h5 className="card-title tt-card-title mb-2">{title}</h5>
                  <p className="card-text tt-card-text small">{desc}</p>
                </div>
              </RevealCard>
            </div>
          ))}
        </div>

        {/* Trust levels */}
        <SectionHeader tag="Trust System" title="Your reputation grows with you" />
        <div className="row justify-content-center mb-5">
          <div className="col-12 col-lg-8">
            <RevealCard className="card tt-glass-card">
              <div className="card-body p-4">
                {TRUST_LEVELS.map(({ level, pct, color }) => (
                  <div key={level} className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <small className="tt-trust-label">{level}</small>
                      <small className="tt-trust-pct">{pct}%</small>
                    </div>
                    <div className="progress tt-progress-track">
                      <div
                        className="progress-bar tt-progress-bar"
                        role="progressbar"
                        style={{ width: `${pct}%`, background: color }}
                        aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </RevealCard>
          </div>
        </div>

        {/* How it works */}
        <SectionHeader tag="How It Works" title="From sign-up to shared meal in four steps" />
        <div className="row g-4">
          {STEPS.map(({ num, icon, title, desc }, i) => (
            <div key={num} className="col-12 col-sm-6 col-lg-3">
              <RevealCard delay={i * 80} className="card h-100 tt-glass-card tt-step-card text-center">
                <div className="card-body p-4">
                  <div className="tt-step-num mb-2">{num}</div>
                  <div className="d-flex justify-content-center mb-3">
                    <Icon id={icon} size={32} className="tt-icon-amber" />
                  </div>
                  <h5 className="card-title tt-card-title mb-2">{title}</h5>
                  <p className="card-text tt-card-text small">{desc}</p>
                </div>
              </RevealCard>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

// ─── GALLERY ─────────────────────────────────────────────────────────────────
const GALLERY = [
  {
    src: 'https://images.unsplash.com/photo-1529543544282-ea669407fca3?w=800&q=80',
    alt: 'Friends laughing together at a dinner table',
    caption: 'New friendships over shared plates',
  },
  {
    src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
    alt: 'Group of people enjoying a restaurant meal',
    caption: 'Great food, greater conversations',
  },
  {
    src: 'https://images.unsplash.com/photo-1543353071-087092ec393a?w=800&q=80',
    alt: 'People gathered around a table with drinks and food',
    caption: 'Every table tells a story',
  },
  {
    src: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=800&q=80',
    alt: 'Cosy dining group sharing a meal at night',
    caption: 'Strangers become community',
  },
]

function GallerySection() {
  return (
    <section className="tt-section tt-section-gallery py-5">
      <div className="container py-3">
        <SectionHeader
          tag="Real Moments"
          title="People connecting at the table"
          sub="This is what TableTogether is all about — real people, real food, real connections."
        />
        <div className="row g-3">
          {/* Large featured image */}
          <div className="col-12 col-md-6">
            <RevealCard className="h-100">
              <div className="tt-gallery-card tt-gallery-large">
                <img
                  src={GALLERY[0].src}
                  alt={GALLERY[0].alt}
                  className="tt-gallery-img"
                  loading="lazy"
                />
                <div className="tt-gallery-caption">{GALLERY[0].caption}</div>
              </div>
            </RevealCard>
          </div>

          {/* Three smaller images */}
          <div className="col-12 col-md-6">
            <div className="row g-3 h-100">
              {GALLERY.slice(1).map(({ src, alt, caption }, i) => (
                <div key={i} className="col-12 col-sm-6 col-md-12 col-lg-6">
                  <RevealCard delay={i * 80} className="h-100">
                    <div className="tt-gallery-card">
                      <img
                        src={src}
                        alt={alt}
                        className="tt-gallery-img"
                        loading="lazy"
                      />
                      <div className="tt-gallery-caption">{caption}</div>
                    </div>
                  </RevealCard>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── REVIEWS ─────────────────────────────────────────────────────────────────
function ReviewsSection() {
  return (
    <section id="reviews" className="tt-section tt-section-reviews py-5">
      <div className="container py-5">

        <SectionHeader
          tag="Community Reviews"
          title="What our early community says"
          sub="Real stories from users and restaurant partners who have experienced TableTogether firsthand."
        />

        {/* Rating summary */}
        <div className="text-center mb-5">
          <div className="tt-big-rating">5.0</div>
          <Stars count={5} />
          <p className="tt-rating-sub mt-2 small">{REVIEWS.length} community reviews</p>
        </div>

        {/* Review cards */}
        <div className="row g-4 mb-5">
          {REVIEWS.map(({ name, role, rating, text, avatar }, i) => (
            <div key={name} className="col-12 col-md-6 col-lg-4">
              <RevealCard delay={i * 60} className="card h-100 tt-glass-card tt-review-card">
                <div className="card-body p-4">
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div className="tt-avatar flex-shrink-0">{avatar}</div>
                    <div>
                      <div className="fw-bold tt-reviewer-name">{name}</div>
                      <div className="small tt-reviewer-role">{role}</div>
                    </div>
                  </div>
                  <Stars count={rating} />
                  <p className="card-text tt-card-text small mt-2">{text}</p>
                </div>
              </RevealCard>
            </div>
          ))}
        </div>

        {/* FAQ — Bootstrap Accordion */}
        <SectionHeader tag="FAQ" title="Frequently asked questions" />
        <div className="accordion tt-accordion mx-auto" id="faqAccordion" style={{ maxWidth: 720 }}>
          {FAQ.map(({ q, a }, i) => (
            <div className="accordion-item tt-accordion-item" key={i}>
              <h3 className="accordion-header">
                <button
                  className="accordion-button tt-accordion-btn collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#faq${i}`}
                  aria-expanded="false"
                >
                  {q}
                </button>
              </h3>
              <div id={`faq${i}`} className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                <div className="accordion-body tt-accordion-body">{a}</div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

// ─── CONTACT ─────────────────────────────────────────────────────────────────
function ContactSection() {
  const [form, setForm]           = useState({ name: '', email: '', subject: '', message: '' })
  const [errors, setErrors]       = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending]     = useState(false)

  const validate = () => {
    const e = {}
    if (!form.name.trim())    e.name    = 'Name is required.'
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'A valid email is required.'
    if (!form.subject.trim()) e.subject = 'Subject is required.'
    if (!form.message.trim()) e.message = 'Message is required.'
    return e
  }

  const handleChange = e => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    setErrors(er => ({ ...er, [name]: undefined }))
  }

  const handleSubmit = e => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setSending(true)
    setTimeout(() => { setSending(false); setSubmitted(true) }, 1200)
  }

  const CONTACT_INFO = [
    { icon: 'mail-icon', title: 'Email us',  detail: 'hello@tabletogether.app' },
    { icon: 'pin-icon',  title: 'Based in',  detail: 'Pakistan — launching nationwide' },
    { icon: 'chat-icon', title: 'Social',    detail: 'Follow our journey below' },
  ]

  return (
    <section id="contact" className="tt-section tt-section-contact py-5">
      <div className="container py-5">

        <SectionHeader
          tag="Get in Touch"
          title="Contact us"
          sub="Have a question, want to partner your restaurant, or just excited to hear more? We would love to hear from you."
        />

        <div className="row g-5 justify-content-center">

          {/* Info */}
          <div className="col-12 col-lg-4">
            <div className="d-flex flex-column gap-4">
              {CONTACT_INFO.map(({ icon, title, detail }) => (
                <div key={title} className="d-flex align-items-start gap-3">
                  <div className="tt-contact-icon-wrap">
                    <Icon id={icon} size={22} className="tt-icon-amber" />
                  </div>
                  <div>
                    <div className="tt-info-label text-uppercase small fw-bold">{title}</div>
                    <div className="tt-info-detail fw-semibold">{detail}</div>
                  </div>
                </div>
              ))}

              <div className="d-flex gap-2 flex-wrap mt-2">
                {SOCIAL_ICONS.map(({ id, label }) => (
                  <a key={id} href="#" className="tt-social-btn" aria-label={label}>
                    <Icon id={id} size={18} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="col-12 col-lg-7">
            {submitted ? (
              <div className="card tt-glass-card text-center p-5">
                <div className="d-flex justify-content-center mb-3">
                  <Icon id="check-icon" size={56} className="tt-icon-green" />
                </div>
                <h4 className="tt-card-title mb-2">Message sent!</h4>
                <p className="tt-card-text">Thanks for reaching out. We will get back to you within 24 hours.</p>
                <button
                  className="btn tt-btn-outline mt-3 mx-auto"
                  style={{ maxWidth: 200 }}
                  onClick={() => { setSubmitted(false); setForm({ name:'', email:'', subject:'', message:'' }) }}
                >
                  Send another
                </button>
              </div>
            ) : (
              <form className="card tt-glass-card p-4 p-md-5" onSubmit={handleSubmit} noValidate>
                <div className="row g-3">
                  <div className="col-12 col-sm-6">
                    <div className="form-floating">
                      <input id="cf-name" name="name" type="text"
                        className={`form-control tt-input ${errors.name ? 'is-invalid' : ''}`}
                        placeholder="Your name" value={form.name} onChange={handleChange} />
                      <label htmlFor="cf-name">Full name</label>
                      {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                    </div>
                  </div>
                  <div className="col-12 col-sm-6">
                    <div className="form-floating">
                      <input id="cf-email" name="email" type="email"
                        className={`form-control tt-input ${errors.email ? 'is-invalid' : ''}`}
                        placeholder="your@email.com" value={form.email} onChange={handleChange} />
                      <label htmlFor="cf-email">Email address</label>
                      {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-floating">
                      <input id="cf-subject" name="subject" type="text"
                        className={`form-control tt-input ${errors.subject ? 'is-invalid' : ''}`}
                        placeholder="Subject" value={form.subject} onChange={handleChange} />
                      <label htmlFor="cf-subject">Subject</label>
                      {errors.subject && <div className="invalid-feedback">{errors.subject}</div>}
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-floating">
                      <textarea id="cf-message" name="message"
                        className={`form-control tt-input tt-textarea ${errors.message ? 'is-invalid' : ''}`}
                        placeholder="Message" value={form.message} onChange={handleChange} />
                      <label htmlFor="cf-message">Message</label>
                      {errors.message && <div className="invalid-feedback">{errors.message}</div>}
                    </div>
                  </div>
                  <div className="col-12">
                    <button type="submit" className="btn btn-lg tt-btn-primary w-100 d-flex align-items-center justify-content-center gap-2" disabled={sending}>
                      {sending
                        ? <><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" /> Sending…</>
                        : <><Icon id="send-icon" size={18} /> Send Message</>}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  )
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer() {
  const go = (e, id) => { e.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }) }
  return (
    <footer className="tt-footer py-5">
      <div className="container">
        <div className="row g-4 mb-4 align-items-start">

          <div className="col-12 col-md-4">
            <div className="d-flex align-items-center gap-2 mb-2">
              <Icon id="fork-knife" size={22} className="tt-icon-amber" />
              <span className="fw-bold fs-5 tt-footer-brand">TableTogether</span>
            </div>
            <p className="small tt-text-dim" style={{ maxWidth: 240 }}>
              Connecting people through shared dining experiences.
            </p>
          </div>

          <div className="col-6 col-md-2">
            <div className="tt-footer-heading mb-3">Navigation</div>
            <ul className="list-unstyled mb-0">
              {NAV_LINKS.map(({ id, label }) => (
                <li key={id} className="mb-1">
                  <a href={`#${id}`} className="tt-footer-link text-decoration-none small" onClick={e => go(e, id)}>{label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-6 col-md-2">
            <div className="tt-footer-heading mb-3">Platform</div>
            <ul className="list-unstyled mb-0">
              {['Group Events','Verified Hosts','Trust Score','Badges'].map(item => (
                <li key={item} className="mb-1">
                  <a href="#about" className="tt-footer-link text-decoration-none small" onClick={e => go(e, 'about')}>{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-12 col-md-4">
            <div className="tt-footer-heading mb-3">Follow us</div>
            <div className="d-flex gap-2 flex-wrap">
              {SOCIAL_ICONS.map(({ id, label }) => (
                <a key={id} href="#" className="tt-social-btn" aria-label={label}>
                  <Icon id={id} size={18} />
                </a>
              ))}
            </div>
          </div>

        </div>

        <hr className="tt-footer-hr" />
        <div className="d-flex flex-wrap gap-2 justify-content-center align-items-center small tt-text-dim">
          <span>© 2025 TableTogether. All rights reserved.</span>
          <span aria-hidden="true" className="opacity-50">·</span>
          <span>Static preview — no backend connected</span>
        </div>
      </div>
    </footer>
  )
}

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <HomeSection />
        <div className="tt-divider" aria-hidden="true">
          <Icon id="fork-knife" size={18} className="tt-icon-dim" />
        </div>
        <AboutSection />
        <div className="tt-divider" aria-hidden="true">
          <Icon id="fork-knife" size={18} className="tt-icon-dim" />
        </div>
        <GallerySection />
        <div className="tt-divider" aria-hidden="true">
          <Icon id="plate-icon" size={18} className="tt-icon-dim" />
        </div>
        <ReviewsSection />
        <div className="tt-divider" aria-hidden="true">
          <Icon id="coffee-icon" size={18} className="tt-icon-dim" />
        </div>
        <ContactSection />
      </main>
      <Footer />
    </>
  )
}
