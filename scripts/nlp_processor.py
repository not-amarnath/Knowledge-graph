"""
NLP Processing Script for Entity Recognition and Relationship Extraction
Uses spaCy, NLTK, and custom patterns for satellite domain
"""

import spacy
import json
import re
from typing import List, Dict, Tuple, Any
from collections import defaultdict
import nltk
from nltk.tokenize import sent_tokenize, word_tokenize
from nltk.pos_tag import pos_tag
from nltk.chunk import ne_chunk

# Download required NLTK data
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')

try:
    nltk.data.find('taggers/averaged_perceptron_tagger')
except LookupError:
    nltk.download('averaged_perceptron_tagger')

try:
    nltk.data.find('chunkers/maxent_ne_chunker')
except LookupError:
    nltk.download('maxent_ne_chunker')

class SatelliteNLPProcessor:
    def __init__(self):
        # Load spaCy model (using small model for demo)
        try:
            self.nlp = spacy.load("en_core_web_sm")
        except OSError:
            print("spaCy model not found. Please install: python -m spacy download en_core_web_sm")
            self.nlp = None
        
        # Define domain-specific entity patterns
        self.entity_patterns = {
            'SATELLITE': [
                r'\b(INSAT-\w+|SCATSAT-\w+|RISAT-\w+|CARTOSAT-\w+|RESOURCESAT-\w+)\b',
                r'\b(Meteosat|GOES|NOAA-\w+|Himawari-\w+)\b'
            ],
            'DATA_PRODUCT': [
                r'\b(atmospheric\s+(?:data|profile|sounding))\b',
                r'\b(temperature\s+(?:profile|data|measurement))\b',
                r'\b(humidity\s+(?:profile|data|measurement))\b',
                r'\b(meteorological\s+(?:data|products|parameters))\b',
                r'\b(weather\s+(?:data|imagery|products))\b',
                r'\b(ocean\s+(?:color|surface|temperature))\b'
            ],
            'SERVICE': [
                r'\b(API\s+(?:services|endpoints|access))\b',
                r'\b(REST\s+API|web\s+services|data\s+services)\b',
                r'\b(FTP\s+(?:access|download|service))\b',
                r'\b(real-time\s+(?:data|access|streaming))\b'
            ],
            'ORGANIZATION': [
                r'\b(MOSDAC|ISRO|SAC|NRSC|IMD)\b',
                r'\b(Space\s+Applications?\s+Centre)\b',
                r'\b(Indian\s+Space\s+Research\s+Organisation)\b'
            ],
            'MEASUREMENT': [
                r'\b(temperature|humidity|pressure|wind\s+speed)\b',
                r'\b(precipitation|rainfall|cloud\s+cover)\b',
                r'\b(sea\s+surface\s+temperature|chlorophyll)\b'
            ]
        }
        
        # Relationship patterns
        self.relation_patterns = [
            (r'(\w+(?:\s+\w+)*)\s+provides?\s+(\w+(?:\s+\w+)*)', 'provides'),
            (r'(\w+(?:\s+\w+)*)\s+offers?\s+(\w+(?:\s+\w+)*)', 'offers'),
            (r'(\w+(?:\s+\w+)*)\s+contains?\s+(\w+(?:\s+\w+)*)', 'contains'),
            (r'(\w+(?:\s+\w+)*)\s+(?:is\s+)?used\s+for\s+(\w+(?:\s+\w+)*)', 'used_for'),
            (r'(\w+(?:\s+\w+)*)\s+(?:enables?|allows?)\s+(?:access\s+to\s+)?(\w+(?:\s+\w+)*)', 'enables_access_to'),
            (r'(\w+(?:\s+\w+)*)\s+(?:is\s+)?part\s+of\s+(\w+(?:\s+\w+)*)', 'part_of'),
            (r'(\w+(?:\s+\w+)*)\s+supports?\s+(\w+(?:\s+\w+)*)', 'supports')
        ]
    
    def extract_entities_regex(self, text: str) -> List[Dict[str, Any]]:
        """Extract entities using regex patterns"""
        entities = []
        
        for entity_type, patterns in self.entity_patterns.items():
            for pattern in patterns:
                matches = re.finditer(pattern, text, re.IGNORECASE)
                for match in matches:
                    entities.append({
                        'text': match.group().strip(),
                        'label': entity_type,
                        'start': match.start(),
                        'end': match.end(),
                        'confidence': 0.8  # Fixed confidence for regex
                    })
        
        return entities
    
    def extract_entities_spacy(self, text: str) -> List[Dict[str, Any]]:
        """Extract entities using spaCy NER"""
        if not self.nlp:
            return []
        
        doc = self.nlp(text)
        entities = []
        
        for ent in doc.ents:
            # Map spaCy labels to our domain labels
            label_mapping = {
                'ORG': 'ORGANIZATION',
                'PERSON': 'PERSON',
                'GPE': 'LOCATION',
                'PRODUCT': 'DATA_PRODUCT',
                'EVENT': 'EVENT'
            }
            
            mapped_label = label_mapping.get(ent.label_, ent.label_)
            
            entities.append({
                'text': ent.text,
                'label': mapped_label,
                'start': ent.start_char,
                'end': ent.end_char,
                'confidence': 0.9  # spaCy confidence
            })
        
        return entities
    
    def extract_relationships(self, text: str, entities: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Extract relationships using pattern matching"""
        relationships = []
        
        # Create entity lookup for quick access
        entity_texts = {ent['text'].lower(): ent for ent in entities}
        
        for pattern, relation_type in self.relation_patterns:
            matches = re.finditer(pattern, text, re.IGNORECASE)
            for match in matches:
                subject = match.group(1).strip()
                object_text = match.group(2).strip()
                
                # Check if subject and object are recognized entities
                subject_ent = entity_texts.get(subject.lower())
                object_ent = entity_texts.get(object_text.lower())
                
                if subject_ent or object_ent:
                    relationships.append({
                        'subject': subject,
                        'predicate': relation_type,
                        'object': object_text,
                        'confidence': 0.75,
                        'source_text': match.group()
                    })
        
        return relationships
    
    def create_knowledge_triplets(self, relationships: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Convert relationships to knowledge triplets"""
        triplets = []
        
        for rel in relationships:
            triplet = {
                'subject': rel['subject'],
                'predicate': rel['predicate'],
                'object': rel['object'],
                'confidence': rel['confidence'],
                'triplet_format': f"({rel['subject']}) —[{rel['predicate']}]—> ({rel['object']})"
            }
            triplets.append(triplet)
        
        return triplets
    
    def process_document(self, text: str) -> Dict[str, Any]:
        """Process a document and extract all NLP information"""
        # Extract entities using both methods
        regex_entities = self.extract_entities_regex(text)
        spacy_entities = self.extract_entities_spacy(text) if self.nlp else []
        
        # Combine and deduplicate entities
        all_entities = regex_entities + spacy_entities
        unique_entities = []
        seen_texts = set()
        
        for entity in all_entities:
            if entity['text'].lower() not in seen_texts:
                unique_entities.append(entity)
                seen_texts.add(entity['text'].lower())
        
        # Extract relationships
        relationships = self.extract_relationships(text, unique_entities)
        
        # Create triplets
        triplets = self.create_knowledge_triplets(relationships)
        
        return {
            'entities': unique_entities,
            'relationships': relationships,
            'triplets': triplets,
            'entity_count': len(unique_entities),
            'relationship_count': len(relationships),
            'triplet_count': len(triplets)
        }
    
    def process_crawled_data(self, input_file: str, output_file: str):
        """Process crawled data and add NLP annotations"""
        with open(input_file, 'r', encoding='utf-8') as f:
            crawled_data = json.load(f)
        
        processed_data = []
        
        for page in crawled_data:
            print(f"Processing: {page['title']}")
            
            # Process page content
            nlp_results = self.process_document(page['content'])
            
            # Add NLP results to page data
            page['nlp'] = nlp_results
            processed_data.append(page)
        
        # Save processed data
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(processed_data, f, indent=2, ensure_ascii=False)
        
        print(f"Processed {len(processed_data)} documents")
        print(f"Total entities: {sum(page['nlp']['entity_count'] for page in processed_data)}")
        print(f"Total relationships: {sum(page['nlp']['relationship_count'] for page in processed_data)}")

# Example usage
if __name__ == "__main__":
    processor = SatelliteNLPProcessor()
    
    # Sample text for testing
    sample_text = """
    INSAT-3D provides atmospheric temperature and humidity profiles for weather forecasting.
    MOSDAC offers API services for accessing meteorological data products.
    The satellite data contains real-time measurements of sea surface temperature.
    Users can access INSAT-3D data through REST API endpoints provided by ISRO.
    """
    
    # Process sample text
    results = processor.process_document(sample_text)
    
    print("Extracted Entities:")
    for entity in results['entities']:
        print(f"  {entity['text']} ({entity['label']}) - {entity['confidence']:.2f}")
    
    print("\nExtracted Relationships:")
    for rel in results['relationships']:
        print(f"  {rel['subject']} —[{rel['predicate']}]—> {rel['object']}")
    
    print("\nKnowledge Triplets:")
    for triplet in results['triplets']:
        print(f"  {triplet['triplet_format']}")
    
    # Process crawled data if available
    try:
        processor.process_crawled_data('mosdac_crawled_data.json', 'processed_nlp_data.json')
    except FileNotFoundError:
        print("Crawled data file not found. Run web crawler first.")
