const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Laptop = require('./src/models/Laptop');

dotenv.config();

const brands = ['apple', 'dell', 'hp', 'lenovo', 'asus', 'acer', 'msi', 'razer', 'samsung'];
const categories = ['ultrabook', 'gaming', 'workstation', 'budget', 'convertible', 'business'];
const processors = [
  'Intel Core i5-1135G7',
  'Intel Core i7-1165G7',
  'Intel Core i9-11900H',
  'AMD Ryzen 5 5600U',
  'AMD Ryzen 7 5800H',
  'AMD Ryzen 9 5900HX',
  'Intel Core i5-1240P',
  'Intel Core i7-1260P',
  'Apple M1',
  'Apple M1 Pro',
  'Apple M1 Max',
  'Intel Core i3-1115G4'
];
const gpus = [
  'Intel Iris Xe',
  'NVIDIA GeForce RTX 3050',
  'NVIDIA GeForce RTX 3060',
  'NVIDIA GeForce RTX 3070',
  'NVIDIA GeForce RTX 3080',
  'NVIDIA GeForce GTX 1650',
  'AMD Radeon RX 6600M',
  'AMD Radeon RX 6800M',
  'Apple M1 8-core GPU',
  'NVIDIA GeForce RTX 4050',
  'NVIDIA GeForce RTX 4060',
  'NVIDIA GeForce RTX 4070'
];
const storageOptions = ['256GB SSD', '512GB SSD', '1TB SSD', '2TB SSD', '512GB HDD + 256GB SSD'];
const resolutions = ['1920x1080', '2560x1440', '2880x1800', '3840x2160', '3456x2234'];
const displaySizes = [13.3, 14, 15.6, 16, 17.3];

const brandModels = {
  apple: ['MacBook Air', 'MacBook Pro 13"', 'MacBook Pro 14"', 'MacBook Pro 16"'],
  dell: ['XPS 13', 'XPS 15', 'Inspiron 15', 'Alienware m15', 'Latitude 14'],
  hp: ['Spectre x360', 'Envy 13', 'Pavilion 15', 'Omen 16', 'EliteBook'],
  lenovo: ['ThinkPad X1 Carbon', 'Yoga 9i', 'Legion 5', 'IdeaPad 5', 'ThinkPad T14'],
  asus: ['ZenBook 14', 'ROG Zephyrus G14', 'VivoBook 15', 'TUF Gaming', 'ProArt StudioBook'],
  acer: ['Swift 3', 'Predator Helios 300', 'Aspire 5', 'Nitro 5', 'ConceptD 3'],
  msi: ['Stealth 15M', 'Raider GE76', 'Prestige 14', 'Crosshair 15', 'Vector GP66'],
  razer: ['Blade 14', 'Blade 15', 'Blade 17'],
  samsung: ['Galaxy Book2 Pro', 'Galaxy Book2 360', 'Galaxy Book3 Ultra']
};

const generateLaptopName = (brand, model) => {
  const suffixes = ['Plus', 'Pro', 'Max', 'Ultra', 'Elite', 'Premium'];
  const suffix = Math.random() > 0.7 ? ` ${suffixes[Math.floor(Math.random() * suffixes.length)]}` : '';
  const year = 2022 + Math.floor(Math.random() * 2);
  return `${brand.charAt(0).toUpperCase() + brand.slice(1)} ${model}${suffix} (${year})`;
};

const generatePrice = (brand, category, ram, gpu) => {
  let basePrice = 500;
  
  // Brand multiplier
  const brandMultiplier = {
    apple: 1.8,
    razer: 1.6,
    dell: 1.4,
    msi: 1.3,
    asus: 1.2,
    hp: 1.1,
    lenovo: 1.1,
    samsung: 1.2,
    acer: 1.0
  };
  
  // Category multiplier
  const categoryMultiplier = {
    gaming: 1.5,
    workstation: 1.6,
    ultrabook: 1.4,
    business: 1.3,
    convertible: 1.3,
    budget: 0.8
  };
  
  // RAM multiplier
  const ramMultiplier = {
    8: 1.0,
    16: 1.4,
    32: 2.0,
    64: 3.0
  };
  
  // GPU multiplier
  const gpuMultiplier = gpu.includes('RTX 40') ? 1.8 :
                       gpu.includes('RTX 30') ? 1.6 :
                       gpu.includes('RTX 20') ? 1.4 :
                       gpu.includes('Apple M1') ? 1.5 :
                       gpu.includes('Radeon RX') ? 1.3 : 1.0;
  
  basePrice *= brandMultiplier[brand] || 1.0;
  basePrice *= categoryMultiplier[category] || 1.0;
  basePrice *= ramMultiplier[ram] || 1.0;
  basePrice *= gpuMultiplier;
  
  // Add random variation
  basePrice *= (0.9 + Math.random() * 0.3);
  
  const currentPrice = Math.round(basePrice);
  const originalPrice = Math.round(currentPrice * (1.1 + Math.random() * 0.2));
  
  return { current: currentPrice, original: originalPrice, currency: 'EUR' };
};

