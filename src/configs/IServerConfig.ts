import Endpoint from 'entities/endpoint/endpoint';

export default interface IServerCongig {
	port:number;
	globalMiddlewares:[];
	errorMiddlewares:[];
	endpoints:Endpoint[];
	initCallbacks:any[];
	shutdownCallbacks:any[];
}



