"""
Web Crawler Script for MOSDAC Data Extraction
Uses Scrapy and BeautifulSoup for comprehensive content extraction
"""

import requests
from bs4 import BeautifulSoup
import json
import time
from urllib.parse import urljoin, urlparse
import logging
from typing import List, Dict, Any
import re

class MOSDACCrawler:
    def __init__(self, base_url: str = "https://mosdac.gov.in"):
        self.base_url = base_url
        self.visited_urls = set()
        self.extracted_data = []
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
        
        # Setup logging
        logging.basicConfig(level=logging.INFO)
        self.logger = logging.getLogger(__name__)
    
    def extract_metadata(self, soup: BeautifulSoup, url: str) -> Dict[str, Any]:
        """Extract metadata from HTML page"""
        metadata = {
            'url': url,
            'title': '',
            'description': '',
            'keywords': [],
            'content_type': 'html',
            'last_modified': None
        }
        
        # Extract title
        title_tag = soup.find('title')
        if title_tag:
            metadata['title'] = title_tag.get_text().strip()
        
        # Extract meta description
        desc_tag = soup.find('meta', attrs={'name': 'description'})
        if desc_tag:
            metadata['description'] = desc_tag.get('content', '').strip()
        
        # Extract keywords
        keywords_tag = soup.find('meta', attrs={'name': 'keywords'})
        if keywords_tag:
            keywords = keywords_tag.get('content', '')
            metadata['keywords'] = [k.strip() for k in keywords.split(',')]
        
        return metadata
    
    def extract_entities(self, text: str) -> List[str]:
        """Simple entity extraction using regex patterns"""
        entities = []
        
        # Satellite names pattern
        satellite_pattern = r'\b(INSAT-\w+|SCATSAT-\w+|RISAT-\w+|CARTOSAT-\w+)\b'
        satellites = re.findall(satellite_pattern, text, re.IGNORECASE)
        entities.extend(satellites)
        
        # Data product patterns
        data_patterns = [
            r'\b(atmospheric\s+data|temperature\s+profile|humidity\s+data)\b',
            r'\b(meteorological\s+data|weather\s+data|climate\s+data)\b',
            r'\b(API\s+services|REST\s+API|web\s+services)\b'
        ]
        
        for pattern in data_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            entities.extend(matches)
        
        return list(set(entities))  # Remove duplicates
    
    def crawl_page(self, url: str, max_depth: int = 3, current_depth: int = 0) -> Dict[str, Any]:
        """Crawl a single page and extract content"""
        if url in self.visited_urls or current_depth > max_depth:
            return None
        
        try:
            self.logger.info(f"Crawling: {url}")
            response = self.session.get(url, timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Extract text content
            # Remove script and style elements
            for script in soup(["script", "style"]):
                script.decompose()
            
            text_content = soup.get_text()
            # Clean up text
            lines = (line.strip() for line in text_content.splitlines())
            chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
            text_content = ' '.join(chunk for chunk in chunks if chunk)
            
            # Extract metadata
            metadata = self.extract_metadata(soup, url)
            
            # Extract entities
            entities = self.extract_entities(text_content)
            
            # Extract links for further crawling
            links = []
            for link in soup.find_all('a', href=True):
                href = link['href']
                full_url = urljoin(url, href)
                if self.is_valid_url(full_url):
                    links.append(full_url)
            
            page_data = {
                'url': url,
                'title': metadata['title'],
                'content': text_content[:2000],  # Limit content length
                'metadata': metadata,
                'entities': entities,
                'links': links[:10],  # Limit links
                'crawl_depth': current_depth,
                'timestamp': time.time()
            }
            
            self.visited_urls.add(url)
            self.extracted_data.append(page_data)
            
            # Crawl linked pages (limited depth)
            if current_depth < max_depth:
                for link_url in links[:5]:  # Limit concurrent crawling
                    if link_url not in self.visited_urls:
                        time.sleep(1)  # Rate limiting
                        self.crawl_page(link_url, max_depth, current_depth + 1)
            
            return page_data
            
        except Exception as e:
            self.logger.error(f"Error crawling {url}: {str(e)}")
            return None
    
    def is_valid_url(self, url: str) -> bool:
        """Check if URL is valid for crawling"""
        parsed = urlparse(url)
        
        # Only crawl same domain
        if parsed.netloc and parsed.netloc not in self.base_url:
            return False
        
        # Skip certain file types
        skip_extensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.zip', '.tar', '.gz']
        if any(url.lower().endswith(ext) for ext in skip_extensions):
            return False
        
        return True
    
    def save_results(self, filename: str = 'crawled_data.json'):
        """Save extracted data to JSON file"""
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(self.extracted_data, f, indent=2, ensure_ascii=False)
        
        self.logger.info(f"Saved {len(self.extracted_data)} pages to {filename}")

# Example usage
if __name__ == "__main__":
    crawler = MOSDACCrawler()
    
    # Start crawling from main page
    start_urls = [
        "https://mosdac.gov.in",
        "https://mosdac.gov.in/data",
        "https://mosdac.gov.in/services",
        "https://mosdac.gov.in/faq"
    ]
    
    for url in start_urls:
        crawler.crawl_page(url, max_depth=2)
        time.sleep(2)  # Rate limiting between pages
    
    # Save results
    crawler.save_results('mosdac_crawled_data.json')
    
    print(f"Crawling completed. Extracted data from {len(crawler.extracted_data)} pages.")
    print(f"Total entities found: {sum(len(page['entities']) for page in crawler.extracted_data)}")
