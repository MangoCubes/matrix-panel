export class HTTPError extends Error{
	constructor(public errCode: number, public mCode: string){
		super();
	}
}