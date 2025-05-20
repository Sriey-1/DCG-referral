
// Mock data for the application
export const mockReferrals = [
  {
    id: '1',
    referring_company: 'Dubai Properties',
    client_name: 'Ahmed Al Mansouri',
    contact_person: 'Ahmed Al Mansouri',
    contact_email: 'ahmed@example.com',
    contact_phone: '+971 50 123 4567',
    service: 'Investment Advisory',
    status: 'new',
    notes: 'Interested in luxury properties in Downtown Dubai',
    created_at: '2025-04-15T10:30:00Z'
  },
  {
    id: '2',
    referring_company: 'Emirates Real Estate',
    client_name: 'Sarah Johnson',
    contact_person: 'Sarah Johnson',
    contact_email: 'sarah@example.com',
    contact_phone: '+971 55 987 6543',
    service: 'Property Management',
    status: 'contacted',
    notes: 'Looking for property management services for her 3 apartments',
    created_at: '2025-04-10T14:20:00Z'
  },
  {
    id: '3',
    referring_company: 'Etihad Business Group',
    client_name: 'Mohammed Al Farsi',
    contact_person: 'Mohammed Al Farsi',
    contact_email: 'mohammed@example.com',
    contact_phone: '+971 52 555 7777',
    service: 'Commercial Leasing',
    status: 'meeting_scheduled',
    notes: 'Needs office space for his new tech startup',
    created_at: '2025-04-05T09:15:00Z'
  }
];

export const mockDeals = [
  {
    id: '1',
    title: 'Downtown Dubai Apartment Deal',
    referral_id: '1',
    value: '2500000',
    client_name: 'Ahmed Al Mansouri',
    stage: 'prospecting',
    expected_close_date: '2025-06-15',
    description: 'Potential sale of a 2-bedroom apartment in Downtown Dubai',
    created_at: '2025-04-16T11:30:00Z'
  },
  {
    id: '2',
    title: 'Property Management Contract',
    referral_id: '2',
    value: '120000',
    client_name: 'Sarah Johnson',
    stage: 'negotiation',
    expected_close_date: '2025-05-10',
    description: 'Annual contract for managing 3 apartments in Marina',
    created_at: '2025-04-12T10:00:00Z'
  },
  {
    id: '3',
    title: 'Office Space Leasing',
    referral_id: '3',
    value: '350000',
    client_name: 'Mohammed Al Farsi',
    stage: 'proposal',
    expected_close_date: '2025-05-25',
    description: 'Leasing a 200 sqm office space in Business Bay',
    created_at: '2025-04-08T16:45:00Z'
  }
];

export const mockDashboardStats = {
  referralCount: 3,
  dealCount: 3,
  totalDealValue: 2970000,
  conversionRate: 100
};

// Helper to delay responses to simulate network time
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
