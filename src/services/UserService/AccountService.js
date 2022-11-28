import {postApi, deleteApi, getApi } from "../../Utils/RestClient";


export const ChangePasswordforEmp = async data => postApi("User/resetpassword", data);

export const Login = async data => postApi("RtAccountApi/LoginUser", data);

export const UpdateEmployee = async data => postApi("employee/EditEmployee", data);

export const GetUserClaim = async (userKey) => getApi("RtAccountApi/GetUserClaims?userKey="+userKey);
