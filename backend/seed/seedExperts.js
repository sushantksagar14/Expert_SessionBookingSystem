require('dotenv').config();
const mongoose = require('mongoose');
const Expert = require('../models/Expert');

// ─── Generate time slots for next 7 days ─────────────────────────────────────
const generateSlots = () => {
    const slots = [];
    const times = [
        '09:00 AM', '10:00 AM', '11:00 AM',
        '12:00 PM', '02:00 PM', '03:00 PM',
        '04:00 PM', '05:00 PM', '06:00 PM',
    ];

    for (let d = 0; d < 7; d++) {
        const date = new Date();
        date.setDate(date.getDate() + d);
        const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD

        times.forEach((time) => {
            slots.push({ date: dateStr, time, isBooked: false });
        });
    }
    return slots;
};

const experts = [
    {
        name: 'Dr. Aryan Mehta',
        category: 'Technology',
        experience: 12,
        rating: 4.9,
        bio: 'Senior AI/ML Engineer at Google with 12+ years of experience. Specializes in deep learning, NLP, and computer vision. Mentored 200+ engineers worldwide.',
        imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AryanMehta',
        hourlyRate: 2500,
        slots: generateSlots(),
    },
    {
        name: 'Priya Sharma',
        category: 'Business',
        experience: 10,
        rating: 4.8,
        bio: 'Serial entrepreneur and startup mentor. Founded 3 successful startups, raised $15M+ in funding. Expert in business strategy, scaling, and fundraising.',
        imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=PriyaSharma',
        hourlyRate: 2000,
        slots: generateSlots(),
    },
    {
        name: 'Rahul Verma',
        category: 'Design',
        experience: 8,
        rating: 4.7,
        bio: 'Lead UX Designer with experience at Flipkart and Swiggy. Expert in design systems, user research, and product design. Designed products used by 50M+ users.',
        imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=RahulVerma',
        hourlyRate: 1800,
        slots: generateSlots(),
    },
    {
        name: 'Sneha Kapoor',
        category: 'Marketing',
        experience: 9,
        rating: 4.6,
        bio: 'Growth marketing expert with a track record of 10x ROI campaigns. Specializes in digital marketing, content strategy, and brand building.',
        imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SnehaKapoor',
        hourlyRate: 1500,
        slots: generateSlots(),
    },
    {
        name: 'Vikram Singh',
        category: 'Finance',
        experience: 15,
        rating: 4.9,
        bio: 'Chartered Financial Analyst (CFA) with 15 years in investment banking. Expert in personal finance, portfolio management, and wealth creation.',
        imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=VikramSingh',
        hourlyRate: 3000,
        slots: generateSlots(),
    },
    {
        name: 'Dr. Ananya Rao',
        category: 'Health',
        experience: 11,
        rating: 4.8,
        bio: 'Clinical psychologist and wellness coach. Specializes in stress management, work-life balance, and mental health. Helped 1000+ clients achieve wellbeing.',
        imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AnanyaRao',
        hourlyRate: 1800,
        slots: generateSlots(),
    },
    {
        name: 'Rohan Desai',
        category: 'Education',
        experience: 7,
        rating: 4.5,
        bio: 'IIT Delhi alumnus and EdTech entrepreneur. Expert in curriculum design, e-learning, and STEM education. Has taught 50,000+ students online.',
        imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=RohanDesai',
        hourlyRate: 1200,
        slots: generateSlots(),
    },
    {
        name: 'Aditi Nair',
        category: 'Legal',
        experience: 13,
        rating: 4.7,
        bio: 'Senior corporate lawyer specializing in startup law, IP rights, and M&A. Has worked on deals worth $500M+. ILS Law College gold medalist.',
        imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AditiNair',
        hourlyRate: 3500,
        slots: generateSlots(),
    },
    {
        name: 'Karthik Iyer',
        category: 'Technology',
        experience: 6,
        rating: 4.6,
        bio: 'Full-stack developer and DevOps engineer. Expert in React, Node.js, AWS, and microservices architecture. Open source contributor with 2k+ GitHub stars.',
        imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=KarthikIyer',
        hourlyRate: 1600,
        slots: generateSlots(),
    },
    {
        name: 'Meera Joshi',
        category: 'Business',
        experience: 14,
        rating: 4.9,
        bio: 'Ex-McKinsey consultant turned COO of a unicorn startup. Expert in operations, team building, and organizational transformation. MBA from IIM Ahmedabad.',
        imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MeeraJoshi',
        hourlyRate: 4000,
        slots: generateSlots(),
    },
    {
        name: 'Sanjay Gupta',
        category: 'Finance',
        experience: 10,
        rating: 4.5,
        bio: 'SEBI-registered investment advisor with expertise in Indian stock market, mutual funds, and tax planning. Manages a portfolio of ₹50Cr+.',
        imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SanjayGupta',
        hourlyRate: 2000,
        slots: generateSlots(),
    },
    {
        name: 'Divya Menon',
        category: 'Design',
        experience: 5,
        rating: 4.4,
        bio: 'Brand designer and visual strategist. Has designed identities for 100+ brands. Expert in typography, color theory, and brand storytelling.',
        imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DivyaMenon',
        hourlyRate: 1400,
        slots: generateSlots(),
    },
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB for seeding...');

        await Expert.deleteMany({});
        console.log('🗑️  Cleared existing experts');

        const inserted = await Expert.insertMany(experts);
        console.log(`✅ Seeded ${inserted.length} experts successfully`);
        console.log('📋 Expert IDs:');
        inserted.forEach((e) => console.log(`  ${e.name}: ${e._id}`));

        await mongoose.disconnect();
        console.log('✅ Seeding complete! Disconnected from MongoDB.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding error:', error.message);
        process.exit(1);
    }
};

seedDB();
