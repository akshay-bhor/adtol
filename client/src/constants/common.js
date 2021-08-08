export const summaryCountryColumnsPub = [
  { field: "country", headerName: "Country", flex: 1 },
  { field: "views", headerName: "Views", flex: 1 },
  { field: "clicks", headerName: "Clicks", flex: 1 },
  { field: "pops", headerName: "Pops", flex: 1 },
  { field: "earned", headerName: "earned", flex: 1 },
];

export const summaryCountryColumnsAd = [
  { field: "country", headerName: "Country", flex: 1 },
  { field: "views", headerName: "Views", flex: 1 },
  { field: "clicks", headerName: "Clicks", flex: 1 },
  { field: "pops", headerName: "Pops", flex: 1 },
  { field: "spent", headerName: "Spent", flex: 1 },
];

export const campaignCols = [
  { field: "name", headerName: "Name", flex: 1 },
  { field: "views", headerName: "Views", flex: 1 },
  { field: "clicks", headerName: "Clicks", flex: 1 },
  { field: "pops", headerName: "Pops", flex: 1 },
  { field: "spent", headerName: "Spent", flex: 1 },
  { field: "ctr", headerName: "CTR", flex: 1 },
];

export const websitesCols = [
  { field: "website", headerName: "Website", flex: 1 },
  { field: "views", headerName: "Views", flex: 1 },
  { field: "clicks", headerName: "Clicks", flex: 1 },
  { field: "pops", headerName: "Pops", flex: 1 },
  { field: "earned", headerName: "Earned", flex: 1 },
  { field: "ctr", headerName: "CTR", flex: 1 },
];

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
        url: "/dashboard/create-ad/campaign",
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
