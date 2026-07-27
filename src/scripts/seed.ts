import mongoose from "mongoose";
import { Itinerary } from "../models/Itinerary.js";
import dotenv from "dotenv";

dotenv.config();

const planners = [
  {
    name: "Elena Rostova",
    email: "elena.rostova@auratravel.com",
    role: "planner",
    isOnboarded: true,
    plannerApprovalStatus: "approved",
    bio: "Certified Mountain Expedition Guide with 8+ years leading Alpine, Patagonia, and Nordic fjord treks.",
    yearsOfExperience: 8,
    portfolioUrl: "https://instagram.com/elena_alpine_guide",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400"
  },
  {
    name: "Kenji Takahashi",
    email: "kenji.takahashi@auratravel.com",
    role: "planner",
    isOnboarded: true,
    plannerApprovalStatus: "approved",
    bio: "Cultural Historian & Culinary Curator with 12 years creating Japanese tea trails and Asian street food tours.",
    yearsOfExperience: 12,
    portfolioUrl: "https://instagram.com/kenji_takahashi_culinary",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400"
  },
  {
    name: "Sophia Martinez",
    email: "sophia.martinez@auratravel.com",
    role: "planner",
    isOnboarded: true,
    plannerApprovalStatus: "approved",
    bio: "Boutique Coastal Architect & Wellness Curator with 6 years designing luxury overwater and island retreats.",
    yearsOfExperience: 6,
    portfolioUrl: "https://instagram.com/sophia_coastal_escapes",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400"
  }
];

