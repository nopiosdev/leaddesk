import { postApi, getApi } from "../Utils/RestClient";

export const GetRelatedToMeTasks = async (userId) => getApi("task/GetRelatedToMeTasks?userId=" + userId);
export const SaveTask = async data => postApi("task/SaveTask", data);
export const GetGroups = async (companyId) => getApi("RtTaskApi/GetGroups?companyId=" + companyId);
export const SaveTaskGroup = async data => postApi("RtTaskApi/SaveTaskGroup", data);
export const TaskStatus = async () => getApi("task/GetTaskStatusList");
export const GetTaskByGroup = async (groupId) => getApi("RtTaskApi/GetTasksByGroup?groupId=" + groupId);
export const deleteTask = async (taskId) => getApi("task/DeleteTask?taskId=" + taskId);
export const PriorityList = async () => getApi("task/GetPriorityList");
export const upLoadImage = async (data) => postApi("task/UploadDocuments", data);
export const GetTaskAttachments = async (taskId) => getApi("task/GetTaskAttachments?taskId=" + taskId);








