import { Company, Stakeholder, FundingRound, VestingSchedule, User } from '../types';
import { mockCompany, mockStakeholders, mockFundingRounds, mockVestingSchedules } from '../data/mockData';

const KEYS = {
  COMPANY: 'equiledger_company',
  STAKEHOLDERS: 'equiledger_stakeholders',
  FUNDING_ROUNDS: 'equiledger_funding_rounds',
  VESTING_SCHEDULES: 'equiledger_vesting_schedules',
  USER: 'equiledger_user',
  USERS: 'equiledger_users',
  SESSION: 'equiledger_session',
};

export const storage = {
  getCompany: (): Company | null => {
    const data = localStorage.getItem(KEYS.COMPANY);
    if (!data) return null;
    return JSON.parse(data);
  },
  saveCompany: (company: Company) => {
    localStorage.setItem(KEYS.COMPANY, JSON.stringify(company));
  },
  getStakeholders: (): Stakeholder[] => {
    const data = localStorage.getItem(KEYS.STAKEHOLDERS);
    if (!data) return [];
    return JSON.parse(data);
  },
  saveStakeholders: (stakeholders: Stakeholder[]) => {
    localStorage.setItem(KEYS.STAKEHOLDERS, JSON.stringify(stakeholders));
  },
  getFundingRounds: (): FundingRound[] => {
    const data = localStorage.getItem(KEYS.FUNDING_ROUNDS);
    if (!data) return [];
    return JSON.parse(data);
  },
  saveFundingRounds: (rounds: FundingRound[]) => {
    localStorage.setItem(KEYS.FUNDING_ROUNDS, JSON.stringify(rounds));
  },
  getVestingSchedules: (): VestingSchedule[] => {
    const data = localStorage.getItem(KEYS.VESTING_SCHEDULES);
    if (!data) return [];
    return JSON.parse(data);
  },
  saveVestingSchedules: (schedules: VestingSchedule[]) => {
    localStorage.setItem(KEYS.VESTING_SCHEDULES, JSON.stringify(schedules));
  },
  
  // Auth Storage
  getUsers: (): User[] => {
    const data = localStorage.getItem(KEYS.USERS);
    return data ? JSON.parse(data) : [];
  },
  saveUsers: (users: User[]) => {
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  },
  getSession: (): User | null => {
    const data = localStorage.getItem(KEYS.SESSION);
    return data ? JSON.parse(data) : null;
  },
  saveSession: (user: User | null) => {
    if (user) {
      localStorage.setItem(KEYS.SESSION, JSON.stringify(user));
    } else {
      localStorage.removeItem(KEYS.SESSION);
    }
  },
  clearAll: () => {
    localStorage.clear();
  }
};