const elenaItineraries = [
  {
    title: "Patagonia Wild Trekking Odyssey",
    shortDescription: "Trek through the jagged peaks, cobalt glaciers, and wind-swept steppes of Southern Patagonia.",
    fullDescription: "Embark on the ultimate adventure in South America's premier wilderness. This guided trek leads you along the legendary W-Trek in Torres del Paine and deep into the glacier valleys of El Chaltén. Experience dramatic granite towers, floating icebergs in Lago Grey, and majestic views of Mount Fitz Roy.",
    coverImage: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=1200",
    destination: "Torres del Paine & El Chaltén, Chile/Argentina",
    duration: 10,
    cost: 2400,
    rating: 4.9,
    category: "Adventure",
    isPublic: true,
    status: "approved",
    creator: "elena.rostova@auratravel.com",
    creatorName: "Elena Rostova",
    creatorBio: "Certified Mountain Expedition Guide with 8+ years leading Alpine, Patagonia, and Nordic fjord treks.",
    creatorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
    creatorExperience: 8,
    dailyPlan: [
      { day: 1, title: "Arrival in Puerto Natales", activities: ["Meet expedition guide", "Gear check & welcome dinner", "Briefing on trail safety"] },
      { day: 2, title: "Trek to Las Torres Base", activities: ["Hike up Ascencio Valley", "Scramble across glacial moraine", "View 2,800m granite towers"] },
      { day: 3, title: "Nordenskjöld Lake Crossing", activities: ["Hike shores of Lake Nordenskjöld", "Watch condors soaring", "Refugio Los Cuernos overnight"] }
    ]
  },
  {
    title: "Swiss Alps Eiger & Matterhorn Circuit",
    shortDescription: "Hike world-famous alpine passes under the shadows of the Eiger North Face and iconic Matterhorn Peak.",
    fullDescription: "Immerse yourself in breathtaking Swiss mountain vistas. Traverse green alpine meadows, cross wooden suspension bridges, and ascend high mountain passes near Zermatt and Grindelwald.",
    coverImage: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&q=80&w=1200",
    destination: "Grindelwald & Zermatt, Switzerland",
    duration: 7,
    cost: 2300,
    rating: 4.9,
    category: "Adventure",
    isPublic: true,
    status: "approved",
    creator: "elena.rostova@auratravel.com",
    creatorName: "Elena Rostova",
    creatorBio: "Certified Mountain Expedition Guide with 8+ years leading Alpine, Patagonia, and Nordic fjord treks.",
    creatorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
    creatorExperience: 8,
    dailyPlan: [
      { day: 1, title: "Grindelwald Arrival", activities: ["Check into mountain lodge", "Welcome fondue dinner"] },
      { day: 2, title: "Eiger Trail Hike", activities: ["Ride Jungfrau cogwheel train", "Hike directly under Eiger North Face"] }
    ]
  },
  {
    title: "Norwegian Fjords & Northern Lights Expedition",
    shortDescription: "Kayaking through mirror-like fjords by day and hunting Aurora Borealis over Lofoten peaks by night.",
    fullDescription: "Experience Arctic Norway in all its grandeur. Paddle through UNESCO-protected Nærøyfjord, scale scenic granite crests, and stay in traditional red fisherman rorbuer huts beneath glowing green skies.",
    coverImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200",
    destination: "Lofoten Islands & Tromsø, Norway",
    duration: 8,
    cost: 2650,
    rating: 4.8,
    category: "Adventure",
    isPublic: true,
    status: "approved",
    creator: "elena.rostova@auratravel.com",
    creatorName: "Elena Rostova",
    creatorBio: "Certified Mountain Expedition Guide with 8+ years leading Alpine, Patagonia, and Nordic fjord treks.",
    creatorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
    creatorExperience: 8,
    dailyPlan: [
      { day: 1, title: "Tromsø Gateway", activities: ["Arrive in Arctic capital", "Visit Polar Museum", "Night Aurora hunt"] }
    ]
  },
  {
    title: "Icelandic Glacier & Ring Road Explorer",
    shortDescription: "Explore ice caves, roaring waterfalls, geothermal geysers, and black sand beaches along Iceland's South Coast.",
    fullDescription: "A comprehensive expedition navigating Iceland's Ring Road. Walk inside Vatnajökull's crystal ice caves, witness floating icebergs at Jökulsárlón, and soak in geothermal mineral lagoons.",
    coverImage: "https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&q=80&w=1200",
    destination: "Golden Circle & Vatnajökull, Iceland",
    duration: 9,
    cost: 2850,
    rating: 4.9,
    category: "Adventure",
    isPublic: true,
    status: "approved",
    creator: "elena.rostova@auratravel.com",
    creatorName: "Elena Rostova",
    creatorBio: "Certified Mountain Expedition Guide with 8+ years leading Alpine, Patagonia, and Nordic fjord treks.",
    creatorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
    creatorExperience: 8,
    dailyPlan: [
      { day: 1, title: "Reykjavik Arrival", activities: ["Pick up 4x4 rig", "Soak in Blue Lagoon"] }
    ]
  },
  {
    title: "Dolomites High Route Via Ferrata Traverse",
    shortDescription: "Climb historic steel-cable ladders and dramatic vertical limestone peaks across the Italian Dolomites.",
    fullDescription: "For adrenaline lovers seeking unmatched mountain scenery. Traverse the Tre Cime di Lavaredo, climb protected Via Ferrata cables, and enjoy wood-fired pizza at high mountain rifugios.",
    coverImage: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&q=80&w=1200",
    destination: "Cortina d'Ampezzo, Italy",
    duration: 6,
    cost: 1950,
    rating: 4.8,
    category: "Adventure",
    isPublic: true,
    status: "approved",
    creator: "elena.rostova@auratravel.com",
    creatorName: "Elena Rostova",
    creatorBio: "Certified Mountain Expedition Guide with 8+ years leading Alpine, Patagonia, and Nordic fjord treks.",
    creatorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
    creatorExperience: 8,
    dailyPlan: [
      { day: 1, title: "Cortina Basecamp", activities: ["Equipment fitting", "Welcome pasta dinner"] }
    ]
  },
  {
    title: "New Zealand Southern Alps Ridge Pass",
    shortDescription: "Traverse turquoise alpine lakes, Mount Cook glaciers, and rainforest fjords in Aotearoa.",
    fullDescription: "Journey through Lord of the Rings landscapes. Hike the Hooker Valley Track near Aoraki / Mount Cook, cruise Milford Sound, and explore Queenstown's alpine wilderness.",
    coverImage: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=1200",
    destination: "Queenstown & Mount Cook, New Zealand",
    duration: 11,
    cost: 3300,
    rating: 5.0,
    category: "Adventure",
    isPublic: true,
    status: "approved",
    creator: "elena.rostova@auratravel.com",
    creatorName: "Elena Rostova",
    creatorBio: "Certified Mountain Expedition Guide with 8+ years leading Alpine, Patagonia, and Nordic fjord treks.",
    creatorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
    creatorExperience: 8,
    dailyPlan: [
      { day: 1, title: "Queenstown Landing", activities: ["Lake Wakatipu cruise", "Skyline Gondola sunset"] }
    ]
  },
  {
    title: "Canadian Rockies Banff & Jasper Backcountry",
    shortDescription: "Paddle Moraine Lake and trek beneath glacier-capped peaks in Alberta's national parks.",
    fullDescription: "Experience pristine North American wilderness. Drive the Icefields Parkway, hike to Lake Louise Tea House, and spot grizzly bears and elk in Banff National Park.",
    coverImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1200",
    destination: "Banff & Jasper, Alberta, Canada",
    duration: 8,
    cost: 2450,
    rating: 4.9,
    category: "Adventure",
    isPublic: true,
    status: "approved",
    creator: "elena.rostova@auratravel.com",
    creatorName: "Elena Rostova",
    creatorBio: "Certified Mountain Expedition Guide with 8+ years leading Alpine, Patagonia, and Nordic fjord treks.",
    creatorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
    creatorExperience: 8,
    dailyPlan: [
      { day: 1, title: "Calgary to Banff", activities: ["Pick up rental SUV", "Explore Banff avenue"] }
    ]
  },
  {
    title: "Peruvian Andes Inca & Salkantay Summit",
    shortDescription: "Trek high mountain passes past glacial lakes to the ancient lost citadel of Machu Picchu.",
    fullDescription: "Combine high-altitude Andean mountain wilderness with rich Quechua history. Cross Salkantay Pass at 4,600m before descending into cloud forests and entering Machu Picchu.",
    coverImage: "https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&q=80&w=1200",
    destination: "Cusco & Machu Picchu, Peru",
    duration: 7,
    cost: 1890,
    rating: 4.8,
    category: "Cultural",
    isPublic: true,
    status: "approved",
    creator: "elena.rostova@auratravel.com",
    creatorName: "Elena Rostova",
    creatorBio: "Certified Mountain Expedition Guide with 8+ years leading Alpine, Patagonia, and Nordic fjord treks.",
    creatorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
    creatorExperience: 8,
    dailyPlan: [
      { day: 1, title: "Cusco Acclimatization", activities: ["San Pedro market tour", "Coca tea tasting"] }
    ]
  },
  {
    title: "Mont Blanc 3-Country Alpine Circuit",
    shortDescription: "Circumnavigate Western Europe's highest peak across France, Italy, and Switzerland.",
    fullDescription: "Walk the renowned Tour du Mont Blanc. Sample French croissants, Italian espresso, and Swiss cheeses as you trek through high mountain passes surrounding Mont Blanc.",
    coverImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200",
    destination: "Chamonix, Courmayeur & Champex",
    duration: 10,
    cost: 2790,
    rating: 4.9,
    category: "Adventure",
    isPublic: true,
    status: "approved",
    creator: "elena.rostova@auratravel.com",
    creatorName: "Elena Rostova",
    creatorBio: "Certified Mountain Expedition Guide with 8+ years leading Alpine, Patagonia, and Nordic fjord treks.",
    creatorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
    creatorExperience: 8,
    dailyPlan: [
      { day: 1, title: "Chamonix Rendezvous", activities: ["Briefing at Aiguille du Midi cable car"] }
    ]
  },
  {
    title: "Himalayan Annapurna Sanctuary Trek",
    shortDescription: "Journey through rhododendron forests into a 360-degree mountain amphitheater of 8,000m peaks.",
    fullDescription: "Stand inside the high-altitude Annapurna Sanctuary in Nepal. Stay in traditional Gurung teahouses, cross suspended footbridges over glacial rivers, and watch sunrise over Machapuchare.",
    coverImage: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1200",
    destination: "Pokhara & Annapurna Base Camp, Nepal",
    duration: 12,
    cost: 2250,
    rating: 4.9,
    category: "Adventure",
    isPublic: true,
    status: "approved",
    creator: "elena.rostova@auratravel.com",
    creatorName: "Elena Rostova",
    creatorBio: "Certified Mountain Expedition Guide with 8+ years leading Alpine, Patagonia, and Nordic fjord treks.",
    creatorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
    creatorExperience: 8,
    dailyPlan: [
      { day: 1, title: "Kathmandu to Pokhara", activities: ["Scenic flight to Lake Phewa", "Boating past Tal Barahi"] }
    ]
  }
];

