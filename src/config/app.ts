import * as dotenv from "dotenv";
import * as config from 'config';

const dbConfig = config.get('db');
const awsConfig = config.get('aws');
//const twiConfig = config.get('twilio');

dotenv.config()

const port = process.env.APP_PORT || 3000
const host = process.env.APP_HOST || '0.0.0.0'

const username = process.env.DB_USERNAME || dbConfig.username
const password = process.env.DB_PASSWORD || dbConfig.password
const database = process.env.DB_DATABASE || 'mimo'
const collUser = process.env.DB_COLL_USER || 'Users'
const collCourse = process.env.DB_COLL_COURSE || 'Courses'
const collChapter = process.env.DB_COLL_COURSE || 'Chapters'
const collContent = process.env.DB_COLL_COURSE || 'Content'
const collProgress = process.env.DB_COLL_COURSE || 'Progress'

const secret = process.env.JWT_SECRET || 'topSecret'
const expiresIn = process.env.JWT_EXP || 3600

const bucket = process.env.AWS_S3_BUCKET_NAME || awsConfig.bucket_name
const keyid = process.env.ACCESS_KEY_ID || awsConfig.key_id
const secretid = process.env.SECRET_ACCES_KEY || awsConfig.secret_id

const twilioNumber = process.env.TWI_NUMBER || "*"//twiConfig.twilioNumber
const accountSid = process.env.TWI_ACCOUNT || "*"//twiConfig.accountSid
const authToken = process.env.TWI_AUTH || "*"//twiConfig.authToken
const serviceId = process.env.TWI_SERVICE || "*"//twiConfig.serviceId


const server = {
    port,
    host,
}

const db = {
    database,
    username,
    password,

    collUser,
    collCourse,
    collChapter,
    collContent,
    collProgress,
}

const jwt = {
    secret,
    expiresIn,
}

const aws = {
    bucket,
    keyid,
    secretid,
}

const twi = {
    twilioNumber,
    accountSid,
    authToken,
    serviceId,
}

//console.log(app)
export { server, jwt, db, aws, twi }
