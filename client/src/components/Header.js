import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiChevronDown } from 'react-icons/fi';
import { client } from '../sanityClient';
import { segmentsPageQuery } from '../queries/segmentsPageQuery';
import { productsPageQuery } from '../queries/productsPageQuery';
import useContent from '../hooks/useContent';
import './Header.css';

const slugify = (s) =>
  (s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'segment';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [segmentsDropdownOpen, setSegmentsDropdownOpen] = useState(false);
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false);
  const [segments, setSegments] = useState([]);
  const [products, setProducts] = useState([]);
  const location = useLocation();

  const { data: productsCms } = useContent(productsPageQuery);

  useEffect(() => {
    // Fetch segments for Segments dropdown (unchanged behavior)
    client.fetch(segmentsPageQuery).then((data) => {
      const list = (data?.segments || [])
        .filter((s) => s?.enabled !== false)
        .map((s) => ({
          title: s?.title || '',
          slug: s?.slug ? String(s.slug).trim() || slugify(s?.title) : slugify(s?.title)
        }))
        .filter((s) => s.title && s.slug);
      setSegments(list);
    });
  }, []);

  useEffect(() => {
    // Populate products from CMS via useContent
    const list = (productsCms?.products || [])
      .filter((p) => p?.enabled !== false)
      .map((p) => ({
        title: p?.title || '',
        slug: p?.slug ? String(p.slug).trim() || slugify(p?.title) : slugify(p?.title)
      }))
      .filter((p) => p.title && p.slug);
    setProducts(list);
  }, [productsCms]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Segments', path: '/divisions', isDropdown: true },
    { name: 'Products', path: '/products', isDropdown: true },
    { name: 'Contact', path: '/contact' }
  ];

  const isActive = (path) => location.pathname === path;

  const handleAdmin = async () => {
    const pwd = window.prompt("Enter Admin Password:");

    if (!pwd) return;

    if (pwd !== process.env.REACT_APP_ADMIN_PASSWORD) {
      alert("Incorrect Password 😐");
      return;
    }

    const choice = window.prompt(
      "Type one option:\n\n1 = CMS\n2 = Analytics"
    );

    if (!choice) return;

    if (choice === "1") {
      const url = process.env.REACT_APP_SANITY_STUDIO_URL;
      if (url) window.location.href = url;
      else alert("CMS URL not configured");
    }

    if (choice === "2") {
      const url = process.env.REACT_APP_ANALYTICS_URL;
      if (url) window.location.href = url;
      else alert("Analytics URL not configured");
    }
  };

  return (
    <motion.header 
      className={`header ${isScrolled ? 'scrolled' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="container">
        <div className="header-content">
          {/* Logo */}
          <motion.div 
            className="logo"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/">
              <div className="logo-container">
                <div className="logo-icon">
                  <img 
                    src={process.env.PUBLIC_URL + "/images/logo.png"} 
                    alt="Al Safa Global Logo" 
                    className="logo-image"
                    onLoad={() => console.log('Logo loaded successfully')}
                    onError={(e) => {
                      console.error('Error loading logo:', e);
                      console.error('Attempted URL:', process.env.PUBLIC_URL + "/images/logo.png");
                    }}
                  />
                </div>
                <div className="logo-text-container">
                  <span className="company-name">Al Safa Global</span>
                  <span className="company-tagline">General Trading FZ LLC</span>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="nav-desktop">
            <ul className="nav-list">
              {navItems.map((item, index) => (
                <motion.li
                  key={item.name}
                  className={`nav-item ${item.isDropdown ? 'nav-item-dropdown' : ''}`}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onMouseEnter={() => {
                    if (!item.isDropdown) return;
                    if (item.name === 'Segments') setSegmentsDropdownOpen(true);
                    if (item.name === 'Products') setProductsDropdownOpen(true);
                  }}
                  onMouseLeave={() => {
                    if (!item.isDropdown) return;
                    if (item.name === 'Segments') setSegmentsDropdownOpen(false);
                    if (item.name === 'Products') setProductsDropdownOpen(false);
                  }}
                >
                  {item.isDropdown ? (
                    <>
                      <Link
                        to={item.path}
                        className={`nav-link nav-link-trigger ${isActive(item.path) ? 'active' : ''}`}
                      >
                        {item.name}
                        <FiChevronDown className={`nav-chevron ${(item.name === 'Segments' ? segmentsDropdownOpen : productsDropdownOpen) ? 'open' : ''}`} />
                      </Link>
                      {/* Segments dropdown */}
                      {item.name === 'Segments' && segments.length > 0 && (
                        <AnimatePresence>
                          {segmentsDropdownOpen && (
                            <motion.ul
                              className="nav-dropdown"
                              initial={{ opacity: 0, y: -8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -8 }}
                              transition={{ duration: 0.2 }}
                            >
                              {segments.map((seg) => (
                                <li key={seg.slug}>
                                  <Link to={`${item.path}#${seg.slug}`} className="nav-dropdown-link">
                                    {seg.title}
                                  </Link>
                                </li>
                              ))}
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      )}

                      {/* Products dropdown */}
                      {item.name === 'Products' && products.length > 0 && (
                        <AnimatePresence>
                          {productsDropdownOpen && (
                            <motion.ul
                              className="nav-dropdown"
                              initial={{ opacity: 0, y: -8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -8 }}
                              transition={{ duration: 0.2 }}
                            >
                              <li className="nav-dropdown-title">List of Products</li>
                              {products.map((prod) => (
                                <li key={prod.slug}>
                                  <Link to={`${item.path}#${prod.slug}`} className="nav-dropdown-link">
                                    {prod.title}
                                  </Link>
                                </li>
                              ))}
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      )}
                    </>
                  ) : (
                    <Link
                      to={item.path}
                      className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                    >
                      {item.name}
                    </Link>
                  )}
                </motion.li>
              ))}
              <motion.li 
                className="nav-item"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navItems.length * 0.1 }}
              >
                <button className="nav-link" onClick={handleAdmin}>
                  Admin
                </button>
              </motion.li>
            </ul>
          </nav>

          {/* CTA Button */}
          <motion.div 
            className="header-cta"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Link to="/quote" className="btn btn-primary">
              Get Quote
            </Link>
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button
            className="mobile-menu-btn"
            onClick={() => setIsOpen(!isOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FiX />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FiMenu />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="mobile-nav"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <nav className="nav-mobile">
                <ul className="mobile-nav-list">
                  {navItems.map((item, index) => (
                    <motion.li
                      key={item.name}
                      className="mobile-nav-item"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {item.isDropdown && item.name === 'Segments' && segments.length > 0 ? (
                        <div className="mobile-nav-segments">
                          <span className="mobile-nav-link mobile-nav-segments-label">{item.name}</span>
                          <ul className="mobile-nav-sublist">
                            {segments.map((seg) => (
                              <li key={seg.slug}>
                                <Link
                                  to={`${item.path}#${seg.slug}`}
                                  className="mobile-nav-sublink"
                                  onClick={() => setIsOpen(false)}
                                >
                                  {seg.title}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : item.isDropdown && item.name === 'Products' && products.length > 0 ? (
                        <div className="mobile-nav-segments">
                            <span className="mobile-nav-link mobile-nav-segments-label">{item.name}</span>
                            <ul className="mobile-nav-sublist">
                              <li className="mobile-dropdown-title">List of Products</li>
                              {products.map((prod) => (
                              <li key={prod.slug}>
                                <Link
                                  to={`${item.path}#${prod.slug}`}
                                    className="mobile-nav-sublink"
                                    onClick={() => setIsOpen(false)}
                                  >
                                    {prod.title}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                        </div>
                      ) : (
                        <Link
                          to={item.path}
                          className={`mobile-nav-link ${isActive(item.path) ? 'active' : ''}`}
                        >
                          {item.name}
                        </Link>
                      )}
                    </motion.li>
                  ))}
                  <motion.li 
                    className="mobile-nav-item"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: navItems.length * 0.1 }}
                  >
                    <button className="mobile-nav-link" onClick={handleAdmin}>
                      Admin
                    </button>
                  </motion.li>
                </ul>
                <motion.div 
                  className="mobile-cta"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Link to="/quote" className="btn btn-primary btn-large">
                    Get Quote
                  </Link>
                </motion.div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Header; 