#!/usr/bin/env python3
"""
Script to fetch model card information from Hugging Face API and update YAML files.
This script will fetch comprehensive model card information for all models in the models/ directory.
"""

import os
import yaml
import requests
import time
import json
from pathlib import Path
from typing import Dict, Any, Optional
import re

class HuggingFaceModelCardFetcher:
    def __init__(self, api_token: Optional[str] = None):
        self.api_token = api_token
        self.base_url = "https://huggingface.co/api"
        self.session = requests.Session()
        if api_token:
            self.session.headers.update({"Authorization": f"Bearer {api_token}"})
    
    def fetch_model_info(self, model_id: str) -> Optional[Dict[str, Any]]:
        """Fetch model information from Hugging Face API."""
        try:
            url = f"{self.base_url}/models/{model_id}"
            response = self.session.get(url)
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            print(f"Error fetching model info for {model_id}: {e}")
            return None
    
    def fetch_model_card(self, model_id: str) -> Optional[str]:
        """Fetch model card README from Hugging Face."""
        try:
            url = f"https://huggingface.co/{model_id}/raw/main/README.md"
            response = self.session.get(url)
            if response.status_code == 200:
                return response.text
            else:
                # Try alternative paths
                alt_urls = [
                    f"https://huggingface.co/{model_id}/raw/main/README.md",
                    f"https://huggingface.co/{model_id}/raw/master/README.md",
                    f"https://huggingface.co/{model_id}/raw/main/README.md",
                ]
                for alt_url in alt_urls:
                    response = self.session.get(alt_url)
                    if response.status_code == 200:
                        return response.text
                return None
        except requests.RequestException as e:
            print(f"Error fetching model card for {model_id}: {e}")
            return None
    
    def parse_model_card(self, card_content: Optional[str], model_info: Optional[Dict[str, Any]]) -> Dict[str, Any]:
        """Parse model card content and extract structured information."""
        parsed = {
            "overview": "",
            "intended_use": [],
            "limitations": [],
            "training_data": "",
            "evaluation": [],
            "known_issues": [],
            "references": []
        }
        
        if not card_content:
            return parsed
        
        # Extract overview from the beginning of the card, skipping metadata
        lines = card_content.split('\n')
        overview_lines = []
        in_overview = True
        skip_metadata = True
        
        for line in lines[:100]:  # Look at first 100 lines for overview
            line_stripped = line.strip()
            
            # Skip metadata sections
            if line_stripped.startswith('---'):
                skip_metadata = not skip_metadata
                continue
            
            if skip_metadata and line_stripped.startswith('license:') or line_stripped.startswith('language:') or line_stripped.startswith('tags:'):
                continue
                
            if line_stripped.startswith('#'):
                if len(overview_lines) > 0:
                    break
            elif line_stripped and in_overview and not line_stripped.startswith('-') and not line_stripped.startswith('*'):
                # Only add meaningful content (not list items)
                if len(line_stripped) > 20:  # Filter out very short lines
                    overview_lines.append(line_stripped)
        
        # Take first 2-3 meaningful sentences for overview
        overview_text = ' '.join(overview_lines[:3])
        if overview_text:
            parsed["overview"] = overview_text
        
        # Extract sections using markdown headers
        sections = self._extract_sections(card_content)
        
        # Map sections to our structure
        section_mapping = {
            'intended use': 'intended_use',
            'use cases': 'intended_use',
            'applications': 'intended_use',
            'limitations': 'limitations',
            'training data': 'training_data',
            'training': 'training_data',
            'evaluation': 'evaluation',
            'benchmarks': 'evaluation',
            'performance': 'evaluation',
            'known issues': 'known_issues',
            'issues': 'known_issues',
            'references': 'references',
            'citation': 'references',
            'cite': 'references'
        }
        
        for section_name, content in sections.items():
            section_key = None
            for key, mapped_key in section_mapping.items():
                if key in section_name.lower():
                    section_key = mapped_key
                    break
            
            if section_key:
                if section_key in ['intended_use', 'limitations', 'known_issues']:
                    parsed[section_key] = self._extract_list_items(content)
                elif section_key == 'evaluation':
                    parsed[section_key] = self._extract_evaluation_metrics(content)
                elif section_key == 'references':
                    parsed[section_key] = self._extract_references(content)
                elif section_key == 'training_data':
                    parsed[section_key] = self._extract_training_data(content)
        
        # Add model info references
        if model_info:
            parsed["references"].append(f"https://huggingface.co/{model_info.get('id', '')}")
            if model_info.get('pipeline_tag'):
                parsed["intended_use"].append(f"{model_info['pipeline_tag'].title()} tasks")
        
        # Clean up and ensure we have reasonable defaults
        parsed = self._cleanup_parsed_data(parsed, model_info)
        
        return parsed
    
    def _extract_sections(self, content: str) -> Dict[str, str]:
        """Extract sections from markdown content."""
        sections = {}
        lines = content.split('\n')
        current_section = None
        current_content = []
        
        for line in lines:
            if line.strip().startswith('#'):
                if current_section:
                    sections[current_section] = '\n'.join(current_content).strip()
                current_section = line.strip('#').strip()
                current_content = []
            elif current_section:
                current_content.append(line)
        
        if current_section:
            sections[current_section] = '\n'.join(current_content).strip()
        
        return sections
    
    def _extract_list_items(self, content: str) -> list:
        """Extract list items from markdown content."""
        items = []
        lines = content.split('\n')
        for line in lines:
            line = line.strip()
            if line.startswith('- ') or line.startswith('* '):
                item = line[2:].strip()
                if item and len(item) > 10:  # Filter out very short items
                    items.append(item)
            elif line.startswith('1. '):
                item = line[3:].strip()
                if item and len(item) > 10:
                    items.append(item)
        return items[:10]  # Limit to 10 items
    
    def _extract_evaluation_metrics(self, content: str) -> list:
        """Extract evaluation metrics from content."""
        metrics = []
        # Look for common metric patterns
        patterns = [
            r'([A-Za-z0-9\s]+):\s*([0-9]+\.?[0-9]*%?)',
            r'([A-Za-z0-9\s]+)\s*=\s*([0-9]+\.?[0-9]*%?)',
            r'([A-Za-z0-9\s]+)\s*([0-9]+\.?[0-9]*%?)'
        ]
        
        # Also look for table data
        lines = content.split('\n')
        for line in lines:
            # Look for table rows with metrics
            if '|' in line and any(char.isdigit() for char in line):
                parts = [part.strip() for part in line.split('|')]
                if len(parts) >= 3:
                    metric_name = parts[0]
                    metric_value = parts[1]
                    if metric_name and metric_value and any(char.isdigit() for char in metric_value):
                        if len(metric_name) > 2 and len(metric_name) < 50:
                            metrics.append(f"{metric_name}: {metric_value}")
        
        for pattern in patterns:
            matches = re.findall(pattern, content)
            for match in matches:
                metric_name = match[0].strip()
                metric_value = match[1].strip()
                if len(metric_name) > 2 and len(metric_name) < 50:
                    # Avoid duplicates
                    metric_str = f"{metric_name}: {metric_value}"
                    if metric_str not in metrics:
                        metrics.append(metric_str)
        
        return metrics[:8]  # Limit to 8 metrics
    
    def _extract_references(self, content: str) -> list:
        """Extract references from content."""
        refs = []
        # Look for URLs
        url_pattern = r'https?://[^\s\)]+'
        urls = re.findall(url_pattern, content)
        for url in urls:
            if 'huggingface.co' in url or 'github.com' in url or 'arxiv.org' in url:
                refs.append(url)
        
        return refs[:5]  # Limit to 5 references
    
    def _extract_training_data(self, content: str) -> str:
        """Extract training data information."""
        # Look for training data related content
        lines = content.split('\n')
        training_lines = []
        for line in lines:
            line_lower = line.lower()
            if any(keyword in line_lower for keyword in ['training', 'data', 'dataset', 'corpus', 'text']):
                if len(line.strip()) > 20:
                    training_lines.append(line.strip())
        
        if training_lines:
            return ' '.join(training_lines[:2])  # Take first 2 relevant lines
        return "Training data information not specified in model card."
    
    def _cleanup_parsed_data(self, parsed: Dict[str, Any], model_info: Optional[Dict[str, Any]]) -> Dict[str, Any]:
        """Clean up and ensure reasonable defaults for parsed data."""
        # Ensure overview is not empty
        if not parsed["overview"] and model_info:
            parsed["overview"] = f"{model_info.get('name', 'This model')} is a language model available on Hugging Face."
        
        # Ensure we have some intended use cases
        if not parsed["intended_use"]:
            if model_info and model_info.get('pipeline_tag'):
                parsed["intended_use"] = [f"{model_info['pipeline_tag'].title()} tasks"]
            else:
                parsed["intended_use"] = ["Text generation", "Language modeling"]
        
        # Ensure we have some limitations
        if not parsed["limitations"]:
            parsed["limitations"] = [
                "May generate biased or harmful content",
                "Not suitable for safety-critical applications",
                "Performance may vary across different tasks and domains"
            ]
        
        # Ensure we have training data info
        if not parsed["training_data"]:
            parsed["training_data"] = "Training data information not specified in model card."
        
        # Ensure we have some evaluation metrics
        if not parsed["evaluation"]:
            parsed["evaluation"] = ["Evaluation metrics not specified in model card"]
        
        # Ensure we have some known issues
        if not parsed["known_issues"]:
            parsed["known_issues"] = [
                "May produce biased content",
                "Limited reasoning capabilities",
                "Performance varies across languages and domains"
            ]
        
        return parsed

