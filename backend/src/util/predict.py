import sys
import json
import pickle
import numpy as np

def predict_price(data):
    # Load the trained model
    with open('src/model/predictor.pickle', 'rb') as file:
        model = pickle.load(file)
    
    # Create feature list (same as your Python backend)
    feature_list = []
    
    # Add numerical features
    feature_list.append(data['ram'])
    feature_list.append(data['weight'])
    feature_list.append(data['touchscreen'])
    feature_list.append(data['ips'])
    
    # Categorical features encoding
    company_list = ['acer', 'apple', 'asus', 'dell', 'hp', 'lenovo', 'msi', 'other', 'toshiba']
    typename_list = ['2in1convertible', 'gaming', 'netbook', 'notebook', 'ultrabook', 'workstation']
    opsys_list = ['linux', 'mac', 'other', 'windows']
    cpu_list = ['amd', 'intelcorei3', 'intelcorei5', 'intelcorei7', 'other']
    gpu_list = ['amd', 'intel', 'nvidia']
    
    # Helper function for one-hot encoding
    def encode_feature(category_list, value):
        return [1 if category == value else 0 for category in category_list]
    
    # Add encoded features
    feature_list.extend(encode_feature(company_list, data['company']))
    feature_list.extend(encode_feature(typename_list, data['typename']))
    feature_list.extend(encode_feature(opsys_list, data['opsys']))
    feature_list.extend(encode_feature(cpu_list, data['cpu']))
    feature_list.extend(encode_feature(gpu_list, data['gpu']))
    
    # Make prediction
    prediction = model.predict([feature_list])
    price_euros = float(prediction[0])
    price_pkr = round(price_euros * 362.52, 2)
    
    return {
        'prediction': price_euros,
        'price_euros': round(price_euros, 2),
        'price_pkr': price_pkr
    }

if __name__ == '__main__':
    # Read input data from command line argument
    input_data = json.loads(sys.argv[1])
    
    # Get prediction
    result = predict_price(input_data)
    
    # Output as JSON
    print(json.dumps(result))