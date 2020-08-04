import { Req, Res, Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { aws } from "../../config/app";

const AWS_S3_BUCKET_NAME = aws.bucket;
const s3 = new AWS.S3({
    accessKeyId: aws.keyid,
    secretAccessKey: aws.secretid,
})

@Injectable()
export class AwsUpload {
    constructor() { }

//        const fileType = (file.mimetype).split('/');
    async fileupload(id:any ,file: any): Promise<string> {
        const fileType = (file.mimetype).split('/');
        const urlkey = `${id}.${fileType[1]}`
        const params = {
            Body: file.buffer,
            Bucket: AWS_S3_BUCKET_NAME,
            Key: urlkey,
        }

        const data = await s3
            .putObject(params)
            .promise()
            .then(
                data =>{
                    return urlkey
                },
                err => {
                    return err
                }
            );
        
            return `https://${AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${data}`
    }

}