export type UserRole = 'Founder' | 'Investor';

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  companyId?: string;
  onboardingCompleted: boolean;
}

export interface Company {
  id: string;
  name: string;
  authorizedShares: number;
  createdAt: string;
}

export type StakeholderRole = 'Founder' | 'Employee' | 'Investor' | 'Advisor';
export type ShareClass = 'Common' | 'Preferred' | 'Options';

export interface Stakeholder {
  id: string;
  companyId: string;
  name: string;
  email: string;
  role: StakeholderRole;
  shareClass: ShareClass;
  sharesOwned: number;
  startDate: string;
  createdAt: string;
}

export interface FundingRound {
  id: string;
  companyId: string;
  roundName: string;
  preMoneyValuation: number;
  investmentAmount: number;
  postMoneyValuation: number;
  createdAt: string;
}

export interface VestingSchedule {
  id: string;
  stakeholderId: string;
  totalOptions: number;
  cliffMonths: number;
  vestingMonths: number;
  startDate: string;
}

export interface DashboardStats {
  totalStakeholders: number;
  issuedShares: number;
  founderOwnership: number;
  latestValuation: number;
}
