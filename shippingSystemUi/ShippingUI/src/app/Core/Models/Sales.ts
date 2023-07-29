export interface BranchDto {
  id: number;
  branchName: string;
  createdAt: Date;
  state: boolean;
}

export interface GovernmentDto {
  goverment_Id: number;
  govermentName: string;
  state: boolean;
}

export interface SalesRepresentator {
  salesRepresentativeId?: number;
  name?: string;
  userName?: string;
  password?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  companyPercentage?: number;
  discountType?: number;
  isActive?: boolean;
  branches?: BranchDto[];
  goverments?: GovernmentDto[];
  branchesIds?: number[];
  governmentsIds?: number[];
}
