import { MetadataRoute } from 'next';

/**
 * Robots.txt Generator
 * 
 * This file automatically generates a robots.txt file for the website.
 * The robots.txt file tells search engines which pages they can and cannot crawl.
 * 
 * @returns {MetadataRoute.Robots} The robots.txt data
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/dashboard/', 
        '/api/',
        '/preview/'
      ],
    },
    sitemap: 'https://meshreality.com/sitemap.xml', // Replace with your actual domain when available
  };
}
