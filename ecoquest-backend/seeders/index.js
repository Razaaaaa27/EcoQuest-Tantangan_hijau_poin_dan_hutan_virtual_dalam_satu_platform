const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Challenge = require('../models/Challenge');
const EduContent = require('../models/EduContent');
const Forest = require('../models/Forest');

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Sample users data
const users = [
  {
    username: 'admin',
    email: process.env.ADMIN_EMAIL || 'admin@ecoquest.com',
    password: process.env.ADMIN_PASSWORD || 'admin123456',
    role: 'admin',
    profile: {
      fullName: 'Administrator EcoQuest'
    },
    gameStats: {
      level: 10,
      totalPoints: 2500,
      badges: [
        { name: 'Challenge Master', description: 'Menyelesaikan 20 challenge', earnedAt: new Date() },
        { name: 'Tree Lover', description: 'Menanam 10 pohon', earnedAt: new Date() }
      ]
    },
    statistics: {
      challengesCompleted: 25,
      treesPlanted: 15,
      wasteRecycled: 50,
      waterSaved: 200
    }
  },
  {
    username: 'RazaWarrior',
    email: 'raza@example.com',
    password: 'password123',
    role: 'user',
    profile: {
      fullName: 'Raza Warrior'
    },
    gameStats: {
      level: 12,
      totalPoints: 3450,
      badges: [
        { name: 'Tree Lover', description: 'Menanam 10 pohon', earnedAt: new Date() },
        { name: 'Challenge Master', description: 'Menyelesaikan 20 challenge', earnedAt: new Date() }
      ]
    },
    statistics: {
      challengesCompleted: 24,
      treesPlanted: 12,
      wasteRecycled: 45,
      waterSaved: 120
    }
  },
  {
    username: 'bobon_santoso',
    email: 'bobon@example.com',
    password: 'password123',
    role: 'user',
    profile: {
      fullName: 'Bobon Santoso'
    },
    gameStats: {
      level: 11,
      totalPoints: 3280,
      badges: [
        { name: 'Tree Lover', description: 'Menanam 10 pohon', earnedAt: new Date() }
      ]
    },
    statistics: {
      challengesCompleted: 18,
      treesPlanted: 8,
      wasteRecycled: 35,
      waterSaved: 95
    }
  },
  {
    username: 'tarizrizkii',
    email: 'tari@example.com',
    password: 'password123',
    role: 'user',
    profile: {
      fullName: 'Tari Rizki'
    },
    gameStats: {
      level: 10,
      totalPoints: 3150,
      badges: [
        { name: 'Tree Lover', description: 'Menanam 10 pohon', earnedAt: new Date() }
      ]
    },
    statistics: {
      challengesCompleted: 15,
      treesPlanted: 18,
      wasteRecycled: 25,
      waterSaved: 80
    }
  }
];

// Sample challenges data
const challenges = [
  {
    title: 'Sapu Bersih Pantai',
    description: 'Bergabunglah dengan komunitas untuk membersihkan pantai dari sampah plastik. Dokumentasikan dengan foto sebelum dan sesudah!',
    category: 'community',
    difficulty: 'medium',
    points: 150,
    requirements: [
      'Kumpulkan minimal 5 kantong sampah',
      'Foto sebelum dan sesudah pembersihan',
      'Lokasi di pantai atau area pesisir'
    ],
    instructions: [
      { step: 1, description: 'Siapkan alat pembersihan (sarung tangan, kantong sampah)' },
      { step: 2, description: 'Foto kondisi awal area yang akan dibersihkan' },
      { step: 3, description: 'Kumpulkan sampah minimal 5 kantong' },
      { step: 4, description: 'Foto hasil akhir area yang sudah dibersih' }
    ],
    image: 'https://example.com/beach-cleanup.jpg',
    featured: true,
    status: 'active',
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    tags: ['pantai', 'sampah', 'komunitas']
  },
  {
    title: 'Tantangan Tanam Pohon',
    description: 'Tanam minimal 1 pohon dan dokumentasikan prosesnya dari awal hingga akhir.',
    category: 'plantation',
    difficulty: 'easy',
    points: 100,
    requirements: [
      'Tanam minimal 1 pohon',
      'Dokumentasikan proses penanaman',
      'Berikan nama untuk pohon'
    ],
    instructions: [
      { step: 1, description: 'Pilih jenis pohon yang sesuai dengan lokasi' },
      { step: 2, description: 'Siapkan lubang tanam yang cukup' },
      { step: 3, description: 'Tanam pohon dengan hati-hati' },
      { step: 4, description: 'Siram dan rawat pohon' }
    ],
    status: 'active',
    tags: ['pohon', 'lingkungan', 'hijau']
  },
  {
    title: 'Hemat Daya Listrik',
    description: 'Kurangi konsumsi listrik rumah selama sepekan dan dokumentasikan hasilnya!',
    category: 'energy',
    difficulty: 'easy',
    points: 75,
    requirements: [
      'Catat penggunaan listrik harian',
      'Terapkan tips hemat listrik',
      'Bandingkan hasil dengan minggu sebelumnya'
    ],
    instructions: [
      { step: 1, description: 'Catat meter listrik setiap hari' },
      { step: 2, description: 'Matikan peralatan yang tidak digunakan' },
      { step: 3, description: 'Gunakan lampu LED' },
      { step: 4, description: 'Bandingkan hasil penghematan' }
    ],
    status: 'active',
    tags: ['listrik', 'energi', 'hemat']
  }
];

