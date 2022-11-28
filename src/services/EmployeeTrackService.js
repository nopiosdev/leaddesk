import { postApi, getApi } from "../Utils/RestClient";

export const CreateTracking = async data => postApi("RtEmployeeTrackingApi/CreateTracking", data);
export const CreateLeavingReason = async data => postApi("RtEmployeeApi/CreateLeavingReason", data);
export const GetTrackingByUserIdAndTodayDate = async (empId, date) => getApi("RtEmployeeTrackingApi/GetTrackingByUserIdAndTodayDate?employeeId=" + empId + "&date=" + date);
//export const GetAttendanceFeed = async (companyId,trackType,date) => getApi("RtEmployeeApi/GetAttendanceFeed?companyId="+companyId+"&trackType="+trackType+"&date="+date);
export const EmployeeList = async (companyId) => getApi("employee/GetEmployeeAsTextValue?companyId=" + companyId);
export const GetAttendanceFeed = async (companyId) => getApi("attendance/GetAttendanceFeed?companyId=" + companyId);
export const GetMyTodayAttendance = async (userId) => getApi("attendance/GetMyTodayAttendance?userId=" + userId);
export const GetMovementDetails = async (userId) => getApi("attendance/GetMovementDetails?userId=" + userId);
export const GetMovementDetailsAll = async (companyId) => getApi("attendance/GetMovementDetailsAll?companyId=" + companyId);
export const GetLeaderboardData = async (companyId, month, year) => getApi("attendance/GetLeaderboardData?companyId=" + companyId + "&month=" + month + "&year=" + year);