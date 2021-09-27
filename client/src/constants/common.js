const columnsSchema = [
  { field: "views", headerName: "Views", flex: 1 },
  { field: "clicks", headerName: "Clicks", flex: 1 },
  { field: "pops", headerName: "Pops", flex: 1 },
  { field: "spent", headerName: "Spent", flex: 1 },
  { field: "ctr", headerName: "CTR", flex: 1 },
];

export const countryColumnsPub = () => {
  const res = columnsSchema.filter(item => item.field !== 'spent');
  res.unshift(
    { field: "country", headerName: "Country", flex: 1 }
  );
  res.push(
    { field: "earned", headerName: "Earned", flex: 1 }
  );

  return res;
};

export const countryColumnsAd = () => {
  const res = columnsSchema.slice();
  res.unshift(
    { field: "country", headerName: "Country", flex: 1 },
  );

  return res;
}

export const dateColumnsAd = () => {
  const res = columnsSchema.slice();
  res.unshift(
    { field: "date", headerName: "Date", flex: 1 },
  );

  return res;
}

export const dateColumnsPub = () => {
  const res = columnsSchema.filter(item => item.field !== 'spent');
  res.unshift(
    { field: "date", headerName: "Date", flex: 1 },
  );
  res.push(
    { field: "earned", headerName: "Earned", flex: 1 },
  );

  return res;
}

export const deviceColumnsAd = () => {
  const res = columnsSchema.slice();
  res.unshift(
    { field: "device", headerName: "Device", flex: 1 },
  );

  return res;
}

export const deviceColumnsPub = () => {
  const res = columnsSchema.filter(item => item.field !== 'spent');
  res.unshift(
    { field: "device", headerName: "Device", flex: 1 },
  );
  res.push(
    { field: "earned", headerName: "Earned", flex: 1 },
  );

  return res;
}

export const osColumnsAd = () => {
  const res = columnsSchema.slice();
  res.unshift(
    { field: "os", headerName: "OS", flex: 1 },
  );

  return res;
}

export const osColumnsPub = () => {
  const res = columnsSchema.filter(item => item.field !== 'spent');
  res.unshift(
    { field: "os", headerName: "OS", flex: 1 },
  )
  res.push(
    { field: "earned", headerName: "Earned", flex: 1 },
  );

  return res;
}

export const browserColumnsAd = () => {
  const res = columnsSchema.slice();
  res.unshift(
    { field: "browser", headerName: "Browser", flex: 1 },
  );

  return res;
}

export const browserColumnsPub = () => {
  const res = columnsSchema.filter(item => item.field !== 'spent');
  res.unshift(
    { field: "browser", headerName: "Browser", flex: 1 },
  )
  res.push(
    { field: "earned", headerName: "Earned", flex: 1 },
  );

  return res;
}

export const campaignCols = () => ([
  { field: "campaign", headerName: "Campaign", flex: 1 },
  { field: "views", headerName: "Views", flex: 1 },
  { field: "clicks", headerName: "Clicks", flex: 1 },
  { field: "pops", headerName: "Pops", flex: 1 },
  { field: "ctr", headerName: "CTR", flex: 1 },
  { field: "spent", headerName: "Spent", flex: 1 },
]);

export const websitesCols = () => {
  const res = campaignCols().filter((item) => item.field !== 'campaign' && item.field !== 'spent');

  return [
    { field: "website", headerName: "Website", flex: 1 },
    ...res,
    { field: "earned", headerName: "Earned", flex: 1 }
  ]
}

export const paymentCols = [
  { field: "payment_id", headerName: "Payment ID", flex: 0.8 },
  { field: "order_id", headerName: "Order ID", flex: 1 },
  { field: "amount", headerName: "Amount", flex: 0.8 },
  { field: "currency", headerName: "Currency", flex: 0.5 },
  { field: "status", headerName: "Status", flex: 0.6 },
  { field: "processor", headerName: "Processor", flex: 0.6 },
  { field: "time", headerName: "Time", flex: 0.8 },
];

export const withdrawCols = [
  { field: "payment_id", headerName: "Payment ID", flex: 0.8 },
  { field: "amount", headerName: "Amount", flex: 0.8 },
  { field: "fee", headerName: "Fee", flex: 0.8 },
  { field: "currency", headerName: "Currency", flex: 0.5 },
  { field: "status", headerName: "Status", flex: 0.6 },
  { field: "processor", headerName: "Processor", flex: 0.6 },
  { field: "time", headerName: "Time", flex: 0.8 },
];

