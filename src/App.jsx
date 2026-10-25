import { useState } from 'react';
import {
  Plane, MapPin, CalendarDays, Users, Accessibility, Check,
  ChevronLeft, ChevronRight, CircleCheck, Luggage, RotateCcw
} from 'lucide-react';
import './App.css';

const STEPS = [
  { id: 1, displayText: 'Your Details', icon: MapPin },
  { id: 2, displayText: 'Date Selection', icon: CalendarDays },
  { id: 3, displayText: 'Guests', icon: Users },
  { id: 4, displayText: 'Travel Assistance', icon: Accessibility },
  { id: 5, displayText: 'Confirmation', icon: Check },
];

const INITIAL_DETAILS = { name: '', startLocation: '', endLocation: '' };
const INITIAL_DATES = { startDate: '', endDate: '' };
const INITIAL_GUESTS = { adults: 1, children: 0, infants: 0 };

function Stepper({ currentStep }) {
  return (
    <ol className="stepper" aria-label="Trip booking progress">
      {STEPS.map((step, index) => {
        const complete = currentStep > step.id;
        const active = currentStep === step.id;
        const Icon = step.icon;
        return (
          <li className={`step ${active ? 'active' : ''} ${complete ? 'complete' : ''}`} key={step.id}>
            <div className="step-marker">
              {complete ? (
                <img
                  src="https://assets.ccbp.in/frontend/react-js/travel-trip-steps-successfully-completed-img.png"
                  alt={step.displayText}
                />
              ) : <Icon size={18} aria-hidden="true" />}
            </div>
            <span className="step-label">{step.displayText}</span>
            {index < STEPS.length - 1 && <span className={`step-line ${complete ? 'filled' : ''}`} />}
          </li>
        );
      })}
    </ol>
  );
}

function Field({ label, id, error, ...props }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input id={id} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} {...props} />
      {error && <p className="error" id={`${id}-error`}>{error}</p>}
    </div>
  );
}

function YourDetails({ details, setDetails, onNext }) {
  const [errors, setErrors] = useState({});
  const update = (key, value) => {
    setDetails(previous => ({ ...previous, [key]: value }));
    setErrors(previous => ({ ...previous, [key]: '' }));
  };
  const submit = event => {
    event.preventDefault();
    const nextErrors = {};
    if (!details.name.trim()) nextErrors.name = 'Enter your name';
    if (!details.startLocation.trim()) nextErrors.startLocation = 'Enter your start location';
    if (!details.endLocation.trim()) nextErrors.endLocation = 'Enter your end location';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) onNext();
  };
  return (
    <form onSubmit={submit} noValidate>
      <div className="section-heading">
        <span className="section-icon"><MapPin size={21} /></span>
        <div><h2>Your Details</h2><p>Let's start with a few details about your trip.</p></div>
      </div>
      <div className="fields-grid">
        <Field label="Name" id="name" placeholder="Enter your full name" autoComplete="name" value={details.name} error={errors.name} onChange={e => update('name', e.target.value)} />
        <Field label="Start Location" id="start-location" placeholder="Where are you starting from?" value={details.startLocation} error={errors.startLocation} onChange={e => update('startLocation', e.target.value)} />
        <Field label="End Location" id="end-location" placeholder="Where would you like to go?" value={details.endLocation} error={errors.endLocation} onChange={e => update('endLocation', e.target.value)} />
      </div>
      <div className="form-footer right"><button className="btn primary" type="submit">Next <ChevronRight size={18} /></button></div>
    </form>
  );
}

function DateSelection({ dates, setDates, onNext, onPrevious }) {
  const [errors, setErrors] = useState({});
  const update = (key, value) => {
    setDates(previous => ({ ...previous, [key]: value }));
    setErrors(previous => ({ ...previous, [key]: '', dateOrder: '' }));
  };
  const submit = event => {
    event.preventDefault();
    const nextErrors = {};
    if (!dates.startDate) nextErrors.startDate = 'Select start date';
    if (!dates.endDate) nextErrors.endDate = 'Select end date';
    if (dates.startDate && dates.endDate && dates.endDate < dates.startDate) {
      nextErrors.dateOrder = 'The end date cannot be less than the start date';
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) onNext();
  };
  return (
    <form onSubmit={submit} noValidate>
      <div className="section-heading">
        <span className="section-icon"><CalendarDays size={21} /></span>
        <div><h2>Date Selection</h2><p>When would you like to travel?</p></div>
      </div>
      <div className="fields-grid two">
        <Field label="Start Date" id="start-date" type="date" value={dates.startDate} error={errors.startDate} onChange={e => update('startDate', e.target.value)} />
        <Field label="End Date" id="end-date" type="date" min={dates.startDate || undefined} value={dates.endDate} error={errors.endDate} onChange={e => update('endDate', e.target.value)} />
      </div>
      {errors.dateOrder && <p className="error date-error">{errors.dateOrder}</p>}
      <div className="form-footer"><button className="btn secondary" type="button" onClick={onPrevious}><ChevronLeft size={18} /> Previous</button><button className="btn primary" type="submit">Next <ChevronRight size={18} /></button></div>
    </form>
  );
}

