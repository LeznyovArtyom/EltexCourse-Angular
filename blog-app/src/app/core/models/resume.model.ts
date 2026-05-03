export interface JobPosition {
  companyLogoImgPath: string,
  position: string,
  companyAndPeriod: string,
  responsibilities: string[]
}

export interface Certificate {
  platform: string,
  issueDate: Date,
  courseName: string, 
  certificateLink: string
}

export interface SkillGroup {
  category: string,
  items: string[]
}

export interface Achievement {
  name: string,
  description: string
}

export interface Project {
  name: string,
  description: string
}