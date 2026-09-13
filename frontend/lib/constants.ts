import type { Review, NavLink } from '@/types';

export const footerLinks: NavLink[] = [
  { label: 'Browse reviews', href: '/login' },
  { label: 'How it works', href: '#' },
  { label: 'Community guidelines', href: '#' },
  { label: 'Privacy', href: '#' },
];

export const sampleReviews: Review[] = [
  {
    category: 'Audio',
    product: 'QuietTone Pro Headphones',
    rating: 4.5,
    text: 'The noise cancellation makes my commute noticeably calmer, and the ear cups stay comfortable for hours. The case is a little bulky, but the battery easily lasts through a full week of use.',
    reviewer: 'Maya Chen',
    date: 'August 28, 2026',
  },
  {
    category: 'Kitchen',
    product: 'Brewstead 8-Cup Coffee Maker',
    rating: 4.2,
    text: 'It brews a balanced pot without taking over the counter. The carafe pours cleanly and the timer is straightforward, though the water markings could be easier to read in low light.',
    reviewer: 'Daniel Brooks',
    date: 'August 22, 2026',
  },
  {
    category: 'Phones',
    product: 'Northstar One Phone',
    rating: 4.7,
    text: 'Fast, dependable, and genuinely excellent for photos in everyday light. I get a full day and a half from the battery, but the glossy back picks up fingerprints quickly.',
    reviewer: 'Aisha Rahman',
    date: 'August 16, 2026',
  },
  {
    category: 'Fitness',
    product: 'Paceform Daily Running Shoes',
    rating: 4.4,
    text: 'The cushioning feels supportive without being overly soft, even after longer runs. The fit runs slightly narrow, so consider sizing up if you have wider feet.',
    reviewer: 'Tom Alvarez',
    date: 'August 10, 2026',
  },
  {
    category: 'Computers',
    product: 'Fieldwork Air 14 Laptop',
    rating: 4.6,
    text: 'Light enough to carry daily, with a bright display and a keyboard that feels great. Battery easily handles a workday, though the limited ports mean packing a dongle.',
    reviewer: 'Priya Nair',
    date: 'August 4, 2026',
  },
];