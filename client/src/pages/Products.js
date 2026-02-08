import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { client } from '../sanityClient';
import { productsPageQuery } from '../queries/productsPageQuery';
import { homePageQuery } from '../queries/homePageQuery';
import { highlightBrand } from '../components/BrandText';
import './Products.css';

const INITIAL_SHOW = 2;

const ProductGroup = ({ group }) => {
  const [expanded, setExpanded] = useState(false);
  const products = group.products || [];
  const hasMore = products.length > INITIAL_SHOW;
  const visible = expanded ? products : products.slice(0, INITIAL_SHOW);

  const slugify = (s) =>
    (s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'group';

  return (
    <div className="product-group-card" id={group.segmentSlug || slugify(group.title)}>
      <h2>{group.title}</h2>
      <div className="products-grid">
        {visible.map((product, j) => (
          <motion.div
            key={j}
            className="product-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: j * 0.1 }}
            viewport={{ once: true }}
          >
            {product.image?.asset?.url && (
              <div className="product-image-wrapper">
                <img src={product.image.asset.url} alt={product.name} />
              </div>
            )}
            <h3 className="product-name">{product.name}</h3>
            {product.description && <p className="product-description">{product.description}</p>}
          </motion.div>
        ))}
      </div>
      <div className="product-group-actions">
        {hasMore && (
          <button
            className="toggle-products-btn"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? 'View Less' : `View More (${products.length - INITIAL_SHOW} more)`}
          </button>
        )}
        {group.segmentSlug && (
          <Link
            to={`/divisions#${group.segmentSlug}`}
            className="view-services-btn"
          >
            View Services
          </Link>
        )}
      </div>
    </div>
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
    const tryScroll = () => {
      const el = document.getElementById(hash);
      if (el) {
        requestAnimationFrame(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }));
        return;
      }
      if (++attempts < 10) setTimeout(tryScroll, 100);
    };
    setTimeout(tryScroll, 150);
  }, [location.hash, productsData]);

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