function GuestCounter({ label, description, value, minimum, onChange }) {
  return (
    <div className="guest-row">
      <div><h3>{label}</h3><p>{description}</p></div>
      <div className="counter">
        <button type="button" aria-label={`Decrease ${label}`} disabled={value <= minimum} onClick={() => onChange(Math.max(minimum, value - 1))}>−</button>
        <output aria-label={`${label} count`}>{value}</output>
        <button type="button" aria-label={`Increase ${label}`} onClick={() => onChange(value + 1)}>+</button>
      </div>
    </div>
  );
}

function Guests({ guests, setGuests, onNext, onPrevious }) {
  const update = (key, value) => setGuests(previous => ({ ...previous, [key]: value }));
  return (
    <div>
      <div className="section-heading">
        <span className="section-icon"><Users size={21} /></span>
        <div><h2>Who's travelling?</h2><p>Tell us how many people are joining the trip.</p></div>
      </div>
      <div className="guest-list">
        <GuestCounter label="Adults" description="Age 18 or above" value={guests.adults} minimum={1} onChange={v => update('adults', v)} />
        <GuestCounter label="Children" description="Age 2–17" value={guests.children} minimum={0} onChange={v => update('children', v)} />
        <GuestCounter label="Infants" description="Under 2 years" value={guests.infants} minimum={0} onChange={v => update('infants', v)} />
      </div>
      <div className="form-footer"><button className="btn secondary" type="button" onClick={onPrevious}><ChevronLeft size={18} /> Previous</button><button className="btn primary" type="button" onClick={onNext}>Next <ChevronRight size={18} /></button></div>
    </div>
  );
}

function TravelAssistance({ assistance, setAssistance, onNext, onPrevious }) {
  return (
    <div>
      <div className="section-heading">
        <span className="section-icon"><Accessibility size={21} /></span>
        <div><h2>Travel Assistance</h2><p>Let us know if you need any additional support.</p></div>
      </div>
      <div className="assistance-card">
        <label className="check-row">
          <input type="checkbox" checked={assistance.needed} onChange={e => setAssistance(previous => ({ ...previous, needed: e.target.checked, option: e.target.checked ? previous.option : '' }))} />
          <span><strong>Travel assistance needed</strong><small>Request support during your journey.</small></span>
        </label>
        {assistance.needed && (
          <div className="field assistance-select">
            <label htmlFor="assistance-option">Travel Assistance</label>
            <select id="assistance-option" value={assistance.option} onChange={e => setAssistance(previous => ({ ...previous, option: e.target.value }))}>
              <option value="">Select an option</option>
              <option value="Wheelchair assistance">Wheelchair assistance</option>
              <option value="Help with boarding">Help with boarding</option>
              <option value="Visual or hearing assistance">Visual or hearing assistance</option>
              <option value="Other assistance">Other assistance</option>
            </select>
          </div>
        )}
      </div>
      <div className="form-footer"><button className="btn secondary" type="button" onClick={onPrevious}><ChevronLeft size={18} /> Previous</button><button className="btn primary" type="button" onClick={onNext}>Review Trip <ChevronRight size={18} /></button></div>
    </div>
  );
}

function SummaryRow({ label, value }) {
  return <div className="summary-row"><span>{label}</span><strong>{value || '—'}</strong></div>;
}

