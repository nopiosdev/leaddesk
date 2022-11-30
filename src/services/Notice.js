import { postApi,  getApi } from "../Utils/RestClient";

export const SaveNotice = async data =>  postApi("notice/SaveNoticeBoard",data);
export const getNotice = async (CompanyId) => getApi("notice/GetNoticeBoardByCompanyId?CompanyId="+CompanyId);
export const getNoticedetail = async (Id) => getApi("notice/GetNoticeBoardById?Id="+Id);

