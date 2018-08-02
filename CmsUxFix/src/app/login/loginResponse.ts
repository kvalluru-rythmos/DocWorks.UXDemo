export class LoginResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
  firstName: string;
  lastName: string;
  userId: string;
  userPrincipalName: string;
  profilePicUrl: string;
  profileShortName: string;
}


export class Profile {
  firstName: string;
  lastName: string;
  userId: string;
  userPrincipalName: string;
  profilePicUrl: string;
  profileShortName: string;
}
