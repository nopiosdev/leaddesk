import { postApi, getApi, loginPostApi } from "./api";

export const CreateDepartment = async data => postApi("department/CreateDepartment", data);
export const updatedepartment = async data => postApi("department/UpdateDepartment", data);
export const GetDepartmentByCompanyId = async (companyId) => getApi("department/GetDepartmentByCompanyId?companyId=" + companyId);