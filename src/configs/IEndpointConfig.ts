import express from 'express';

export interface IEndpointConfig{
	path:string;
	method:Method;
	middleWares:[];
	handler:(req:express.Request,res:express.Response)=>void;
	validator:{};
	authType:AuthType;
}

export enum AuthType{
	JWT,
	HMAC,
	NONE
}

export enum Method{
	GET = 'get',
	POST = 'post',
	PUT = 'put',
	DELETE = 'delete'
}