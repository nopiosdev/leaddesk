import { postApi, deleteApi, getApi } from "../Utils/RestClient";


export const GetEmployeeWithCompanyId = async (companyId) => getApi("employee/GetEmployeeByCompanyId?companyId=" + companyId);
export const ChangePasswordforEmp = async data => postApi("User/resetpassword", data);
export const CreateEmployee = async data => postApi("employee/CreateEmployee", data);
export const UpdateEmployee = async data => postApi("employee/EditEmployee", data);
export const Login = async data => postApi("user/Login", data);
export const DeleteEmployee = async (id) => deleteApi("RtEmployeeApi/DeleteEmployee?id=" + id);
export const getTokenforResetEmptPass = async (userId) => getApi("GetResetPasswordToken?userId=" + userId);
export const ResetPassword = async (email, password) => postApi("account/ResetPassword/" + email + "/" + password);
export const ChangePassword = async (data) => postApi("user/ChangePassword/", data);
export const AddDeviceToken = async (data) => postApi("user/CreateToken/", data);
export const CreateAccount = (UserFullName, PhoneNumber, CompanyName, Password, Password_confirmation, Email, gender) => {
    var data = new FormData();
    data.append('fullName', UserFullName);
    data.append('phoneNumber', PhoneNumber);
    data.append('companyName', CompanyName);
    data.append('password', Password);
    data.append('cpassword', Password_confirmation);
    data.append('email', Email);
    data.append('gender', gender);
    console.log('first', data)
    return postApi("user/Register", data)
};