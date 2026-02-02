import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { urlFor } from '../sanityClient';
import './EventBanner.css';

const ROTATE_INTERVAL_MS = 5000;

const EventBanner = ({ events = [] }) => {
  const enabledEvents = (events || []).filter((e) => e?.enabled === true);

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (enabledEvents.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % enabledEvents.length);
    }, ROTATE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [enabledEvents.length]);

  if (enabledEvents.length === 0) return null;

  const currentEvent = enabledEvents[activeIndex];
  const bgUrl = currentEvent?.background?.asset?.url
    ? urlFor(currentEvent.background).url()
    : null;

  const CtaButton = () => {
    const label = currentEvent?.ctaLabel;
    const link = currentEvent?.ctaLink;
    if (!label) return null;
    const content = (
      <>
        {label}
        <FiArrowRight />
      </>
    );
    if (link?.startsWith('http') || link?.startsWith('//')) {
      return (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="event-banner-cta"
        >
          {content}
        </a>
      );
    }
    const href = link || '#';
    if (href.startsWith('/') && href !== '#') {
      return (
        <Link to={href} className="event-banner-cta">
          {content}
        </Link>
      );
    }
    return (
      <a href={href} className="event-banner-cta">
        {content}
      </a>
    );
  };

  return (
    <section
      className="event-banner"
      aria-live="polite"
      aria-label="Event banner"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIndex}
          className="event-banner-slide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          <div
            className="event-banner-bg"
            style={
              bgUrl
                ? { backgroundImage: `url(${bgUrl})` }
                : { background: 'var(--gradient-primary)' }
            }
          />
          <div className="event-banner-overlay" />
          <div className="container event-banner-content">
            <div className="event-banner-text">
              {currentEvent?.title && (
                <h2 className="event-banner-title">{currentEvent.title}</h2>
              )}
              {currentEvent?.subtitle && (
                <p className="event-banner-subtitle">{currentEvent.subtitle}</p>
              )}
            </div>
            <div className="event-banner-actions">
              <CtaButton />
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      {enabledEvents.length > 1 && (
        <div className="event-banner-dots" aria-hidden="true">
          {enabledEvents.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`event-banner-dot ${i === activeIndex ? 'active' : ''}`}
              onClick={() => setActiveIndex(i)}
              aria-label={`Go to event ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default EventBanner;