def update_model_yaml_files(models_dir: str, api_token: Optional[str] = None):
    """Update all model YAML files with fetched model card information."""
    fetcher = HuggingFaceModelCardFetcher(api_token)
    models_path = Path(models_dir)
    
    if not models_path.exists():
        print(f"Models directory {models_dir} does not exist!")
        return
    
    yaml_files = list(models_path.glob("*.yaml"))
    print(f"Found {len(yaml_files)} model YAML files")
    
    for yaml_file in yaml_files:
        print(f"\nProcessing {yaml_file.name}...")
        
        try:
            # Read existing YAML
            with open(yaml_file, 'r', encoding='utf-8') as f:
                model_data = yaml.safe_load(f)
            
            huggingface_id = model_data.get('huggingface_id')
            if not huggingface_id:
                print(f"  No huggingface_id found in {yaml_file.name}, skipping...")
                continue
            
            print(f"  Fetching data for {huggingface_id}...")
            
            # Fetch model info and card
            model_info = fetcher.fetch_model_info(huggingface_id)
            model_card = fetcher.fetch_model_card(huggingface_id)
            
            # Parse model card
            parsed_card = fetcher.parse_model_card(model_card, model_info)
            
            # Update the model_card section
            model_data['model_card'] = parsed_card
            
            # Write back to file
            with open(yaml_file, 'w', encoding='utf-8') as f:
                yaml.dump(model_data, f, default_flow_style=False, allow_unicode=True, sort_keys=False)
            
            print(f"  ✓ Updated {yaml_file.name}")
            
            # Rate limiting
            time.sleep(1)
            
        except Exception as e:
            print(f"  ✗ Error processing {yaml_file.name}: {e}")

def main():
    """Main function to run the model card fetcher."""
    import argparse
    
    parser = argparse.ArgumentParser(description="Fetch model card information from Hugging Face")
    parser.add_argument("--models-dir", default="models", help="Directory containing model YAML files")
    parser.add_argument("--api-token", help="Hugging Face API token (optional)")
    
    args = parser.parse_args()
    
    # Check if API token is provided via environment variable
    api_token = args.api_token or os.getenv("HF_TOKEN")
    
    print("Hugging Face Model Card Fetcher")
    print("=" * 40)
    
    if not api_token:
        print("Warning: No API token provided. Some requests may be rate-limited.")
        print("Set HF_TOKEN environment variable or use --api-token for better results.")
    
    update_model_yaml_files(args.models_dir, api_token)
    
    print("\n" + "=" * 40)
    print("Model card update completed!")

if __name__ == "__main__":
    main() 