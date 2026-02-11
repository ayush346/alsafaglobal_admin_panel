import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { client } from '../sanityClient';
import { productsPageQuery } from '../queries/productsPageQuery';
import { homePageQuery } from '../queries/homePageQuery';
import { highlightBrand } from '../components/BrandText';
import './Products.css';

const slugify = (s) =>
  (s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'group';

const ProductGroup = ({ group }) => {
  const navigate = useNavigate();
  const groupSlug = group.slug || slugify(group.title);

  const handleCardClick = () => {
    navigate(`/products/${groupSlug}`);
  };

  return (
    <motion.div
      className="product-group-card product-group-card--clickable"
      id={group.segmentSlug || slugify(group.title)}
      onClick={handleCardClick}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') handleCardClick(); }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
    >
      <h2>{group.title}</h2>
      <span className="product-group-arrow">View Products &rarr;</span>
    </motion.div>
  );
};

const Products = () => {
  const location = useLocation();
  const [productsData, setProductsData] = useState(null);
  const [homeData, setHomeData] = useState(null);

  useEffect(() => {
    client.fetch(productsPageQuery).then(setProductsData);
    client.fetch(homePageQuery).then(setHomeData);
  }, []);

  // Hash scroll logic
  useEffect(() => {
    const hash = location.hash?.replace('#', '');
    if (!hash || !productsData?.productGroups) return;
    let attempts = 0;
    const HEADER_OFFSET = 100;
    const tryScroll = () => {
      const el = document.getElementById(hash);
      if (el) {
        requestAnimationFrame(() => {
          const top = el.getBoundingClientRect().top + window.pageYOffset - HEADER_OFFSET;
          window.scrollTo({ top, behavior: 'smooth' });
        });
        return;
      }
      if (++attempts < 10) setTimeout(tryScroll, 100);
    };
    setTimeout(tryScroll, 150);
  }, [location.hash, location.key, productsData]);

  return (
    <div className="products-page">
      {/* Hero Section */}
      <section className="products-hero">
        <div className="container">
          <motion.div
            className="products-hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1
              dangerouslySetInnerHTML={{
                __html: highlightBrand(
                  productsData?.title || 'Products',
                  homeData?.brandText || 'Al Safa Global',
                  homeData?.brandColor
                )
              }}
            />
            {productsData?.intro?.length > 0 && productsData.intro.map((block, i) => (
              <p key={i}>{block.children?.[0]?.text || ''}</p>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Product Groups Section */}
      <section className="products-groups">
        <div className="container">
          {Array.isArray(productsData?.productGroups) && productsData.productGroups.length > 0 ? (
            productsData.productGroups.map((group, i) => (
              <ProductGroup key={i} group={group} />
            ))
          ) : (
            <div className="no-products">No product groups available yet.</div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Products;
