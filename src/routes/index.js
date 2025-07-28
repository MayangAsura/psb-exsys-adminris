// All components mapping with path for internal routes

import { lazy } from 'react'
import Accounts from '../features/accounts'
// import AdmissionCreate from '../features/admissions/create'
// import MCExam from '../landing/components/sections/Exams/MCExam'
// import ExamQuestions from '../features/exams/questions/questions'
// import ExamCreate from '../features/exams/create'

const Dashboard = lazy(() => import('../pages/protected/Dashboard'))
const Exams = lazy(() => import('../pages/protected/Exams'))
const ExamDetail = lazy(() => import('../pages/protected/ExamDetail'))
const ExamCreate = lazy(() => import('../pages/protected/ExamCreate'))
const ExamEdit = lazy(() => import('../pages/protected/ExamEdit'))
const ExamParticipant = lazy(() => import('../pages/protected/ExamParticipant'))
const ExamResponses = lazy(() => import('../pages/protected/ExamResponses'))
const ExamQuestions = lazy(() => import('../pages/protected/ExamQuestions'))
const ExamQuestionsAdd = lazy(() => import('../pages/protected/ExamQuestionsAdd'))
const Schedule = lazy(() => import('../pages/protected/Schedules'))
const ScheduleCreate = lazy(() => import('../pages/protected/ScheduleCreate'))
const ScheduleDetail = lazy(() => import('../pages/protected/ScheduleDetail'))
const ScheduleEdit = lazy(() => import('../pages/protected/ScheduleEdit'))
const ScheduleParticipants = lazy(() => import('../pages/protected/ScheduleParticipants'))
const SchedulePresences = lazy(() => import('../pages/protected/SchedulePresences'))
const ScheduleExams = lazy(() => import('../pages/protected/ScheduleExams'))
const QuestionBank = lazy(() => import('../pages/protected/QuestionBank'))
const QuestionBankCreate = lazy(() => import('../pages/protected/QuestionBankCreate'))
// const QuestionBankEdit = lazy(() => import('../pages/protected/QuestionBankEdit'))
// const QuestionBankDetail = lazy(() => import('../pages/protected/QuestionBankDetail'))
const Schools = lazy(() => import('../pages/protected/Schools'))
const Applicants = lazy(() => import('../pages/protected/Applicants'))
const Participants = lazy(() => import('../pages/protected/Participants'))
const Admissions = lazy(() => import('../pages/protected/Admissions'))
const AdmissionCreate = lazy(() => import('../pages/protected/AdmissionCreate'))
const AdmissionEdit = lazy(() => import('../pages/protected/AdmissionEdit'))
const Account = lazy(() => import('../pages/protected/Account'))

const Landing = lazy(() => import('../landing/Landing'))
// const Landing = lazy(() => import('../landing/components/pages/Landing/main'))
const Exam = lazy(() => import('../landing/components/pages/ExamPage/ExamPage'))
const FrontLogin = lazy(() => import('../landing/components/pages/Login/Login'))
const FrontRegister = lazy(() => import('../landing/components/pages/Register/Register'))
const MCExam = lazy(() => import('../landing/components/sections/Exams/MCExam'))
// const FrontRegister = lazy(() => import('../landing/components/pages/Register/Register'))

const Welcome = lazy(() => import('../pages/protected/Welcome'))
const Page404 = lazy(() => import('../pages/protected/404'))
const Blank = lazy(() => import('../pages/protected/Blank'))
const Charts = lazy(() => import('../pages/protected/Charts'))
const Leads = lazy(() => import('../pages/protected/Leads'))
const Integration = lazy(() => import('../pages/protected/Integration'))
const Calendar = lazy(() => import('../pages/protected/Calendar'))
const Team = lazy(() => import('../pages/protected/Team'))
const Transactions = lazy(() => import('../pages/protected/Transactions'))
const Bills = lazy(() => import('../pages/protected/Bills'))
const ProfileSettings = lazy(() => import('../pages/protected/ProfileSettings'))
const GettingStarted = lazy(() => import('../pages/GettingStarted'))
const DocFeatures = lazy(() => import('../pages/DocFeatures'))
const DocComponents = lazy(() => import('../pages/DocComponents'))