// Sample educational content
const eduContent = [
  {
    title: 'Mengapa Kita Harus Peduli Tentang Perubahan Iklim?',
    description: 'Artikel ini menjelaskan dampak perubahan iklim pada ekosistem dan kehidupan manusia secara global dan di Indonesia.',
    fullContent: `Perubahan iklim adalah perubahan jangka panjang dalam pola cuaca yang menjadi ciri khas dari lokasi tertentu. Hal ini disebabkan oleh peningkatan gas rumah kaca di atmosfer yang sebagian besar dihasilkan dari aktivitas manusia.

Dampak perubahan iklim sudah mulai dirasakan di seluruh dunia, termasuk di Indonesia. Sebagai negara kepulauan, Indonesia sangat rentan terhadap kenaikan permukaan laut. Selain itu, perubahan pola cuaca dapat menyebabkan kekeringan, kebakaran hutan, dan banjir yang lebih parah.

Penting bagi kita semua untuk memahami dan peduli tentang perubahan iklim karena akan mempengaruhi generasi saat ini dan masa depan. Dengan bertindak sekarang, kita dapat mengurangi dampak negatif dan menciptakan masa depan yang lebih berkelanjutan.`,
    type: 'article',
    category: 'Perubahan Iklim',
    thumbnail: 'https://example.com/climate-change.jpg',
    author: {
      name: 'Dr. Budi Setiawan',
      role: 'Peneliti Perubahan Iklim',
      avatar: 'https://ui-avatars.com/api/?name=Budi+Setiawan&background=random'
    },
    difficulty: 'beginner',
    readTime: 5,
    tags: ['iklim', 'lingkungan', 'global'],
    featured: true
  },
  {
    title: 'Teknik Daur Ulang Sampah Plastik di Rumah',
    description: 'Video tutorial cara mendaur ulang berbagai jenis sampah plastik menjadi barang berguna dengan alat sederhana.',
    fullContent: `Plastik adalah salah satu material yang paling banyak digunakan di dunia. Namun, plastik juga salah satu penyebab utama pencemaran lingkungan karena sulit terurai secara alami. Daur ulang adalah salah satu cara terbaik untuk mengatasi masalah sampah plastik.

Dalam video tutorial ini, Anda akan belajar cara mendaur ulang berbagai jenis sampah plastik menjadi barang-barang berguna dengan alat sederhana yang ada di rumah. Mulai dari botol plastik, kemasan makanan, hingga kantong plastik, semuanya dapat diubah menjadi pot tanaman, tempat pensil, tas, dan bahkan perhiasan unik.

Dengan mendaur ulang di rumah, Anda tidak hanya mengurangi sampah yang berakhir di tempа pembuangan, tetapi juga menghemat uang dan mengembangkan kreativitas.`,
    type: 'video',
    category: 'Pengelolaan Sampah',
    thumbnail: 'https://example.com/plastic-recycle.jpg',
    videoUrl: 'https://youtube.com/watch?v=example',
    author: {
      name: 'Siti Nurhaliza',
      role: 'Aktivis Lingkungan',
      avatar: 'https://ui-avatars.com/api/?name=Siti+Nurhaliza&background=random'
    },
    difficulty: 'intermediate',
    readTime: 15,
    tags: ['plastik', 'daur ulang', 'kreatif']
  }
];

// Seeding function
const seedDatabase = async () => {
  try {
    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      Challenge.deleteMany({}),
      EduContent.deleteMany({}),
      Forest.deleteMany({})
    ]);

    // Create users
    console.log('👥 Creating users...');
    const createdUsers = [];
    
    for (const userData of users) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = await User.create({
        ...userData,
        password: hashedPassword
      });
      createdUsers.push(user);
      
      // Create forest for each user
      await Forest.create({
        user: user._id,
        trees: [],
        forestStats: {
          achievements: [
            { name: 'Penemu Hutan', description: 'Tanam pohon pertamamu', achieved: false },
            { name: 'Kebun Mini', description: 'Tanam 5 pohon', achieved: false },
            { name: 'Tukang Kebun', description: 'Tanam 10 pohon', achieved: false },
            { name: 'Kolektor Pohon', description: 'Tanam setiap jenis pohon', achieved: false },
            { name: 'Penghijauan', description: 'Tanam 25 pohon', achieved: false }
          ]
        }
      });
    }

    // Create challenges
    console.log('🎯 Creating challenges...');
    const adminUser = createdUsers.find(u => u.role === 'admin');
    
    for (const challengeData of challenges) {
      await Challenge.create({
        ...challengeData,
        createdBy: adminUser._id
      });
    }

    // Create educational content
    console.log('📚 Creating educational content...');
    for (const contentData of eduContent) {
      await EduContent.create({
        ...contentData,
        createdBy: adminUser._id
      });
    }

    console.log('✅ Database seeded successfully!');
    console.log(`
🌱 EcoQuest Database Seeded Successfully!
📊 Created:
   - ${users.length} Users (including 1 admin)
   - ${challenges.length} Challenges  
   - ${eduContent.length} Educational Content
   - ${users.length} Forest Records

🔑 Admin Credentials:
   - Email: ${process.env.ADMIN_EMAIL || 'admin@ecoquest.com'}
   - Password: ${process.env.ADMIN_PASSWORD || 'admin123456'}

🚀 You can now start your server!
    `);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run seeder
if (require.main === module) {
  connectDB().then(seedDatabase);
}

module.exports = { seedDatabase, connectDB };