import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft } from 'react-icons/fi';
import { client } from '../sanityClient';
import { productGroupBySlugQuery } from '../queries/productsPageQuery';
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
    Promise.all([
      client.fetch(productGroupBySlugQuery, { slug }),
      client.fetch(homePageQuery),
    ]).then(([groupData, home]) => {
      setGroup(groupData);
      setHomeData(home);
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return (
      <div className="product-detail-page">
        <div className="product-detail-loading">
          <div className="loading-spinner" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="product-detail-page">
        <div className="product-detail-empty">
          <h2>Product group not found</h2>
          <Link to="/products" className="back-to-products-btn">
            <FiArrowLeft /> Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const subcategories = group.subcategories || [];

  return (
    <div className="product-detail-page">
      {/* Hero */}
      <section className="product-detail-hero">
        <div className="container">
          <motion.div
            className="product-detail-hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Link to="/products" className="back-link">
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
            {group.groupDescription && (
              <p className="product-detail-intro">{group.groupDescription}</p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Subcategories */}
      <section className="product-detail-subcategories">
        <div className="container">
          {subcategories.length > 0 ? (
            <div className="subcategories-grid">
              {subcategories.map((sub, i) => (
                <motion.div
                  key={i}
                  className="subcategory-card"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.12 }}
                  viewport={{ once: true }}
                >
                  {sub.image?.asset?.url && (
                    <div className="subcategory-image-wrapper">
                      <img src={sub.image.asset.url} alt={sub.title} />
                    </div>
                  )}
                  <div className="subcategory-content">
                    <h3>{sub.title}</h3>
                    {sub.description && <p>{sub.description}</p>}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="no-subcategories">
              No subcategories have been added yet.
            </div>
          )}
        </div>
      </section>

      {/* Products (existing products list, if any) */}
      {group.products && group.products.length > 0 && (
        <section className="product-detail-products">
          <div className="container">
            <h2 className="products-section-title">Products</h2>
            <div className="products-grid">
              {group.products.map((product, j) => (
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
                  {product.description && (
                    <p className="product-description">{product.description}</p>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;
