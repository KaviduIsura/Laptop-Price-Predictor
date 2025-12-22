// Data models for laptop features
const laptopModel = {
  companyList: ['acer', 'apple', 'asus', 'dell', 'hp', 'lenovo', 'msi', 'other', 'toshiba'],
  typeNameList: ['2in1convertible', 'gaming', 'netbook', 'notebook', 'ultrabook', 'workstation'],
  opsysList: ['linux', 'mac', 'other', 'windows'],
  cpuList: ['amd', 'intelcorei3', 'intelcorei5', 'intelcorei7', 'other'],
  gpuList: ['amd', 'intel', 'nvidia'],
  
  // Feature mapping function
  traverse: (list, value) => {
    const features = [];
    for (const item of list) {
      features.push(item === value ? 1 : 0);
    }
    return features;
  },
  
  // Prepare feature list from input data
  prepareFeatures: (data) => {
    const featureList = [];
    
    // Add numerical features
    featureList.push(parseInt(data.ram));
    featureList.push(parseFloat(data.weight));
    featureList.push(data.touchscreen === 'yes' ? 1 : 0);
    featureList.push(data.ips === 'yes' ? 1 : 0);
    
    // Add categorical features (one-hot encoded)
    featureList.push(...laptopModel.traverse(laptopModel.companyList, data.company));
    featureList.push(...laptopModel.traverse(laptopModel.typeNameList, data.typename));
    featureList.push(...laptopModel.traverse(laptopModel.opsysList, data.opsys));
    featureList.push(...laptopModel.traverse(laptopModel.cpuList, data.cpuname));
    featureList.push(...laptopModel.traverse(laptopModel.gpuList, data.gpuname));
    
    return featureList;
  }
};

module.exports = laptopModel;