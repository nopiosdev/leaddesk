import { postApi, getApi } from "../api";

export const createLeave = async data => postApi("leave/CreateLeave", data);

export const GetLeaveList = async (userId) => getApi("leave/GetUserLeaves?userId=" + userId);

export const GetLeaveStatusList = async () => getApi("leave/GetLeaveTypeList");


