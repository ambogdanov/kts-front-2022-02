import {ApiResponse, IApiStore, RequestParams, StatusHTTP} from "./types";

export default class ApiStore implements IApiStore {
    constructor(readonly baseUrl: string) {
        // TODO: Примите из параметров конструктора baseUrl
        // и присвойте его в this.baseUrl
    }

    async request<SuccessT, ErrorT = any, ReqT = {}>({
                                                         endpoint,
                                                         method,
                                                         headers,
                                                         data
                                                     }: RequestParams<ReqT>): Promise<ApiResponse<SuccessT, ErrorT>> {
        // TODO: Напишите здесь код, который с помощью fetch будет делать запрос
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: method,
                headers: headers,
            })
            if (response.ok) {
                return {
                    success: true,
                    data: await response.json(),
                    status: StatusHTTP.OK,
                }
            }
            return {
                success: false,
                data: await response.json(),
                status: StatusHTTP.NotFound
            }
    }
}
