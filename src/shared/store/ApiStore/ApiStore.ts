import {ApiResponse, HTTPMethod, IApiStore, RequestParams, StatusHTTP} from './types';
import qs from 'qs';
export default class ApiStore implements IApiStore {
    constructor(readonly baseUrl: string) {
    }

    private fetchParams<ReqT>({endpoint, method, headers, data}: RequestParams<ReqT>): [string, RequestInit]{
        const reqInit:RequestInit = {method: method, headers: headers,};
        let url = `${this.baseUrl}${endpoint}`;
        if(method===HTTPMethod.POST){
            reqInit.body = JSON.stringify(data);
        }
        if(method===HTTPMethod.GET){
            url += `?${qs.stringify(data)}`
        }
        return [url, reqInit];
    }

    async request<SuccessT, ErrorT = any, ReqT = {}>(params: RequestParams<ReqT>): Promise<ApiResponse<SuccessT, ErrorT>> {
        try {
            let response: Response = await fetch(...this.fetchParams(params));
            let apiRes = {
                success: true,
                data: await response.json(),
                status: response.status
            }
            if (!response.ok) {
                apiRes.success= false;
            }
            return apiRes;
        }
        catch (e){
            return {
                success: false,
                data: e,
                status: StatusHTTP.BadRequest
            }
        }
    }
}
