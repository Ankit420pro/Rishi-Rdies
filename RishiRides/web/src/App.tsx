import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BusFront,
  ChevronDown,
  Compass,
  LocateFixed,
  MapPin,
  Menu,
  Navigation,
  Search,
  ShieldCheck,
  X,
  UserRound,
} from 'lucide-react';
import { FormEvent, useState } from 'react';
import { Link, Route, Routes, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Destination, destinations } from './data/destinations';

const apiBase = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '');

export default function App() {
  return (
    <div className="app-shell">
      <SiteHeader />
      <main id="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/destinations" element={<DestinationsPage />} />
          <Route path="/destinations/:slug" element={<DestinationPage />} />
          <Route path="/sign-in" element={<AccountPage mode="sign-in" />} />
          <Route path="/sign-up" element={<AccountPage mode="sign-up" />} />
          <Route path="/verify" element={<VerifyPage />} />
          <Route path="/about" element={<InfoPage title="About RishiRide" eyebrow="LOCAL BY NATURE" body="A locally focused way to plan a ride across Rishikesh. We are building the service around clear information, fair choices, and respectful travel." />} />
          <Route path="/services" element={<InfoPage title="Rides around Rishikesh" eyebrow="OUR SERVICE" body="RishiRide is being prepared for local passenger trips with e-rickshaws for groups of up to three and CNG auto-rickshaws for larger groups. Booking and route services are not available until securely connected." />} />
          <Route path="/faqs" element={<FaqPage />} />
          <Route path="/terms" element={<InfoPage title="Terms" eyebrow="PRE-LAUNCH DRAFT" body="RishiRide currently supports account registration and phone verification only. Ride booking, fares, payments and driver dispatch are not active, and no ride request is sent. Drivers cannot go online before applicable documents and administrator review are approved. These draft terms require legal review for the launch jurisdiction before live use." />} />
          <Route path="/privacy" element={<InfoPage title="Privacy" eyebrow="PRE-LAUNCH DRAFT" body="Signup stores your name, mobile number, preferred language and consent timestamps on the account service. The SMS provider receives your phone number to deliver and verify codes. Raw OTPs are not stored by the app. Ordinary passenger signup does not request a driving licence or Aadhaar. Location is requested only when you choose current location; this preview does not submit a ride request or persist browser auth tokens. Retention, deletion and jurisdiction-specific data handling require legal review before launch." />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <SiteFooter />
    </div>
  );
}

function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const isHome = useLocation().pathname === '/';
  const links = [
    { to: '/sign-up?role=passenger', label: 'Passenger', end: false },
    { to: '/sign-up?role=driver', label: 'Driver', end: false },
  ];
  return (
    <header className={`site-header${isHome ? ' site-header-home' : ''}`}>
      <div className="header-inner">
        <Link to="/" className="brand" aria-label="RishiRide home">
          <span className="brand-icon"><BusFront size={21} strokeWidth={2.5} /></span>
          <span className="brand-word brand-stack"><span>RISHI</span><span>RIDES</span></span>
        </Link>
        <button className="mobile-menu-button icon-button" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <nav className={`primary-nav ${menuOpen ? 'nav-open' : ''}`} aria-label="Main navigation">
          {links.map((link) => <Link key={link.to} to={link.to} onClick={() => setMenuOpen(false)}>{link.label}</Link>)}
          <div className="nav-account">
            <Link to="/sign-in" className="nav-sign-in">Sign in</Link>
            <Link to="/sign-up" className="nav-join">Join RishiRide <ArrowUpRight size={14} /></Link>
          </div>
        </nav>
      </div>
    </header>
  );
}

