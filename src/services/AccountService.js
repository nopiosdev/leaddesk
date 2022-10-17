import { postApi, deleteApi, getApi } from "./api";

export const GetEmpInfoByUserId = async (userId, date) => getApi("RtEmployeeApi/GetEmpInfo?userId=" + userId + "&date=" + date);
export const GetEmployeeWithCompanyId = async (companyId) => getApi("employee/GetEmployeeByCompanyId?companyId=" + companyId);
// export const CreateAccount = async data => postApi("RtAccountApi/Register", data);
export const CreateAccount = (UserFullName, PhoneNumber, CompanyName, Password, Password_confirmation, Email, gender) => {
    var data = new FormData();
    data.append('fullName', UserFullName);
    data.append('phoneNumber', PhoneNumber);
    data.append('companyName', CompanyName);
    data.append('password', Password);
    data.append('cpassword', Password_confirmation);
    data.append('email', Email);
    data.append('gender', gender);
    console.log('first',data)
    return postApi("user/Register", data)
};

export const ChangePasswords = async data => postApi("User/changepassword", data);
export const ChangePasswordforEmp = async data => postApi("User/resetpassword", data);

export const CreateEmployee = async data => postApi("employee/CreateEmployee", data);
export const UpdateEmployee = async data => postApi("employee/EditEmployee", data);

export const Login = async data => postApi("user/Login", data);

export const GetUserClaim = async (userKey) => getApi("user/GetUserClaims?userKey=" + userKey);
export const DeleteEmployee = async (id) => deleteApi("RtEmployeeApi/DeleteEmployee?id=" + id);
export const getTokenforResetEmptPass = async (userId) => getApi("GetResetPasswordToken?userId=" + userId);

export const CheckExistPhone = async (PhoneNumber) => getApi("RtAccountApi/CheckExistPhone?phoneno=" + PhoneNumber);
export const VerifyEmail = async email => postApi("account/VerifyEmail/" + email);
export const VerifyCurrentPassword = async password => postApi("account/VerifyCurrentPassword/" + password);
export const ResetPassword = async (email, password) => postApi("account/ResetPassword/" + email + "/" + password);
export const SendOTP = async (userName) => postApi("account/SendOTP/" + userName);
export const ChangePassword = async (data) => postApi("user/ChangePassword/",data);
export const AddDeviceToken = async deviceToken => postApi("account/DeviceToken/" + deviceToken, null, null);
export const RemoveDeviceToken = async deviceToken => deleteApi("account/DeviceToken/" + deviceToken, null, null);