import { postApi,  getApi } from "../Utils/RestClient";

export const GetAllEmployeeAttendanceWithMonth = async ( companyId,month,year) => getApi("attendance/GetAllEmployeeAttendanceWithMonth?companyId="+companyId+"&month="+month+"&year="+year);
export const GetEmpInfoByUserId = async (userId,date) => getApi("RtEmployeeApi/GetEmpInfo?userId="+userId+"&date="+date);
export const GetMonthlyAttendanceDetails = async ( userId,companyId,year,month) => getApi("attendance/GetMonthlyAttendanceDetails?userId="+userId+"&companyId="+companyId+"&year="+year+"&month="+month);