function HomePage() {
  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="home-hero-inner">
          <div className="hero-copy">
            <p className="hero-location"><span className="hero-live-dot" /><MapPin size={14} /> RISHIKESH · UTTARAKHAND</p>
            <h1>YOUR RIDE.<br /><span>YOUR JOURNEY.</span></h1>
            <p className="hero-description">Move through Rishikesh with a ride experience designed to feel simple and local.</p>
            <div className="hero-actions">
              <Link className="hero-role hero-role-passenger" to="/sign-up?role=passenger">
                <span className="hero-role-icon"><UserRound size={21} /></span>
                <span className="hero-role-copy"><strong>I NEED A RIDE</strong><small>Find a comfortable ride around Rishikesh</small></span>
                <span className="hero-role-arrow"><ArrowRight size={19} /></span>
              </Link>
              <Link className="hero-role hero-role-driver" to="/sign-up?role=driver">
                <span className="hero-role-icon"><Navigation size={21} /></span>
                <span className="hero-role-copy"><strong>I WANT TO DRIVE</strong><small>Begin driver registration in four steps</small></span>
                <ArrowRight className="hero-driver-arrow" size={19} />
              </Link>
            </div>
            <div className="hero-trust-row"><span><ShieldCheck size={15} /> PHONE VERIFIED</span><span><BusFront size={15} /> LOCAL RIDES</span><span><MapPin size={15} /> RISHIKESH</span></div>
          </div>
          <div className="hero-art-wrap" aria-label="RishiRides local vehicle illustration">
            <div className="hero-platform-shadow" />
            <div className="hero-vehicle-panel">
              <div className="hero-panel-location"><span /> RISHIKESH</div>
              <div className="hero-vehicle-orbit"><BusFront size={112} strokeWidth={1.7} /></div>
              <div className="hero-vehicle-road" />
              <div className="hero-floating-note"><span className="hero-note-icon"><Navigation size={17} /></span><span><small>READY TO MOVE</small><strong>Explore Rishikesh</strong></span></div>
            </div>
            <div className="hero-art-caption"><span>MOVE AROUND</span><strong>RISHIKESH</strong><small>One place to begin your local journey.</small></div>
          </div>
        </div>
      </section>

      <section className="booking-section" aria-labelledby="booking-title">
        <div className="section-marker"><span>01</span><span>START HERE</span></div>
        <div className="booking-layout">
          <div className="booking-heading">
            <h2 id="booking-title">Where are you headed?</h2>
            <p>Enter a pickup and a destination to begin.</p>
          </div>
          <BookingForm />
        </div>
      </section>

      <section className="driver-invite" aria-label="Driver registration">
        <div className="driver-invite-mark"><Navigation size={18} /></div>
        <div><p className="eyebrow">DRIVE WITH RISHIRIDE</p><h2>Local drivers start here.</h2><p>Register by phone, then review the four onboarding stages. Document upload stays disabled until private review is ready.</p></div>
        <Link className="driver-invite-link" to="/sign-up?role=driver">Driver registration <ArrowRight size={16} /></Link>
      </section>

      <section className="discover-section">
        <div className="discover-head">
          <div><p className="eyebrow">THE RIVER, THE GHATS, THE HILLS</p><h2>Places worth a stop.</h2></div>
          <Link className="text-link" to="/destinations">Explore all places <ArrowRight size={15} /></Link>
        </div>
        <div className="feature-destinations">
          {destinations.filter((place) => place.photoUrl).slice(0, 3).map((place, index) => <DestinationCard key={place.slug} destination={place} index={index} />)}
        </div>
      </section>
    </div>
  );
}