const generateSpecifications = (brand, category) => {
  const ramOptions = category === 'gaming' || category === 'workstation' ? [16, 32, 64] : [8, 16];
  const ram = ramOptions[Math.floor(Math.random() * ramOptions.length)];
  
  const processor = processors[Math.floor(Math.random() * processors.length)];
  const gpu = gpus[Math.floor(Math.random() * gpus.length)];
  const storage = storageOptions[Math.floor(Math.random() * storageOptions.length)];
  const displaySize = displaySizes[Math.floor(Math.random() * displaySizes.length)];
  const resolution = resolutions[Math.floor(Math.random() * resolutions.length)];
  
  // Weight based on category and size
  const baseWeight = displaySize * 0.1;
  const categoryWeight = category === 'ultrabook' ? 0.8 : category === 'gaming' ? 1.2 : 1.0;
  const weight = Math.round((baseWeight * categoryWeight + (Math.random() * 0.5)) * 10) / 10;
  
  // Battery life based on category
  const batteryLife = category === 'gaming' ? 
    Math.floor(4 + Math.random() * 4) : 
    Math.floor(6 + Math.random() * 8);
  
  return {
    ram,
    storage,
    processor,
    gpu,
    displaySize,
    resolution,
    weight,
    batteryLife
  };
};

const generateFeatures = (brand, category) => {
  const touchscreen = category === 'convertible' ? true : Math.random() > 0.7;
  const ips = Math.random() > 0.3;
  const backlitKeyboard = category !== 'budget' ? Math.random() > 0.2 : Math.random() > 0.7;
  const fingerprintScanner = (brand === 'apple' || brand === 'dell' || brand === 'lenovo') && Math.random() > 0.4;
  
  return {
    touchscreen,
    ips,
    backlitKeyboard,
    fingerprintScanner
  };
};

const generateTags = (brand, category, specs) => {
  const tags = [category];
  
  if (brand === 'apple') tags.push('premium', 'macos');
  if (category === 'gaming') tags.push('rgb', 'high-performance');
  if (specs.ram >= 32) tags.push('high-ram');
  if (specs.weight < 1.5) tags.push('ultra-portable');
  if (specs.gpu.includes('RTX')) tags.push('ray-tracing');
  if (specs.batteryLife > 10) tags.push('long-battery');
  
  return tags;
};

const generateImages = (brand, model) => {
  const imageBase = `https://images.unsplash.com/photo-`;
  const imageIds = [
    '1496181133206-80ce9b88a853', // laptop 1
    '1593640408182-31c70c8268f5', // laptop 2
    '1593642702749-b7f2c0fbc4a5', // laptop 3
    '1611186871348-b1ce696e52c9', // laptop 4
    '1603302576837-37561b2e2302', // laptop 5
    '1499951360447-b19be8fe80f5', // laptop 6
    '1499951360447-b19be8fe80f5', // laptop 7
    '1593640408182-31c70c8268f5', // laptop 8
  ];
  
  return [
    `${imageBase}${imageIds[Math.floor(Math.random() * imageIds.length)]}?auto=format&fit=crop&w=800&q=80`
  ];
};

const generateLaptop = () => {
  const brand = brands[Math.floor(Math.random() * brands.length)];
  const category = categories[Math.floor(Math.random() * categories.length)];
  const model = brandModels[brand][Math.floor(Math.random() * brandModels[brand].length)];
  
  const name = generateLaptopName(brand, model);
  const specifications = generateSpecifications(brand, category);
  const features = generateFeatures(brand, category);
  const price = generatePrice(brand, category, specifications.ram, specifications.gpu);
  const tags = generateTags(brand, category, specifications);
  const images = generateImages(brand, model);
  
  const ratingAvg = 3.5 + Math.random() * 1.5;
  const ratingCount = Math.floor(Math.random() * 500);
  
  return {
    name,
    brand,
    model,
    specifications,
    features,
    price,
    category,
    rating: {
      average: Math.round(ratingAvg * 10) / 10,
      count: ratingCount
    },
    tags,
    images,
    stock: Math.floor(Math.random() * 50),
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/laptop-predictor');
    console.log('Connected to MongoDB');
    
    // Clear existing data
    await Laptop.deleteMany({});
    console.log('Cleared existing laptops');
    
    // Generate and insert laptops
    const laptops = [];
    const batchSize = 50;
    
    for (let i = 0; i < 200; i++) {
      laptops.push(generateLaptop());
      
      // Insert in batches
      if (laptops.length === batchSize || i === 199) {
        await Laptop.insertMany(laptops);
        console.log(`Inserted ${laptops.length} laptops (total: ${i + 1})`);
        laptops.length = 0; // Clear array
      }
    }
    
    console.log('✅ Successfully seeded 200 laptops!');
    
    // Show some statistics
    const stats = await Laptop.aggregate([
      {
        $group: {
          _id: '$brand',
          count: { $sum: 1 },
          avgPrice: { $avg: '$price.current' }
        }
      }
    ]);
    
    console.log('\n📊 Brand Distribution:');
    stats.forEach(stat => {
      console.log(`${stat._id}: ${stat.count} laptops, avg price: €${stat.avgPrice.toFixed(2)}`);
    });
    
    const categoryStats = await Laptop.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);
    
    console.log('\n📊 Category Distribution:');
    categoryStats.forEach(stat => {
      console.log(`${stat._id}: ${stat.count} laptops`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();