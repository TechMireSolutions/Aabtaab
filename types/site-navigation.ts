/** Header/footer navigation shapes (not the Sanity `navigation` document schema) */

export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
}

export interface HeaderNav {
  items?: NavItem[];
}

export interface FooterNav {
  items?: NavItem[];
}

export interface FooterService {
  _id: string;
  title: string;
  slug: string;
}