function BookingForm() {
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [partySize, setPartySize] = useState(1);
  const [locationBusy, setLocationBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const vehicle = partySize <= 3 ? 'E-rickshaw' : 'CNG auto-rickshaw';

  const requestLocation = () => {
    setNotice('');
    if (!navigator.geolocation) {
      setNotice('Location access is unavailable in this browser. Enter your pickup point instead.');
      return;
    }
    setLocationBusy(true);
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      if (!apiBase) {
        setNotice('Location name unavailable because the geocoding service is not configured. Enter a pickup point or try again later.');
        setLocationBusy(false);
        return;
      }
      try {
        const response = await fetch(`${apiBase}/geo/reverse-geocode`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ latitude: coords.latitude, longitude: coords.longitude }),
        });
        if (!response.ok) throw new Error('Reverse geocoding failed.');
        const result: { name?: string } = await response.json();
        if (!result.name?.trim()) throw new Error('No readable place name was returned.');
        setPickup(result.name);
        setNotice('Pickup set from your current location.');
      } catch {
        setNotice('Location name unavailable. Enter a pickup point or retry.');
      } finally {
        setLocationBusy(false);
      }
    }, (error) => {
      setLocationBusy(false);
      setNotice(error.code === error.PERMISSION_DENIED
        ? 'Location permission was denied. Enter a pickup point manually to continue.'
        : 'Could not determine your location. Enter a pickup point or retry.');
    }, { enableHighAccuracy: false, timeout: 12000, maximumAge: 30000 });
  };

  const submitBooking = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNotice(!pickup.trim()
      ? 'Add a pickup point before requesting a ride.'
      : !dropoff.trim()
        ? 'Add a destination before requesting a ride.'
        : 'Booking is not available yet. Your request has not been sent.');
  };

  return (
    <form className="booking-form" onSubmit={submitBooking}>
      <div className="booking-fields">
        <label className="booking-field">
          <span className="field-symbol pickup-symbol" aria-hidden="true" />
          <span className="field-copy"><span className="field-label">PICKUP</span><input value={pickup} onChange={(event) => setPickup(event.target.value)} placeholder="Enter a pickup point" autoComplete="street-address" /></span>
          <button type="button" className="location-action" onClick={requestLocation} disabled={locationBusy} aria-label="Use current location" title="Use current location"><LocateFixed size={19} /></button>
        </label>
        <label className="booking-field">
          <span className="field-symbol drop-symbol" aria-hidden="true" />
          <span className="field-copy"><span className="field-label">DESTINATION</span><input list="rishiride-destinations" value={dropoff} onChange={(event) => setDropoff(event.target.value)} placeholder="Where do you want to go?" autoComplete="off" /><datalist id="rishiride-destinations">{destinations.map((place) => <option key={place.slug} value={place.name} />)}</datalist></span>
          <ChevronDown size={18} className="field-chevron" />
        </label>
      </div>
      <button type="button" className="location-text-action" onClick={requestLocation} disabled={locationBusy}><LocateFixed size={15} />{locationBusy ? 'Finding pickup…' : 'Use current location'}</button>
      {notice && <p className="form-notice" role="alert">{notice}</p>}
      <div className="booking-controls">
        <div className="party-control">
          <span className="field-label">GROUP</span>
          <div className="stepper"><button type="button" aria-label="Remove passenger" onClick={() => setPartySize((size) => Math.max(1, size - 1))}>−</button><span aria-live="polite">{partySize}</span><button type="button" aria-label="Add passenger" onClick={() => setPartySize((size) => Math.min(6, size + 1))}>+</button></div>
        </div>
        <div className="vehicle-indicator"><span className="vehicle-icon"><Navigation size={16} /></span><span><span className="field-label">VEHICLE</span><strong>{vehicle}</strong></span></div>
        <button type="submit" className="book-submit">Check availability <ArrowRight size={16} /></button>
      </div>
      <p className="booking-fineprint"><ShieldCheck size={14} /> Requests are not sent until secure booking is available.</p>
    </form>
  );
}

function DestinationsPage() {
  const [query, setQuery] = useState('');
  const filtered = destinations.filter((place) => `${place.name} ${place.category}`.toLowerCase().includes(query.trim().toLowerCase()));
  return (
    <div className="page-wrap inner-page">
      <div className="page-topline"><span>RISHIRIDE ATLAS</span><span>30°06′ N · 78°18′ E</span></div>
      <div className="page-title-row"><div><p className="eyebrow">THE PLACES AROUND US</p><h1>Rishikesh, <em>in places.</em></h1><p className="page-deck">Landmarks and river-side stops. Verified details are shown where available.</p></div><div className="place-total"><strong>{destinations.length.toString().padStart(2, '0')}</strong><span>PLACES</span></div></div>
      <div className="destination-toolbar"><label className="search-box"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find a place" aria-label="Search destinations" />{query && <button aria-label="Clear search" onClick={() => setQuery('')}><X size={15} /></button>}</label><span className="verified-note"><span /> OPENSTREETMAP + WIKIMEDIA COMMONS</span></div>
      {filtered.length ? <div className="destination-grid">{filtered.map((place, index) => <DestinationCard key={place.slug} destination={place} index={index} />)}</div> : <div className="empty-state"><Search size={23} /><h2>No places match that search.</h2><button onClick={() => setQuery('')}>Clear search</button></div>}
      <p className="data-note">Place pins, descriptions, ratings, and reviews are displayed only when a source confirms them. Map coordinates are not shown as a substitute for a place name.</p>
    </div>
  );
}

