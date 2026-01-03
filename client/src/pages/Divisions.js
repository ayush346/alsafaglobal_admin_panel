import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import './Divisions.css';

const Divisions = () => {
  const location = useLocation();

  // Scroll to specific section based on URL hash or query parameter
  useEffect(() => {
    const scrollToSection = () => {
      // Helper function to scroll with header offset
      const scrollToElementWithOffset = (element) => {
        if (element) {
          setTimeout(() => {
            // Calculate responsive header height based on screen size
            const isMobile = window.innerWidth <= 768;
            const headerHeight = isMobile ? 90 : 100; // Slightly less for mobile, more for desktop
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }, 100);
        }
      };

      // Check for hash in URL (e.g., #office-construction)
      const hash = location.hash;
      if (hash) {
        const element = document.querySelector(hash);
        scrollToElementWithOffset(element);
      }
      
      // Check for query parameter (e.g., ?section=office-construction)
      const urlParams = new URLSearchParams(location.search);
      const section = urlParams.get('section');
      if (section) {
        const element = document.getElementById(section);
        scrollToElementWithOffset(element);
      }
    };

    scrollToSection();
  }, [location]);

  const divisions = [
    {
      id: "office-construction",
      title: "Office, Construction & Infrastructure",
      description: "Comprehensive sourcing for building materials, tools, safety gear, MEP systems, IT hardware/software, and site essentials.",
      items: [
        "Office Stationery Supplies, General items and IT products including Hardware & Software",
        "Scaffolding systems, formwork materials",
        "Fasteners, anchors, power tools",
        "HVAC equipment, electrical panels, lighting systems",
        "Site safety gear, signage, traffic control devices",
        "Plumbing fixtures, cement additives, adhesives",
        "Tools, fixtures, and systems for structural and civil projects"
      ]
    },
    {
      id: "oil-gas",
      title: "Oil & Gas",
      description: "Supply chain solutions for drilling, production, maintenance, safety, and instrumentation needs (upstream & downstream).",
      items: [
        "Drilling equipment, pipes, valves, flanges",
        "Pressure gauges, flow meters, compressors",
        "Chemical injection systems, safety relief valves",
        "Pumps, control panels, welding consumables",
        "Fire suppression systems and rig safety gear",
        "Equipment and components for upstream and downstream operations"
      ]
    },
    {
      id: "industrial-manufacturing",
      title: "Industrial & Manufacturing",
      description: "Providing MRO supplies, automation components, PPE, bearings, motors, spare parts, and factory-grade consumables.",
      items: [
        "Maintenance, Repair & Operations (MRO) supplies",
        "Bearings, lubricants, motors, gearboxes",
        "PPE (gloves, helmets, suits, eyewear)",
        "Conveyor belts, belts & pulleys, machine parts",
        "Industrial automation sensors and controls",
        "MRO supplies, safety products, and factory-grade components",
        "Tyres and Automobile Spare parts"
      ]
    },
    
    {
      id: "aviation-marine",
      title: "Aviation, Marine & Shipping",
      description: "Sourcing engine parts, navigation equipment, deck machinery, safety gear, paints, coatings, and vessel maintenance items.",
      items: [
        "Ship engine parts, navigation equipment",
        "Mooring ropes, anodes, marine paints & coatings",
        "Pumps, valves, pipe fittings, hatch covers",
        "Firefighting equipment, life rafts, inflatable boats",
        "Galley equipment, lighting, deck machinery",
        "Marine spare parts, tools, and ship supplies",
        "Aviation spare parts, filters and grease"
      ]
    },
    {
      id: "defence-sector",
      title: "Defence Sector",
      description: "Discreet and reliable sourcing of tactical gear, technical equipment, uniforms, field supplies, and maintenance parts for military/government entities.",
      items: [
        "Tactical gear, uniforms, helmets, boots",
        "Surveillance systems, communication radios",
        "Portable shelters, generators, field equipment",
        "Tools and test kits for maintenance",
        "Supply of spares for land, naval, and air units",
        "Tactical, technical, and general supplies for government and military entities"
      ]
    }
  ];

  return (
    <div className="divisions-page">
      {/* Hero Section */}
      <section className="divisions-hero">
        <div className="container">
          <motion.div 
            className="divisions-hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="gradient-text">
              <span className="gold-text">Al Safa Global</span> Segments
            </h1>

            <p>
              We provide comprehensive procurement and supply chain solutions across multiple industries, 
              ensuring our clients receive the highest quality products and services tailored to their 
              specific sector requirements.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Divisions Content */}
      <section className="divisions-content">
        <div className="container">
          {divisions.map((division, index) => (
            <motion.div
              key={division.title}
              id={division.id}
              className="division-section"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="division-header">
                <h2>{division.title}</h2>
                <p className="division-description">{division.description}</p>
              </div>
              
              <div className="division-items-container">
                <h3>Our Products & Services Include:</h3>
                <ul className="division-items">
                  {division.items.map((item, itemIndex) => (
                    <motion.li 
                      key={itemIndex}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: itemIndex * 0.1 }}
                      viewport={{ once: true }}
                    >
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Additional Information */}
      <section className="divisions-info">
        <div className="container">
          <motion.div 
            className="info-content"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2>Why Choose Us?</h2>
            <div className="info-grid">
              <div className="info-item">
                <h3>Specialized Expertise</h3>
                <p>Each division is staffed with industry experts who understand the unique requirements and challenges of their respective sectors.</p>
              </div>
              <div className="info-item">
                <h3>Quality Assurance</h3>
                <p>We maintain rigorous quality control standards and source only from reputable manufacturers and suppliers.</p>
              </div>
              <div className="info-item">
                <h3>Comprehensive Solutions</h3>
                <p>From initial procurement to final delivery, we provide end-to-end solutions tailored to your specific needs.</p>
              </div>
              <div className="info-item">
                <h3>Global Network</h3>
                <p>Our extensive network of suppliers and partners enables us to source the best products at competitive prices.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Divisions; 