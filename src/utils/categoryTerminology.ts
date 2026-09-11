// Category and Sub-Category Based Dynamic Terminology Engine
// Maps the 19 fixed website sections and UI labels dynamically based on Main Category -> Sub Category.
import { Shop } from '../types';
import { findMainCategoryBySubCategory } from '../data/categoryTaxonomy';

export type SectionKey =
  | 'heroBanner'
  | 'hero'
  | 'about'
  | 'features'
  | 'category'
  | 'services'
  | 'products'
  | 'courses'
  | 'videos'
  | 'offers'
  | 'gallery'
  | 'portfolio'
  | 'team'
  | 'faq'
  | 'cta'
  | 'contact'
  | 'socialMedia'
  | 'blog'
  | 'footer';

export interface SectionTerminology {
  key: SectionKey;
  number: number;
  name: string; // Dynamic section display name in Dashboard & Builder
  defaultHeading: string; // Dynamic section heading on live public website
  defaultSubtitle: string; // Dynamic section subtitle
  badgeText?: string; // Pill / badge text
  itemSingular?: string; // e.g. "Facility", "Course", "Product", "Service", "Class"
  itemPlural?: string; // e.g. "Facilities", "Courses", "Products", "Services", "Classes"
  actionLabel?: string; // e.g. "Apply for Admission", "Book Appointment", "Order on WhatsApp"
  secondaryActionLabel?: string;
  manageButtonText?: string;
  emptyStateText?: string;
}

export interface CategoryTerminology {
  mainCategory: string;
  subCategory: string;
  entityName: string; // e.g. "School", "Clinic", "Restaurant", "Store", "Gym"
  entityTypeLabel: string; // e.g. "Academic Institution", "Healthcare Centre", "Dining Outlet"
  ctaButtonText: string;
  inquiryHeading: string;
  inquirySubtitle: string;
  inquiryItemLabel: string; // e.g. "Course / Class Required", "Treatment / Specialization", "Product / Service"
  searchPlaceholder: string;
  viewAllCatalogLabel: string;
  cartBadgeLabel: string;
  catalogTabName: string;
  servicesTabName: string;
  coursesTabName: string;
  sections: Record<SectionKey, SectionTerminology>;
}

// 19 Standard Fixed Sections Base Template (Generic Retail / Service Fallback)
const createGenericSections = (entityName: string = 'Store'): Record<SectionKey, SectionTerminology> => ({
  heroBanner: {
    key: 'heroBanner',
    number: 1,
    name: 'Hero Banner',
    defaultHeading: `Welcome to Our ${entityName}`,
    defaultSubtitle: 'Discover top quality selections, verified reliability and direct merchant service.',
    actionLabel: 'Explore Catalogue',
  },
  hero: {
    key: 'hero',
    number: 2,
    name: 'Hero Section',
    defaultHeading: `Premium Quality & Trusted Service`,
    defaultSubtitle: 'Direct merchant connection with instant WhatsApp response and verified authenticity.',
    actionLabel: 'Explore Now',
    badgeText: 'Verified Merchant',
  },
  about: {
    key: 'about',
    number: 3,
    name: `About Us`,
    defaultHeading: `About Our ${entityName}`,
    defaultSubtitle: 'Our journey, dedication to excellence, and promise of quality to every customer.',
    badgeText: 'Our Legacy',
  },
  features: {
    key: 'features',
    number: 4,
    name: `Why Choose Us`,
    defaultHeading: `Why Choose Our ${entityName}`,
    defaultSubtitle: 'Top reasons customers rely on our dedicated service and transparent pricing.',
    badgeText: 'Why Us',
  },
  category: {
    key: 'category',
    number: 5,
    name: 'Category',
    defaultHeading: `Explore by Category`,
    defaultSubtitle: 'Quickly browse our collections and discover exactly what you need.',
    badgeText: 'Browse Categories',
    itemSingular: 'Category',
    itemPlural: 'Categories',
  },
  services: {
    key: 'services',
    number: 6,
    name: 'Service',
    defaultHeading: `Our Professional Services`,
    defaultSubtitle: 'Expert solutions delivered with utmost care and attention to detail.',
    badgeText: 'Specialized Services',
    itemSingular: 'Service',
    itemPlural: 'Services',
    actionLabel: 'Book Service',
  },
  products: {
    key: 'products',
    number: 7,
    name: 'Product',
    defaultHeading: `Featured Products & Catalogue`,
    defaultSubtitle: 'Handpicked, authentic items available for direct WhatsApp delivery and pickup.',
    badgeText: 'Products Catalogue',
    itemSingular: 'Product',
    itemPlural: 'Products',
    actionLabel: 'Order on WhatsApp',
  },
  courses: {
    key: 'courses',
    number: 8,
    name: 'Course',
    defaultHeading: `Training Courses & Workshops`,
    defaultSubtitle: 'Structured learning modules with practical guidance and certification.',
    badgeText: 'Skill Programs',
    itemSingular: 'Course',
    itemPlural: 'Courses',
    actionLabel: 'Enroll Now',
  },
  videos: {
    key: 'videos',
    number: 9,
    name: 'Video',
    defaultHeading: `${entityName} Videos & Demos`,
    defaultSubtitle: 'Watch our video walkthroughs, demonstrations, and store highlights.',
    badgeText: 'Video Demos',
  },
  offers: {
    key: 'offers',
    number: 10,
    name: 'Offer',
    defaultHeading: `Special Offers & Deals`,
    defaultSubtitle: 'Limited-time deals, festive coupon codes, and bundle discounts.',
    badgeText: 'Exclusive Deals',
    actionLabel: 'Claim Offer',
  },
  gallery: {
    key: 'gallery',
    number: 11,
    name: 'Photo Gallery',
    defaultHeading: `Photo Showcase & Gallery`,
    defaultSubtitle: 'A visual tour of our facilities, collections, and work atmosphere.',
    badgeText: 'Visual Tour',
  },
  portfolio: {
    key: 'portfolio',
    number: 12,
    name: 'Portfolio',
    defaultHeading: `Our Proven Work & Achievements`,
    defaultSubtitle: 'Showcase of successfully delivered assignments and satisfied client milestones.',
    badgeText: 'Client Showcases',
  },
  team: {
    key: 'team',
    number: 13,
    name: 'Team',
    defaultHeading: `Meet Our Dedicated Team`,
    defaultSubtitle: 'Passionate professionals committed to delivering outstanding results.',
    badgeText: 'Expert Staff',
    itemSingular: 'Team Member',
    itemPlural: 'Team Members',
  },
  faq: {
    key: 'faq',
    number: 14,
    name: 'FAQ',
    defaultHeading: `Frequently Asked Questions`,
    defaultSubtitle: 'Answers to the most common queries from our valued visitors and clients.',
    badgeText: 'Help & FAQs',
  },
  cta: {
    key: 'cta',
    number: 15,
    name: 'CTA',
    defaultHeading: `Ready to Get Started?`,
    defaultSubtitle: 'Connect with us today for immediate assistance or tailored quotes.',
    actionLabel: 'Contact Us Now',
    badgeText: 'Take Action',
  },
  contact: {
    key: 'contact',
    number: 16,
    name: 'Contact Us',
    defaultHeading: `Contact Our ${entityName}`,
    defaultSubtitle: 'Reach out via call, WhatsApp message, or visit our physical location.',
    badgeText: 'Direct Connect',
    actionLabel: 'Send Inquiry',
  },
  socialMedia: {
    key: 'socialMedia',
    number: 17,
    name: 'Social Media',
    defaultHeading: `Follow Us on Social Media`,
    defaultSubtitle: 'Stay updated with our latest announcements, stories, and daily updates.',
    badgeText: 'Social Channels',
  },
  blog: {
    key: 'blog',
    number: 18,
    name: 'Blog',
    defaultHeading: `Articles, News & Insights`,
    defaultSubtitle: 'Helpful tips, industry knowledge, and recent updates from our team.',
    badgeText: 'Recent Articles',
  },
  footer: {
    key: 'footer',
    number: 19,
    name: 'Footer',
    defaultHeading: `${entityName} Footer & Quick Links`,
    defaultSubtitle: 'Quick navigation, copyright, operating coordinates and policy information.',
  },
});

