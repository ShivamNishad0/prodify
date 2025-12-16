const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tender = require('./models/Tender');

dotenv.config();

// Sample tender data
const sampleTenders = [
  {
    title: "Supply of IT Equipment for Government Offices",
    description: "Procurement of laptops, desktops, printers, and networking equipment for various government offices across the country. The equipment should be latest technology with minimum 3 years warranty and comprehensive support.",
    organization: "Ministry of Electronics and Information Technology",
    category: "IT & Software",
    tenderId: "MEITY/IT/2024/001",
    gemTenderId: "GEM/2024/IT/12345",
    estimatedValue: 50000000,
    applicationDeadline: new Date("2024-03-15"),
    openingDate: new Date("2024-03-20"),
    status: "Active",
    location: "New Delhi, Mumbai, Chennai, Kolkata",
    contactEmail: "procurement@meity.gov.in",
    contactPhone: "+91-11-2338-1234",
    documents: [
      {
        name: "Tender Document",
        url: "/documents/tender-001.pdf",
        type: "tender"
      },
      {
        name: "Technical Specifications",
        url: "/documents/specs-001.pdf",
        type: "specification"
      }
    ],
    eligibility: "Registered vendors with GST, minimum 5 years experience in IT equipment supply, ISO certification preferred",
    termsConditions: "Firm should have registered office in India, payment terms: 30% advance, 70% on delivery. Warranty period: 3 years comprehensive."
  },
  {
    title: "Construction of Rural Road Infrastructure",
    description: "Construction and maintenance of rural roads connecting villages to main highways. Includes laying of proper drainage systems, signages, and safety measures as per IRC standards.",
    organization: "Ministry of Rural Development",
    category: "Infrastructure",
    tenderId: "MORD/ROAD/2024/002",
    gemTenderId: "GEM/2024/INF/23456",
    estimatedValue: 75000000,
    applicationDeadline: new Date("2024-04-10"),
    openingDate: new Date("2024-04-15"),
    status: "Active",
    location: "Various Districts in Rajasthan",
    contactEmail: "roads@mord.gov.in",
    contactPhone: "+91-11-2334-5678",
    documents: [
      {
        name: "Tender Document",
        url: "/documents/tender-002.pdf",
        type: "tender"
      },
      {
        name: "Technical Specifications",
        url: "/documents/specs-002.pdf",
        type: "specification"
      },
      {
        name: "Corrigendum",
        url: "/documents/corrigendum-001.pdf",
        type: "corrigendum"
      }
    ],
    eligibility: "Class A civil contractors with minimum 10 years experience, valid contractor license, performance guarantee required",
    termsConditions: "Contract period: 18 months, performance security: 10% of contract value, penalty clause for delays"
  },
  {
    title: "Office Stationery and Consumables Supply",
    description: "Annual supply contract for office stationery, printing paper, pens, folders, and other consumables for government offices. Items should be of good quality and eco-friendly where possible.",
    organization: "Central Secretariat, Government of India",
    category: "Office Supplies",
    tenderId: "CS/STAT/2024/003",
    gemTenderId: "GEM/2024/OFF/34567",
    estimatedValue: 15000000,
    applicationDeadline: new Date("2024-02-28"),
    openingDate: new Date("2024-03-05"),
    status: "Active",
    location: "New Delhi",
    contactEmail: "procurement@sec.gov.in",
    contactPhone: "+91-11-2331-9876",
    documents: [
      {
        name: "Tender Document",
        url: "/documents/tender-003.pdf",
        type: "tender"
      }
    ],
    eligibility: "Authorized dealers of reputed brands, GST registration, previous experience in government supply",
    termsConditions: "Supply on as-required basis, payment within 30 days of delivery, defective items replacement within 24 hours"
  },
  {
    title: "Consultancy Services for Digital Transformation",
    description: "Engagement of experienced consultancy firm to guide and implement digital transformation initiatives across various government departments including system analysis, process reengineering, and technology implementation.",
    organization: "NITI Aayog",
    category: "Consulting Services",
    tenderId: "NITI/DIG/2024/004",
    gemTenderId: "GEM/2024/CON/45678",
    estimatedValue: 25000000,
    applicationDeadline: new Date("2024-03-25"),
    openingDate: new Date("2024-03-30"),
    status: "Active",
    location: "New Delhi",
    contactEmail: "digital@niti.gov.in",
    contactPhone: "+91-11-2309-6570",
    documents: [
      {
        name: "Tender Document",
        url: "/documents/tender-004.pdf",
        type: "tender"
      },
      {
        name: "Terms of Reference",
        url: "/documents/tor-004.pdf",
        type: "specification"
      }
    ],
    eligibility: "Top-tier consulting firms with minimum 15 years experience, relevant certifications, team of qualified professionals",
    termsConditions: "Engagement period: 24 months, travel and accommodation costs to be borne separately, IP rights with government"
  },
  {
    title: "Server Maintenance and Support Services",
    description: "Comprehensive maintenance and support for government servers including hardware maintenance, software updates, security patches, and 24x7 monitoring services.",
    organization: "National Informatics Centre",
    category: "Maintenance",
    tenderId: "NIC/SRV/2024/005",
    gemTenderId: "GEM/2024/MNT/56789",
    estimatedValue: 12000000,
    applicationDeadline: new Date("2024-02-20"),
    openingDate: new Date("2024-02-25"),
    status: "Closed",
    location: "New Delhi, Bangalore, Hyderabad",
    contactEmail: "support@nic.in",
    contactPhone: "+91-11-2338-4567",
    documents: [
      {
        name: "Tender Document",
        url: "/documents/tender-005.pdf",
        type: "tender"
      }
    ],
    eligibility: "Certified system integrators with expertise in enterprise server maintenance, 24x7 support capability",
    termsConditions: "Contract period: 36 months, SLA compliance mandatory, penalty for service downtime"
  }
];

async function seedTenders() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/crm');
    console.log('Connected to MongoDB');

    // Clear existing tenders
    await Tender.deleteMany({});
    console.log('Cleared existing tenders');

    // Insert sample tenders
    const insertedTenders = await Tender.insertMany(sampleTenders);
    console.log(`Successfully inserted ${insertedTenders.length} sample tenders`);

    // Display inserted tenders
    insertedTenders.forEach((tender, index) => {
      console.log(`${index + 1}. ${tender.title} - ${tender.organization} - ${tender.status}`);
    });

  } catch (error) {
    console.error('Error seeding tenders:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the seed function if this script is executed directly
if (require.main === module) {
  seedTenders();
}

module.exports = { seedTenders, sampleTenders };
