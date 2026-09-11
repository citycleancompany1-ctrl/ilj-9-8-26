// 27 Main Categories and their complete Sub Category taxonomy for IndianLalaJi Platform

export interface MainCategoryDefinition {
  id: string;
  name: string;
  subCategories: string[];
  defaultIcon?: string;
}

export const CATEGORY_TAXONOMY: MainCategoryDefinition[] = [
  {
    id: 'education',
    name: 'Education',
    defaultIcon: 'GraduationCap',
    subCategories: [
      'School',
      'College',
      'Coaching Institute',
      'Tuition Centre',
      'Training Institute',
      'Vocational Institute',
      'Computer Institute',
      'Language Institute',
      'Music Academy',
      'Dance Academy',
      'Art Academy',
      'Montessori',
      'Preschool',
      'Daycare',
    ],
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    defaultIcon: 'HeartPulse',
    subCategories: [
      'General Physician',
      'Specialist Doctor',
      'Dentist',
      'Dental Clinic',
      'Eye Clinic',
      'Skin Clinic',
      'Dermatologist',
      'Physiotherapy Clinic',
      'Orthopedic Clinic',
      'Pediatric Clinic',
      'Gynecology Clinic',
      'Diagnostic Centre',
      'Pathology Lab',
      'Hospital',
      'Nursing Home',
      'Pharmacy',
      'Ayurvedic Clinic',
      'Homeopathy Clinic',
    ],
  },
  {
    id: 'beauty_wellness',
    name: 'Beauty & Wellness',
    defaultIcon: 'Scissors',
    subCategories: [
      'Beauty Salon',
      'Hair Salon',
      'Unisex Salon',
      'Barber Shop',
      'Spa',
      'Makeup Artist',
      'Nail Salon',
      'Beauty Parlour',
      'Skin Care Centre',
      'Tattoo Studio',
      'Wellness Centre',
      'Massage Centre',
    ],
  },
  {
    id: 'food_dining',
    name: 'Food & Dining',
    defaultIcon: 'Utensils',
    subCategories: [
      'Restaurant',
      'Cafe',
      'Dhaba',
      'Fast Food',
      'Bakery',
      'Sweet Shop',
      'Mithai Shop',
      'Juice Bar',
      'Ice Cream Parlour',
      'Food Stall',
      'Catering Service',
      'Cloud Kitchen',
      'Tiffin Service',
      'Food Truck',
    ],
  },
  {
    id: 'retail_shopping',
    name: 'Retail & Shopping',
    defaultIcon: 'Store',
    subCategories: [
      'Kirana Store',
      'Grocery Store',
      'Supermarket',
      'Department Store',
      'Clothing Store',
      'Garment Store',
      'Footwear Store',
      'Electronics Store',
      'Mobile Store',
      'Furniture Store',
      'Hardware Store',
      'Gift Shop',
      'Toy Store',
      'Book Store',
      'Stationery Store',
      'Cosmetic Store',
      'Jewellery Store',
      'Sports Store',
      'Optical Store',
      'Medical Store',
    ],
  },
  {
    id: 'repair_maintenance',
    name: 'Repair & Maintenance',
    defaultIcon: 'Wrench',
    subCategories: [
      'Mobile Repair',
      'Computer Repair',
      'Laptop Repair',
      'Electronics Repair',
      'AC Repair',
      'Refrigerator Repair',
      'Washing Machine Repair',
      'TV Repair',
      'Appliance Repair',
      'RO Repair',
      'CCTV Repair',
      'Printer Repair',
      'Electrical Repair',
      'Plumbing Service',
    ],
  },
  {
    id: 'automotive',
    name: 'Automotive',
    defaultIcon: 'Car',
    subCategories: [
      'Car Garage',
      'Bike Garage',
      'Auto Workshop',
      'Car Service Centre',
      'Bike Service Centre',
      'Car Repair',
      'Bike Repair',
      'Car Wash',
      'Bike Wash',
      'Car Detailing',
      'Tyre Shop',
      'Wheel Alignment Centre',
      'Auto Parts Store',
      'Battery Shop',
      'Car Accessories',
    ],
  },
  {
    id: 'photography_media',
    name: 'Photography & Media',
    defaultIcon: 'Camera',
    subCategories: [
      'Photographer',
      'Photo Studio',
      'Photography Studio',
      'Videographer',
      'Video Studio',
      'Photo & Video Studio',
      'Wedding Photographer',
      'Event Photographer',
      'Drone Photography',
      'Media Studio',
    ],
  },
  {
    id: 'legal_services',
    name: 'Legal Services',
    defaultIcon: 'Scale',
    subCategories: [
      'Lawyer',
      'Advocate',
      'Law Firm',
      'Legal Consultant',
      'Legal Advisor',
      'Notary',
      'Documentation Service',
      'Property Lawyer',
      'Corporate Lawyer',
      'Family Lawyer',
    ],
  },
  {
    id: 'finance_accounting',
    name: 'Finance & Accounting',
    defaultIcon: 'Landmark',
    subCategories: [
      'Chartered Accountant',
      'CA Firm',
      'Accountant',
      'Tax Consultant',
      'GST Consultant',
      'Income Tax Consultant',
      'Financial Consultant',
      'Investment Consultant',
      'Audit Firm',
      'Bookkeeping Service',
      'Insurance Consultant',
    ],
  },
  {
    id: 'real_estate',
    name: 'Real Estate',
    defaultIcon: 'Building2',
    subCategories: [
      'Real Estate Agency',
      'Property Dealer',
      'Property Consultant',
      'Property Broker',
      'Builder',
      'Property Developer',
      'Property Management',
      'Rental Agency',
      'Commercial Property Dealer',
      'Residential Property Dealer',
    ],
  },
  {
    id: 'travel_tourism',
    name: 'Travel & Tourism',
    defaultIcon: 'Compass',
    subCategories: [
      'Travel Agency',
      'Tour Operator',
      'Travel Consultant',
      'Holiday Planner',
      'Taxi Service',
      'Cab Service',
      'Car Rental',
      'Bus Booking',
      'Flight Booking',
      'Hotel Booking',
      'Tour Package Provider',
      'Tourist Guide',
    ],
  },
  {
    id: 'digital_it',
    name: 'Digital & IT Services',
    defaultIcon: 'Laptop',
    subCategories: [
      'Digital Marketing Agency',
      'SEO Agency',
      'Social Media Agency',
      'Web Development Agency',
      'Software Company',
      'IT Consultancy',
      'App Development Agency',
      'Graphic Design Agency',
      'Branding Agency',
      'Content Marketing Agency',
      'Web Design Agency',
      'E-commerce Agency',
    ],
  },
  {
    id: 'construction_home',
    name: 'Construction & Home Services',
    defaultIcon: 'HardHat',
    subCategories: [
      'Contractor',
      'Civil Contractor',
      'Construction Company',
      'Interior Designer',
      'Architect',
      'Home Renovation',
      'Modular Kitchen',
      'Carpenter',
      'Electrician',
      'Plumber',
      'Painter',
      'Flooring Contractor',
      'False Ceiling Contractor',
      'Waterproofing Service',
    ],
  },
  {
    id: 'professional_services',
    name: 'Professional Services',
    defaultIcon: 'Briefcase',
    subCategories: [
      'Consultant',
      'Business Consultant',
      'HR Consultant',
      'Recruitment Agency',
      'Marketing Consultant',
      'Management Consultant',
      'Event Planner',
      'Event Management Company',
      'Printing Service',
      'Advertising Agency',
      'Documentation Service',
    ],
  },
  {
    id: 'home_living',
    name: 'Home & Living',
    defaultIcon: 'Home',
    subCategories: [
      'Furniture Store',
      'Home Decor Store',
      'Mattress Store',
      'Kitchen Store',
      'Modular Kitchen',
      'Home Appliance Store',
      'Lighting Store',
      'Curtain Store',
      'Interior Design Studio',
      'Home Furnishing Store',
    ],
  },
  {
    id: 'fitness_sports',
    name: 'Fitness & Sports',
    defaultIcon: 'Dumbbell',
    subCategories: [
      'Gym',
      'Fitness Centre',
      'Yoga Studio',
      'Zumba Studio',
      'Personal Trainer',
      'Martial Arts Academy',
      'Sports Academy',
      'Swimming Academy',
      'Sports Club',
    ],
  },
  {
    id: 'automotive_transport',
    name: 'Automotive & Transport',
    defaultIcon: 'Truck',
    subCategories: [
      'Car Rental',
      'Bike Rental',
      'Taxi Service',
      'Cab Service',
      'Transport Company',
      'Logistics Company',
      'Courier Service',
      'Packers & Movers',
      'Driving School',
    ],
  },
  {
    id: 'events_entertainment',
    name: 'Events & Entertainment',
    defaultIcon: 'Sparkles',
    subCategories: [
      'Event Planner',
      'Event Management',
      'Wedding Planner',
      'Party Planner',
      'Banquet Hall',
      'Marriage Hall',
      'Event Venue',
      'DJ Service',
      'Decorator',
      'Sound & Light Service',
    ],
  },
  {
    id: 'pets_veterinary',
    name: 'Pets & Veterinary',
    defaultIcon: 'PawPrint',
    subCategories: [
      'Veterinary Clinic',
      'Pet Shop',
      'Pet Grooming',
      'Pet Training',
      'Pet Boarding',
      'Animal Hospital',
      'Pet Supplies Store',
    ],
  },
  {
    id: 'agriculture_farming',
    name: 'Agriculture & Farming',
    defaultIcon: 'Wheat',
    subCategories: [
      'Agriculture Store',
      'Seed Store',
      'Fertilizer Store',
      'Pesticide Store',
      'Farm Equipment Store',
      'Nursery',
      'Plant Nursery',
      'Dairy Farm',
      'Poultry Farm',
      'Organic Farm',
    ],
  },
  {
    id: 'manufacturing_industrial',
    name: 'Manufacturing & Industrial',
    defaultIcon: 'Factory',
    subCategories: [
      'Manufacturer',
      'Factory',
      'Industrial Supplier',
      'Machinery Supplier',
      'Equipment Supplier',
      'Packaging Company',
      'Furniture Manufacturer',
      'Textile Manufacturer',
    ],
  },
  {
    id: 'printing_stationery',
    name: 'Printing & Stationery',
    defaultIcon: 'Printer',
    subCategories: [
      'Printing Press',
      'Digital Printing',
      'Offset Printing',
      'Flex Printing',
      'Sign Board Maker',
      'Stationery Store',
      'Book Binding',
      'Photocopy Centre',
    ],
  },
  {
    id: 'jewellery_fashion',
    name: 'Jewellery & Fashion',
    defaultIcon: 'Gem',
    subCategories: [
      'Jewellery Store',
      'Gold Jewellery',
      'Silver Jewellery',
      'Diamond Jewellery',
      'Boutique',
      'Fashion Store',
      'Tailor',
      'Embroidery Service',
      'Fashion Designer',
    ],
  },
  {
    id: 'education_childcare',
    name: 'Education & Childcare',
    defaultIcon: 'Baby',
    subCategories: [
      'Preschool',
      'Montessori',
      'Daycare',
      'Play School',
      'Nursery School',
      'Kids Activity Centre',
      'Learning Centre',
    ],
  },
  {
    id: 'religious_community',
    name: 'Religious & Community Services',
    defaultIcon: 'Heart',
    subCategories: [
      'Temple',
      'Gurudwara',
      'Mosque',
      'Church',
      'Religious Centre',
      'Community Centre',
      'NGO',
      'Social Organization',
    ],
  },
  {
    id: 'accommodation_hospitality',
    name: 'Accommodation & Hospitality',
    defaultIcon: 'Bed',
    subCategories: [
      'Hotel',
      'Guest House',
      'Resort',
      'Hostel',
      'Homestay',
      'Lodge',
      'Paying Guest',
      'Banquet Hotel',
    ],
  },
];

