import { postApi, getApi } from "../Utils/RestClient";

export const CreateCompany = async data => postApi("company/CreateCompany", data);
export const updatedeCompany = async data => postApi("company/UpdateCompany", data);
export const GetCompanyByUserId = async (userId) => getApi("company/GetCompanyByUserId?userId=" + userId);
export const GetCompanyByIdentity = async () => getApi("RtCompanyApi/GetCompanyByIdentity");
