import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { client } from '../sanityClient';
import { allItemsQuery } from '../queries/productsPageQuery';
import './ItemDetail.css';

const slugify = (s) =>
  (s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'item';

const ItemDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterBrand, setFilterBrand] = useState('all');

  useEffect(() => {
    client
      .fetch(allItemsQuery)
      .then((data) => {
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
        setItem(foundItem);
        setLoading(false);
      })
      .catch(() => setLoading(false));
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

  // Get unique brand names for filter
  const brandNames = [...new Set(brands.map(b => b.brandName).filter(Boolean))];
  const filteredBrands = filterBrand === 'all'
    ? brands
    : brands.filter(b => b.brandName === filterBrand);

  // We need the original index for navigation, so track it
  const filteredWithIndex = brands
    .map((b, i) => ({ ...b, _origIndex: i }))
    .filter(b => filterBrand === 'all' || b.brandName === filterBrand);

  return (
    <div className="item-detail-page">
      <section className="item-detail-hero">
        <div className="container">
          <Link to="/products" className="item-back-link">&larr; Back to Products</Link>
        </div>
      </section>

      <section className="item-detail-brands">
        <div className="container">
          <h2 className="item-brands-heading">Available Brands &amp; Models</h2>

          {brandNames.length > 1 && (
            <div className="item-brand-filter">
              <label htmlFor="brand-filter">Filter by Brand:</label>
              <select
                id="brand-filter"
                value={filterBrand}
                onChange={(e) => setFilterBrand(e.target.value)}
              >
                <option value="all">All Brands</option>
                {brandNames.map((name) => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>
          )}

          {filteredWithIndex.length > 0 ? (
            <div className="item-brands-grid">
              {filteredWithIndex.map((brand) => (
                <motion.div
                  key={brand._origIndex}
                  className="item-brand-card item-brand-card--clickable"
                  onClick={() => navigate(`/products/item/${slug}/brand/${brand._origIndex}`)}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.05 }}
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
