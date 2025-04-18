export type JobStatus = 'Applied' | 'Interview Scheduled' | 'Rejected' | 'Offer Received';

export interface JobApplication {
  id: string;
  jobTitle: string;
  company: string;
  applicationDate: string;
  status: JobStatus;
  jobLink: string;
  notes: string;
  lastUpdated: string;
  interviews?: Interview[];
}

export interface Interview {
  id: string;
  date: string;
  time: string;
  type: 'Phone' | 'Video' | 'In-Person';
  notes: string;
}

export interface Filter {
  status: JobStatus | 'All';
  searchTerm: string;
  sortBy: 'applicationDate' | 'company' | 'jobTitle' | 'status';
  sortDirection: 'asc' | 'desc';
  dateRange: {
    start: string;
    end: string;
  } | null;
}