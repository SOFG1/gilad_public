export interface IBirthDay {
  day: number;
  month: number;
  name: string;
  office_position?: string;
  organization: string;
  id?: number
}

export interface IAddBirthday {
  day: number;
  month: number;
  name: string;
  office_position?: string;
  organization: string;
}

export interface IBirthdaysState {
  allBirthdays: any[];
  todayBirthdays: IBirthDay[];
  isFetching: boolean
  errorMessage: string | null
}