function DestinationCard({ destination, index }: { destination: Destination; index: number }) {
  return (
    <article className={`destination-card destination-card-${index % 3}`}>
      <Link to={`/destinations/${destination.slug}`} aria-label={`${destination.name}, ${destination.category}`}>
        <div className="destination-image">
          {destination.photoUrl ? <img src={destination.photoUrl} alt={`${destination.name}, Rishikesh`} loading="lazy" /> : <div className="image-empty"><Compass size={25} /><span>PHOTO NOT AVAILABLE</span></div>}
          <span className="photo-number">{String(index + 1).padStart(2, '0')}</span>
          <span className="card-open"><ArrowUpRight size={17} /></span>
        </div>
        <div className="destination-card-copy"><div><span className="category-label">{destination.category}</span><h2>{destination.name}</h2></div><span className="location-status">{destination.latitude !== null ? <><MapPin size={13} /> PIN VERIFIED</> : 'DETAILS PENDING'}</span></div>
      </Link>
      {destination.photoSource && <a className="image-source" href={destination.photoSource} target="_blank" rel="noreferrer" aria-label={`View image source: ${destination.photoSourceName}`}>IMAGE SOURCE · COMMONS</a>}
    </article>
  );
}

function DestinationPage() {
  const { slug } = useParams();
  const place = destinations.find((candidate) => candidate.slug === slug);
  if (!place) return <NotFoundPage />;
  return (
    <div className="page-wrap inner-page detail-page">
      <Link to="/destinations" className="back-link"><ArrowLeft size={15} /> All places</Link>
      <div className="detail-grid">
        <div className="detail-photo">{place.photoUrl ? <img src={place.photoUrl} alt={`${place.name}, Rishikesh`} /> : <div className="image-empty"><Compass size={27} /><span>PHOTO NOT AVAILABLE</span></div>}{place.photoSource && <a href={place.photoSource} target="_blank" rel="noreferrer" className="photo-credit">IMAGE: {place.photoSourceName?.toUpperCase()} <ArrowUpRight size={12} /></a>}</div>
        <div className="detail-copy"><p className="eyebrow">{place.category.toUpperCase()} · RISHIKESH</p><h1>{place.name}</h1><p className="detail-description">{place.description ?? 'A verified description is not available yet.'}</p><dl className="detail-facts"><div><dt>LOCATION</dt><dd>{place.latitude !== null && place.longitude !== null ? 'Mapped pin confirmed' : 'Location pin not verified'}</dd></div><div><dt>RATING</dt><dd>{place.rating === null ? 'No verified rating' : `${place.rating} / 5`}</dd></div><div><dt>REVIEWS</dt><dd>{place.reviews === null ? 'No verified reviews' : place.reviews}</dd></div></dl>{place.latitude !== null && <p className="pin-caption"><MapPin size={15} /> Place name verified via OpenStreetMap <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">Attribution</a></p>}<Link className="book-place" to={`/?destination=${encodeURIComponent(place.name)}`}>Set as destination <ArrowRight size={16} /></Link></div>
      </div>
    </div>
  );
}

type WebOtpState = {
  mode: 'sign-in' | 'sign-up';
  role: 'passenger' | 'driver';
  mobile: string;
  sessionId: string;
  developmentOtp?: string;
  preferredLanguage: 'en' | 'hi';
};

async function readApiError(response: Response, fallback: string): Promise<string> {
  try {
    const payload: unknown = await response.json();
    if (typeof payload === 'object' && payload !== null && 'error' in payload && typeof payload.error === 'object' && payload.error !== null && 'message' in payload.error && typeof payload.error.message === 'string') {
      return payload.error.message;
    }
  } catch {
    return fallback;
  }
  return fallback;
}

function AccountPage({ mode }: { mode: 'sign-in' | 'sign-up' }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [role, setRole] = useState<'passenger' | 'driver'>(searchParams.get('role') === 'driver' ? 'driver' : 'passenger');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState<'en' | 'hi'>('en');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const isSignUp = mode === 'sign-up';
  const roleName = role === 'passenger' ? 'Passenger' : 'Driver';

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');
    if (!apiBase) {
      setMessage('Phone verification is not configured for this web build. No account was created and no code was sent.');
      return;
    }
    if (isSignUp && (!termsAccepted || !privacyAccepted)) {
      setMessage('Accept both the Terms of Service and Privacy Policy to create an account.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${apiBase}/auth/${isSignUp ? 'signup' : 'login'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isSignUp
          ? { name: name.trim(), mobile, role, preferredLanguage, termsAccepted: true, privacyAccepted: true }
          : { mobile, role }),
      });
      if (!response.ok) throw new Error(await readApiError(response, 'Unable to start phone verification.'));
      const payload: unknown = await response.json();
      if (typeof payload !== 'object' || payload === null || !('sessionId' in payload) || typeof payload.sessionId !== 'string' || !payload.sessionId || !('mobile' in payload) || typeof payload.mobile !== 'string' || !('role' in payload) || (payload.role !== 'passenger' && payload.role !== 'driver')) {
        throw new Error('The authentication service returned an invalid verification session.');
      }
      navigate('/verify', { state: {
        mode,
        role: payload.role,
        mobile: payload.mobile,
        sessionId: payload.sessionId,
        preferredLanguage,
        ...('developmentOtp' in payload && typeof payload.developmentOtp === 'string' ? { developmentOtp: payload.developmentOtp } : {}),
      } satisfies WebOtpState });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to start phone verification.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="account-page">
      <div className="account-aside">
        <Link to="/" className="brand brand-light"><span className="brand-icon"><Navigation size={20} /></span><span className="brand-word">Rishi<span>Ride</span></span></Link>
        <div className="account-aside-copy"><span>RISHIKESH, INDIA</span><p>Local journeys,<br /><em>one clear step at a time.</em></p><small>Phone verification is required before account access.</small></div>
        <div className="account-aside-image"><img src={destinations[3].photoUrl ?? ''} alt="Ram Jhula footbridge over the Ganges" /></div>
      </div>
      <section className="account-content">
        <Link to="/" className="back-link"><ArrowLeft size={15} /> Back to RishiRide</Link>
        <div className="account-form-wrap">
          <p className="eyebrow">{isSignUp ? 'CREATE AN ACCOUNT' : 'WELCOME BACK'}</p>
          <h1>{isSignUp ? 'Start with your phone.' : 'Sign in with your phone.'}</h1>
          <p className="account-subtitle">We’ll send a one-time code by SMS. No password needed.</p>
          <div className="role-toggle" role="group" aria-label="Account type">
            <button type="button" className={role === 'passenger' ? 'selected' : ''} onClick={() => setRole('passenger')}><span className="role-initial">P</span> Passenger</button>
            <button type="button" className={role === 'driver' ? 'selected' : ''} onClick={() => setRole('driver')}><span className="role-initial">D</span> Driver</button>
          </div>
          <form className="account-form" onSubmit={submit}>
            {isSignUp && <label>Full name<input required autoComplete="name" maxLength={120} value={name} onChange={(event) => setName(event.target.value)} placeholder="Your legal name" /></label>}
            <label>Mobile number<input required type="tel" inputMode="numeric" autoComplete="tel-national" pattern="[0-9]{10}" maxLength={10} value={mobile} onChange={(event) => setMobile(event.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="10-digit Indian mobile number" /></label>
            {isSignUp && <>
              <fieldset className="language-choice"><legend>Preferred language</legend><button type="button" className={preferredLanguage === 'hi' ? 'selected' : ''} onClick={() => setPreferredLanguage('hi')}>हिन्दी</button><button type="button" className={preferredLanguage === 'en' ? 'selected' : ''} onClick={() => setPreferredLanguage('en')}>English</button></fieldset>
              <label className="consent-check"><input type="checkbox" checked={termsAccepted} onChange={(event) => setTermsAccepted(event.target.checked)} /><span>I accept the <Link to="/terms">Terms of Service</Link>.</span></label>
              <label className="consent-check"><input type="checkbox" checked={privacyAccepted} onChange={(event) => setPrivacyAccepted(event.target.checked)} /><span>I have read and accept the <Link to="/privacy">Privacy Policy</Link>.</span></label>
            </>}
            {message && <p className="form-notice account-notice" role="alert">{message}</p>}
            <button className="account-submit" type="submit" disabled={loading || (isSignUp && (!termsAccepted || !privacyAccepted))}>{loading ? 'Contacting SMS service…' : isSignUp ? `Create ${roleName.toLowerCase()} account` : `Continue as ${roleName.toLowerCase()}`}<ArrowRight size={16} /></button>
          </form>
          <p className="switch-account">{isSignUp ? 'Already registered?' : 'New to RishiRide?'} <Link to={isSignUp ? '/sign-in' : '/sign-up'}>{isSignUp ? 'Sign in' : 'Create an account'}</Link></p>
          <p className="auth-privacy"><ShieldCheck size={14} />{role === 'passenger' ? 'Passenger signup does not ask for driving documents or Aadhaar.' : 'Driver accounts remain pending until required checks and admin review are complete.'}</p>
        </div>
      </section>
    </div>
  );
}

function VerifyPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const initial = location.state as WebOtpState | null;
  const [session, setSession] = useState<WebOtpState | null>(initial);
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);

  if (!session) {
    return <div className="page-wrap verify-missing"><p className="eyebrow">VERIFICATION SESSION ENDED</p><h1>Start again from your phone number.</h1><Link className="book-place" to="/sign-in">Back to sign in <ArrowRight size={16} /></Link></div>;
  }

  const verify = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!apiBase) return setMessage('Phone verification is not configured. No code was checked.');
    setMessage('');
    setLoading(true);
    try {
      const response = await fetch(`${apiBase}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: session.sessionId, mobile: session.mobile, otp }),
      });
      if (!response.ok) throw new Error(await readApiError(response, response.status === 401 ? 'The code is incorrect, expired or already used.' : 'Phone verification is temporarily unavailable.'));
      const payload: unknown = await response.json();
      if (typeof payload !== 'object' || payload === null || !('verified' in payload) || payload.verified !== true || !('token' in payload) || typeof payload.token !== 'string' || !payload.token) throw new Error('The verification service returned an invalid response.');
      setVerified(true);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to verify this code.');
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    if (!apiBase) return setMessage('Phone verification is not configured. No new code was sent.');
    setMessage('');
    setLoading(true);
    try {
      const response = await fetch(`${apiBase}/auth/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: session.sessionId, mobile: session.mobile }),
      });
      if (!response.ok) throw new Error(await readApiError(response, 'Unable to resend the code.'));
      const payload: unknown = await response.json();
      if (typeof payload !== 'object' || payload === null || !('sessionId' in payload) || typeof payload.sessionId !== 'string' || !payload.sessionId) throw new Error('The verification service returned an invalid response.');
      setSession({ ...session, sessionId: payload.sessionId, ...('developmentOtp' in payload && typeof payload.developmentOtp === 'string' ? { developmentOtp: payload.developmentOtp } : {}) });
      setOtp('');
      setMessage('A new code was sent.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to resend the code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="account-page verify-page">
      <div className="account-aside">
        <Link to="/" className="brand brand-light"><span className="brand-icon"><Navigation size={20} /></span><span className="brand-word">Rishi<span>Ride</span></span></Link>
        <div className="account-aside-copy"><span>PHONE VERIFICATION</span><p>{verified ? 'Number verified.' : 'One code, then you’re in.'}</p><small>Codes are sent by the configured SMS verification service.</small></div>
        <div className="account-aside-image"><img src={destinations[0].photoUrl ?? ''} alt="Evening lamps at Triveni Ghat, Rishikesh" /></div>
      </div>
      <section className="account-content">
        <button className="back-link back-button" onClick={() => navigate(-1)}><ArrowLeft size={15} /> Back</button>
        <div className="account-form-wrap">
          <p className="eyebrow">{verified ? 'VERIFIED' : 'SMS CODE'}</p>
          <h1>{verified ? 'Your number is verified.' : 'Check your messages.'}</h1>
          <p className="account-subtitle">{verified ? 'This browser does not store authentication tokens. Continue in the RishiRides mobile app to use your account.' : `Enter the 6-digit code sent to ******${session.mobile.slice(-4)}.`}</p>
          {!verified && session.developmentOtp && <p className="form-notice">Development OTP: {session.developmentOtp}</p>}
          {!verified && <form className="account-form" onSubmit={verify}>
            <label>6-digit code<input required inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="000000" /></label>
            {message && <p className="form-notice account-notice" role="alert">{message}</p>}
            <button className="account-submit" type="submit" disabled={loading}>{loading ? 'Verifying…' : 'Verify phone'}<ArrowRight size={16} /></button>
          </form>}
          {!verified && <button className="resend-button" onClick={() => void resend()} disabled={loading}>Resend code</button>}
          {verified && <div className="verified-next"><ShieldCheck size={18} /><span>{session.role === 'driver' ? 'Your driver application remains pending until all applicable checks and admin review are complete.' : 'No driving licence or Aadhaar is required for ordinary passenger signup.'}</span></div>}
          <Link className="switch-account" to="/">Return to RishiRide</Link>
        </div>
      </section>
    </div>
  );
}

