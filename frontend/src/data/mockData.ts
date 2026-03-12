import { Company, Stakeholder, FundingRound, VestingSchedule } from '../types';

export const mockCompany: Company = {
  id: 'company-1',
  name: 'NovaLabs',
  authorizedShares: 10000000,
  createdAt: new Date().toISOString(),
};

export const mockStakeholders: Stakeholder[] = [
  {
    id: 's-1',
    companyId: 'company-1',
    name: 'Alice',
    email: 'alice@novalabs.io',
    role: 'Founder',
    shareClass: 'Common',
    sharesOwned: 4000000,
    startDate: '2023-01-01',
    createdAt: new Date().toISOString(),
  },
  {
    id: 's-2',
    companyId: 'company-1',
    name: 'Bob',
    email: 'bob@novalabs.io',
    role: 'Founder',
    shareClass: 'Common',
    sharesOwned: 3000000,
    startDate: '2023-01-01',
    createdAt: new Date().toISOString(),
  },
  {
    id: 's-3',
    companyId: 'company-1',
    name: 'Employee Option Pool',
    email: 'options@novalabs.io',
    role: 'Employee',
    shareClass: 'Options',
    sharesOwned: 1500000,
    startDate: '2023-02-01',
    createdAt: new Date().toISOString(),
  },
];

export const mockFundingRounds: FundingRound[] = [];
export const mockVestingSchedules: VestingSchedule[] = [];
