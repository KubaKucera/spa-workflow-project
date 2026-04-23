import { UserState, UserRole } from '../models/User.js';

export const AuthorizationRules = {
    
    canApproveRequest: (user) => {
        return user.state === UserState.ACTIVE && user.role === UserRole.APPROVER;
    },
    
    canCreateRequest: (user) => {
        return user.state === UserState.ACTIVE && 
              (user.role === UserRole.REQUESTER || user.role === UserRole.APPROVER);
    }
};
