import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation, Link } from 'react-router-dom';
import './Divisions.css';
import { productsPageQuery } from '../queries/productsPageQuery';
import useContent from '../hooks/useContent';
import { homePageQuery } from '../queries/homePageQuery';
import { highlightBrand } from '../components/BrandText';
import BrandText from '../components/BrandText';
import { urlFor } from '../sanityClient';

const Products = () => {
  const location = useLocation();
  const [productsData, setProductsData] = useState(null);
  const [homeData, setHomeData] = useState(null);

  // Robust hash-scroll logic for dropdown navigation
  useEffect(() => {
    const hash = location.hash?.replace('#', '');
    if (!hash || !productsData?.products) return;

    let attemptCount = 0;
    const maxAttempts = 10;
    const attemptScroll = () => {
      const el = document.getElementById(hash);
      if (el) {
        requestAnimationFrame(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
        return;
      }
      attemptCount++;
      if (attemptCount < maxAttempts) {
        setTimeout(attemptScroll, 100);
      }
    };
    setTimeout(attemptScroll, 150);
  }, [location.hash, productsData]);

  const { data: productsCms } = useContent(productsPageQuery);
  const { data: homeCms } = useContent(homePageQuery);

  useEffect(() => {
    setProductsData(productsCms);
  }, [productsCms]);

  useEffect(() => {
    setHomeData(homeCms);
  }, [homeCms]);

  const slugify = (s) =>
    (s || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'product';

  const productsFromCMS = productsData?.products
    ?.filter(p => p?.enabled !== false)
    ?.map((p) => {
      // Prioritize segmentRef (new approach): use referenced segment slug
      let segmentLink = '';
      if (p?.segmentRef?.slug) {
        segmentLink = `/divisions#${p.segmentRef.slug}`;
      } else if (p?.segmentLink) {
        // Fallback to segmentLink string (legacy approach)
        segmentLink = p.segmentLink;
        if (!segmentLink.startsWith('/')) {
          // User entered segment slug or title, slugify and build URL
          segmentLink = `/divisions#${slugify(segmentLink)}`;
        }
      }
      return {
        slug: p?.slug ? String(p.slug).trim() || slugify(p?.title) : slugify(p?.title),
        title: p?.title || '',
        description: p?.description || '',
        segmentLink: segmentLink,
        image: p?.image || null
      };
    });

  const productsToRender = (productsFromCMS && productsFromCMS.length) ? productsFromCMS : [];

  // Show only 2 products by default, expand on button click
  const [showAll, setShowAll] = useState(false);
  const visibleProducts = showAll ? productsToRender : productsToRender.slice(0, 2);

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
                  productsData?.title || 'Al Safa Global Products',
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

      {/* Products grouped by segment */}
      <section className="divisions-content">
        <div className="container">
          {Object.entries(groupedProducts).map(([segmentSlug, { segmentTitle, products }]) => (
            <SegmentProductsDivision
              key={segmentSlug}
              segmentTitle={segmentTitle || segmentSlug}
              products={products}
            />
          ))}
        </div>
      </section>

      {/* Additional Information (empty for now) */}
    </div>
  );
};

export default Products;

// Helper component for per-segment division with local show more state
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { urlFor } from '../sanityClient';

function SegmentProductsDivision({ segmentTitle, products }) {
  const [showAll, setShowAll] = useState(false);
  const visibleProducts = showAll ? products : products.slice(0, 2);
  return (
    <div className="division-group">
      <h2 style={{ marginBottom: 16 }}>{segmentTitle}</h2>
      <div data-cms-list="products">
        {visibleProducts.map((product, index) => (
          <motion.div
            key={product.slug}
            id={product.slug}
            className="division-section"
            data-cms-item
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <div className="division-header">
              {product.image && (
                <img
                  src={urlFor(product.image).width(400).height(250).fit('max').url()}
                  alt={product.title}
                  className="division-image"
                  style={{ marginBottom: 16, maxWidth: 400, width: '100%', borderRadius: 8 }}
                />
              )}
              <h3 data-cms-field="title">{product.title}</h3>
              <p className="division-description" data-cms-field="description">{product.description}</p>
              {product.segmentLink && (
                <div style={{ marginTop: '12px' }}>
                  <Link to={product.segmentLink} className="btn btn-secondary">View Services</Link>
                </div>
              )}
            </div>
          </motion.div>
        ))}
        {!showAll && products.length > 2 && (
          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <button className="btn btn-primary" onClick={() => setShowAll(true)}>
              View More Products
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
