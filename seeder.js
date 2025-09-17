
const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Load env vars
dotenv.config();

// Load models
const User = require('./models/User');
const Platform = require('./models/Platform');
const Plan = require('./models/Plan');

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Initial data
const initialUsers = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin',
  },
  {
    name: 'Manager User',
    email: 'manager@example.com',
    password: 'password123',
    role: 'manager',
  },
  {
    name: 'Support User',
    email: 'support@example.com',
    password: 'password123',
    role: 'support',
  },
  {
    name: 'Regular User',
    email: 'user@example.com',
    password: 'password123',
    role: 'user',
  },
];

const initialPlatforms = [
  {
    name: 'Udemy',
    url: 'https://udemy.com',
    description: 'Online learning platform',
    logo: '/platforms/udemy.png'
  },
  {
    name: 'Coursera',
    url: 'https://coursera.org',
    description: 'Online courses from top universities',
    logo: '/platforms/coursera.png'
  },
  {
    name: 'Canva Pro',
    url: 'https://canva.com',
    description: 'Graphic design platform',
    logo: '/platforms/canva.png'
  },
];

// Import into DB
const importData = async () => {
  try {
    // Clear all collections
    await User.deleteMany();
    await Platform.deleteMany();
    await Plan.deleteMany();

    console.log('Data cleared...');

    // Create users with hashed passwords
    const hashedUsers = await Promise.all(
      initialUsers.map(async (user) => {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        return user;
      })
    );

    const createdUsers = await User.create(hashedUsers);
    console.log(`${createdUsers.length} users created`);

    // Create platforms
    const createdPlatforms = await Platform.create(initialPlatforms);
    console.log(`${createdPlatforms.length} platforms created`);

    // Create plans using platform IDs
    const initialPlans = [
      {
        name: 'Basic Plan',
        description: 'Access to basic platforms',
        price: 9.99,
        platforms: [createdPlatforms[0]._id],
        durationValue: 1,
        durationType: 'months',
        showOnHomepage: true,
        homepageOrder: 1
      },
      {
        name: 'Premium Plan',
        description: 'Access to all platforms',
        price: 19.99,
        platforms: [createdPlatforms[0]._id, createdPlatforms[1]._id],
        durationValue: 1,
        durationType: 'months',
        stickerText: 'Popular',
        stickerColor: 'green',
        showOnHomepage: true,
        homepageOrder: 2
      },
      {
        name: 'Ultimate Plan',
        description: 'Complete access to all platforms and premium content',
        price: 29.99,
        platforms: [createdPlatforms[0]._id, createdPlatforms[1]._id, createdPlatforms[2]._id],
        durationValue: 1,
        durationType: 'months',
        showOnHomepage: true,
        homepageOrder: 3
      }
    ];

    const createdPlans = await Plan.create(initialPlans);
    console.log(`${createdPlans.length} plans created`);

    console.log('Data imported!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await User.deleteMany();
    await Platform.deleteMany();
    await Plan.deleteMany();

    console.log('Data destroyed!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Check args to determine action
if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
} else {
  console.log('Please use -i to import or -d to delete data');
  process.exit();
}
