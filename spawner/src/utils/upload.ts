require('dotenv').config()
import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import fs from 'fs'
import path from 'path';

export async function upload(filepath:string,filename:string){
    const s3Client = new S3Client({
        region: 'us-east-1',
        credentials:{
            accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ""
        }
    })

    const bucketName='phantom-ai';
    try {
        await s3Client.send(
            new PutObjectCommand({
                Bucket: bucketName,
                Key: filename,
                ContentType: 'video/webm',
                ContentDisposition: "inline",
                Body: fs.createReadStream(filepath),
                Metadata: {
                    'Content-Disposition': 'inline',
                    'Content-Type': 'video/webm'
                }
                
    
            })
        )
        return `https://phantom-ai.s3.amazonaws.com/${filename}`
    } catch (error:any) {
        console.log("Error Uploading the video to S3")
        
    }
    

    

}