// Built-in specialized profiles for major sub-categories
export const SPECIALIZED_TERMINOLOGY_REGISTRY: Record<string, Partial<CategoryTerminology>> = {
  // 1. Education > School (Strict adherence to user prompt example)
  'school': {
    mainCategory: 'Education',
    subCategory: 'School',
    entityName: 'School',
    entityTypeLabel: 'Educational Institution',
    ctaButtonText: 'Apply for Admission',
    inquiryHeading: 'School Admission & General Inquiry',
    inquirySubtitle: 'Connect directly with school administration for admissions, campus visits and fee details.',
    inquiryItemLabel: 'Class / Grade Required',
    searchPlaceholder: 'Search classes, academic levels or facilities...',
    viewAllCatalogLabel: 'Explore All Classes & Levels',
    cartBadgeLabel: 'Admissions Desk',
    catalogTabName: 'Classes & Levels',
    servicesTabName: 'School Facilities',
    coursesTabName: 'Academic Programs',
    sections: {
      heroBanner: {
        key: 'heroBanner',
        number: 1,
        name: 'Hero Banner',
        defaultHeading: 'Empowering Young Minds for a Brighter Future',
        defaultSubtitle: 'Holistic education, state-of-the-art smart campus, and experienced faculty.',
        actionLabel: 'Apply for Admission',
      },
      hero: {
        key: 'hero',
        number: 2,
        name: 'Hero Section',
        defaultHeading: 'Nurturing Academic Excellence & Strong Character',
        defaultSubtitle: 'A safe, modern, and inspiring environment where every child thrives academically and creatively.',
        actionLabel: 'Apply for Admission',
        badgeText: 'Admissions Open 2026-27',
      },
      about: {
        key: 'about',
        number: 3,
        name: 'About School',
        defaultHeading: 'About Our School',
        defaultSubtitle: 'Our founding vision, academic heritage, and dedication to holistic student development.',
        badgeText: 'School Vision & Heritage',
      },
      features: {
        key: 'features',
        number: 4,
        name: 'Why Choose Our School',
        defaultHeading: 'Why Choose Our School',
        defaultSubtitle: 'Key highlights that make our institution the premier choice for your child’s educational journey.',
        badgeText: 'School Highlights',
      },
      category: {
        key: 'category',
        number: 5,
        name: 'Classes / Academic Levels',
        defaultHeading: 'Classes & Academic Levels',
        defaultSubtitle: 'From foundational pre-primary grades to advanced senior secondary streams.',
        badgeText: 'Academic Levels',
        itemSingular: 'Academic Level',
        itemPlural: 'Academic Levels',
      },
      services: {
        key: 'services',
        number: 6,
        name: 'School Facilities',
        defaultHeading: 'World-Class School Facilities',
        defaultSubtitle: 'Modern computer & science labs, smart classrooms, library, and sports infrastructure.',
        badgeText: 'Campus Facilities',
        itemSingular: 'Facility',
        itemPlural: 'Facilities',
        actionLabel: 'Explore Facilities',
      },
      products: {
        key: 'products',
        number: 7,
        name: 'Classes / Courses',
        defaultHeading: 'Classes & Curriculum',
        defaultSubtitle: 'Detailed curriculum, class offerings, and student development modules.',
        badgeText: 'Class Curriculum',
        itemSingular: 'Class / Subject',
        itemPlural: 'Classes / Subjects',
        actionLabel: 'View Curriculum Details',
      },
      courses: {
        key: 'courses',
        number: 8,
        name: 'Academic Programs',
        defaultHeading: 'Special Academic & Extracurricular Programs',
        defaultSubtitle: 'Olympiad coaching, robotics, language lab, and personality development clubs.',
        badgeText: 'Enrichment Programs',
        itemSingular: 'Program',
        itemPlural: 'Programs',
        actionLabel: 'Enroll in Program',
      },
      videos: {
        key: 'videos',
        number: 9,
        name: 'School Videos',
        defaultHeading: 'School Life & Campus Videos',
        defaultSubtitle: 'Watch our annual sports day, science exhibitions, and campus walkthrough reels.',
        badgeText: 'Campus Demos',
      },
      offers: {
        key: 'offers',
        number: 10,
        name: 'Admissions / Scholarships',
        defaultHeading: 'Admissions & Merit Scholarships',
        defaultSubtitle: 'Early registration benefits, sibling concessions, and merit-based scholarship tests.',
        badgeText: 'Scholarship Desk',
        actionLabel: 'Apply for Scholarship',
      },
      gallery: {
        key: 'gallery',
        number: 11,
        name: 'School Gallery',
        defaultHeading: 'School Campus & Event Gallery',
        defaultSubtitle: 'Glimpses of daily school life, celebrations, science fairs, and classroom activities.',
        badgeText: 'Campus Life',
      },
      portfolio: {
        key: 'portfolio',
        number: 12,
        name: 'Achievements',
        defaultHeading: 'School Achievements & Accreditations',
        defaultSubtitle: 'Board examination toppers, sports trophies, and prestigious school awards.',
        badgeText: 'Roll of Honour',
      },
      team: {
        key: 'team',
        number: 13,
        name: 'Faculty & Staff',
        defaultHeading: 'Distinguished Faculty & Leadership',
        defaultSubtitle: 'Passionate, highly qualified teachers and administrators guiding every student.',
        badgeText: 'Mentors & Educators',
        itemSingular: 'Teacher / Faculty',
        itemPlural: 'Teachers & Staff',
      },
      faq: {
        key: 'faq',
        number: 14,
        name: 'School FAQs',
        defaultHeading: 'Parent & Student FAQs',
        defaultSubtitle: 'Frequently asked questions regarding admissions, bus transport, timings, and uniform.',
        badgeText: 'Admission Help',
      },
      cta: {
        key: 'cta',
        number: 15,
        name: 'Apply for Admission',
        defaultHeading: 'Begin Your Child’s Journey to Excellence',
        defaultSubtitle: 'Admissions are open for the upcoming academic session. Limited seats per grade.',
        actionLabel: 'Apply for Admission Today',
        badgeText: 'Enrollment Open',
      },
      contact: {
        key: 'contact',
        number: 16,
        name: 'Contact School',
        defaultHeading: 'Contact School Administration',
        defaultSubtitle: 'Reach out to the Principal’s office or admissions coordinator for inquiries and campus visits.',
        badgeText: 'Admission Office',
        actionLabel: 'Submit Admission Inquiry',
      },
      socialMedia: {
        key: 'socialMedia',
        number: 17,
        name: 'Social Media',
        defaultHeading: 'Follow School Activities & Updates',
        defaultSubtitle: 'Connect with our official pages for event photos, circulars, and student spotlights.',
        badgeText: 'Official Channels',
      },
      blog: {
        key: 'blog',
        number: 18,
        name: 'School News',
        defaultHeading: 'School News & Notice Board',
        defaultSubtitle: 'Latest announcements, circulars, holiday schedules, and academic milestones.',
        badgeText: 'School Notices',
      },
      footer: {
        key: 'footer',
        number: 19,
        name: 'Footer',
        defaultHeading: 'School Footer & Important Links',
        defaultSubtitle: 'Affiliation code, school management, board registration details and quick links.',
      },
    },
  },

  // 2. Education > College / University
  'college': {
    mainCategory: 'Education',
    subCategory: 'College',
    entityName: 'College',
    entityTypeLabel: 'Higher Education Institute',
    ctaButtonText: 'Apply for Admission',
    inquiryHeading: 'Admissions & Course Counseling',
    inquirySubtitle: 'Connect directly with academic advisors for degree programs, eligibility, and fee structure.',
    inquiryItemLabel: 'Degree / Course Stream',
    searchPlaceholder: 'Search degrees, departments or faculties...',
    viewAllCatalogLabel: 'View All Degree Programs',
    cartBadgeLabel: 'Admissions Portal',
    catalogTabName: 'Departments & Degrees',
    servicesTabName: 'Campus Infrastructure',
    coursesTabName: 'Degree Programs',
    sections: {
      ...createGenericSections('College'),
      about: { ...createGenericSections('College').about, name: 'About College', defaultHeading: 'About Our College' },
      features: { ...createGenericSections('College').features, name: 'Why Choose Our College', defaultHeading: 'Why Choose Our College' },
      category: { ...createGenericSections('College').category, name: 'Departments / Faculties', defaultHeading: 'Academic Departments & Faculties' },
      services: { ...createGenericSections('College').services, name: 'Campus Facilities', defaultHeading: 'Campus & Research Facilities' },
      products: { ...createGenericSections('College').products, name: 'Courses & Degrees', defaultHeading: 'Undergraduate & Postgraduate Programs' },
      courses: { ...createGenericSections('College').courses, name: 'Specializations & Certifications', defaultHeading: 'Industry Specializations & Diploma Programs' },
      offers: { ...createGenericSections('College').offers, name: 'Scholarships & Grants', defaultHeading: 'Merit Scholarships & Financial Aid' },
      gallery: { ...createGenericSections('College').gallery, name: 'Campus Gallery', defaultHeading: 'Campus & Hostel Gallery' },
      portfolio: { ...createGenericSections('College').portfolio, name: 'Placements & Research', defaultHeading: 'Placement Records & Alumni Milestones' },
      team: { ...createGenericSections('College').team, name: 'Professors & Faculty', defaultHeading: 'Dean, Professors & Department Heads' },
      faq: { ...createGenericSections('College').faq, name: 'College FAQs', defaultHeading: 'Admissions & Eligibility FAQs' },
      cta: { ...createGenericSections('College').cta, name: 'Apply for Admission', defaultHeading: 'Secure Your Degree Seat Today', actionLabel: 'Apply for Admission' },
      contact: { ...createGenericSections('College').contact, name: 'Contact Admissions Office', defaultHeading: 'Contact College Admissions Desk' },
      blog: { ...createGenericSections('College').blog, name: 'Campus News & Events', defaultHeading: 'Campus Bulletins, Seminars & Research Papers' },
    },
  },

  // 3. Education > Coaching Institute / Tuition Centre
  'coaching institute': {
    mainCategory: 'Education',
    subCategory: 'Coaching Institute',
    entityName: 'Institute',
    entityTypeLabel: 'Coaching & Test Prep Academy',
    ctaButtonText: 'Book Free Demo Class',
    inquiryHeading: 'Batch Enrollment & Demo Booking',
    inquirySubtitle: 'Speak to our academic counselors for batch timings, study material, and test series.',
    inquiryItemLabel: 'Target Exam / Class',
    searchPlaceholder: 'Search batches, target exams or subjects...',
    viewAllCatalogLabel: 'View All Batches & Courses',
    cartBadgeLabel: 'Enquiry Desk',
    catalogTabName: 'Target Batches',
    servicesTabName: 'Test Series & Mentorship',
    coursesTabName: 'Flagship Courses',
    sections: {
      ...createGenericSections('Institute'),
      about: { ...createGenericSections('Institute').about, name: 'About Institute', defaultHeading: 'About Our Coaching Institute' },
      features: { ...createGenericSections('Institute').features, name: 'Why Choose Our Institute', defaultHeading: 'Why Choose Our Institute' },
      category: { ...createGenericSections('Institute').category, name: 'Batches & Exam Categories', defaultHeading: 'Target Exams & Batch Streams' },
      services: { ...createGenericSections('Institute').services, name: 'Doubt Clearing & Test Series', defaultHeading: 'Doubt Sessions, Mock Tests & Mentorship' },
      products: { ...createGenericSections('Institute').products, name: 'Study Modules & Notes', defaultHeading: 'Comprehensive Study Materials & Question Banks' },
      courses: { ...createGenericSections('Institute').courses, name: 'Flagship Coaching Batches', defaultHeading: 'Comprehensive Target Batches & Foundation Courses' },
      videos: { ...createGenericSections('Institute').videos, name: 'Demo Lectures & Tips', defaultHeading: 'Demo Lectures & Problem Solving Tips' },
      offers: { ...createGenericSections('Institute').offers, name: 'Scholarship Admission Test', defaultHeading: 'Scholarship Tests & Early Registration Concessions' },
      gallery: { ...createGenericSections('Institute').gallery, name: 'Classrooms & Centers', defaultHeading: 'Classroom Infrastructure & Study Library' },
      portfolio: { ...createGenericSections('Institute').portfolio, name: 'Toppers & Results', defaultHeading: 'Our Rank Holders, Selections & Testimonials' },
      team: { ...createGenericSections('Institute').team, name: 'Expert Faculty', defaultHeading: 'Subject Matter Experts & Mentors' },
      faq: { ...createGenericSections('Institute').faq, name: 'Student & Parent FAQs', defaultHeading: 'Batch Timings, Fees & Preparation FAQs' },
      cta: { ...createGenericSections('Institute').cta, name: 'Enroll in Batch', defaultHeading: 'Cracking Your Dream Exam Starts Today', actionLabel: 'Book Free Demo Class' },
      contact: { ...createGenericSections('Institute').contact, name: 'Contact Institute', defaultHeading: 'Contact Our Academic Center' },
      blog: { ...createGenericSections('Institute').blog, name: 'Exam Updates & Tips', defaultHeading: 'Exam Notifications, Cut-offs & Strategy Guides' },
    },
  },

  // 4. Healthcare > Doctor / Clinic / Hospital
  'general physician': {
    mainCategory: 'Healthcare',
    subCategory: 'General Physician',
    entityName: 'Clinic',
    entityTypeLabel: 'Medical Practice',
    ctaButtonText: 'Book Appointment',
    inquiryHeading: 'Book Doctor Consultation',
    inquirySubtitle: 'Schedule in-clinic consultation or online video appointment with verified doctors.',
    inquiryItemLabel: 'Symptoms / Consultation Needed',
    searchPlaceholder: 'Search treatments, consultations or health packages...',
    viewAllCatalogLabel: 'View All Health Services',
    cartBadgeLabel: 'Appointment Desk',
    catalogTabName: 'Treatments & Packages',
    servicesTabName: 'Medical Consultations',
    coursesTabName: 'Preventive Programs',
    sections: {
      ...createGenericSections('Clinic'),
      about: { ...createGenericSections('Clinic').about, name: 'About Doctor / Clinic', defaultHeading: 'About Dr. & Our Medical Practice' },
      features: { ...createGenericSections('Clinic').features, name: 'Why Consult Our Clinic', defaultHeading: 'Why Patients Trust Our Healthcare' },
      category: { ...createGenericSections('Clinic').category, name: 'Medical Specialties', defaultHeading: 'Specialties & Health Domains' },
      services: { ...createGenericSections('Clinic').services, name: 'Treatments & Consultations', defaultHeading: 'In-Clinic & Virtual Consultations' },
      products: { ...createGenericSections('Clinic').products, name: 'Medicines & Health Kits', defaultHeading: 'Essential Medicines & Home Care Kits' },
      courses: { ...createGenericSections('Clinic').courses, name: 'Wellness & Diet Programs', defaultHeading: 'Chronic Disease Management & Diet Plans' },
      videos: { ...createGenericSections('Clinic').videos, name: 'Health Guidance Videos', defaultHeading: 'Doctor Health Talks & Preventive Medical Tips' },
      offers: { ...createGenericSections('Clinic').offers, name: 'Health Checkup Packages', defaultHeading: 'Full Body Checkup & Diagnostic Packages' },
      gallery: { ...createGenericSections('Clinic').gallery, name: 'Clinic & Facilities', defaultHeading: 'Hygienic Consultation Rooms & Equipment' },
      portfolio: { ...createGenericSections('Clinic').portfolio, name: 'Patient Success Stories', defaultHeading: 'Patient Testimonials & Clinical Recovery Cases' },
      team: { ...createGenericSections('Clinic').team, name: 'Doctors & Nursing Staff', defaultHeading: 'Our Qualified Doctors & Clinical Assistants' },
      faq: { ...createGenericSections('Clinic').faq, name: 'Patient FAQs', defaultHeading: 'Consultation Fees, Timings & Emergency FAQs' },
      cta: { ...createGenericSections('Clinic').cta, name: 'Book Appointment', defaultHeading: 'Prioritize Your Health Today', actionLabel: 'Book Doctor Appointment' },
      contact: { ...createGenericSections('Clinic').contact, name: 'Contact Clinic & Emergency', defaultHeading: 'Clinic Location, Timings & Emergency Number' },
      blog: { ...createGenericSections('Clinic').blog, name: 'Health Tips & Articles', defaultHeading: 'Doctor-Verified Health & Wellness Articles' },
    },
  },

  // 5. Healthcare > Dental Clinic / Dentist
  'dentist': {
    mainCategory: 'Healthcare',
    subCategory: 'Dentist',
    entityName: 'Dental Clinic',
    entityTypeLabel: 'Dental Care Practice',
    ctaButtonText: 'Book Dental Consultation',
    inquiryHeading: 'Schedule Dental Checkup',
    inquirySubtitle: 'Book painless root canals, teeth whitening, braces, or dental implants.',
    inquiryItemLabel: 'Dental Issue / Treatment',
    searchPlaceholder: 'Search dental treatments, braces or smile makeover...',
    viewAllCatalogLabel: 'View All Dental Treatments',
    cartBadgeLabel: 'Dental Booking',
    catalogTabName: 'Dental Treatments',
    servicesTabName: 'Procedures',
    coursesTabName: 'Oral Hygiene Care',
    sections: {
      ...createGenericSections('Dental Clinic'),
      about: { ...createGenericSections('Dental Clinic').about, name: 'About Dental Clinic', defaultHeading: 'About Our Dental Care Practice' },
      features: { ...createGenericSections('Dental Clinic').features, name: 'Why Choose Our Clinic', defaultHeading: 'Painless Dentistry & Advanced Sterilization' },
      category: { ...createGenericSections('Dental Clinic').category, name: 'Dental Treatments', defaultHeading: 'Complete Dental Specialties' },
      services: { ...createGenericSections('Dental Clinic').services, name: 'Dental Procedures', defaultHeading: 'Root Canal, Aligners & Dental Implants' },
      products: { ...createGenericSections('Dental Clinic').products, name: 'Oral Care Products', defaultHeading: 'Dentist-Recommended Oral Care & Toothbrushes' },
      courses: { ...createGenericSections('Dental Clinic').courses, name: 'Smile Makeover Plans', defaultHeading: 'Comprehensive Smile Correction & Maintenance' },
      videos: { ...createGenericSections('Dental Clinic').videos, name: 'Dental Care Videos', defaultHeading: 'Treatment Demos & Oral Hygiene Guides' },
      offers: { ...createGenericSections('Dental Clinic').offers, name: 'Checkup & Scaling Deals', defaultHeading: 'Free Dental Consultation & Scaling Packages' },
      gallery: { ...createGenericSections('Dental Clinic').gallery, name: 'Clinic & Equipment', defaultHeading: 'Digital X-Ray & Modern Dental Operatory' },
      portfolio: { ...createGenericSections('Dental Clinic').portfolio, name: 'Smile Transformations', defaultHeading: 'Before & After Smile Makeovers' },
      team: { ...createGenericSections('Dental Clinic').team, name: 'Dentists & Orthodontists', defaultHeading: 'Experienced Dental Surgeons & Specialists' },
      faq: { ...createGenericSections('Dental Clinic').faq, name: 'Dental FAQs', defaultHeading: 'Braces, Root Canal & Tooth Pain FAQs' },
      cta: { ...createGenericSections('Dental Clinic').cta, name: 'Book Dental Visit', defaultHeading: 'Flash Your Confident Smile Again', actionLabel: 'Book Dental Consultation' },
      contact: { ...createGenericSections('Dental Clinic').contact, name: 'Contact Dental Clinic', defaultHeading: 'Clinic Location, Open Timings & Appointment Line' },
      blog: { ...createGenericSections('Dental Clinic').blog, name: 'Dental Health Tips', defaultHeading: 'Tips for Healthy Teeth, Gums & Braces Care' },
    },
  },

  // 6. Food & Dining > Restaurant / Cafe
  'restaurant': {
    mainCategory: 'Food & Dining',
    subCategory: 'Restaurant',
    entityName: 'Restaurant',
    entityTypeLabel: 'Dining & Food Outlet',
    ctaButtonText: 'Reserve Table / Order Now',
    inquiryHeading: 'Table Reservation & Party Catering',
    inquirySubtitle: 'Book a table for family dining, corporate dinners, or order bulk party catering.',
    inquiryItemLabel: 'Cuisine / Party Size Required',
    searchPlaceholder: 'Search dishes, cuisines, starters or desserts...',
    viewAllCatalogLabel: 'View Complete Food Menu',
    cartBadgeLabel: 'Food Order',
    catalogTabName: 'Food Menu',
    servicesTabName: 'Catering & Dining',
    coursesTabName: 'Chef Masterclasses',
    sections: {
      ...createGenericSections('Restaurant'),
      about: { ...createGenericSections('Restaurant').about, name: 'About Restaurant', defaultHeading: 'Our Culinary Story & Authentic Flavours' },
      features: { ...createGenericSections('Restaurant').features, name: 'Why Dine With Us', defaultHeading: 'Pure Ingredients, Secret Recipes & Warm Hospitality' },
      category: { ...createGenericSections('Restaurant').category, name: 'Cuisines & Menu Categories', defaultHeading: 'Explore Starters, Main Course, Breads & Desserts' },
      services: { ...createGenericSections('Restaurant').services, name: 'Catering & Table Booking', defaultHeading: 'Outdoor Catering, Party Halls & Dine-In' },
      products: { ...createGenericSections('Restaurant').products, name: 'Food Menu & Dishes', defaultHeading: 'Chef Special Dishes & Customer Favorites' },
      courses: { ...createGenericSections('Restaurant').courses, name: 'Cooking Workshops', defaultHeading: 'Authentic Culinary Workshops & Signature Recipes' },
      videos: { ...createGenericSections('Restaurant').videos, name: 'Kitchen & Food Videos', defaultHeading: 'Behind the Scenes & Live Cooking Highlights' },
      offers: { ...createGenericSections('Restaurant').offers, name: 'Today’s Specials & Combos', defaultHeading: 'Festive Buffets, Thali Offers & Weekend Combos' },
      gallery: { ...createGenericSections('Restaurant').gallery, name: 'Food & Ambience Gallery', defaultHeading: 'Restaurant Ambience & Delicious Presentations' },
      portfolio: { ...createGenericSections('Restaurant').portfolio, name: 'Culinary Honors & Reviews', defaultHeading: 'Food Awards, Press Features & Top Critic Reviews' },
      team: { ...createGenericSections('Restaurant').team, name: 'Head Chefs & Culinary Team', defaultHeading: 'Master Chefs & Passionate Hospitality Team' },
      faq: { ...createGenericSections('Restaurant').faq, name: 'Dining & Ordering FAQs', defaultHeading: 'Home Delivery, Jain Food & Party Booking FAQs' },
      cta: { ...createGenericSections('Restaurant').cta, name: 'Reserve Table / Order Now', defaultHeading: 'Treat Your Tastebuds to Authentic Delicacies', actionLabel: 'Order Food / Book Table' },
      contact: { ...createGenericSections('Restaurant').contact, name: 'Contact & Location', defaultHeading: 'Address, Table Hotline & Operating Hours' },
      blog: { ...createGenericSections('Restaurant').blog, name: 'Food Stories & Recipes', defaultHeading: 'Traditional Recipes, Cooking Secrets & Food Culture' },
    },
  },

  // 7. Beauty & Wellness > Beauty Salon / Parlour / Spa
  'beauty salon': {
    mainCategory: 'Beauty & Wellness',
    subCategory: 'Beauty Salon',
    entityName: 'Salon & Spa',
    entityTypeLabel: 'Salon & Wellness Studio',
    ctaButtonText: 'Book Salon Appointment',
    inquiryHeading: 'Book Beauty & Grooming Session',
    inquirySubtitle: 'Schedule hair treatments, bridal makeup, facial, or relaxing body spa with experts.',
    inquiryItemLabel: 'Service / Treatment Needed',
    searchPlaceholder: 'Search hair styling, facial, bridal makeup or packages...',
    viewAllCatalogLabel: 'View All Salon Services',
    cartBadgeLabel: 'Salon Appointments',
    catalogTabName: 'Beauty Services',
    servicesTabName: 'Salon Treatments',
    coursesTabName: 'Makeup & Hair Academies',
    sections: {
      ...createGenericSections('Salon'),
      about: { ...createGenericSections('Salon').about, name: 'About Salon & Spa', defaultHeading: 'About Our Luxury Salon & Wellness Studio' },
      features: { ...createGenericSections('Salon').features, name: 'Why Clients Love Us', defaultHeading: 'Premium Products, Certified Stylists & Complete Hygiene' },
      category: { ...createGenericSections('Salon').category, name: 'Salon Categories', defaultHeading: 'Hair, Skin, Nail & Bridal Beauty Categories' },
      services: { ...createGenericSections('Salon').services, name: 'Salon & Parlour Services', defaultHeading: 'Hair Spa, Facial, Keratin & Body Polishing' },
      products: { ...createGenericSections('Salon').products, name: 'Beauty & Hair Care Products', defaultHeading: 'Professional Shampoos, Serums & Skincare Kits' },
      courses: { ...createGenericSections('Salon').courses, name: 'Bridal & Makeup Academy', defaultHeading: 'Certified Hair Styling & Professional Makeup Courses' },
      videos: { ...createGenericSections('Salon').videos, name: 'Transformation Reels', defaultHeading: 'Hair Cut Makeovers, Bridal Draping & Styling Reels' },
      offers: { ...createGenericSections('Salon').offers, name: 'Bridal & Festival Packages', defaultHeading: 'Pre-Bridal Glow Packages & Festive Grooming Deals' },
      gallery: { ...createGenericSections('Salon').gallery, name: 'Makeover Gallery', defaultHeading: 'Client Makeovers, Hair Colors & Nail Art Showcase' },
      portfolio: { ...createGenericSections('Salon').portfolio, name: 'Bridal Transformations', defaultHeading: 'Real Brides, Editorial Looks & Runway Portfolios' },
      team: { ...createGenericSections('Salon').team, name: 'Stylists & Beauticians', defaultHeading: 'Master Hair Stylists, Skin Experts & Makeup Artists' },
      faq: { ...createGenericSections('Salon').faq, name: 'Salon FAQs', defaultHeading: 'Hair Color, Skin Sensitivity & Booking FAQs' },
      cta: { ...createGenericSections('Salon').cta, name: 'Book Salon Appointment', defaultHeading: 'Experience Luxury Care & Rejuvenation', actionLabel: 'Book Appointment on WhatsApp' },
      contact: { ...createGenericSections('Salon').contact, name: 'Contact Salon', defaultHeading: 'Salon Location, Timings & Booking Hotline' },
      blog: { ...createGenericSections('Salon').blog, name: 'Hair & Skin Care Tips', defaultHeading: 'Seasonal Hair Care, Glowing Skin & Makeup Tips' },
    },
  },

  // 8. Fitness & Sports > Gym / Fitness Centre
  'gym': {
    mainCategory: 'Fitness & Sports',
    subCategory: 'Gym',
    entityName: 'Fitness Club',
    entityTypeLabel: 'Gym & Performance Centre',
    ctaButtonText: 'Claim Free 1-Day Pass',
    inquiryHeading: 'Gym Membership & Personal Training',
    inquirySubtitle: 'Inquire about monthly/yearly gym memberships, personal coaches, and diet consultations.',
    inquiryItemLabel: 'Membership Plan / Goal (e.g. Weight Loss / Muscle Gain)',
    searchPlaceholder: 'Search membership plans, personal training or equipment...',
    viewAllCatalogLabel: 'View Membership Plans',
    cartBadgeLabel: 'Gym Membership',
    catalogTabName: 'Plans & Memberships',
    servicesTabName: 'Training Programs',
    coursesTabName: 'Fitness Certifications',
    sections: {
      ...createGenericSections('Gym'),
      about: { ...createGenericSections('Gym').about, name: 'About Our Gym', defaultHeading: 'Transforming Lives, Building Strength' },
      features: { ...createGenericSections('Gym').features, name: 'Why Train With Us', defaultHeading: 'Imported Biomechanical Machines & Certified Trainers' },
      category: { ...createGenericSections('Gym').category, name: 'Workout Zones & Categories', defaultHeading: 'Cardio, Strength, Crossfit & Functional Zones' },
      services: { ...createGenericSections('Gym').services, name: 'Personal Training & Programs', defaultHeading: '1-on-1 Personal Training & Custom Diet Charts' },
      products: { ...createGenericSections('Gym').products, name: 'Supplements & Gym Gear', defaultHeading: 'Verified Whey Protein, Creatine & Workout Gear' },
      courses: { ...createGenericSections('Gym').courses, name: 'Fitness Courses & Workshops', defaultHeading: 'Kettlebell, Calisthenics & Strength Masterclasses' },
      videos: { ...createGenericSections('Gym').videos, name: 'Workout Demos & Reels', defaultHeading: 'Form Correction Demos & Member Workout Highlights' },
      offers: { ...createGenericSections('Gym').offers, name: 'Membership Offers & Free Pass', defaultHeading: 'Annual Membership Discount & Free Trial Passes' },
      gallery: { ...createGenericSections('Gym').gallery, name: 'Gym & Equipment Gallery', defaultHeading: 'Air-Conditioned Floor & Premium Dumbbell Section' },
      portfolio: { ...createGenericSections('Gym').portfolio, name: 'Member Transformations', defaultHeading: 'Inspiring Fat Loss & Muscle Building Transformations' },
      team: { ...createGenericSections('Gym').team, name: 'Certified Trainers & Coaches', defaultHeading: 'Certified Fitness Trainers & Nutrition Specialists' },
      faq: { ...createGenericSections('Gym').faq, name: 'Gym FAQs', defaultHeading: 'Timings, Lockers, Beginner Guidance & Fees FAQs' },
      cta: { ...createGenericSections('Gym').cta, name: 'Join Gym Today', defaultHeading: 'Start Your Fitness Journey With Us Today', actionLabel: 'Claim Free 1-Day Trial Pass' },
      contact: { ...createGenericSections('Gym').contact, name: 'Contact Gym', defaultHeading: 'Gym Location, Shift Timings & Reception Helpline' },
      blog: { ...createGenericSections('Gym').blog, name: 'Workout & Nutrition Blog', defaultHeading: 'Muscle Building Science, Fat Loss Secrets & Diet Tips' },
    },
  },

  // 9. Repair & Maintenance > Mobile / Laptop Repair
  'mobile repair': {
    mainCategory: 'Repair & Maintenance',
    subCategory: 'Mobile Repair',
    entityName: 'Service Centre',
    entityTypeLabel: 'Device Repair & Diagnostic Hub',
    ctaButtonText: 'Book Technician / Repair Now',
    inquiryHeading: 'Request Instant Device Repair',
    inquirySubtitle: 'Get doorstep pick & drop or same-day repair for broken screens, battery, or motherboard issues.',
    inquiryItemLabel: 'Device Model & Problem',
    searchPlaceholder: 'Search repair services, display screen, battery or parts...',
    viewAllCatalogLabel: 'View All Repair Services',
    cartBadgeLabel: 'Repair Cart',
    catalogTabName: 'Repair Services',
    servicesTabName: 'Diagnostic & Repairs',
    coursesTabName: 'Chip Level Training',
    sections: {
      ...createGenericSections('Service Centre'),
      about: { ...createGenericSections('Service Centre').about, name: 'About Service Centre', defaultHeading: 'Fast, Certified & Transparent Device Repairs' },
      features: { ...createGenericSections('Service Centre').features, name: 'Why Trust Our Technicians', defaultHeading: 'Original Spare Parts, 90-Day Warranty & Rapid Turnaround' },
      category: { ...createGenericSections('Service Centre').category, name: 'Repair Categories & Brands', defaultHeading: 'Apple, Samsung, OnePlus & Android Screen / Battery Hub' },
      services: { ...createGenericSections('Service Centre').services, name: 'Doorstep Repair Services', defaultHeading: 'Screen Replacement, Battery Change & Motherboard Repair' },
      products: { ...createGenericSections('Service Centre').products, name: 'Spare Parts & Accessories', defaultHeading: 'Original Chargers, Tough Glass & Tempered Protection' },
      courses: { ...createGenericSections('Service Centre').courses, name: 'Mobile Repairing Courses', defaultHeading: 'Chip-Level Hardware & Software Diagnostic Training' },
      videos: { ...createGenericSections('Service Centre').videos, name: 'Repair Demos & Diagnostics', defaultHeading: 'Watch Live Screen Laser Separation & Motherboard Soldering' },
      offers: { ...createGenericSections('Service Centre').offers, name: 'Repair Offers & Free Checkup', defaultHeading: 'Free Device Diagnostic & Combo Screen Offers' },
      gallery: { ...createGenericSections('Service Centre').gallery, name: 'Lab & Workshop Gallery', defaultHeading: 'Dust-Free Clean Room & Modern Diagnostic Benches' },
      portfolio: { ...createGenericSections('Service Centre').portfolio, name: 'Repaired Devices Showcase', defaultHeading: 'Over 10,000+ Successfully Restored Smartphones' },
      team: { ...createGenericSections('Service Centre').team, name: 'Certified Technicians', defaultHeading: 'ESD-Certified Hardware & Micro-Soldering Engineers' },
      faq: { ...createGenericSections('Service Centre').faq, name: 'Repair FAQs', defaultHeading: 'Data Safety, Repair Warranty & Genuine Parts FAQs' },
      cta: { ...createGenericSections('Service Centre').cta, name: 'Book Repair Service', defaultHeading: 'Don’t Let a Broken Phone Stop Your Day', actionLabel: 'Book Device Repair on WhatsApp' },
      contact: { ...createGenericSections('Service Centre').contact, name: 'Contact Service Centre', defaultHeading: 'Workshop Address, Helpline & Emergency Drop-off' },
      blog: { ...createGenericSections('Service Centre').blog, name: 'Device Care Tips', defaultHeading: 'Battery Life Optimization & Water Damage Emergency Steps' },
    },
  },

  // 10. Legal Services > Lawyer / Law Firm
  'lawyer': {
    mainCategory: 'Legal Services',
    subCategory: 'Lawyer',
    entityName: 'Legal Chambers',
    entityTypeLabel: 'Advocates & Legal Counsel',
    ctaButtonText: 'Schedule Legal Consultation',
    inquiryHeading: 'Confidential Legal Consultation',
    inquirySubtitle: 'Connect directly with senior advocates for legal opinion, court representation, or agreement drafting.',
    inquiryItemLabel: 'Legal Matter / Dispute Area',
    searchPlaceholder: 'Search legal areas, documentation or consultation...',
    viewAllCatalogLabel: 'View All Legal Practice Areas',
    cartBadgeLabel: 'Consultation Desk',
    catalogTabName: 'Practice Areas',
    servicesTabName: 'Legal Advisory',
    coursesTabName: 'Legal Seminars',
    sections: {
      ...createGenericSections('Legal Practice'),
      about: { ...createGenericSections('Legal Practice').about, name: 'About Our Advocates', defaultHeading: 'Integrity, Diligence & Unwavering Client Advocacy' },
      features: { ...createGenericSections('Legal Practice').features, name: 'Why Retain Our Chambers', defaultHeading: 'Decades of Trial Experience & Practical Legal Strategy' },
      category: { ...createGenericSections('Legal Practice').category, name: 'Practice Areas', defaultHeading: 'Civil, Criminal, Corporate, Property & Family Law' },
      services: { ...createGenericSections('Legal Practice').services, name: 'Legal Advisory & Litigation', defaultHeading: 'Court Representation, Bail Matters & Arbitration' },
      products: { ...createGenericSections('Legal Practice').products, name: 'Legal Agreements & Packages', defaultHeading: 'Contract Drafting, Sale Deeds & Power of Attorney' },
      courses: { ...createGenericSections('Legal Practice').courses, name: 'Legal Seminars & Workshops', defaultHeading: 'RERA Compliance, Corporate Governance & IPR Workshops' },
      videos: { ...createGenericSections('Legal Practice').videos, name: 'Legal Knowledge Videos', defaultHeading: 'Citizen Rights, Property Precautions & Legal Guidance' },
      offers: { ...createGenericSections('Legal Practice').offers, name: 'Initial Consultation Packages', defaultHeading: 'First Legal Opinion & Document Verification Retainer' },
      gallery: { ...createGenericSections('Legal Practice').gallery, name: 'Chambers & Law Library', defaultHeading: 'Conference Rooms, Comprehensive Legal Library & Office' },
      portfolio: { ...createGenericSections('Legal Practice').portfolio, name: 'Key Verdicts & Milestones', defaultHeading: 'Notable Reported Judgments & Successfully Settled Disputes' },
      team: { ...createGenericSections('Legal Practice').team, name: 'Advocates & Associates', defaultHeading: 'Senior Counsel, Trial Attorneys & Legal Researchers' },
      faq: { ...createGenericSections('Legal Practice').faq, name: 'Legal FAQs', defaultHeading: 'Court Procedure, Consultation Confidentiality & Fee Structure' },
      cta: { ...createGenericSections('Legal Practice').cta, name: 'Consult an Advocate', defaultHeading: 'Protect Your Rights With Trusted Legal Counsel', actionLabel: 'Schedule Legal Consultation' },
      contact: { ...createGenericSections('Legal Practice').contact, name: 'Contact Chambers', defaultHeading: 'Chamber Address, Appointment Desk & Direct Phone' },
      blog: { ...createGenericSections('Legal Practice').blog, name: 'Legal Updates & Case Law', defaultHeading: 'High Court / Supreme Court Verdicts & Legislative Changes' },
    },
  },

  // 11. Real Estate > Agency / Property Dealer
  'real estate agency': {
    mainCategory: 'Real Estate',
    subCategory: 'Real Estate Agency',
    entityName: 'Real Estate Agency',
    entityTypeLabel: 'Property Advisory & Realtors',
    ctaButtonText: 'Book Site Visit / Enquire',
    inquiryHeading: 'Property Inquiry & Site Visit',
    inquirySubtitle: 'Schedule verified property visits for flats, villas, commercial shops, or residential plots.',
    inquiryItemLabel: 'Property Type & Preferred Locality',
    searchPlaceholder: 'Search residential flats, villas, plots or commercial...',
    viewAllCatalogLabel: 'Explore All Properties',
    cartBadgeLabel: 'Property Shortlist',
    catalogTabName: 'Properties Catalogue',
    servicesTabName: 'Real Estate Advisory',
    coursesTabName: 'Investor Seminars',
    sections: {
      ...createGenericSections('Real Estate'),
      about: { ...createGenericSections('Real Estate').about, name: 'About Our Agency', defaultHeading: 'Your Trusted Partner in Finding Your Dream Property' },
      features: { ...createGenericSections('Real Estate').features, name: 'Why Buy & Invest With Us', defaultHeading: '100% RERA Verified Titles, Zero Hidden Costs & Best Rates' },
      category: { ...createGenericSections('Real Estate').category, name: 'Property Types & Localities', defaultHeading: 'Apartments, Luxury Villas, Commercial & Freehold Plots' },
      services: { ...createGenericSections('Real Estate').services, name: 'Real Estate Services', defaultHeading: 'Site Visits, Home Loan Assistance & Registry Documentation' },
      products: { ...createGenericSections('Real Estate').products, name: 'Featured Properties', defaultHeading: 'Ready to Move & Under-Construction Prime Properties' },
      courses: { ...createGenericSections('Real Estate').courses, name: 'Property Investment Seminars', defaultHeading: 'High ROI Commercial & Land Investment Guidance' },
      videos: { ...createGenericSections('Real Estate').videos, name: 'Property Walkthrough Videos', defaultHeading: 'Virtual 3D Drone Tours & Sample Flat Walkthroughs' },
      offers: { ...createGenericSections('Real Estate').offers, name: 'Launch Deals & Flexible Schemes', defaultHeading: 'No EMI Till Possession & Pre-Launch Pricing Offers' },
      gallery: { ...createGenericSections('Real Estate').gallery, name: 'Project & Site Gallery', defaultHeading: 'Clubhouse Amenities, Landscaped Parks & Sample Flats' },
      portfolio: { ...createGenericSections('Real Estate').portfolio, name: 'Delivered Projects', defaultHeading: 'Successfully Handed Over Societies & Happy Homeowners' },
      team: { ...createGenericSections('Real Estate').team, name: 'Property Consultants', defaultHeading: 'Licensed Real Estate Advisors & Area Specialists' },
      faq: { ...createGenericSections('Real Estate').faq, name: 'Property Buyer FAQs', defaultHeading: 'Home Loans, RERA Verification & Possession Timeline FAQs' },
      cta: { ...createGenericSections('Real Estate').cta, name: 'Schedule Site Visit', defaultHeading: 'Discover Prime Properties Matching Your Lifestyle', actionLabel: 'Book Free Site Visit' },
      contact: { ...createGenericSections('Real Estate').contact, name: 'Contact Property Office', defaultHeading: 'Site Office Location, Sales Hotline & Visit Timings' },
      blog: { ...createGenericSections('Real Estate').blog, name: 'Real Estate Market Insights', defaultHeading: 'Locality Price Trends, Infrastructure Updates & Buying Tips' },
    },
  },
};

