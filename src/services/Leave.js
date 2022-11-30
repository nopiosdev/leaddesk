import { postApi, getApi } from "../Utils/RestClient";



export const GetAdminLeaveList = async (CompanyId) => getApi("leave/GetLeaveByCompanyId?companyId=" + CompanyId);
export const GetUserLeaves = async (userId) => getApi("leave/GetUserLeaves?&userId=" + userId);

export const LeaveApproved = async (id, userId) => getApi("leave/Approved?id=" + id + "&userId=" + userId);
export const LeaveRejected = async (id) => getApi("leave/Rejected?id=" + id);
