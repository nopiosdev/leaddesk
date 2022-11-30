import { postApi, getApi } from "../Utils/RestClient";

export const EmployeeList = async (companyId) => getApi("employee/GetEmployeeAsTextValue?companyId=" + companyId);
export const GetAttendanceFeed = async (companyId) => getApi("attendance/GetAttendanceFeed?companyId=" + companyId);
export const GetMyTodayAttendance = async (userId) => getApi("attendance/GetMyTodayAttendance?userId=" + userId);
export const GetMovementDetails = async (userId) => getApi("attendance/GetMovementDetails?userId=" + userId);
export const GetMovementDetailsAll = async (companyId) => getApi("attendance/GetMovementDetailsAll?companyId=" + companyId);
export const GetLeaderboardData = async (companyId, month, year) => getApi("attendance/GetLeaderboardData?companyId=" + companyId + "&month=" + month + "&year=" + year);