import { clone } from './utils.js';

export const BASE_AREAS = Object.freeze([
  {
    id: 'kitchen', name: 'Kitchen', sections: 4,
    routines: [
      { title: 'Wipe stovetop', section: 'Countertops & Surfaces', repeat: 'Every 3 days', minutes: 6, status: 'overdue' },
      { title: 'Descale kettle', section: 'Appliances', repeat: 'Every 6 weeks', minutes: 15, status: 'today' },
      { title: 'Sweep floor', section: 'Floor', repeat: 'As needed', minutes: 8, status: 'as-needed' },
      { title: 'Check pantry dates', section: 'Cabinets & Storage', repeat: 'Monthly', minutes: 15, status: 'upcoming' }
    ]
  },
  {
    id: 'bathroom', name: 'Bathroom', sections: 3,
    routines: [
      { title: 'Clean bathroom mirror', section: 'Sink & Counter', repeat: 'Weekly', minutes: 5, status: 'upcoming' },
      { title: 'Clean tub and shower', section: 'Tub & Shower', repeat: 'Every 2 weeks', minutes: 25, status: 'upcoming' }
    ]
  },
  {
    id: 'living-room', name: 'Living Room', sections: 3,
    routines: [
      { title: 'Water houseplants', section: 'Tidying', repeat: 'Weekly', minutes: 8, status: 'today' },
      { title: 'Vacuum sofa', section: 'Upholstery', repeat: 'Monthly', minutes: 15, status: 'upcoming' }
    ]
  },
  {
    id: 'bedroom', name: 'Bedroom', sections: 2,
    routines: [
      { title: 'Return loose clothes', section: 'Closet', repeat: 'As needed', minutes: 6, status: 'as-needed' }
    ],
    unconfigured: 'Bed & Surfaces'
  },
  {
    id: 'car', name: 'Car', sections: 0,
    routines: [
      { title: 'Check tire pressure', section: '', repeat: 'Monthly', minutes: 8, status: 'upcoming' },
      { title: 'Clear trash from car', section: '', repeat: 'As needed', minutes: 5, status: 'as-needed' }
    ]
  }
]);

function buildLargeHousehold() {
  const areas = clone(BASE_AREAS);
  areas.push(
    {
      id: 'laundry-utility', name: 'Laundry & Utility Room', sections: 6,
      routines: [
        { title: 'Move clothes to dryer', section: 'Laundry', repeat: 'As needed', minutes: 3, status: 'today' },
        { title: 'Clean dryer lint housing', section: 'Appliances', repeat: 'Monthly', minutes: 12, status: 'upcoming' },
        { title: 'Check detergent and cleaning supplies', section: 'Storage', repeat: 'Every 2 weeks', minutes: 6, status: 'upcoming' },
        { title: 'Wipe washer and dryer surfaces', section: 'Surfaces', repeat: 'Weekly', minutes: 7, status: 'overdue' },
        { title: 'Sweep utility-room floor', section: 'Floor', repeat: 'Weekly', minutes: 8, status: 'upcoming' }
      ]
    },
    {
      id: 'work', name: 'Work', sections: 5,
      routines: [
        { title: 'Clear downloads and temporary working files', section: 'Digital Workspace', repeat: 'Weekly', minutes: 10, status: 'today' },
        { title: 'Review follow-ups from the previous workday', section: 'Planning', repeat: 'Weekdays', minutes: 8, status: 'upcoming' },
        { title: 'Reset desk surface and charging area', section: 'Desk', repeat: 'Weekly', minutes: 7, status: 'as-needed' }
      ]
    },
    {
      id: 'personal', name: 'Personal', sections: 4,
      routines: [
        { title: 'Refill weekly medication organizer', section: 'Health', repeat: 'Weekly', minutes: 8, status: 'upcoming' },
        { title: 'Back up important personal documents', section: 'Administration', repeat: 'Monthly', minutes: 12, status: 'upcoming' }
      ]
    },
    {
      id: 'patio-entry', name: 'Patio, Balcony & Entryway', sections: 7,
      routines: [
        { title: 'Sweep entryway and shake out mats', section: 'Entryway', repeat: 'Weekly', minutes: 10, status: 'overdue' },
        { title: 'Water outdoor plants', section: 'Plants', repeat: 'Every 3 days', minutes: 12, status: 'today' },
        { title: 'Wipe outdoor table and chair arms', section: 'Furniture', repeat: 'As needed', minutes: 8, status: 'as-needed' }
      ]
    }
  );
  return areas;
}

