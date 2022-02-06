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
        let response:any ;
        if(Object.keys(data).length === 0){ // Request with GET/HEAD method cannot have body.
             response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: method,
                headers: headers,
            })
        }else{
            response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: method,
                headers: headers,
                body: JSON.stringify(data)
            })
        }
            if (response.status==200 || response.status==201) {
                return {
                    success: true,
                    data: await response.json(),
                    status: StatusHTTP.OK,
                }
            }else if(response.status==422){
                return {
                    success: false,
                    data: await response.json(),
                    status: StatusHTTP.UnprocessableEntity,
                }
            }else if(response.status==401) {
                return {
                    success: false,
                    data: await response.json(),
                    status: StatusHTTP.Unauthorized,
                }
            }
            return {
                success: false,
                data: await response.json(),
                status: StatusHTTP.NotFound
            }
    }
}
