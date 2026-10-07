import type { FormTemplate } from '../types';

export const INITIAL_TEMPLATES: FormTemplate[] = [
  // ==========================================
  // 1. TRAVEL
  // ==========================================
  {
    id: 'template-travel-visa',
    title: 'Visa Application Form',
    description: 'International visa application capturing traveler details, passport info, destination, and travel dates.',
    category: 'Travel',
    icon: 'Plane',
    estimatedMinutes: 5,
    isPublished: true,
    createdAt: '2026-03-01T10:00:00.000Z',
    updatedAt: '2026-03-18T10:00:00.000Z',
    fields: [
      {
        id: 'f-trv-1',
        key: 'fullName',
        label: 'Full Name',
        type: 'text',
        placeholder: 'e.g. Sneha Rai (as on Passport)',
        required: true
      },
      {
        id: 'f-trv-2',
        key: 'passportNumber',
        label: 'Passport Number',
        type: 'text',
        placeholder: 'e.g. Z1234567',
        required: true,
        isSensitive: true,
        validation: { min: 6, max: 12 }
      },
      {
        id: 'f-trv-3',
        key: 'nationality',
        label: 'Nationality',
        type: 'text',
        placeholder: 'e.g. Indian',
        required: true
      },
      {
        id: 'f-trv-4',
        key: 'destinationCountry',
        label: 'Travel Destination',
        type: 'select',
        required: true,
        options: [
          { label: 'United States of America (US)', value: 'USA' },
          { label: 'United Kingdom (UK)', value: 'UK' },
          { label: 'Schengen Area (Europe)', value: 'EU' },
          { label: 'United Arab Emirates (UAE / Dubai)', value: 'UAE' },
          { label: 'Singapore', value: 'SG' },
          { label: 'Japan', value: 'JP' },
          { label: 'Australia', value: 'AU' },
          { label: 'Canada', value: 'CA' }
        ]
      },
      {
        id: 'f-trv-5',
        key: 'purposeOfVisit',
        label: 'Purpose of Visit',
        type: 'radio',
        required: true,
        options: [
          { label: 'Tourism & Sightseeing', value: 'tourism' },
          { label: 'Business & Meetings', value: 'business' },
          { label: 'Education / Student Exchange', value: 'education' },
          { label: 'Family & Friends Visit', value: 'family' }
        ]
      },
      {
        id: 'f-trv-6',
        key: 'travelStartDate',
        label: 'Travel Date (From)',
        type: 'date',
        required: true
      },
      {
        id: 'f-trv-7',
        key: 'travelEndDate',
        label: 'Travel Date (To)',
        type: 'date',
        required: true
      },
      {
        id: 'f-trv-8',
        key: 'stayDurationDays',
        label: 'Duration of Stay (in Days)',
        type: 'number',
        placeholder: 'e.g. 15',
        required: true,
        validation: { min: 1, max: 365 }
      }
    ]
  },
  {
    id: 'template-travel-passport-renewal',
    title: 'Passport Renewal Form',
    description: 'Fast-track application for passport renewal, address updates, and booklet re-issue.',
    category: 'Travel',
    icon: 'FileBadge',
    estimatedMinutes: 4,
    isPublished: true,
    createdAt: '2026-03-02T10:00:00.000Z',
    updatedAt: '2026-03-18T10:00:00.000Z',
    fields: [
      {
        id: 'f-pr-1',
        key: 'fullName',
        label: 'Full Name',
        type: 'text',
        placeholder: 'Name as registered on previous passport',
        required: true
      },
      {
        id: 'f-pr-2',
        key: 'existingPassportNumber',
        label: 'Existing Passport Number',
        type: 'text',
        placeholder: 'e.g. A9876543',
        required: true,
        isSensitive: true
      },
      {
        id: 'f-pr-3',
        key: 'dob',
        label: 'Date of Birth (DOB)',
        type: 'date',
        required: true,
        isSensitive: true
      },
      {
        id: 'f-pr-4',
        key: 'residentialAddress',
        label: 'Residential Address',
        type: 'textarea',
        placeholder: 'House No, Street, City, State, Pincode',
        required: true,
        isSensitive: true
      },
      {
        id: 'f-pr-5',
        key: 'renewalReason',
        label: 'Reason for Renewal',
        type: 'select',
        required: true,
        options: [
          { label: 'Validity Expired / Due to Expire', value: 'validity-expired' },
          { label: 'Exhaustion of Visa Pages', value: 'pages-exhausted' },
          { label: 'Change in Address / Name Particulars', value: 'particulars-change' },
          { label: 'Lost / Damaged Passport', value: 'damaged-lost' }
        ]
      },
      {
        id: 'f-pr-6',
        key: 'photoUpload',
        label: 'Passport Size Photo Upload',
        type: 'file',
        placeholder: 'Upload JPG/PNG photo',
        required: false
      }
    ]
  },
  {
    id: 'template-travel-insurance',
    title: 'Travel Insurance Application',
    description: 'Medical and baggage coverage application for domestic and international trips.',
    category: 'Travel',
    icon: 'ShieldCheck',
    estimatedMinutes: 4,
    isPublished: true,
    createdAt: '2026-03-03T10:00:00.000Z',
    updatedAt: '2026-03-18T10:00:00.000Z',
    fields: [
      {
        id: 'f-ti-1',
        key: 'fullName',
        label: 'Full Name',
        type: 'text',
        placeholder: 'e.g. Sneha Rai',
        required: true
      },
      {
        id: 'f-ti-2',
        key: 'travelDestination',
        label: 'Trip Destination',
        type: 'select',
        required: true,
        options: [
          { label: 'Worldwide (Including USA & Canada)', value: 'worldwide-inc-usa' },
          { label: 'Worldwide (Excluding USA & Canada)', value: 'worldwide-exc-usa' },
          { label: 'Schengen Countries (Europe)', value: 'schengen' },
          { label: 'Asia & Middle East', value: 'asia' },
          { label: 'Domestic Travel (Within India)', value: 'domestic' }
        ]
      },
      {
        id: 'f-ti-3',
        key: 'travelStartDate',
        label: 'Travel Date (From)',
        type: 'date',
        required: true
      },
      {
        id: 'f-ti-4',
        key: 'travelEndDate',
        label: 'Travel Date (To)',
        type: 'date',
        required: true
      },
      {
        id: 'f-ti-5',
        key: 'policyPlanType',
        label: 'Coverage Type',
        type: 'radio',
        required: true,
        options: [
          { label: 'Silver Plan ($50,000 Medical Sum Insured)', value: 'silver-50k' },
          { label: 'Gold Plan ($100,000 Medical + Flight Delay)', value: 'gold-100k' },
          { label: 'Platinum Elite ($500,000 Comprehensive Coverage)', value: 'platinum-500k' }
        ]
      },
      {
        id: 'f-ti-6',
        key: 'applicantAge',
        label: 'Age of Primary Insured',
        type: 'number',
        placeholder: 'e.g. 28',
        required: true,
        validation: { min: 1, max: 100 }
      },
      {
        id: 'f-ti-7',
        key: 'preExistingMedicalConditions',
        label: 'Pre-existing Medical Conditions',
        type: 'textarea',
        placeholder: 'e.g. Diabetes, Asthma, Hypertension (Type "None" if none)',
        required: true,
        isSensitive: true
      }
    ]
  },
  {
    id: 'template-travel-hotel-booking',
    title: 'Hotel Booking Request Form',
    description: 'Direct guest room reservation, check-in schedules, and room preferences.',
    category: 'Travel',
    icon: 'Building',
    estimatedMinutes: 3,
    isPublished: true,
    createdAt: '2026-03-04T10:00:00.000Z',
    updatedAt: '2026-03-18T10:00:00.000Z',
    fields: [
      {
        id: 'f-hb-1',
        key: 'fullName',
        label: 'Full Name',
        type: 'text',
        placeholder: 'e.g. Sneha Rai',
        required: true
      },
      {
        id: 'f-hb-2',
        key: 'checkInDate',
        label: 'Check-in Date',
        type: 'date',
        required: true
      },
      {
        id: 'f-hb-3',
        key: 'checkOutDate',
        label: 'Check-out Date',
        type: 'date',
        required: true
      },
      {
        id: 'f-hb-4',
        key: 'roomType',
        label: 'Room Type',
        type: 'select',
        required: true,
        options: [
          { label: 'Deluxe King Bed Room', value: 'deluxe-king' },
          { label: 'Executive Twin Bed Suite', value: 'exec-twin' },
          { label: 'Presidential Club Suite', value: 'presidential-suite' }
        ]
      },
      {
        id: 'f-hb-5',
        key: 'numberOfGuests',
        label: 'Number of Guests',
        type: 'number',
        placeholder: 'e.g. 2',
        required: true,
        validation: { min: 1, max: 10 }
      },
      {
        id: 'f-hb-6',
        key: 'specialRequests',
        label: 'Special Requests',
        type: 'textarea',
        placeholder: 'e.g. Late check-in, high floor room, airport taxi needed',
        required: false
      }
    ]
  },
  {
    id: 'template-travel-tour-package',
    title: 'International Tour Package Enquiry',
    description: 'Custom vacation packages, group tours, sightseeing itineraries, and travel budget preferences.',
    category: 'Travel',
    icon: 'Compass',
    estimatedMinutes: 3,
    isPublished: true,
    createdAt: '2026-03-05T10:00:00.000Z',
    updatedAt: '2026-03-18T10:00:00.000Z',
    fields: [
      {
        id: 'f-tp-1',
        key: 'fullName',
        label: 'Full Name',
        type: 'text',
        placeholder: 'e.g. Sneha Rai',
        required: true
      },
      {
        id: 'f-tp-2',
        key: 'email',
        label: 'Email Address',
        type: 'email',
        placeholder: 'travel@example.com',
        required: true,
        isSensitive: true
      },
      {
        id: 'f-tp-3',
        key: 'destination',
        label: 'Dream Holiday Destination',
        type: 'select',
        required: true,
        options: [
          { label: 'Switzerland Alps & Scenic Europe', value: 'europe-alps' },
          { label: 'Dubai Ultra-Luxury & Desert Safari', value: 'dubai-luxury' },
          { label: 'Bali Paradise Beaches & Cultural Villas', value: 'bali-villas' },
          { label: 'Japan Cherry Blossom Tour', value: 'japan-cherry' }
        ]
      },
      {
        id: 'f-tp-4',
        key: 'budgetPerPerson',
        label: 'Budget Per Person (INR)',
        type: 'number',
        placeholder: 'e.g. 75000',
        required: true
      }
    ]
  },

  // ==========================================
  // 2. LEGAL
  // ==========================================
  {
    id: 'template-legal-affidavit',
    title: 'Affidavit Form',
    description: 'Legal sworn declaration format for name change, identity verification, and notary submission.',
    category: 'Legal',
    icon: 'Scale',
    estimatedMinutes: 3,
    isPublished: true,
    createdAt: '2026-03-01T11:00:00.000Z',
    updatedAt: '2026-03-18T10:00:00.000Z',
    fields: [
      {
        id: 'f-leg-1',
        key: 'fullName',
        label: 'Full Name',
        type: 'text',
        placeholder: 'e.g. Sneha Rai',
        required: true
      },
      {
        id: 'f-leg-2',
        key: 'residenceAddress',
        label: 'Address',
        type: 'textarea',
        placeholder: 'Complete residential address, district, state, pincode',
        required: true,
        isSensitive: true
      },
      {
        id: 'f-leg-3',
        key: 'purposeOfAffidavit',
        label: 'Purpose of Affidavit',
        type: 'select',
        required: true,
        options: [
          { label: 'Name Correction / Spelling Rectification', value: 'correction' },
          { label: 'Post-Marriage Surname Change', value: 'marriage-change' },
          { label: 'Proof of Residence & Identity Declaration', value: 'identity-proof' },
          { label: 'Lost Document Affidavit', value: 'lost-docs' }
        ]
      },
      {
        id: 'f-leg-4',
        key: 'statementDetails',
        label: 'Statement Details',
        type: 'textarea',
        placeholder: 'State the full factual declaration to be sworn before notary...',
        required: true
      },
      {
        id: 'f-leg-5',
        key: 'notaryDate',
        label: 'Notary Date',
        type: 'date',
        required: true
      }
    ]
  },
  {
    id: 'template-legal-power-of-attorney',
    title: 'Power of Attorney Request',
    description: 'Grant of legal authority to execute property, banking, or business matters.',
    category: 'Legal',
    icon: 'FileSignature',
    estimatedMinutes: 4,
    isPublished: true,
    createdAt: '2026-03-02T11:00:00.000Z',
    updatedAt: '2026-03-18T10:00:00.000Z',
    fields: [
      {
        id: 'f-poa-1',
        key: 'grantorName',
        label: 'Grantor Name (Principal)',
        type: 'text',
        placeholder: 'Person granting authority',
        required: true
      },
      {
        id: 'f-poa-2',
        key: 'attorneyName',
        label: 'Attorney Name (Agent)',
        type: 'text',
        placeholder: 'Person receiving legal powers',
        required: true
      },
      {
        id: 'f-poa-3',
        key: 'scopeOfAuthority',
        label: 'Scope of Authority',
        type: 'select',
        required: true,
        options: [
          { label: 'General Power of Attorney (GPA - All Matters)', value: 'gpa' },
          { label: 'Special Power of Attorney (SPA - Specific Property/Bank)', value: 'spa' }
        ]
      },
      {
        id: 'f-poa-4',
        key: 'duration',
        label: 'Duration / Validity Period',
        type: 'select',
        required: true,
        options: [
          { label: 'Valid for 1 Year', value: '1-year' },
          { label: 'Valid for 3 Years', value: '3-years' },
          { label: 'Until specific transaction completion', value: 'until-completion' },
          { label: 'Perpetual until revoked in writing', value: 'perpetual' }
        ]
      },
      {
        id: 'f-poa-5',
        key: 'propertyAssetDetails',
        label: 'Property/Asset Details',
        type: 'textarea',
        placeholder: 'Survey number, flat address, bank account number, or court matter...',
        required: true
      }
    ]
  },
  {
    id: 'template-legal-noc-application',
    title: 'NOC (No Objection Certificate) Application',
    description: 'Application for obtaining official NOC for property, vehicle, or employment.',
    category: 'Legal',
    icon: 'FileCheck',
    estimatedMinutes: 3,
    isPublished: true,
    createdAt: '2026-03-03T11:00:00.000Z',
    updatedAt: '2026-03-18T10:00:00.000Z',
    fields: [
      {
        id: 'f-noc-1',
        key: 'applicantName',
        label: 'Applicant Name',
        type: 'text',
        placeholder: 'e.g. Sneha Rai',
        required: true
      },
      {
        id: 'f-noc-2',
        key: 'purposeOfNoc',
        label: 'Purpose of NOC',
        type: 'text',
        placeholder: 'e.g. Vehicle Inter-State Transfer / Property Sale',
        required: true
      },
      {
        id: 'f-noc-3',
        key: 'issuingAuthority',
        label: 'Issuing Authority',
        type: 'select',
        required: true,
        options: [
          { label: 'Regional Transport Office (RTO)', value: 'rto' },
          { label: 'Municipal Housing Society', value: 'housing-society' },
          { label: 'Employer / University', value: 'employer' },
          { label: 'Banking Institution', value: 'bank' }
        ]
      },
      {
        id: 'f-noc-4',
        key: 'reasonForNoc',
        label: 'Reason',
        type: 'textarea',
        placeholder: 'State the detailed background reason for requesting NOC...',
        required: true
      },
      {
        id: 'f-noc-5',
        key: 'supportingDocUpload',
        label: 'Supporting Document Upload',
        type: 'file',
        placeholder: 'Upload PDF / Image document',
        required: false
      }
    ]
  },
  {
    id: 'template-legal-rental-agreement',
    title: 'Rental Agreement Form',
    description: 'Tenancy agreement capturing landlord, tenant, rent, lease duration, and security deposit.',
    category: 'Legal',
    icon: 'Building2',
    estimatedMinutes: 4,
    isPublished: true,
    createdAt: '2026-03-04T11:00:00.000Z',
    updatedAt: '2026-03-18T10:00:00.000Z',
    fields: [
      {
        id: 'f-ra-1',
        key: 'landlordName',
        label: 'Landlord Name',
        type: 'text',
        placeholder: 'e.g. Rajesh Kumar Sharma',
        required: true
      },
      {
        id: 'f-ra-2',
        key: 'tenantName',
        label: 'Tenant Name',
        type: 'text',
        placeholder: 'e.g. Sneha Rai',
        required: true
      },
      {
        id: 'f-ra-3',
        key: 'propertyAddress',
        label: 'Property Address',
        type: 'textarea',
        placeholder: 'Flat/Unit No, Building Name, Street, Landmark, Pincode',
        required: true,
        isSensitive: true
      },
      {
        id: 'f-ra-4',
        key: 'monthlyRent',
        label: 'Rent Amount (Monthly INR)',
        type: 'number',
        placeholder: 'e.g. 32000',
        required: true
      },
      {
        id: 'f-ra-5',
        key: 'leaseDuration',
        label: 'Lease Duration',
        type: 'select',
        required: true,
        options: [
          { label: '11 Months Standard', value: '11-months' },
          { label: '24 Months (2 Years)', value: '24-months' },
          { label: '36 Months (3 Years)', value: '36-months' }
        ]
      },
      {
        id: 'f-ra-6',
        key: 'securityDeposit',
        label: 'Security Deposit (INR)',
        type: 'number',
        placeholder: 'e.g. 64000',
        required: true
      }
    ]
  },
  {
    id: 'template-legal-consultation',
    title: 'Legal Consultation Booking',
    description: 'Schedule a consultation with certified advocates across civil, corporate, and criminal law.',
    category: 'Legal',
    icon: 'Scale',
    estimatedMinutes: 3,
    isPublished: true,
    createdAt: '2026-03-05T11:00:00.000Z',
    updatedAt: '2026-03-18T10:00:00.000Z',
    fields: [
      {
        id: 'f-lc-1',
        key: 'clientName',
        label: 'Full Name',
        type: 'text',
        placeholder: 'e.g. Sneha Rai',
        required: true
      },
      {
        id: 'f-lc-2',
        key: 'email',
        label: 'Email Address',
        type: 'email',
        placeholder: 'client@example.com',
        required: true,
        isSensitive: true
      },
      {
        id: 'f-lc-3',
        key: 'matterSummary',
        label: 'Legal Matter Summary',
        type: 'textarea',
        placeholder: 'Summarize key dispute facts...',
        required: true
      }
    ]
  },

  // ==========================================
  // 3. GENERAL
  // ==========================================
  {
    id: 'template-general-contact-enquiry',
    title: 'Contact/Enquiry Form',
    description: 'General queries, business partnerships, customer service requests, and feedback.',
    category: 'General',
    icon: 'MessageSquare',
    estimatedMinutes: 2,
    isPublished: true,
    createdAt: '2026-03-01T16:00:00.000Z',
    updatedAt: '2026-03-18T10:00:00.000Z',
    fields: [
      {
        id: 'f-ce-1',
        key: 'fullName',
        label: 'Full Name',
        type: 'text',
        placeholder: 'e.g. Sneha Rai',
        required: true
      },
      {
        id: 'f-ce-2',
        key: 'email',
        label: 'Email',
        type: 'email',
        placeholder: 'sneha@example.com',
        required: true,
        isSensitive: true
      },
      {
        id: 'f-ce-3',
        key: 'phone',
        label: 'Phone',
        type: 'phone',
        placeholder: '+91 98765 43210',
        required: false,
        isSensitive: true
      },
      {
        id: 'f-ce-4',
        key: 'subject',
        label: 'Subject',
        type: 'text',
        placeholder: 'e.g. Question regarding API voice integration',
        required: true
      },
      {
        id: 'f-ce-5',
        key: 'message',
        label: 'Message',
        type: 'textarea',
        placeholder: 'Please describe your query in detail...',
        required: true
      }
    ]
  },
  {
    id: 'template-general-feedback-survey',
    title: 'Feedback & Survey Form',
    description: 'User satisfaction survey, feature feedback, and recommendation score.',
    category: 'General',
    icon: 'HelpCircle',
    estimatedMinutes: 2,
    isPublished: true,
    createdAt: '2026-03-02T16:00:00.000Z',
    updatedAt: '2026-03-18T10:00:00.000Z',
    fields: [
      {
        id: 'f-fs-1',
        key: 'fullName',
        label: 'Full Name',
        type: 'text',
        placeholder: 'e.g. Sneha Rai',
        required: true
      },
      {
        id: 'f-fs-2',
        key: 'email',
        label: 'Email',
        type: 'email',
        placeholder: 'sneha@example.com',
        required: true,
        isSensitive: true
      },
      {
        id: 'f-fs-3',
        key: 'rating',
        label: 'Rating',
        type: 'select',
        required: true,
        options: [
          { label: '⭐⭐⭐⭐⭐ 5 Stars - Excellent', value: '5-stars' },
          { label: '⭐⭐⭐⭐ 4 Stars - Very Good', value: '4-stars' },
          { label: '⭐⭐⭐ 3 Stars - Average', value: '3-stars' },
          { label: '⭐⭐ 2 Stars - Below Expectations', value: '2-stars' },
          { label: '⭐ 1 Star - Poor', value: '1-star' }
        ]
      },
      {
        id: 'f-fs-4',
        key: 'feedbackComments',
        label: 'Feedback Comments',
        type: 'textarea',
        placeholder: 'Share your thoughts, suggestions, or feature requests...',
        required: true
      },
      {
        id: 'f-fs-5',
        key: 'wouldRecommend',
        label: 'Would Recommend to Colleagues?',
        type: 'radio',
        required: true,
        options: [
          { label: 'Yes, Absolutely!', value: 'yes' },
          { label: 'Maybe / Neutral', value: 'maybe' },
          { label: 'No', value: 'no' }
        ]
      }
    ]
  },
  {
    id: 'template-general-newsletter-signup',
    title: 'Newsletter Signup',
    description: 'Subscribe to AI insights, tech digests, product updates, and special announcements.',
    category: 'General',
    icon: 'Mail',
    estimatedMinutes: 1,
    isPublished: true,
    createdAt: '2026-03-03T16:00:00.000Z',
    updatedAt: '2026-03-18T10:00:00.000Z',
    fields: [
      {
        id: 'f-nl-1',
        key: 'fullName',
        label: 'Full Name',
        type: 'text',
        placeholder: 'e.g. Sneha Rai',
        required: true
      },
      {
        id: 'f-nl-2',
        key: 'email',
        label: 'Email',
        type: 'email',
        placeholder: 'subscriber@domain.com',
        required: true,
        isSensitive: true
      },
      {
        id: 'f-nl-3',
        key: 'interests',
        label: 'Interests',
        type: 'select',
        required: true,
        options: [
          { label: 'Voice AI & Speech Recognition LLMs', value: 'voice-ai' },
          { label: 'Modern Frontend & Web Technologies', value: 'frontend' },
          { label: 'Workflow Automation & Form Building', value: 'automation' },
          { label: 'All Weekly Digests & Announcements', value: 'all' }
        ]
      },
      {
        id: 'f-nl-4',
        key: 'frequencyPreference',
        label: 'Frequency Preference',
        type: 'radio',
        required: true,
        options: [
          { label: 'Weekly Digest (Every Tuesday)', value: 'weekly' },
          { label: 'Monthly Magazine', value: 'monthly' }
        ]
      }
    ]
  },
  {
    id: 'template-general-appointment-booking',
    title: 'Appointment Booking Form',
    description: 'Schedule appointments for consultations, services, and specialist meetings.',
    category: 'General',
    icon: 'Calendar',
    estimatedMinutes: 2,
    isPublished: true,
    createdAt: '2026-03-04T16:00:00.000Z',
    updatedAt: '2026-03-18T10:00:00.000Z',
    fields: [
      {
        id: 'f-ab-1',
        key: 'fullName',
        label: 'Full Name',
        type: 'text',
        placeholder: 'e.g. Sneha Rai',
        required: true
      },
      {
        id: 'f-ab-2',
        key: 'phone',
        label: 'Phone',
        type: 'phone',
        placeholder: '+91 98765 43210',
        required: true,
        isSensitive: true
      },
      {
        id: 'f-ab-3',
        key: 'preferredDate',
        label: 'Preferred Date',
        type: 'date',
        required: true
      },
      {
        id: 'f-ab-4',
        key: 'preferredTime',
        label: 'Preferred Time',
        type: 'select',
        required: true,
        options: [
          { label: '10:00 AM - 11:30 AM (Morning)', value: '10am' },
          { label: '02:00 PM - 03:30 PM (Afternoon)', value: '2pm' },
          { label: '05:00 PM - 06:30 PM (Evening)', value: '5pm' }
        ]
      },
      {
        id: 'f-ab-5',
        key: 'purposeOfVisit',
        label: 'Purpose of Visit',
        type: 'textarea',
        placeholder: 'Describe the main reason for the appointment...',
        required: true
      }
    ]
  },
  {
    id: 'template-general-complaint-reg',
    title: 'Complaint Registration Form',
    description: 'Formal grievance logging, service defect reports, and customer resolution tracking.',
    category: 'General',
    icon: 'AlertCircle',
    estimatedMinutes: 3,
    isPublished: true,
    createdAt: '2026-03-05T16:00:00.000Z',
    updatedAt: '2026-03-18T10:00:00.000Z',
    fields: [
      {
        id: 'f-cmp-1',
        key: 'fullName',
        label: 'Full Name',
        type: 'text',
        placeholder: 'e.g. Sneha Rai',
        required: true
      },
      {
        id: 'f-cmp-2',
        key: 'phone',
        label: 'Contact Phone Number',
        type: 'phone',
        placeholder: '+91 98765 43210',
        required: true,
        isSensitive: true
      },
      {
        id: 'f-cmp-3',
        key: 'complaintDetails',
        label: 'Complaint Details',
        type: 'textarea',
        placeholder: 'Describe the issue...',
        required: true
      }
    ]
  },

  // ==========================================
  // 4. EMPLOYMENT
  // ==========================================
  {
    id: 'template-employment-internship-app',
    title: 'Internship Application Form',
    description: 'Student internship applications for engineering, product, and design roles.',
    category: 'Employment',
    icon: 'GraduationCap',
    estimatedMinutes: 3,
    isPublished: true,
    createdAt: '2026-03-01T17:00:00.000Z',
    updatedAt: '2026-03-18T10:00:00.000Z',
    fields: [
      {
        id: 'f-int-1',
        key: 'fullName',
        label: 'Full Name',
        type: 'text',
        placeholder: 'e.g. Sneha Rai',
        required: true
      },
      {
        id: 'f-int-2',
        key: 'email',
        label: 'Email',
        type: 'email',
        placeholder: 'sneha@university.edu',
        required: true,
        isSensitive: true
      },
      {
        id: 'f-int-3',
        key: 'phone',
        label: 'Phone',
        type: 'phone',
        placeholder: '+91 98765 43210',
        required: true,
        isSensitive: true
      },
      {
        id: 'f-int-4',
        key: 'collegeName',
        label: 'College Name',
        type: 'text',
        placeholder: 'e.g. Indian Institute of Technology (IIT Delhi)',
        required: true
      },
      {
        id: 'f-int-5',
        key: 'courseAndYear',
        label: 'Course & Year',
        type: 'text',
        placeholder: 'e.g. B.Tech Computer Science - 3rd Year',
        required: true
      },
      {
        id: 'f-int-6',
        key: 'internshipDuration',
        label: 'Internship Duration',
        type: 'select',
        required: true,
        options: [
          { label: '2 Months (Summer Internship)', value: '2-months' },
          { label: '6 Months (Semester Internship)', value: '6-months' }
        ]
      },
      {
        id: 'f-int-7',
        key: 'resumeUpload',
        label: 'Resume Upload',
        type: 'file',
        placeholder: 'Upload PDF Resume',
        required: false
      }
    ]
  },
  {
    id: 'template-employment-onboarding',
    title: 'Employee Onboarding Form',
    description: 'HR joining formalities, statutory records, emergency contacts, and payroll setup.',
    category: 'Employment',
    icon: 'UserPlus',
    estimatedMinutes: 5,
    isPublished: true,
    createdAt: '2026-03-02T17:00:00.000Z',
    updatedAt: '2026-03-18T10:00:00.000Z',
    fields: [
      {
        id: 'f-eob-1',
        key: 'fullName',
        label: 'Full Name',
        type: 'text',
        placeholder: 'As per PAN / Aadhaar card',
        required: true
      },
      {
        id: 'f-eob-2',
        key: 'employeeId',
        label: 'Employee ID',
        type: 'text',
        placeholder: 'e.g. EMP-2026-088',
        required: true
      },
      {
        id: 'f-eob-3',
        key: 'department',
        label: 'Department',
        type: 'select',
        required: true,
        options: [
          { label: 'Engineering & Technology', value: 'engineering' },
          { label: 'AI & Data Science', value: 'ai-data' },
          { label: 'Product & Design', value: 'product-design' },
          { label: 'Human Resources & Operations', value: 'hr-ops' }
        ]
      },
      {
        id: 'f-eob-4',
        key: 'joiningDate',
        label: 'Joining Date',
        type: 'date',
        required: true
      },
      {
        id: 'f-eob-5',
        key: 'emergencyContact',
        label: 'Emergency Contact',
        type: 'phone',
        placeholder: '+91 98888 77777',
        required: true,
        isSensitive: true
      },
      {
        id: 'f-eob-6',
        key: 'bankAccountDetails',
        label: 'Bank Account Details (Account & IFSC)',
        type: 'text',
        placeholder: 'e.g. A/C: 102938475612, IFSC: HDFC0001234',
        required: true,
        isSensitive: true
      }
    ]
  },
  {
    id: 'template-employment-leave-application',
    title: 'Leave Application Form',
    description: 'Time off, sick leave, annual vacation, and absence approval requests.',
    category: 'Employment',
    icon: 'Calendar',
    estimatedMinutes: 2,
    isPublished: true,
    createdAt: '2026-03-03T17:00:00.000Z',
    updatedAt: '2026-03-18T10:00:00.000Z',
    fields: [
      {
        id: 'f-la-1',
        key: 'employeeName',
        label: 'Employee Name',
        type: 'text',
        placeholder: 'e.g. Sneha Rai',
        required: true
      },
      {
        id: 'f-la-2',
        key: 'employeeId',
        label: 'Employee ID',
        type: 'text',
        placeholder: 'e.g. EMP-2026-088',
        required: true
      },
      {
        id: 'f-la-3',
        key: 'leaveType',
        label: 'Leave Type',
        type: 'select',
        required: true,
        options: [
          { label: 'Earned / Annual Leave', value: 'earned' },
          { label: 'Casual Leave', value: 'casual' },
          { label: 'Medical / Sick Leave', value: 'sick' },
          { label: 'Parental Leave', value: 'parental' }
        ]
      },
      {
        id: 'f-la-4',
        key: 'fromDate',
        label: 'From Date',
        type: 'date',
        required: true
      },
      {
        id: 'f-la-5',
        key: 'toDate',
        label: 'To Date',
        type: 'date',
        required: true
      },
      {
        id: 'f-la-6',
        key: 'reason',
        label: 'Reason',
        type: 'textarea',
        placeholder: 'Provide brief context for leave...',
        required: true
      }
    ]
  },
  {
    id: 'template-employment-resignation',
    title: 'Resignation Letter Request',
    description: 'Formal career exit notice, last working day, and reason for resignation.',
    category: 'Employment',
    icon: 'FileText',
    estimatedMinutes: 3,
    isPublished: true,
    createdAt: '2026-03-04T17:00:00.000Z',
    updatedAt: '2026-03-18T10:00:00.000Z',
    fields: [
      {
        id: 'f-res-1',
        key: 'employeeName',
        label: 'Employee Name',
        type: 'text',
        placeholder: 'e.g. Sneha Rai',
        required: true
      },
      {
        id: 'f-res-2',
        key: 'employeeId',
        label: 'Employee ID',
        type: 'text',
        placeholder: 'e.g. EMP-2026-088',
        required: true
      },
      {
        id: 'f-res-3',
        key: 'lastWorkingDay',
        label: 'Last Working Day',
        type: 'date',
        required: true
      },
      {
        id: 'f-res-4',
        key: 'reasonForResignation',
        label: 'Reason for Resignation',
        type: 'textarea',
        placeholder: 'State primary reasons for career transition...',
        required: true
      },
      {
        id: 'f-res-5',
        key: 'noticePeriod',
        label: 'Notice Period',
        type: 'select',
        required: true,
        options: [
          { label: '30 Days Standard', value: '30d' },
          { label: '60 Days', value: '60d' },
          { label: '90 Days', value: '90d' },
          { label: 'Immediate / Buyout Requested', value: 'immediate' }
        ]
      }
    ]
  },
  {
    id: 'template-job-application',
    title: 'Job Application & Tech Profile',
    description: 'Fast application form for software engineers, product designers, and AI researchers.',
    category: 'Employment',
    icon: 'Briefcase',
    estimatedMinutes: 3,
    isPublished: true,
    createdAt: '2026-03-05T17:00:00.000Z',
    updatedAt: '2026-03-18T10:00:00.000Z',
    fields: [
      {
        id: 'f-j-1',
        key: 'fullName',
        label: 'Full Name',
        type: 'text',
        placeholder: 'e.g. Sneha Rai',
        required: true
      },
      {
        id: 'f-j-2',
        key: 'email',
        label: 'Email Address',
        type: 'email',
        placeholder: 'sneha.work@domain.com',
        required: true,
        isSensitive: true
      },
      {
        id: 'f-j-3',
        key: 'targetRole',
        label: 'Role Applied For',
        type: 'select',
        required: true,
        options: [
          { label: 'Senior Frontend Engineer (React/TypeScript)', value: 'sr-frontend' },
          { label: 'Staff AI Agent Engineer (LLMs/LangChain)', value: 'staff-ai' },
          { label: 'Fullstack Platform Engineer', value: 'fullstack' }
        ]
      },
      {
        id: 'f-j-4',
        key: 'yearsExperience',
        label: 'Years of Experience',
        type: 'number',
        placeholder: 'e.g. 5',
        required: true
      }
    ]
  },

  // ==========================================
  // 5. EDUCATION
  // ==========================================
  {
    id: 'template-edu-college-admission',
    title: 'College Admission Form',
    description: 'Degree enrollment form capturing academic history, merit percentage, and course choice.',
    category: 'Education',
    icon: 'GraduationCap',
    estimatedMinutes: 5,
    isPublished: true,
    createdAt: '2026-03-01T10:00:00.000Z',
    updatedAt: '2026-03-18T10:00:00.000Z',
    fields: [
      {
        id: 'f-adm-1',
        key: 'fullName',
        label: 'Full Name',
        type: 'text',
        placeholder: 'e.g. Sneha Rai',
        required: true
      },
      {
        id: 'f-adm-2',
        key: 'dob',
        label: 'DOB',
        type: 'date',
        required: true,
        isSensitive: true
      },
      {
        id: 'f-adm-3',
        key: 'email',
        label: 'Email',
        type: 'email',
        placeholder: 'sneha.rai@example.com',
        required: true,
        isSensitive: true
      },
      {
        id: 'f-adm-4',
        key: 'phone',
        label: 'Phone',
        type: 'phone',
        placeholder: '+91 98765 43210',
        required: true,
        isSensitive: true
      },
      {
        id: 'f-adm-5',
        key: 'previousSchoolName',
        label: 'Previous School Name',
        type: 'text',
        placeholder: 'e.g. Delhi Public School / St. Xavier',
        required: true
      },
      {
        id: 'f-adm-6',
        key: 'percentageCgpa',
        label: 'Percentage/CGPA',
        type: 'number',
        placeholder: 'e.g. 92.5',
        required: true,
        validation: { min: 0, max: 100 }
      },
      {
        id: 'f-adm-7',
        key: 'courseApplyingFor',
        label: 'Course Applying For',
        type: 'select',
        required: true,
        options: [
          { label: 'B.Tech - Artificial Intelligence & Data Science', value: 'btech-ai' },
          { label: 'B.Tech - Computer Science & Engineering', value: 'btech-cse' },
          { label: 'B.Sc - Cognitive Science & Computing', value: 'bsc-cog' },
          { label: 'BBA / MBA Integrated Program', value: 'bba-mba' }
        ]
      },
      {
        id: 'f-adm-8',
        key: 'photoUpload',
        label: 'Photo Upload',
        type: 'file',
        placeholder: 'Upload JPG/PNG photo',
        required: false
      }
    ]
  },
  {
    id: 'template-edu-scholarship',
    title: 'Scholarship Application',
    description: 'Need-based and merit scholarship grant application for higher education and financial aid.',
    category: 'Education',
    icon: 'Award',
    estimatedMinutes: 4,
    isPublished: true,
    createdAt: '2026-03-02T10:00:00.000Z',
    updatedAt: '2026-03-18T10:00:00.000Z',
    fields: [
      {
        id: 'f-sch-1',
        key: 'fullName',
        label: 'Full Name',
        type: 'text',
        placeholder: 'e.g. Sneha Rai',
        required: true
      },
      {
        id: 'f-sch-2',
        key: 'institutionName',
        label: 'Institution Name',
        type: 'text',
        placeholder: 'e.g. Indian Institute of Technology',
        required: true
      },
      {
        id: 'f-sch-3',
        key: 'course',
        label: 'Course',
        type: 'text',
        placeholder: 'e.g. B.Tech Computer Science 2nd Year',
        required: true
      },
      {
        id: 'f-sch-4',
        key: 'annualFamilyIncome',
        label: 'Annual Family Income (INR)',
        type: 'number',
        placeholder: 'e.g. 350000',
        required: true,
        isSensitive: true
      },
      {
        id: 'f-sch-5',
        key: 'scholarshipReason',
        label: 'Reason for Scholarship',
        type: 'textarea',
        placeholder: 'Explain financial background and academic goals...',
        required: true
      },
      {
        id: 'f-sch-6',
        key: 'documentsUpload',
        label: 'Documents Upload',
        type: 'file',
        placeholder: 'Upload PDF of certificates',
        required: false
      }
    ]
  },
  {
    id: 'template-edu-tc-request',
    title: 'School Transfer Certificate Request',
    description: 'Formal application for issuance of school transfer and leaving records.',
    category: 'Education',
    icon: 'FileSpreadsheet',
    estimatedMinutes: 3,
    isPublished: true,
    createdAt: '2026-03-03T10:00:00.000Z',
    updatedAt: '2026-03-18T10:00:00.000Z',
    fields: [
      {
        id: 'f-tc-1',
        key: 'studentName',
        label: 'Student Name',
        type: 'text',
        placeholder: 'As registered in school records',
        required: true
      },
      {
        id: 'f-tc-2',
        key: 'admissionNumber',
        label: 'Admission Number',
        type: 'text',
        placeholder: 'e.g. SCH-2024-889',
        required: true
      },
      {
        id: 'f-tc-3',
        key: 'currentGrade',
        label: 'Class/Grade',
        type: 'select',
        required: true,
        options: [
          { label: 'Class 8th', value: '8' },
          { label: 'Class 9th', value: '9' },
          { label: 'Class 10th (Matriculation)', value: '10' },
          { label: 'Class 11th', value: '11' },
          { label: 'Class 12th (Senior Secondary)', value: '12' }
        ]
      },
      {
        id: 'f-tc-4',
        key: 'reasonForTransfer',
        label: 'Reason for Transfer',
        type: 'select',
        required: true,
        options: [
          { label: 'Parent Job Relocation / City Transfer', value: 'parent-relocation' },
          { label: 'Admission to Higher Institution', value: 'higher-edu' },
          { label: 'Personal Circumstances', value: 'personal' }
        ]
      },
      {
        id: 'f-tc-5',
        key: 'parentConsent',
        label: 'Parent Consent (All Dues Cleared)',
        type: 'checkbox',
        required: true,
        defaultValue: true
      }
    ]
  },
  {
    id: 'template-edu-exam-reg',
    title: 'Exam Registration Form',
    description: 'Semester examination and board test registration with exam center choices.',
    category: 'Education',
    icon: 'ClipboardList',
    estimatedMinutes: 3,
    isPublished: true,
    createdAt: '2026-03-04T10:00:00.000Z',
    updatedAt: '2026-03-18T10:00:00.000Z',
    fields: [
      {
        id: 'f-ex-1',
        key: 'fullName',
        label: 'Full Name',
        type: 'text',
        placeholder: 'e.g. Sneha Rai',
        required: true
      },
      {
        id: 'f-ex-2',
        key: 'rollNumber',
        label: 'Roll Number',
        type: 'text',
        placeholder: 'e.g. 23BTECH1045',
        required: true
      },
      {
        id: 'f-ex-3',
        key: 'examName',
        label: 'Exam Name',
        type: 'select',
        required: true,
        options: [
          { label: 'Spring 2026 End-Semester Examination', value: 'spring-2026' },
          { label: 'Supplementary / Backlog Examination 2026', value: 'supp-2026' },
          { label: 'Annual University Board Examination', value: 'board-2026' }
        ]
      },
      {
        id: 'f-ex-4',
        key: 'examCenterPreference',
        label: 'Exam Center Preference',
        type: 'select',
        required: true,
        options: [
          { label: 'New Delhi (Main City Center)', value: 'delhi' },
          { label: 'Noida (Sector 62 Campus)', value: 'noida' },
          { label: 'Gurugram (Cyber Hub Center)', value: 'gurugram' },
          { label: 'Bengaluru (Electronic City)', value: 'bengaluru' }
        ]
      },
      {
        id: 'f-ex-5',
        key: 'photoUpload',
        label: 'Photo Upload',
        type: 'file',
        placeholder: 'Upload passport photograph',
        required: false
      }
    ]
  },
  {
    id: 'template-edu-hostel-app',
    title: 'Hostel/Accommodation Application',
    description: 'On-campus residence and dorm allocation application with room type and roommate choices.',
    category: 'Education',
    icon: 'Building',
    estimatedMinutes: 4,
    isPublished: true,
    createdAt: '2026-03-05T10:00:00.000Z',
    updatedAt: '2026-03-18T10:00:00.000Z',
    fields: [
      {
        id: 'f-hos-1',
        key: 'fullName',
        label: 'Full Name',
        type: 'text',
        placeholder: 'e.g. Sneha Rai',
        required: true
      },
      {
        id: 'f-hos-2',
        key: 'studentId',
        label: 'Student ID',
        type: 'text',
        placeholder: 'e.g. STU-2026-901',
        required: true
      },
      {
        id: 'f-hos-3',
        key: 'roomType',
        label: 'Room Type Preference',
        type: 'radio',
        required: true,
        options: [
          { label: 'Single Occupancy (AC)', value: 'single-ac' },
          { label: 'Double Sharing (AC)', value: 'double-ac' },
          { label: 'Double Sharing (Non-AC)', value: 'double-nonac' }
        ]
      }
    ]
  },

  // ==========================================
  // 6. REAL ESTATE
  // ==========================================
  {
    id: 'template-realestate-property-registration',
    title: 'Property Registration Form',
    description: 'Official registry recording sale deed, buyer-seller particulars, stamp duty, and dimensions.',
    category: 'Real Estate',
    icon: 'Landmark',
    estimatedMinutes: 5,
    isPublished: true,
    createdAt: '2026-03-01T12:00:00.000Z',
    updatedAt: '2026-03-18T10:00:00.000Z',
    fields: [
      {
        id: 'f-prg-1',
        key: 'buyerFullName',
        label: 'Buyer Full Name',
        type: 'text',
        placeholder: 'e.g. Sneha Rai',
        required: true
      },
      {
        id: 'f-prg-2',
        key: 'sellerFullName',
        label: 'Seller Full Name',
        type: 'text',
        placeholder: 'e.g. Apex Builders Pvt Ltd',
        required: true
      },
      {
        id: 'f-prg-3',
        key: 'propertyAddress',
        label: 'Property Address',
        type: 'textarea',
        placeholder: 'Unit/Plot No, Floor, Tower, Sector, City, Pincode',
        required: true,
        isSensitive: true
      },
      {
        id: 'f-prg-4',
        key: 'totalSaleValueINR',
        label: 'Total Sale Value (INR)',
        type: 'number',
        placeholder: 'e.g. 9500000',
        required: true
      }
    ]
  },
  {
    id: 'template-realestate-home-loan',
    title: 'Home Loan Application',
    description: 'Mortgage financing and home loan assessment with property valuation and income verification.',
    category: 'Real Estate',
    icon: 'BadgeDollarSign',
    estimatedMinutes: 4,
    isPublished: true,
    createdAt: '2026-03-02T12:00:00.000Z',
    updatedAt: '2026-03-18T10:00:00.000Z',
    fields: [
      {
        id: 'f-hl-1',
        key: 'applicantName',
        label: 'Borrower Full Name',
        type: 'text',
        placeholder: 'e.g. Sneha Rai',
        required: true
      },
      {
        id: 'f-hl-2',
        key: 'netMonthlySalary',
        label: 'Net Monthly Salary (INR)',
        type: 'number',
        placeholder: 'e.g. 140000',
        required: true,
        isSensitive: true
      },
      {
        id: 'f-hl-3',
        key: 'requestedLoanAmount',
        label: 'Requested Loan Amount (INR)',
        type: 'number',
        placeholder: 'e.g. 6500000',
        required: true
      }
    ]
  },
  {
    id: 'template-realestate-listing',
    title: 'Rental Property Listing Form',
    description: 'Publish vacant apartment, villa, or commercial space for prospective verified tenants.',
    category: 'Real Estate',
    icon: 'Building2',
    estimatedMinutes: 3,
    isPublished: true,
    createdAt: '2026-03-03T12:00:00.000Z',
    updatedAt: '2026-03-18T10:00:00.000Z',
    fields: [
      {
        id: 'f-rpl-1',
        key: 'ownerFullName',
        label: 'Owner Full Name',
        type: 'text',
        placeholder: 'e.g. Sneha Rai',
        required: true
      },
      {
        id: 'f-rpl-2',
        key: 'listingTitle',
        label: 'Listing Title',
        type: 'text',
        placeholder: 'e.g. Luxurious 3BHK in Cyber City',
        required: true
      },
      {
        id: 'f-rpl-3',
        key: 'expectedMonthlyRent',
        label: 'Monthly Rent (INR)',
        type: 'number',
        placeholder: 'e.g. 45000',
        required: true
      }
    ]
  },
  {
    id: 'template-realestate-site-visit',
    title: 'Property Site Visit Request',
    description: 'Schedule an on-site physical tour or virtual walkthrough for residential and commercial projects.',
    category: 'Real Estate',
    icon: 'Building',
    estimatedMinutes: 2,
    isPublished: true,
    createdAt: '2026-03-04T12:00:00.000Z',
    updatedAt: '2026-03-18T10:00:00.000Z',
    fields: [
      {
        id: 'f-sv-1',
        key: 'visitorName',
        label: 'Visitor Full Name',
        type: 'text',
        placeholder: 'e.g. Sneha Rai',
        required: true
      },
      {
        id: 'f-sv-2',
        key: 'contactNumber',
        label: 'Contact Phone Number',
        type: 'phone',
        placeholder: '+91 98765 43210',
        required: true,
        isSensitive: true
      }
    ]
  },
  {
    id: 'template-realestate-tenant-verification',
    title: 'Tenant Verification Form',
    description: 'Mandatory tenant screening capturing background, employment, and ID proofs.',
    category: 'Real Estate',
    icon: 'UserCheck',
    estimatedMinutes: 4,
    isPublished: true,
    createdAt: '2026-03-05T12:00:00.000Z',
    updatedAt: '2026-03-18T10:00:00.000Z',
    fields: [
      {
        id: 'f-tv-1',
        key: 'tenantFullName',
        label: 'Tenant Full Name',
        type: 'text',
        placeholder: 'e.g. Sneha Rai',
        required: true
      },
      {
        id: 'f-tv-2',
        key: 'aadhaarNumber',
        label: 'Aadhaar / National ID Number',
        type: 'text',
        placeholder: '12-digit UIDAI Number',
        required: true,
        isSensitive: true
      }
    ]
  },

  // ==========================================
  // 7. FINANCE
  // ==========================================
  {
    id: 'template-finance-bank-account',
    title: 'Bank Account Opening Form',
    description: 'Savings and current account opening with KYC verification, debit card, and digital banking.',
    category: 'Finance',
    icon: 'Landmark',
    estimatedMinutes: 5,
    isPublished: true,
    createdAt: '2026-03-01T13:00:00.000Z',
    updatedAt: '2026-03-18T10:00:00.000Z',
    fields: [
      {
        id: 'f-ba-1',
        key: 'applicantFullName',
        label: 'Applicant Full Legal Name',
        type: 'text',
        placeholder: 'As per Aadhaar/PAN records',
        required: true
      },
      {
        id: 'f-ba-2',
        key: 'panNumber',
        label: 'PAN Card Number',
        type: 'text',
        placeholder: 'ABCDE1234F',
        required: true,
        isSensitive: true,
        validation: { min: 10, max: 10 }
      },
      {
        id: 'f-ba-3',
        key: 'initialDepositAmount',
        label: 'Initial Opening Deposit Amount (INR)',
        type: 'number',
        placeholder: 'e.g. 10000',
        required: true
      }
    ]
  },
  {
    id: 'template-finance-personal-loan',
    title: 'Personal Loan Application',
    description: 'Instant collateral-free personal loan evaluation with interest rate and tenure customization.',
    category: 'Finance',
    icon: 'BadgeDollarSign',
    estimatedMinutes: 4,
    isPublished: true,
    createdAt: '2026-03-02T13:00:00.000Z',
    updatedAt: '2026-03-18T10:00:00.000Z',
    fields: [
      {
        id: 'f-pl-1',
        key: 'applicantName',
        label: 'Borrower Full Name',
        type: 'text',
        placeholder: 'e.g. Sneha Rai',
        required: true
      },
      {
        id: 'f-pl-2',
        key: 'monthlyNetSalary',
        label: 'Net Monthly Salary (INR)',
        type: 'number',
        placeholder: 'e.g. 85000',
        required: true,
        isSensitive: true
      },
      {
        id: 'f-pl-3',
        key: 'desiredLoanAmount',
        label: 'Requested Loan Amount (INR)',
        type: 'number',
        placeholder: 'e.g. 500000',
        required: true
      }
    ]
  },
  {
    id: 'template-finance-insurance-claim',
    title: 'Insurance Claim Form',
    description: 'File reimbursement or settlement claims for health, motor, or life insurance incidents.',
    category: 'Finance',
    icon: 'ShieldCheck',
    estimatedMinutes: 5,
    isPublished: true,
    createdAt: '2026-03-03T13:00:00.000Z',
    updatedAt: '2026-03-18T10:00:00.000Z',
    fields: [
      {
        id: 'f-ic-1',
        key: 'policyHolderName',
        label: 'Policyholder Full Name',
        type: 'text',
        placeholder: 'e.g. Sneha Rai',
        required: true
      },
      {
        id: 'f-ic-2',
        key: 'policyNumber',
        label: 'Policy Number',
        type: 'text',
        placeholder: 'e.g. POL-88992314-2026',
        required: true,
        isSensitive: true
      },
      {
        id: 'f-ic-3',
        key: 'totalClaimAmountINR',
        label: 'Claim Amount (INR)',
        type: 'number',
        placeholder: 'e.g. 125000',
        required: true
      }
    ]
  },
  {
    id: 'template-finance-credit-card',
    title: 'Credit Card Application',
    description: 'Apply for premium rewards, cashback, and travel credit cards with instant eligibility.',
    category: 'Finance',
    icon: 'CreditCard',
    estimatedMinutes: 4,
    isPublished: true,
    createdAt: '2026-03-04T13:00:00.000Z',
    updatedAt: '2026-03-18T10:00:00.000Z',
    fields: [
      {
        id: 'f-cc-1',
        key: 'applicantName',
        label: 'Applicant Full Name',
        type: 'text',
        placeholder: 'e.g. Sneha Rai',
        required: true
      },
      {
        id: 'f-cc-2',
        key: 'annualGrossIncome',
        label: 'Annual Gross Income (INR)',
        type: 'number',
        placeholder: 'e.g. 1800000',
        required: true,
        isSensitive: true
      }
    ]
  },
  {
    id: 'template-finance-investment-enquiry',
    title: 'Investment/Mutual Fund Enquiry',
    description: 'Personalized portfolio allocation, SIP planning, equity mutual funds, and wealth management consult.',
    category: 'Finance',
    icon: 'BadgeDollarSign',
    estimatedMinutes: 3,
    isPublished: true,
    createdAt: '2026-03-05T13:00:00.000Z',
    updatedAt: '2026-03-18T10:00:00.000Z',
    fields: [
      {
        id: 'f-ie-1',
        key: 'investorName',
        label: 'Investor Full Name',
        type: 'text',
        placeholder: 'e.g. Sneha Rai',
        required: true
      },
      {
        id: 'f-ie-2',
        key: 'monthlySipBudget',
        label: 'Planned Monthly SIP Amount (INR)',
        type: 'number',
        placeholder: 'e.g. 25000',
        required: true
      }
    ]
  },

  // ==========================================
  // 8. GOVERNMENT
  // ==========================================
  {
    id: 'template-government-aadhar-update',
    title: 'Aadhar Card Update Form',
    description: 'Official UIDAI update request for mobile number, address change, biometric, or name correction.',
    category: 'Government',
    icon: 'ShieldCheck',
    estimatedMinutes: 4,
    isPublished: true,
    createdAt: '2026-03-01T14:00:00.000Z',
    updatedAt: '2026-03-18T10:00:00.000Z',
    fields: [
      {
        id: 'f-au-1',
        key: 'residentFullName',
        label: 'Resident Full Name',
        type: 'text',
        placeholder: 'Name as on Aadhaar card',
        required: true
      },
      {
        id: 'f-au-2',
        key: 'aadhaarNumber',
        label: '12-Digit Aadhaar Number',
        type: 'text',
        placeholder: '1234 5678 9012',
        required: true,
        isSensitive: true,
        validation: { min: 12, max: 16 }
      }
    ]
  },
  {
    id: 'template-government-ration-card',
    title: 'Ration Card Application',
    description: 'Subsidized ration card issuance for family units under public distribution systems.',
    category: 'Government',
    icon: 'Receipt',
    estimatedMinutes: 4,
    isPublished: true,
    createdAt: '2026-03-02T14:00:00.000Z',
    updatedAt: '2026-03-18T10:00:00.000Z',
    fields: [
      {
        id: 'f-rc-1',
        key: 'headOfFamilyName',
        label: 'Head of Family Name',
        type: 'text',
        placeholder: 'e.g. Smt. Sunita Rai',
        required: true
      },
      {
        id: 'f-rc-2',
        key: 'annualFamilyIncome',
        label: 'Annual Family Income (INR)',
        type: 'number',
        placeholder: 'e.g. 180000',
        required: true,
        isSensitive: true
      }
    ]
  },
  {
    id: 'template-government-birth-certificate',
    title: 'Birth Certificate Application',
    description: 'Civil registration request for official municipal birth certificate issuance.',
    category: 'Government',
    icon: 'Award',
    estimatedMinutes: 3,
    isPublished: true,
    createdAt: '2026-03-03T14:00:00.000Z',
    updatedAt: '2026-03-18T10:00:00.000Z',
    fields: [
      {
        id: 'f-bc-1',
        key: 'childFullName',
        label: 'Child Full Legal Name',
        type: 'text',
        placeholder: 'e.g. Aarav Rai',
        required: true
      },
      {
        id: 'f-bc-2',
        key: 'dateOfBirth',
        label: 'Date of Birth',
        type: 'date',
        required: true
      }
    ]
  },
  {
    id: 'template-government-voter-id',
    title: 'Voter ID Registration',
    description: 'Form 6 application for new voter card registration and inclusion in electoral roll.',
    category: 'Government',
    icon: 'UserCheck',
    estimatedMinutes: 4,
    isPublished: true,
    createdAt: '2026-03-04T14:00:00.000Z',
    updatedAt: '2026-03-18T10:00:00.000Z',
    fields: [
      {
        id: 'f-vid-1',
        key: 'applicantName',
        label: 'Applicant Full Name',
        type: 'text',
        placeholder: 'e.g. Sneha Rai',
        required: true
      },
      {
        id: 'f-vid-2',
        key: 'dob',
        label: 'Date of Birth',
        type: 'date',
        required: true,
        isSensitive: true
      }
    ]
  },
  {
    id: 'template-government-income-certificate',
    title: 'Income Certificate Request',
    description: 'Revenue department certification of annual personal and household income.',
    category: 'Government',
    icon: 'Landmark',
    estimatedMinutes: 3,
    isPublished: true,
    createdAt: '2026-03-05T14:00:00.000Z',
    updatedAt: '2026-03-18T10:00:00.000Z',
    fields: [
      {
        id: 'f-inc-1',
        key: 'applicantName',
        label: 'Applicant Full Name',
        type: 'text',
        placeholder: 'e.g. Sneha Rai',
        required: true
      },
      {
        id: 'f-inc-2',
        key: 'annualGrossIncome',
        label: 'Total Annual Gross Income (INR)',
        type: 'number',
        placeholder: 'e.g. 240000',
        required: true,
        isSensitive: true
      }
    ]
  },

  // ==========================================
  // 9. EVENTS
  // ==========================================
  {
    id: 'template-events-wedding-rsvp',
    title: 'Wedding Invitation RSVP Form',
    description: 'Guest attendance confirmation, party headcounts, food preferences, and hospitality requests.',
    category: 'Events',
    icon: 'Sparkles',
    estimatedMinutes: 2,
    isPublished: true,
    createdAt: '2026-03-01T15:00:00.000Z',
    updatedAt: '2026-03-18T10:00:00.000Z',
    fields: [
      {
        id: 'f-w-1',
        key: 'guestFullName',
        label: 'Guest Full Name',
        type: 'text',
        placeholder: 'e.g. Sneha Rai',
        required: true
      },
      {
        id: 'f-w-2',
        key: 'totalGuestsAttending',
        label: 'Total Guests Attending',
        type: 'number',
        placeholder: 'e.g. 2',
        required: true
      }
    ]
  },
  {
    id: 'template-events-conference-reg',
    title: 'Conference Registration Form',
    description: 'Global conference delegate registration, badge credentials, and track workshops.',
    category: 'Events',
    icon: 'Sparkles',
    estimatedMinutes: 3,
    isPublished: true,
    createdAt: '2026-03-02T15:00:00.000Z',
    updatedAt: '2026-03-18T10:00:00.000Z',
    fields: [
      {
        id: 'f-cr-1',
        key: 'attendeeName',
        label: 'Attendee Full Name',
        type: 'text',
        placeholder: 'e.g. Sneha Rai',
        required: true
      },
      {
        id: 'f-cr-2',
        key: 'organization',
        label: 'Company / Institution Name',
        type: 'text',
        placeholder: 'e.g. Google Cloud',
        required: true
      }
    ]
  },
  {
    id: 'template-events-workshop-signup',
    title: 'Workshop/Webinar Signup',
    description: 'Interactive masterclass enrollment, skill training webinar registration, and attendee QA.',
    category: 'Events',
    icon: 'Calendar',
    estimatedMinutes: 2,
    isPublished: true,
    createdAt: '2026-03-03T15:00:00.000Z',
    updatedAt: '2026-03-18T10:00:00.000Z',
    fields: [
      {
        id: 'f-ws-1',
        key: 'participantName',
        label: 'Participant Full Name',
        type: 'text',
        placeholder: 'e.g. Sneha Rai',
        required: true
      },
      {
        id: 'f-ws-2',
        key: 'email',
        label: 'Email Address',
        type: 'email',
        placeholder: 'sneha@learning.dev',
        required: true,
        isSensitive: true
      }
    ]
  },
  {
    id: 'template-events-vendor-booking',
    title: 'Event Vendor Booking Form',
    description: 'Vendor contracting and service agreement for catering, sound & lights, photography, and decor.',
    category: 'Events',
    icon: 'Building',
    estimatedMinutes: 4,
    isPublished: true,
    createdAt: '2026-03-04T15:00:00.000Z',
    updatedAt: '2026-03-18T10:00:00.000Z',
    fields: [
      {
        id: 'f-vb-1',
        key: 'vendorCompanyName',
        label: 'Vendor Business Name',
        type: 'text',
        placeholder: 'e.g. Luminary Stage',
        required: true
      },
      {
        id: 'f-vb-2',
        key: 'totalQuotedFeeINR',
        label: 'Total Quoted Fee (INR)',
        type: 'number',
        placeholder: 'e.g. 180000',
        required: true
      }
    ]
  },
  {
    id: 'template-events-volunteer-reg',
    title: 'Volunteer Registration Form',
    description: 'Community and festival volunteer enrollment, shift availability, and role preferences.',
    category: 'Events',
    icon: 'Users',
    estimatedMinutes: 3,
    isPublished: true,
    createdAt: '2026-03-05T15:00:00.000Z',
    updatedAt: '2026-03-18T10:00:00.000Z',
    fields: [
      {
        id: 'f-vr-1',
        key: 'volunteerFullName',
        label: 'Volunteer Full Name',
        type: 'text',
        placeholder: 'e.g. Sneha Rai',
        required: true
      },
      {
        id: 'f-vr-2',
        key: 'phone',
        label: 'Emergency Mobile Number',
        type: 'phone',
        placeholder: '+91 98765 43210',
        required: true,
        isSensitive: true
      }
    ]
  },

  // ==========================================
  // 10. HEALTHCARE
  // ==========================================
  {
    id: 'template-healthcare-intake',
    title: 'Patient Health & Intake Record',
    description: 'Secure clinical intake capturing vitals, medical history, allergies, and emergency contacts.',
    category: 'Healthcare',
    icon: 'HeartPulse',
    estimatedMinutes: 5,
    isPublished: true,
    createdAt: '2026-03-05T08:00:00.000Z',
    updatedAt: '2026-03-18T10:00:00.000Z',
    fields: [
      {
        id: 'f-h-1',
        key: 'patientName',
        label: 'Patient Full Name',
        type: 'text',
        placeholder: 'First and Last name',
        required: true
      },
      {
        id: 'f-h-2',
        key: 'dob',
        label: 'Date of Birth',
        type: 'date',
        required: true,
        isSensitive: true
      },
      {
        id: 'f-h-3',
        key: 'bloodGroup',
        label: 'Blood Group',
        type: 'select',
        required: true,
        options: [
          { label: 'A+', value: 'A+' },
          { label: 'A-', value: 'A-' },
          { label: 'B+', value: 'B+' },
          { label: 'B-', value: 'B-' },
          { label: 'O+', value: 'O+' },
          { label: 'O-', value: 'O-' },
          { label: 'AB+', value: 'AB+' },
          { label: 'AB-', value: 'AB-' }
        ]
      }
    ]
  },
  // ==========================================
  // 11. GOVERNMENT & DBT WELFARE (DETAILED MASTER TEMPLATE - 88 FIELDS)
  // ==========================================
  {
    id: 'template-gov-scheme-detailed',
    title: 'Government Scheme Application Form (Detailed)',
    description: 'Comprehensive national welfare & Direct Benefit Transfer (DBT) scheme application covering identity, socio-economic household profile, education, banking, and document verification.',
    category: 'Government',
    icon: 'Landmark',
    estimatedMinutes: 20,
    isPublished: true,
    createdAt: '2026-03-01T10:00:00.000Z',
    updatedAt: '2026-03-18T10:00:00.000Z',
    fields: [
      // ----------------------------------------------------
      // Section 1: Personal Details (14 fields)
      // ----------------------------------------------------
      {
        id: 'f-gov-1',
        key: 'fullName',
        label: 'Full Legal Name',
        type: 'text',
        placeholder: 'e.g. Sneha Kumari Rai',
        required: true,
        section: 'Personal Details',
        helpText: 'Enter your full legal name as recorded on official ID.'
      },
      {
        id: 'f-gov-altname',
        key: 'aliasOrOtherName',
        label: 'Maiden / Alias Name (if any)',
        type: 'text',
        placeholder: 'e.g. Sneha Singh (prior to marriage)',
        required: false,
        section: 'Personal Details'
      },
      {
        id: 'f-gov-2',
        key: 'dob',
        label: 'Date of Birth',
        type: 'date',
        required: true,
        section: 'Personal Details'
      },
      {
        id: 'f-gov-3',
        key: 'gender',
        label: 'Gender',
        type: 'select',
        required: true,
        section: 'Personal Details',
        options: [
          { label: 'Female', value: 'female' },
          { label: 'Male', value: 'male' },
          { label: 'Non-Binary / Third Gender', value: 'transgender' },
          { label: 'Prefer not to disclose', value: 'other' }
        ]
      },
      {
        id: 'f-gov-4',
        key: 'maritalStatus',
        label: 'Marital Status',
        type: 'select',
        required: true,
        section: 'Personal Details',
        options: [
          { label: 'Unmarried / Single', value: 'single' },
          { label: 'Married', value: 'married' },
          { label: 'Divorced', value: 'divorced' },
          { label: 'Widowed', value: 'widowed' },
          { label: 'Separated', value: 'separated' }
        ]
      },
      {
        id: 'f-gov-5',
        key: 'aadhaarNumber',
        label: 'Aadhaar Card Number (UIDAI)',
        type: 'text',
        placeholder: '12-digit number e.g. 5432 1098 7654',
        required: true,
        isSensitive: true,
        section: 'Personal Details',
        validation: { min: 12, max: 14 }
      },
      {
        id: 'f-gov-6',
        key: 'panNumber',
        label: 'Permanent Account Number (PAN)',
        type: 'text',
        placeholder: '10-character PAN e.g. ABCDE1234F',
        required: true,
        isSensitive: true,
        section: 'Personal Details',
        validation: { min: 10, max: 10 }
      },
      {
        id: 'f-gov-idproof',
        key: 'voterIdNumber',
        label: 'Voter ID / EPIC Card Number',
        type: 'text',
        placeholder: 'e.g. XYZ1234567',
        required: false,
        isSensitive: true,
        section: 'Personal Details'
      },
      {
        id: 'f-gov-7',
        key: 'socialCategory',
        label: 'Social Category / Caste Group',
        type: 'select',
        required: true,
        section: 'Personal Details',
        options: [
          { label: 'General (Unreserved)', value: 'general' },
          { label: 'Other Backward Classes (OBC - Non-Creamy Layer)', value: 'obc_ncl' },
          { label: 'Other Backward Classes (OBC - Creamy Layer)', value: 'obc_cl' },
          { label: 'Scheduled Caste (SC)', value: 'sc' },
          { label: 'Scheduled Tribe (ST)', value: 'st' },
          { label: 'Economically Weaker Section (EWS)', value: 'ews' }
        ]
      },
      {
        id: 'f-gov-8',
        key: 'religion',
        label: 'Religion / Community',
        type: 'select',
        required: true,
        section: 'Personal Details',
        options: [
          { label: 'Hinduism', value: 'hinduism' },
          { label: 'Islam', value: 'islam' },
          { label: 'Christianity', value: 'christianity' },
          { label: 'Sikhism', value: 'sikhism' },
          { label: 'Buddhism', value: 'buddhism' },
          { label: 'Jainism', value: 'jainism' },
          { label: 'Zoroastrianism (Parsi)', value: 'zoroastrianism' },
          { label: 'Other Faith', value: 'other' }
        ]
      },
      {
        id: 'f-gov-9',
        key: 'nationality',
        label: 'Nationality / Citizenship',
        type: 'text',
        placeholder: 'Indian',
        required: true,
        defaultValue: 'Indian',
        section: 'Personal Details'
      },
      {
        id: 'f-gov-10',
        key: 'bloodGroup',
        label: 'Blood Group',
        type: 'select',
        required: true,
        section: 'Personal Details',
        options: [
          { label: 'A+', value: 'A+' },
          { label: 'A-', value: 'A-' },
          { label: 'B+', value: 'B+' },
          { label: 'B-', value: 'B-' },
          { label: 'O+', value: 'O+' },
          { label: 'O-', value: 'O-' },
          { label: 'AB+', value: 'AB+' },
          { label: 'AB-', value: 'AB-' }
        ]
      },
      {
        id: 'f-gov-11',
        key: 'differentlyAbled',
        label: 'Person with Benchmark Disability (PwD)?',
        type: 'radio',
        required: true,
        section: 'Personal Details',
        options: [
          { label: 'No', value: 'no' },
          { label: 'Yes (40% or above certified disability)', value: 'yes' }
        ]
      },
      {
        id: 'f-gov-12',
        key: 'photoUpload',
        label: 'Applicant Passport Photograph',
        type: 'file',
        required: true,
        section: 'Personal Details',
        helpText: 'Upload recent color passport-sized photograph (JPG/PNG max 2MB).'
      },

      // ----------------------------------------------------
      // Section 2: Contact Details (12 fields)
      // ----------------------------------------------------
      {
        id: 'f-gov-13',
        key: 'primaryMobile',
        label: 'Primary Mobile Number (Aadhaar-Linked)',
        type: 'phone',
        placeholder: '+91 98765 43210',
        required: true,
        isSensitive: true,
        section: 'Contact Details',
        helpText: 'OTP verification notifications will be sent to this number.'
      },
      {
        id: 'f-gov-14',
        key: 'alternatePhone',
        label: 'Alternate / WhatsApp Contact Number',
        type: 'phone',
        placeholder: '+91 98111 22334',
        required: false,
        section: 'Contact Details'
      },
      {
        id: 'f-gov-15',
        key: 'emailAddress',
        label: 'Applicant Email Address',
        type: 'email',
        placeholder: 'applicant@domain.com',
        required: true,
        isSensitive: true,
        section: 'Contact Details'
      },
      {
        id: 'f-gov-16',
        key: 'currentAddress',
        label: 'Current Residential Address (House/Street/Area)',
        type: 'textarea',
        placeholder: 'Flat/House No., Building Name, Street, Locality',
        required: true,
        section: 'Contact Details'
      },
      {
        id: 'f-gov-17',
        key: 'currentCity',
        label: 'City / Town / Tehsil',
        type: 'text',
        placeholder: 'e.g. Noida / Lucknow',
        required: true,
        section: 'Contact Details'
      },
      {
        id: 'f-gov-18',
        key: 'currentState',
        label: 'State / Union Territory',
        type: 'select',
        required: true,
        section: 'Contact Details',
        options: [
          { label: 'Uttar Pradesh', value: 'Uttar Pradesh' },
          { label: 'Maharashtra', value: 'Maharashtra' },
          { label: 'Delhi NCR', value: 'Delhi' },
          { label: 'Karnataka', value: 'Karnataka' },
          { label: 'Tamil Nadu', value: 'Tamil Nadu' },
          { label: 'Gujarat', value: 'Gujarat' },
          { label: 'Rajasthan', value: 'Rajasthan' },
          { label: 'West Bengal', value: 'West Bengal' },
          { label: 'Madhya Pradesh', value: 'Madhya Pradesh' },
          { label: 'Bihar', value: 'Bihar' },
          { label: 'Punjab', value: 'Punjab' },
          { label: 'Telangana', value: 'Telangana' },
          { label: 'Kerala', value: 'Kerala' },
          { label: 'Haryana', value: 'Haryana' },
          { label: 'Odisha', value: 'Odisha' },
          { label: 'Other State/UT', value: 'Other' }
        ]
      },
      {
        id: 'f-gov-19',
        key: 'currentDistrict',
        label: 'District Name',
        type: 'text',
        placeholder: 'e.g. Gautam Buddha Nagar',
        required: true,
        section: 'Contact Details'
      },
      {
        id: 'f-gov-20',
        key: 'currentPincode',
        label: 'Postal PIN Code',
        type: 'text',
        placeholder: '6-digit PIN e.g. 201301',
        required: true,
        section: 'Contact Details',
        validation: { min: 6, max: 6 }
      },
      {
        id: 'f-gov-21',
        key: 'isPermanentAddressSame',
        label: 'Is Permanent Address Same as Current Address?',
        type: 'radio',
        required: true,
        section: 'Contact Details',
        options: [
          { label: 'Yes, same as current address', value: 'yes' },
          { label: 'No, different permanent domicile address', value: 'no' }
        ]
      },
      {
        id: 'f-gov-22',
        key: 'permanentAddress',
        label: 'Permanent Address (if different from current)',
        type: 'textarea',
        placeholder: 'Ancestral / Domicile village or town address with state & PIN',
        required: false,
        section: 'Contact Details'
      },
      {
        id: 'f-gov-emergency-person',
        key: 'emergencyContactName',
        label: 'Emergency Contact Person Name',
        type: 'text',
        placeholder: 'e.g. Ramesh Kumar Rai',
        required: true,
        section: 'Contact Details'
      },
      {
        id: 'f-gov-emergency-rel',
        key: 'emergencyContactRelation',
        label: 'Relationship with Emergency Contact',
        type: 'select',
        required: true,
        section: 'Contact Details',
        options: [
          { label: 'Father', value: 'father' },
          { label: 'Mother', value: 'mother' },
          { label: 'Spouse', value: 'spouse' },
          { label: 'Sibling / Brother / Sister', value: 'sibling' },
          { label: 'Son / Daughter', value: 'child' },
          { label: 'Legal Guardian', value: 'guardian' },
          { label: 'Neighbor / Relative', value: 'other' }
        ]
      },

      // ----------------------------------------------------
      // Section 3: Family Details (12 fields)
      // ----------------------------------------------------
      {
        id: 'f-gov-23',
        key: 'fatherName',
        label: "Father's Full Name",
        type: 'text',
        placeholder: 'e.g. Ramesh Kumar Rai',
        required: true,
        section: 'Family Details'
      },
      {
        id: 'f-gov-24',
        key: 'fatherOccupation',
        label: "Father's Primary Occupation",
        type: 'select',
        required: true,
        section: 'Family Details',
        options: [
          { label: 'Agriculture / Cultivator / Farmer', value: 'farmer' },
          { label: 'Government / PSU Employee', value: 'gov_service' },
          { label: 'Private Sector Employee', value: 'private_sector' },
          { label: 'Self Employed / Shopkeeper / Business', value: 'self_employed' },
          { label: 'Daily Wage / Construction Laborer', value: 'daily_wage' },
          { label: 'Retired Pensioner', value: 'retired' },
          { label: 'Deceased', value: 'deceased' }
        ]
      },
      {
        id: 'f-gov-25',
        key: 'motherName',
        label: "Mother's Full Name",
        type: 'text',
        placeholder: 'e.g. Sunita Devi',
        required: true,
        section: 'Family Details'
      },
      {
        id: 'f-gov-26',
        key: 'motherOccupation',
        label: "Mother's Primary Occupation",
        type: 'select',
        required: true,
        section: 'Family Details',
        options: [
          { label: 'Homemaker', value: 'homemaker' },
          { label: 'Agriculture / Farming', value: 'farmer' },
          { label: 'Government / PSU Employee', value: 'gov_service' },
          { label: 'Private Sector Employee', value: 'private_sector' },
          { label: 'Self Employed / Artisan / Weaver', value: 'self_employed' },
          { label: 'Daily Wage Laborer', value: 'daily_wage' },
          { label: 'Retired', value: 'retired' },
          { label: 'Deceased', value: 'deceased' }
        ]
      },
      {
        id: 'f-gov-27',
        key: 'spouseName',
        label: 'Spouse Full Legal Name (if married)',
        type: 'text',
        placeholder: 'Spouse name as on ID card',
        required: false,
        section: 'Family Details'
      },
      {
        id: 'f-gov-spouse-occ',
        key: 'spouseOccupation',
        label: 'Spouse Primary Occupation (if applicable)',
        type: 'select',
        required: false,
        section: 'Family Details',
        options: [
          { label: 'Homemaker', value: 'homemaker' },
          { label: 'Salaried Employee', value: 'salaried' },
          { label: 'Self Employed / Business', value: 'business' },
          { label: 'Farming / Agriculture', value: 'farmer' },
          { label: 'Unemployed', value: 'unemployed' },
          { label: 'Not Applicable', value: 'na' }
        ]
      },
      {
        id: 'f-gov-head-family',
        key: 'headOfHouseholdName',
        label: 'Name of Head of Family (as per Ration Card)',
        type: 'text',
        placeholder: 'e.g. Ramesh Kumar Rai',
        required: true,
        section: 'Family Details'
      },
      {
        id: 'f-gov-family-members',
        key: 'totalFamilyMembersCount',
        label: 'Total Number of Family Members in Household',
        type: 'number',
        placeholder: 'e.g. 5',
        required: true,
        section: 'Family Details',
        validation: { min: 1, max: 25 }
      },
      {
        id: 'f-gov-28',
        key: 'numberOfDependents',
        label: 'Number of Financial Dependents',
        type: 'number',
        placeholder: 'e.g. 3',
        required: true,
        section: 'Family Details',
        validation: { min: 0, max: 20 }
      },
      {
        id: 'f-gov-29',
        key: 'familyAnnualIncome',
        label: 'Total Annual Family Income (INR ₹ from all sources)',
        type: 'number',
        placeholder: 'e.g. 240000',
        required: true,
        isSensitive: true,
        section: 'Family Details',
        validation: { min: 0, max: 10000000 },
        helpText: 'Cumulative gross annual income of all earning family members.'
      },
      {
        id: 'f-gov-30',
        key: 'rationCardCategory',
        label: 'Ration Card Category / NFSA Tier',
        type: 'select',
        required: true,
        section: 'Family Details',
        options: [
          { label: 'Antyodaya Anna Yojana (AAY - Yellow/Poorest)', value: 'aay' },
          { label: 'Priority Household / Below Poverty Line (BPL - Pink/Red)', value: 'bpl' },
          { label: 'Above Poverty Line (APL - White/Blue)', value: 'apl' },
          { label: 'No Ration Card Held', value: 'none' }
        ]
      },
      {
        id: 'f-gov-31',
        key: 'guardianContact',
        label: 'Guardian / Head of Family Mobile Number',
        type: 'phone',
        placeholder: '+91 94150 12345',
        required: true,
        section: 'Family Details'
      },

      // ----------------------------------------------------
      // Section 4: Education Details (12 fields)
      // ----------------------------------------------------
      {
        id: 'f-gov-33',
        key: 'highestQualification',
        label: 'Highest Educational Qualification Attained',
        type: 'select',
        required: true,
        section: 'Education Details',
        options: [
          { label: 'Primary School (Up to 5th)', value: 'primary' },
          { label: 'Middle School (8th Standard)', value: 'middle' },
          { label: 'Matriculation (10th Standard / SSC)', value: '10th' },
          { label: 'Higher Secondary (12th Standard / HSC / Intermediate)', value: '12th' },
          { label: 'Diploma / Polytechnic / ITI Certification', value: 'diploma' },
          { label: 'Bachelor’s Degree (B.Tech / B.Sc / B.Com / B.A / BCA)', value: 'graduate' },
          { label: 'Master’s Degree (M.Tech / M.Sc / M.Com / M.A / MBA / MCA)', value: 'post_graduate' },
          { label: 'Doctorate / Ph.D. / M.Phil', value: 'doctorate' },
          { label: 'Non-Formal Education / Literacy Mission', value: 'non_formal' }
        ]
      },
      {
        id: 'f-gov-34',
        key: 'institutionName',
        label: 'Last Attended School / College / University Name',
        type: 'text',
        placeholder: 'e.g. Government Degree College, Lucknow',
        required: true,
        section: 'Education Details'
      },
      {
        id: 'f-gov-state-edu',
        key: 'institutionState',
        label: 'State Where Institution is Located',
        type: 'text',
        placeholder: 'e.g. Uttar Pradesh',
        required: true,
        section: 'Education Details'
      },
      {
        id: 'f-gov-35',
        key: 'boardOrUniversity',
        label: 'Examining Board / Affiliated University',
        type: 'text',
        placeholder: 'e.g. CBSE / State Board / University of Lucknow',
        required: true,
        section: 'Education Details'
      },
      {
        id: 'f-gov-stream',
        key: 'educationStream',
        label: 'Academic Stream / Branch',
        type: 'select',
        required: true,
        section: 'Education Details',
        options: [
          { label: 'Science (PCM / PCB / Pure Sciences)', value: 'science' },
          { label: 'Engineering, Technology & Computer Science', value: 'engineering' },
          { label: 'Commerce, Accounting & Finance', value: 'commerce' },
          { label: 'Arts, Humanities & Social Sciences', value: 'arts' },
          { label: 'Medical, Nursing & Allied Health', value: 'medical' },
          { label: 'Agriculture & Veterinary Sciences', value: 'agriculture' },
          { label: 'Vocational & Technical Trades', value: 'vocational' },
          { label: 'General / School Level', value: 'general' }
        ]
      },
      {
        id: 'f-gov-36',
        key: 'yearOfPassing',
        label: 'Year of Passing / Final Exam Year',
        type: 'number',
        placeholder: 'e.g. 2024',
        required: true,
        section: 'Education Details',
        validation: { min: 1960, max: 2026 }
      },
      {
        id: 'f-gov-37',
        key: 'percentageOrCgpa',
        label: 'Final Marks Percentage / CGPA Score',
        type: 'text',
        placeholder: 'e.g. 84.5% or 8.8 CGPA',
        required: true,
        section: 'Education Details'
      },
      {
        id: 'f-gov-38',
        key: 'majorSpecialization',
        label: 'Major Subject Specialization',
        type: 'text',
        placeholder: 'e.g. Computer Science & Artificial Intelligence',
        required: true,
        section: 'Education Details'
      },
      {
        id: 'f-gov-39',
        key: 'rollRegistrationNumber',
        label: 'Final Roll / Registration / Enrolment Number',
        type: 'text',
        placeholder: 'e.g. 2024-UG-CS-10928',
        required: true,
        section: 'Education Details'
      },
      {
        id: 'f-gov-40',
        key: 'computerProficiency',
        label: 'Digital / Computer Literacy Skill Level',
        type: 'select',
        required: true,
        section: 'Education Details',
        options: [
          { label: 'Basic (Smartphone & Internet Browsing)', value: 'basic' },
          { label: 'Intermediate (MS Office, Web Portals, Online Forms)', value: 'intermediate' },
          { label: 'Advanced (Software Dev, Data Entry, Digital Accounting)', value: 'advanced' },
          { label: 'Certified (CCC / NIELIT / O-Level / Diploma in CS)', value: 'certified' },
          { label: 'No Prior Experience', value: 'none' }
        ]
      },
      {
        id: 'f-gov-41',
        key: 'additionalCertifications',
        label: 'Vocational Skill Certifications & Training (PMKVY / NSDC)',
        type: 'textarea',
        placeholder: 'List any government or private vocational certifications earned',
        required: false,
        section: 'Education Details'
      },
      {
        id: 'f-gov-42',
        key: 'mediumOfEducation',
        label: 'Primary Medium of Instruction',
        type: 'radio',
        required: true,
        section: 'Education Details',
        options: [
          { label: 'Hindi', value: 'hindi' },
          { label: 'English', value: 'english' },
          { label: 'Regional / State Language', value: 'regional' },
          { label: 'Bilingual (Hindi + English)', value: 'bilingual' }
        ]
      },

      // ----------------------------------------------------
      // Section 5: Bank Details (12 fields)
      // ----------------------------------------------------
      {
        id: 'f-gov-43',
        key: 'bankName',
        label: 'Bank Name (Scheduled Commercial / RRB)',
        type: 'select',
        required: true,
        section: 'Bank Details',
        options: [
          { label: 'State Bank of India (SBI)', value: 'SBI' },
          { label: 'Punjab National Bank (PNB)', value: 'PNB' },
          { label: 'Bank of Baroda (BOB)', value: 'BOB' },
          { label: 'Canara Bank', value: 'CANARA' },
          { label: 'Union Bank of India', value: 'UNION' },
          { label: 'HDFC Bank', value: 'HDFC' },
          { label: 'ICICI Bank', value: 'ICICI' },
          { label: 'Axis Bank', value: 'AXIS' },
          { label: 'India Post Payments Bank (IPPB)', value: 'IPPB' },
          { label: 'Regional Rural Bank / Gramin Bank', value: 'GRAMIN' },
          { label: 'Other Scheduled Bank', value: 'OTHER' }
        ]
      },
      {
        id: 'f-gov-44',
        key: 'bankAccountNumber',
        label: 'Bank Account Number',
        type: 'text',
        placeholder: 'e.g. 102938475612',
        required: true,
        isSensitive: true,
        section: 'Bank Details',
        validation: { min: 9, max: 18 }
      },
      {
        id: 'f-gov-45',
        key: 'confirmAccountNumber',
        label: 'Re-Enter Bank Account Number (Confirmation)',
        type: 'text',
        placeholder: 'Re-enter to confirm account number',
        required: true,
        isSensitive: true,
        section: 'Bank Details',
        validation: { min: 9, max: 18 }
      },
      {
        id: 'f-gov-46',
        key: 'ifscCode',
        label: 'Bank IFSC Code',
        type: 'text',
        placeholder: '11-character IFSC e.g. SBIN0001234',
        required: true,
        isSensitive: true,
        section: 'Bank Details',
        validation: { min: 11, max: 11 }
      },
      {
        id: 'f-gov-micr',
        key: 'micrCode',
        label: 'Bank MICR Code (9 Digits)',
        type: 'text',
        placeholder: 'e.g. 110002001',
        required: false,
        isSensitive: true,
        section: 'Bank Details',
        validation: { min: 9, max: 9 }
      },
      {
        id: 'f-gov-47',
        key: 'branchName',
        label: 'Branch Name & Location',
        type: 'text',
        placeholder: 'e.g. Hazratganj Main Branch, Lucknow',
        required: true,
        section: 'Bank Details'
      },
      {
        id: 'f-gov-48',
        key: 'accountType',
        label: 'Bank Account Type',
        type: 'radio',
        required: true,
        section: 'Bank Details',
        options: [
          { label: 'Savings Bank Account (Individual)', value: 'savings' },
          { label: 'Pradhan Mantri Jan Dhan Account (PMJDY / Zero Balance)', value: 'jandhan' },
          { label: 'Current Account', value: 'current' }
        ]
      },
      {
        id: 'f-gov-49',
        key: 'dbtAadhaarSeedingStatus',
        label: 'Is Bank Account Seeded with Aadhaar NPCI Mapper for DBT?',
        type: 'radio',
        required: true,
        section: 'Bank Details',
        options: [
          { label: 'Yes - DBT/NPCI Aadhaar Enabled (Ready for Direct Subsidy)', value: 'linked' },
          { label: 'No - Not yet seeded with NPCI', value: 'not_linked' },
          { label: 'Unsure (Will verify with branch)', value: 'unsure' }
        ]
      },
      {
        id: 'f-gov-50',
        key: 'nomineeName',
        label: 'Bank Nominee Full Legal Name',
        type: 'text',
        placeholder: 'e.g. Sunita Devi',
        required: true,
        section: 'Bank Details'
      },
      {
        id: 'f-gov-51',
        key: 'nomineeRelationship',
        label: 'Applicant Relationship with Nominee',
        type: 'select',
        required: true,
        section: 'Bank Details',
        options: [
          { label: 'Mother', value: 'mother' },
          { label: 'Father', value: 'father' },
          { label: 'Spouse (Husband / Wife)', value: 'spouse' },
          { label: 'Son', value: 'son' },
          { label: 'Daughter', value: 'daughter' },
          { label: 'Brother', value: 'brother' },
          { label: 'Sister', value: 'sister' },
          { label: 'Legal Guardian', value: 'guardian' }
        ]
      },
      {
        id: 'f-gov-52',
        key: 'nomineeAge',
        label: 'Nominee Age (in Years)',
        type: 'number',
        placeholder: 'e.g. 48',
        required: true,
        section: 'Bank Details',
        validation: { min: 1, max: 110 }
      },
      {
        id: 'f-gov-nominee-address',
        key: 'nomineeAddress',
        label: 'Nominee Residential Address',
        type: 'textarea',
        placeholder: 'Complete residential address of nominee',
        required: false,
        section: 'Bank Details'
      },

      // ----------------------------------------------------
      // Section 6: Employment Details (12 fields)
      // ----------------------------------------------------
      {
        id: 'f-gov-53',
        key: 'currentOccupation',
        label: 'Current Primary Occupation / Source of Livelihood',
        type: 'select',
        required: true,
        section: 'Employment Details',
        options: [
          { label: 'Salaried Private Sector Employee', value: 'salaried_private' },
          { label: 'Government / Semi-Government / PSU Employee', value: 'gov_employee' },
          { label: 'Self Employed Professional / Consultant', value: 'self_employed' },
          { label: 'Small Business / Retail Merchant / Kirana Shop', value: 'business_owner' },
          { label: 'Farmer / Cultivator (Land Owning)', value: 'farmer' },
          { label: 'Agricultural Laborer / Farm Worker', value: 'agri_laborer' },
          { label: 'Construction / Daily Wage / Factory Worker', value: 'construction_worker' },
          { label: 'Artisan / Handicraft / Handloom Weaver', value: 'artisan' },
          { label: 'Gig Economy Worker (Delivery / Cab Driver / Freelancer)', value: 'gig_worker' },
          { label: 'Student / Vocational Trainee', value: 'student' },
          { label: 'Unemployed / Job Seeker', value: 'unemployed' }
        ]
      },
      {
        id: 'f-gov-54',
        key: 'employerOrEnterpriseName',
        label: 'Employer / Business Enterprise / Farm Name',
        type: 'text',
        placeholder: 'e.g. ABC Enterprises / Self-Employed',
        required: false,
        section: 'Employment Details'
      },
      {
        id: 'f-gov-55',
        key: 'workAddress',
        label: 'Workplace / Office / Shop Address',
        type: 'textarea',
        placeholder: 'Full workplace address with PIN code',
        required: false,
        section: 'Employment Details'
      },
      {
        id: 'f-gov-skill-category',
        key: 'sectorSkillCategory',
        label: 'Industry / Skills Qualification Framework (NSQF) Sector',
        type: 'select',
        required: true,
        section: 'Employment Details',
        options: [
          { label: 'Information Technology & Electronics', value: 'it' },
          { label: 'Agriculture & Food Processing', value: 'agriculture' },
          { label: 'Manufacturing & Automotive', value: 'manufacturing' },
          { label: 'Healthcare & Life Sciences', value: 'healthcare' },
          { label: 'Construction & Real Estate', value: 'construction' },
          { label: 'Tourism, Hospitality & Travel', value: 'tourism' },
          { label: 'Retail, Logistics & Supply Chain', value: 'retail' },
          { label: 'Handicrafts, Carpets & Textiles', value: 'textiles' },
          { label: 'Education & Training', value: 'education' },
          { label: 'Other Industry Sector', value: 'other' }
        ]
      },
      {
        id: 'f-gov-56',
        key: 'yearsOfExperience',
        label: 'Total Working Experience (Years)',
        type: 'number',
        placeholder: 'e.g. 4',
        required: true,
        section: 'Employment Details',
        validation: { min: 0, max: 50 }
      },
      {
        id: 'f-gov-57',
        key: 'individualMonthlyIncome',
        label: 'Individual Monthly Earnings (INR ₹)',
        type: 'number',
        placeholder: 'e.g. 20000',
        required: true,
        isSensitive: true,
        section: 'Employment Details',
        validation: { min: 0, max: 1000000 }
      },
      {
        id: 'f-gov-self-turnover',
        key: 'annualBusinessTurnover',
        label: 'Annual Enterprise Turnover (if Business/Shop Owner - INR ₹)',
        type: 'number',
        placeholder: 'e.g. 500000',
        required: false,
        isSensitive: true,
        section: 'Employment Details'
      },
      {
        id: 'f-gov-58',
        key: 'employmentType',
        label: 'Employment Engagement Structure',
        type: 'radio',
        required: true,
        section: 'Employment Details',
        options: [
          { label: 'Regular / Permanent Employee', value: 'permanent' },
          { label: 'Contractual / Fixed Term Outsource', value: 'contractual' },
          { label: 'Daily Wage / Piece Rate', value: 'daily_wage' },
          { label: 'Gig / Platform Partner', value: 'gig_worker' },
          { label: 'Informal / Seasonal Cultivation', value: 'informal' }
        ]
      },
      {
        id: 'f-gov-59',
        key: 'uanNumber',
        label: 'EPFO Universal Account Number (UAN) - if PF registered',
        type: 'text',
        placeholder: '12-digit UAN e.g. 101234567890',
        required: false,
        isSensitive: true,
        section: 'Employment Details',
        validation: { min: 12, max: 12 }
      },
      {
        id: 'f-gov-60',
        key: 'eShramNumber',
        label: 'e-Shram Universal ID Card Number (for unorganized workers)',
        type: 'text',
        placeholder: '12-digit eShram number e.g. 987654321012',
        required: false,
        isSensitive: true,
        section: 'Employment Details',
        validation: { min: 12, max: 12 }
      },
      {
        id: 'f-gov-61',
        key: 'landHoldingCategory',
        label: 'Agricultural Land Holding Size (if Farmer / Cultivator)',
        type: 'select',
        required: false,
        section: 'Employment Details',
        options: [
          { label: 'Marginal Farmer (Less than 1.0 Hectare / 2.5 Acres)', value: 'marginal' },
          { label: 'Small Farmer (1.0 to 2.0 Hectares / 2.5 to 5 Acres)', value: 'small' },
          { label: 'Semi-Medium Farmer (2.0 to 4.0 Hectares)', value: 'semi_medium' },
          { label: 'Medium / Large Farmer (Above 4.0 Hectares)', value: 'large' },
          { label: 'Landless Agricultural Laborer', value: 'landless' },
          { label: 'Not Applicable (Non-agricultural worker)', value: 'na' }
        ]
      },
      {
        id: 'f-gov-62',
        key: 'previousGovernmentBenefitReceived',
        label: 'Have you received any Central/State Welfare Scheme Subsidy in last 3 years?',
        type: 'radio',
        required: true,
        section: 'Employment Details',
        options: [
          { label: 'No, this is my first welfare scheme application', value: 'no' },
          { label: 'Yes, have availed government scheme benefit previously', value: 'yes' }
        ]
      },

      // ----------------------------------------------------
      // Section 7: Document Uploads (8 fields)
      // ----------------------------------------------------
      {
        id: 'f-gov-63',
        key: 'docAadhaarFrontBack',
        label: 'Aadhaar Card Copy (Front & Back PDF/JPG)',
        type: 'file',
        required: true,
        isSensitive: true,
        section: 'Document Uploads',
        helpText: 'Clear scanned color copy of official UIDAI Aadhaar card.'
      },
      {
        id: 'f-gov-64',
        key: 'docPanCard',
        label: 'PAN Card Copy',
        type: 'file',
        required: true,
        isSensitive: true,
        section: 'Document Uploads',
        helpText: 'Clear copy of Permanent Account Number (PAN) card.'
      },
      {
        id: 'f-gov-65',
        key: 'docAddressProof',
        label: 'Proof of Residence / Domicile Certificate',
        type: 'file',
        required: true,
        section: 'Document Uploads',
        helpText: 'Electricity bill, Voter ID, Ration card, or State Domicile Certificate.'
      },
      {
        id: 'f-gov-66',
        key: 'docIncomeCertificate',
        label: 'Official Income Certificate (Issued by Tehsildar / SDM)',
        type: 'file',
        required: true,
        isSensitive: true,
        section: 'Document Uploads',
        helpText: 'Valid for current financial year from competent revenue officer.'
      },
      {
        id: 'f-gov-67',
        key: 'docCasteCertificate',
        label: 'Caste / Category Certificate (for SC / ST / OBC / EWS applicants)',
        type: 'file',
        required: false,
        section: 'Document Uploads',
        helpText: 'Official digitally signed caste certificate from revenue authority.'
      },
      {
        id: 'f-gov-68',
        key: 'docBankPassbook',
        label: 'Bank Passbook Front Page or Cancelled Cheque Leaf',
        type: 'file',
        required: true,
        isSensitive: true,
        section: 'Document Uploads',
        helpText: 'Must clearly show Account Number, IFSC code, and Beneficiary Name.'
      },
      {
        id: 'f-gov-69',
        key: 'docEducationMarksheet',
        label: 'Highest Qualification Degree / Final Marksheet',
        type: 'file',
        required: true,
        section: 'Document Uploads',
        helpText: 'Final year marksheet or convocation degree certificate.'
      },
      {
        id: 'f-gov-70',
        key: 'docApplicantSignature',
        label: 'Applicant Signature / Thumb Impression',
        type: 'file',
        required: true,
        section: 'Document Uploads',
        helpText: 'Sign with black/blue pen on clean white paper and upload photo.'
      },

      // ----------------------------------------------------
      // Section 8: Declaration & Consent (6 fields)
      // ----------------------------------------------------
      {
        id: 'f-gov-71',
        key: 'declarationTruthAffirmation',
        label: 'Truthfulness Declaration: I hereby solemnly affirm that all statements, facts, and documents submitted herein are true, authentic, and complete to the best of my knowledge.',
        type: 'checkbox',
        required: true,
        defaultValue: false,
        section: 'Declaration'
      },
      {
        id: 'f-gov-72',
        key: 'uidaiAadhaarConsent',
        label: 'Aadhaar e-KYC Consent: I give my voluntary consent to the Government Department to authenticate my identity via UIDAI biometric/demographic authentication services for DBT disbursement.',
        type: 'checkbox',
        required: true,
        defaultValue: false,
        section: 'Declaration'
      },
      {
        id: 'f-gov-73',
        key: 'dbtDirectBenefitMandate',
        label: 'DBT Direct Credit Authorization: I authorize the direct transfer of admissible financial grant / scheme benefits directly into my Aadhaar-seeded bank account via PFMS / NPCI bridge.',
        type: 'checkbox',
        required: true,
        defaultValue: false,
        section: 'Declaration'
      },
      {
        id: 'f-gov-74',
        key: 'applicantFullNameDeclaration',
        label: 'Applicant Full Legal Name for Digital Affirmation',
        type: 'text',
        placeholder: 'Type your full name as digital signature',
        required: true,
        section: 'Declaration'
      },
      {
        id: 'f-gov-75',
        key: 'declarationDate',
        label: 'Date of Application Submission',
        type: 'date',
        required: true,
        section: 'Declaration'
      },
      {
        id: 'f-gov-76',
        key: 'applicationReferenceNumber',
        label: 'Official Application Reference Number',
        type: 'text',
        placeholder: 'e.g. GOV-2026-DBT-99182',
        defaultValue: 'GOV-2026-DBT-99182',
        required: true,
        section: 'Declaration'
      }
    ]
  },
  // ==========================================
  // 12. FINANCE: HOME LOAN APPLICATION (DETAILED - 68 FIELDS)
  // ==========================================
  {
    id: 'template-finance-home-loan-detailed',
    title: 'Home Loan Application (Detailed)',
    description: 'Comprehensive housing finance application capturing applicant profile, co-borrower credentials, income verification, property assessment, existing liabilities, and collateral records.',
    category: 'Finance',
    icon: 'Landmark',
    estimatedMinutes: 18,
    isPublished: true,
    createdAt: '2026-03-01T10:00:00.000Z',
    updatedAt: '2026-03-18T10:00:00.000Z',
    fields: [
      // ----------------------------------------------------
      // Section 1: Applicant Personal Details (10 fields)
      // ----------------------------------------------------
      {
        id: 'f-hl-1',
        key: 'primaryApplicantName',
        label: 'Primary Applicant Full Legal Name',
        type: 'text',
        placeholder: 'e.g. Sneha Kumari Rai',
        required: true,
        section: 'Applicant Personal Details',
        helpText: 'Enter name exactly as printed on PAN Card.'
      },
      {
        id: 'f-hl-2',
        key: 'dob',
        label: 'Date of Birth',
        type: 'date',
        required: true,
        section: 'Applicant Personal Details'
      },
      {
        id: 'f-hl-3',
        key: 'gender',
        label: 'Gender',
        type: 'select',
        required: true,
        section: 'Applicant Personal Details',
        options: [
          { label: 'Female (Eligible for Women Concession 0.05% ROI)', value: 'female' },
          { label: 'Male', value: 'male' },
          { label: 'Other', value: 'other' }
        ]
      },
      {
        id: 'f-hl-4',
        key: 'maritalStatus',
        label: 'Marital Status',
        type: 'select',
        required: true,
        section: 'Applicant Personal Details',
        options: [
          { label: 'Married', value: 'married' },
          { label: 'Single / Unmarried', value: 'single' },
          { label: 'Divorced / Widowed', value: 'other' }
        ]
      },
      {
        id: 'f-hl-5',
        key: 'panNumber',
        label: 'Applicant PAN Card Number',
        type: 'text',
        placeholder: '10-character PAN e.g. ABCDE1234F',
        required: true,
        isSensitive: true,
        section: 'Applicant Personal Details',
        validation: { min: 10, max: 10 }
      },
      {
        id: 'f-hl-6',
        key: 'aadhaarNumber',
        label: 'Applicant Aadhaar UID Number',
        type: 'text',
        placeholder: '12-digit UID e.g. 5432 1098 7654',
        required: true,
        isSensitive: true,
        section: 'Applicant Personal Details',
        validation: { min: 12, max: 14 }
      },
      {
        id: 'f-hl-7',
        key: 'primaryMobile',
        label: 'Mobile Contact Number',
        type: 'phone',
        placeholder: '+91 98765 43210',
        required: true,
        isSensitive: true,
        section: 'Applicant Personal Details'
      },
      {
        id: 'f-hl-8',
        key: 'emailAddress',
        label: 'Personal Email Address',
        type: 'email',
        placeholder: 'applicant@domain.com',
        required: true,
        isSensitive: true,
        section: 'Applicant Personal Details'
      },
      {
        id: 'f-hl-9',
        key: 'currentResidentialAddress',
        label: 'Current Residence Address',
        type: 'textarea',
        placeholder: 'Building, Flat, Street, Locality',
        required: true,
        section: 'Applicant Personal Details'
      },
      {
        id: 'f-hl-10',
        key: 'currentCityStatePincode',
        label: 'City, State & PIN Code',
        type: 'text',
        placeholder: 'e.g. Noida, Uttar Pradesh, 201301',
        required: true,
        section: 'Applicant Personal Details'
      },

      // ----------------------------------------------------
      // Section 2: Co-Applicant Details (8 fields)
      // ----------------------------------------------------
      {
        id: 'f-hl-11',
        key: 'hasCoApplicant',
        label: 'Do you want to add a Co-Applicant / Co-Borrower?',
        type: 'radio',
        required: true,
        section: 'Co-Applicant Details',
        options: [
          { label: 'Yes (Increases loan eligibility)', value: 'yes' },
          { label: 'No (Sole applicant)', value: 'no' }
        ]
      },
      {
        id: 'f-hl-12',
        key: 'coApplicantName',
        label: 'Co-Applicant Full Legal Name',
        type: 'text',
        placeholder: 'e.g. Ramesh Kumar Rai',
        required: false,
        section: 'Co-Applicant Details'
      },
      {
        id: 'f-hl-13',
        key: 'coApplicantRelationship',
        label: 'Relationship with Primary Applicant',
        type: 'select',
        required: false,
        section: 'Co-Applicant Details',
        options: [
          { label: 'Spouse (Wife / Husband)', value: 'spouse' },
          { label: 'Father', value: 'father' },
          { label: 'Mother', value: 'mother' },
          { label: 'Son', value: 'son' },
          { label: 'Brother', value: 'brother' },
          { label: 'Not Applicable', value: 'na' }
        ]
      },
      {
        id: 'f-hl-14',
        key: 'coApplicantPan',
        label: 'Co-Applicant PAN Card Number',
        type: 'text',
        placeholder: '10-character PAN e.g. XYZPQ5678L',
        required: false,
        isSensitive: true,
        section: 'Co-Applicant Details'
      },
      {
        id: 'f-hl-15',
        key: 'coApplicantAadhaar',
        label: 'Co-Applicant Aadhaar Number',
        type: 'text',
        placeholder: '12-digit Aadhaar number',
        required: false,
        isSensitive: true,
        section: 'Co-Applicant Details'
      },
      {
        id: 'f-hl-16',
        key: 'coApplicantPhone',
        label: 'Co-Applicant Mobile Number',
        type: 'phone',
        placeholder: '+91 98111 22334',
        required: false,
        section: 'Co-Applicant Details'
      },
      {
        id: 'f-hl-17',
        key: 'coApplicantMonthlyIncome',
        label: 'Co-Applicant Net Monthly Income (INR ₹)',
        type: 'number',
        placeholder: 'e.g. 75000',
        required: false,
        isSensitive: true,
        section: 'Co-Applicant Details'
      },
      {
        id: 'f-hl-18',
        key: 'coApplicantEmploymentType',
        label: 'Co-Applicant Employment Type',
        type: 'select',
        required: false,
        section: 'Co-Applicant Details',
        options: [
          { label: 'Salaried Private / Corporate', value: 'salaried_pvt' },
          { label: 'Government / PSU Employee', value: 'gov' },
          { label: 'Self Employed Professional (Doctor/CA/Lawyer)', value: 'professional' },
          { label: 'Self Employed Business Owner', value: 'business' },
          { label: 'Homemaker / Non-earning Co-owner', value: 'homemaker' }
        ]
      },

      // ----------------------------------------------------
      // Section 3: Employment & Income Details (10 fields)
      // ----------------------------------------------------
      {
        id: 'f-hl-19',
        key: 'employmentType',
        label: 'Primary Employment Category',
        type: 'select',
        required: true,
        section: 'Employment & Income Details',
        options: [
          { label: 'Salaried - MNC / Listed Corporate', value: 'salaried_mnc' },
          { label: 'Salaried - Public Sector / Central/State Govt', value: 'salaried_gov' },
          { label: 'Salaried - Private Limited Company', value: 'salaried_pvt' },
          { label: 'Self Employed Professional (Doctor, CA, Architect, Lawyer)', value: 'sep' },
          { label: 'Self Employed Non-Professional / Business Proprietor', value: 'senp' }
        ]
      },
      {
        id: 'f-hl-20',
        key: 'employerName',
        label: 'Employer Organization / Business Enterprise Name',
        type: 'text',
        placeholder: 'e.g. Google India Pvt Ltd',
        required: true,
        section: 'Employment & Income Details'
      },
      {
        id: 'f-hl-21',
        key: 'currentDesignation',
        label: 'Current Designation / Job Role',
        type: 'text',
        placeholder: 'e.g. Senior Lead Engineer',
        required: true,
        section: 'Employment & Income Details'
      },
      {
        id: 'f-hl-22',
        key: 'yearsWithCurrentEmployer',
        label: 'Tenure with Current Employer (in Years)',
        type: 'number',
        placeholder: 'e.g. 3.5',
        required: true,
        section: 'Employment & Income Details'
      },
      {
        id: 'f-hl-23',
        key: 'totalExperienceYears',
        label: 'Total Total Career Experience (Years)',
        type: 'number',
        placeholder: 'e.g. 8',
        required: true,
        section: 'Employment & Income Details',
        validation: { min: 1, max: 45 }
      },
      {
        id: 'f-hl-24',
        key: 'grossMonthlyIncome',
        label: 'Gross Monthly Salary / Business Inflow (INR ₹)',
        type: 'number',
        placeholder: 'e.g. 185000',
        required: true,
        isSensitive: true,
        section: 'Employment & Income Details'
      },
      {
        id: 'f-hl-25',
        key: 'netMonthlyTakeHome',
        label: 'Net In-Hand Monthly Take-Home Salary (INR ₹)',
        type: 'number',
        placeholder: 'e.g. 142000',
        required: true,
        isSensitive: true,
        section: 'Employment & Income Details'
      },
      {
        id: 'f-hl-26',
        key: 'otherMonthlyIncome',
        label: 'Other Additional Monthly Inflows (Rental, Dividends, etc. - INR ₹)',
        type: 'number',
        placeholder: 'e.g. 15000',
        required: false,
        isSensitive: true,
        section: 'Employment & Income Details'
      },
      {
        id: 'f-hl-27',
        key: 'officialWorkEmail',
        label: 'Official Corporate / Work Email Address',
        type: 'email',
        placeholder: 'applicant@corporate.com',
        required: true,
        section: 'Employment & Income Details'
      },
      {
        id: 'f-hl-28',
        key: 'officeAddress',
        label: 'Workplace / Office Address with City & PIN',
        type: 'textarea',
        placeholder: 'Tower B, Tech Park, Sector 62, Noida - 201309',
        required: true,
        section: 'Employment & Income Details'
      },

      // ----------------------------------------------------
      // Section 4: Property Details (10 fields)
      // ----------------------------------------------------
      {
        id: 'f-hl-29',
        key: 'propertyType',
        label: 'Type of Housing Property to be Financed',
        type: 'select',
        required: true,
        section: 'Property Details',
        options: [
          { label: 'Ready-to-Move Residential Flat / Apartment', value: 'ready_flat' },
          { label: 'Under-Construction Builder Flat (RERA Approved)', value: 'under_construction' },
          { label: 'Resale Flat / Independent House', value: 'resale' },
          { label: 'Residential Plot Purchase + Self-Construction', value: 'plot_construction' },
          { label: 'Home Renovation / Extension on Existing House', value: 'renovation' }
        ]
      },
      {
        id: 'f-hl-30',
        key: 'propertyAddress',
        label: 'Complete Property Location Address',
        type: 'textarea',
        placeholder: 'Flat No. 1204, Tower 3, Prestige City, Sector 150',
        required: true,
        section: 'Property Details'
      },
      {
        id: 'f-hl-31',
        key: 'propertyCity',
        label: 'Property City & District',
        type: 'text',
        placeholder: 'e.g. Noida / Bengaluru',
        required: true,
        section: 'Property Details'
      },
      {
        id: 'f-hl-32',
        key: 'propertyPincode',
        label: 'Property Postal PIN Code',
        type: 'text',
        placeholder: 'e.g. 201310',
        required: true,
        section: 'Property Details',
        validation: { min: 6, max: 6 }
      },
      {
        id: 'f-hl-33',
        key: 'propertyTotalValue',
        label: 'Total Agreed Agreement / Market Value (INR ₹)',
        type: 'number',
        placeholder: 'e.g. 9500000',
        required: true,
        section: 'Property Details'
      },
      {
        id: 'f-hl-34',
        key: 'carpetAreaSqFt',
        label: 'Carpet Area of Property (in Sq. Ft.)',
        type: 'number',
        placeholder: 'e.g. 1450',
        required: true,
        section: 'Property Details'
      },
      {
        id: 'f-hl-35',
        key: 'builderOrSellerName',
        label: 'Developer / Builder / Seller Full Legal Name',
        type: 'text',
        placeholder: 'e.g. Prestige Estates Projects Ltd / Mr. Rajesh Sharma',
        required: true,
        section: 'Property Details'
      },
      {
        id: 'f-hl-36',
        key: 'reraRegistrationNumber',
        label: 'State RERA Project Registration ID',
        type: 'text',
        placeholder: 'e.g. UPRERA-PRJ-2024-9988',
        required: true,
        section: 'Property Details'
      },
      {
        id: 'f-hl-37',
        key: 'constructionStage',
        label: 'Construction Progress / Age of Property',
        type: 'select',
        required: true,
        section: 'Property Details',
        options: [
          { label: 'Brand New (Ready to Move in with Occupancy Certificate)', value: 'ready_oc' },
          { label: 'Under Construction (75%+ completed)', value: 'uc_75' },
          { label: 'Under Construction (Mid-stage 25%-75%)', value: 'uc_mid' },
          { label: 'Resale Property (1 to 5 Years Old)', value: 'resale_1_5' },
          { label: 'Resale Property (5 to 15 Years Old)', value: 'resale_5_15' }
        ]
      },
      {
        id: 'f-hl-38',
        key: 'ownContributionPaid',
        label: 'Own Contribution / Down Payment Already Paid (INR ₹)',
        type: 'number',
        placeholder: 'e.g. 2000000',
        required: true,
        section: 'Property Details'
      },

      // ----------------------------------------------------
      // Section 5: Existing Loan & Liability Details (8 fields)
      // ----------------------------------------------------
      {
        id: 'f-hl-39',
        key: 'hasActiveLoans',
        label: 'Do you have any currently active ongoing loans (Personal/Auto/Education)?',
        type: 'radio',
        required: true,
        section: 'Existing Loan & Liability Details',
        options: [
          { label: 'Yes, have active running loans', value: 'yes' },
          { label: 'No, zero active loan liabilities (Debt-free)', value: 'no' }
        ]
      },
      {
        id: 'f-hl-40',
        key: 'totalExistingMonthlyEmi',
        label: 'Total Existing Monthly EMI Payments (INR ₹)',
        type: 'number',
        placeholder: 'e.g. 18500',
        required: true,
        isSensitive: true,
        section: 'Existing Loan & Liability Details',
        defaultValue: 0
      },
      {
        id: 'f-hl-41',
        key: 'totalExistingOutstandingPrincipal',
        label: 'Cumulative Outstanding Loan Principal Amount (INR ₹)',
        type: 'number',
        placeholder: 'e.g. 450000',
        required: false,
        isSensitive: true,
        section: 'Existing Loan & Liability Details'
      },
      {
        id: 'f-hl-42',
        key: 'activeCreditCardsCount',
        label: 'Total Number of Active Credit Cards Held',
        type: 'number',
        placeholder: 'e.g. 2',
        required: true,
        section: 'Existing Loan & Liability Details',
        validation: { min: 0, max: 15 }
      },
      {
        id: 'f-hl-43',
        key: 'approxCibilScore',
        label: 'Estimated / Known CIBIL TransUnion Credit Score Range',
        type: 'select',
        required: true,
        isSensitive: true,
        section: 'Existing Loan & Liability Details',
        options: [
          { label: 'Excellent (750 to 900) - Best Interest Rates', value: 'excellent' },
          { label: 'Good (700 to 749)', value: 'good' },
          { label: 'Fair (650 to 699)', value: 'fair' },
          { label: 'New to Credit (No Prior Credit History / -1 / 0)', value: 'new_to_credit' }
        ]
      },
      {
        id: 'f-hl-44',
        key: 'anyPastDefaultOrSettlement',
        label: 'Have you ever had any loan default, write-off, or settlement in the past 7 years?',
        type: 'radio',
        required: true,
        section: 'Existing Loan & Liability Details',
        options: [
          { label: 'No, clean repayment track record', value: 'no' },
          { label: 'Yes, had past settlement/delay (Details required)', value: 'yes' }
        ]
      },
      {
        id: 'f-hl-45',
        key: 'creditCardTotalLimit',
        label: 'Total Combined Credit Card Limit (INR ₹)',
        type: 'number',
        placeholder: 'e.g. 500000',
        required: false,
        section: 'Existing Loan & Liability Details'
      },
      {
        id: 'f-hl-46',
        key: 'existingBankingRelationship',
        label: 'Existing Banking Relationship with this Lender',
        type: 'select',
        required: true,
        section: 'Existing Loan & Liability Details',
        options: [
          { label: 'Existing Salary / Preferred Banking Customer', value: 'salary_account' },
          { label: 'Existing Fixed Deposit / Investment Customer', value: 'fd_investor' },
          { label: 'New Customer (No prior account with this bank)', value: 'new_customer' }
        ]
      },

      // ----------------------------------------------------
      // Section 6: Bank & Collateral Details (8 fields)
      // ----------------------------------------------------
      {
        id: 'f-hl-47',
        key: 'loanAmountRequested',
        label: 'Home Loan Amount Requested (INR ₹)',
        type: 'number',
        placeholder: 'e.g. 7500000',
        required: true,
        section: 'Bank & Collateral Details',
        validation: { min: 500000, max: 100000000 }
      },
      {
        id: 'f-hl-48',
        key: 'requestedTenureYears',
        label: 'Requested Loan Repayment Tenure (in Years)',
        type: 'select',
        required: true,
        section: 'Bank & Collateral Details',
        options: [
          { label: '30 Years (Lowest Monthly EMI)', value: '30' },
          { label: '25 Years', value: '25' },
          { label: '20 Years (Most Popular)', value: '20' },
          { label: '15 Years', value: '15' },
          { label: '10 Years (Faster Principal Payoff)', value: '10' }
        ]
      },
      {
        id: 'f-hl-49',
        key: 'interestRateType',
        label: 'Interest Rate Preference',
        type: 'radio',
        required: true,
        section: 'Bank & Collateral Details',
        options: [
          { label: 'Floating Rate linked to RBI Repo Rate (EBLR / RLLR)', value: 'floating' },
          { label: 'Fixed Interest Rate (Fixed for first 3-5 years)', value: 'fixed' }
        ]
      },
      {
        id: 'f-hl-50',
        key: 'disbursementAccountBank',
        label: 'Disbursement Bank Name',
        type: 'select',
        required: true,
        section: 'Bank & Collateral Details',
        options: [
          { label: 'State Bank of India (SBI)', value: 'SBI' },
          { label: 'HDFC Bank', value: 'HDFC' },
          { label: 'ICICI Bank', value: 'ICICI' },
          { label: 'Axis Bank', value: 'AXIS' },
          { label: 'Kotak Mahindra Bank', value: 'KOTAK' },
          { label: 'Punjab National Bank (PNB)', value: 'PNB' },
          { label: 'Bank of Baroda', value: 'BOB' }
        ]
      },
      {
        id: 'f-hl-51',
        key: 'disbursementAccountNumber',
        label: 'Salary / Primary Bank Account Number',
        type: 'text',
        placeholder: 'e.g. 50100234567890',
        required: true,
        isSensitive: true,
        section: 'Bank & Collateral Details'
      },
      {
        id: 'f-hl-52',
        key: 'disbursementIfsc',
        label: 'Bank Branch IFSC Code',
        type: 'text',
        placeholder: 'e.g. HDFC0001234',
        required: true,
        isSensitive: true,
        section: 'Bank Details',
        validation: { min: 11, max: 11 }
      },
      {
        id: 'f-hl-53',
        key: 'autoDebitMandateType',
        label: 'Preferred EMI Repayment Mode',
        type: 'radio',
        required: true,
        section: 'Bank & Collateral Details',
        options: [
          { label: 'NACH / e-Mandate Auto-Debit from Salary Account', value: 'nach' },
          { label: 'Direct Standing Instruction (SI) with same Bank', value: 'si' }
        ]
      },
      {
        id: 'f-hl-54',
        key: 'collateralPropertyTitleStatus',
        label: 'Property Title Clearance Status',
        type: 'select',
        required: true,
        section: 'Bank & Collateral Details',
        options: [
          { label: 'Freehold with Clear Title (Search report available)', value: 'freehold' },
          { label: 'Leasehold from State Development Authority (99 Years)', value: 'leasehold' },
          { label: 'Under Bank Approved Project (APF Approved)', value: 'apf' }
        ]
      },

      // ----------------------------------------------------
      // Section 7: Document Uploads (8 fields)
      // ----------------------------------------------------
      {
        id: 'f-hl-55',
        key: 'docPanAndAadhaar',
        label: 'Applicant PAN & Aadhaar Card Combined PDF',
        type: 'file',
        required: true,
        isSensitive: true,
        section: 'Document Uploads',
        helpText: 'Clear scanned color copies of primary applicant KYC.'
      },
      {
        id: 'f-hl-56',
        key: 'docSalarySlips',
        label: 'Last 3 Months Salary Slips with Company Stamp',
        type: 'file',
        required: true,
        isSensitive: true,
        section: 'Document Uploads',
        helpText: 'Monthly payslips showing gross earnings and tax deductions.'
      },
      {
        id: 'f-hl-57',
        key: 'docBankStatements',
        label: 'Latest 6 Months Official Bank Account Statement (PDF with password)',
        type: 'file',
        required: true,
        isSensitive: true,
        section: 'Document Uploads',
        helpText: 'Showing regular salary credits and current average balance.'
      },
      {
        id: 'f-hl-58',
        key: 'docForm16OrItr',
        label: 'Last 2 Financial Years Form 16 / ITR-V with Computation of Income',
        type: 'file',
        required: true,
        isSensitive: true,
        section: 'Document Uploads'
      },
      {
        id: 'f-hl-59',
        key: 'docAgreementToSale',
        label: 'Builder Buyer Agreement / Allotment Letter / Agreement to Sale',
        type: 'file',
        required: true,
        section: 'Document Uploads',
        helpText: 'Signed agreement specifying flat number, carpet area, and payment schedule.'
      },
      {
        id: 'f-hl-60',
        key: 'docDownPaymentReceipt',
        label: 'Down Payment Receipts / Proof of Own Contribution Paid',
        type: 'file',
        required: true,
        section: 'Document Uploads'
      },
      {
        id: 'f-hl-61',
        key: 'docCoApplicantKyc',
        label: 'Co-Applicant KYC Proofs & Income Records (if applicable)',
        type: 'file',
        required: false,
        isSensitive: true,
        section: 'Document Uploads'
      },
      {
        id: 'f-hl-62',
        key: 'docPassportPhotograph',
        label: 'Applicant Passport Size Photograph',
        type: 'file',
        required: true,
        section: 'Document Uploads'
      },

      // ----------------------------------------------------
      // Section 8: Declaration & Consent (6 fields)
      // ----------------------------------------------------
      {
        id: 'f-hl-63',
        key: 'cibilCreditCheckConsent',
        label: 'Credit Information Bureau Authorization: I authorize the Bank to pull and verify my credit history reports from TransUnion CIBIL, Equifax, Experian, and CRIF High Mark.',
        type: 'checkbox',
        required: true,
        defaultValue: false,
        section: 'Declaration & Consent'
      },
      {
        id: 'f-hl-64',
        key: 'kycVerificationConsent',
        label: 'UIDAI & Central KYC Registry Consent: I hereby give voluntary consent to authenticate my identity through UIDAI biometric / OTP services and C-KYC database.',
        type: 'checkbox',
        required: true,
        defaultValue: false,
        section: 'Declaration & Consent'
      },
      {
        id: 'f-hl-65',
        key: 'declarationAccuracyAffirmation',
        label: 'Truthfulness Declaration: I confirm that all financial declarations, employment credentials, and property representations made herein are accurate and true.',
        type: 'checkbox',
        required: true,
        defaultValue: false,
        section: 'Declaration & Consent'
      },
      {
        id: 'f-hl-66',
        key: 'digitalSignatoryName',
        label: 'Applicant Full Legal Name (Digital Signature)',
        type: 'text',
        placeholder: 'Type full name as digital signature affirmation',
        required: true,
        section: 'Declaration & Consent'
      },
      {
        id: 'f-hl-67',
        key: 'applicationDate',
        label: 'Date of Application',
        type: 'date',
        required: true,
        section: 'Declaration & Consent'
      },
      {
        id: 'f-hl-68',
        key: 'loanApplicationTrackingId',
        label: 'Housing Loan Application Tracking ID',
        type: 'text',
        placeholder: 'e.g. HL-2026-SBI-88192',
        defaultValue: 'HL-2026-SBI-88192',
        required: true,
        section: 'Declaration & Consent'
      }
    ]
  },

  // ==========================================
  // 13. LEGAL: PROPERTY SALE DEED FORM (DETAILED - 56 FIELDS)
  // ==========================================
  {
    id: 'template-legal-sale-deed-detailed',
    title: 'Property Sale Deed Form (Detailed)',
    description: 'Comprehensive legal conveyance deed for registration of immovable property ownership transfer with detailed buyer, seller, schedule of property, consideration, stamp duty, and witness records.',
    category: 'Legal',
    icon: 'Scale',
    estimatedMinutes: 16,
    isPublished: true,
    createdAt: '2026-03-01T10:00:00.000Z',
    updatedAt: '2026-03-18T10:00:00.000Z',
    fields: [
      // ----------------------------------------------------
      // Section 1: Buyer Details (8 fields)
      // ----------------------------------------------------
      {
        id: 'f-sd-1',
        key: 'buyerFullName',
        label: 'Buyer (Purchaser) Full Legal Name',
        type: 'text',
        placeholder: 'e.g. Sneha Kumari Rai',
        required: true,
        section: 'Buyer Details',
        helpText: 'Name as on official government identity.'
      },
      {
        id: 'f-sd-2',
        key: 'buyerParentOrSpouseName',
        label: "Buyer's Father's / Husband's Name",
        type: 'text',
        placeholder: 'e.g. D/o Ramesh Kumar Rai',
        required: true,
        section: 'Buyer Details'
      },
      {
        id: 'f-sd-3',
        key: 'buyerAge',
        label: 'Buyer Age (in completed years)',
        type: 'number',
        placeholder: 'e.g. 28',
        required: true,
        section: 'Buyer Details',
        validation: { min: 18, max: 110 }
      },
      {
        id: 'f-sd-4',
        key: 'buyerPanNumber',
        label: 'Buyer PAN Card Number',
        type: 'text',
        placeholder: '10-character PAN e.g. ABCDE1234F',
        required: true,
        isSensitive: true,
        section: 'Buyer Details',
        validation: { min: 10, max: 10 }
      },
      {
        id: 'f-sd-5',
        key: 'buyerAadhaarNumber',
        label: 'Buyer Aadhaar Number',
        type: 'text',
        placeholder: '12-digit number e.g. 5432 1098 7654',
        required: true,
        isSensitive: true,
        section: 'Buyer Details',
        validation: { min: 12, max: 14 }
      },
      {
        id: 'f-sd-6',
        key: 'buyerOccupation',
        label: 'Buyer Profession / Occupation',
        type: 'text',
        placeholder: 'e.g. Software Professional / Business',
        required: true,
        section: 'Buyer Details'
      },
      {
        id: 'f-sd-7',
        key: 'buyerPermanentAddress',
        label: 'Buyer Residential Address',
        type: 'textarea',
        placeholder: 'Flat/House No., Street, Locality, City, PIN Code',
        required: true,
        section: 'Buyer Details'
      },
      {
        id: 'f-sd-8',
        key: 'buyerPhone',
        label: 'Buyer Contact Phone Number',
        type: 'phone',
        placeholder: '+91 98765 43210',
        required: true,
        section: 'Buyer Details'
      },

      // ----------------------------------------------------
      // Section 2: Seller Details (8 fields)
      // ----------------------------------------------------
      {
        id: 'f-sd-9',
        key: 'sellerFullName',
        label: 'Seller (Vendor) Full Legal Name',
        type: 'text',
        placeholder: 'e.g. Rajesh Vikramaditya Sharma',
        required: true,
        section: 'Seller Details'
      },
      {
        id: 'f-sd-10',
        key: 'sellerParentOrSpouseName',
        label: "Seller's Father's / Husband's Name",
        type: 'text',
        placeholder: 'e.g. S/o Late O.P. Sharma',
        required: true,
        section: 'Seller Details'
      },
      {
        id: 'f-sd-11',
        key: 'sellerAge',
        label: 'Seller Age (in completed years)',
        type: 'number',
        placeholder: 'e.g. 54',
        required: true,
        section: 'Seller Details',
        validation: { min: 18, max: 110 }
      },
      {
        id: 'f-sd-12',
        key: 'sellerPanNumber',
        label: 'Seller PAN Card Number',
        type: 'text',
        placeholder: '10-character PAN e.g. KLMNP9876Q',
        required: true,
        isSensitive: true,
        section: 'Seller Details',
        validation: { min: 10, max: 10 }
      },
      {
        id: 'f-sd-13',
        key: 'sellerAadhaarNumber',
        label: 'Seller Aadhaar Number',
        type: 'text',
        placeholder: '12-digit UID number',
        required: true,
        isSensitive: true,
        section: 'Seller Details',
        validation: { min: 12, max: 14 }
      },
      {
        id: 'f-sd-14',
        key: 'sellerOccupation',
        label: 'Seller Profession / Status',
        type: 'text',
        placeholder: 'e.g. Retired Government Officer / Business Owner',
        required: true,
        section: 'Seller Details'
      },
      {
        id: 'f-sd-15',
        key: 'sellerAddress',
        label: 'Seller Permanent Domicile Address',
        type: 'textarea',
        placeholder: 'Complete address of the seller',
        required: true,
        section: 'Seller Details'
      },
      {
        id: 'f-sd-16',
        key: 'sellerPhone',
        label: 'Seller Contact Phone Number',
        type: 'phone',
        placeholder: '+91 98110 55443',
        required: true,
        section: 'Seller Details'
      },

      // ----------------------------------------------------
      // Section 3: Property Details (10 fields)
      // ----------------------------------------------------
      {
        id: 'f-sd-17',
        key: 'propertyClassification',
        label: 'Immovable Property Classification',
        type: 'select',
        required: true,
        section: 'Property Details',
        options: [
          { label: 'Residential Flat / Multistory Apartment', value: 'flat' },
          { label: 'Independent Residential House / Villa', value: 'independent_house' },
          { label: 'Commercial Office Space / Retail Shop', value: 'commercial' },
          { label: 'Residential Freehold Plot / Land', value: 'plot' },
          { label: 'Agricultural Land / Farm House', value: 'agricultural' }
        ]
      },
      {
        id: 'f-sd-18',
        key: 'surveyOrKhasraNumber',
        label: 'Khasra / Khata / Survey / CTS Number',
        type: 'text',
        placeholder: 'e.g. Khasra No. 442/1, Khatauni No. 102',
        required: true,
        section: 'Property Details'
      },
      {
        id: 'f-sd-19',
        key: 'flatPlotHouseNumber',
        label: 'Flat / Unit / Plot Number & Building Name',
        type: 'text',
        placeholder: 'e.g. Flat No. 802, Block C, Silver Oaks Enclave',
        required: true,
        section: 'Property Details'
      },
      {
        id: 'f-sd-20',
        key: 'propertyLocality',
        label: 'Locality, Sector / Village Name',
        type: 'text',
        placeholder: 'e.g. Sector 76, Noida',
        required: true,
        section: 'Property Details'
      },
      {
        id: 'f-sd-21',
        key: 'subRegistrarJurisdiction',
        label: 'Jurisdictional Sub-Registrar Office (SRO)',
        type: 'text',
        placeholder: 'e.g. Sub-Registrar Office, Gautam Buddha Nagar, Noida III',
        required: true,
        section: 'Property Details'
      },
      {
        id: 'f-sd-22',
        key: 'superBuiltUpArea',
        label: 'Super Built-up Area (in Sq. Ft. / Sq. Meters)',
        type: 'text',
        placeholder: 'e.g. 1580 Sq. Ft. (146.78 Sq. Mtrs)',
        required: true,
        section: 'Property Details'
      },
      {
        id: 'f-sd-23',
        key: 'carpetAreaSchedule',
        label: 'RERA Carpet Area (in Sq. Ft.)',
        type: 'text',
        placeholder: 'e.g. 1120 Sq. Ft.',
        required: true,
        section: 'Property Details'
      },
      {
        id: 'f-sd-24',
        key: 'boundaryNorth',
        label: 'Schedule of Property: North Boundary',
        type: 'text',
        placeholder: 'e.g. 24-meter wide sector master road',
        required: true,
        section: 'Property Details'
      },
      {
        id: 'f-sd-25',
        key: 'boundarySouth',
        label: 'Schedule of Property: South Boundary',
        type: 'text',
        placeholder: 'e.g. Flat No. 803 and staircase lobby',
        required: true,
        section: 'Property Details'
      },
      {
        id: 'f-sd-26',
        key: 'boundaryEastWest',
        label: 'Schedule of Property: East & West Boundaries',
        type: 'text',
        placeholder: 'e.g. East: Open Green Lawn; West: Common corridor & lifts',
        required: true,
        section: 'Property Details'
      },

      // ----------------------------------------------------
      // Section 4: Payment & Transaction Details (9 fields)
      // ----------------------------------------------------
      {
        id: 'f-sd-27',
        key: 'totalSaleConsideration',
        label: 'Total Agreed Sale Consideration Amount (INR ₹)',
        type: 'number',
        placeholder: 'e.g. 8500000',
        required: true,
        isSensitive: true,
        section: 'Payment & Transaction Details',
        helpText: 'Full sale value agreed between buyer and seller.'
      },
      {
        id: 'f-sd-28',
        key: 'advanceTokenPaid',
        label: 'Earnest Money / Advance Token Amount Paid (INR ₹)',
        type: 'number',
        placeholder: 'e.g. 1000000',
        required: true,
        isSensitive: true,
        section: 'Payment & Transaction Details'
      },
      {
        id: 'f-sd-29',
        key: 'balanceAmountPayable',
        label: 'Balance Consideration Paid at Time of Registration (INR ₹)',
        type: 'number',
        placeholder: 'e.g. 7500000',
        required: true,
        isSensitive: true,
        section: 'Payment & Transaction Details'
      },
      {
        id: 'f-sd-30',
        key: 'paymentMode',
        label: 'Primary Mode of Balance Payment',
        type: 'select',
        required: true,
        section: 'Payment & Transaction Details',
        options: [
          { label: 'Bank RTGS / NEFT Direct Electronic Transfer', value: 'rtgs' },
          { label: 'Banker’s Cheque / Demand Draft (DD)', value: 'dd' },
          { label: 'Housing Loan Direct Bank Disbursal via DD/RTGS', value: 'bank_loan_disbursement' }
        ]
      },
      {
        id: 'f-sd-31',
        key: 'bankUtrOrDdNumber',
        label: 'Bank UTR / Transaction Reference / DD Numbers',
        type: 'text',
        placeholder: 'e.g. UTR: SBIN26078192837 Dated 15-03-2026',
        required: true,
        isSensitive: true,
        section: 'Payment & Transaction Details'
      },
      {
        id: 'f-sd-32',
        key: 'tdsAmountDeducted',
        label: 'TDS Deducted under Section 194-IA (1% on ₹50L+ property - INR ₹)',
        type: 'number',
        placeholder: 'e.g. 85000',
        required: true,
        section: 'Payment & Transaction Details'
      },
      {
        id: 'f-sd-33',
        key: 'stampDutyPaid',
        label: 'Total Stamp Duty Amount Paid to State Treasury (INR ₹)',
        type: 'number',
        placeholder: 'e.g. 595000 (7% of circle rate/consideration)',
        required: true,
        section: 'Payment & Transaction Details'
      },
      {
        id: 'f-sd-34',
        key: 'registrationFeePaid',
        label: 'Registration Fee Paid to SRO (INR ₹)',
        type: 'number',
        placeholder: 'e.g. 85000 (1% of consideration)',
        required: true,
        section: 'Payment & Transaction Details'
      },
      {
        id: 'f-sd-35',
        key: 'eStampCertificateNumber',
        label: 'E-Stamp Certificate Reference Number (SHCIL/Govt)',
        type: 'text',
        placeholder: 'e.g. IN-UP99182736452019X',
        required: true,
        section: 'Payment & Transaction Details'
      },

      // ----------------------------------------------------
      // Section 5: Witness Details (6 fields)
      // ----------------------------------------------------
      {
        id: 'f-sd-36',
        key: 'witness1FullName',
        label: 'Witness 1 Full Legal Name',
        type: 'text',
        placeholder: 'e.g. Alok Nath Verma',
        required: true,
        section: 'Witness Details'
      },
      {
        id: 'f-sd-37',
        key: 'witness1Aadhaar',
        label: 'Witness 1 Aadhaar / Identity ID Number',
        type: 'text',
        placeholder: '12-digit Aadhaar number',
        required: true,
        isSensitive: true,
        section: 'Witness Details'
      },
      {
        id: 'f-sd-38',
        key: 'witness1Address',
        label: 'Witness 1 Residential Address',
        type: 'textarea',
        placeholder: 'Full address of Witness 1',
        required: true,
        section: 'Witness Details'
      },
      {
        id: 'f-sd-39',
        key: 'witness2FullName',
        label: 'Witness 2 Full Legal Name',
        type: 'text',
        placeholder: 'e.g. Priya Sundaram',
        required: true,
        section: 'Witness Details'
      },
      {
        id: 'f-sd-40',
        key: 'witness2Aadhaar',
        label: 'Witness 2 Aadhaar / Identity ID Number',
        type: 'text',
        placeholder: '12-digit Aadhaar number',
        required: true,
        isSensitive: true,
        section: 'Witness Details'
      },
      {
        id: 'f-sd-41',
        key: 'witness2Address',
        label: 'Witness 2 Residential Address',
        type: 'textarea',
        placeholder: 'Full address of Witness 2',
        required: true,
        section: 'Witness Details'
      },

      // ----------------------------------------------------
      // Section 6: Document Uploads (8 fields)
      // ----------------------------------------------------
      {
        id: 'f-sd-42',
        key: 'docPreviousTitleDeed',
        label: 'Previous Registered Title Deed / Parent Deed (Chain of Title)',
        type: 'file',
        required: true,
        section: 'Document Uploads',
        helpText: 'Registered document proving seller original lawful ownership.'
      },
      {
        id: 'f-sd-43',
        key: 'docEncumbranceCertificate',
        label: 'Non-Encumbrance Certificate (Form 15/16 for 13+ Years)',
        type: 'file',
        required: true,
        section: 'Document Uploads',
        helpText: 'Official SRO search proving no outstanding mortgage or court attachment.'
      },
      {
        id: 'f-sd-44',
        key: 'docPropertyTaxReceipt',
        label: 'Latest Municipal Property Tax Assessment & Payment Receipt',
        type: 'file',
        required: true,
        section: 'Document Uploads'
      },
      {
        id: 'f-sd-45',
        key: 'docSocietyNoc',
        label: 'Resident Welfare Association (RWA) / Society Transfer NOC',
        type: 'file',
        required: true,
        section: 'Document Uploads'
      },
      {
        id: 'f-sd-46',
        key: 'docEStampChallan',
        label: 'E-Stamp Certificate & Treasury Payment Challan',
        type: 'file',
        required: true,
        section: 'Document Uploads'
      },
      {
        id: 'f-sd-47',
        key: 'docTdsForm26qb',
        label: 'TDS Challan Form 26QB Acknowledgement Receipt',
        type: 'file',
        required: true,
        section: 'Document Uploads'
      },
      {
        id: 'f-sd-48',
        key: 'docBuyerSellerKyc',
        label: 'Buyer & Seller PAN & Aadhaar Cards (Combined PDF)',
        type: 'file',
        required: true,
        isSensitive: true,
        section: 'Document Uploads'
      },
      {
        id: 'f-sd-49',
        key: 'docPassportPhotos',
        label: 'Passport Photos of Buyer & Seller with Signatures',
        type: 'file',
        required: true,
        section: 'Document Uploads'
      },

      // ----------------------------------------------------
      // Section 7: Legal Declaration & Indemnity (7 fields)
      // ----------------------------------------------------
      {
        id: 'f-sd-50',
        key: 'clearMarketableTitleCovenant',
        label: 'Marketable Title Covenant: The Seller declares having absolute, clear, and marketable title, with full legal right and power to convey and transfer the schedule property.',
        type: 'checkbox',
        required: true,
        defaultValue: false,
        section: 'Legal Declaration'
      },
      {
        id: 'f-sd-51',
        key: 'freeFromEncumbrancesCovenant',
        label: 'Freedom from Encumbrances: The Seller covenants that the property is free from all prior mortgages, charges, liens, lis pendens, tax arrears, claims, or government acquisition notices.',
        type: 'checkbox',
        required: true,
        defaultValue: false,
        section: 'Legal Declaration'
      },
      {
        id: 'f-sd-52',
        key: 'vacantPossessionHandover',
        label: 'Physical Possession: The Seller covenants to hand over peaceful, physical, vacant, and proprietary possession of the property to the Buyer simultaneously with registration.',
        type: 'checkbox',
        required: true,
        defaultValue: false,
        section: 'Legal Declaration'
      },
      {
        id: 'f-sd-53',
        key: 'indemnityClauseConsent',
        label: 'Indemnity Clause: The Seller hereby agrees to indemnify and keep indemnified the Buyer against any future loss, title dispute, or legal costs arising from any antecedent defects in title.',
        type: 'checkbox',
        required: true,
        defaultValue: false,
        section: 'Legal Declaration'
      },
      {
        id: 'f-sd-54',
        key: 'executionDate',
        label: 'Date of Sale Deed Execution',
        type: 'date',
        required: true,
        section: 'Legal Declaration'
      },
      {
        id: 'f-sd-55',
        key: 'registeredDeedDocNumber',
        label: 'Book 1 Document Registration Reference ID',
        type: 'text',
        placeholder: 'e.g. SRO-NOIDA-BK1-2026-09182',
        defaultValue: 'SRO-NOIDA-BK1-2026-09182',
        required: true,
        section: 'Legal Declaration'
      },
      {
        id: 'f-sd-56',
        key: 'digitalAffirmationSignatures',
        label: 'Digital Affirmation of Parties (Buyer & Seller)',
        type: 'text',
        placeholder: 'Confirmed by Sneha Rai (Buyer) and Rajesh Sharma (Seller)',
        required: true,
        section: 'Legal Declaration'
      }
    ]
  },

  // ==========================================
  // 14. EMPLOYMENT: EMPLOYEE ONBOARDING FORM (DETAILED - 68 FIELDS)
  // ==========================================
  {
    id: 'template-emp-onboarding-detailed',
    title: 'Employee Onboarding Form (Detailed)',
    description: 'Complete new hire corporate onboarding dossier covering personal KYC, emergency contacts, payroll banking, prior employment history, education records, health insurance, and NDA compliance.',
    category: 'Employment',
    icon: 'Briefcase',
    estimatedMinutes: 18,
    isPublished: true,
    createdAt: '2026-03-01T10:00:00.000Z',
    updatedAt: '2026-03-18T10:00:00.000Z',
    fields: [
      // ----------------------------------------------------
      // Section 1: Personal Details (10 fields)
      // ----------------------------------------------------
      {
        id: 'f-onb-1',
        key: 'fullLegalName',
        label: 'Full Legal Name (as per Income Tax PAN Card)',
        type: 'text',
        placeholder: 'e.g. Sneha Kumari Rai',
        required: true,
        section: 'Personal Details',
        helpText: 'Must match official PAN records for salary payroll and PF linking.'
      },
      {
        id: 'f-onb-2',
        key: 'preferredName',
        label: 'Preferred First Name / Slack Display Name',
        type: 'text',
        placeholder: 'e.g. Sneha',
        required: false,
        section: 'Personal Details'
      },
      {
        id: 'f-onb-3',
        key: 'dob',
        label: 'Date of Birth',
        type: 'date',
        required: true,
        section: 'Personal Details'
      },
      {
        id: 'f-onb-4',
        key: 'gender',
        label: 'Gender',
        type: 'select',
        required: true,
        section: 'Personal Details',
        options: [
          { label: 'Female', value: 'female' },
          { label: 'Male', value: 'male' },
          { label: 'Non-Binary / Genderqueer', value: 'non_binary' },
          { label: 'Prefer not to disclose', value: 'prefer_not_say' }
        ]
      },
      {
        id: 'f-onb-5',
        key: 'bloodGroup',
        label: 'Blood Group',
        type: 'select',
        required: true,
        section: 'Personal Details',
        options: [
          { label: 'A+', value: 'A+' },
          { label: 'A-', value: 'A-' },
          { label: 'B+', value: 'B+' },
          { label: 'B-', value: 'B-' },
          { label: 'O+', value: 'O+' },
          { label: 'O-', value: 'O-' },
          { label: 'AB+', value: 'AB+' },
          { label: 'AB-', value: 'AB-' }
        ]
      },
      {
        id: 'f-onb-6',
        key: 'maritalStatus',
        label: 'Marital Status',
        type: 'select',
        required: true,
        section: 'Personal Details',
        options: [
          { label: 'Single / Unmarried', value: 'single' },
          { label: 'Married', value: 'married' },
          { label: 'Other', value: 'other' }
        ]
      },
      {
        id: 'f-onb-7',
        key: 'panNumber',
        label: 'Permanent Account Number (PAN)',
        type: 'text',
        placeholder: '10-character PAN e.g. ABCDE1234F',
        required: true,
        isSensitive: true,
        section: 'Personal Details',
        validation: { min: 10, max: 10 }
      },
      {
        id: 'f-onb-8',
        key: 'aadhaarNumber',
        label: 'Aadhaar UID Number',
        type: 'text',
        placeholder: '12-digit number e.g. 5432 1098 7654',
        required: true,
        isSensitive: true,
        section: 'Personal Details',
        validation: { min: 12, max: 14 }
      },
      {
        id: 'f-onb-9',
        key: 'passportNumber',
        label: 'Passport Number (if available for onsite travel)',
        type: 'text',
        placeholder: 'e.g. Z1234567',
        required: false,
        isSensitive: true,
        section: 'Personal Details'
      },
      {
        id: 'f-onb-10',
        key: 'differentlyAbled',
        label: 'Person with Disability (PwD) / Accessibility Assistance Needed?',
        type: 'radio',
        required: true,
        section: 'Personal Details',
        options: [
          { label: 'No', value: 'no' },
          { label: 'Yes (Workplace accommodation needed)', value: 'yes' }
        ]
      },

      // ----------------------------------------------------
      // Section 2: Contact & Emergency Details (8 fields)
      // ----------------------------------------------------
      {
        id: 'f-onb-11',
        key: 'personalMobile',
        label: 'Personal Mobile Contact Number',
        type: 'phone',
        placeholder: '+91 98765 43210',
        required: true,
        isSensitive: true,
        section: 'Contact & Emergency Details'
      },
      {
        id: 'f-onb-12',
        key: 'personalEmail',
        label: 'Personal Email Address',
        type: 'email',
        placeholder: 'sneha.personal@gmail.com',
        required: true,
        isSensitive: true,
        section: 'Contact & Emergency Details'
      },
      {
        id: 'f-onb-13',
        key: 'currentAddress',
        label: 'Current Residence Address (Local City)',
        type: 'textarea',
        placeholder: 'Flat No, Building, Street, Locality',
        required: true,
        section: 'Contact & Emergency Details'
      },
      {
        id: 'f-onb-14',
        key: 'permanentAddress',
        label: 'Permanent Hometown Address',
        type: 'textarea',
        placeholder: 'Ancestral / Domicile address with State & PIN',
        required: true,
        section: 'Contact & Emergency Details'
      },
      {
        id: 'f-onb-15',
        key: 'emergencyContactName',
        label: 'Primary Emergency Contact Person Full Name',
        type: 'text',
        placeholder: 'e.g. Ramesh Kumar Rai',
        required: true,
        section: 'Contact & Emergency Details'
      },
      {
        id: 'f-onb-16',
        key: 'emergencyContactRelationship',
        label: 'Relationship with Emergency Contact',
        type: 'select',
        required: true,
        section: 'Contact & Emergency Details',
        options: [
          { label: 'Father', value: 'father' },
          { label: 'Mother', value: 'mother' },
          { label: 'Spouse', value: 'spouse' },
          { label: 'Brother / Sister', value: 'sibling' },
          { label: 'Guardian / Relative', value: 'relative' }
        ]
      },
      {
        id: 'f-onb-17',
        key: 'emergencyContactPhone',
        label: 'Emergency Contact Mobile Number',
        type: 'phone',
        placeholder: '+91 94150 12345',
        required: true,
        section: 'Contact & Emergency Details'
      },
      {
        id: 'f-onb-18',
        key: 'emergencyContactAddress',
        label: 'Emergency Contact Residential City',
        type: 'text',
        placeholder: 'e.g. New Delhi / Lucknow',
        required: true,
        section: 'Contact & Emergency Details'
      },

      // ----------------------------------------------------
      // Section 3: Bank & Salary Details (8 fields)
      // ----------------------------------------------------
      {
        id: 'f-onb-19',
        key: 'salaryBankName',
        label: 'Salary Bank Name',
        type: 'select',
        required: true,
        section: 'Bank & Salary Details',
        options: [
          { label: 'HDFC Bank (Corporate Salary Account Partner)', value: 'HDFC' },
          { label: 'ICICI Bank (Corporate Salary Account Partner)', value: 'ICICI' },
          { label: 'Axis Bank', value: 'AXIS' },
          { label: 'State Bank of India (SBI)', value: 'SBI' },
          { label: 'Kotak Mahindra Bank', value: 'KOTAK' },
          { label: 'Other Bank', value: 'OTHER' }
        ]
      },
      {
        id: 'f-onb-20',
        key: 'salaryAccountNumber',
        label: 'Salary Bank Account Number',
        type: 'text',
        placeholder: 'e.g. 50100492817261',
        required: true,
        isSensitive: true,
        section: 'Bank & Salary Details'
      },
      {
        id: 'f-onb-21',
        key: 'salaryBankIfsc',
        label: 'Bank IFSC Code',
        type: 'text',
        placeholder: '11-character IFSC e.g. HDFC0001234',
        required: true,
        isSensitive: true,
        section: 'Bank & Salary Details',
        validation: { min: 11, max: 11 }
      },
      {
        id: 'f-onb-22',
        key: 'bankBranchLocation',
        label: 'Bank Branch Location',
        type: 'text',
        placeholder: 'e.g. Sector 62, Noida Branch',
        required: true,
        section: 'Bank & Salary Details'
      },
      {
        id: 'f-onb-23',
        key: 'epfoUanNumber',
        label: 'EPFO Universal Account Number (UAN) (if prior PF member)',
        type: 'text',
        placeholder: '12-digit UAN e.g. 101234567890',
        required: false,
        isSensitive: true,
        section: 'Bank & Salary Details',
        helpText: 'Provide existing UAN to seamlessly transfer PF service records.'
      },
      {
        id: 'f-onb-24',
        key: 'previousPfMemberId',
        label: 'Previous PF Member ID (if applicable)',
        type: 'text',
        placeholder: 'e.g. GNGGN12345670000123',
        required: false,
        section: 'Bank & Salary Details'
      },
      {
        id: 'f-onb-25',
        key: 'esicInsuranceNumber',
        label: 'ESIC Insurance Number (if applicable)',
        type: 'text',
        placeholder: '17-digit ESIC IP number',
        required: false,
        isSensitive: true,
        section: 'Bank & Salary Details'
      },
      {
        id: 'f-onb-26',
        key: 'gratuityNomineeName',
        label: 'Payment of Gratuity Nominee Full Name',
        type: 'text',
        placeholder: 'e.g. Sunita Devi (Mother)',
        required: true,
        section: 'Bank & Salary Details'
      },

      // ----------------------------------------------------
      // Section 4: Previous Employment History (10 fields)
      // ----------------------------------------------------
      {
        id: 'f-onb-27',
        key: 'totalExperienceYears',
        label: 'Total Relevant Work Experience (in Years)',
        type: 'number',
        placeholder: 'e.g. 4.5',
        required: true,
        section: 'Previous Employment History',
        validation: { min: 0, max: 40 }
      },
      {
        id: 'f-onb-28',
        key: 'immediatePreviousEmployer',
        label: 'Immediate Previous Company / Employer Name',
        type: 'text',
        placeholder: 'e.g. Tata Consultancy Services Ltd',
        required: false,
        section: 'Previous Employment History',
        helpText: 'Leave blank if this is your first full-time job (Fresher).'
      },
      {
        id: 'f-onb-29',
        key: 'lastDesignation',
        label: 'Last Held Designation / Job Title',
        type: 'text',
        placeholder: 'e.g. Software Engineer II',
        required: false,
        section: 'Previous Employment History'
      },
      {
        id: 'f-onb-30',
        key: 'previousJoiningDate',
        label: 'Date of Joining Previous Employer',
        type: 'date',
        required: false,
        section: 'Previous Employment History'
      },
      {
        id: 'f-onb-31',
        key: 'previousRelievingDate',
        label: 'Date of Relieving / Last Working Day',
        type: 'date',
        required: false,
        section: 'Previous Employment History'
      },
      {
        id: 'f-onb-32',
        key: 'previousEmployeeId',
        label: 'Previous Company Employee Code / Staff ID',
        type: 'text',
        placeholder: 'e.g. EMP-99281',
        required: false,
        section: 'Previous Employment History'
      },
      {
        id: 'f-onb-33',
        key: 'lastDrawnAnnualCtc',
        label: 'Last Drawn Annual Fixed CTC (INR ₹)',
        type: 'number',
        placeholder: 'e.g. 1200000',
        required: false,
        isSensitive: true,
        section: 'Previous Employment History'
      },
      {
        id: 'f-onb-34',
        key: 'reportingManagerName',
        label: 'Previous Reporting Manager Full Name',
        type: 'text',
        placeholder: 'e.g. Vikramaditya Rathore',
        required: false,
        section: 'Previous Employment History'
      },
      {
        id: 'f-onb-35',
        key: 'reportingManagerEmail',
        label: 'Previous Manager Official Corporate Email',
        type: 'email',
        placeholder: 'manager@previousemployer.com',
        required: false,
        section: 'Previous Employment History'
      },
      {
        id: 'f-onb-36',
        key: 'backgroundVerificationConsent',
        label: 'Background Verification (BGV) Authorization for Past Employment',
        type: 'radio',
        required: true,
        section: 'Previous Employment History',
        options: [
          { label: 'Yes, authorized to contact previous employer for verification', value: 'yes' },
          { label: 'Fresher (No prior employer to verify)', value: 'fresher' }
        ]
      },

      // ----------------------------------------------------
      // Section 5: Education Qualification (8 fields)
      // ----------------------------------------------------
      {
        id: 'f-onb-37',
        key: 'highestDegreeLevel',
        label: 'Highest Educational Degree Completed',
        type: 'select',
        required: true,
        section: 'Education Qualification',
        options: [
          { label: 'Bachelor’s Degree (B.Tech / B.E. / B.Sc / B.Com / B.A / BCA)', value: 'bachelor' },
          { label: 'Master’s Degree (M.Tech / M.E. / M.Sc / MBA / MCA / M.Com)', value: 'master' },
          { label: 'Doctorate (Ph.D.)', value: 'doctorate' },
          { label: 'Diploma / Polytechnic', value: 'diploma' }
        ]
      },
      {
        id: 'f-onb-38',
        key: 'degreeSpecialization',
        label: 'Degree Title & Major Specialization',
        type: 'text',
        placeholder: 'e.g. B.Tech in Computer Science & Artificial Intelligence',
        required: true,
        section: 'Education Qualification'
      },
      {
        id: 'f-onb-39',
        key: 'universityCollegeName',
        label: 'College / Institute / University Name',
        type: 'text',
        placeholder: 'e.g. National Institute of Technology (NIT)',
        required: true,
        section: 'Education Qualification'
      },
      {
        id: 'f-onb-40',
        key: 'graduationYear',
        label: 'Year of Graduation / Degree Award',
        type: 'number',
        placeholder: 'e.g. 2024',
        required: true,
        section: 'Education Qualification',
        validation: { min: 1970, max: 2026 }
      },
      {
        id: 'f-onb-41',
        key: 'cgpaOrPercentage',
        label: 'Aggregate Marks Percentage / Final CGPA',
        type: 'text',
        placeholder: 'e.g. 8.8 CGPA or 84.5%',
        required: true,
        section: 'Education Qualification'
      },
      {
        id: 'f-onb-42',
        key: 'school12thDetails',
        label: 'Class 12th / Intermediate School Name & Board',
        type: 'text',
        placeholder: 'e.g. Delhi Public School, CBSE (92.4%)',
        required: true,
        section: 'Education Qualification'
      },
      {
        id: 'f-onb-43',
        key: 'school10thDetails',
        label: 'Class 10th / Matriculation School Name & Board',
        type: 'text',
        placeholder: 'e.g. St. Xavier High School, ICSE (94.0%)',
        required: true,
        section: 'Education Qualification'
      },
      {
        id: 'f-onb-44',
        key: 'technicalCertifications',
        label: 'Professional & Cloud Certifications (AWS/GCP/Kubernetes etc.)',
        type: 'textarea',
        placeholder: 'e.g. AWS Certified Solutions Architect, CKA, TensorFlow Developer',
        required: false,
        section: 'Education Qualification'
      },

      // ----------------------------------------------------
      // Section 6: Insurance & Nominee Details (8 fields)
      // ----------------------------------------------------
      {
        id: 'f-onb-45',
        key: 'mediclaimNomineeName',
        label: 'Group Mediclaim (GMC) Primary Dependent / Nominee Name',
        type: 'text',
        placeholder: 'e.g. Sunita Devi',
        required: true,
        section: 'Insurance & Nominee Details'
      },
      {
        id: 'f-onb-46',
        key: 'mediclaimRelationship',
        label: 'Relationship with GMC Nominee',
        type: 'select',
        required: true,
        section: 'Insurance & Nominee Details',
        options: [
          { label: 'Mother', value: 'mother' },
          { label: 'Father', value: 'father' },
          { label: 'Spouse', value: 'spouse' },
          { label: 'Child (Son / Daughter)', value: 'child' }
        ]
      },
      {
        id: 'f-onb-47',
        key: 'mediclaimNomineeDob',
        label: 'GMC Nominee Date of Birth',
        type: 'date',
        required: true,
        section: 'Insurance & Nominee Details'
      },
      {
        id: 'f-onb-48',
        key: 'groupTermLifeBeneficiary',
        label: 'Group Term Life (GTL) Primary Beneficiary Name',
        type: 'text',
        placeholder: 'e.g. Ramesh Kumar Rai',
        required: true,
        section: 'Insurance & Nominee Details'
      },
      {
        id: 'f-onb-49',
        key: 'gtlBeneficiarySharePercentage',
        label: 'GTL Benefit Share Percentage (%)',
        type: 'number',
        placeholder: '100',
        defaultValue: 100,
        required: true,
        section: 'Insurance & Nominee Details',
        validation: { min: 1, max: 100 }
      },
      {
        id: 'f-onb-50',
        key: 'preExistingMedicalConditions',
        label: 'Any Pre-Existing Chronic Medical Conditions? (For insurance underwriter)',
        type: 'textarea',
        placeholder: 'e.g. Hypertension / Diabetes / None',
        required: false,
        isSensitive: true,
        section: 'Insurance & Nominee Details'
      },
      {
        id: 'f-onb-51',
        key: 'covidVaccinationStatus',
        label: 'COVID-19 Vaccination Status',
        type: 'radio',
        required: true,
        section: 'Insurance & Nominee Details',
        options: [
          { label: 'Fully Vaccinated (Double Dose + Booster)', value: 'booster' },
          { label: 'Double Dose Vaccinated', value: 'double_dose' },
          { label: 'Single Dose / Exemption', value: 'other' }
        ]
      },
      {
        id: 'f-onb-52',
        key: 'severeAllergies',
        label: 'Known Severe Allergies or Dietary Medical Constraints',
        type: 'text',
        placeholder: 'e.g. Peanut allergy / None',
        required: false,
        isSensitive: true,
        section: 'Insurance & Nominee Details'
      },

      // ----------------------------------------------------
      // Section 7: Document Uploads (8 fields)
      // ----------------------------------------------------
      {
        id: 'f-onb-53',
        key: 'docSignedOfferLetter',
        label: 'Countersigned Offer Letter / Employment Agreement',
        type: 'file',
        required: true,
        section: 'Document Uploads',
        helpText: 'Signed copy of company appointment offer.'
      },
      {
        id: 'f-onb-54',
        key: 'docPanCard',
        label: 'Permanent Account Number (PAN) Card Copy',
        type: 'file',
        required: true,
        isSensitive: true,
        section: 'Document Uploads'
      },
      {
        id: 'f-onb-55',
        key: 'docAadhaarCard',
        label: 'Aadhaar Card Copy (Front & Back)',
        type: 'file',
        required: true,
        isSensitive: true,
        section: 'Document Uploads'
      },
      {
        id: 'f-onb-56',
        key: 'docDegreeCertificate',
        label: 'Highest Degree Graduation Certificate / Final Marksheet',
        type: 'file',
        required: true,
        section: 'Document Uploads'
      },
      {
        id: 'f-onb-57',
        key: 'docRelievingLetter',
        label: 'Previous Employer Relieving Letter & Experience Certificate',
        type: 'file',
        required: false,
        section: 'Document Uploads',
        helpText: 'Mandatory for experienced lateral candidates.'
      },
      {
        id: 'f-onb-58',
        key: 'docPreviousPayslips',
        label: 'Last 3 Months Payslips from Previous Employer',
        type: 'file',
        required: false,
        isSensitive: true,
        section: 'Document Uploads'
      },
      {
        id: 'f-onb-59',
        key: 'docCancelledCheque',
        label: 'Cancelled Cheque Leaf / Official Bank Account Passbook Front Page',
        type: 'file',
        required: true,
        isSensitive: true,
        section: 'Document Uploads'
      },
      {
        id: 'f-onb-60',
        key: 'docFormalHeadshotPhoto',
        label: 'Professional Corporate Headshot Photograph (For Company ID Card)',
        type: 'file',
        required: true,
        section: 'Document Uploads'
      },

      // ----------------------------------------------------
      // Section 8: Company Policy Acknowledgement (8 fields)
      // ----------------------------------------------------
      {
        id: 'f-onb-61',
        key: 'ndaConfidentialityAgreement',
        label: 'Non-Disclosure & Intellectual Property Assignment Agreement: I agree to keep all proprietary source code, business trade secrets, and customer data confidential, and assign all IP created during employment to the Company.',
        type: 'checkbox',
        required: true,
        defaultValue: false,
        section: 'Company Policy Acknowledgement'
      },
      {
        id: 'f-onb-62',
        key: 'codeOfConductAcceptance',
        label: 'Corporate Code of Conduct & Anti-Harassment (POSH) Policy: I have read and agree to comply with the employee handbook, POSH anti-sexual harassment guidelines, and workplace ethics.',
        type: 'checkbox',
        required: true,
        defaultValue: false,
        section: 'Company Policy Acknowledgement'
      },
      {
        id: 'f-onb-63',
        key: 'itSecurityAndAcceptableUse',
        label: 'Information Security & Data Protection Policy: I agree to follow strict cybersecurity hygiene, adhere to zero-trust device guidelines, and not install unauthorized software on corporate machines.',
        type: 'checkbox',
        required: true,
        defaultValue: false,
        section: 'Company Policy Acknowledgement'
      },
      {
        id: 'f-onb-64',
        key: 'bgvCriminalRecordDeclaration',
        label: 'Criminal History Declaration: I confirm that I have never been convicted of any criminal offence or financial fraud by any court of law.',
        type: 'checkbox',
        required: true,
        defaultValue: false,
        section: 'Company Policy Acknowledgement'
      },
      {
        id: 'f-onb-65',
        key: 'joiningDateConfirmed',
        label: 'Official Date of Joining Company',
        type: 'date',
        required: true,
        section: 'Company Policy Acknowledgement'
      },
      {
        id: 'f-onb-66',
        key: 'assignedDepartmentRole',
        label: 'Assigned Department & Business Unit',
        type: 'text',
        placeholder: 'e.g. Engineering - Artificial Intelligence & Voice Platforms',
        required: true,
        section: 'Company Policy Acknowledgement'
      },
      {
        id: 'f-onb-67',
        key: 'workLocationBase',
        label: 'Designated Base Office Location',
        type: 'select',
        required: true,
        section: 'Company Policy Acknowledgement',
        options: [
          { label: 'Bengaluru - Bellandur Tech Hub', value: 'blr' },
          { label: 'Noida - Sector 62 Campus', value: 'noida' },
          { label: 'Hyderabad - Hitec City Campus', value: 'hyd' },
          { label: 'Pune - Hinjewadi Tech Park', value: 'pune' },
          { label: 'Remote / Hybrid Work Mandate', value: 'remote' }
        ]
      },
      {
        id: 'f-onb-68',
        key: 'digitalSignatureAffirmation',
        label: 'Digital Signature (Type Full Legal Name)',
        type: 'text',
        placeholder: 'Type full legal name as electronic signature',
        required: true,
        section: 'Company Policy Acknowledgement'
      }
    ]
  },

  // ==========================================
  // 15. REAL ESTATE: PROPERTY LISTING FORM (DETAILED - 55 FIELDS)
  // ==========================================
  {
    id: 'template-realestate-listing-detailed',
    title: 'Property Listing Form (Detailed)',
    description: 'Comprehensive property listing dossier for premium sales, rental mandates, specifications, architectural amenities, legal documents, pricing terms, and photographic exhibits.',
    category: 'Real Estate',
    icon: 'Building2',
    estimatedMinutes: 15,
    isPublished: true,
    createdAt: '2026-03-01T10:00:00.000Z',
    updatedAt: '2026-03-18T10:00:00.000Z',
    fields: [
      // ----------------------------------------------------
      // Section 1: Owner Details (7 fields)
      // ----------------------------------------------------
      {
        id: 'f-pl-1',
        key: 'ownerFullName',
        label: 'Property Owner / Listing Representative Full Name',
        type: 'text',
        placeholder: 'e.g. Sneha Kumari Rai',
        required: true,
        section: 'Owner Details'
      },
      {
        id: 'f-pl-2',
        key: 'listerCapacity',
        label: 'I am Listing as',
        type: 'select',
        required: true,
        section: 'Owner Details',
        options: [
          { label: 'Individual Property Owner (Sole Freehold Owner)', value: 'sole_owner' },
          { label: 'Co-Owner (Joint Property Holder)', value: 'co_owner' },
          { label: 'Registered Real Estate Broker / Agent Mandate', value: 'broker' },
          { label: 'Authorized Builder / Promoter Sales Desk', value: 'builder_rep' },
          { label: 'Power of Attorney (POA) Holder', value: 'poa' }
        ]
      },
      {
        id: 'f-pl-3',
        key: 'ownerMobile',
        label: 'Primary Phone Number for Verified Buyer Leads',
        type: 'phone',
        placeholder: '+91 98765 43210',
        required: true,
        isSensitive: true,
        section: 'Owner Details'
      },
      {
        id: 'f-pl-4',
        key: 'ownerWhatsapp',
        label: 'WhatsApp Number for Inquiries',
        type: 'phone',
        placeholder: '+91 98111 22334',
        required: false,
        section: 'Owner Details'
      },
      {
        id: 'f-pl-5',
        key: 'ownerEmail',
        label: 'Official Email Address',
        type: 'email',
        placeholder: 'owner@domain.com',
        required: true,
        isSensitive: true,
        section: 'Owner Details'
      },
      {
        id: 'f-pl-6',
        key: 'ownerPanOrAadhaar',
        label: 'Owner PAN or Aadhaar Verification Number',
        type: 'text',
        placeholder: 'e.g. ABCDE1234F',
        required: true,
        isSensitive: true,
        section: 'Owner Details'
      },
      {
        id: 'f-pl-7',
        key: 'leadContactPreference',
        label: 'Preferred Time for Buyer / Tenant Inquiries',
        type: 'select',
        required: true,
        section: 'Owner Details',
        options: [
          { label: 'Anytime (9:00 AM to 8:00 PM)', value: 'anytime' },
          { label: 'Morning Only (9:00 AM to 1:00 PM)', value: 'morning' },
          { label: 'Evening Only (4:00 PM to 8:00 PM)', value: 'evening' },
          { label: 'Weekends Only (Saturday & Sunday)', value: 'weekends' }
        ]
      },

      // ----------------------------------------------------
      // Section 2: Property Specifications (10 fields)
      // ----------------------------------------------------
      {
        id: 'f-pl-8',
        key: 'listingTransactionType',
        label: 'Listing Transaction Intent',
        type: 'radio',
        required: true,
        section: 'Property Specifications',
        options: [
          { label: 'For Sale (Outright Purchase)', value: 'sale' },
          { label: 'For Rent / Lease (Monthly Rental)', value: 'rent' },
          { label: 'Commercial Lease', value: 'commercial_lease' }
        ]
      },
      {
        id: 'f-pl-9',
        key: 'propertyCategory',
        label: 'Property Typology',
        type: 'select',
        required: true,
        section: 'Property Specifications',
        options: [
          { label: 'Multistory High-Rise Apartment / Flat', value: 'apartment' },
          { label: 'Independent Villa / Gated Duplex House', value: 'villa' },
          { label: 'Builder Floor (Independent Floor)', value: 'builder_floor' },
          { label: 'Penthouse / Sky Villa', value: 'penthouse' },
          { label: 'Commercial Office Space', value: 'commercial_office' },
          { label: 'Retail Shop / Showroom', value: 'retail_shop' },
          { label: 'Residential Freehold Plot', value: 'plot' }
        ]
      },
      {
        id: 'f-pl-10',
        key: 'bhkConfiguration',
        label: 'Bedroom Configuration (BHK)',
        type: 'select',
        required: true,
        section: 'Property Specifications',
        options: [
          { label: '1 BHK', value: '1bhk' },
          { label: '2 BHK', value: '2bhk' },
          { label: '2.5 BHK (2 Bed + Study)', value: '2.5bhk' },
          { label: '3 BHK', value: '3bhk' },
          { label: '3.5 BHK (3 Bed + Servant Room)', value: '3.5bhk' },
          { label: '4 BHK / 4+ BHK Luxury', value: '4bhk' },
          { label: '5+ BHK Palatial Penthouse', value: '5bhk' },
          { label: 'Studio Apartment', value: 'studio' }
        ]
      },
      {
        id: 'f-pl-11',
        key: 'superBuiltUpArea',
        label: 'Super Built-up Area (Sq. Ft.)',
        type: 'number',
        placeholder: 'e.g. 1850',
        required: true,
        section: 'Property Specifications'
      },
      {
        id: 'f-pl-12',
        key: 'carpetArea',
        label: 'RERA Usable Carpet Area (Sq. Ft.)',
        type: 'number',
        placeholder: 'e.g. 1380',
        required: true,
        section: 'Property Specifications'
      },
      {
        id: 'f-pl-13',
        key: 'floorNumber',
        label: 'Floor Number of Unit',
        type: 'text',
        placeholder: 'e.g. 14th Floor (out of 24 Floors)',
        required: true,
        section: 'Property Specifications'
      },
      {
        id: 'f-pl-14',
        key: 'furnishingStatus',
        label: 'Furnishing Condition',
        type: 'select',
        required: true,
        section: 'Property Specifications',
        options: [
          { label: 'Fully Furnished (Beds, Sofa, ACs, Modular Kitchen, TV, Fridge)', value: 'fully_furnished' },
          { label: 'Semi-Furnished (Modular Kitchen, Wardrobes, Light & Fans)', value: 'semi_furnished' },
          { label: 'Unfurnished (Bare Shell / Raw)', value: 'unfurnished' }
        ]
      },
      {
        id: 'f-pl-15',
        key: 'bathroomsCount',
        label: 'Total Number of Bathrooms / Washrooms',
        type: 'select',
        required: true,
        section: 'Property Specifications',
        options: [
          { label: '1 Bathroom', value: '1' },
          { label: '2 Bathrooms', value: '2' },
          { label: '3 Bathrooms', value: '3' },
          { label: '4+ Bathrooms', value: '4+' }
        ]
      },
      {
        id: 'f-pl-16',
        key: 'balconiesCount',
        label: 'Number of Balconies',
        type: 'select',
        required: true,
        section: 'Property Specifications',
        options: [
          { label: '1 Balcony', value: '1' },
          { label: '2 Balconies', value: '2' },
          { label: '3 Balconies', value: '3' },
          { label: '4+ Balconies / Wrap-around Deck', value: '4+' }
        ]
      },
      {
        id: 'f-pl-17',
        key: 'vastuFacing',
        label: 'Main Entrance Facing (Vastu Orientation)',
        type: 'select',
        required: true,
        section: 'Property Specifications',
        options: [
          { label: 'North-East Facing (Ishan - Highly Auspicious)', value: 'north_east' },
          { label: 'East Facing', value: 'east' },
          { label: 'North Facing', value: 'north' },
          { label: 'West Facing', value: 'west' },
          { label: 'South / South-East Facing', value: 'south' }
        ]
      },

      // ----------------------------------------------------
      // Section 3: Location Details (8 fields)
      // ----------------------------------------------------
      {
        id: 'f-pl-18',
        key: 'societyProjectName',
        label: 'Gated Society / Tower / Complex Name',
        type: 'text',
        placeholder: 'e.g. ATS Greens Village / DLF Cyber City',
        required: true,
        section: 'Location Details'
      },
      {
        id: 'f-pl-19',
        key: 'streetAddress',
        label: 'Full Street Address & Plot / Sector Number',
        type: 'textarea',
        placeholder: 'Plot 1, Sector 93A, Express Highway',
        required: true,
        section: 'Location Details'
      },
      {
        id: 'f-pl-20',
        key: 'city',
        label: 'City / Municipal Corporation',
        type: 'text',
        placeholder: 'e.g. Noida / Gurugram / Mumbai / Bengaluru',
        required: true,
        section: 'Location Details'
      },
      {
        id: 'f-pl-21',
        key: 'state',
        label: 'State / Union Territory',
        type: 'text',
        placeholder: 'e.g. Uttar Pradesh / Maharashtra',
        required: true,
        section: 'Location Details'
      },
      {
        id: 'f-pl-22',
        key: 'pincode',
        label: 'Postal PIN Code',
        type: 'text',
        placeholder: 'e.g. 201304',
        required: true,
        section: 'Location Details',
        validation: { min: 6, max: 6 }
      },
      {
        id: 'f-pl-23',
        key: 'landmarkProximity',
        label: 'Key Landmarks & Connectivity (Metro, Expressway, Schools)',
        type: 'textarea',
        placeholder: 'e.g. 500m from Sector 137 Metro Station, 10 mins from Noida Expressway',
        required: true,
        section: 'Location Details'
      },
      {
        id: 'f-pl-24',
        key: 'googleMapsLink',
        label: 'Google Maps Location URL (Pin Drop)',
        type: 'text',
        placeholder: 'https://maps.google.com/?q=...',
        required: false,
        section: 'Location Details'
      },
      {
        id: 'f-pl-25',
        key: 'propertyViewDescription',
        label: 'Balcony View (Park / Pool / Clubhouse / Road Facing)',
        type: 'text',
        placeholder: 'e.g. Overlooking central park & Olympic-size swimming pool',
        required: true,
        section: 'Location Details'
      },

      // ----------------------------------------------------
      // Section 4: Legal Document Details (7 fields)
      // ----------------------------------------------------
      {
        id: 'f-pl-26',
        key: 'ownershipType',
        label: 'Legal Ownership Classification',
        type: 'select',
        required: true,
        section: 'Legal Document Details',
        options: [
          { label: 'Freehold Individual Property (Registered Sale Deed)', value: 'freehold' },
          { label: 'Development Authority Leasehold (99-year lease - NOIDA/DDA/MHADA)', value: 'leasehold' },
          { label: 'Cooperative Housing Society (Share Certificate issued)', value: 'chs' },
          { label: 'Builder Allotment / Tripartite Agreement (Pre-registration)', value: 'builder_allotment' }
        ]
      },
      {
        id: 'f-pl-27',
        key: 'reraRegistrationId',
        label: 'Project RERA Registration ID',
        type: 'text',
        placeholder: 'e.g. UPRERAPRJ12345',
        required: false,
        section: 'Legal Document Details'
      },
      {
        id: 'f-pl-28',
        key: 'occupancyCertificateStatus',
        label: 'Occupancy Certificate (OC) / Completion Certificate (CC)',
        type: 'select',
        required: true,
        section: 'Legal Document Details',
        options: [
          { label: 'OC & CC Received from Municipal Authority', value: 'oc_received' },
          { label: 'OC Applied / Under Final Inspection', value: 'oc_applied' },
          { label: 'Under Construction (OC Not Applicable yet)', value: 'under_construction' }
        ]
      },
      {
        id: 'f-pl-29',
        key: 'encumbranceFreeAffirmation',
        label: 'Is the Property Free from All Encumbrances and Court Stays?',
        type: 'radio',
        required: true,
        section: 'Legal Document Details',
        options: [
          { label: 'Yes, 100% clear title with zero encumbrances', value: 'yes' },
          { label: 'Active Bank Home Loan Mortgage (Bank NOC will be provided)', value: 'bank_mortgage' }
        ]
      },
      {
        id: 'f-pl-30',
        key: 'propertyAgeYears',
        label: 'Age of Construction / Building',
        type: 'select',
        required: true,
        section: 'Legal Document Details',
        options: [
          { label: 'Brand New (0 to 1 Year)', value: '0_1' },
          { label: '1 to 5 Years Old', value: '1_5' },
          { label: '5 to 10 Years Old', value: '5_10' },
          { label: '10+ Years Old', value: '10_plus' }
        ]
      },
      {
        id: 'f-pl-31',
        key: 'propertyTaxClearedUpTo',
        label: 'Municipal Property Tax Clearance Fiscal Year',
        type: 'text',
        placeholder: 'e.g. Paid up to 2025-2026',
        required: true,
        section: 'Legal Document Details'
      },
      {
        id: 'f-pl-32',
        key: 'societyDuesClearance',
        label: 'Society Maintenance Dues Status',
        type: 'radio',
        required: true,
        section: 'Legal Document Details',
        options: [
          { label: 'Zero Dues (Maintenance paid up to date)', value: 'cleared' },
          { label: 'Dues to be cleared upon deal closure', value: 'pending_closure' }
        ]
      },

      // ----------------------------------------------------
      // Section 5: Amenities & Features (8 fields)
      // ----------------------------------------------------
      {
        id: 'f-pl-33',
        key: 'parkingAllotment',
        label: 'Dedicated Car Parking Spaces',
        type: 'select',
        required: true,
        section: 'Amenities & Features',
        options: [
          { label: '2 Reserved Covered Basement Parking Slots', value: '2_covered' },
          { label: '1 Reserved Covered Parking Slot', value: '1_covered' },
          { label: '1 Open Surface Parking Slot', value: '1_open' },
          { label: 'Street / Common Parking', value: 'common' }
        ]
      },
      {
        id: 'f-pl-34',
        key: 'powerBackup',
        label: 'Power Backup Infrastructure',
        type: 'select',
        required: true,
        section: 'Amenities & Features',
        options: [
          { label: '100% Full DG Power Backup (Runs all ACs & appliances)', value: '100_full' },
          { label: 'Partial Backup (Lights, Fans, Fridge - 5 KVA)', value: 'partial' },
          { label: 'Inverter Backup Provision Only', value: 'inverter' }
        ]
      },
      {
        id: 'f-pl-35',
        key: 'gatedSecurityLevel',
        label: 'Security & Surveillance',
        type: 'select',
        required: true,
        section: 'Amenities & Features',
        options: [
          { label: '3-Tier High Security (MyGate App + RFID Boom Barrier + 24/7 Guards + CCTV)', value: '3tier' },
          { label: '24/7 Guarded Gated Complex with CCTV', value: '24x7' },
          { label: 'Standard Daytime Guard', value: 'standard' }
        ]
      },
      {
        id: 'f-pl-36',
        key: 'clubhouseAmenities',
        label: 'Clubhouse Facilities Available in Complex',
        type: 'textarea',
        placeholder: 'e.g. Swimming Pool, Gymnasium, Badminton Court, Squash Court, Banquet Hall, Spa, Kids Play Park',
        required: true,
        section: 'Amenities & Features'
      },
      {
        id: 'f-pl-37',
        key: 'pipedGasConnection',
        label: 'Piped Natural Gas (PNG - IGL/MGL/Adani)',
        type: 'radio',
        required: true,
        section: 'Amenities & Features',
        options: [
          { label: 'Yes - PNG Piped Gas active in kitchen', value: 'yes' },
          { label: 'LPG Cylinder only', value: 'no' }
        ]
      },
      {
        id: 'f-pl-38',
        key: 'waterSupplySource',
        label: 'Water Supply Source',
        type: 'select',
        required: true,
        section: 'Amenities & Features',
        options: [
          { label: '24x7 Treated Municipal Supply + RO Plant in Complex', value: 'municipal_treated' },
          { label: 'Borewell + Municipal Combined', value: 'combined' },
          { label: 'Borewell Only', value: 'borewell' }
        ]
      },
      {
        id: 'f-pl-39',
        key: 'petFriendlyPolicy',
        label: 'Pet Friendly Society Policy',
        type: 'radio',
        required: true,
        section: 'Amenities & Features',
        options: [
          { label: 'Yes - Pets Allowed & Welcomed', value: 'allowed' },
          { label: 'No - Pets Restricted by Society Bye-laws', value: 'restricted' }
        ]
      },
      {
        id: 'f-pl-40',
        key: 'elevatorCountPerTower',
        label: 'Elevator / Lift Count per Tower',
        type: 'select',
        required: true,
        section: 'Amenities & Features',
        options: [
          { label: '3 High-Speed Lifts (Including dedicated Stretcher / Service lift)', value: '3_lifts' },
          { label: '2 High-Speed Passenger Lifts', value: '2_lifts' },
          { label: '1 Lift', value: '1_lift' }
        ]
      },

      // ----------------------------------------------------
      // Section 6: Pricing & Payment Terms (8 fields)
      // ----------------------------------------------------
      {
        id: 'f-pl-41',
        key: 'expectedAskingPrice',
        label: 'Expected Asking Price (for Sale) or Monthly Rent (for Lease - INR ₹)',
        type: 'number',
        placeholder: 'e.g. 12500000 (for Sale) or 45000 (for Rent)',
        required: true,
        section: 'Pricing & Payment Terms'
      },
      {
        id: 'f-pl-42',
        key: 'priceNegotiability',
        label: 'Price Negotiability',
        type: 'radio',
        required: true,
        section: 'Pricing & Payment Terms',
        options: [
          { label: 'Slightly Negotiable for Serious Immediate Buyers', value: 'negotiable' },
          { label: 'Fixed Non-Negotiable Price', value: 'fixed' }
        ]
      },
      {
        id: 'f-pl-43',
        key: 'monthlyMaintenanceCharges',
        label: 'Monthly Society Maintenance Charges (INR ₹)',
        type: 'number',
        placeholder: 'e.g. 4500',
        required: true,
        section: 'Pricing & Payment Terms'
      },
      {
        id: 'f-pl-44',
        key: 'securityDepositMonths',
        label: 'Security Deposit Required (If Listing for Rent)',
        type: 'select',
        required: false,
        section: 'Pricing & Payment Terms',
        options: [
          { label: '2 Months Rent (Standard)', value: '2_months' },
          { label: '3 Months Rent', value: '3_months' },
          { label: '6 Months Rent (Commercial / Luxury)', value: '6_months' },
          { label: 'Not Applicable (Listing for Sale)', value: 'na' }
        ]
      },
      {
        id: 'f-pl-45',
        key: 'tokenBookingAmountExpected',
        label: 'Initial Token / Booking Advance Expected (INR ₹)',
        type: 'number',
        placeholder: 'e.g. 500000',
        required: true,
        section: 'Pricing & Payment Terms'
      },
      {
        id: 'f-pl-46',
        key: 'possessionAvailabilityDate',
        label: 'Possession / Move-in Availability Date',
        type: 'date',
        required: true,
        section: 'Pricing & Payment Terms'
      },
      {
        id: 'f-pl-47',
        key: 'preferredTenantOrBuyerProfile',
        label: 'Preferred Tenant / Buyer Profile',
        type: 'select',
        required: true,
        section: 'Pricing & Payment Terms',
        options: [
          { label: 'Family / Corporates / Working Professionals (All welcome)', value: 'all' },
          { label: 'Corporate Company Lease Preferred', value: 'company_lease' },
          { label: 'IT Professionals / Salaried Family', value: 'salaried_family' }
        ]
      },
      {
        id: 'f-pl-48',
        key: 'brokerageTerms',
        label: 'Brokerage Terms',
        type: 'radio',
        required: true,
        section: 'Pricing & Payment Terms',
        options: [
          { label: 'Direct from Owner (Zero 0% Brokerage)', value: 'zero_brokerage' },
          { label: 'Agent Listing (1% - 2% Standard Brokerage Applicable)', value: 'brokerage' }
        ]
      },

      // ----------------------------------------------------
      // Section 7: Photo & Document Uploads (7 fields)
      // ----------------------------------------------------
      {
        id: 'f-pl-49',
        key: 'docLivingRoomPhotos',
        label: 'Living Room & Drawing Hall High-Res Photos',
        type: 'file',
        required: true,
        section: 'Photo & Document Uploads',
        helpText: 'Well-lit wide angle photograph showing flooring, ceiling, and layout.'
      },
      {
        id: 'f-pl-50',
        key: 'docKitchenAndBedrooms',
        label: 'Modular Kitchen & Master Bedroom Photos',
        type: 'file',
        required: true,
        section: 'Photo & Document Uploads'
      },
      {
        id: 'f-pl-51',
        key: 'docBalconyViewPhotos',
        label: 'Balcony & Exterior Complex Elevation Photos',
        type: 'file',
        required: true,
        section: 'Photo & Document Uploads'
      },
      {
        id: 'f-pl-52',
        key: 'docFloorPlanDrawing',
        label: 'Architectural Floor Plan / 2D Layout Drawing',
        type: 'file',
        required: false,
        section: 'Photo & Document Uploads'
      },
      {
        id: 'f-pl-53',
        key: 'docTitleDeedOwnershipProof',
        label: 'Proof of Ownership (Sale Deed / Electricity Bill / Allotment Letter)',
        type: 'file',
        required: true,
        isSensitive: true,
        section: 'Photo & Document Uploads'
      },
      {
        id: 'f-pl-54',
        key: 'docOwnerIdentityProof',
        label: 'Owner Identity Card Proof (Aadhaar / PAN)',
        type: 'file',
        required: true,
        isSensitive: true,
        section: 'Photo & Document Uploads'
      },
      {
        id: 'f-pl-55',
        key: 'listingDeclarationConsent',
        label: 'Listing Authorization Consent: I declare that I am legally authorized to advertise this property and that all specifications, pricing, and amenities declared herein are genuine.',
        type: 'checkbox',
        required: true,
        defaultValue: false,
        section: 'Photo & Document Uploads'
      }
    ]
  },

  // ==========================================
  // 16. EDUCATION: UNIVERSITY ADMISSION FORM (DETAILED - 68 FIELDS)
  // ==========================================
  {
    id: 'template-edu-university-admission-detailed',
    title: 'University Admission Form (Detailed)',
    description: 'Comprehensive undergraduate & postgraduate university admissions dossier capturing candidate identity, academic transcripts, entrance exam ranks, departmental preferences, hostel requests, and scholarships.',
    category: 'Education',
    icon: 'GraduationCap',
    estimatedMinutes: 18,
    isPublished: true,
    createdAt: '2026-03-01T10:00:00.000Z',
    updatedAt: '2026-03-18T10:00:00.000Z',
    fields: [
      // ----------------------------------------------------
      // Section 1: Personal Details (10 fields)
      // ----------------------------------------------------
      {
        id: 'f-uni-1',
        key: 'candidateFullName',
        label: 'Candidate Full Legal Name (as per 10th Certificate)',
        type: 'text',
        placeholder: 'e.g. Sneha Kumari Rai',
        required: true,
        section: 'Personal Details',
        helpText: 'Official name to be printed on University degrees and grade cards.'
      },
      {
        id: 'f-uni-2',
        key: 'dob',
        label: 'Date of Birth',
        type: 'date',
        required: true,
        section: 'Personal Details'
      },
      {
        id: 'f-uni-3',
        key: 'gender',
        label: 'Gender',
        type: 'select',
        required: true,
        section: 'Personal Details',
        options: [
          { label: 'Female', value: 'female' },
          { label: 'Male', value: 'male' },
          { label: 'Non-Binary / Third Gender', value: 'non_binary' },
          { label: 'Prefer not to say', value: 'other' }
        ]
      },
      {
        id: 'f-uni-4',
        key: 'socialCategory',
        label: 'Social Category / Quota',
        type: 'select',
        required: true,
        section: 'Personal Details',
        options: [
          { label: 'General / Open Merit (GEN)', value: 'general' },
          { label: 'Other Backward Classes (OBC-NCL)', value: 'obc' },
          { label: 'Scheduled Caste (SC)', value: 'sc' },
          { label: 'Scheduled Tribe (ST)', value: 'st' },
          { label: 'Economically Weaker Section (EWS)', value: 'ews' },
          { label: 'Kashmiri Migrant / Armed Forces Quota (CW)', value: 'cw' }
        ]
      },
      {
        id: 'f-uni-5',
        key: 'bloodGroup',
        label: 'Blood Group',
        type: 'select',
        required: true,
        section: 'Personal Details',
        options: [
          { label: 'A+', value: 'A+' },
          { label: 'A-', value: 'A-' },
          { label: 'B+', value: 'B+' },
          { label: 'B-', value: 'B-' },
          { label: 'O+', value: 'O+' },
          { label: 'O-', value: 'O-' },
          { label: 'AB+', value: 'AB+' },
          { label: 'AB-', value: 'AB-' }
        ]
      },
      {
        id: 'f-uni-6',
        key: 'nationality',
        label: 'Nationality / Citizenship',
        type: 'text',
        placeholder: 'Indian',
        defaultValue: 'Indian',
        required: true,
        section: 'Personal Details'
      },
      {
        id: 'f-uni-7',
        key: 'motherTongue',
        label: 'Mother Tongue / Primary Language',
        type: 'text',
        placeholder: 'e.g. Hindi / English / Bengali / Marathi',
        required: true,
        section: 'Personal Details'
      },
      {
        id: 'f-uni-8',
        key: 'differentlyAbledStatus',
        label: 'Person with Benchmark Disability (PwD)?',
        type: 'radio',
        required: true,
        section: 'Personal Details',
        options: [
          { label: 'No', value: 'no' },
          { label: 'Yes (40% or above certified PwD reservation)', value: 'yes' }
        ]
      },
      {
        id: 'f-uni-9',
        key: 'aadhaarNumber',
        label: 'Candidate Aadhaar Number (UIDAI)',
        type: 'text',
        placeholder: '12-digit UID e.g. 5432 1098 7654',
        required: true,
        isSensitive: true,
        section: 'Personal Details',
        validation: { min: 12, max: 14 }
      },
      {
        id: 'f-uni-10',
        key: 'candidatePhoto',
        label: 'Candidate Passport Photograph',
        type: 'file',
        required: true,
        section: 'Personal Details',
        helpText: 'Recent color photograph with white background.'
      },

      // ----------------------------------------------------
      // Section 2: Academic History (10 fields)
      // ----------------------------------------------------
      {
        id: 'f-uni-11',
        key: 'class10thSchoolName',
        label: 'Class 10th (Secondary) School / Institution Name',
        type: 'text',
        placeholder: 'e.g. Delhi Public School, R.K. Puram, New Delhi',
        required: true,
        section: 'Academic History'
      },
      {
        id: 'f-uni-12',
        key: 'class10thBoard',
        label: 'Class 10th Examining Board',
        type: 'select',
        required: true,
        section: 'Academic History',
        options: [
          { label: 'Central Board of Secondary Education (CBSE)', value: 'cbse' },
          { label: 'Council for the Indian School Certificate (ICSE)', value: 'icse' },
          { label: 'State Examination Board', value: 'state_board' },
          { label: 'International Baccalaureate (IB) / Cambridge (IGCSE)', value: 'international' }
        ]
      },
      {
        id: 'f-uni-13',
        key: 'class10thYearOfPassing',
        label: 'Class 10th Year of Passing',
        type: 'number',
        placeholder: 'e.g. 2022',
        required: true,
        section: 'Academic History',
        validation: { min: 1980, max: 2026 }
      },
      {
        id: 'f-uni-14',
        key: 'class10thPercentage',
        label: 'Class 10th Aggregate Percentage / CGPA',
        type: 'text',
        placeholder: 'e.g. 94.6% or 9.6 CGPA',
        required: true,
        section: 'Academic History'
      },
      {
        id: 'f-uni-15',
        key: 'class12thSchoolName',
        label: 'Class 12th (Senior Secondary / Intermediate) College Name',
        type: 'text',
        placeholder: 'e.g. Delhi Public School, R.K. Puram',
        required: true,
        section: 'Academic History'
      },
      {
        id: 'f-uni-16',
        key: 'class12thBoard',
        label: 'Class 12th Examining Board',
        type: 'select',
        required: true,
        section: 'Academic History',
        options: [
          { label: 'CBSE Class XII', value: 'cbse' },
          { label: 'ISC Class XII', value: 'isc' },
          { label: 'State Board Intermediate / HSC', value: 'state_board' },
          { label: 'IB Diploma / Cambridge A-Levels', value: 'ib_alevels' }
        ]
      },
      {
        id: 'f-uni-17',
        key: 'class12thStream',
        label: 'Class 12th Academic Stream',
        type: 'select',
        required: true,
        section: 'Academic History',
        options: [
          { label: 'Science (Physics, Chemistry, Mathematics - PCM)', value: 'pcm' },
          { label: 'Science (Physics, Chemistry, Biology - PCB / PCMB)', value: 'pcb' },
          { label: 'Commerce with Mathematics', value: 'comm_math' },
          { label: 'Commerce without Mathematics', value: 'comm_plain' },
          { label: 'Humanities / Arts & Social Sciences', value: 'arts' }
        ]
      },
      {
        id: 'f-uni-18',
        key: 'class12thPercentage',
        label: 'Class 12th Best of 4 / Aggregate Percentage',
        type: 'text',
        placeholder: 'e.g. 96.2%',
        required: true,
        section: 'Academic History'
      },
      {
        id: 'f-uni-19',
        key: 'undergraduateDegreeDetails',
        label: 'Undergraduate Degree & University (For PG / Master’s Applicants only)',
        type: 'text',
        placeholder: 'e.g. B.Tech Computer Science, University of Delhi (8.9 CGPA)',
        required: false,
        section: 'Academic History'
      },
      {
        id: 'f-uni-20',
        key: 'academicGapYears',
        label: 'Academic Gap Years (if any gap taken between school and admission)',
        type: 'select',
        required: true,
        section: 'Academic History',
        options: [
          { label: 'No Gap (Direct Entry / Fresher)', value: 'no_gap' },
          { label: '1 Year Gap (Exam Preparation / Drop)', value: '1_year' },
          { label: '2+ Years Gap (Affidavit required)', value: '2_plus_years' }
        ]
      },

      // ----------------------------------------------------
      // Section 3: Entrance Exam Details (8 fields)
      // ----------------------------------------------------
      {
        id: 'f-uni-21',
        key: 'entranceExamType',
        label: 'National / State Entrance Examination Appeared',
        type: 'select',
        required: true,
        section: 'Entrance Exam Details',
        options: [
          { label: 'JEE Main (National Testing Agency)', value: 'jee_main' },
          { label: 'JEE Advanced (IITs)', value: 'jee_adv' },
          { label: 'NEET UG (Medical Entrance)', value: 'neet' },
          { label: 'Common University Entrance Test (CUET UG / PG)', value: 'cuet' },
          { label: 'GATE (Graduate Aptitude Test in Engineering)', value: 'gate' },
          { label: 'CAT / XAT / CMAT (Management)', value: 'cat' },
          { label: 'University Institutional Entrance Test (CET)', value: 'univ_cet' },
          { label: 'Merit-Based Direct Admission (12th Board Score)', value: 'merit_direct' }
        ]
      },
      {
        id: 'f-uni-22',
        key: 'entranceRollNumber',
        label: 'Entrance Examination Roll / Application Number',
        type: 'text',
        placeholder: 'e.g. 240310928172',
        required: true,
        section: 'Entrance Exam Details'
      },
      {
        id: 'f-uni-23',
        key: 'allIndiaRankAir',
        label: 'All India Rank (AIR Overall)',
        type: 'number',
        placeholder: 'e.g. 3412',
        required: true,
        section: 'Entrance Exam Details'
      },
      {
        id: 'f-uni-24',
        key: 'categoryRank',
        label: 'Category / Quota Rank (if applicable)',
        type: 'number',
        placeholder: 'e.g. 428',
        required: false,
        section: 'Entrance Exam Details'
      },
      {
        id: 'f-uni-25',
        key: 'percentileOrNtaScore',
        label: 'Percentile Score / NTA Normalised Score',
        type: 'text',
        placeholder: 'e.g. 99.4281720 Percentile',
        required: true,
        section: 'Entrance Exam Details'
      },
      {
        id: 'f-uni-26',
        key: 'examYear',
        label: 'Entrance Examination Year',
        type: 'number',
        placeholder: '2026',
        defaultValue: 2026,
        required: true,
        section: 'Entrance Exam Details'
      },
      {
        id: 'f-uni-27',
        key: 'admitCardNumber',
        label: 'Entrance Admit Card ID',
        type: 'text',
        placeholder: 'e.g. AC-JEE-99182',
        required: false,
        section: 'Entrance Exam Details'
      },
      {
        id: 'f-uni-28',
        key: 'counsellingRoundPreference',
        label: 'Admission Counselling Round Participating In',
        type: 'select',
        required: true,
        section: 'Entrance Exam Details',
        options: [
          { label: 'Round 1 (Initial Allotment)', value: 'round_1' },
          { label: 'Round 2 (Upgradation)', value: 'round_2' },
          { label: 'Mop-up / Spot Admission Round', value: 'spot' }
        ]
      },

      // ----------------------------------------------------
      // Section 4: Course Preference (7 fields)
      // ----------------------------------------------------
      {
        id: 'f-uni-29',
        key: 'programLevel',
        label: 'Academic Degree Program Level',
        type: 'select',
        required: true,
        section: 'Course Preference',
        options: [
          { label: 'Undergraduate (B.Tech / B.Sc / B.Com / B.A / BBA - 4 Years / 3 Years)', value: 'ug' },
          { label: 'Postgraduate (M.Tech / M.Sc / MBA / MCA / M.A - 2 Years)', value: 'pg' },
          { label: 'Integrated Dual Degree (B.Tech + M.Tech / BS+MS - 5 Years)', value: 'integrated' },
          { label: 'Doctoral Research (Ph.D.)', value: 'phd' }
        ]
      },
      {
        id: 'f-uni-30',
        key: 'firstChoiceBranch',
        label: 'Primary First Choice Branch / Department',
        type: 'select',
        required: true,
        section: 'Course Preference',
        options: [
          { label: 'Computer Science & Engineering (Artificial Intelligence & ML)', value: 'cse_ai' },
          { label: 'Computer Science & Engineering (Core)', value: 'cse_core' },
          { label: 'Data Science & Big Data Analytics', value: 'data_science' },
          { label: 'Electronics & Communication Engineering (VLSI & IoT)', value: 'ece' },
          { label: 'Mechanical Engineering (Robotics & Mechatronics)', value: 'mech' },
          { label: 'Electrical & Sustainable Energy Engineering', value: 'eee' },
          { label: 'Biotechnology & Computational Biology', value: 'biotech' },
          { label: 'Business Administration (BBA Finance & Analytics)', value: 'bba' },
          { label: 'Economics & Financial Mathematics (Honors)', value: 'economics' }
        ]
      },
      {
        id: 'f-uni-31',
        key: 'secondChoiceBranch',
        label: 'Secondary Second Choice Branch',
        type: 'select',
        required: true,
        section: 'Course Preference',
        options: [
          { label: 'Computer Science & Engineering (Core)', value: 'cse_core' },
          { label: 'Data Science & Big Data Analytics', value: 'data_science' },
          { label: 'Electronics & Communication Engineering', value: 'ece' },
          { label: 'Electrical & Renewable Energy', value: 'eee' },
          { label: 'Mechanical & Automotive Systems', value: 'mech' },
          { label: 'Civil & Smart Infrastructure Engineering', value: 'civil' }
        ]
      },
      {
        id: 'f-uni-32',
        key: 'campusLocationPreference',
        label: 'Preferred University Campus Location',
        type: 'select',
        required: true,
        section: 'Course Preference',
        options: [
          { label: 'Main University Campus (North Campus / Knowledge Park)', value: 'main_campus' },
          { label: 'South Technology Campus', value: 'south_campus' },
          { label: 'City Satellite Center', value: 'city_center' }
        ]
      },
      {
        id: 'f-uni-33',
        key: 'studyMode',
        label: 'Mode of Instruction & Enrollment',
        type: 'radio',
        required: true,
        section: 'Course Preference',
        options: [
          { label: 'Full-Time Regular On-Campus Residential', value: 'full_time' },
          { label: 'Honors Degree with Industrial Co-op / Internship', value: 'honors_coop' }
        ]
      },
      {
        id: 'f-uni-34',
        key: 'minorElectiveInterests',
        label: 'Desired Minor Interdisciplinary Track',
        type: 'select',
        required: true,
        section: 'Course Preference',
        options: [
          { label: 'Artificial Intelligence & Machine Learning Minor', value: 'ai_minor' },
          { label: 'FinTech & Quantitative Economics Minor', value: 'fintech_minor' },
          { label: 'Entrepreneurship & Venture Creation Minor', value: 'startup_minor' },
          { label: 'Cybersecurity & Cloud Systems Minor', value: 'cyber_minor' }
        ]
      },
      {
        id: 'f-uni-35',
        key: 'foreignLanguageChoice',
        label: 'Foreign Language Elective Choice',
        type: 'select',
        required: true,
        section: 'Course Preference',
        options: [
          { label: 'German (Deutsch A1/A2)', value: 'german' },
          { label: 'Japanese (N5/N4)', value: 'japanese' },
          { label: 'French (Français)', value: 'french' },
          { label: 'Spanish (Español)', value: 'spanish' },
          { label: 'Mandarin Chinese', value: 'mandarin' }
        ]
      },

      // ----------------------------------------------------
      // Section 5: Hostel & Accommodation (6 fields)
      // ----------------------------------------------------
      {
        id: 'f-uni-36',
        key: 'hostelAccommodationRequired',
        label: 'Do you require On-Campus University Hostel Accommodation?',
        type: 'radio',
        required: true,
        section: 'Hostel & Accommodation',
        options: [
          { label: 'Yes - Require University Hostel Room', value: 'yes' },
          { label: 'No - Day Scholar / Local Commuter', value: 'no' }
        ]
      },
      {
        id: 'f-uni-37',
        key: 'hostelRoomPreference',
        label: 'Preferred Hostel Room Category',
        type: 'select',
        required: false,
        section: 'Hostel & Accommodation',
        options: [
          { label: 'Single Occupancy Air-Conditioned (AC with Attached Washroom)', value: 'single_ac' },
          { label: 'Twin Sharing Air-Conditioned (2 Bed AC)', value: 'twin_ac' },
          { label: 'Twin Sharing Non-AC', value: 'twin_non_ac' },
          { label: 'Triple Sharing Non-AC (Economy)', value: 'triple_non_ac' }
        ]
      },
      {
        id: 'f-uni-38',
        key: 'messDietaryPreference',
        label: 'Hostel Mess Dietary Preference',
        type: 'select',
        required: false,
        section: 'Hostel & Accommodation',
        options: [
          { label: 'Pure Vegetarian Mess (No Onion/Garlic option available)', value: 'veg' },
          { label: 'Non-Vegetarian & Continental Mess (Chicken/Fish/Eggs 4 days a week)', value: 'non_veg' },
          { label: 'Special Jain Food Counter', value: 'jain' }
        ]
      },
      {
        id: 'f-uni-39',
        key: 'localGuardianName',
        label: 'Local Guardian in City (Full Name & Contact)',
        type: 'text',
        placeholder: 'e.g. Ramesh Kumar Rai (+91 94150 12345)',
        required: false,
        section: 'Hostel & Accommodation'
      },
      {
        id: 'f-uni-40',
        key: 'dailyMedicalRequirements',
        label: 'Daily Medical Conditions or Chronic Health Needs (if any)',
        type: 'textarea',
        placeholder: 'e.g. Asthma inhaler required / Insulin dependent / None',
        required: false,
        isSensitive: true,
        section: 'Hostel & Accommodation'
      },
      {
        id: 'f-uni-41',
        key: 'busTransportRoute',
        label: 'University AC Bus Transport Route (If Day Scholar)',
        type: 'select',
        required: false,
        section: 'Hostel & Accommodation',
        options: [
          { label: 'Route 1: Noida Sector 18 / Botanical Garden - Campus', value: 'route_noida' },
          { label: 'Route 2: South Delhi (Saket / Lajpat Nagar) - Campus', value: 'route_delhi' },
          { label: 'Route 3: Gurugram (IFFCO Chowk) - Campus', value: 'route_gurgaon' },
          { label: 'Route 4: Ghaziabad / Indirapuram - Campus', value: 'route_ghaziabad' },
          { label: 'Not Required (Hostel Resident or Self Commute)', value: 'na' }
        ]
      },

      // ----------------------------------------------------
      // Section 6: Scholarship & Financial Aid (7 fields)
      // ----------------------------------------------------
      {
        id: 'f-uni-42',
        key: 'applyingForMeritScholarship',
        label: 'Applying for University Chancellor’s Merit Scholarship (Rank < 5000 / 95%+ in 12th)?',
        type: 'radio',
        required: true,
        section: 'Scholarship & Financial Aid',
        options: [
          { label: 'Yes (Eligible for 50% to 100% Tuition Fee Waiver)', value: 'yes' },
          { label: 'No', value: 'no' }
        ]
      },
      {
        id: 'f-uni-43',
        key: 'applyingForEwsNeedBasedAid',
        label: 'Applying for Need-Based Financial Aid (Family Income < ₹5 Lakhs/year)?',
        type: 'radio',
        required: true,
        section: 'Scholarship & Financial Aid',
        options: [
          { label: 'Yes - Applying for EWS / Income-concession grant', value: 'yes' },
          { label: 'No - Standard Full Fee Structure', value: 'no' }
        ]
      },
      {
        id: 'f-uni-44',
        key: 'familyAnnualGrossIncome',
        label: 'Total Cumulative Family Annual Income (INR ₹)',
        type: 'number',
        placeholder: 'e.g. 450000',
        required: true,
        isSensitive: true,
        section: 'Scholarship & Financial Aid'
      },
      {
        id: 'f-uni-45',
        key: 'parentPrimaryOccupation',
        label: "Father's / Mother's Primary Profession",
        type: 'select',
        required: true,
        section: 'Scholarship & Financial Aid',
        options: [
          { label: 'Salaried Private Sector', value: 'private' },
          { label: 'Government / Defense / PSU Service', value: 'government' },
          { label: 'Agriculture / Farmer', value: 'farmer' },
          { label: 'Self Employed / Small Business', value: 'business' },
          { label: 'Professionals (Doctor / CA / Lawyer / Professor)', value: 'professional' }
        ]
      },
      {
        id: 'f-uni-46',
        key: 'siblingStudyingInUniversity',
        label: 'Do you have a real brother/sister currently enrolled in this University (Sibling Concession)?',
        type: 'radio',
        required: true,
        section: 'Scholarship & Financial Aid',
        options: [
          { label: 'Yes (10% Sibling Fee Concession eligible)', value: 'yes' },
          { label: 'No', value: 'no' }
        ]
      },
      {
        id: 'f-uni-47',
        key: 'educationLoanAssistance',
        label: 'Do you require University Student Education Loan Assistance (SBI / HDFC Vidya Lakshmi Portal)?',
        type: 'radio',
        required: true,
        section: 'Scholarship & Financial Aid',
        options: [
          { label: 'Yes - Request Fast-track Education Loan Letter', value: 'yes' },
          { label: 'No - Self-funded / Direct Fee Payment', value: 'no' }
        ]
      },
      {
        id: 'f-uni-48',
        key: 'feePaymentSchedulePreference',
        label: 'Preferred Tuition Fee Payment Schedule',
        type: 'select',
        required: true,
        section: 'Scholarship & Financial Aid',
        options: [
          { label: 'Annual One-Time Full Payment (with 3% Early Bird Rebate)', value: 'annual' },
          { label: 'Semester-wise (2 Installments per Academic Year)', value: 'semester' },
          { label: 'Quarterly Zero-Cost EMI via Partner NBFC', value: 'quarterly_emi' }
        ]
      },

      // ----------------------------------------------------
      // Section 7: Document Uploads (8 fields)
      // ----------------------------------------------------
      {
        id: 'f-uni-49',
        key: 'docClass10thMarksheet',
        label: 'Class 10th Passing Certificate & Date of Birth Proof',
        type: 'file',
        required: true,
        section: 'Document Uploads',
        helpText: 'Official board issued marksheet & passing certificate.'
      },
      {
        id: 'f-uni-50',
        key: 'docClass12thMarksheet',
        label: 'Class 12th Board Marksheet & Statement of Marks',
        type: 'file',
        required: true,
        section: 'Document Uploads'
      },
      {
        id: 'f-uni-51',
        key: 'docEntranceScorecard',
        label: 'Entrance Examination Scorecard / Official Rank Card (JEE/NEET/CUET)',
        type: 'file',
        required: true,
        section: 'Document Uploads'
      },
      {
        id: 'f-uni-52',
        key: 'docMigrationTransferCertificate',
        label: 'School Transfer Certificate (TC) & Migration Certificate',
        type: 'file',
        required: true,
        section: 'Document Uploads'
      },
      {
        id: 'f-uni-53',
        key: 'docCharacterCertificate',
        label: 'Character Certificate from Principal of Last Attended School',
        type: 'file',
        required: true,
        section: 'Document Uploads'
      },
      {
        id: 'f-uni-54',
        key: 'docCategoryCertificate',
        label: 'Caste / Quota Certificate (for OBC-NCL / SC / ST / EWS applicants)',
        type: 'file',
        required: false,
        section: 'Document Uploads'
      },
      {
        id: 'f-uni-55',
        key: 'docAadhaarIdentity',
        label: 'Candidate Aadhaar Card Copy (Front & Back)',
        type: 'file',
        required: true,
        isSensitive: true,
        section: 'Document Uploads'
      },
      {
        id: 'f-uni-56',
        key: 'docCandidateSignature',
        label: 'Candidate Official Signature Scan',
        type: 'file',
        required: true,
        section: 'Document Uploads',
        helpText: 'Sign with blue/black ink on clean white paper.'
      },

      // ----------------------------------------------------
      // Section 8: Declaration & Undertaking (8 fields)
      // ----------------------------------------------------
      {
        id: 'f-uni-57',
        key: 'antiRaggingUndertaking',
        label: 'Anti-Ragging Undertaking (UGC Mandate): I strictly undertake that I will not engage in, abet, or propagate ragging in any form on or off campus, failing which I am liable for immediate rustication and police action.',
        type: 'checkbox',
        required: true,
        defaultValue: false,
        section: 'Declaration & Undertaking'
      },
      {
        id: 'f-uni-58',
        key: 'minimumAttendanceUndertaking',
        label: 'Minimum 75% Attendance Requirement: I agree to maintain a minimum of 75% attendance in all lectures, practical labs, and tutorials to be eligible to appear for semester end examinations.',
        type: 'checkbox',
        required: true,
        defaultValue: false,
        section: 'Declaration & Undertaking'
      },
      {
        id: 'f-uni-59',
        key: 'academicHonestyAndConduct',
        label: 'Academic Integrity & Disciplinary Code: I agree to uphold absolute academic integrity, zero plagiarism in assignments, and abide by all rules of the University Proctorial Board.',
        type: 'checkbox',
        required: true,
        defaultValue: false,
        section: 'Declaration & Undertaking'
      },
      {
        id: 'f-uni-60',
        key: 'truthfulnessAffirmation',
        label: 'Authenticity of Information: I hereby solemnly affirm that all details submitted in this admission form are true, complete, and authentic.',
        type: 'checkbox',
        required: true,
        defaultValue: false,
        section: 'Declaration & Undertaking'
      },
      {
        id: 'f-uni-61',
        key: 'candidateDigitalSign',
        label: 'Candidate Full Name (Digital Signature Affirmation)',
        type: 'text',
        placeholder: 'Type candidate full legal name',
        required: true,
        section: 'Declaration & Undertaking'
      },
      {
        id: 'f-uni-62',
        key: 'parentGuardianDigitalSign',
        label: 'Parent / Guardian Full Legal Name',
        type: 'text',
        placeholder: 'Type parent/guardian full legal name',
        required: true,
        section: 'Declaration & Undertaking'
      },
      {
        id: 'f-uni-63',
        key: 'applicationSubmissionDate',
        label: 'Date of Application Submission',
        type: 'date',
        required: true,
        section: 'Declaration & Undertaking'
      },
      {
        id: 'f-uni-64',
        key: 'universityEnrollmentReferenceId',
        label: 'University Admission Application Tracking Reference',
        type: 'text',
        placeholder: 'e.g. UNI-2026-ADM-44192',
        defaultValue: 'UNI-2026-ADM-44192',
        required: true,
        section: 'Declaration & Undertaking'
      }
    ]
  }
];

