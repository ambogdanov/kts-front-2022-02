import {ApiResponse, HTTPMethod, IApiStore, RequestParams, StatusHTTP} from './types';

export default class ApiStore implements IApiStore {
    constructor(readonly baseUrl: string) {
    }

    private fetchParams<ReqT>({endpoint, method, headers, data}: RequestParams<ReqT>): [string, RequestInit]{
        const reqInit:RequestInit = {method: method, headers: headers,};
        const url:string = `${this.baseUrl}${endpoint}`;
        if(method===HTTPMethod.POST){
            reqInit.body = JSON.stringify(data);
        }
        return [url, reqInit];
    }

    async request<SuccessT, ErrorT = any, ReqT = {}>(params: RequestParams<ReqT>): Promise<ApiResponse<SuccessT, ErrorT>> {
        // TODO: Напишите здесь код, который с помощью fetch будет делать запрос
        let response: Response = await fetch(...this.fetchParams(params));
        let apiRes = {
            success: true,
            data: await response.json(),
            status: response.status
        }
        if (response.status >= StatusHTTP.BadRequest) {
            apiRes.success= false;
        }
        return apiRes;
    }
}
