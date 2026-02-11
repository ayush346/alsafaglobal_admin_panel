import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft } from 'react-icons/fi';
import { client } from '../sanityClient';
import { productGroupBySlugQuery, productsPageQuery } from '../queries/productsPageQuery';
import { homePageQuery } from '../queries/homePageQuery';
import { highlightBrand } from '../components/BrandText';
import './ProductDetail.css';

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

      {/* Product Listing */}
      <section className="pd-products">
        <div className="container">
          {products.length > 0 ? (
            <div className="pd-grid">
              {products.map((product, i) => (
                <motion.div
                  key={i}
                  className="pd-card"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: i * 0.07 }}
                  viewport={{ once: true }}
                >
                  {product.image?.asset?.url ? (
                    <div className="pd-card-image">
                      <img src={product.image.asset.url} alt={product.name} />
                    </div>
                  ) : (
                    <div className="pd-card-image pd-card-image--placeholder">
                      <span>No Image</span>
                    </div>
                  )}
                  <div className="pd-card-body">
                    <h3>{product.name}</h3>
                    {product.description && <p>{product.description}</p>}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="pd-empty">
              <p>No products have been added to this group yet.</p>
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
