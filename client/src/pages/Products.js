import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { client } from '../sanityClient';
import { productsPageQuery } from '../queries/productsPageQuery';
import { segmentsPageQuery } from '../queries/segmentsPageQuery';
import { homePageQuery } from '../queries/homePageQuery';
import { highlightBrand } from '../components/BrandText';
import './Products.css';

const Products = () => {
  const [productsData, setProductsData] = useState(null);
  const [segmentsData, setSegmentsData] = useState(null);
  const [homeData, setHomeData] = useState(null);

  useEffect(() => {
    client.fetch(productsPageQuery).then(setProductsData);
    client.fetch(segmentsPageQuery).then(setSegmentsData);
    client.fetch(homePageQuery).then(setHomeData);
  }, []);

  const slugify = (s) =>
    (s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'segment';

  // Get enabled segments for the "View Services" list
  const segments = (segmentsData?.segments || [])
    .filter(seg => seg?.enabled !== false && seg?.title);

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
      {Array.isArray(productsData?.productGroups) && productsData.productGroups.length > 0 && (
        <section className="products-groups">
          <div className="container">
            {productsData.productGroups.map((group, i) => (
              <div key={i} className="product-group-card">
                <h2>{group.title}</h2>
                {group.products && group.products.length > 0 && (
                  <div className="products-grid">
                    {group.products.map((product, j) => (
                      <div key={j} className="product-card">
                        <h3>{product.name}</h3>
                        {product.image?.asset?.url && (
                          <img src={product.image.asset.url} alt={product.name} />
                        )}
                        {product.description && <p>{product.description}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Segments Navigation Section */}
      {segments.length > 0 && (
        <section className="segments-nav-section">
          <div className="container">
            <h2 className="segments-nav-title">Our Business Segments</h2>
            <div className="segments-nav-grid">
              {segments.map((seg, i) => (
                <motion.div
                  key={i}
                  className="segment-nav-card"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  <h3>{seg.title}</h3>
                  {seg.description && <p>{seg.description}</p>}
                  <Link
                    to={`/divisions#${seg.slug || slugify(seg.title)}`}
                    className="view-services-btn"
                  >
                    View Services
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Products;
