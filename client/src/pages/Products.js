import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import './Divisions.css';
import { client } from '../sanityClient';
import { productsPageQuery } from '../queries/productsPageQuery';
import { homePageQuery } from '../queries/homePageQuery';
import { highlightBrand } from '../components/BrandText';
import BrandText from '../components/BrandText';

const Products = () => {
  const location = useLocation();
  const [productsData, setProductsData] = useState(null);
  const [homeData, setHomeData] = useState(null);

  // Scroll to section on hash (first load, refresh, or in-page navigation)
  useEffect(() => {
    const hash = location.hash?.replace('#', '');
    if (!hash) return;

    const scrollToElement = () => {
      const el = document.getElementById(hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    const t = setTimeout(scrollToElement, 150);
    return () => clearTimeout(t);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    client.fetch(productsPageQuery).then(setProductsData);
    client.fetch(homePageQuery).then(setHomeData);
  }, []);

  const slugify = (s) =>
    (s || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'product';

  const productsFromCMS = productsData?.products
    ?.filter(p => p?.enabled !== false)
    ?.map((p, idx) => ({
      id: p?.id ? String(p.id).trim() : slugify(p?.title) + '-' + idx,
      title: p?.title || '',
      description: p?.description || '',
      servicesTitle: p?.servicesTitle || 'Our Products & Services Include:',
      items: (p?.services || [])
        .filter(s => s?.enabled !== false)
        .map(s => s?.text || '')
    }));

  const productsToRender = (productsFromCMS && productsFromCMS.length) ? productsFromCMS : [];

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
            <h1
              dangerouslySetInnerHTML={{
                __html: highlightBrand(
                  productsData?.heroTitle || 'Al Safa Global Products',
                  homeData?.brandText || 'Al Safa Global',
                  homeData?.brandColor
                )
              }}
            />

            {productsData?.intro?.length
              ? productsData.intro.map((p, i) => (
                  <p key={i}>{p?.children?.[0]?.text || ''}</p>
                ))
              : (
                <p>
                  Explore our product offerings across multiple industries, sourced and supplied to meet your specific needs.
                </p>
              )
            }
          </motion.div>
        </div>
      </section>

      {/* Products Content */}
      <section className="divisions-content">
        <div className="container">
          {productsToRender.map((product, index) => (
            <motion.div
              key={product.title}
              id={product.id}
              className="division-section"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="division-header">
                <h2>{product.title}</h2>
                <p className="division-description">{product.description}</p>
              </div>
              
              <div className="division-items-container">
                <h3>{product.servicesTitle || 'Our Products & Services Include:'}</h3>
                <ul className="division-items">
                  {(product.items || []).map((item, itemIndex) => (
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

      {/* Additional Information (empty for now) */}
    </div>
  );
};

export default Products;