function FaqPage() {
  const items = [
    ['Can I book a ride right now?', 'Not yet. Secure booking and driver matching are not configured, so no ride request can be sent from this preview.'],
    ['Which vehicle will suit my group?', 'The app selects an E-rickshaw for groups of up to three and a CNG auto-rickshaw for larger groups.'],
    ['Do you need my location?', 'Only if you choose Use current location. If you decline, you can enter a pickup manually.'],
    ['Where do destination details come from?', 'Place photos link to their Wikimedia Commons source. Pins and other details are shown only when verified.'],
  ];
  return <div className="page-wrap inner-page faq-page"><p className="eyebrow">GOOD TO KNOW</p><h1>Frequently asked<br /><em>questions.</em></h1><div className="faq-list">{items.map(([question, answer], index) => <details key={question} open={index === 0}><summary><span className="faq-index">0{index + 1}</span>{question}<ChevronDown size={17} /></summary><p>{answer}</p></details>)}</div></div>;
}

function InfoPage({ title, eyebrow, body }: { title: string; eyebrow: string; body: string }) {
  return <div className="page-wrap inner-page info-page"><span className="eyebrow">{eyebrow}</span><h1>{title.split(' ').slice(0, -1).join(' ')} <em>{title.split(' ').slice(-1)}</em></h1><p className="page-deck">{body}</p><Link className="text-link" to="/">Return to ride booking <ArrowRight size={15} /></Link></div>;
}

function NotFoundPage() {
  return <div className="page-wrap inner-page not-found"><span className="eyebrow">OFF THE MAP</span><h1>This stop<br /><em>isn’t on our route.</em></h1><Link className="book-place" to="/">Back to RishiRide <ArrowRight size={16} /></Link></div>;
}

function SiteFooter() {
  return <footer className="site-footer"><div className="footer-inner"><Link to="/" className="brand"><span className="brand-icon"><Navigation size={18} /></span><span className="brand-word">Rishi<span>Ride</span></span></Link><span className="footer-note">A LOCAL RIDE THROUGH RISHIKESH</span><div className="footer-links"><Link to="/about">About</Link><Link to="/terms">Terms</Link><Link to="/privacy">Privacy</Link></div><span className="copyright">© 2026 RishiRide</span></div></footer>;
}