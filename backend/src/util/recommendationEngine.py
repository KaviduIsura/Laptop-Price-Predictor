import sys
import json
import pickle
import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from pymongo import MongoClient
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class RecommendationEngine:
    def __init__(self):
        # Connect to MongoDB
        self.client = MongoClient(os.getenv('MONGODB_URI', 'mongodb://localhost:27017'))
        self.db = self.client['laptop-predictor']
        self.laptops_collection = self.db['laptops']
        
    def content_based_filtering(self, laptop_id, n_recommendations=10):
        """Content-based filtering using laptop features"""
        
        # Get all laptops from database
        laptops = list(self.laptops_collection.find({}))
        
        if not laptops:
            return []
        
        # Convert to DataFrame for easier processing
        df = pd.DataFrame(laptops)
        
        # Create feature strings for each laptop
        features = []
        for _, row in df.iterrows():
            feature_str = f"{row.get('brand', '')} "
            feature_str += f"{row.get('category', '')} "
            
            specs = row.get('specifications', {})
            feature_str += f"{specs.get('processor', '')} "
            feature_str += f"{specs.get('ram', '')}GB "
            feature_str += f"{specs.get('storage', '')} "
            feature_str += f"{specs.get('gpu', '')} "
            
            feature_str += f"{row.get('price', {}).get('current', 0)} "
            
            features.append(feature_str)
        
        # Create TF-IDF matrix
        vectorizer = TfidfVectorizer(stop_words='english')
        tfidf_matrix = vectorizer.fit_transform(features)
        
        # Find the target laptop
        target_idx = None
        for i, laptop in enumerate(laptops):
            if str(laptop['_id']) == laptop_id:
                target_idx = i
                break
        
        if target_idx is None:
            return []
        
        # Calculate cosine similarity
        cosine_sim = cosine_similarity(tfidf_matrix[target_idx:target_idx+1], tfidf_matrix).flatten()
        
        # Get similar laptops (excluding the target)
        similar_indices = cosine_sim.argsort()[:-n_recommendations-1:-1]
        
        # Filter out the target laptop
        similar_indices = [i for i in similar_indices if i != target_idx]
        
        # Prepare recommendations
        recommendations = []
        for idx in similar_indices[:n_recommendations]:
            laptop = laptops[idx]
            recommendations.append({
                'laptop_id': str(laptop['_id']),
                'name': laptop.get('name', ''),
                'brand': laptop.get('brand', ''),
                'price': laptop.get('price', {}).get('current', 0),
                'similarity_score': float(cosine_sim[idx]),
                'specifications': laptop.get('specifications', {})
            })
        
        return recommendations
    
    def collaborative_filtering(self, user_id, n_recommendations=10):
        """Collaborative filtering based on user preferences"""
        # This is a simplified version
        # In production, you would use a proper collaborative filtering algorithm
        
        users_collection = self.db['userpreferences']
        predictions_collection = self.db['predictionhistories']
        
        # Get current user's viewed/saved laptops
        user_prefs = users_collection.find_one({'userId': user_id})
        if not user_prefs:
            return []
        
        user_laptop_ids = [str(item['laptopId']) for item in user_prefs.get('viewedLaptops', [])]
        user_laptop_ids += [str(item['laptopId']) for item in user_prefs.get('savedLaptops', [])]
        
        # Find similar users (simplified - by usage type or budget)
        similar_users = list(users_collection.find({
            'userId': {'$ne': user_id},
            'preferences.usageType': user_prefs.get('preferences', {}).get('usageType', 'general')
        }).limit(5))
        
        # Get laptops liked by similar users
        similar_laptops = []
        for similar_user in similar_users:
            viewed = similar_user.get('viewedLaptops', [])
            saved = similar_user.get('savedLaptops', [])
            
            for item in viewed + saved:
                laptop_id = str(item.get('laptopId'))
                if laptop_id not in user_laptop_ids and laptop_id not in similar_laptops:
                    similar_laptops.append(laptop_id)
        
        # Get laptop details
        recommendations = []
        for laptop_id in similar_laptops[:n_recommendations]:
            laptop = self.laptops_collection.find_one({'_id': laptop_id})
            if laptop:
                recommendations.append({
                    'laptop_id': str(laptop['_id']),
                    'name': laptop.get('name', ''),
                    'brand': laptop.get('brand', ''),
                    'price': laptop.get('price', {}).get('current', 0),
                    'recommendation_type': 'collaborative',
                    'based_on': 'similar users'
                })
        
        return recommendations
    
    def hybrid_recommendation(self, laptop_id, user_id=None, n_recommendations=10):
        """Hybrid recommendation combining content-based and collaborative"""
        
        content_recs = self.content_based_filtering(laptop_id, n_recommendations * 2)
        
        if user_id:
            collab_recs = self.collaborative_filtering(user_id, n_recommendations * 2)
            
            # Combine and rank recommendations
            all_recs = {}
            
            # Add content-based with weight
            for rec in content_recs:
                rec_id = rec['laptop_id']
                all_recs[rec_id] = {
                    'data': rec,
                    'score': rec.get('similarity_score', 0) * 0.7  # Content weight: 70%
                }
            
            # Add collaborative with weight
            for rec in collab_recs:
                rec_id = rec['laptop_id']
                if rec_id in all_recs:
                    all_recs[rec_id]['score'] += 0.3  # Collaborative weight: 30%
                else:
                    all_recs[rec_id] = {
                        'data': rec,
                        'score': 0.3
                    }
            
            # Sort by combined score
            sorted_recs = sorted(all_recs.values(), key=lambda x: x['score'], reverse=True)
            
            return [rec['data'] for rec in sorted_recs[:n_recommendations]]
        
        return content_recs[:n_recommendations]

def main():
    if len(sys.argv) < 3:
        print(json.dumps({'error': 'Invalid arguments'}))
        sys.exit(1)
    
    method = sys.argv[1]
    engine = RecommendationEngine()
    
    if method == 'content_based':
        laptop_id = sys.argv[2]
        recommendations = engine.content_based_filtering(laptop_id)
        print(json.dumps(recommendations))
    
    elif method == 'collaborative':
        user_id = sys.argv[2]
        recommendations = engine.collaborative_filtering(user_id)
        print(json.dumps(recommendations))
    
    elif method == 'hybrid':
        if len(sys.argv) < 4:
            print(json.dumps({'error': 'Missing laptop_id or user_id'}))
            sys.exit(1)
        laptop_id = sys.argv[2]
        user_id = sys.argv[3]
        recommendations = engine.hybrid_recommendation(laptop_id, user_id)
        print(json.dumps(recommendations))
    
    else:
        print(json.dumps({'error': 'Invalid method'}))

if __name__ == '__main__':
    main()