export default class CustomResponse {
    private success: boolean;
    private message: string | null;
    private data: object;

    constructor(status: boolean, message: string | null, data: object) {
        this.success = status;
        this.message = message;
        this.data = data;
    }
}
