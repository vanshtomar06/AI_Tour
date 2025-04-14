// export const SelectTravelasList = [
//     {
//         id: 1,
//         title: 'Just Me',
//         desc: 'A sole traveles in exploration',
//         icon: '',
//         people: '1'
//     },
//     {
//         id: 2,
//         title: 'A Couple',
//         desc: 'Two Traveles in tandem',
//         icon: '',
//         people: '2 People'
//     },
//     {
//         id: 3,
//         title: 'Family',
//         desc: 'A group of fun loving Adventure',
//         icon: '',
//         people: '3 to 5 People'
//     },
//     {
//         id: 4,
//         title: 'Friends',
//         desc: 'A bunch of thrill-seekes',
//         icon: '',
//         people: '5 to 10 people'
//     },

// ]

// export const SelectBudgetOptions = [
//     {
//         id: 1,
//         title: 'Cheap',
//         desc: 'Stay conscious of costs',
//         icon: '',
//     },
//     {
//         id:2,
//         title: 'Moderate',
//         desc: 'Keep cost on the average side',
//         icon: '',
//     },
//     {
//         id:3,
//         title: 'Luxury',
//         desc:'Dont worry about the cost',
//         icon:'',
//     },
// ]

// export const AI_PROMPT ='Generate Travel Plan for Location: {Location}'

import { FaUser, FaUsers, FaChild, FaUserFriends } from 'react-icons/fa';
import { FaMoneyBillWave, FaBalanceScale, FaGem } from 'react-icons/fa';

export const SelectTravelasList = [
  {
    id: 1,
    title: 'Just Me',
    desc: 'A sole traveler in exploration',
    icon: <FaUser />,
    people: '1',
  },
  {
    id: 2,
    title: 'A Couple',
    desc: 'Two travelers in tandem',
    icon: <FaUsers />,
    people: '2 People',
  },
  {
    id: 3,
    title: 'Family',
    desc: 'A group of fun-loving adventurers',
    icon: <FaChild />,
    people: '3 to 5 People',
  },
  {
    id: 4,
    title: 'Friends',
    desc: 'A bunch of thrill-seekers',
    icon: <FaUserFriends />,
    people: '5 to 10 People',
  },
];

export const SelectBudgetOptions = [
  {
    id: 1,
    title: 'Cheap',
    desc: 'Stay conscious of costs',
    icon: <FaMoneyBillWave />,
  },
  {
    id: 2,
    title: 'Moderate',
    desc: 'Keep cost on the average side',
    icon: <FaBalanceScale />,
  },
  {
    id: 3,
    title: 'Luxury',
    desc: "Don't worry about the cost",
    icon: <FaGem />,
  },
];
