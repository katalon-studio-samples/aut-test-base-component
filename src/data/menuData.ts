import { MenuItem } from '../components/MultiTieredMenu';

export const menuData: MenuItem[] = [
  {
    id: 'products',
    label: 'Products',
    children: [
      {
        id: 'electronics',
        label: 'Electronics',
        children: [
          {
            id: 'smartphones',
            label: 'Smartphones',
            children: [
              {
                id: 'android',
                label: 'Android Phones',
                children: [
                  {
                    id: 'samsung',
                    label: 'Samsung',
                    children: [
                      { id: 'galaxy-s', label: 'Galaxy S Series' },
                      { id: 'galaxy-note', label: 'Galaxy Note Series' },
                      { id: 'galaxy-fold', label: 'Galaxy Fold Series' }
                    ]
                  },
                  {
                    id: 'google',
                    label: 'Google',
                    children: [
                      { id: 'pixel-8', label: 'Pixel 8 Series' },
                      { id: 'pixel-7', label: 'Pixel 7 Series' },
                      { id: 'pixel-6', label: 'Pixel 6 Series' }
                    ]
                  },
                  {
                    id: 'oneplus',
                    label: 'OnePlus',
                    children: [
                      { id: 'oneplus-11', label: 'OnePlus 11 Series' },
                      { id: 'oneplus-10', label: 'OnePlus 10 Series' },
                      { id: 'oneplus-nord', label: 'OnePlus Nord Series' }
                    ]
                  }
                ]
              },
              {
                id: 'ios',
                label: 'iPhones',
                children: [
                  {
                    id: 'iphone-15',
                    label: 'iPhone 15',
                    children: [
                      { id: 'iphone-15-pro-max', label: 'iPhone 15 Pro Max' },
                      { id: 'iphone-15-pro', label: 'iPhone 15 Pro' },
                      { id: 'iphone-15-plus', label: 'iPhone 15 Plus' }
                    ]
                  },
                  {
                    id: 'iphone-14',
                    label: 'iPhone 14',
                    children: [
                      { id: 'iphone-14-pro-max', label: 'iPhone 14 Pro Max' },
                      { id: 'iphone-14-pro', label: 'iPhone 14 Pro' },
                      { id: 'iphone-14-plus', label: 'iPhone 14 Plus' }
                    ]
                  }
                ]
              }
            ]
          },
          {
            id: 'laptops',
            label: 'Laptops',
            children: [
              {
                id: 'gaming',
                label: 'Gaming Laptops',
                children: [
                  {
                    id: 'asus-rog',
                    label: 'ASUS ROG',
                    children: [
                      { id: 'rog-strix', label: 'ROG Strix Series' },
                      { id: 'rog-zephyrus', label: 'ROG Zephyrus Series' },
                      { id: 'rog-flow', label: 'ROG Flow Series' }
                    ]
                  },
                  {
                    id: 'razer',
                    label: 'Razer',
                    children: [
                      { id: 'razer-blade', label: 'Razer Blade Series' },
                      { id: 'razer-book', label: 'Razer Book Series' }
                    ]
                  }
                ]
              },
              {
                id: 'business',
                label: 'Business Laptops',
                children: [
                  {
                    id: 'thinkpad',
                    label: 'ThinkPad',
                    children: [
                      { id: 'thinkpad-x1', label: 'ThinkPad X1 Series' },
                      { id: 'thinkpad-t', label: 'ThinkPad T Series' },
                      { id: 'thinkpad-p', label: 'ThinkPad P Series' }
                    ]
                  },
                  {
                    id: 'dell-latitude',
                    label: 'Dell Latitude',
                    children: [
                      { id: 'latitude-9000', label: 'Latitude 9000 Series' },
                      { id: 'latitude-7000', label: 'Latitude 7000 Series' }
                    ]
                  }
                ]
              }
            ]
          },
          {
            id: 'tablets',
            label: 'Tablets',
            children: [
              { id: 'ipad', label: 'iPad' },
              { id: 'android-tablets', label: 'Android Tablets' }
            ]
          }
        ]
      },
      {
        id: 'clothing',
        label: 'Clothing',
        children: [
          {
            id: 'mens',
            label: "Men's Clothing",
            children: [
              {
                id: 'mens-formal',
                label: 'Formal Wear',
                children: [
                  {
                    id: 'mens-suits',
                    label: 'Suits',
                    children: [
                      { id: 'two-piece', label: 'Two-Piece Suits' },
                      { id: 'three-piece', label: 'Three-Piece Suits' },
                      { id: 'tuxedos', label: 'Tuxedos' }
                    ]
                  },
                  {
                    id: 'mens-shirts',
                    label: 'Dress Shirts',
                    children: [
                      { id: 'slim-fit', label: 'Slim Fit' },
                      { id: 'regular-fit', label: 'Regular Fit' },
                      { id: 'french-cuff', label: 'French Cuff' }
                    ]
                  }
                ]
              },
              {
                id: 'mens-casual',
                label: 'Casual Wear',
                children: [
                  {
                    id: 'mens-tshirts',
                    label: 'T-Shirts',
                    children: [
                      { id: 'crew-neck', label: 'Crew Neck' },
                      { id: 'v-neck', label: 'V-Neck' },
                      { id: 'polo', label: 'Polo Shirts' }
                    ]
                  },
                  {
                    id: 'mens-jeans',
                    label: 'Jeans',
                    children: [
                      { id: 'straight-fit', label: 'Straight Fit' },
                      { id: 'skinny-fit', label: 'Skinny Fit' },
                      { id: 'relaxed-fit', label: 'Relaxed Fit' }
                    ]
                  }
                ]
              }
            ]
          },
          {
            id: 'womens',
            label: "Women's Clothing",
            children: [
              { id: 'womens-dresses', label: 'Dresses' },
              { id: 'womens-tops', label: 'Tops' },
              { id: 'womens-shoes', label: 'Shoes' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'services',
    label: 'Services',
    children: [
      {
        id: 'tech-support',
        label: 'Technical Support',
        children: [
          {
            id: 'device-support',
            label: 'Device Support',
            children: [
              {
                id: 'phone-support',
                label: 'Phone Support',
                children: [
                  {
                    id: 'ios-support',
                    label: 'iOS Support',
                    children: [
                      { id: 'ios-setup', label: 'Device Setup' },
                      { id: 'ios-backup', label: 'Backup & Recovery' },
                      { id: 'ios-repair', label: 'Repair Services' }
                    ]
                  },
                  {
                    id: 'android-support',
                    label: 'Android Support',
                    children: [
                      { id: 'android-setup', label: 'Device Setup' },
                      { id: 'android-security', label: 'Security Services' },
                      { id: 'android-repair', label: 'Repair Services' }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'repair',
        label: 'Repair Services',
        children: [
          {
            id: 'device-repair',
            label: 'Device Repair',
            children: [
              { id: 'phone-repair', label: 'Phone Repair' },
              { id: 'laptop-repair', label: 'Laptop Repair' }
            ]
          },
          { id: 'maintenance', label: 'Maintenance' }
        ]
      },
      {
        id: 'installation',
        label: 'Installation',
        children: [
          { id: 'software-install', label: 'Software Installation' },
          { id: 'hardware-install', label: 'Hardware Installation' }
        ]
      }
    ]
  },
  {
    id: 'support',
    label: 'Support',
    children: [
      {
        id: 'customer-service',
        label: 'Customer Service',
        children: [
          { id: 'contact', label: 'Contact Us' },
          { id: 'faq', label: 'FAQ' }
        ]
      },
      {
        id: 'documentation',
        label: 'Documentation',
        children: [
          { id: 'user-guides', label: 'User Guides' },
          { id: 'tutorials', label: 'Tutorials' }
        ]
      }
    ]
  }
];

export const IFRAME_BASE_URL = 'https://base-component.aut.katalon.com';
// export const IFRAME_BASE_URL = 'http://localhost:5173';