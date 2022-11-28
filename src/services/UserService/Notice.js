import { postApi,  getApi } from "../../Utils/RestClient";
export const getNotice = async (CompanyId) => getApi("RtNoticeBoardApi/GetNoticeBoardByCompanyId?CompanyId="+CompanyId, {}, {});
export const getNoticedetail = async (Id) => getApi("RtNoticeBoardApi/GetNoticeBoardById?Id="+Id, {}, {});