// Aliases for quick mapping
SPECIALIZED_TERMINOLOGY_REGISTRY['tuition centre'] = SPECIALIZED_TERMINOLOGY_REGISTRY['coaching institute'];
SPECIALIZED_TERMINOLOGY_REGISTRY['training institute'] = SPECIALIZED_TERMINOLOGY_REGISTRY['coaching institute'];
SPECIALIZED_TERMINOLOGY_REGISTRY['specialist doctor'] = SPECIALIZED_TERMINOLOGY_REGISTRY['general physician'];
SPECIALIZED_TERMINOLOGY_REGISTRY['hospital'] = SPECIALIZED_TERMINOLOGY_REGISTRY['general physician'];
SPECIALIZED_TERMINOLOGY_REGISTRY['nursing home'] = SPECIALIZED_TERMINOLOGY_REGISTRY['general physician'];
SPECIALIZED_TERMINOLOGY_REGISTRY['dental clinic'] = SPECIALIZED_TERMINOLOGY_REGISTRY['dentist'];
SPECIALIZED_TERMINOLOGY_REGISTRY['cafe'] = SPECIALIZED_TERMINOLOGY_REGISTRY['restaurant'];
SPECIALIZED_TERMINOLOGY_REGISTRY['bakery'] = SPECIALIZED_TERMINOLOGY_REGISTRY['restaurant'];
SPECIALIZED_TERMINOLOGY_REGISTRY['sweet shop'] = SPECIALIZED_TERMINOLOGY_REGISTRY['restaurant'];
SPECIALIZED_TERMINOLOGY_REGISTRY['mithai shop'] = SPECIALIZED_TERMINOLOGY_REGISTRY['restaurant'];
SPECIALIZED_TERMINOLOGY_REGISTRY['beauty parlour'] = SPECIALIZED_TERMINOLOGY_REGISTRY['beauty salon'];
SPECIALIZED_TERMINOLOGY_REGISTRY['hair salon'] = SPECIALIZED_TERMINOLOGY_REGISTRY['beauty salon'];
SPECIALIZED_TERMINOLOGY_REGISTRY['spa'] = SPECIALIZED_TERMINOLOGY_REGISTRY['beauty salon'];
SPECIALIZED_TERMINOLOGY_REGISTRY['fitness centre'] = SPECIALIZED_TERMINOLOGY_REGISTRY['gym'];
SPECIALIZED_TERMINOLOGY_REGISTRY['yoga studio'] = SPECIALIZED_TERMINOLOGY_REGISTRY['gym'];
SPECIALIZED_TERMINOLOGY_REGISTRY['computer repair'] = SPECIALIZED_TERMINOLOGY_REGISTRY['mobile repair'];
SPECIALIZED_TERMINOLOGY_REGISTRY['laptop repair'] = SPECIALIZED_TERMINOLOGY_REGISTRY['mobile repair'];
SPECIALIZED_TERMINOLOGY_REGISTRY['advocate'] = SPECIALIZED_TERMINOLOGY_REGISTRY['lawyer'];
SPECIALIZED_TERMINOLOGY_REGISTRY['law firm'] = SPECIALIZED_TERMINOLOGY_REGISTRY['lawyer'];
SPECIALIZED_TERMINOLOGY_REGISTRY['property dealer'] = SPECIALIZED_TERMINOLOGY_REGISTRY['real estate agency'];

