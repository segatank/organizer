export interface Task {
  id?: string;
  title: string;
  date: {
    year?: string;
    month?: string;
    day?: string;
  };
}

export interface CreateResponse {
  name: string;
}
