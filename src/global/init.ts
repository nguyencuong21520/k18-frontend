import { STATUS_CLASS } from "./enum";

const statusClass: Record<STATUS_CLASS, STATUS_CLASS> = {
    RUNNING: STATUS_CLASS.RUNNING,
    DROP: STATUS_CLASS.DROP,
    FINISH: STATUS_CLASS.FINISH,
    PREOPEN: STATUS_CLASS.PREOPEN
}
const fieldFilter = {
    SUBJECT: 'SUBJECT',
    STATUS: 'STATUS',
    CODE_CLASS_LEVEL: 'CODE_CLASS_LEVEL',
    STYLE: 'STYLE',
    TEACHER: 'TEACHER',
    OPEN_SCHEDULE: 'OPEN_SCHEDULE',
    TIME_SCHEDULE: 'TIME_SCHEDULE'
};
export {
    statusClass,
    fieldFilter
}