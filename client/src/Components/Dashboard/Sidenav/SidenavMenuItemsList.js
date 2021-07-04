export const SidenavMenuItems = [
    {
        id: 31,
        title: 'Dashboard',
        url: '/dashboard',
        icon: 'dashboard',
        nested: false,
        divider: true
    },
    {
        id: 32,
        title: 'Advertiser',
        url: '/dashboard/advertiser',
        icon: 'person',
        nested: false,
        divider: true
    },
    {
        id: 33,
        title: 'Campaigns',
        url: '/dashboard/campaigns',
        icon: 'campaign',
        nested: true
    },
    {
        id: 34,
        title: 'Create Ad',
        icon: 'create',
        url: '/dashboard/create-ad/campaign',
        disabled: true,
        nested: true,
        child: true,
        childs: [
            {
                id: 341,
                title: 'Campaign',
                url: '/dashboard/create-ad/campaign',
                icon: 'ads_click'
            },
            {
                id: 342,
                title: 'Pop',
                url: '/dashboard/create-ad/pop',
                icon: 'tab'
            }
        ]
    },
    {
        id: 35,
        title: 'Reports',
        url: '/dashboard/reports/advertiser',
        icon: 'auto_graph',  
        nested: true,
        divider: true
    },
    {
        id: 36,
        title: 'Publisher',
        url: '/dashboard/publisher',
        icon: 'person',
        nested: false,
        divider: true
    },
    {
        id: 37,
        title: 'Websites',
        url: '/dashboard/websites',
        icon: 'public',
        nested: true
    },
    {
        id: 38,
        title: 'Get Adcode',
        url: '/dashboard/get-adcode',
        icon: 'integration_instructions',
        nested: true
    },
    {
        id: 39,
        title: 'Reports',
        url: '/dashboard/reports/publisher',
        icon: 'auto_graph',
        nested: true,
        divider: true
    },
    {
        id: 40,
        title: 'Referrels',
        url: '/dashboard/referrels',
        icon: 'person_add',
        nested: false,
        divider: true
    },
    {
        id: 41,
        title: 'Billing',
        url: '/dashboard/billing',
        icon: 'receipt_long',
        nested: false
    },
];