import { salesProposals, type SalesProposal, type InsertProposal, type User, type InsertUser, users } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Sales Proposals Methods
  getAllProposals(): Promise<SalesProposal[]>;
  getProposal(id: number): Promise<SalesProposal | undefined>;
  createProposal(proposal: InsertProposal): Promise<SalesProposal>;
  updateProposal(id: number, proposal: Partial<InsertProposal>): Promise<SalesProposal | undefined>;
  deleteProposal(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private proposals: Map<number, SalesProposal>;
  private userCurrentId: number;
  private proposalCurrentId: number;

  constructor() {
    this.users = new Map();
    this.proposals = new Map();
    this.userCurrentId = 1;
    this.proposalCurrentId = 1;
    
    // Initialize with sample data
    this.initializeSampleProposals();
  }

  private initializeSampleProposals() {
    const sampleProposals: InsertProposal[] = [
      {
        proposta: "264.24 – Orlando",
        valorTotal: 24500,
        valorPago: 12250,
        percentComissao: 10,
        valorComissaoPaga: 1225
      },
      {
        proposta: "192.18 – Maria Alice",
        valorTotal: 18750,
        valorPago: 18750,
        percentComissao: 12,
        valorComissaoPaga: 2250
      },
      {
        proposta: "305.32 – Pedro Souza",
        valorTotal: 42800,
        valorPago: 21400,
        percentComissao: 15,
        valorComissaoPaga: 3210
      },
      {
        proposta: "178.09 – Alexandre Lima",
        valorTotal: 15300,
        valorPago: 0,
        percentComissao: 8,
        valorComissaoPaga: 0
      }
    ];

    sampleProposals.forEach(proposal => {
      this.createProposal(proposal);
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllProposals(): Promise<SalesProposal[]> {
    return Array.from(this.proposals.values());
  }

  async getProposal(id: number): Promise<SalesProposal | undefined> {
    return this.proposals.get(id);
  }

  async createProposal(insertProposal: InsertProposal): Promise<SalesProposal> {
    const id = this.proposalCurrentId++;
    const proposal: SalesProposal = { ...insertProposal, id };
    this.proposals.set(id, proposal);
    return proposal;
  }

  async updateProposal(id: number, updateData: Partial<InsertProposal>): Promise<SalesProposal | undefined> {
    const existingProposal = this.proposals.get(id);
    
    if (!existingProposal) {
      return undefined;
    }
    
    const updatedProposal: SalesProposal = {
      ...existingProposal,
      ...updateData
    };
    
    this.proposals.set(id, updatedProposal);
    return updatedProposal;
  }

  async deleteProposal(id: number): Promise<boolean> {
    return this.proposals.delete(id);
  }
}

export const storage = new MemStorage();