/**
 * Universal Dynamic Terminology Generator:
 * Generates tailor-made dynamic terminology for ANY of the 295+ Sub Categories
 * by extracting domain entity name and building domain-aware section labels.
 */
export const resolveCategoryTerminology = (
  mainCategoryName?: string,
  subCategoryName?: string,
  businessName?: string
): CategoryTerminology => {
  const cleanSub = (subCategoryName || '').toLowerCase().trim();
  const cleanMain = (mainCategoryName || findMainCategoryBySubCategory(cleanSub)).trim();

  // 1. Check exact subcategory match in registry
  if (cleanSub && SPECIALIZED_TERMINOLOGY_REGISTRY[cleanSub]) {
    const reg = SPECIALIZED_TERMINOLOGY_REGISTRY[cleanSub]!;
    const base = createGenericSections(reg.entityName || 'Store');
    return {
      mainCategory: reg.mainCategory || cleanMain,
      subCategory: subCategoryName || reg.subCategory || 'General',
      entityName: reg.entityName || 'Store',
      entityTypeLabel: reg.entityTypeLabel || 'Business Outlet',
      ctaButtonText: reg.ctaButtonText || 'Contact Us',
      inquiryHeading: reg.inquiryHeading || `Connect With ${businessName || 'Us'}`,
      inquirySubtitle: reg.inquirySubtitle || 'Send your requirements directly to the merchant.',
      inquiryItemLabel: reg.inquiryItemLabel || 'Product / Service Required',
      searchPlaceholder: reg.searchPlaceholder || 'Search catalogue items...',
      viewAllCatalogLabel: reg.viewAllCatalogLabel || 'Explore All Items',
      cartBadgeLabel: reg.cartBadgeLabel || 'My Order',
      catalogTabName: reg.catalogTabName || 'Catalogue',
      servicesTabName: reg.servicesTabName || 'Services',
      coursesTabName: reg.coursesTabName || 'Courses',
      sections: {
        ...base,
        ...reg.sections,
      },
    };
  }

  // 2. Keyword-based matching for specialized families
  const isSchoolFamily = /school|preschool|montessori|daycare|play school|kindergarten/i.test(cleanSub);
  if (isSchoolFamily) {
    const schoolReg = SPECIALIZED_TERMINOLOGY_REGISTRY['school']!;
    return {
      mainCategory: 'Education',
      subCategory: subCategoryName || 'School',
      entityName: subCategoryName || 'School',
      entityTypeLabel: 'Educational Institution',
      ctaButtonText: schoolReg.ctaButtonText || 'Apply for Admission',
      inquiryHeading: `${subCategoryName || 'School'} Admission & Inquiry`,
      inquirySubtitle: 'Connect directly with administration for admissions and admissions inquiry.',
      inquiryItemLabel: 'Grade / Class Required',
      searchPlaceholder: 'Search classes, levels or facilities...',
      viewAllCatalogLabel: 'Explore All Classes & Levels',
      cartBadgeLabel: 'Admissions Desk',
      catalogTabName: 'Classes & Levels',
      servicesTabName: 'School Facilities',
      coursesTabName: 'Academic Programs',
      sections: {
        ...schoolReg.sections!,
      } as Record<SectionKey, SectionTerminology>,
    };
  }

  const isCoachingFamily = /coaching|tuition|academy|training|institute/i.test(cleanSub);
  if (isCoachingFamily) {
    const reg = SPECIALIZED_TERMINOLOGY_REGISTRY['coaching institute']!;
    return {
      mainCategory: 'Education',
      subCategory: subCategoryName || 'Coaching Institute',
      entityName: subCategoryName || 'Institute',
      entityTypeLabel: 'Coaching & Academic Centre',
      ctaButtonText: 'Book Free Demo Class',
      inquiryHeading: `${subCategoryName || 'Institute'} Batch Inquiry`,
      inquirySubtitle: 'Connect for batch timings, study notes, and trial classes.',
      inquiryItemLabel: 'Target Exam / Subject',
      searchPlaceholder: 'Search batches or courses...',
      viewAllCatalogLabel: 'View All Batches',
      cartBadgeLabel: 'Enquiry Desk',
      catalogTabName: 'Target Batches',
      servicesTabName: 'Mentorship',
      coursesTabName: 'Courses',
      sections: {
        ...createGenericSections(subCategoryName || 'Institute'),
        ...reg.sections,
      },
    };
  }

  const isDoctorFamily = /doctor|clinic|dentist|hospital|pathology|diagnostic|physio|ortho|dermatol|pediatric|gynecol/i.test(cleanSub);
  if (isDoctorFamily) {
    const reg = SPECIALIZED_TERMINOLOGY_REGISTRY['general physician']!;
    return {
      mainCategory: 'Healthcare',
      subCategory: subCategoryName || 'Clinic',
      entityName: subCategoryName || 'Clinic',
      entityTypeLabel: 'Healthcare Practice',
      ctaButtonText: 'Book Appointment',
      inquiryHeading: `${subCategoryName || 'Clinic'} Appointment Booking`,
      inquirySubtitle: 'Connect with medical staff to book a consultation.',
      inquiryItemLabel: 'Treatment / Consultation',
      searchPlaceholder: 'Search treatments or checkup packages...',
      viewAllCatalogLabel: 'View All Treatments',
      cartBadgeLabel: 'Appointments',
      catalogTabName: 'Treatments & Packages',
      servicesTabName: 'Consultations',
      coursesTabName: 'Health Guides',
      sections: {
        ...createGenericSections(subCategoryName || 'Clinic'),
        ...reg.sections,
      },
    };
  }

  const isFoodFamily = /restaurant|cafe|dhaba|bakery|sweet|mithai|food|kitchen|tiffin|catering/i.test(cleanSub);
  if (isFoodFamily) {
    const reg = SPECIALIZED_TERMINOLOGY_REGISTRY['restaurant']!;
    return {
      mainCategory: 'Food & Dining',
      subCategory: subCategoryName || 'Restaurant',
      entityName: subCategoryName || 'Restaurant',
      entityTypeLabel: 'Food & Dining Outlet',
      ctaButtonText: 'Order Food / Reserve Table',
      inquiryHeading: `${subCategoryName || 'Restaurant'} Table / Order Booking`,
      inquirySubtitle: 'Send your party order or table reservation directly.',
      inquiryItemLabel: 'Dish / Catering Requirement',
      searchPlaceholder: 'Search dishes or cuisines...',
      viewAllCatalogLabel: 'View Full Menu',
      cartBadgeLabel: 'Food Order',
      catalogTabName: 'Food Menu',
      servicesTabName: 'Catering',
      coursesTabName: 'Recipes & Workshops',
      sections: {
        ...createGenericSections(subCategoryName || 'Restaurant'),
        ...reg.sections,
      },
    };
  }

  const isSalonFamily = /salon|parlour|spa|makeup|barber/i.test(cleanSub);
  if (isSalonFamily) {
    const reg = SPECIALIZED_TERMINOLOGY_REGISTRY['beauty salon']!;
    return {
      mainCategory: 'Beauty & Wellness',
      subCategory: subCategoryName || 'Salon',
      entityName: subCategoryName || 'Salon',
      entityTypeLabel: 'Beauty & Grooming Studio',
      ctaButtonText: 'Book Salon Appointment',
      inquiryHeading: `${subCategoryName || 'Salon'} Appointment Booking`,
      inquirySubtitle: 'Schedule your beauty session or bridal consultation.',
      inquiryItemLabel: 'Service / Treatment Required',
      searchPlaceholder: 'Search salon services or packages...',
      viewAllCatalogLabel: 'View All Services',
      cartBadgeLabel: 'Appointments',
      catalogTabName: 'Salon Services',
      servicesTabName: 'Treatments',
      coursesTabName: 'Makeup Academy',
      sections: {
        ...createGenericSections(subCategoryName || 'Salon'),
        ...reg.sections,
      },
    };
  }

  const isGymFamily = /gym|fitness|yoga|zumba|sports|training/i.test(cleanSub);
  if (isGymFamily) {
    const reg = SPECIALIZED_TERMINOLOGY_REGISTRY['gym']!;
    return {
      mainCategory: 'Fitness & Sports',
      subCategory: subCategoryName || 'Gym',
      entityName: subCategoryName || 'Gym',
      entityTypeLabel: 'Fitness & Sports Centre',
      ctaButtonText: 'Claim Free Pass',
      inquiryHeading: `${subCategoryName || 'Gym'} Membership Inquiry`,
      inquirySubtitle: 'Connect to book a trial workout or inquire about membership plans.',
      inquiryItemLabel: 'Membership Plan / Goal',
      searchPlaceholder: 'Search membership plans or training...',
      viewAllCatalogLabel: 'View Membership Plans',
      cartBadgeLabel: 'Membership',
      catalogTabName: 'Memberships',
      servicesTabName: 'Personal Training',
      coursesTabName: 'Workshops',
      sections: {
        ...createGenericSections(subCategoryName || 'Gym'),
        ...reg.sections,
      },
    };
  }

  const isRepairFamily = /repair|service centre|appliance|plumb|electr|cctv/i.test(cleanSub);
  if (isRepairFamily) {
    const reg = SPECIALIZED_TERMINOLOGY_REGISTRY['mobile repair']!;
    return {
      mainCategory: 'Repair & Maintenance',
      subCategory: subCategoryName || 'Service Centre',
      entityName: subCategoryName || 'Service Centre',
      entityTypeLabel: 'Repair & Technical Workshop',
      ctaButtonText: 'Book Technician / Repair Now',
      inquiryHeading: `${subCategoryName || 'Repair'} Service Request`,
      inquirySubtitle: 'Connect directly to schedule repair or request doorstep technician.',
      inquiryItemLabel: 'Item / Device & Issue',
      searchPlaceholder: 'Search repair services or parts...',
      viewAllCatalogLabel: 'View All Repair Services',
      cartBadgeLabel: 'Repair Cart',
      catalogTabName: 'Repair Services',
      servicesTabName: 'Doorstep Service',
      coursesTabName: 'Technical Workshops',
      sections: {
        ...createGenericSections(subCategoryName || 'Service Centre'),
        ...reg.sections,
      },
    };
  }

  // 3. Fallback: Synthesize domain-aware terminology using the specific SubCategory or Entity Name
  const entityName = subCategoryName || 'Store';
  const base = createGenericSections(entityName);

  return {
    mainCategory: cleanMain || 'Retail & Shopping',
    subCategory: subCategoryName || 'Store',
    entityName,
    entityTypeLabel: `${cleanMain || 'Retail'} Business`,
    ctaButtonText: 'Order on WhatsApp',
    inquiryHeading: `Connect With ${businessName || entityName}`,
    inquirySubtitle: 'Send your message or inquiry directly to the merchant.',
    inquiryItemLabel: 'Product / Service Required',
    searchPlaceholder: `Search ${entityName.toLowerCase()} items or services...`,
    viewAllCatalogLabel: 'Explore All Items',
    cartBadgeLabel: 'My Order',
    catalogTabName: 'Products',
    servicesTabName: 'Services',
    coursesTabName: 'Courses',
    sections: {
      ...base,
      about: {
        ...base.about,
        name: `About ${entityName}`,
        defaultHeading: `About Our ${entityName}`,
      },
      features: {
        ...base.features,
        name: `Why Choose Our ${entityName}`,
        defaultHeading: `Why Choose Our ${entityName}`,
      },
      gallery: {
        ...base.gallery,
        name: `${entityName} Gallery`,
        defaultHeading: `${entityName} Photo Showcase`,
      },
      videos: {
        ...base.videos,
        name: `${entityName} Videos`,
        defaultHeading: `${entityName} Walkthroughs & Videos`,
      },
      faq: {
        ...base.faq,
        name: `${entityName} FAQs`,
        defaultHeading: `Frequently Asked Questions`,
      },
      contact: {
        ...base.contact,
        name: `Contact ${entityName}`,
        defaultHeading: `Contact Our ${entityName}`,
      },
      blog: {
        ...base.blog,
        name: `${entityName} News`,
        defaultHeading: `Latest Updates & News`,
      },
    },
  };
};

