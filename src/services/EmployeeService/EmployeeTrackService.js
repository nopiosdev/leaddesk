import { postApi,  getApi } from "../../Utils/RestClient";

export const CheckIn = async data =>  postApi("attendance/CheckIn",data);
export const CheckOut = async data =>  postApi("attendance/CheckOut",data);
export const CheckPoint = async data =>  postApi("attendance/CheckPoint",data);

export const GetAttendanceFeed = async (companyId) => getApi("employee/GetEmpAttendanceFeed?companyId="+companyId);
export const EmployeeList = async (companyId) => getApi("RtEmployeeApi/GetEmployeeAsTextValue?companyId="+companyId);
