import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { client } from '../sanityClient';
import { allItemsQuery } from '../queries/productsPageQuery';
import './ItemDetail.css';

const slugify = (s) =>
  (s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'item';

const ItemDetail = () => {
  const { slug } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client
      .fetch(allItemsQuery)
      .then((data) => {
        // Flatten all items from all groups and products
        const groups = data?.productGroups || [];
        let foundItem = null;
        for (const group of groups) {
          for (const product of (group.products || [])) {
            for (const it of (product.items || [])) {
              const itSlug = it.slug || slugify(it.title);
              if (itSlug === slug) {
                foundItem = it;
                break;
              }
            }
            if (foundItem) break;
          }
          if (foundItem) break;
        }
        console.log('ItemDetail found:', JSON.stringify(foundItem, null, 2));
        setItem(foundItem);
        setLoading(false);
      })
      .catch((err) => {
        console.error('ItemDetail fetch error:', err);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="item-detail-page">
        <div className="container item-detail-loading">Loading…</div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="item-detail-page">
        <div className="container item-detail-empty">
          <h2>Item not found</h2>
          <Link to="/products" className="item-back-link">&larr; Back to Products</Link>
        </div>
      </div>
    );
  }

  const brands = item.brands || [];

  return (
    <div className="item-detail-page">
      {/* Hero */}
      <section className="item-detail-hero">
        <div className="container">
          <Link to="/products" className="item-back-link">&larr; Back to Products</Link>
        </div>
      </section>

      {/* Brands */}
      <section className="item-detail-brands">
        <div className="container">
          <h2 className="item-brands-heading">Available Brands &amp; Models</h2>
          {brands.length > 0 ? (
            <div className="item-brands-grid">
              {brands.map((brand, i) => (
                <motion.div
                  key={i}
                  className="item-brand-card"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  viewport={{ once: true }}
                >
                  {brand.showBrandImage !== false && brand.brandImage?.asset?.url && (
                    <div className="item-brand-image">
                      <img src={brand.brandImage.asset.url} alt={brand.brandName || 'Brand'} />
                    </div>
                  )}
                  <div className="item-brand-details">
                    {brand.showBrandName !== false && brand.brandName && (
                      <h3 className="item-brand-name">{brand.brandName}</h3>
                    )}
                    {brand.showModelName !== false && brand.modelName && (
                      <p className="item-brand-model">{brand.modelName}</p>
                    )}
                    {brand.showSpecification !== false && brand.specification && (
                      <p className="item-brand-spec">{brand.specification}</p>
                    )}
                    {brand.showPrice !== false && brand.price && (
                      <span className="item-brand-price">{brand.price}</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="item-no-brands">No brands listed yet.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default ItemDetail;