function Confirmation({ details, dates, guests, assistance, onPrevious, onCancel, onConfirm }) {
  const formatDate = value => {
    if (!value) return '—';
    return new Date(`${value}T00:00:00`).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
  };
  return (
    <div>
      <div className="section-heading">
        <span className="section-icon"><Check size={21} /></span>
        <div><h2>Review your trip</h2><p>Check all your details before confirming.</p></div>
      </div>
      <div className="summary-card">
        <div className="summary-group"><h3><MapPin size={17} /> Your Details</h3><SummaryRow label="Name" value={details.name} /><SummaryRow label="Start Location" value={details.startLocation} /><SummaryRow label="End Location" value={details.endLocation} /></div>
        <div className="summary-group"><h3><CalendarDays size={17} /> Dates</h3><SummaryRow label="Start Date" value={formatDate(dates.startDate)} /><SummaryRow label="End Date" value={formatDate(dates.endDate)} /></div>
        <div className="summary-group"><h3><Users size={17} /> Guests</h3><SummaryRow label="Adults" value={guests.adults} /><SummaryRow label="Children" value={guests.children} /><SummaryRow label="Infants" value={guests.infants} /></div>
        <div className="summary-group"><h3><Accessibility size={17} /> Travel Assistance</h3><SummaryRow label="Needed" value={assistance.needed ? 'Yes' : 'No'} />{assistance.needed && <SummaryRow label="Type" value={assistance.option || 'Not selected'} />}</div>
      </div>
      <div className="form-footer wrap"><button className="btn secondary" type="button" onClick={onPrevious}><ChevronLeft size={18} /> Previous</button><div className="action-group"><button className="btn danger-outline" type="button" onClick={onCancel}>Cancel</button><button className="btn primary" type="button" onClick={onConfirm}>Confirm Trip <Check size={18} /></button></div></div>
    </div>
  );
}

function Confirmed({ onNewTrip }) {
  return (
    <div className="confirmed">
      <div className="success-art">
        <img src="https://assets.ccbp.in/frontend/react-js/travel-trip-steps-successfully-completed-img.png" alt="success" />
      </div>
      <h2>Your trip is confirmed!</h2>
      <p>Everything is all set. Get ready for your next adventure.</p>
      <button className="btn primary" type="button" onClick={onNewTrip}><RotateCcw size={18} /> Book New Trip</button>
    </div>
  );
}

export default function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [details, setDetails] = useState(INITIAL_DETAILS);
  const [dates, setDates] = useState(INITIAL_DATES);
  const [guests, setGuests] = useState(INITIAL_GUESTS);
  const [assistance, setAssistance] = useState({ needed: false, option: '' });
  const [confirmed, setConfirmed] = useState(false);

  const resetTrip = () => {
    setDetails({ ...INITIAL_DETAILS });
    setDates({ ...INITIAL_DATES });
    setGuests({ ...INITIAL_GUESTS });
    setAssistance({ needed: false, option: '' });
    setCurrentStep(1);
    setConfirmed(false);
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#" onClick={e => e.preventDefault()} aria-label="TravelMate home"><span className="brand-icon"><Plane size={21} /></span><span>travel<span className="brand-accent">mate</span></span></a>
        <span className="topbar-note"><Luggage size={17} /> Your next adventure starts here</span>
      </header>
      <section className="hero">
        <div className="hero-copy"><span className="eyebrow">YOUR JOURNEY, YOUR WAY</span><h1>Let's plan your next <em>adventure.</em></h1><p>A few simple steps stand between you and your next great memory.</p></div>
        <div className="hero-decoration" aria-hidden="true"><div className="sun" /><div className="mountain mountain-back" /><div className="mountain mountain-front" /><div className="cloud cloud-one" /><div className="cloud cloud-two" /></div>
      </section>
      <section className="booking-card">
        {!confirmed && <Stepper currentStep={currentStep} />}
        <div className="card-content">
          {confirmed ? <Confirmed onNewTrip={resetTrip} /> : (
            <>
              {currentStep === 1 && <YourDetails details={details} setDetails={setDetails} onNext={() => setCurrentStep(2)} />}
              {currentStep === 2 && <DateSelection dates={dates} setDates={setDates} onNext={() => setCurrentStep(3)} onPrevious={() => setCurrentStep(1)} />}
              {currentStep === 3 && <Guests guests={guests} setGuests={setGuests} onNext={() => setCurrentStep(4)} onPrevious={() => setCurrentStep(2)} />}
              {currentStep === 4 && <TravelAssistance assistance={assistance} setAssistance={setAssistance} onNext={() => setCurrentStep(5)} onPrevious={() => setCurrentStep(3)} />}
              {currentStep === 5 && <Confirmation details={details} dates={dates} guests={guests} assistance={assistance} onPrevious={() => setCurrentStep(4)} onCancel={resetTrip} onConfirm={() => setConfirmed(true)} />}
            </>
          )}
        </div>
      </section>
      <footer className="page-footer"><span>Made for memorable journeys</span><span>TravelMate <span aria-hidden="true">·</span> Trip Planner</span></footer>
    </main>
  );
}