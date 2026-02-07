
import React from 'react';
import useContent from '../hooks/useContent';
import { productsPageQuery } from '../queries/productsPageQuery';

const Products = () => {
  const { data, loading, error } = useContent(productsPageQuery);

  if (loading) return <div style={{padding:'2rem',textAlign:'center'}}>Loading products...</div>;
  if (error) return <div style={{padding:'2rem',color:'red',textAlign:'center'}}>Error loading products.</div>;
  if (!data || !Array.isArray(data.productGroups) || data.productGroups.length === 0) {
    return <div style={{padding:'2rem',textAlign:'center'}}>No product groups found. Please check your CMS content.</div>;
  }

  return (
    <div style={{maxWidth:'900px',margin:'0 auto',padding:'2rem'}}>
      <h1 style={{fontSize:'2.2rem',marginBottom:'1.5rem'}}>{data.title || 'Products'}</h1>
      {data.intro && Array.isArray(data.intro) && data.intro.map((block, i) => (
        <p key={i}>{block.children?.[0]?.text || ''}</p>
      ))}
      {data.productGroups.map((group, i) => (
        <div key={i} style={{margin:'2.5rem 0',padding:'1.5rem',border:'1px solid #eee',borderRadius:'8px',background:'#fafbfc'}}>
          <h2 style={{fontSize:'1.4rem',marginBottom:'1rem'}}>{group.title}</h2>
          {group.products && group.products.length > 0 ? (
            <div style={{display:'flex',flexWrap:'wrap',gap:'2rem'}}>
              {group.products.map((product, j) => (
                <div key={j} style={{flex:'1 1 220px',minWidth:'220px',background:'#fff',border:'1px solid #eee',borderRadius:'6px',padding:'1rem'}}>
                  <h3 style={{fontSize:'1.1rem',marginBottom:'0.5rem'}}>{product.name}</h3>
                  {product.image?.asset?.url && (
                    <img src={product.image.asset.url} alt={product.name} style={{width:'100%',maxWidth:'180px',borderRadius:'6px',marginBottom:'0.5rem'}} />
                  )}
                  <p style={{fontSize:'0.97rem',color:'#444'}}>{product.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <div style={{color:'#888',fontStyle:'italic'}}>No products in this group.</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Products;