function buildLongContent() {
  const areas = clone(BASE_AREAS);
  areas[0].name = 'Kitchen, Breakfast Nook & Shared Food Preparation Space';
  areas[0].sections = 9;
  areas[0].routines.unshift({
    title: 'Remove everything from the primary food-preparation counter, clean underneath it, and return only the items used every day',
    section: 'Countertops, Small Appliances & Frequently Used Preparation Surfaces',
    repeat: 'Every 2 weeks',
    minutes: 24,
    status: 'overdue'
  });
  areas[0].routines.push(
    { title: 'Clean the refrigerator door seals and the narrow channels where crumbs and moisture collect', section: 'Refrigerator & Freezer', repeat: 'Monthly', minutes: 18, status: 'upcoming' },
    { title: 'Review rarely used pantry ingredients before the next grocery order and move soon-to-expire items forward', section: 'Pantry, Dry Goods & Household Food Storage', repeat: 'Monthly', minutes: 20, status: 'upcoming' },
    { title: 'Wash reusable grocery bags and return them to the place where they are most likely to be remembered', section: 'Reusable Bags & Shopping Supplies', repeat: 'Monthly', minutes: 15, status: 'as-needed' },
    { title: 'Deep-clean the narrow space between the refrigerator, wall, and neighboring cabinet', section: 'Hidden Gaps & Hard-to-Reach Areas', repeat: 'Every 3 months', minutes: 30, status: 'upcoming' }
  );
  areas.push({
    id: 'work-personal-admin',
    name: 'Work, Study & Personal Administration',
    sections: 8,
    routines: [
      { title: 'Review unresolved messages that require a decision rather than a quick acknowledgment', section: 'Communication & Follow-up', repeat: 'Weekdays', minutes: 12, status: 'today' },
      { title: 'Archive completed project material without deleting anything that may be needed for compliance or future reference', section: 'Files, Records & Reference Material', repeat: 'Monthly', minutes: 20, status: 'upcoming' }
    ]
  });
  return areas;
}

export const SCENARIOS = Object.freeze({
  normal: {
    label: 'Normal day',
    purpose: 'Tests everyday hierarchy with a small, believable amount of attention.',
    expected: '3 routines need attention across 2 areas.',
    areas: clone(BASE_AREAS),
    intervention: { app: 'Instagram', minutes: 7, task: 'Wipe the stovetop', location: 'Kitchen', duration: 6 }
  },
  backlog: {
    label: 'Heavy backlog',
    purpose: 'Tests urgency, scanning, and emotional pressure when several areas are behind.',
    expected: '7 routines need attention across 4 areas.',
    areas: (() => {
      const areas = clone(BASE_AREAS);
      areas[0].routines.push({ title: 'Mop kitchen floor', section: 'Floor', repeat: 'Weekly', minutes: 15, status: 'overdue' });
      areas[1].routines.unshift({ title: 'Empty bathroom bin', section: 'Sink & Counter', repeat: 'Weekly', minutes: 4, status: 'overdue' });
      areas[1].routines.push({ title: 'Mop bathroom floor', section: 'Floor', repeat: 'Weekly', minutes: 12, status: 'today' });
      areas[3].routines.push({ title: 'Change bedding', section: 'Bed & Surfaces', repeat: 'Weekly', minutes: 10, status: 'overdue' });
      return areas;
    })(),
    intervention: { app: 'YouTube', minutes: 18, task: 'Empty the bathroom bin', location: 'Bathroom', duration: 4 }
  },
  new: {
    label: 'New user',
    purpose: 'Tests onboarding, empty-state tone, and whether the first action is obvious.',
    expected: 'No areas and no configured routines.',
    areas: [],
    intervention: { app: 'Reddit', minutes: 5, task: 'Add your first useful action', location: 'Nudge setup', duration: 2 }
  },
  clear: {
    label: 'All clear',
    purpose: 'Tests whether the product still feels useful when nothing is urgent.',
    expected: 'No overdue or due-today routines.',
    areas: clone(BASE_AREAS).map(area => ({
      ...area,
      routines: area.routines.map(routine => ({
        ...routine,
        status: routine.status === 'as-needed' ? 'as-needed' : 'upcoming'
      }))
    })),
    intervention: { app: 'Instagram', minutes: 6, task: 'Choose a small task for later', location: 'Nothing urgent', duration: 2 }
  },
  large: {
    label: 'Large household',
    purpose: 'Tests many areas, many sections, non-household content, and long scrolling.',
    expected: '9 areas including Work and Personal, with 8 routines needing attention.',
    areas: buildLargeHousehold(),
    intervention: { app: 'Instagram', minutes: 11, task: 'Clear temporary working files', location: 'Work · Digital Workspace', duration: 10 }
  },
  long: {
    label: 'Long content',
    purpose: 'Tests wrapping, truncation, dense section names, and unusually descriptive routines.',
    expected: 'Long area, section, chore, and intervention labels without lost actions.',
    areas: buildLongContent(),
    intervention: {
      app: 'YouTube',
      minutes: 14,
      task: 'Review unresolved messages that require a decision rather than a quick acknowledgment',
      location: 'Work, Study & Personal Administration · Communication & Follow-up',
      duration: 12
    }
  },
  'large-text': {
    label: 'Large text',
    purpose: 'Tests content at an enlarged interface text scale.',
    expected: 'Critical labels and actions remain visible at approximately 125% text scale.',
    textScale: 'large',
    areas: clone(BASE_AREAS),
    intervention: { app: 'Instagram', minutes: 7, task: 'Wipe the stovetop', location: 'Kitchen', duration: 6 }
  }
});

export function getScenario(id) {
  return clone(SCENARIOS[id] || SCENARIOS.normal);
}
