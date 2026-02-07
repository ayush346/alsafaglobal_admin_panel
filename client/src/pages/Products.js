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

  // Render productGroups from CMS
  const productGroups = productsData?.productGroups || [];

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
      <section className="divisions-content">
        <div className="container">
          {productGroups.map((group, groupIdx) => (
            <div className="division-section" key={groupIdx} style={{ marginBottom: '40px' }}>
              <div className="division-header">
                <h2>{group.title}</h2>
              </div>
              <div className="products-group-list">
                {group.products && group.products.length > 0 && group.products.map((product, idx) => (
                  <div className="product-item" key={idx} style={{ marginBottom: '24px' }}>
                    <h3>{product.name}</h3>
                    {product.image && product.image.asset && (
                      <div className="division-image" style={{ marginBottom: '12px' }}>
                        <img
                          src={product.image.asset.url}
                          alt={product.name}
                          style={{ maxWidth: '220px', width: '100%', borderRadius: '8px' }}
                        />
                      </div>
                    )}
                    <p>{product.description}</p>
                  </div>
                ))}
              </div>
              {group.segmentRef && group.segmentRef.slug && (
                <div style={{ marginTop: '16px' }}>
                  <Link to={`/divisions#${group.segmentRef.slug}`} className="btn btn-secondary">
                    View Services
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Additional Information (empty for now) */}
    </div>
  );
}

export default Products;
