import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiChevronDown } from 'react-icons/fi';
import { client } from '../sanityClient';
import { productGroupBySlugQuery, productsPageQuery } from '../queries/productsPageQuery';
import { homePageQuery } from '../queries/homePageQuery';
import { highlightBrand } from '../components/BrandText';
import './ProductDetail.css';

const ProductSection = ({ product, index }) => {
  const [open, setOpen] = useState(false);
  const items = product.items || [];

  return (
    <motion.div
      className="pd-product-section"
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      viewport={{ once: true }}
    >
      <div
        className={`pd-product-header ${open ? 'pd-product-header--open' : ''}`}
        onClick={() => items.length > 0 && setOpen(!open)}
        role={items.length > 0 ? 'button' : undefined}
        tabIndex={items.length > 0 ? 0 : undefined}
        onKeyDown={(e) => { if (e.key === 'Enter' && items.length > 0) setOpen(!open); }}
      >
        {product.image?.asset?.url && (
          <div className="pd-product-thumb">
            <img src={product.image.asset.url} alt={product.name} />
          </div>
        )}
        <div className="pd-product-info">
          <h3>{product.name}</h3>
          {product.description && <p>{product.description}</p>}
        </div>
        {items.length > 0 && (
          <FiChevronDown className={`pd-product-chevron ${open ? 'pd-product-chevron--open' : ''}`} />
        )}
      </div>

      <AnimatePresence>
        {open && items.length > 0 && (
          <motion.div
            className="pd-items-grid"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {items.map((item, j) => (
              <div key={j} className="pd-item-card">
                {item.image?.asset?.url ? (
                  <div className="pd-item-image">
                    <img src={item.image.asset.url} alt={item.title} />
                  </div>
                ) : (
                  <div className="pd-item-image pd-item-image--placeholder">
                    <span>No Image</span>
                  </div>
                )}
                <div className="pd-item-body">
                  <h4>{item.title}</h4>
                  {item.description && <p>{item.description}</p>}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const ProductDetail = () => {
  const { slug } = useParams();
  const [group, setGroup] = useState(null);
  const [homeData, setHomeData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const fetchBySlug = client.fetch(productGroupBySlugQuery, { slug });
    const fetchHome = client.fetch(homePageQuery);

    Promise.all([fetchBySlug, fetchHome]).then(([groupData, home]) => {
      // Fallback: if slug field not set yet, match by title-derived slug
      if (!groupData) {
        client.fetch(productsPageQuery).then((page) => {
          const slugify = (s) =>
            (s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
          const match = (page?.productGroups || []).find(
            (g) => (g.slug || slugify(g.title)) === slug
          );
          setGroup(match || null);
          setHomeData(home);
          setLoading(false);
        });
      } else {
        setGroup(groupData);
        setHomeData(home);
        setLoading(false);
      }
    });
  }, [slug]);

  if (loading) {
    return (
      <div className="product-detail-page">
        <div className="product-detail-loading">
          <div className="pd-spinner" />
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="product-detail-page">
        <div className="product-detail-empty">
          <h2>Product group not found</h2>
          <Link to="/products" className="pd-back-btn">
            <FiArrowLeft /> Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const products = group.products || [];

  return (
    <div className="product-detail-page">
      {/* Hero */}
      <section className="pd-hero">
        <div className="container">
          <motion.div
            className="pd-hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Link to="/products" className="pd-back-link">
              <FiArrowLeft /> All Products
            </Link>
            <h1
              dangerouslySetInnerHTML={{
                __html: highlightBrand(
                  group.title || '',
                  homeData?.brandText || 'Al Safa Global',
                  homeData?.brandColor
                ),
              }}
            />
          </motion.div>
        </div>
      </section>

      {/* Products */}
      <section className="pd-products">
        <div className="container">
          {products.length > 0 ? (
            <div className="pd-product-list">
              {products.map((product, i) => (
                <ProductSection key={i} product={product} index={i} />
              ))}
            </div>
          ) : (
            <div className="pd-empty">
              <p>No products have been added yet. Add them from the CMS.</p>
              <Link to="/products" className="pd-back-btn">
                <FiArrowLeft /> Back to Products
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;
