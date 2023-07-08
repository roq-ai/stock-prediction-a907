import { OrganizationInterface } from 'interfaces/organization';
import { GetQueryInterface } from 'interfaces';

export interface StockInterface {
  id?: string;
  name: string;
  predicted_price: number;
  buying_price: number;
  selling_price: number;
  valuation: string;
  timeframe: string;
  organization_id?: string;
  created_at?: any;
  updated_at?: any;

  organization?: OrganizationInterface;
  _count?: {};
}

export interface StockGetQueryInterface extends GetQueryInterface {
  id?: string;
  name?: string;
  valuation?: string;
  timeframe?: string;
  organization_id?: string;
}
