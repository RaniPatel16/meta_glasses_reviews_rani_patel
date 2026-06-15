import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title, 
  description = 'Meta Glasses Reviews Dashboard - Manage and analyze customer feedback.', 
  name = 'Meta Glasses Admin',
  type = 'website' 
}) => {
  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{title} | {name}</title>
      <meta name='description' content={description} />
      
      {/* Open Graph tags for social sharing */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      
      {/* Twitter tags */}
      <meta name="twitter:creator" content={name} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      
      {/* Canonical Link */}
      <link rel="canonical" href={window.location.href} />
    </Helmet>
  );
};

export default SEO;