/**
 * Main accessor: Resolves the active Shop Terminology
 */
export const getShopTerminology = (shop?: Partial<Shop> | null): CategoryTerminology => {
  if (!shop) {
    return resolveCategoryTerminology('Retail & Shopping', 'Store', 'Our Store');
  }

  const subCat = shop.subCategory || shop.category || '';
  const mainCat = shop.mainCategory || findMainCategoryBySubCategory(subCat);

  return resolveCategoryTerminology(mainCat, subCat, shop.businessName);
};

/**
 * Formats a dynamic section display name for dashboard / builder
 */
export const getDynamicSectionTitle = (
  shop: Partial<Shop> | null | undefined,
  sectionKey: SectionKey,
  vendorCustomTitle?: string
): string => {
  if (vendorCustomTitle && vendorCustomTitle.trim()) {
    return vendorCustomTitle.trim();
  }
  const terminology = getShopTerminology(shop);
  return terminology.sections[sectionKey]?.name || sectionKey;
};

/**
 * Formats a dynamic section default heading for the live website
 */
export const getDynamicSectionHeading = (
  shop: Partial<Shop> | null | undefined,
  sectionKey: SectionKey,
  vendorCustomHeading?: string
): string => {
  if (vendorCustomHeading && vendorCustomHeading.trim()) {
    return vendorCustomHeading.trim();
  }
  const terminology = getShopTerminology(shop);
  return terminology.sections[sectionKey]?.defaultHeading || sectionKey;
};
