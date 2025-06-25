/** Icons are imported separatly to reduce build time */
import BellIcon from '@heroicons/react/24/outline/BellIcon'
import DocumentTextIcon from '@heroicons/react/24/outline/DocumentTextIcon'
import Squares2X2Icon from '@heroicons/react/24/outline/Squares2X2Icon'
import TableCellsIcon from '@heroicons/react/24/outline/TableCellsIcon'
import WalletIcon from '@heroicons/react/24/outline/WalletIcon'
import CodeBracketSquareIcon from '@heroicons/react/24/outline/CodeBracketSquareIcon'
import DocumentIcon from '@heroicons/react/24/outline/DocumentIcon'
import ExclamationTriangleIcon from '@heroicons/react/24/outline/ExclamationTriangleIcon'
import CalendarDaysIcon from '@heroicons/react/24/outline/CalendarDaysIcon'
import ArrowRightOnRectangleIcon from '@heroicons/react/24/outline/ArrowRightOnRectangleIcon'
import UserIcon from '@heroicons/react/24/outline/UserIcon'
import Cog6ToothIcon from '@heroicons/react/24/outline/Cog6ToothIcon'
import BoltIcon from '@heroicons/react/24/outline/BoltIcon'
import ChartBarIcon from '@heroicons/react/24/outline/ChartBarIcon'
import CurrencyDollarIcon from '@heroicons/react/24/outline/CurrencyDollarIcon'
import InboxArrowDownIcon from '@heroicons/react/24/outline/InboxArrowDownIcon'
import UsersIcon from '@heroicons/react/24/outline/UsersIcon'
import KeyIcon from '@heroicons/react/24/outline/KeyIcon'
import DocumentDuplicateIcon from '@heroicons/react/24/outline/DocumentDuplicateIcon'

import { MdOutlineTask, MdOutlineDateRange, MdOutlineSchool, MdOutlineAddTask } from "react-icons/md";
import { TbUserSquareRounded } from "react-icons/tb";
import { FaFileAlt } from "react-icons/fa";

const iconClasses = `h-6 w-6`
const submenuIconClasses = `h-5 w-5`

const routes = [
  {
    path: '/admin/dashboard',
    icon: <Squares2X2Icon className={iconClasses}/>, 
    name: 'Dashboard',
  },
  {
    path: '/admin/schedules',
    icon: <MdOutlineDateRange className={iconClasses}/>, 
    name: 'Jadwal Ujian',
    // submenu : [
    //   {
    //     path: '/admin/scheduled/detail/:schedule_id',
    //     icon: <ArrowRightOnRectangleIcon className={submenuIconClasses}/>,
    //     name: 'Login',
    //   }
    // ]
  },
  {
    path: '/admin/exams',
    icon: <FaFileAlt className={iconClasses}/>, 
    name: 'Ujian',
    // submenu : [
    //   {
    //     path: '/admin/exams/detail/:exam_id',
    //     icon: <ArrowRightOnRectangleIcon className={submenuIconClasses}/>,
    //     name: 'Login',
    //   }
    // ]
  },
  // {
  //   path: `/app/exams/edit/:exam_id`,
  //   icon: <Squares2X2Icon className={iconClasses}/>, 
  //   name: 'Edit Ujian',
  // },
  // {
  //   path: '/app/exams/detail/:exam_id',
  //   icon: <Squares2X2Icon className={iconClasses}/>, 
  //   name: 'Detail Ujian',
  // },
  {
    path: '/admin/question-banks',
    icon: <MdOutlineAddTask className={iconClasses}/>, 
    name: 'Bank Soal',
  },
  // {
  //   path: '/admin/question-banks/edit/:qbank_id',
  //   icon: <Squares2X2Icon className={iconClasses}/>, 
  //   name: 'Bank Soal',
  // },
  // {
  //   path: '/admin/question-banks/detail/:qbank_id',
  //   icon: <Squares2X2Icon className={iconClasses}/>, 
  //   name: 'Bank Soal',
  // },
  {
    path: '/admin/schools',
    icon: <MdOutlineSchool className={iconClasses}/>, 
    name: 'Jenjang',
  },
  {
    path: '/admin/account',
    icon: <TbUserSquareRounded className={iconClasses}/>, 
    name: 'Akun',
  },
  {
    path: '/admin/leads', // url
    icon: <InboxArrowDownIcon className={iconClasses}/>, // icon component
    name: 'Leads', // name that appear in Sidebar
  },
  {
    path: '/admin/transactions', // url
    icon: <CurrencyDollarIcon className={iconClasses}/>, // icon component
    name: 'Transactions', // name that appear in Sidebar
  },
  {
    path: '/admin/charts', // url
    icon: <ChartBarIcon className={iconClasses}/>, // icon component
    name: 'Analytics', // name that appear in Sidebar
  },
  {
    path: '/admin/integration', // url
    icon: <BoltIcon className={iconClasses}/>, // icon component
    name: 'Integration', // name that appear in Sidebar
  },
  {
    path: '/admin/calendar', // url
    icon: <CalendarDaysIcon className={iconClasses}/>, // icon component
    name: 'Calendar', // name that appear in Sidebar
  },

  {
    path: '', //no url needed as this has submenu
    icon: <DocumentDuplicateIcon className={`${iconClasses} inline` }/>, // icon component
    name: 'Pages', // name that appear in Sidebar
    submenu : [
      {
        path: '/login',
        icon: <ArrowRightOnRectangleIcon className={submenuIconClasses}/>,
        name: 'Login',
      },
      {
        path: '/register', //url
        icon: <UserIcon className={submenuIconClasses}/>, // icon component
        name: 'Register', // name that appear in Sidebar
      },
      {
        path: '/forgot-password',
        icon: <KeyIcon className={submenuIconClasses}/>,
        name: 'Forgot Password',
      },
      {
        path: '/admin/blank',
        icon: <DocumentIcon className={submenuIconClasses}/>,
        name: 'Blank Page',
      },
      {
        path: '/admin/404',
        icon: <ExclamationTriangleIcon className={submenuIconClasses}/>,
        name: '404',
      },
    ]
  },
  {
    path: '', //no url needed as this has submenu
    icon: <Cog6ToothIcon className={`${iconClasses} inline` }/>, // icon component
    name: 'Settings', // name that appear in Sidebar
    submenu : [
      {
        path: '/admin/settings-profile', //url
        icon: <UserIcon className={submenuIconClasses}/>, // icon component
        name: 'Profile', // name that appear in Sidebar
      },
      {
        path: '/admin/settings-billing',
        icon: <WalletIcon className={submenuIconClasses}/>,
        name: 'Billing',
      },
      {
        path: '/admin/settings-team', // url
        icon: <UsersIcon className={submenuIconClasses}/>, // icon component
        name: 'Team Members', // name that appear in Sidebar
      },
    ]
  },
  {
    path: '', //no url needed as this has submenu
    icon: <DocumentTextIcon className={`${iconClasses} inline` }/>, // icon component
    name: 'Documentation', // name that appear in Sidebar
    submenu : [
      {
        path: '/admin/getting-started', // url
        icon: <DocumentTextIcon className={submenuIconClasses}/>, // icon component
        name: 'Getting Started', // name that appear in Sidebar
      },
      {
        path: '/admin/features',
        icon: <TableCellsIcon className={submenuIconClasses}/>, 
        name: 'Features',
      },
      {
        path: '/admin/components',
        icon: <CodeBracketSquareIcon className={submenuIconClasses}/>, 
        name: 'Components',
      }
    ]
  },
  
]

export default routes


