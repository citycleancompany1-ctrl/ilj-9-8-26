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

export type CategoryTerminologyOverride = Partial<Omit<CategoryTerminology, 'sections'>> & {
  sections?: Partial<Record<SectionKey, Partial<SectionTerminology>>>;
};

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
export const SPECIALIZED_TERMINOLOGY_REGISTRY: Record<string, CategoryTerminologyOverride> = {
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
 * Standard dynamic terminology profiles for all 27 platform Main Categories
 */
export const MAIN_CATEGORY_TERMINOLOGY_MAP: Record<string, CategoryTerminologyOverride> = {
  'education': {
    mainCategory: 'Education',
    entityName: 'Educational Institute',
    entityTypeLabel: 'Educational Institution',
    ctaButtonText: 'Apply for Admission',
    inquiryHeading: 'Admissions & Academic Inquiry',
    inquirySubtitle: 'Connect directly with our administration office for admissions, courses, and guidance.',
    inquiryItemLabel: 'Program / Class Required',
    searchPlaceholder: 'Search programs, classes or campus facilities...',
    viewAllCatalogLabel: 'Explore All Programs & Classes',
    cartBadgeLabel: 'Admissions Desk',
    catalogTabName: 'Programs & Classes',
    servicesTabName: 'Campus Facilities',
    coursesTabName: 'Academic Programs',
    sections: {
      heroBanner: { name: 'Hero Banner', defaultHeading: 'Welcome to Our Campus', actionLabel: 'Explore' },
      hero: { name: 'Hero Section', defaultHeading: 'Empowering Future Leaders with Quality Education', actionLabel: 'Apply Now' },
      about: { name: 'About Institute', defaultHeading: 'About Our Educational Institute', defaultSubtitle: 'Nurturing excellence, knowledge, and character.' },
      features: { name: 'Why Choose Our Institute', defaultHeading: 'Why Choose Our Institute', defaultSubtitle: 'Key highlights that set our academic standards apart.' },
      category: { name: 'Classes & Streams', defaultHeading: 'Academic Streams & Levels', defaultSubtitle: 'Explore learning stages from primary to advanced.' },
      services: { name: 'Campus Facilities', defaultHeading: 'Modern Campus & Infrastructure Facilities', defaultSubtitle: 'State-of-the-art labs, library, sports, and safe transport.' },
      products: { name: 'Courses & Programs', defaultHeading: 'Our Academic Programs & Batches', defaultSubtitle: 'Comprehensive curriculums designed for holistic success.' },
      courses: { name: 'Special Programs', defaultHeading: 'Enrichment Courses & Competitive Batches', defaultSubtitle: 'Advanced coaching, competitive exams & skill workshops.' },
      videos: { name: 'Campus Videos', defaultHeading: 'Campus Tour & Student Life', defaultSubtitle: 'Watch our classrooms, events, and student activities.' },
      offers: { name: 'Admissions & Scholarships', defaultHeading: 'Admissions Open & Meritorious Scholarships', defaultSubtitle: 'Explore early enrollment benefits and scholarship quotas.' },
      gallery: { name: 'Campus Gallery', defaultHeading: 'Campus & Activity Photo Gallery', defaultSubtitle: 'Glimpses of academic milestones, cultural festivals & sports.' },
      portfolio: { name: 'Achievements', defaultHeading: 'Academic & Co-Curricular Achievements', defaultSubtitle: 'Our proud record of board toppers and competition winners.' },
      team: { name: 'Faculty & Staff', defaultHeading: 'Distinguished Faculty & Mentors', defaultSubtitle: 'Passionate educators dedicated to student growth.' },
      faq: { name: 'Student & Parent FAQs', defaultHeading: 'Frequently Asked Questions', defaultSubtitle: 'Answers regarding admissions, syllabus, timings, and fees.' },
      cta: { name: 'Apply for Admission', defaultHeading: 'Admissions Open for New Academic Session', defaultSubtitle: 'Secure your child’s future with exceptional education.', actionLabel: 'Apply for Admission' },
      contact: { name: 'Contact Admissions Office', defaultHeading: 'Contact Our Admissions Desk', defaultSubtitle: 'Reach out for prospectus, campus visits, and seat inquiries.', actionLabel: 'Submit Inquiry' },
      socialMedia: { name: 'Social Media', defaultHeading: 'Connect on Social Media', defaultSubtitle: 'Stay updated with campus life and live notices.' },
      blog: { name: 'Institute News', defaultHeading: 'Campus News, Circulars & Announcements', defaultSubtitle: 'Latest event notices, examination schedules, and student blogs.' },
      footer: { name: 'Footer', defaultHeading: 'All Rights Reserved' },
    },
  },
  'healthcare': {
    mainCategory: 'Healthcare',
    entityName: 'Healthcare Centre',
    entityTypeLabel: 'Medical & Healthcare Clinic',
    ctaButtonText: 'Book Appointment',
    inquiryHeading: 'Patient Inquiry & Consultation',
    inquirySubtitle: 'Connect directly with medical specialists for appointments and clinical advice.',
    inquiryItemLabel: 'Specialty / Treatment Required',
    searchPlaceholder: 'Search treatments, consultations or tests...',
    viewAllCatalogLabel: 'Explore All Treatments',
    cartBadgeLabel: 'Consultation Desk',
    catalogTabName: 'Treatments & Packages',
    servicesTabName: 'Consultations',
    coursesTabName: 'Preventive Care',
    sections: {
      heroBanner: { name: 'Hero Banner', defaultHeading: 'Compassionate Healthcare Care', actionLabel: 'Book Appointment' },
      hero: { name: 'Hero Section', defaultHeading: 'Advanced Medical Care & Patient Wellbeing', actionLabel: 'Consult Doctor' },
      about: { name: 'About Clinic / Hospital', defaultHeading: 'About Our Healthcare Centre', defaultSubtitle: 'Dedicated to ethical, transparent, and evidence-based medicine.' },
      features: { name: 'Why Consult Our Healthcare', defaultHeading: 'Why Choose Our Healthcare Centre', defaultSubtitle: 'Modern diagnostic equipment, hygiene protocols, and trusted doctors.' },
      category: { name: 'Medical Specialties', defaultHeading: 'Clinical Specialties & Departments', defaultSubtitle: 'Comprehensive healthcare across major medical fields.' },
      services: { name: 'Clinic Facilities & Diagnostics', defaultHeading: 'Diagnostic & Clinical Facilities', defaultSubtitle: 'In-house laboratory, emergency support, and daycare wards.' },
      products: { name: 'Treatments & Consultations', defaultHeading: 'Medical Consultations & Treatments', defaultSubtitle: 'Transparent treatment packages and verified specialist care.' },
      courses: { name: 'Health Checkup Packages', defaultHeading: 'Preventive Full-Body Health Checkups', defaultSubtitle: 'Routine wellness screening plans for every age group.' },
      videos: { name: 'Medical Guidance Videos', defaultHeading: 'Doctor Insights & Health Guidance', defaultSubtitle: 'Informative videos on wellness, therapies, and post-op care.' },
      offers: { name: 'Health Offers & Checkup Deals', defaultHeading: 'Seasonal Health Screening Offers', defaultSubtitle: 'Subsidized checkup camps and wellness packages.' },
      gallery: { name: 'Hospital & Clinic Gallery', defaultHeading: 'Clinic Infrastructure & Facilities', defaultSubtitle: 'Clean, sanitized consultation suites and modern diagnostic labs.' },
      portfolio: { name: 'Patient Recovery Stories', defaultHeading: 'Patient Recovery & Clinical Milestones', defaultSubtitle: 'Inspiring stories of healing, rehabilitation, and care.' },
      team: { name: 'Doctors & Medical Staff', defaultHeading: 'Our Specialist Doctors & Care Team', defaultSubtitle: 'Certified doctors, nursing staff, and medical counselors.' },
      faq: { name: 'Patient FAQs', defaultHeading: 'Patient FAQs & General Information', defaultSubtitle: 'Common questions on appointments, insurance, and reports.' },
      cta: { name: 'Book Appointment', defaultHeading: 'Book Your Specialist Consultation Today', defaultSubtitle: 'Prioritize your health with immediate appointment booking.', actionLabel: 'Book Appointment' },
      contact: { name: 'Contact Clinic & Emergency', defaultHeading: 'Contact Our Medical Reception', defaultSubtitle: 'Call our emergency desk or visit our clinic directly.', actionLabel: 'Send Inquiry' },
      socialMedia: { name: 'Social Media', defaultHeading: 'Follow for Health Advice', defaultSubtitle: 'Daily health tips, wellness reminders, and doctor videos.' },
      blog: { name: 'Health Tips & Articles', defaultHeading: 'Medical Articles & Health Insights', defaultSubtitle: 'Verified health advisories written by medical practitioners.' },
      footer: { name: 'Footer', defaultHeading: 'All Rights Reserved' },
    },
  },
  'beauty_wellness': {
    mainCategory: 'Beauty & Wellness',
    entityName: 'Salon & Spa',
    entityTypeLabel: 'Beauty Salon & Wellness Studio',
    ctaButtonText: 'Book Salon Appointment',
    inquiryHeading: 'Appointment & Bridal Booking',
    inquirySubtitle: 'Connect directly with our hair stylists and beauticians.',
    inquiryItemLabel: 'Service / Treatment Required',
    searchPlaceholder: 'Search hair, skin, bridal or spa treatments...',
    viewAllCatalogLabel: 'Explore All Salon Services',
    cartBadgeLabel: 'Salon Bookings',
    catalogTabName: 'Beauty Services',
    servicesTabName: 'Salon Treatments',
    coursesTabName: 'Bridal & Packages',
    sections: {
      heroBanner: { name: 'Hero Banner', defaultHeading: 'Luxury Beauty & Wellness', actionLabel: 'Book Appointment' },
      hero: { name: 'Hero Section', defaultHeading: 'Reinvent Your Look with Expert Stylists', actionLabel: 'Explore Services' },
      about: { name: 'About Salon & Spa', defaultHeading: 'About Our Beauty Studio & Spa', defaultSubtitle: 'Premium grooming, luxury hair therapies, and revitalizing spa rituals.' },
      features: { name: 'Why Choose Our Salon', defaultHeading: 'Why Clients Love Our Salon', defaultSubtitle: 'Top international brands, certified hair artists, and relaxing ambience.' },
      category: { name: 'Beauty Categories', defaultHeading: 'Service Categories & Packages', defaultSubtitle: 'Hair styling, facials, skin rejuvenation, manicures & spa.' },
      services: { name: 'Salon & Spa Treatments', defaultHeading: 'Signature Salon & Spa Treatments', defaultSubtitle: 'Keratin, botox hair treatments, hydra facials, and massages.' },
      products: { name: 'Beauty & Grooming Services', defaultHeading: 'Hair, Skin & Makeup Services', defaultSubtitle: 'Complete pricing catalogue for all your beauty essentials.' },
      courses: { name: 'Bridal & Styling Packages', defaultHeading: 'Bridal Makeovers & Pre-Bridal Packages', defaultSubtitle: 'Turnkey bridal makeup, groom packages, and party glam.' },
      videos: { name: 'Makeover Videos', defaultHeading: 'Makeover Transformations & Demos', defaultSubtitle: 'Watch before-and-after bridal looks and hairstyle trends.' },
      offers: { name: 'Salon Deals & Festive Offers', defaultHeading: 'Festive Beauty Deals & Combo Discounts', defaultSubtitle: 'Exclusive savings on hair care, facials, and mani-pedi combos.' },
      gallery: { name: 'Makeover Gallery', defaultHeading: 'Styling & Makeover Portfolio', defaultSubtitle: 'Stunning real brides, party makeovers, and creative hair colors.' },
      portfolio: { name: 'Bridal Transformations', defaultHeading: 'Bridal Transformations & Client Looks', defaultSubtitle: 'Our proudest bridal and fashion styling showcases.' },
      team: { name: 'Stylists & Beauticians', defaultHeading: 'Our Master Stylists & Makeup Artists', defaultSubtitle: 'Industry-trained cosmetic experts and bridal specialists.' },
      faq: { name: 'Salon FAQs', defaultHeading: 'Frequently Asked Questions', defaultSubtitle: 'Answers about hair chemicals, bridal bookings, and walk-in policies.' },
      cta: { name: 'Book Salon Appointment', defaultHeading: 'Ready for Your Next Glam Makeover?', defaultSubtitle: 'Reserve your appointment slot with our senior stylists now.', actionLabel: 'Book Salon Appointment' },
      contact: { name: 'Contact Salon', defaultHeading: 'Contact Our Salon Reception', defaultSubtitle: 'Call or WhatsApp us for instant appointment confirmation.', actionLabel: 'Book Appointment' },
      socialMedia: { name: 'Social Media', defaultHeading: 'Follow on Instagram & Social', defaultSubtitle: 'Check out daily client stories, reels, and styling inspirations.' },
      blog: { name: 'Beauty & Hair Care Tips', defaultHeading: 'Hair & Skincare Advice', defaultSubtitle: 'Expert beauty tips, home remedies, and post-salon care guides.' },
      footer: { name: 'Footer', defaultHeading: 'All Rights Reserved' },
    },
  },
  'food_dining': {
    mainCategory: 'Food & Dining',
    entityName: 'Restaurant',
    entityTypeLabel: 'Restaurant & Dining Outlet',
    ctaButtonText: 'Reserve Table / Order Now',
    inquiryHeading: 'Table Reservation & Party Catering',
    inquirySubtitle: 'Connect directly with our manager for table bookings or bulk party catering.',
    inquiryItemLabel: 'Dish / Catering Requirement',
    searchPlaceholder: 'Search dishes, cuisines or beverages...',
    viewAllCatalogLabel: 'Explore Full Food Menu',
    cartBadgeLabel: 'My Order',
    catalogTabName: 'Food Menu',
    servicesTabName: 'Catering & Dining',
    coursesTabName: 'Chef Specials & Combos',
    sections: {
      heroBanner: { name: 'Hero Banner', defaultHeading: 'Delicious Fresh Flavours', actionLabel: 'View Menu' },
      hero: { name: 'Hero Section', defaultHeading: 'Authentic Cuisines & Memorable Dining', actionLabel: 'Order Food' },
      about: { name: 'About Restaurant', defaultHeading: 'About Our Culinary Journey', defaultSubtitle: 'Fresh authentic ingredients, passionate chefs, and warm hospitality.' },
      features: { name: 'Why Dine With Us', defaultHeading: 'Why Guests Love Dining With Us', defaultSubtitle: 'Hygienic kitchen, zero-preservative recipes, and quick delivery.' },
      category: { name: 'Menu Categories', defaultHeading: 'Explore Menu by Category', defaultSubtitle: 'Starters, main courses, tandoor specials, biryanis & desserts.' },
      services: { name: 'Dining & Party Catering', defaultHeading: 'Party Catering & Bulk Orders', defaultSubtitle: 'Outdoor catering, birthday party halls, and office lunch boxes.' },
      products: { name: 'Food Menu & Dishes', defaultHeading: 'Our Handcrafted Food Menu', defaultSubtitle: 'Authentic dishes prepared fresh upon your order.' },
      courses: { name: 'Chef Specials & Combos', defaultHeading: 'Chef Specials & Family Meals', defaultSubtitle: 'Value family combos, executive platters, and seasonal treats.' },
      videos: { name: 'Kitchen & Food Videos', defaultHeading: 'Kitchen Behind-the-Scenes & Recipes', defaultSubtitle: 'Watch our chefs in action crafting mouth-watering delights.' },
      offers: { name: 'Today’s Deals & Offers', defaultHeading: 'Today’s Special Deals & Discounts', defaultSubtitle: 'Special WhatsApp direct discount codes and complimentary drinks.' },
      gallery: { name: 'Food & Ambience Gallery', defaultHeading: 'Food & Restaurant Ambience', defaultSubtitle: 'Mouthwatering dishes, welcoming interiors, and family dining spaces.' },
      portfolio: { name: 'Culinary Awards & Press', defaultHeading: 'Culinary Awards & Recognition', defaultSubtitle: 'Honored by food critics, dining portals, and happy patrons.' },
      team: { name: 'Master Chefs & Team', defaultHeading: 'Our Master Chefs & Kitchen Team', defaultSubtitle: 'Culinary maestros who bring authentic taste to your plate.' },
      faq: { name: 'Dining & Delivery FAQs', defaultHeading: 'Frequently Asked Questions', defaultSubtitle: 'Delivery radii, table reservations, Jain food options & allergens.' },
      cta: { name: 'Reserve Table / Order Now', defaultHeading: 'Hungry? Indulge in Exquisite Flavours', defaultSubtitle: 'Order online for instant doorstep delivery or book your table.', actionLabel: 'Order on WhatsApp' },
      contact: { name: 'Contact & Location', defaultHeading: 'Visit or Contact Our Restaurant', defaultSubtitle: 'Find our location, operational hours, and direct call desk.', actionLabel: 'Send Inquiry' },
      socialMedia: { name: 'Social Media', defaultHeading: 'Follow Our Food Journey', defaultSubtitle: 'Tag us in your food photos and stay updated on weekend specials.' },
      blog: { name: 'Food Stories & Recipes', defaultHeading: 'Culinary Stories & Chef Notes', defaultSubtitle: 'Secrets behind traditional recipes, spice blends & dining culture.' },
      footer: { name: 'Footer', defaultHeading: 'All Rights Reserved' },
    },
  },
  'retail_shopping': {
    mainCategory: 'Retail & Shopping',
    entityName: 'Store',
    entityTypeLabel: 'Retail Store & Merchant',
    ctaButtonText: 'Order on WhatsApp',
    inquiryHeading: 'Direct Store Inquiry',
    inquirySubtitle: 'Connect directly with store owner for prices, availability, and delivery.',
    inquiryItemLabel: 'Product / Item Required',
    searchPlaceholder: 'Search products, brands or items...',
    viewAllCatalogLabel: 'Explore All Products',
    cartBadgeLabel: 'My Order',
    catalogTabName: 'Products',
    servicesTabName: 'Store Services',
    coursesTabName: 'Combos & Packs',
    sections: {
      heroBanner: { name: 'Hero Banner', defaultHeading: 'Verified Local Store', actionLabel: 'Shop Now' },
      hero: { name: 'Hero Section', defaultHeading: 'Genuine Quality Products at Local Store Prices', actionLabel: 'Explore Products' },
      about: { name: 'About Our Store', defaultHeading: 'About Our Store', defaultSubtitle: 'Your trusted neighborhood merchant delivering quality and savings.' },
      features: { name: 'Why Shop With Us', defaultHeading: 'Why Shop With Us', defaultSubtitle: '100% authentic merchandise, fast doorstep delivery, and direct owner support.' },
      category: { name: 'Product Categories', defaultHeading: 'Browse by Product Category', defaultSubtitle: 'Discover curated collections suited to your daily needs.' },
      services: { name: 'Store Services & Delivery', defaultHeading: 'Store Services & Doorstep Delivery', defaultSubtitle: 'Express local delivery, easy replacement, and wholesale supply.' },
      products: { name: 'Products Catalogue', defaultHeading: 'Our Products Catalogue', defaultSubtitle: 'Explore our complete in-stock inventory with transparent prices.' },
      courses: { name: 'Value Packs & Combos', defaultHeading: 'Value Packs & Special Bundles', defaultSubtitle: 'Save more when you order curated combos and wholesale packs.' },
      videos: { name: 'Product Demo Videos', defaultHeading: 'Product Demos & Unboxing', defaultSubtitle: 'Watch real demonstrations of our top-selling merchandise.' },
      offers: { name: 'Offers & Seasonal Deals', defaultHeading: 'Promotional Offers & Festive Deals', defaultSubtitle: 'Special savings, limited period discounts, and festive perks.' },
      gallery: { name: 'Store & Products Gallery', defaultHeading: 'Store & Inventory Gallery', defaultSubtitle: 'Take a look inside our retail outlet and product shelves.' },
      portfolio: { name: 'Customer Showcase', defaultHeading: 'Customer Showcase & Testimonials', defaultSubtitle: 'Happy local shoppers enjoying direct savings and swift delivery.' },
      team: { name: 'Store Team & Support', defaultHeading: 'Our Store Staff & Support', defaultSubtitle: 'Dedicated associates ready to assist your shopping experience.' },
      faq: { name: 'Shopping FAQs', defaultHeading: 'Frequently Asked Questions', defaultSubtitle: 'Payment modes, return policies, delivery zones, and warranty.' },
      cta: { name: 'Order on WhatsApp', defaultHeading: 'Shop Directly with 1-Click WhatsApp Ordering', defaultSubtitle: 'Skip intermediaries and order genuine products right away.', actionLabel: 'Order on WhatsApp' },
      contact: { name: 'Contact Store', defaultHeading: 'Contact Store Coordinates', defaultSubtitle: 'Call, visit, or chat on WhatsApp for immediate assistance.', actionLabel: 'Send Inquiry' },
      socialMedia: { name: 'Social Media', defaultHeading: 'Follow Our Store Updates', defaultSubtitle: 'Stay in the loop with fresh arrivals and weekend discount flash sales.' },
      blog: { name: 'Store News & Updates', defaultHeading: 'Shopping Guides & New Arrivals', defaultSubtitle: 'Buying recommendations, new product announcements & maintenance tips.' },
      footer: { name: 'Footer', defaultHeading: 'All Rights Reserved' },
    },
  },
  'repair_maintenance': {
    mainCategory: 'Repair & Maintenance',
    entityName: 'Service Centre',
    entityTypeLabel: 'Repair & Service Workshop',
    ctaButtonText: 'Book Repair Service',
    inquiryHeading: 'Service & Repair Inquiry',
    inquirySubtitle: 'Connect directly with certified technicians for quotes and doorstep visits.',
    inquiryItemLabel: 'Device / Issue Description',
    searchPlaceholder: 'Search repairs, issues or spare parts...',
    viewAllCatalogLabel: 'Explore All Repair Services',
    cartBadgeLabel: 'Service Requests',
    catalogTabName: 'Repair Services',
    servicesTabName: 'Diagnostic & Repairs',
    coursesTabName: 'Maintenance Packages',
    sections: {
      heroBanner: { name: 'Hero Banner', defaultHeading: 'Expert Repair Services', actionLabel: 'Book Repair' },
      hero: { name: 'Hero Section', defaultHeading: 'Fast, Reliable Repairs with Genuine Spare Parts', actionLabel: 'Book Inspection' },
      about: { name: 'About Service Centre', defaultHeading: 'About Our Service Centre', defaultSubtitle: 'Certified technicians providing guaranteed diagnosis and precision repairs.' },
      features: { name: 'Why Choose Our Technicians', defaultHeading: 'Why Choose Our Service Centre', defaultSubtitle: 'Transparent pricing, 90-day service warranty, and quick turnaround.' },
      category: { name: 'Repair Categories & Devices', defaultHeading: 'Repair Categories & Supported Brands', defaultSubtitle: 'Smartphones, laptops, home appliances, electricals, and AC systems.' },
      services: { name: 'Doorstep & In-Shop Services', defaultHeading: 'Doorstep Visit & Workshop Services', defaultSubtitle: 'On-site technician visit or drop off at our equipped workshop.' },
      products: { name: 'Repair Services & Solutions', defaultHeading: 'Our Repair Solutions & Rate Card', defaultSubtitle: 'Clear, competitive pricing for standard troubleshooting and parts.' },
      courses: { name: 'Maintenance Packages', defaultHeading: 'Preventive Annual Maintenance Plans', defaultSubtitle: 'Keep your equipment running smoothly with scheduled servicing.' },
      videos: { name: 'Repair Demo Videos', defaultHeading: 'Repair Walkthroughs & Tech Tips', defaultSubtitle: 'Watch our skilled technicians troubleshoot common hardware issues.' },
      offers: { name: 'Repair Discounts & Deals', defaultHeading: 'Service Offers & Free Diagnostic Check', defaultSubtitle: 'Discount vouchers on major part replacements and servicing.' },
      gallery: { name: 'Workshop Gallery', defaultHeading: 'Workshop & Diagnostic Bench', defaultSubtitle: 'Modern soldering, testing tools, and clean repair environments.' },
      portfolio: { name: 'Restored Devices Showcase', defaultHeading: 'Restored Equipment & Successful Repairs', defaultSubtitle: 'Before and after restoration of damaged devices and appliances.' },
      team: { name: 'Certified Technicians', defaultHeading: 'Our Certified Technicians & Engineers', defaultSubtitle: 'Experienced repair specialists trained across leading manufacturers.' },
      faq: { name: 'Repair FAQs', defaultHeading: 'Frequently Asked Questions', defaultSubtitle: 'Warranty coverage, repair turnaround times, and backup advice.' },
      cta: { name: 'Book Repair Service', defaultHeading: 'Facing a Hardware or Appliance Breakdown?', defaultSubtitle: 'Schedule an immediate technician visit or visit our workshop.', actionLabel: 'Book Repair Service' },
      contact: { name: 'Contact Service Centre', defaultHeading: 'Contact Our Service Desk', defaultSubtitle: 'Call for immediate breakdown emergency or schedule a repair.', actionLabel: 'Submit Repair Request' },
      socialMedia: { name: 'Social Media', defaultHeading: 'Follow Our Tech Desk', defaultSubtitle: 'Helpful troubleshooting tips and equipment care updates.' },
      blog: { name: 'Device Care Tips', defaultHeading: 'Maintenance Guides & Tech Tips', defaultSubtitle: 'Practical tips to extend the lifespan of your gadgets and appliances.' },
      footer: { name: 'Footer', defaultHeading: 'All Rights Reserved' },
    },
  },
  'fitness_sports': {
    mainCategory: 'Fitness & Sports',
    entityName: 'Fitness Club',
    entityTypeLabel: 'Gym & Fitness Centre',
    ctaButtonText: 'Claim Free Trial Pass',
    inquiryHeading: 'Membership & Personal Training Inquiry',
    inquirySubtitle: 'Connect with our head coaches for batch timings, memberships, and trial sessions.',
    inquiryItemLabel: 'Goal / Membership Plan',
    searchPlaceholder: 'Search workouts, plans or equipment...',
    viewAllCatalogLabel: 'Explore All Membership Plans',
    cartBadgeLabel: 'Gym Memberships',
    catalogTabName: 'Memberships & Plans',
    servicesTabName: 'Personal Training',
    coursesTabName: 'Fitness Workshops',
    sections: {
      heroBanner: { name: 'Hero Banner', defaultHeading: 'Transform Your Fitness', actionLabel: 'Join Now' },
      hero: { name: 'Hero Section', defaultHeading: 'Crush Your Goals with State-of-the-Art Training', actionLabel: 'Start Free Trial' },
      about: { name: 'About Our Gym / Club', defaultHeading: 'About Our Fitness Centre', defaultSubtitle: 'Passionate trainers, top-tier equipment, and an encouraging community.' },
      features: { name: 'Why Train With Us', defaultHeading: 'Why Athletes & Members Choose Us', defaultSubtitle: 'Certified coaches, personalized diet plans, and clean hygienic facilities.' },
      category: { name: 'Training Zones & Programs', defaultHeading: 'Training Zones & Fitness Disciplines', defaultSubtitle: 'Strength training, cardio, CrossFit, HIIT, yoga & zumba.' },
      services: { name: 'Personal Training & Facilities', defaultHeading: 'Personal Training & Nutrition Guidance', defaultSubtitle: '1-on-1 coaching, body composition analysis, and custom diet regimes.' },
      products: { name: 'Memberships & Workout Plans', defaultHeading: 'Membership Plans & Packages', defaultSubtitle: 'Flexible monthly, quarterly, and annual subscription memberships.' },
      courses: { name: 'Fitness Bootcamps & Workshops', defaultHeading: 'Bootcamps, Calisthenics & Workshops', defaultSubtitle: 'Special weekend weight loss camps and strength clinics.' },
      videos: { name: 'Workout Demos & Reels', defaultHeading: 'Workout Demos & Member Highlights', defaultSubtitle: 'Watch proper exercise forms, intensity routines & gym tours.' },
      offers: { name: 'Membership Offers & Free Trial Pass', defaultHeading: 'Special Membership Offers & Free Pass', defaultSubtitle: 'Claim a complimentary 1-day workout pass or festive joining discount.' },
      gallery: { name: 'Gym & Equipment Gallery', defaultHeading: 'Gym Floor & Workout Gallery', defaultSubtitle: 'Heavy weights, cardio line, turf area, and modern locker rooms.' },
      portfolio: { name: 'Member Transformations', defaultHeading: 'Inspiring Member Transformations', defaultSubtitle: 'Real before-and-after fat loss and muscle gain results.' },
      team: { name: 'Certified Trainers & Coaches', defaultHeading: 'Our Certified Fitness Coaches', defaultSubtitle: 'National certified trainers, nutritionists, and wellness mentors.' },
      faq: { name: 'Gym FAQs', defaultHeading: 'Frequently Asked Questions', defaultSubtitle: 'Timings, personal trainer fees, locker access, and guest passes.' },
      cta: { name: 'Claim Free Trial Pass', defaultHeading: 'Ready to Start Your Fitness Journey?', defaultSubtitle: 'Claim your complimentary 1-day workout trial pass today.', actionLabel: 'Claim Free Trial Pass' },
      contact: { name: 'Contact Gym & Visit Us', defaultHeading: 'Contact Gym Front Desk', defaultSubtitle: 'Drop by for a campus tour or call for membership inquiry.', actionLabel: 'Send Inquiry' },
      socialMedia: { name: 'Social Media', defaultHeading: 'Join Our Fitness Community', defaultSubtitle: 'Daily workout motivation, member shoutouts, and nutrition tips.' },
      blog: { name: 'Fitness & Nutrition Blog', defaultHeading: 'Workout Tips & Diet Guidance', defaultSubtitle: 'Evidence-based articles on meal prep, fat loss & workout recovery.' },
      footer: { name: 'Footer', defaultHeading: 'All Rights Reserved' },
    },
  },
  'real_estate': {
    mainCategory: 'Real Estate',
    entityName: 'Real Estate Agency',
    entityTypeLabel: 'Real Estate Consultant & Property Advisory',
    ctaButtonText: 'Book Site Visit / Enquire',
    inquiryHeading: 'Property Inquiry & Site Visit',
    inquirySubtitle: 'Connect directly with verified property advisors for site tours and price sheets.',
    inquiryItemLabel: 'Property Type / Budget / Locality',
    searchPlaceholder: 'Search residential, commercial or plots...',
    viewAllCatalogLabel: 'Explore All Properties',
    cartBadgeLabel: 'Saved Properties',
    catalogTabName: 'Properties Catalogue',
    servicesTabName: 'Real Estate Advisory',
    coursesTabName: 'Investment Schemes',
    sections: {
      heroBanner: { name: 'Hero Banner', defaultHeading: 'Find Your Dream Property', actionLabel: 'Browse Properties' },
      hero: { name: 'Hero Section', defaultHeading: 'Verified Properties & Transparent Real Estate Advisory', actionLabel: 'Explore Listings' },
      about: { name: 'About Our Agency', defaultHeading: 'About Our Real Estate Advisory', defaultSubtitle: 'Trusted property consultants delivering verified title deeds and prime locations.' },
      features: { name: 'Why Choose Our Agency', defaultHeading: 'Why Homebuyers & Investors Trust Us', defaultSubtitle: 'RERA compliance, zero brokerage on select projects, and end-to-end registry assistance.' },
      category: { name: 'Property Types & Localities', defaultHeading: 'Explore by Property Type', defaultSubtitle: 'Luxury apartments, independent villas, commercial shops & prime plots.' },
      services: { name: 'Real Estate Services', defaultHeading: 'Comprehensive Property Services', defaultSubtitle: 'Home loan facilitation, legal verification, registry, and property valuation.' },
      products: { name: 'Featured Properties', defaultHeading: 'Featured Properties for Sale & Rent', defaultSubtitle: 'Curated residential and commercial listings ready for possession.' },
      courses: { name: 'Investment Schemes', defaultHeading: 'Pre-Leased & High-ROI Investment Schemes', defaultSubtitle: 'Commercial retail spaces and assured return schemes.' },
      videos: { name: 'Property Tour Videos', defaultHeading: 'Sample Flat & Site Walkthrough Videos', defaultSubtitle: 'Take a virtual walkthrough of model flats and site master plans.' },
      offers: { name: 'Pre-Launch & Booking Deals', defaultHeading: 'Exclusive Pre-Launch Deals & Spot Discounts', defaultSubtitle: 'Limited-period developer discounts, modular kitchen inclusions & flexible payment plans.' },
      gallery: { name: 'Project & Site Gallery', defaultHeading: 'Project & Elevation Gallery', defaultSubtitle: 'Actual site photographs, amenities, clubhouse, and modern facades.' },
      portfolio: { name: 'Delivered Projects', defaultHeading: 'Successfully Handed-Over Projects', defaultSubtitle: 'Track record of delivered residential complexes and commercial hubs.' },
      team: { name: 'Property Advisors', defaultHeading: 'Our Senior Property Consultants', defaultSubtitle: 'Experienced advisors with deep insights into local micro-markets.' },
      faq: { name: 'Property Buyer FAQs', defaultHeading: 'Frequently Asked Questions', defaultSubtitle: 'RERA verification, home loan eligibility, stamp duty, and possession dates.' },
      cta: { name: 'Schedule Site Visit', defaultHeading: 'Found a Property You Like?', defaultSubtitle: 'Book a free chauffeur-driven site visit or speak to our advisory team.', actionLabel: 'Schedule Site Visit' },
      contact: { name: 'Contact Sales Office', defaultHeading: 'Contact Our Property Desk', defaultSubtitle: 'Call or visit our sales gallery for detailed brochures and master plans.', actionLabel: 'Book Site Visit' },
      socialMedia: { name: 'Social Media', defaultHeading: 'Follow for New Project Launches', defaultSubtitle: 'Stay ahead of real estate pre-launches, market trends, and price appreciation alerts.' },
      blog: { name: 'Real Estate Market Insights', defaultHeading: 'Market Reports & Buyer Advice', defaultSubtitle: 'Infrastructure updates, price appreciation trends & smart homebuying guides.' },
      footer: { name: 'Footer', defaultHeading: 'All Rights Reserved' },
    },
  },
};

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
  const rawMain = (mainCategoryName || findMainCategoryBySubCategory(cleanSub)).trim();
  const cleanMain = rawMain || 'Retail & Shopping';
  const cleanMainKey = rawMain.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');

  // 1. Check exact subcategory match in registry
  if (cleanSub && SPECIALIZED_TERMINOLOGY_REGISTRY[cleanSub]) {
    const reg = SPECIALIZED_TERMINOLOGY_REGISTRY[cleanSub]!;
    const base = createGenericSections(reg.entityName || 'Store');
    return {
      mainCategory: reg.mainCategory || rawMain,
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
      } as Record<SectionKey, SectionTerminology>,
    };
  }

  // 2. Check main category profile in MAIN_CATEGORY_TERMINOLOGY_MAP if no specialized subcat
  if (MAIN_CATEGORY_TERMINOLOGY_MAP[cleanMainKey]) {
    const mainProfile = MAIN_CATEGORY_TERMINOLOGY_MAP[cleanMainKey]!;
    const subEntity = subCategoryName && subCategoryName.toLowerCase() !== 'general' && subCategoryName.toLowerCase() !== 'all' ? subCategoryName : mainProfile.entityName || 'Store';
    const base = createGenericSections(subEntity);

    return {
      mainCategory: mainProfile.mainCategory || rawMain,
      subCategory: subCategoryName || subEntity,
      entityName: subEntity,
      entityTypeLabel: mainProfile.entityTypeLabel || `${rawMain} Enterprise`,
      ctaButtonText: mainProfile.ctaButtonText || 'Connect on WhatsApp',
      inquiryHeading: mainProfile.inquiryHeading || `Connect With ${businessName || subEntity}`,
      inquirySubtitle: mainProfile.inquirySubtitle || 'Send your requirements directly to the merchant.',
      inquiryItemLabel: mainProfile.inquiryItemLabel || 'Item / Service Required',
      searchPlaceholder: mainProfile.searchPlaceholder || `Search ${subEntity.toLowerCase()} items or services...`,
      viewAllCatalogLabel: mainProfile.viewAllCatalogLabel || 'Explore All Items',
      cartBadgeLabel: mainProfile.cartBadgeLabel || 'My Order',
      catalogTabName: mainProfile.catalogTabName || 'Products',
      servicesTabName: mainProfile.servicesTabName || 'Services',
      coursesTabName: mainProfile.coursesTabName || 'Courses',
      sections: {
        ...base,
        ...(mainProfile.sections as any),
      },
    };
  }

  // 3. Keyword-based matching for specialized families
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
        ...createGenericSections('School'),
        ...schoolReg.sections,
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
      } as Record<SectionKey, SectionTerminology>,
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
      } as Record<SectionKey, SectionTerminology>,
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
      } as Record<SectionKey, SectionTerminology>,
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
      } as Record<SectionKey, SectionTerminology>,
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
      } as Record<SectionKey, SectionTerminology>,
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
      } as Record<SectionKey, SectionTerminology>,
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
  let mainCat = shop.mainCategory || findMainCategoryBySubCategory(subCat);

  // If subCat is empty or general but businessName has strong hints (e.g. "Rahul Model School")
  let effectiveSubCat = subCat;
  if ((!effectiveSubCat || effectiveSubCat.toLowerCase() === 'general' || effectiveSubCat.toLowerCase() === 'all') && shop.businessName) {
    if (/school|vidyalaya|pathshala/i.test(shop.businessName)) {
      effectiveSubCat = 'School';
      if (!mainCat) mainCat = 'Education';
    } else if (/college|university|vishwavidyalaya/i.test(shop.businessName)) {
      effectiveSubCat = 'College';
      if (!mainCat) mainCat = 'Education';
    } else if (/hospital|clinic|nursing home/i.test(shop.businessName)) {
      effectiveSubCat = 'Clinic';
      if (!mainCat) mainCat = 'Healthcare';
    } else if (/restaurant|cafe|dhaba|bhojanalaya/i.test(shop.businessName)) {
      effectiveSubCat = 'Restaurant';
      if (!mainCat) mainCat = 'Food & Dining';
    } else if (/salon|parlour|spa/i.test(shop.businessName)) {
      effectiveSubCat = 'Beauty Salon';
      if (!mainCat) mainCat = 'Beauty & Wellness';
    } else if (/gym|fitness/i.test(shop.businessName)) {
      effectiveSubCat = 'Gym';
      if (!mainCat) mainCat = 'Fitness & Sports';
    }
  }

  return resolveCategoryTerminology(mainCat, effectiveSubCat, shop.businessName);
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
