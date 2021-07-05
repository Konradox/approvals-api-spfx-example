export class ApprovalsService {
	protected tenantId: string;

	constructor(protected context: WebPartContext) {}

	public async getMyApprovals(): Promise<IApproval[]> {
		return (
			await this.getData<{ value: IApproval[] }>(
				"/approvalViews?$top=50&$filter=properties/userRole+eq+'Owner'+and+properties/isActive+eq+'true'+and+properties/isDescending+eq+'true'&api-version=2016-11-01"
			)
		).value;
	}

	public async approve(approvalName: string, comment: string): Promise<IApprovalResponse> {
		return this.postData<IApprovalResponse>(`/approvals/${approvalName}/approvalResponses?api-version=2016-11-01`, {
			properties: { response: "Approve", comments: comment },
		});
	}

	public async reject(approvalName: string, comment: string): Promise<IApprovalResponse> {
		return this.postData<IApprovalResponse>(`/approvals/${approvalName}/approvalResponses?api-version=2016-11-01`, {
			properties: { response: "Reject", comments: comment },
		});
	}

	public async reassign(approvalName: string, assignedToEmail: string): Promise<IReassignResponse> {
		return this.postData<IReassignResponse>(`/approvals/${approvalName}/reassign?api-version=2016-11-01`, { assignedTo: assignedToEmail });
	}

	protected getBaseUrl(accessToken: string): string {
		return `https://api.flow.microsoft.com/providers/Microsoft.ProcessSimple/environments/Default-${this.getTenantId(accessToken)}`;
	}

	protected getTenantId(accessToken: string): string {
		if (!this.tenantId) {
			const jwtToken = AccessTokenHelper.getTokenInfo(accessToken);
			this.tenantId = jwtToken.tid;
		}
		return this.tenantId;
	}

	protected async getData<T>(url: string): Promise<T> {
		try {
			const aadTokenProvider = await this.context.aadTokenProviderFactory.getTokenProvider();
			const accessToken = await aadTokenProvider.getToken("https://service.flow.microsoft.com/"); // I recommend to implement token caching in local/session storage
			const response: HttpClientResponse = await this.context.httpClient.get(
				`${this.getBaseUrl(accessToken)}${url}`,
				HttpClient.configurations.v1,
				{
					headers: {
						authorization: `Bearer ${accessToken}`,
						accept: "application/json",
					},
				}
			);
			return this.processResponse<T>(response);
		} catch (err) {
			Log.error("ApprovalsProvider", err);
			throw err;
		}
	}

	protected async postData<T>(url: string, body: any): Promise<T> {
		try {
			const aadTokenProvider = await this.context.aadTokenProviderFactory.getTokenProvider();
			const accessToken = await aadTokenProvider.getToken("https://service.flow.microsoft.com/"); // I recommend to implement token caching in local/session storage
			const response: HttpClientResponse = await this.context.httpClient.post(
				`${this.getBaseUrl(accessToken)}${url}`,
				HttpClient.configurations.v1,
				{
					body: JSON.stringify(body),
					headers: {
						authorization: `Bearer ${accessToken}`,
						accept: "application/json",
					},
				}
			);
			return this.processResponse<T>(response);
		} catch (err) {
			Log.error("ApprovalsProvider", err);
			throw err;
		}
	}

	protected async processResponse<T>(response): Promise<T> {
		if (response.ok) {
			const result: T = await response.json();
			return result;
		} else {
			throw new Error(await response.text());
		}
	}
}
