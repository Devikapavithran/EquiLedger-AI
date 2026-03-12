import { storage } from './storage';
import { Company, Stakeholder, FundingRound, VestingSchedule } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const dataService = {
  // Company
  getCompany: () => storage.getCompany(),
  updateCompany: (company: Company) => {
    storage.saveCompany(company);
    return company;
  },

  // Stakeholders
  getStakeholders: () => storage.getStakeholders(),
  addStakeholder: (stakeholder: Omit<Stakeholder, 'id' | 'createdAt'>) => {
    const stakeholders = storage.getStakeholders();
    const newStakeholder: Stakeholder = {
      ...stakeholder,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };
    storage.saveStakeholders([...stakeholders, newStakeholder]);
    return newStakeholder;
  },
  updateStakeholder: (updatedStakeholder: Stakeholder) => {
    const stakeholders = storage.getStakeholders();
    const newStakeholders = stakeholders.map(s => 
      s.id === updatedStakeholder.id ? updatedStakeholder : s
    );
    storage.saveStakeholders(newStakeholders);
    return updatedStakeholder;
  },
  deleteStakeholder: (id: string) => {
    const stakeholders = storage.getStakeholders();
    const newStakeholders = stakeholders.filter(s => s.id !== id);
    storage.saveStakeholders(newStakeholders);
    
    // Also cleanup vesting schedules for this stakeholder
    const schedules = storage.getVestingSchedules();
    const newSchedules = schedules.filter(s => s.stakeholderId !== id);
    storage.saveVestingSchedules(newSchedules);
  },

  // Funding Rounds
  getFundingRounds: () => storage.getFundingRounds(),
  addFundingRound: (round: Omit<FundingRound, 'id' | 'createdAt' | 'postMoneyValuation'>) => {
    const rounds = storage.getFundingRounds();
    const postMoneyValuation = round.preMoneyValuation + round.investmentAmount;
    
    const newRound: FundingRound = {
      ...round,
      id: uuidv4(),
      postMoneyValuation,
      createdAt: new Date().toISOString(),
    };
    
    // Logic for dilution could be added here if we were creating new shares
    // For now, we just add the round
    storage.saveFundingRounds([...rounds, newRound]);
    return newRound;
  },

  // Vesting
  getVestingSchedules: () => storage.getVestingSchedules(),
  addVestingSchedule: (schedule: Omit<VestingSchedule, 'id'>) => {
    const schedules = storage.getVestingSchedules();
    const newSchedule: VestingSchedule = {
      ...schedule,
      id: uuidv4(),
    };
    storage.saveVestingSchedules([...schedules, newSchedule]);
    return newSchedule;
  },

  // Calculations
  getTotalIssuedShares: () => {
    const stakeholders = storage.getStakeholders();
    return stakeholders.reduce((sum, s) => sum + s.sharesOwned, 0);
  },
  
  getOwnershipPercentage: (shares: number) => {
    const total = dataService.getTotalIssuedShares();
    if (total === 0) return 0;
    return (shares / total) * 100;
  }
};