const kenjiItineraries = [
  {
    title: "Kyoto Temple & Tea Ceremony Pilgrimage",
    shortDescription: "Wander through bamboo groves, historical shrines, and partake in traditional tea ceremonies in Gion.",
    fullDescription: "Unveil the cultural soul of Japan. Travel back in time through the historic districts of Kyoto, visiting the brilliant Golden Pavilion, walking through the thousands of vermilion torii gates at Fushimi Inari, and witnessing an authentic, meditative tea ceremony led by a master.",
    coverImage: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=1200",
    destination: "Kyoto, Japan",
    duration: 5,
    cost: 1500,
    rating: 4.8,
    category: "Cultural",
    isPublic: true,
    status: "approved",
    creator: "kenji.takahashi@auratravel.com",
    creatorName: "Kenji Takahashi",
    creatorBio: "Cultural Historian & Culinary Curator with 12 years creating Japanese tea trails and Asian street food tours.",
    creatorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
    creatorExperience: 12,
    dailyPlan: [
      { day: 1, title: "Fushimi Inari Sunset Hike", activities: ["Check into Ryokan", "Walk vermilion gates", "Hot tempura udon dinner"] },
      { day: 2, title: "Arashiyama Bamboo & Zen Gardens", activities: ["Morning bamboo walk", "Tenryu-ji Zen garden", "Gion evening stroll"] }
    ]
  },
  {
    title: "Tokyo & Osaka Michelin Gastronomy Trail",
    shortDescription: "Indulge in 3-star Michelin sushi, subterranean ramen dens, and Osaka's vibrant Dotonbori food market.",
    fullDescription: "A culinary journey through Japan's foodie meccas. Learn sushi craftsmanship from legendary masters, taste A5 Wagyu beef in Kobe, and explore hidden izakayas in Golden Gai.",
    coverImage: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&q=80&w=1200",
    destination: "Tokyo & Osaka, Japan",
    duration: 6,
    cost: 2450,
    rating: 4.9,
    category: "Food",
    isPublic: true,
    status: "approved",
    creator: "kenji.takahashi@auratravel.com",
    creatorName: "Kenji Takahashi",
    creatorBio: "Cultural Historian & Culinary Curator with 12 years creating Japanese tea trails and Asian street food tours.",
    creatorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
    creatorExperience: 12,
    dailyPlan: [
      { day: 1, title: "Tsukiji Market Omakase", activities: ["Fresh tuna auction viewing", "Chef omakase breakfast"] }
    ]
  },
  {
    title: "Vietnam Gourmet Odyssey: Hanoi to Saigon",
    shortDescription: "Savor steaming Pho, crispy Bánh Mì, and egg coffee while cruising Ha Long Bay limestone karsts.",
    fullDescription: "Journey from northern Hanoi's French-colonial streets to southern Saigon. Take private cooking workshops in Hoi An, sample street food stalls in Hue, and cruise overnight in Ha Long Bay.",
    coverImage: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=1200",
    destination: "Hanoi, Hoi An & Ho Chi Minh City",
    duration: 9,
    cost: 1680,
    rating: 4.8,
    category: "Food",
    isPublic: true,
    status: "approved",
    creator: "kenji.takahashi@auratravel.com",
    creatorName: "Kenji Takahashi",
    creatorBio: "Cultural Historian & Culinary Curator with 12 years creating Japanese tea trails and Asian street food tours.",
    creatorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
    creatorExperience: 12,
    dailyPlan: [
      { day: 1, title: "Hanoi Old Quarter Food Tour", activities: ["Egg coffee tasting", "Street side Pho Ga"] }
    ]
  },
  {
    title: "Ancient Wonders of Angkor Wat & Luang Prabang",
    shortDescription: "Explore majestic Khmer stone temples and peaceful Mekong riverfront monks' morning alms rituals.",
    fullDescription: "Discover Southeast Asia's spiritual heartlands. Sunrise over Angkor Wat's reflection pool, jungle-entangled Ta Prohm temple, and the tranquility of UNESCO-listed Luang Prabang.",
    coverImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200",
    destination: "Siem Reap, Cambodia & Luang Prabang, Laos",
    duration: 7,
    cost: 1450,
    rating: 4.7,
    category: "Cultural",
    isPublic: true,
    status: "approved",
    creator: "kenji.takahashi@auratravel.com",
    creatorName: "Kenji Takahashi",
    creatorBio: "Cultural Historian & Culinary Curator with 12 years creating Japanese tea trails and Asian street food tours.",
    creatorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
    creatorExperience: 12,
    dailyPlan: [
      { day: 1, title: "Siem Reap Arrival", activities: ["Tuk-tuk night market exploration"] }
    ]
  },
  {
    title: "Thailand Secret Street Food & Island Temples",
    shortDescription: "Taste spicy Tom Yum in Bangkok night markets and relax on Koh Samui's tranquil palm beaches.",
    fullDescription: "A blend of bustling urban markets and serene island beauty. Guided Michelin-rated street food tours in Yaowarat Chinatown combined with island hopping in the Gulf of Thailand.",
    coverImage: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=80&w=1200",
    destination: "Bangkok & Koh Samui, Thailand",
    duration: 8,
    cost: 1350,
    rating: 4.8,
    category: "Food",
    isPublic: true,
    status: "approved",
    creator: "kenji.takahashi@auratravel.com",
    creatorName: "Kenji Takahashi",
    creatorBio: "Cultural Historian & Culinary Curator with 12 years creating Japanese tea trails and Asian street food tours.",
    creatorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
    creatorExperience: 12,
    dailyPlan: [
      { day: 1, title: "Bangkok Street Food Safari", activities: ["Chinatown Michelin pad thai", "Tuk tuk food tour"] }
    ]
  },
  {
    title: "Seoul K-Heritage & Gourmet Discovery",
    shortDescription: "Dine on Korean BBQ, Korean Royal Court cuisine, and explore historic Bukchon Hanok Village.",
    fullDescription: "Experience Seoul's vibrant fusion of futuristic tech and ancient palaces. Dress in Hanbok at Gyeongbokgung Palace, sample kimchi and bindietteok at Gwangjang Market.",
    coverImage: "https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&q=80&w=1200",
    destination: "Seoul & Jeju Island, South Korea",
    duration: 6,
    cost: 1850,
    rating: 4.9,
    category: "Cultural",
    isPublic: true,
    status: "approved",
    creator: "kenji.takahashi@auratravel.com",
    creatorName: "Kenji Takahashi",
    creatorBio: "Cultural Historian & Culinary Curator with 12 years creating Japanese tea trails and Asian street food tours.",
    creatorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
    creatorExperience: 12,
    dailyPlan: [
      { day: 1, title: "Bukchon Hanok Village Walk", activities: ["Traditional tea house visit", "Gwangjang market dinner"] }
    ]
  },
  {
    title: "Sacred Mount Fuji & Hakone Onsen Retreat",
    shortDescription: "Bathe in natural thermal hot springs with panoramic views of snow-capped Mount Fuji.",
    fullDescription: "Escape Tokyo's urban buzz for tranquil hot spring ryokans in Hakone. Sail Lake Ashi on a pirate ship, ride the Hakone Ropeway over volcanic valleys, and savor seasonal Kaiseki dining.",
    coverImage: "https://images.unsplash.com/photo-1492571350019-22de08371fd3?auto=format&fit=crop&q=80&w=1200",
    destination: "Hakone & Mount Fuji, Japan",
    duration: 4,
    cost: 1290,
    rating: 4.9,
    category: "Wellness",
    isPublic: true,
    status: "approved",
    creator: "kenji.takahashi@auratravel.com",
    creatorName: "Kenji Takahashi",
    creatorBio: "Cultural Historian & Culinary Curator with 12 years creating Japanese tea trails and Asian street food tours.",
    creatorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
    creatorExperience: 12,
    dailyPlan: [
      { day: 1, title: "Romancecar to Hakone", activities: ["Check into luxury Ryokan", "Private open-air onsen bath"] }
    ]
  },
  {
    title: "Taiwan Sun Moon Lake & Night Markets",
    shortDescription: "Bicycle around alpine lakes and feast on Michelin-recommended dim sum & boba tea in Taipei.",
    fullDescription: "A culinary lover's wonderland. Tour Shilin and Raohe night markets in Taipei, ride the Alishan forest railway through misty tea plantations, and cycle around Sun Moon Lake.",
    coverImage: "https://images.unsplash.com/photo-1508248467877-a640a320573e?auto=format&fit=crop&q=80&w=1200",
    destination: "Taipei, Jiufen & Sun Moon Lake, Taiwan",
    duration: 7,
    cost: 1390,
    rating: 4.8,
    category: "Food",
    isPublic: true,
    status: "approved",
    creator: "kenji.takahashi@auratravel.com",
    creatorName: "Kenji Takahashi",
    creatorBio: "Cultural Historian & Culinary Curator with 12 years creating Japanese tea trails and Asian street food tours.",
    creatorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
    creatorExperience: 12,
    dailyPlan: [
      { day: 1, title: "Taipei Night Market Extravaganza", activities: ["Din Tai Fung dumplings", "Raohe street food tour"] }
    ]
  },
  {
    title: "Uzbekistan Ancient Silk Road Odyssey",
    shortDescription: "Discover blue-tiled minarets, mosaic madrasahs, and ancient desert fortresses in Samarkand and Khiva.",
    fullDescription: "Travel back to the era of Caravans. Walk the majestic Registan Square in Samarkand, explore the walled desert oasis of Khiva, and taste traditional plov cooked over open fires.",
    coverImage: "https://images.unsplash.com/photo-1528656676402-4b2a3a55428a?auto=format&fit=crop&q=80&w=1200",
    destination: "Samarkand, Bukhara & Khiva, Uzbekistan",
    duration: 9,
    cost: 2150,
    rating: 4.9,
    category: "Cultural",
    isPublic: true,
    status: "approved",
    creator: "kenji.takahashi@auratravel.com",
    creatorName: "Kenji Takahashi",
    creatorBio: "Cultural Historian & Culinary Curator with 12 years creating Japanese tea trails and Asian street food tours.",
    creatorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
    creatorExperience: 12,
    dailyPlan: [
      { day: 1, title: "Samarkand Registan Sunset", activities: ["Registan tilework tour", "Silk Road bazaar walk"] }
    ]
  },
  {
    title: "Singapore & Penang Peranakan Food Trail",
    shortDescription: "Taste Laksa, Hainanese Chicken Rice, and Char Kway Teow in UNESCO street food capitals.",
    fullDescription: "Explore the rich fusion of Chinese, Malay, and Indian flavors. Visit Gardens by the Bay in Singapore, then head to Penang's heritage town of George Town for legendary street hawker centers.",
    coverImage: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&q=80&w=1200",
    destination: "Singapore & Penang, Malaysia",
    duration: 5,
    cost: 1650,
    rating: 4.8,
    category: "Food",
    isPublic: true,
    status: "approved",
    creator: "kenji.takahashi@auratravel.com",
    creatorName: "Kenji Takahashi",
    creatorBio: "Cultural Historian & Culinary Curator with 12 years creating Japanese tea trails and Asian street food tours.",
    creatorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
    creatorExperience: 12,
    dailyPlan: [
      { day: 1, title: "Singapore Hawker Culture", activities: ["Lau Pa Sat satay street", "Marina Bay Light show"] }
    ]
  }
];

