import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { client } from '../sanityClient';
import { productsPageQuery } from '../queries/productsPageQuery';
import { homePageQuery } from '../queries/homePageQuery';
import { highlightBrand } from '../components/BrandText';
import './Products.css';

const INITIAL_SHOW = 2;

// Normalize: trim whitespace, collapse inner spaces
const normalizeBrand = (b) => (b || '').trim().replace(/\s+/g, ' ');
// Case-insensitive brand match against an array of brand names
const brandMatch = (brandNames, brand) => {
  const target = normalizeBrand(brand).toLowerCase();
  return (brandNames || []).some(b => normalizeBrand(b).toLowerCase() === target);
};

const ProductGroup = ({ group, activeBrand }) => {
  const [expanded, setExpanded] = useState(false);
  const [expandedProduct, setExpandedProduct] = useState(null);
  const navigate = useNavigate();
  const allProducts = group.products || [];

  // Filter products when a brand is selected
  const products = activeBrand
    ? allProducts.filter(p => (p.items || []).some(it => brandMatch(it.brandNames, activeBrand)))
    : allProducts;
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
            className={`product-card${product.items?.length > 0 ? ' product-card--has-items' : ''}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: j * 0.1 }}
            viewport={{ once: true }}
            onClick={() => product.items?.length > 0 && setExpandedProduct(expandedProduct === j ? null : j)}
          >
            {product.image?.asset?.url && (
              <div className="product-image-wrapper">
                <img src={product.image.asset.url} alt={product.name} />
              </div>
            )}
            <h3 className="product-name">{product.name}</h3>
            {product.description && <p className="product-description">{product.description}</p>}
            {product.items?.length > 0 && (
              <span className="product-items-hint">
                {expandedProduct === j ? 'Hide Items ▲' : `View ${product.items.length} Items ▼`}
              </span>
            )}
            {product.items?.length > 0 && (expandedProduct === j || activeBrand) && (
              <div className="product-items">
                <div className="product-items-grid">
                  {(activeBrand
                    ? product.items.filter(it => brandMatch(it.brandNames, activeBrand))
                    : product.items
                  ).map((item, k) => (
                    <div
                      key={k}
                      className="product-item-card product-item-card--clickable"
                      onClick={(e) => {
                        e.stopPropagation();
                        const itemSlug = item.slug || slugify(item.title);
                        navigate(`/products/item/${itemSlug}`);
                      }}
                    >
                      {item.image?.asset?.url && (
                        <div className="product-item-image">
                          <img src={item.image.asset.url} alt={item.title} />
                        </div>
                      )}
                      <span className="product-item-name">{item.title}</span>
                      {item.description && <p className="product-item-desc">{item.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
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
  const [activeBrand, setActiveBrand] = useState('');

  useEffect(() => {
    client.fetch(productsPageQuery).then(setProductsData);
    client.fetch(homePageQuery).then(setHomeData);
  }, []);

  // Collect all unique brand names across every item (case-insensitive dedup)
  const allBrands = React.useMemo(() => {
    if (!productsData?.productGroups) return [];
    const seen = new Map(); // lowercased → display form (first occurrence wins)
    productsData.productGroups.forEach(g =>
      (g.products || []).forEach(p =>
        (p.items || []).forEach(it =>
          (it.brandNames || []).forEach(raw => {
            const normalized = normalizeBrand(raw);
            if (!normalized) return;
            const key = normalized.toLowerCase();
            if (!seen.has(key)) seen.set(key, normalized);
          })
        )
      )
    );
    return [...seen.values()].sort((a, b) => a.localeCompare(b));
  }, [productsData]);

  // Filter groups to only those with matching items when a brand is active
  const displayedGroups = React.useMemo(() => {
    if (!productsData?.productGroups) return [];
    if (!activeBrand) return productsData.productGroups;
    return productsData.productGroups.filter(g =>
      (g.products || []).some(p =>
        (p.items || []).some(it => brandMatch(it.brandNames, activeBrand))
      )
    );
  }, [productsData, activeBrand]);

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

      {/* Brand Filter */}
      {allBrands.length > 0 && (
        <section className="products-brand-filter">
          <div className="container">
            <div className="brand-filter-bar">
              <span className="brand-filter-label">Filter by Brand:</span>
              <div className="brand-filter-options">
                <button
                  className={`brand-filter-btn${!activeBrand ? ' brand-filter-btn--active' : ''}`}
                  onClick={() => setActiveBrand('')}
                >
                  All
                </button>
                {allBrands.map(b => (
                  <button
                    key={b}
                    className={`brand-filter-btn${activeBrand === b ? ' brand-filter-btn--active' : ''}`}
                    onClick={() => setActiveBrand(activeBrand === b ? '' : b)}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Product Groups Section */}
      <section className="products-groups">
        <div className="container">
          {displayedGroups.length > 0 ? (
            displayedGroups.map((group, i) => (
              <ProductGroup key={i} group={group} activeBrand={activeBrand} />
            ))
          ) : (
            <div className="no-products">{activeBrand ? `No products found for "${activeBrand}".` : 'No product groups available yet.'}</div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Products;
