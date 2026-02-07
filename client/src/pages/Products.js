import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation, Link } from 'react-router-dom';
import './Divisions.css';
import { productsPageQuery } from '../queries/productsPageQuery';
import useContent from '../hooks/useContent';
import { homePageQuery } from '../queries/homePageQuery';
import { highlightBrand } from '../components/BrandText';
import BrandText from '../components/BrandText';

const Products = () => {
  const location = useLocation();
  const [productsData, setProductsData] = useState(null);
  const [homeData, setHomeData] = useState(null);

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
      let segmentLink = '';
      if (p?.segmentRef?.slug) {
        segmentLink = `/divisions#${p.segmentRef.slug}`;
      } else if (p?.segmentLink) {
        segmentLink = p.segmentLink;
        if (!segmentLink.startsWith('/')) {
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

      {/* Products Content */}
      <section className="products-amazon-layout">
        <div className="container">
          <div className="products-grid">
            {productsToRender.map((product, index) => (
              <motion.div
                key={product.slug}
                id={product.slug}
                className="product-card"
                data-cms-item
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="product-image-container">
                  {product.image && product.image.asset && (
                    <img
                      src={product.image.asset.url}
                      alt={product.title}
                      className="product-image"
                    />
                  )}
                </div>
                <div className="product-info">
                  <h2 className="product-title" data-cms-field="title">{product.title}</h2>
                  <p className="product-description" data-cms-field="description">{product.description}</p>
                  {product.segmentLink && (
                    <div style={{ marginTop: '12px' }}>
                      <Link to={product.segmentLink} className="btn btn-secondary">View Services</Link>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
// Amazon-like product grid styles
import './ProductsAmazon.css';

      {/* Additional Information (empty for now) */}
    </div>
  );
};

export default Products;