const sophiaItineraries = [
  {
    title: "Maldives Overwater Lagoon & Reef Villa Retreat",
    shortDescription: "Immerse yourself in crystal waters, private overwater villas, and underwater dining in the Baa Atoll.",
    fullDescription: "Escape to a tropical paradise where sky meets ocean. Unwind in your private infinity pool, snorkel with manta rays inside a UNESCO World Biosphere Reserve, enjoy a candlelit dinner on a deserted sandbank, and experience five-star spa treatments.",
    coverImage: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&q=80&w=1200",
    destination: "Baa Atoll, Maldives",
    duration: 7,
    cost: 3850,
    rating: 4.9,
    category: "Beach",
    isPublic: true,
    status: "approved",
    creator: "sophia.martinez@auratravel.com",
    creatorName: "Sophia Martinez",
    creatorBio: "Boutique Coastal Architect & Wellness Curator with 6 years designing luxury overwater and island retreats.",
    creatorAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
    creatorExperience: 6,
    dailyPlan: [
      { day: 1, title: "Seaplane Transfer & Overwater Villa", activities: ["Seaplane flight from Malé", "Sunset infinity pool champagne", "Overwater bungalow check-in"] },
      { day: 2, title: "Manta Ray Snorkeling Safari", activities: ["Speedboat to Hanifaru Bay", "Snorkel with marine biologist", "Beachside seafood BBQ"] }
    ]
  },
  {
    title: "Bali Ubud Yoga & Sacred Waterfall Sanctuary",
    shortDescription: "Rejuvenate your soul amidst Ubud's terraced rice fields, sacred waterfalls, and spa sanctuaries.",
    fullDescription: "A holistic wellness immersion. Begin mornings with sunrise Vinyasa yoga overlooking jungle river valleys, receive traditional Balinese herbal massages, and bathe in sacred water temples at Tirta Empul.",
    coverImage: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=1200",
    destination: "Ubud & Canggu, Bali, Indonesia",
    duration: 8,
    cost: 1790,
    rating: 4.8,
    category: "Wellness",
    isPublic: true,
    status: "approved",
    creator: "sophia.martinez@auratravel.com",
    creatorName: "Sophia Martinez",
    creatorBio: "Boutique Coastal Architect & Wellness Curator with 6 years designing luxury overwater and island retreats.",
    creatorAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
    creatorExperience: 6,
    dailyPlan: [
      { day: 1, title: "Jungle Villa Check-in", activities: ["Welcome sound healing session", "Organic farm-to-table dinner"] }
    ]
  },
  {
    title: "Amalfi Coast Cliffside & Capri Yacht Escape",
    shortDescription: "Sail past pastel cliffside villages, lemon groves, and azure sea caves along the Italian Riviera.",
    fullDescription: "Experience Italy's most romantic coastline. Stay in cliffside boutique hotels in Positano, take a private speedboat to Capri's Blue Grotto, and sample limoncello in Ravello's cliffside gardens.",
    coverImage: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=1200",
    destination: "Positano, Capri & Ravello, Italy",
    duration: 6,
    cost: 3450,
    rating: 4.9,
    category: "Beach",
    isPublic: true,
    status: "approved",
    creator: "sophia.martinez@auratravel.com",
    creatorName: "Sophia Martinez",
    creatorBio: "Boutique Coastal Architect & Wellness Curator with 6 years designing luxury overwater and island retreats.",
    creatorAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
    creatorExperience: 6,
    dailyPlan: [
      { day: 1, title: "Positano Arrival", activities: ["Check into cliffside suite", "Apperitifs watching sunset"] }
    ]
  },
  {
    title: "Santorini Caldera Sunset & Aegean Sailing",
    shortDescription: "Relax in whitewashed cave villas, sip Assyrtiko wines, and sail past volcanic Aegean islands.",
    fullDescription: "The ultimate Greek island dream. Marvel at Oia's world-famous sunsets from your private plunge pool, visit ancient Akrotiri ruins, and catamaran sail through the volcanic caldera.",
    coverImage: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&q=80&w=1200",
    destination: "Oia & Fira, Santorini, Greece",
    duration: 6,
    cost: 2950,
    rating: 4.9,
    category: "Beach",
    isPublic: true,
    status: "approved",
    creator: "sophia.martinez@auratravel.com",
    creatorName: "Sophia Martinez",
    creatorBio: "Boutique Coastal Architect & Wellness Curator with 6 years designing luxury overwater and island retreats.",
    creatorAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
    creatorExperience: 6,
    dailyPlan: [
      { day: 1, title: "Oia Cave Suite Welcome", activities: ["Wine tasting at cliffside vineyard"] }
    ]
  },
  {
    title: "Seychelles Coral Atoll & Granite Island Escape",
    shortDescription: "Unwind on Anse Source d'Argent's pink sands and explore giant tortoise sanctuaries.",
    fullDescription: "Discover pristine Indian Ocean paradises. Swim alongside sea turtles, walk through Vallee de Mai's Coco de Mer palms, and stay at eco-luxury beach villas on La Digue and Praslin.",
    coverImage: "https://images.unsplash.com/photo-1589553460732-58ef7a71fbb5?auto=format&fit=crop&q=80&w=1200",
    destination: "Mahé, Praslin & La Digue, Seychelles",
    duration: 8,
    cost: 4150,
    rating: 5.0,
    category: "Beach",
    isPublic: true,
    status: "approved",
    creator: "sophia.martinez@auratravel.com",
    creatorName: "Sophia Martinez",
    creatorBio: "Boutique Coastal Architect & Wellness Curator with 6 years designing luxury overwater and island retreats.",
    creatorAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
    creatorExperience: 6,
    dailyPlan: [
      { day: 1, title: "Mahé Island Landing", activities: ["Private helicopter transfer to resort"] }
    ]
  },
  {
    title: "Riviera Maya Maya Cenotes & Spa Retreat",
    shortDescription: "Swim in subterranean crystal cenotes, practice beachfront yoga, and explore Tulum ruins.",
    fullDescription: "Reconnect body and mind in the Mexican Caribbean. Stay in jungle-immersed eco-resorts, experience traditional Mayan Temazcal sweat lodge rituals, and dine on gourmet Caribbean cuisine.",
    coverImage: "https://images.unsplash.com/photo-1518638150340-f706e86654de?auto=format&fit=crop&q=80&w=1200",
    destination: "Tulum & Akumal, Mexico",
    duration: 5,
    cost: 1990,
    rating: 4.8,
    category: "Wellness",
    isPublic: true,
    status: "approved",
    creator: "sophia.martinez@auratravel.com",
    creatorName: "Sophia Martinez",
    creatorBio: "Boutique Coastal Architect & Wellness Curator with 6 years designing luxury overwater and island retreats.",
    creatorAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
    creatorExperience: 6,
    dailyPlan: [
      { day: 1, title: "Tulum Eco-Lodge Arrival", activities: ["Sunset beach Mayan ritual"] }
    ]
  },
  {
    title: "French Riviera St. Tropez & Monaco Luxury Cruise",
    shortDescription: "Charter private yachts across the Cote d'Azur, stroll Cannes promenades, and dine in Monaco.",
    fullDescription: "Experience French Riviera Mediterranean elegance. Stay at iconic Grand-Hôtels in Cap-Ferrat, tour hillside perfume laboratories in Grasse, and sail azure bays.",
    coverImage: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=1200",
    destination: "Nice, St. Tropez & Monaco",
    duration: 7,
    cost: 4550,
    rating: 4.9,
    category: "Beach",
    isPublic: true,
    status: "approved",
    creator: "sophia.martinez@auratravel.com",
    creatorName: "Sophia Martinez",
    creatorBio: "Boutique Coastal Architect & Wellness Curator with 6 years designing luxury overwater and island retreats.",
    creatorAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
    creatorExperience: 6,
    dailyPlan: [
      { day: 1, title: "Nice Airport Helicopter", activities: ["Fly to Monaco Grand Hotel"] }
    ]
  },
  {
    title: "Bora Bora Blue Lagoon & Bungalow Escape",
    shortDescription: "Wake up over turquoise lagoon waters under Mount Otemanu in French Polynesia.",
    fullDescription: "The crown jewel of the South Pacific. Stay in glass-bottomed overwater bungalows, feed gentle stingrays in turquoise shallows, and enjoy Polynesian canoe breakfast deliveries.",
    coverImage: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=80&w=1200",
    destination: "Bora Bora, French Polynesia",
    duration: 6,
    cost: 5250,
    rating: 5.0,
    category: "Beach",
    isPublic: true,
    status: "approved",
    creator: "sophia.martinez@auratravel.com",
    creatorName: "Sophia Martinez",
    creatorBio: "Boutique Coastal Architect & Wellness Curator with 6 years designing luxury overwater and island retreats.",
    creatorAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
    creatorExperience: 6,
    dailyPlan: [
      { day: 1, title: "Bora Bora Boat Arrival", activities: ["Flower lei greeting", "Overwater villa check-in"] }
    ]
  },
  {
    title: "Algarve Secret Sea Caves & Coastal Walk",
    shortDescription: "Explore Benagil sea cave arches, golden sandstone cliffs, and fresh sardine feasts in Southern Portugal.",
    fullDescription: "Portugal's sun-drenched southern coast. Standup paddleboard inside cathedral-like sea caves, walk the Seven Hanging Valleys Trail, and unwind at oceanfront boutique resorts.",
    coverImage: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&q=80&w=1200",
    destination: "Lagos & Carvoeiro, Algarve, Portugal",
    duration: 6,
    cost: 1890,
    rating: 4.8,
    category: "Beach",
    isPublic: true,
    status: "approved",
    creator: "sophia.martinez@auratravel.com",
    creatorName: "Sophia Martinez",
    creatorBio: "Boutique Coastal Architect & Wellness Curator with 6 years designing luxury overwater and island retreats.",
    creatorAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
    creatorExperience: 6,
    dailyPlan: [
      { day: 1, title: "Faro to Lagos", activities: ["Lagos old town walking tour", "Sunset over Ponta da Piedade"] }
    ]
  },
  {
    title: "Costa Rica Pacific Surf & Rainforest Wellness",
    shortDescription: "Combine Pacific ocean surf lessons, hot spring thermal baths, and sloths in Manuel Antonio.",
    fullDescription: "Embrace the Pura Vida lifestyle. Zip-line through Arenal volcano rainforest canopies, practice yoga on Nosara's sands, and relax in volcanic hot spring waterfalls.",
    coverImage: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80&w=1200",
    destination: "Arenal & Nosara, Costa Rica",
    duration: 7,
    cost: 2150,
    rating: 4.9,
    category: "Wellness",
    isPublic: true,
    status: "approved",
    creator: "sophia.martinez@auratravel.com",
    creatorName: "Sophia Martinez",
    creatorBio: "Boutique Coastal Architect & Wellness Curator with 6 years designing luxury overwater and island retreats.",
    creatorAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
    creatorExperience: 6,
    dailyPlan: [
      { day: 1, title: "San José to Arenal", activities: ["Drive past coffee plantations", "Thermal hot springs soak"] }
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
    console.log("Connected to MongoDB for 3-planner seeding...");

    const db = mongoose.connection.db;

    // 1. Seed or Upsert Planner Users in `user` collection
    for (const p of planners) {
      await db?.collection("user").updateOne(
        { email: p.email },
        {
          $set: {
            name: p.name,
            email: p.email,
            role: p.role,
            isOnboarded: p.isOnboarded,
            plannerApprovalStatus: p.plannerApprovalStatus,
            bio: p.bio,
            yearsOfExperience: p.yearsOfExperience,
            portfolioUrl: p.portfolioUrl,
            image: p.image,
            updatedAt: new Date()
          }
        },
        { upsert: true }
      );
    }
    console.log("Seeded 3 distinct Planner Profiles in user collection!");

    // Get planner user IDs from DB
    const elenaUser = await db?.collection("user").findOne({ email: "elena.rostova@auratravel.com" });
    const kenjiUser = await db?.collection("user").findOne({ email: "kenji.takahashi@auratravel.com" });
    const sophiaUser = await db?.collection("user").findOne({ email: "sophia.martinez@auratravel.com" });

    const elenaId = elenaUser?._id.toString() || "elena.rostova@auratravel.com";
    const kenjiId = kenjiUser?._id.toString() || "kenji.takahashi@auratravel.com";
    const sophiaId = sophiaUser?._id.toString() || "sophia.martinez@auratravel.com";

    // Set real user ID on creator field
    const allItineraries = [
      ...elenaItineraries.map((it) => ({ ...it, creator: elenaId })),
      ...kenjiItineraries.map((it) => ({ ...it, creator: kenjiId })),
      ...sophiaItineraries.map((it) => ({ ...it, creator: sophiaId }))
    ];

    // 2. Clear ALL old itineraries
    await Itinerary.deleteMany({});
    console.log("Cleared all old itineraries.");

    // 3. Insert new 30 itineraries (10 per planner)
    await Itinerary.insertMany(allItineraries);
    console.log(`Successfully seeded ${allItineraries.length} itineraries across 3 professional planners (10 per planner)!`);

    mongoose.connection.close();
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedDB();
