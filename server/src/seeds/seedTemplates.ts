export const SEED_TEMPLATES = [
  // ==========================================
  // Core Baseline Templates for Test Suites
  // ==========================================
  {
    title: 'Student Registration Form',
    slug: 'student-registration-form',
    description: 'Undergraduate and postgraduate degree enrollment form capturing academic history, merit percentage, and campus choice.',
    category: 'Education',
    status: 'published',
    icon: 'GraduationCap',
    estimatedMinutes: 5,
    fields: [
      {
        id: 'f-s-1',
        key: 'fullName',
        label: 'Full Legal Name',
        type: 'text',
        placeholder: 'e.g. Sneha Rai',
        required: true,
        helpText: 'Name as stated on your 10th/12th certificate.',
        isSensitive: false,
        order: 0
      },
      {
        id: 'f-s-2',
        key: 'email',
        label: 'Email Address',
        type: 'email',
        placeholder: 'sneha.rai@example.com',
        required: true,
        isSensitive: true,
        order: 1
      },
      {
        id: 'f-s-phone',
        key: 'phone',
        label: 'Mobile Contact Number',
        type: 'phone',
        placeholder: '+91 98765 43210',
        required: true,
        isSensitive: true,
        order: 2
      },
      {
        id: 'f-s-3',
        key: 'city',
        label: 'Residential City',
        type: 'text',
        placeholder: 'e.g. Noida / New Delhi',
        required: true,
        order: 3
      },
      {
        id: 'f-s-4',
        key: 'course',
        label: 'Course Applying For',
        type: 'select',
        required: true,
        options: [
          { label: 'B.Tech - Artificial Intelligence & Data Science', value: 'btech-ai' },
          { label: 'B.Tech - Computer Science & Engineering', value: 'btech-cse' },
          { label: 'B.Sc - Cognitive Science & Computing', value: 'bsc-cog' }
        ],
        order: 3
      },
      {
        id: 'f-s-5',
        key: 'needsHostel',
        label: 'Opt for On-Campus Hostel Accommodation',
        type: 'checkbox',
        required: false,
        defaultValue: false,
        order: 4
      },
      {
        id: 'f-s-6',
        key: 'aadharNumber',
        label: '12-Digit Aadhaar UIDAI Number',
        type: 'text',
        placeholder: '1234 5678 9012',
        required: true,
        isSensitive: true,
        validation: { min: 12, max: 16 },
        order: 5
      }
    ]
  },
  {
    title: 'Job Application & Tech Profile',
    slug: 'job-application-form',
    description: 'Fast application form for software engineers, product designers, and AI researchers.',
    category: 'Employment',
    status: 'published',
    icon: 'Briefcase',
    estimatedMinutes: 3,
    fields: [
      {
        id: 'f-j-1',
        key: 'fullName',
        label: 'Full Name',
        type: 'text',
        placeholder: 'e.g. Sneha Rai',
        required: true,
        isSensitive: false,
        order: 0
      },
      {
        id: 'f-j-2',
        key: 'email',
        label: 'Email Address',
        type: 'email',
        placeholder: 'sneha.work@domain.com',
        required: true,
        isSensitive: true,
        order: 1
      },
      {
        id: 'f-j-3',
        key: 'targetRole',
        label: 'Role Applied For',
        type: 'select',
        required: true,
        placeholder: 'Select target position',
        options: [
          { label: 'Senior Frontend Engineer (React/TypeScript)', value: 'sr-frontend' },
          { label: 'Staff AI Agent Engineer (LLMs/LangChain)', value: 'staff-ai' },
          { label: 'Fullstack Platform Engineer', value: 'fullstack' }
        ],
        order: 2
      },
      {
        id: 'f-j-4',
        key: 'yearsExperience',
        label: 'Total Years of Relevant Experience',
        type: 'number',
        placeholder: 'e.g. 5',
        required: true,
        validation: { min: 0, max: 40 },
        order: 3
      },
      {
        id: 'f-j-5',
        key: 'skills',
        label: 'Core Skills & Frameworks',
        type: 'text',
        placeholder: 'e.g. React, TypeScript, Python, Voice AI',
        required: true,
        order: 4
      },
      {
        id: 'f-j-6',
        key: 'expectedSalary',
        label: 'Expected Annual CTC (in INR Lakhs or USD)',
        type: 'number',
        placeholder: 'e.g. 3500000',
        required: false,
        isSensitive: true,
        order: 5
      },
      {
        id: 'f-j-7',
        key: 'notes',
        label: 'Cover Letter / Highlights',
        type: 'textarea',
        placeholder: 'Briefly tell us why you are excited about VoiceForm...',
        required: false,
        order: 6
      }
    ]
  },
  {
    title: 'Contact & Support Form',
    slug: 'contact-support-form',
    description: 'General inquiries and technical support ticket generation.',
    category: 'General',
    status: 'published',
    icon: 'MessageSquare',
    estimatedMinutes: 2,
    fields: [
      {
        id: 'f-c-1',
        key: 'fullName',
        label: 'Full Legal Name',
        type: 'text',
        placeholder: 'e.g. Sneha Rai',
        required: true,
        order: 0
      },
      {
        id: 'f-c-2',
        key: 'email',
        label: 'Email Address',
        type: 'email',
        placeholder: 'sneha@example.com',
        required: true,
        isSensitive: true,
        order: 1
      },
      {
        id: 'f-c-3',
        key: 'subject',
        label: 'Inquiry Subject',
        type: 'text',
        placeholder: 'e.g. Question regarding API voice integration',
        required: true,
        order: 2
      },
      {
        id: 'f-c-4',
        key: 'message',
        label: 'Message Details',
        type: 'textarea',
        placeholder: 'Please elaborate on your query...',
        required: true,
        order: 3
      }
    ]
  },

  // ==========================================
  // 1. TRAVEL (5 Templates)
  // ==========================================
  {
    title: 'Visa Application Form',
    slug: 'visa-application-form',
    description: 'Comprehensive international tourist and business visa application with passport details, itinerary, and duration.',
    category: 'Travel',
    status: 'published',
    icon: 'Plane',
    estimatedMinutes: 5,
    fields: [
      {
        id: 'f-trv-1',
        key: 'travelerFullName',
        label: 'Traveler Full Legal Name',
        type: 'text',
        placeholder: 'e.g. Sneha Rai (as on Passport)',
        required: true,
        order: 0
      },
      {
        id: 'f-trv-2',
        key: 'dob',
        label: 'Date of Birth',
        type: 'date',
        required: true,
        isSensitive: true,
        order: 1
      },
      {
        id: 'f-trv-3',
        key: 'passportNumber',
        label: 'Passport Number',
        type: 'text',
        placeholder: 'e.g. Z1234567',
        required: true,
        isSensitive: true,
        validation: { min: 6, max: 12 },
        order: 2
      },
      {
        id: 'f-trv-4',
        key: 'passportExpiryDate',
        label: 'Passport Expiry Date',
        type: 'date',
        required: true,
        order: 3
      },
      {
        id: 'f-trv-5',
        key: 'destinationCountry',
        label: 'Destination Country',
        type: 'select',
        required: true,
        options: [
          { label: 'United States of America (US)', value: 'USA' },
          { label: 'United Kingdom (UK)', value: 'UK' },
          { label: 'Schengen Area (Europe)', value: 'EU' },
          { label: 'United Arab Emirates (UAE / Dubai)', value: 'UAE' },
          { label: 'Singapore', value: 'SG' },
          { label: 'Japan', value: 'JP' }
        ],
        order: 4
      },
      {
        id: 'f-trv-6',
        key: 'visaCategory',
        label: 'Visa Purpose / Category',
        type: 'radio',
        required: true,
        options: [
          { label: 'Tourism & Holiday Visit', value: 'tourist' },
          { label: 'Business Meetings & Conference', value: 'business' },
          { label: 'Student / Academic Exchange', value: 'student' }
        ],
        order: 5
      },
      {
        id: 'f-trv-7',
        key: 'departureDate',
        label: 'Intended Date of Arrival in Destination',
        type: 'date',
        required: true,
        order: 6
      },
      {
        id: 'f-trv-8',
        key: 'returnDate',
        label: 'Intended Return Date',
        type: 'date',
        required: true,
        order: 7
      },
      {
        id: 'f-trv-9',
        key: 'stayDurationDays',
        label: 'Planned Duration of Stay (in Days)',
        type: 'number',
        placeholder: 'e.g. 15',
        required: true,
        validation: { min: 1, max: 365 },
        order: 8
      },
      {
        id: 'f-trv-10',
        key: 'accommodationAddress',
        label: 'Hotel / Accommodation Address in Destination',
        type: 'textarea',
        placeholder: 'Hotel Name, Street Address, City, Postal Code',
        required: true,
        order: 9
      }
    ]
  },
  {
    title: 'Passport Renewal Form',
    slug: 'passport-renewal-form',
    description: 'Fast-track application for passport reissue, booklet renewals, and address corrections.',
    category: 'Travel',
    status: 'published',
    icon: 'FileBadge',
    estimatedMinutes: 4,
    fields: [
      {
        id: 'f-pr-1',
        key: 'applicantFullName',
        label: 'Applicant Full Legal Name',
        type: 'text',
        placeholder: 'Name as registered on previous passport',
        required: true,
        order: 0
      },
      {
        id: 'f-pr-2',
        key: 'existingPassportNumber',
        label: 'Existing / Expired Passport Number',
        type: 'text',
        placeholder: 'e.g. A9876543',
        required: true,
        isSensitive: true,
        order: 1
      },
      {
        id: 'f-pr-3',
        key: 'passportExpiryDate',
        label: 'Date of Expiry of Current Passport',
        type: 'date',
        required: true,
        order: 2
      },
      {
        id: 'f-pr-4',
        key: 'renewalReason',
        label: 'Reason for Passport Renewal / Re-issue',
        type: 'select',
        required: true,
        options: [
          { label: 'Validity Expired within 3 Years / Due to Expire', value: 'validity-expired' },
          { label: 'Exhaustion of Visa Pages', value: 'pages-exhausted' },
          { label: 'Change in Existing Personal Particulars (Address/Surname)', value: 'particulars-change' },
          { label: 'Lost / Stolen / Damaged Passport', value: 'damaged-lost' }
        ],
        order: 3
      },
      {
        id: 'f-pr-5',
        key: 'residentialAddress',
        label: 'Present Residential Address for Police Verification',
        type: 'textarea',
        placeholder: 'House No, Landmark, Police Station, City, State, Pincode',
        required: true,
        isSensitive: true,
        order: 4
      }
    ]
  },
  {
    title: 'Travel Insurance Application',
    slug: 'travel-insurance-application',
    description: 'Medical and baggage emergency coverage for domestic and international overseas travel.',
    category: 'Travel',
    status: 'published',
    icon: 'ShieldCheck',
    estimatedMinutes: 4,
    fields: [
      {
        id: 'f-ti-1',
        key: 'primaryInsuredName',
        label: 'Primary Insured Person Name',
        type: 'text',
        placeholder: 'e.g. Sneha Rai',
        required: true,
        order: 0
      },
      {
        id: 'f-ti-2',
        key: 'dob',
        label: 'Date of Birth',
        type: 'date',
        required: true,
        isSensitive: true,
        order: 1
      },
      {
        id: 'f-ti-3',
        key: 'travelDestination',
        label: 'Travel Geographical Region',
        type: 'select',
        required: true,
        options: [
          { label: 'Worldwide (Including USA & Canada)', value: 'worldwide-inc-usa' },
          { label: 'Worldwide (Excluding USA & Canada)', value: 'worldwide-exc-usa' },
          { label: 'Domestic Travel (Within India)', value: 'domestic' }
        ],
        order: 2
      },
      {
        id: 'f-ti-4',
        key: 'policyPlanType',
        label: 'Coverage Plan Level',
        type: 'radio',
        required: true,
        options: [
          { label: 'Silver Plan ($50,000 Medical Sum Insured)', value: 'silver-50k' },
          { label: 'Gold Plan ($100,000 Medical + Flight Delay)', value: 'gold-100k' }
        ],
        order: 3
      },
      {
        id: 'f-ti-5',
        key: 'totalTripCost',
        label: 'Estimated Non-Refundable Trip Cost (INR)',
        type: 'number',
        placeholder: 'e.g. 150000',
        required: true,
        order: 4
      }
    ]
  },
  {
    title: 'Hotel Booking Request Form',
    slug: 'hotel-booking-request-form',
    description: 'Direct guest accommodation reservation, check-in schedules, room preferences, and special services.',
    category: 'Travel',
    status: 'published',
    icon: 'Building',
    estimatedMinutes: 3,
    fields: [
      {
        id: 'f-hb-1',
        key: 'guestFullName',
        label: 'Lead Guest Full Name',
        type: 'text',
        placeholder: 'e.g. Sneha Rai',
        required: true,
        order: 0
      },
      {
        id: 'f-hb-2',
        key: 'email',
        label: 'Confirmation Email Address',
        type: 'email',
        placeholder: 'sneha@example.com',
        required: true,
        isSensitive: true,
        order: 1
      },
      {
        id: 'f-hb-3',
        key: 'checkInDate',
        label: 'Check-in Date',
        type: 'date',
        required: true,
        order: 2
      },
      {
        id: 'f-hb-4',
        key: 'roomType',
        label: 'Room Category Preference',
        type: 'radio',
        required: true,
        options: [
          { label: 'Deluxe King Bed Room', value: 'deluxe-king' },
          { label: 'Executive Twin Bed Suite', value: 'exec-twin' }
        ],
        order: 3
      }
    ]
  },
  {
    title: 'International Tour Package Enquiry',
    slug: 'international-tour-package-enquiry',
    description: 'Custom holiday packages, group tours, sightseeing itineraries, and travel budget preferences.',
    category: 'Travel',
    status: 'published',
    icon: 'Compass',
    estimatedMinutes: 3,
    fields: [
      {
        id: 'f-tp-1',
        key: 'leadTravelerName',
        label: 'Lead Traveler / Group Coordinator Name',
        type: 'text',
        placeholder: 'e.g. Sneha Rai',
        required: true,
        order: 0
      },
      {
        id: 'f-tp-2',
        key: 'email',
        label: 'Email Address for Itinerary Quote',
        type: 'email',
        placeholder: 'travel@example.com',
        required: true,
        isSensitive: true,
        order: 1
      },
      {
        id: 'f-tp-3',
        key: 'preferredDestination',
        label: 'Dream Holiday Destination',
        type: 'select',
        required: true,
        options: [
          { label: 'Switzerland Alps & Scenic Europe', value: 'europe-alps' },
          { label: 'Dubai Ultra-Luxury & Desert Safari', value: 'dubai-luxury' }
        ],
        order: 2
      }
    ]
  },

  // ==========================================
  // 2. LEGAL (5 Templates)
  // ==========================================
  {
    title: 'Affidavit Form',
    slug: 'affidavit-form',
    description: 'Legal sworn affidavit format for name change, identity declaration, and notary authentication.',
    category: 'Legal',
    status: 'published',
    icon: 'Scale',
    estimatedMinutes: 3,
    fields: [
      {
        id: 'f-leg-1',
        key: 'deponentName',
        label: 'Current Legal Name of Deponent (Applicant)',
        type: 'text',
        placeholder: 'e.g. Sneha Rai',
        required: true,
        order: 0
      },
      {
        id: 'f-leg-2',
        key: 'fathersOrSpouseName',
        label: "Father's or Spouse's Full Name",
        type: 'text',
        placeholder: 'e.g. Rajesh Kumar Rai',
        required: true,
        order: 1
      },
      {
        id: 'f-leg-3',
        key: 'reasonForDeclaration',
        label: 'Reason for Legal Affidavit / Declaration',
        type: 'select',
        required: true,
        options: [
          { label: 'Name Correction / Spelling Rectification in Certificates', value: 'correction' },
          { label: 'Post-Marriage Surname Change', value: 'marriage-change' }
        ],
        order: 2
      },
      {
        id: 'f-leg-4',
        key: 'residenceAddress',
        label: 'Permanent Place of Residence',
        type: 'textarea',
        placeholder: 'Complete residential address, district, state, pincode',
        required: true,
        isSensitive: true,
        order: 3
      }
    ]
  },
  {
    title: 'Power of Attorney Request',
    slug: 'power-of-attorney-request',
    description: 'Formal grant of legal authority to execute property, banking, or business transactions.',
    category: 'Legal',
    status: 'published',
    icon: 'FileSignature',
    estimatedMinutes: 5,
    fields: [
      {
        id: 'f-poa-1',
        key: 'grantorFullName',
        label: 'Principal (Grantor) Full Name',
        type: 'text',
        placeholder: 'Person granting authority',
        required: true,
        order: 0
      },
      {
        id: 'f-poa-2',
        key: 'attorneyFullName',
        label: 'Appointed Attorney (Agent) Full Name',
        type: 'text',
        placeholder: 'Person receiving legal powers',
        required: true,
        order: 1
      },
      {
        id: 'f-poa-3',
        key: 'poaCategory',
        label: 'Power of Attorney Type',
        type: 'radio',
        required: true,
        options: [
          { label: 'General Power of Attorney (GPA)', value: 'gpa' },
          { label: 'Special Power of Attorney (SPA)', value: 'spa' }
        ],
        order: 2
      }
    ]
  },
  {
    title: 'NOC (No Objection Certificate) Application',
    slug: 'noc-application-form',
    description: 'Application for obtaining official NOC for property transfer, vehicle migration, or employment.',
    category: 'Legal',
    status: 'published',
    icon: 'FileCheck',
    estimatedMinutes: 3,
    fields: [
      {
        id: 'f-noc-1',
        key: 'applicantName',
        label: 'Applicant Full Legal Name',
        type: 'text',
        placeholder: 'e.g. Sneha Rai',
        required: true,
        order: 0
      },
      {
        id: 'f-noc-2',
        key: 'purposeOfNoc',
        label: 'Purpose of Obtaining NOC',
        type: 'textarea',
        placeholder: 'State why NOC is required and where it will be submitted...',
        required: true,
        order: 1
      }
    ]
  },
  {
    title: 'Rental/Lease Agreement Form',
    slug: 'rental-lease-agreement-form',
    description: 'Comprehensive landlord-tenant tenancy agreement covering rent, security deposit, and tenancy rules.',
    category: 'Legal',
    status: 'published',
    icon: 'Building2',
    estimatedMinutes: 4,
    fields: [
      {
        id: 'f-ra-1',
        key: 'tenantName',
        label: 'Primary Tenant Full Legal Name',
        type: 'text',
        placeholder: 'e.g. Sneha Rai',
        required: true,
        order: 0
      },
      {
        id: 'f-ra-2',
        key: 'landlordName',
        label: 'Property Owner (Landlord) Full Legal Name',
        type: 'text',
        placeholder: 'e.g. Rajesh Kumar Sharma',
        required: true,
        order: 1
      },
      {
        id: 'f-ra-3',
        key: 'monthlyRent',
        label: 'Agreed Monthly Rent Amount (INR)',
        type: 'number',
        placeholder: 'e.g. 32000',
        required: true,
        order: 2
      }
    ]
  },
  {
    title: 'Legal Consultation Booking',
    slug: 'legal-consultation-booking',
    description: 'Schedule a confidential consultation with certified advocates across civil, corporate, and criminal law.',
    category: 'Legal',
    status: 'published',
    icon: 'Scale',
    estimatedMinutes: 3,
    fields: [
      {
        id: 'f-lc-1',
        key: 'clientName',
        label: 'Client Full Name',
        type: 'text',
        placeholder: 'e.g. Sneha Rai',
        required: true,
        order: 0
      },
      {
        id: 'f-lc-2',
        key: 'email',
        label: 'Confidential Email Address',
        type: 'email',
        placeholder: 'client@example.com',
        required: true,
        isSensitive: true,
        order: 1
      },
      {
        id: 'f-lc-3',
        key: 'matterSummary',
        label: 'Brief Summary of Legal Dispute',
        type: 'textarea',
        placeholder: 'Summarize key facts...',
        required: true,
        order: 2
      }
    ]
  },

  // ==========================================
  // 3. REAL ESTATE (5 Templates)
  // ==========================================
  {
    title: 'Property Registration Form',
    slug: 'property-registration-form',
    description: 'Official registry recording sale deed, buyer-seller particulars, stamp duty, and property dimensions.',
    category: 'Real Estate',
    status: 'published',
    icon: 'Landmark',
    estimatedMinutes: 5,
    fields: [
      {
        id: 'f-prg-1',
        key: 'buyerFullName',
        label: 'Buyer (Purchaser) Full Legal Name',
        type: 'text',
        placeholder: 'e.g. Sneha Rai',
        required: true,
        order: 0
      },
      {
        id: 'f-prg-2',
        key: 'sellerFullName',
        label: 'Seller (Vendor) Full Legal Name',
        type: 'text',
        placeholder: 'e.g. Apex Builders Pvt Ltd',
        required: true,
        order: 1
      },
      {
        id: 'f-prg-3',
        key: 'totalSaleValueINR',
        label: 'Total Sale Consideration Value (INR)',
        type: 'number',
        placeholder: 'e.g. 9500000',
        required: true,
        order: 2
      }
    ]
  },
  {
    title: 'Home Loan Application',
    slug: 'home-loan-application',
    description: 'Mortgage financing and home loan assessment with property valuation and income verification.',
    category: 'Real Estate',
    status: 'published',
    icon: 'BadgeDollarSign',
    estimatedMinutes: 4,
    fields: [
      {
        id: 'f-hl-1',
        key: 'applicantName',
        label: 'Borrower Full Legal Name',
        type: 'text',
        placeholder: 'e.g. Sneha Rai',
        required: true,
        order: 0
      },
      {
        id: 'f-hl-2',
        key: 'netMonthlySalary',
        label: 'Net In-hand Monthly Income (INR)',
        type: 'number',
        placeholder: 'e.g. 140000',
        required: true,
        isSensitive: true,
        order: 1
      },
      {
        id: 'f-hl-3',
        key: 'requestedLoanAmount',
        label: 'Requested Home Loan Amount (INR)',
        type: 'number',
        placeholder: 'e.g. 6500000',
        required: true,
        order: 2
      }
    ]
  },
  {
    title: 'Rental Property Listing Form',
    slug: 'rental-property-listing-form',
    description: 'Publish your vacant apartment, villa, or commercial space for prospective verified tenants.',
    category: 'Real Estate',
    status: 'published',
    icon: 'Building2',
    estimatedMinutes: 3,
    fields: [
      {
        id: 'f-rpl-1',
        key: 'ownerFullName',
        label: 'Property Owner / Agent Full Name',
        type: 'text',
        placeholder: 'e.g. Sneha Rai',
        required: true,
        order: 0
      },
      {
        id: 'f-rpl-2',
        key: 'listingTitle',
        label: 'Listing Catchy Title',
        type: 'text',
        placeholder: 'e.g. Luxurious 3BHK in Cyber City',
        required: true,
        order: 1
      },
      {
        id: 'f-rpl-3',
        key: 'expectedMonthlyRent',
        label: 'Expected Monthly Rent (INR)',
        type: 'number',
        placeholder: 'e.g. 45000',
        required: true,
        order: 2
      }
    ]
  },
  {
    title: 'Property Site Visit Request',
    slug: 'property-site-visit-request',
    description: 'Schedule an on-site physical tour or virtual walkthrough for residential and commercial projects.',
    category: 'Real Estate',
    status: 'published',
    icon: 'Building',
    estimatedMinutes: 2,
    fields: [
      {
        id: 'f-sv-1',
        key: 'visitorName',
        label: 'Visitor Full Name',
        type: 'text',
        placeholder: 'e.g. Sneha Rai',
        required: true,
        order: 0
      },
      {
        id: 'f-sv-2',
        key: 'contactNumber',
        label: 'Mobile Contact Number',
        type: 'phone',
        placeholder: '+91 98765 43210',
        required: true,
        isSensitive: true,
        order: 1
      }
    ]
  },
  {
    title: 'Tenant Verification Form',
    slug: 'tenant-verification-form',
    description: 'Mandatory police and landlord tenant screening capturing background, employment, and ID proofs.',
    category: 'Real Estate',
    status: 'published',
    icon: 'UserCheck',
    estimatedMinutes: 4,
    fields: [
      {
        id: 'f-tv-1',
        key: 'tenantFullName',
        label: 'Tenant Full Name',
        type: 'text',
        placeholder: 'e.g. Sneha Rai',
        required: true,
        order: 0
      },
      {
        id: 'f-tv-2',
        key: 'aadhaarNumber',
        label: 'Tenant Aadhaar / National ID Number',
        type: 'text',
        placeholder: '12-digit UIDAI Number',
        required: true,
        isSensitive: true,
        validation: { min: 12, max: 16 },
        order: 1
      }
    ]
  },

  // ==========================================
  // 4. FINANCE (5 Templates)
  // ==========================================
  {
    title: 'Bank Account Opening Form',
    slug: 'bank-account-opening-form',
    description: 'Savings and current account opening with KYC verification, debit card, and digital banking requests.',
    category: 'Finance',
    status: 'published',
    icon: 'Landmark',
    estimatedMinutes: 5,
    fields: [
      {
        id: 'f-ba-1',
        key: 'applicantFullName',
        label: 'Applicant Full Legal Name',
        type: 'text',
        placeholder: 'As per Aadhaar and PAN records',
        required: true,
        order: 0
      },
      {
        id: 'f-ba-2',
        key: 'panNumber',
        label: 'PAN Card Number',
        type: 'text',
        placeholder: 'ABCDE1234F',
        required: true,
        isSensitive: true,
        validation: { min: 10, max: 10 },
        order: 1
      },
      {
        id: 'f-ba-3',
        key: 'initialDepositAmount',
        label: 'Initial Opening Deposit Amount (INR)',
        type: 'number',
        placeholder: 'e.g. 10000',
        required: true,
        order: 2
      }
    ]
  },
  {
    title: 'Personal Loan Application',
    slug: 'personal-loan-application',
    description: 'Instant collateral-free personal loan evaluation with interest rate and tenure customization.',
    category: 'Finance',
    status: 'published',
    icon: 'BadgeDollarSign',
    estimatedMinutes: 4,
    fields: [
      {
        id: 'f-pl-1',
        key: 'applicantName',
        label: 'Borrower Full Name',
        type: 'text',
        placeholder: 'e.g. Sneha Rai',
        required: true,
        order: 0
      },
      {
        id: 'f-pl-2',
        key: 'monthlyNetSalary',
        label: 'Net Monthly In-Hand Salary (INR)',
        type: 'number',
        placeholder: 'e.g. 85000',
        required: true,
        isSensitive: true,
        order: 1
      },
      {
        id: 'f-pl-3',
        key: 'desiredLoanAmount',
        label: 'Requested Loan Amount (INR)',
        type: 'number',
        placeholder: 'e.g. 500000',
        required: true,
        order: 2
      }
    ]
  },
  {
    title: 'Insurance Claim Form',
    slug: 'insurance-claim-form',
    description: 'File a reimbursement or cashless settlement claim for health, motor, or life insurance incidents.',
    category: 'Finance',
    status: 'published',
    icon: 'ShieldCheck',
    estimatedMinutes: 5,
    fields: [
      {
        id: 'f-ic-1',
        key: 'policyHolderName',
        label: 'Primary Policyholder Full Name',
        type: 'text',
        placeholder: 'e.g. Sneha Rai',
        required: true,
        order: 0
      },
      {
        id: 'f-ic-2',
        key: 'policyNumber',
        label: 'Insurance Policy Number',
        type: 'text',
        placeholder: 'e.g. POL-88992314-2026',
        required: true,
        isSensitive: true,
        order: 1
      },
      {
        id: 'f-ic-3',
        key: 'totalClaimAmountINR',
        label: 'Total Claimed Amount (INR)',
        type: 'number',
        placeholder: 'e.g. 125000',
        required: true,
        order: 2
      }
    ]
  },
  {
    title: 'Credit Card Application',
    slug: 'credit-card-application',
    description: 'Apply for premium rewards, cashback, and travel credit cards with instant eligibility check.',
    category: 'Finance',
    status: 'published',
    icon: 'CreditCard',
    estimatedMinutes: 4,
    fields: [
      {
        id: 'f-cc-1',
        key: 'applicantName',
        label: 'Applicant Full Name',
        type: 'text',
        placeholder: 'e.g. Sneha Rai',
        required: true,
        order: 0
      },
      {
        id: 'f-cc-2',
        key: 'annualGrossIncome',
        label: 'Annual Gross Income (INR)',
        type: 'number',
        placeholder: 'e.g. 1800000',
        required: true,
        isSensitive: true,
        order: 1
      }
    ]
  },
  {
    title: 'Investment/Mutual Fund Enquiry',
    slug: 'investment-mutual-fund-enquiry',
    description: 'Personalized portfolio allocation, SIP planning, equity mutual funds, and wealth management consult.',
    category: 'Finance',
    status: 'published',
    icon: 'BadgeDollarSign',
    estimatedMinutes: 3,
    fields: [
      {
        id: 'f-ie-1',
        key: 'investorName',
        label: 'Investor Full Name',
        type: 'text',
        placeholder: 'e.g. Sneha Rai',
        required: true,
        order: 0
      },
      {
        id: 'f-ie-2',
        key: 'monthlySipBudget',
        label: 'Planned Monthly SIP Amount (INR)',
        type: 'number',
        placeholder: 'e.g. 25000',
        required: true,
        order: 1
      }
    ]
  },

  // ==========================================
  // 5. GOVERNMENT (5 Templates)
  // ==========================================
  {
    title: 'Aadhar Card Update Form',
    slug: 'aadhar-card-update-form',
    description: 'Official UIDAI update request for mobile number, address change, biometric, or name correction.',
    category: 'Government',
    status: 'published',
    icon: 'ShieldCheck',
    estimatedMinutes: 4,
    fields: [
      {
        id: 'f-au-1',
        key: 'residentFullName',
        label: 'Resident Full Name',
        type: 'text',
        placeholder: 'Name as on Aadhaar card',
        required: true,
        order: 0
      },
      {
        id: 'f-au-2',
        key: 'aadhaarNumber',
        label: '12-Digit Existing Aadhaar Number',
        type: 'text',
        placeholder: '1234 5678 9012',
        required: true,
        isSensitive: true,
        validation: { min: 12, max: 16 },
        order: 1
      }
    ]
  },
  {
    title: 'Ration Card Application',
    slug: 'ration-card-application',
    description: 'NFSA Public Distribution System subsidized ration card issuance for family units.',
    category: 'Government',
    status: 'published',
    icon: 'Receipt',
    estimatedMinutes: 4,
    fields: [
      {
        id: 'f-rc-1',
        key: 'headOfFamilyName',
        label: 'Head of Family Full Name',
        type: 'text',
        placeholder: 'e.g. Smt. Sunita Rai',
        required: true,
        order: 0
      },
      {
        id: 'f-rc-2',
        key: 'annualFamilyIncome',
        label: 'Total Annual Gross Family Income (INR)',
        type: 'number',
        placeholder: 'e.g. 180000',
        required: true,
        isSensitive: true,
        order: 1
      }
    ]
  },
  {
    title: 'Birth Certificate Application',
    slug: 'birth-certificate-application',
    description: 'Civil registration request for official municipal birth certificate issuance.',
    category: 'Government',
    status: 'published',
    icon: 'Award',
    estimatedMinutes: 3,
    fields: [
      {
        id: 'f-bc-1',
        key: 'childFullName',
        label: 'Child Full Legal Name',
        type: 'text',
        placeholder: 'e.g. Aarav Rai',
        required: true,
        order: 0
      },
      {
        id: 'f-bc-2',
        key: 'dateOfBirth',
        label: 'Date of Birth',
        type: 'date',
        required: true,
        order: 1
      }
    ]
  },
  {
    title: 'Voter ID Registration',
    slug: 'voter-id-registration',
    description: 'Form 6 application for new voter card registration and inclusion in electoral roll.',
    category: 'Government',
    status: 'published',
    icon: 'UserCheck',
    estimatedMinutes: 4,
    fields: [
      {
        id: 'f-vid-1',
        key: 'applicantName',
        label: 'Applicant Full Legal Name',
        type: 'text',
        placeholder: 'e.g. Sneha Rai',
        required: true,
        order: 0
      },
      {
        id: 'f-vid-2',
        key: 'dob',
        label: 'Date of Birth',
        type: 'date',
        required: true,
        isSensitive: true,
        order: 1
      }
    ]
  },
  {
    title: 'Income Certificate Request',
    slug: 'income-certificate-request',
    description: 'Revenue department certification of annual personal and household income.',
    category: 'Government',
    status: 'published',
    icon: 'Landmark',
    estimatedMinutes: 3,
    fields: [
      {
        id: 'f-inc-1',
        key: 'applicantName',
        label: 'Applicant Full Name',
        type: 'text',
        placeholder: 'e.g. Sneha Rai',
        required: true,
        order: 0
      },
      {
        id: 'f-inc-2',
        key: 'annualGrossIncome',
        label: 'Total Annual Gross Income (INR)',
        type: 'number',
        placeholder: 'e.g. 240000',
        required: true,
        isSensitive: true,
        order: 1
      }
    ]
  },

  // ==========================================
  // 6. EVENTS (5 Templates)
  // ==========================================
  {
    title: 'Wedding Invitation RSVP Form',
    slug: 'wedding-invitation-rsvp-form',
    description: 'Guest attendance confirmation, party headcounts, food preferences, and hospitality requests.',
    category: 'Events',
    status: 'published',
    icon: 'Sparkles',
    estimatedMinutes: 2,
    fields: [
      {
        id: 'f-w-1',
        key: 'guestFullName',
        label: 'Guest Full Name',
        type: 'text',
        placeholder: 'e.g. Sneha Rai',
        required: true,
        order: 0
      },
      {
        id: 'f-w-2',
        key: 'totalGuestsAttending',
        label: 'Total Guests Attending',
        type: 'number',
        placeholder: 'e.g. 2',
        required: true,
        order: 1
      }
    ]
  },
  {
    title: 'Conference Registration Form',
    slug: 'conference-registration-form',
    description: 'Global conference delegate registration, badge credentials, and track workshops.',
    category: 'Events',
    status: 'published',
    icon: 'Sparkles',
    estimatedMinutes: 3,
    fields: [
      {
        id: 'f-cr-1',
        key: 'attendeeName',
        label: 'Attendee Full Name',
        type: 'text',
        placeholder: 'e.g. Sneha Rai',
        required: true,
        order: 0
      },
      {
        id: 'f-cr-2',
        key: 'organization',
        label: 'Company / Institution Name',
        type: 'text',
        placeholder: 'e.g. Google Cloud',
        required: true,
        order: 1
      }
    ]
  },
  {
    title: 'Workshop/Webinar Signup',
    slug: 'workshop-webinar-signup',
    description: 'Interactive masterclass enrollment, skill training webinar registration, and attendee QA.',
    category: 'Events',
    status: 'published',
    icon: 'Calendar',
    estimatedMinutes: 2,
    fields: [
      {
        id: 'f-ws-1',
        key: 'participantName',
        label: 'Participant Full Name',
        type: 'text',
        placeholder: 'e.g. Sneha Rai',
        required: true,
        order: 0
      },
      {
        id: 'f-ws-2',
        key: 'email',
        label: 'Email Address',
        type: 'email',
        placeholder: 'sneha@learning.dev',
        required: true,
        isSensitive: true,
        order: 1
      }
    ]
  },
  {
    title: 'Event Vendor Booking Form',
    slug: 'event-vendor-booking-form',
    description: 'Vendor contracting and service agreement for catering, sound & lights, photography, and decor.',
    category: 'Events',
    status: 'published',
    icon: 'Building',
    estimatedMinutes: 4,
    fields: [
      {
        id: 'f-vb-1',
        key: 'vendorCompanyName',
        label: 'Vendor Business Name',
        type: 'text',
        placeholder: 'e.g. Luminary Stage',
        required: true,
        order: 0
      },
      {
        id: 'f-vb-2',
        key: 'totalQuotedFeeINR',
        label: 'Total Quoted Service Fee (INR)',
        type: 'number',
        placeholder: 'e.g. 180000',
        required: true,
        order: 1
      }
    ]
  },
  {
    title: 'Volunteer Registration Form',
    slug: 'volunteer-registration-form',
    description: 'Community and festival volunteer enrollment, shift availability, and role preferences.',
    category: 'Events',
    status: 'published',
    icon: 'Users',
    estimatedMinutes: 3,
    fields: [
      {
        id: 'f-vr-1',
        key: 'volunteerFullName',
        label: 'Volunteer Full Name',
        type: 'text',
        placeholder: 'e.g. Sneha Rai',
        required: true,
        order: 0
      },
      {
        id: 'f-vr-2',
        key: 'phone',
        label: 'Emergency Mobile Number',
        type: 'phone',
        placeholder: '+91 98765 43210',
        required: true,
        isSensitive: true,
        order: 1
      }
    ]
  },
  {
    title: 'Government Scheme Application Form (Detailed)',
    slug: 'government-scheme-application-form-detailed',
    description: 'Comprehensive national welfare & Direct Benefit Transfer (DBT) scheme application covering identity, socio-economic household profile, education, banking, and document verification.',
    category: 'Government',
    status: 'published',
    icon: 'Landmark',
    estimatedMinutes: 20,
    fields: [
      {
        id: 'f-gov-1',
        key: 'fullName',
        label: 'Full Legal Name',
        type: 'text',
        placeholder: 'e.g. Sneha Kumari Rai',
        required: true,
        section: 'Personal Details',
        isSensitive: false,
        order: 0
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
        order: 1
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
        order: 2
      },
      {
        id: 'f-gov-13',
        key: 'primaryMobile',
        label: 'Primary Mobile Number (Aadhaar-Linked)',
        type: 'phone',
        placeholder: '+91 98765 43210',
        required: true,
        isSensitive: true,
        section: 'Contact Details',
        order: 3
      },
      {
        id: 'f-gov-15',
        key: 'emailAddress',
        label: 'Applicant Email Address',
        type: 'email',
        placeholder: 'applicant@domain.com',
        required: true,
        isSensitive: true,
        section: 'Contact Details',
        order: 4
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
        order: 5
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
        order: 6
      }
    ]
  },
  {
    title: 'Home Loan Application (Detailed)',
    slug: 'home-loan-application-detailed',
    description: 'Comprehensive housing finance application capturing applicant profile, co-borrower credentials, income verification, property assessment, existing liabilities, and collateral records.',
    category: 'Finance',
    status: 'published',
    icon: 'Landmark',
    estimatedMinutes: 18,
    fields: [
      {
        id: 'f-hl-1',
        key: 'primaryApplicantName',
        label: 'Primary Applicant Full Legal Name',
        type: 'text',
        placeholder: 'e.g. Sneha Kumari Rai',
        required: true,
        section: 'Applicant Personal Details',
        isSensitive: false,
        order: 0
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
        order: 1
      },
      {
        id: 'f-hl-24',
        key: 'grossMonthlyIncome',
        label: 'Gross Monthly Salary / Inflow (INR ₹)',
        type: 'number',
        placeholder: 'e.g. 185000',
        required: true,
        isSensitive: true,
        section: 'Employment & Income Details',
        order: 2
      },
      {
        id: 'f-hl-33',
        key: 'propertyTotalValue',
        label: 'Total Agreed Agreement / Market Value (INR ₹)',
        type: 'number',
        placeholder: 'e.g. 9500000',
        required: true,
        section: 'Property Details',
        order: 3
      },
      {
        id: 'f-hl-47',
        key: 'loanAmountRequested',
        label: 'Home Loan Amount Requested (INR ₹)',
        type: 'number',
        placeholder: 'e.g. 7500000',
        required: true,
        section: 'Bank & Collateral Details',
        order: 4
      }
    ]
  },
  {
    title: 'Property Sale Deed Form (Detailed)',
    slug: 'property-sale-deed-form-detailed',
    description: 'Comprehensive legal conveyance deed for registration of immovable property ownership transfer with detailed buyer, seller, schedule of property, consideration, stamp duty, and witness records.',
    category: 'Legal',
    status: 'published',
    icon: 'Scale',
    estimatedMinutes: 16,
    fields: [
      {
        id: 'f-sd-1',
        key: 'buyerFullName',
        label: 'Buyer (Purchaser) Full Legal Name',
        type: 'text',
        placeholder: 'e.g. Sneha Kumari Rai',
        required: true,
        section: 'Buyer Details',
        order: 0
      },
      {
        id: 'f-sd-9',
        key: 'sellerFullName',
        label: 'Seller (Vendor) Full Legal Name',
        type: 'text',
        placeholder: 'e.g. Rajesh Vikramaditya Sharma',
        required: true,
        section: 'Seller Details',
        order: 1
      },
      {
        id: 'f-sd-27',
        key: 'totalSaleConsideration',
        label: 'Total Agreed Sale Consideration Amount (INR ₹)',
        type: 'number',
        placeholder: 'e.g. 8500000',
        required: true,
        isSensitive: true,
        section: 'Payment & Transaction Details',
        order: 2
      }
    ]
  },
  {
    title: 'Employee Onboarding Form (Detailed)',
    slug: 'employee-onboarding-form-detailed',
    description: 'Complete new hire corporate onboarding dossier covering personal KYC, emergency contacts, payroll banking, prior employment history, education records, health insurance, and NDA compliance.',
    category: 'Employment',
    status: 'published',
    icon: 'Briefcase',
    estimatedMinutes: 18,
    fields: [
      {
        id: 'f-onb-1',
        key: 'fullLegalName',
        label: 'Full Legal Name (as per PAN Card)',
        type: 'text',
        placeholder: 'e.g. Sneha Kumari Rai',
        required: true,
        section: 'Personal Details',
        order: 0
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
        order: 1
      },
      {
        id: 'f-onb-20',
        key: 'salaryAccountNumber',
        label: 'Salary Bank Account Number',
        type: 'text',
        placeholder: 'e.g. 50100492817261',
        required: true,
        isSensitive: true,
        section: 'Bank & Salary Details',
        order: 2
      }
    ]
  },
  {
    title: 'Property Listing Form (Detailed)',
    slug: 'property-listing-form-detailed',
    description: 'Comprehensive property listing dossier for premium sales, rental mandates, specifications, architectural amenities, legal documents, pricing terms, and photographic exhibits.',
    category: 'Real Estate',
    status: 'published',
    icon: 'Building2',
    estimatedMinutes: 15,
    fields: [
      {
        id: 'f-pl-1',
        key: 'ownerFullName',
        label: 'Property Owner / Representative Full Name',
        type: 'text',
        placeholder: 'e.g. Sneha Kumari Rai',
        required: true,
        section: 'Owner Details',
        order: 0
      },
      {
        id: 'f-pl-18',
        key: 'societyProjectName',
        label: 'Society / Tower / Project Name',
        type: 'text',
        placeholder: 'e.g. ATS Greens Village',
        required: true,
        section: 'Location Details',
        order: 1
      },
      {
        id: 'f-pl-41',
        key: 'expectedAskingPrice',
        label: 'Expected Asking Price / Monthly Rent (INR ₹)',
        type: 'number',
        placeholder: 'e.g. 12500000',
        required: true,
        section: 'Pricing & Payment Terms',
        order: 2
      }
    ]
  },
  {
    title: 'University Admission Form (Detailed)',
    slug: 'university-admission-form-detailed',
    description: 'Comprehensive undergraduate & postgraduate university admissions dossier capturing candidate identity, academic transcripts, entrance exam ranks, departmental preferences, hostel requests, and scholarships.',
    category: 'Education',
    status: 'published',
    icon: 'GraduationCap',
    estimatedMinutes: 18,
    fields: [
      {
        id: 'f-uni-1',
        key: 'candidateFullName',
        label: 'Candidate Full Legal Name',
        type: 'text',
        placeholder: 'e.g. Sneha Kumari Rai',
        required: true,
        section: 'Personal Details',
        order: 0
      },
      {
        id: 'f-uni-21',
        key: 'entranceExamType',
        label: 'Entrance Examination Appeared',
        type: 'select',
        required: true,
        section: 'Entrance Exam Details',
        order: 1
      },
      {
        id: 'f-uni-23',
        key: 'allIndiaRankAir',
        label: 'All India Rank (AIR)',
        type: 'number',
        placeholder: 'e.g. 3412',
        required: true,
        section: 'Entrance Exam Details',
        order: 2
      }
    ]
  }
];


