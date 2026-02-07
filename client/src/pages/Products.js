import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { client } from '../sanityClient';
import { productsPageQuery, productsPageRawQuery } from '../queries/productsPageQuery';
import { homePageQuery } from '../queries/homePageQuery';
import { highlightBrand } from '../components/BrandText';
import './Products.css';

const Products = () => {
  const [productsData, setProductsData] = useState(null);
  const [homeData, setHomeData] = useState(null);
  const [rawData, setRawData] = useState(null);

  useEffect(() => {
    client.fetch(productsPageQuery).then(setProductsData);
    client.fetch(productsPageRawQuery).then(setRawData);
  }, []);

  useEffect(() => {
    client.fetch(homePageQuery).then(setHomeData);
  }, []);

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
            {/* Temporary debug: shows ALL raw fields from the Sanity document */}
            <pre style={{background:'#111',color:'#0f0',padding:'12px',fontSize:'11px',overflow:'auto',maxHeight:'400px',marginTop:'2rem',textAlign:'left',borderRadius:'8px'}}>RAW DOCUMENT FIELDS: {JSON.stringify(rawData, null, 2)}</pre>
          </motion.div>
        </div>
      </section>

      {/* Product Groups Section */}
      <section className="products-groups">
        <div className="container">
          {Array.isArray(productsData?.productGroups) && productsData.productGroups.length > 0 ? (
            productsData.productGroups.map((group, i) => (
              <div key={i} className="product-group-card">
                <h2>{group.title}</h2>
                {group.segmentRef && group.segmentRef.slug && (
                  <a
                    href={`/divisions#${group.segmentRef.slug}`}
                    className="view-services-btn"
                  >
                    View Services
                  </a>
                )}
                {group.products && group.products.length > 0 ? (
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
                ) : (
                  <div className="no-products">No products in this group.</div>
                )}
              </div>
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
