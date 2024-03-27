import {month} from "react-big-calendar/lib/utils/dates";
import Requests from "../API/requests";

export function toLocalDateInputField(date) {
    const localTimeStringFormatted = date.toLocaleTimeString('UK', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
    });

    return `${date.getFullYear()}-${
        date.toLocaleDateString('UK', {month: '2-digit'})}-${
        date.toLocaleDateString('UK', {day: '2-digit'})}T${
        localTimeStringFormatted}`;
}

export function hexToRgba(hex, alpha = 1) {
    const hexColor = hex.replace(/^#/, '');
    const bigint = parseInt(hexColor, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function blockEvents(event) {
    event.stopPropagation();
}

export function calculateEventLeft(column, countColumns) {
    return column * 100 / countColumns;
}

export function calculateEventH(day_event, currentViewDate) {
    let start = getDateMinutes(day_event.startAt, currentViewDate);
    let end = getDateMinutes(day_event.endAt, currentViewDate);
    return getEventHeightPercent(start, end);
}

export function getEventHeightPercent(start, end){
    return (end - start) * 100 / (24 * 60);
}

export function getDateMinutes(targetDate, currentViewDate){
    if (targetDate.getDate() < currentViewDate.getDate())
        return 0;
    if (targetDate.getDate() > currentViewDate.getDate()){
        return 23 * 60 + 59;
    }
    return targetDate.getHours() * 60 + targetDate.getMinutes();
}

export function toShortDateFormat(date = new Date()){
    return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
}
export function toMonthTitleFormat(day){
    let month = day.toLocaleDateString(undefined, { month: 'long' });
    month = month.charAt(0).toUpperCase() + month.slice(1);
    return `${month} ${day.getFullYear()}`;
}

export function getStartEndMonthByDate(date = new Date()){
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);
    return [startOfMonth, endOfMonth];
}

export function getStartEndWeekByDate(date = new Date()) {
    const currentDate = new Date(date);
    const currentDay = currentDate.getDay();

    // Если текущий день - воскресенье, то сдвигаемся на прошлую неделю
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(startOfWeek.getDate() - currentDay + (currentDay === 0 ? -6 : 1));

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 7);

    return [startOfWeek, endOfWeek];
}



export function getStartEndOfDateByDate(date = new Date()) {
    const start = new Date(date);
    const end = new Date(date);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    return [start, end];
}

export function cropDateToCurrent(targetDate = new Date(), currentDate = new Date()){
    const dateBounds = getStartEndOfDateByDate(currentDate);
    if (targetDate.getTime() < dateBounds[0].getTime())
        return dateBounds[0];
    if (targetDate.getTime() > dateBounds[1].getTime())
        return dateBounds[1];
    return targetDate;
}

export function isEventsHasSameTime(event1, event2) {
    // Извлекаем начальные и конечные даты для каждого события
    const start1 = event1.startAt.getTime();
    const end1 = event1.endAt.getTime();
    const start2 = event2.startAt.getTime();
    const end2 = event2.endAt.getTime();

    // Проверяем пересечение временных интервалов
    const intersects = (start1 <= end2) && (end1 >= start2);

    return intersects;
}

export function toShortDayTitle(date = new Date()) {
    return date.toLocaleDateString(undefined,
        { weekday: 'short', day: 'numeric' }).toUpperCase();
}

export function getWeekNumber(date) {
    // Получаем дату первого дня текущего года
    var firstDayOfYear = new Date(date.getFullYear(), 0, 1);

    // Получаем разницу в миллисекундах между текущей датой и первым днем года
    var diff = date.getTime() - firstDayOfYear.getTime();

    // Рассчитываем количество дней, прошедших с начала года
    var dayOfYear = Math.ceil(diff / (1000 * 3600 * 24));

    // Рассчитываем номер недели
    var weekNumber = Math.ceil(dayOfYear / 7);

    return weekNumber;
}

export function getWeekDates(anyDayOfWeek = new Date()) {
    const result = [];
    const currentDay = anyDayOfWeek.getDay();
    const startDate = new Date(anyDayOfWeek);

    // Вычисляем начало текущей недели (понедельник)
    startDate.setDate(startDate.getDate() - currentDay + (currentDay === 0 ? -6 : 1));

    // Генерируем массив с датами текущей недели
    for (let i = 0; i < 7; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);
        result.push(currentDate);
    }
    return result;
}

//заполнение цвета и дат после запроса
export function fillEventsFullData(events, calendarData) {
    events.forEach((event) => {
        event.startAt = new Date(event.startAt);
        event.endAt = new Date(event.endAt);
        if (!('color' in event) && 'color' in calendarData) {
            event.color = calendarData.color;
        }
    });
    return events;
}

export function filterEventsToTargetDate(targetDate = new Date(), events = []) {
    targetDate.setHours(0,0,0,0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999); // Устанавливаем конец дня (23:59:59.999)

    const eventsOnTargetDate = events.filter(
        event => event.startAt <= endOfDay && event.endAt >= targetDate
    );

    return eventsOnTargetDate
        .sort((a, b) => a.startAt.getTime() - b.startAt.getTime()
            || (b.endAt.getTime() - b.startAt.getTime()) - (a.endAt.getTime() - a.startAt.getTime()));
}

export function getDaysInMonth(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysArray = [];

    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        daysArray.push(date);
    }

    return daysArray;
}

export function logout() {
    localStorage.removeItem('user_id');
    localStorage.removeItem('token');
    localStorage.removeItem('defaultCalendar');
    window.location.href = `${window.location.origin}/login`;
}