export const breakdownByListAd = () => ([
  { key: 1, name: 'Day' },
  { key: 2, name: 'Country' },
  { key: 3, name: 'Device' },
  { key: 4, name: 'OS' },
  { key: 5, name: 'Browser' },
  { key: 6, name: 'Campaign' }
]);

export const breakdownByListPub = () => {
  const res = breakdownByListAd().filter((item) => item.key !== 6);

  return [
    ...res,
    { key: 6, name: 'Website' }
  ]
}

export const bannerSizes = [
  '300x50',
  '320x50',
  '250x250',
  '300x250',
  '728x90',
  '970x250',
  '120x600',
  '160x600',
  '336x280',
  '300x600',
  '300x150'
];

export const weekDaysList = [
  {
    id: 1,
    name: 'Sunday'
  },
  {
    id: 2,
    name: 'Monday'
  },
  {
    id: 3,
    name: 'Tuesday'
  },
  {
    id: 4,
    name: 'Wednesday'
  },
  {
    id: 5,
    name: 'Thursday'
  },
  {
    id: 6,
    name: 'Friday'
  },
  {
    id: 7,
    name: 'Saturday'
  }
];

export const reportDurationSelection = [
  {
    name: "Today",
    id: 1,
  },
  {
    name: "This Week",
    id: 2,
  },
  {
    name: "Last 2 Weeks",
    id: 3,
  },
  {
    name: "This Month",
    id: 4,
  },
  {
    name: "Last 2 Months",
    id: 5,
  },
];

export const SidenavMenuItems = [
  {
    id: 31,
    title: "Dashboard",
    url: "/dashboard",
    icon: "dashboard",
    nested: false,
    divider: true,
  },
  {
    id: 32,
    title: "Advertiser",
    url: "/dashboard/advertiser",
    icon: "person",
    nested: false,
    divider: true,
  },
  {
    id: 33,
    title: "Campaigns",
    url: "/dashboard/campaigns",
    icon: "campaign",
    nested: true,
  },
  {
    id: 34,
    title: "Create Ad",
    icon: "create",
    url: "",
    disabled: true,
    nested: true,
    child: true,
    childs: [
      {
        id: 341,
        title: "Campaign",
        url: "/dashboard/campaign-type",
        icon: "ads_click",
      },
      {
        id: 342,
        title: "Pop",
        url: "/dashboard/create-ad/pop",
        icon: "tab",
      },
    ],
  },
  {
    id: 35,
    title: "Reports",
    url: "/dashboard/reports/advertiser",
    icon: "auto_graph",
    nested: true,
    divider: true,
  },
  {
    id: 36,
    title: "Publisher",
    url: "/dashboard/publisher",
    icon: "person",
    nested: false,
    divider: true,
  },
  {
    id: 37,
    title: "Websites",
    url: "/dashboard/websites",
    icon: "public",
    nested: true,
  },
  {
    id: 38,
    title: "Get Adcode",
    url: "/dashboard/get-adcode",
    icon: "integration_instructions",
    nested: true,
  },
  {
    id: 39,
    title: "Reports",
    url: "/dashboard/reports/publisher",
    icon: "auto_graph",
    nested: true,
    divider: true,
  },
  {
    id: 40,
    title: "Referrals",
    url: "/dashboard/referrals",
    icon: "person_add",
    nested: false,
    divider: true,
  },
  {
    id: 41,
    title: "Billing",
    url: "/dashboard/billing",
    icon: "receipt_long",
    nested: false,
  },
];

export const linkRelList = [
  {
    id: 0,
    name: "Nofollow"
  },
  {
    id: 1,
    name: "Follow"
  },
  {
    id: 2,
    name: "Nofollow Noreferrer Noopener"
  }
];

export const advertisingQuotes = [
  /** DO NOT ADD '-' in QUOTE */
  "Your brand is a story unfolding across all customer touch points. - Jonah Sachs",
  "Doing business without advertising is like winking at a girl in the dark. You know what you are doing, but nobody else does - Steuart Henderson Britt",
  "Advertising is the modern substitute for argument; its function is to make the worse appear the better. - George Santayana",
  "Many a small thing has been made large by the right kind of advertising. - Mark Twain",
  "In advertising, not to be different is virtually suicidal - Bill Bernbach",
  "Stopping advertising to save money is like stopping your watch to save time. - Henry Ford",
  "There’s an ad for every vice. That’s advice. - Brian Spellman",
  "Make it simple. Make it memorable. Make it inviting to look at. - Leo Burnett",
  "One ad is worth more to a paper than forty editorials. - Will Rogers",
  "If it doesn’t sell, it isn’t creative. - David Ogilvy",
];