export class HTTPError extends Error{
	constructor(public errCode: number){
		super();
	}
}