// Helper to get all 27 Main Category names
export const getAllMainCategoryNames = (): string[] => {
  return CATEGORY_TAXONOMY.map((c) => c.name);
};

// Helper to get all Sub Categories for a given Main Category
export const getSubCategoriesForMain = (mainCatName: string): string[] => {
  const found = CATEGORY_TAXONOMY.find(
    (c) => c.name.toLowerCase().trim() === mainCatName.toLowerCase().trim()
  );
  return found ? found.subCategories : [];
};

// Helper to find Main Category for any given Sub Category
export const findMainCategoryBySubCategory = (subCatName: string): string => {
  if (!subCatName) return 'Retail & Shopping';
  const cleanSub = subCatName.toLowerCase().trim();
  for (const mainCat of CATEGORY_TAXONOMY) {
    if (mainCat.subCategories.some((sub) => sub.toLowerCase().trim() === cleanSub)) {
      return mainCat.name;
    }
  }
  // Keyword-based fallback
  if (/school|college|coaching|tuition|institute|academy|montessori/i.test(cleanSub)) {
    return 'Education';
  }
  if (/doctor|clinic|dentist|hospital|pathology|diagnostic|pharmacy|ortho|physio|ayurved/i.test(cleanSub)) {
    return 'Healthcare';
  }
  if (/salon|parlour|spa|makeup|barber/i.test(cleanSub)) {
    return 'Beauty & Wellness';
  }
  if (/restaurant|cafe|dhaba|bakery|sweet|mithai|food|kitchen|tiffin|catering/i.test(cleanSub)) {
    return 'Food & Dining';
  }
  if (/repair|service centre|appliance|plumb|electr|cctv/i.test(cleanSub)) {
    return 'Repair & Maintenance';
  }
  if (/car|bike|garage|workshop|detailing|tyre|auto/i.test(cleanSub)) {
    return 'Automotive';
  }
  if (/lawyer|advocate|law firm|legal|notary/i.test(cleanSub)) {
    return 'Legal Services';
  }
  if (/ca|chartered|tax|gst|audit|account/i.test(cleanSub)) {
    return 'Finance & Accounting';
  }
  if (/property|real estate|builder|plot|flat/i.test(cleanSub)) {
    return 'Real Estate';
  }
  if (/travel|tour|taxi|cab|flight|hotel booking/i.test(cleanSub)) {
    return 'Travel & Tourism';
  }
  if (/gym|fitness|yoga|zumba|sports|training/i.test(cleanSub)) {
    return 'Fitness & Sports';
  }
  if (/hotel|resort|lodge|guest house|homestay|pg/i.test(cleanSub)) {
    return 'Accommodation & Hospitality';
  }

  return 'Retail & Shopping';
};