export const INITIAL_SUBMISSIONS = [
  {
    id: 'sub-demo-1',
    templateId: 'template-edu-college-admission',
    templateTitle: 'College Admission Form',
    userId: 'user-sneha-1',
    status: 'draft' as const,
    data: {
      fullName: 'Sneha Rai',
      email: 'sneha.rai@example.com',
      dob: '2004-06-15',
      phone: '+91 98765 43210',
      previousSchoolName: 'Delhi Public School, R.K. Puram',
      percentageCgpa: 94.2,
      courseApplyingFor: 'btech-ai'
    },
    completionPercentage: 80,
    lastUpdated: '2026-09-17T06:30:00.000Z',
    createdAt: '2026-09-16T11:00:00.000Z'
  },
  {
    id: 'sub-demo-2',
    templateId: 'template-job-application',
    templateTitle: 'Job Application & Tech Profile',
    userId: 'user-sneha-1',
    status: 'completed' as const,
    data: {
      fullName: 'Sneha Rai',
      email: 'sneha.work@domain.com',
      targetRole: 'staff-ai',
      yearsExperience: 4
    },
    completionPercentage: 100,
    lastUpdated: '2026-09-15T14:15:00.000Z',
    createdAt: '2026-09-15T13:45:00.000Z'
  }
];
