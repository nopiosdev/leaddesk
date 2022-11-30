import { postApi,  getApi } from "../../Utils/RestClient";


export const GetInvoice = async (id) => getApi("RtFinancialApi/GetInvoice?id="+id, {}, {});
export const GetMyInvoiceList = async (userId) => getApi("RtFinancialApi/GetMyInvoiceList?userId="+userId, {}, {});

