const CombineRoute = {
  EMPTY: "/empty",
  TE: {
    OVERVIEW: "/te/over-view",
    RECRUITMENT: "/te/manager/recruitment",
    RECRUITMENT_CALENDAR: "/te/manager/recruitment/calendar",
    RECRUITMENT_DETAIL_CANDIDATE: "/te/manager/recruitment/[candidateId]",
    RECRUITMENT_CREATE_CANDIDATE: "/te/manager/recruitment/create-candidate",
    MANAGER: {
      CLASS: "/te/manager/class",
      DETAILCLASS: "/te/manager/class/detail/[classId]",
      COURSE: "/te/manager/course",
      SAVE: "/te/manager/save",
      FEEDBACK: "/te/manager/feedback",
      TEACHER: "/te/manager/teacher",
      TEACHERRANK: "/te/manager/teacher/rank",
      TEACHERSALARY: "/te/manager/teacher/salary",
      DETAILTEACHER: "/te/manager/teacher/detail/[teacherId]",
      TEMPLATE_MAIL: "/te/manager/template-mail",
    },
    CALENDAR: "/te/calendar",
    SETTING: "/te/setting",
    HELP: "/te/help",
    LOCATION: "/te/location",
    AREA: "/te/area",
    TIMESCHEDULE: "/te/timeschedule",
  },
  TEACHER: {
    OVERVIEW: "/teacher/over-view",
    TEACHERINFO: "/teacher/teacher-info",
    RECRUITMENT: "/te/manager/recruitment",
    RECRUITMENT_DETAIL_CANDIDATE: "/te/manager/recruitment/[candidateId]",
    RECRUITMENT_CREATE_CANDIDATE: "/te/manager/recruitment/create-candidate",
    CLASS: "/teacher/class",
    COURSE: '/teacher/course',
    DETAILCLASS: "/teacher/class/detail/[classId]",
    CALENDAR: "/te/calendar",
    SETTING: "/te/setting",
    HELP: "/te/help",
    LOCATION: "/teacher/location",
    TIMESCHEDULE: "/te/timeschedule",
  },
};
export default CombineRoute;
