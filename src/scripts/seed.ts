import mongoose from "mongoose";
import { Itinerary } from "../models/Itinerary.js";
import dotenv from "dotenv";

dotenv.config();

const itineraries = [
  {
    title: "Patagonia Wild Trekking Odyssey",
    shortDescription: "Trek through the jagged peaks, cobalt glaciers, and wind-swept steppes of Southern Patagonia.",
    fullDescription: "Embark on the ultimate adventure in South America's premier wilderness. This guided trek leads you along the legendary W-Trek in Torres del Paine and deep into the glacier valleys of El Chaltén. Experience dramatic granite towers, floating icebergs in Lago Grey, and majestic views of Mount Fitz Roy. Accommodation ranges from remote mountain refugios to comfortable eco-domes.",
    coverImage: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=1200",
    destination: "Torres del Paine & El Chaltén, Chile/Argentina",
    duration: 10,
    cost: 2400,
    rating: 4.9,
    category: "Adventure",
    isPublic: true,
    creator: "admin-system-seed",
    dailyPlan: [
      {
        day: 1,
        title: "Arrival in Puerto Natales",
        activities: ["Meet the expedition guide", "Gear check and welcome dinner with Chilean lamb roast", "Briefing on Torres del Paine trail safety"]
      },
      {
        day: 2,
        title: "Trek to Las Torres Base",
        activities: ["Hike up the Ascencio Valley through beech forests", "Scramble across the moraine to the glacial lagoon", "Admire the three granite towers rising 2,800m above the landscape"]
      },
      {
        day: 3,
        title: "Nordenskjöld Lake Crossing",
        activities: ["Hike along the shores of Lake Nordenskjöld", "Watch for condors soaring above the peaks", "Arrive at Refugio Los Cuernos for a hearty dinner"]
      }
    ]
  },
  {
    title: "Maldives Luxury Overwater Retreat",
    shortDescription: "Immerse yourself in crystal waters, private overwater villas, and underwater dining in the Baa Atoll.",
    fullDescription: "Escape to a tropical paradise where sky meets ocean. This premium itinerary takes you to a private island resort inside a UNESCO World Biosphere Reserve. Unwind in your private infinity pool, snorkel with manta rays, enjoy a candlelit dinner on a deserted sandbank, and experience five-star spa treatments suspended over the lagoon.",
    coverImage: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&q=80&w=1200",
    destination: "Baa Atoll, Maldives",
    duration: 7,
    cost: 3800,
    rating: 4.8,
    category: "Beach",
    isPublic: true,
    creator: "admin-system-seed",
    dailyPlan: [
      {
        day: 1,
        title: "Seaplane Transfer & Overwater Welcome",
        activities: ["Board scenic seaplane from Malé", "Check in to private sunset overwater villa", "Sunset cocktails at the lagoon bar"]
      },
      {
        day: 2,
        title: "Manta Ray Snorkeling Safari",
        activities: ["Speedboat cruise to Hanifaru Bay", "Snorkel with marine biologists alongside giant manta rays", "Beachside seafood barbecue under the stars"]
      },
      {
        day: 3,
        title: "Wellness Spa & Floating Breakfast",
        activities: ["Indulge in a signature floating breakfast in your private pool", "90-minute aromatherapy massage at the overwater spa pavilion", "Private catamaran sail for dolphin watching"]
      }
    ]
  },
  {
    title: "Kyoto Temple & Tea Pilgrimage",
    shortDescription: "Wander through bamboo groves, historical shrines, and partake in traditional tea ceremonies in Gion.",
    fullDescription: "Unveil the cultural soul of Japan. Travel back in time through the historic districts of Kyoto, visiting the brilliant Golden Pavilion, walking through the thousands of vermilion torii gates at Fushimi Inari, and witnessing an authentic, meditative tea ceremony led by a master. Explore Gion's wooden townhouses and enjoy kaiseki dining.",
    coverImage: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=1200",
    destination: "Kyoto, Japan",
    duration: 5,
    cost: 1500,
    rating: 4.7,
    category: "Cultural",
    isPublic: true,
    creator: "admin-system-seed",
    dailyPlan: [
      {
        day: 1,
        title: "Fushimi Inari Sunset Hike",
        activities: ["Arrive in Kyoto and check into boutique Ryokan", "Hike through the Fushimi Inari shrine's mountain paths", "Enjoy hot tempura udon at a local tavern"]
      },
      {
        day: 2,
        title: "Arashiyama Bamboo & Zen Gardens",
        activities: ["Morning walk through Arashiyama Bamboo Grove", "Visit Tenryu-ji Temple and its 14th-century Zen garden", "Stroll through Gion in search of historic geisha houses"]
      },
      {
        day: 3,
        title: "Tea Masterclass & Kaiseki Dinner",
        activities: ["Participate in a private, quiet tea ceremony at a hidden temple", "Learn match-making calligraphy", "Delight in a multi-course Kaiseki dinner representing seasonal micro-ingredients"]
      }
    ]
  },
  {
    title: "Bali Spiritual Yoga Sanctuary",
    shortDescription: "Rejuvenate your soul amidst Ubud's terraced rice fields, sacred waterfalls, and yoga sessions.",
    fullDescription: "A holistic journey designed to restore physical vigor and mental tranquility. Retreat to the jungles of Ubud, Bali's cultural heart. Wake up to daily sunrise yoga overlooking deep valleys, clean your spirit at sacred water temples, trek up Mount Batur at dawn for a dramatic sunrise, and sample delicious plant-based organic meals.",
    coverImage: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=1200",
    destination: "Ubud, Bali, Indonesia",
    duration: 8,
    cost: 1200,
    rating: 4.6,
    category: "Wellness",
    isPublic: true,
    creator: "admin-system-seed",
    dailyPlan: [
      {
        day: 1,
        title: "Jungle Sanctuary Check-In",
        activities: ["Transfer to eco-wellness resort in Ubud", "Relaxing floral bath ritual", "Welcome sunset meditation"]
      },
      {
        day: 2,
        title: "Holy Water Purification",
        activities: ["Visit Tirta Empul Sacred Water Temple", "Perform traditional purification bath under spring waters", "Raw vegan lunch at a terraced valley cafe"]
      },
      {
        day: 3,
        title: "Mount Batur Volcano Sunrise",
        activities: ["03:30 AM departure to Mount Batur base", "Trek to the volcano summit for sunrise above the clouds", "Hot springs bath post-trek to soothe muscles"]
      }
    ]
  },
  {
    title: "Tuscany Culinary & Wine Feast",
    shortDescription: "Savor handmade pasta, olive oil pressings, and Chianti tastings at private vineyard estates.",
    fullDescription: "Indulge in the rich culinary heritage of Italy. Stay at an active olive farm estate in the heart of Tuscany. Learn the secrets of rolling pici pasta from local grandmothers, harvest truffles in private oak forests, tour Chianti Classico cellars to sample prestigious vintages, and explore the medieval hill towns of San Gimignano and Siena.",
    coverImage: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=1200",
    destination: "Siena & Chianti Hills, Italy",
    duration: 6,
    cost: 1900,
    rating: 4.9,
    category: "Food",
    isPublic: true,
    creator: "admin-system-seed",
    dailyPlan: [
      {
        day: 1,
        title: "Arrival at Agriturismo Farm",
        activities: ["Check into medieval villa estate", "Olive oil tasting with wood-fired sourdough", "Outdoor Welcome Dinner under grapevine canopies"]
      },
      {
        day: 2,
        title: "Truffle Hunting & Pasta Lab",
        activities: ["Woodland hike with trained Lagotto Romagnolo truffle dogs", "Hands-on cooking class preparing handmade fresh truffle tagliatelle", "Sample organic white wines"]
      },
      {
        day: 3,
        title: "Chianti Classico Wine Tour",
        activities: ["Explore Chianti cellars dating to the 16th century", "Guided wine flight with artisanal cheese pairings", "Stroll through the tower-dotted San Gimignano"]
      }
    ]
  },
  {
    title: "Florida Coast Family Caravan",
    shortDescription: "A balanced family getaway combining Orlando theme park magic with Cocoa Beach coastal relaxation.",
    fullDescription: "Make lifelong memories with a balanced family escape. Spend the first half of your trip in Orlando enjoying the world's most magical theme parks. Then, escape the crowds and drive to Cocoa Beach for sandcastle building, kayaking with manatees in the Indian River Lagoon, and exploring rocket launches at Kennedy Space Center.",
    coverImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200",
    destination: "Orlando & Cocoa Beach, Florida, USA",
    duration: 8,
    cost: 2200,
    rating: 4.5,
    category: "Family",
    isPublic: true,
    creator: "admin-system-seed",
    dailyPlan: [
      {
        day: 1,
        title: "Orlando Arrival & Resort Dinner",
        activities: ["Check into family villa resort with pool slide", "Character-themed welcoming dinner", "Watch Disney resort fireworks from the balcony"]
      },
      {
        day: 2,
        title: "Theme Park Adventures",
        activities: ["Full-day express pass access to Universal Studios", "Explore wizarding streets and ride thrill rollercoasters", "Dinner at CityWalk"]
      },
      {
        day: 3,
        title: "Cocoa Beach Coastal Drive",
        activities: ["Morning drive to the space coast", "Relax on the sand and surf at historic Cocoa Beach Pier", "Coastal campfire marshmallow roasting"]
      }
    ]
  }
];

const seedDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI;
    if (!connStr) {
      throw new Error("MONGODB_URI is not defined.");
    }
    await mongoose.connect(connStr);
    console.log("Connected to MongoDB for seeding...");

    // Clear existing
    await Itinerary.deleteMany({ creator: "admin-system-seed" });
    console.log("Cleared old seeded itineraries.");

    // Insert new
    await Itinerary.insertMany(itineraries);
    console.log("Successfully seeded 6 premium travel itineraries!");

    mongoose.connection.close();
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedDB();
