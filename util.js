import Moment from 'moment';

export const  getYearMonth= (day)=> Moment(day).format('YYYY.MM');

export const getDateFormat = (day) => Moment(day).format('YYYY-MM-DD');

export const getRegstrationDayFormat = (day) => Moment(day).format('YYYY.MM.DD');

export const  getFormattedRegDate = (day) => {
    let daysDiff = Moment().diff(Moment(day, 'YYYYMMDD'), 'days');
    if (daysDiff > 1) {
        return Moment(day).format('YY.MM.DD HH:MM');
    } else if (daysDiff === 1) {
        return '어제 ' + Moment(day).format('HH:MM');
    } else {
        return '오늘 ' + Moment(day).format('HH:MM');
    }
}