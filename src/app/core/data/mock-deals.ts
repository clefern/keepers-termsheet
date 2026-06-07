import { Deal } from '@core/models/deal.model';

/**
 * Seed data for the in-memory backend. Purchase price / NOI pairs are chosen so
 * every cap rate falls within a realistic 5%–12% range.
 */
export const MOCK_DEALS: Deal[] = [
  {
    id: 'd1',
    name: 'Sunset Apartments',
    address: '1200 Sunset Blvd, Los Angeles, CA',
    purchasePrice: 2_500_000,
    noi: 187_500, // 7.5%
  },
  {
    id: 'd2',
    name: 'Harbor Point Plaza',
    address: '55 Marina Way, Seattle, WA',
    purchasePrice: 5_000_000,
    noi: 300_000, // 6.0%
  },
  {
    id: 'd3',
    name: 'Maple Grove Townhomes',
    address: '78 Maple St, Austin, TX',
    purchasePrice: 1_200_000,
    noi: 108_000, // 9.0%
  },
  {
    id: 'd4',
    name: 'Downtown Office Tower',
    address: '900 Main St, Chicago, IL',
    purchasePrice: 12_000_000,
    noi: 960_000, // 8.0%
  },
  {
    id: 'd5',
    name: 'Riverside Retail Center',
    address: '210 River Rd, Portland, OR',
    purchasePrice: 3_400_000,
    noi: 374_000, // 11.0%
  },
  {
    id: 'd6',
    name: 'Oakwood Industrial Park',
    address: '4500 Industrial Pkwy, Phoenix, AZ',
    purchasePrice: 7_800_000,
    noi: 429_000, // 5.5%
  },
];
