export interface IApproval {
	id: SVGStringList; //view URL
	name: string; //guid
	properties: {
		allowCancel: boolean;
		approvers: string[]; //array of guids
		creationDate: string; //iso date
		details: string; //approval request description
		dueDate: string; //iso date
		expirationDate: string; //iso date
		isActive: boolean;
		item: {
			link: string;
			displayName: string;
		};
		owner: IApprovalUser;
		principals: IApprovalPrincipal[];
		priority: string;
		requestType: string;
		title: string;
		type: string;
		userRequest: {
			stage: string;
			creationDate: string;
			dueDate: string;
			expirationDate: string;
			assignedTo: IApprovalUser;
			allowReassignment: boolean;
			isReassigned: boolean;
			responseOptions: string[]; //["Approve", "Reject"]
		};
		userRoles: string; //["Owner", "Approver"]
	};

	type: string; //"/providers/Microsoft.ProcessSimple/environments/approvalViews"
}

export interface IApprovalUser {
	id: string; //guid
	type: string; //"User"
	tenantId: string; //guid
}

export interface IApprovalPrincipal {
	displayName: string;
	email: string;
	id: string;
	tenantId: string;
	thumbnailPhoto: string;
	type: string;
	userPrincipalName: string;
}

export interface IApprovalResponse {
	id: string;
	name: string;
	properties: {
		comments: string;
		creationDate: string;
		owner: {
			id: string;
			tenantId: string;
			type: string;
		};
		response: string;
		stage: string;
		status: string;
		type: string;
	};
}

export interface IReassignResponse {
	id: string;
	name: string;
	properties: {
		allowReassignment: boolean;
		assignedTo: IApprovalUser;
		creationDate: string;
		dueDate: string;
		expirationDate: string;
        isReassigned: boolean;
        notificationFrequency: number;
        reassignedFrom: IApprovalUser;
        responseOptions: string[];
        responseOptionsType: string;
        stage: string;
	};
	type: string;
}
