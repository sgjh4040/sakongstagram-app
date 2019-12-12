import Moment from 'moment';


export const  getYearMonth= (day)=> Moment(day).format('YYYY.MM');

export const getDateFormat = (day) => Moment(day).format('YYYY-MM-DD');

export const getRegstrationDayFormat = (day) => Moment(day).format('YYYY.MM.DD');