const routes = [
  {
    path: '/dashboard', // the url
    component: Dashboard, // view rendered
  },
  {
    path: '/exams', // the url
    component: Exams, // view rendered
  },
  {
    path: '/exams/create', // the url
    component: ExamCreate, // view rendered
  },
  {
    path: '/exams/edit/:exam_id', // the url
    component: ExamEdit, // view rendered
  },
  {
    path: '/exams/detail/:exam_id', // the url
    component: ExamDetail, // view rendered
  },
  {
    path: '/exams/:exam_id/participants', // the url
    component: ExamParticipant, // view rendered
  },
  {
    path: '/exams/:exam_id/questions', // the url
    component: ExamQuestions, // view rendered
  },
  {
    path: '/exams/:exam_id/questions/add', // the url
    component: ExamQuestionsAdd, // view rendered
  },
  {
    path: '/exams/:exam_id/responses', // the url
    component: ExamResponses, // view rendered
  },
  {
    path: '/schedules', // the url
    component: Schedule, // view rendered
  },
  {
    path: '/schedules/create', // the url
    component: ScheduleCreate, // view rendered
  },
  {
    path: '/schedules/edit/:schedule_id', // the url
    component: ScheduleEdit, // view rendered
  },
  {
    path: '/schedules/detail/:schedule_id', // the url
    component: ScheduleDetail, // view rendered
  },
  {
    path: '/schedules/:schedule_id/participants', // the url
    component: ScheduleParticipants, // view rendered
  },
  {
    path: '/schedules/:schedule_id/presences', // the url
    component: SchedulePresences, // view rendered
  },
  {
    path: '/schedules/:schedule_id/exams', // the url
    component: ScheduleExams, // view rendered
  },
  {
    path: '/question-banks', // the url
    component: QuestionBank, // view rendered
  },
  {
    path: '/question-banks/edit/:qbank_id', // the url
    component: QuestionBank, // view rendered
  },
  {
    path: '/question-banks/detail/:qbank_id', // the url
    component: QuestionBank, // view rendered
  },
  {
    path: '/schools', // the url
    component: Schools, // view rendered
  },
  {
    path: '/applicants', // the url
    component: Applicants, // view rendered
  },
  {
    path: '/participants', // the url
    component: Participants, // view rendered
  },
  {
    path: '/admissions', // the url
    component: Admissions, // view rendered
  },
  {
    path: '/admissions/create', // the url
    component: AdmissionCreate, // view rendered
  },
  {
    path: '/admissions/edit', // the url
    component: AdmissionEdit, // view rendered
  },
  {
    path: '/welcome', // the url
    component: Welcome, // view rendered
  },
  // {
  //   path: '/lanfing', // the url
  //   component: A, // view rendered
  // },
  {
    path: '/exam', // the url
    component: Exam, // view rendered
  },
  {
    path: '/landing', // the url
    component: Landing, // view rendered
  },
  {
    path: '/login',
    component: FrontLogin,
  },
  {
    path: '/register',
    component: FrontRegister,
  },
  {
    path: 'u/exam/:id/show',
    component: MCExam,
  },
  {
    path: '/u/exam/:id/start',
    component: MCExam,
  },
  {
    path: '/leads',
    component: Leads,
  },
  {
    path: '/settings-team',
    component: Team,
  },
  {
    path: '/calendar',
    component: Calendar,
  },
  {
    path: '/transactions',
    component: Transactions,
  },
  {
    path: '/settings-profile',
    component: ProfileSettings,
  },
  {
    path: '/settings-billing',
    component: Bills,
  },
  {
    path: '/getting-started',
    component: GettingStarted,
  },
  {
    path: '/features',
    component: DocFeatures,
  },
  {
    path: '/components',
    component: DocComponents,
  },
  {
    path: '/integration',
    component: Integration,
  },
  {
    path: '/charts',
    component: Charts,
  },
  {
    path: '/404',
    component: Page404,
  },
  {
    path: '/blank',
    component: Blank,
  },
]

export default routes
