import { HttpException, HttpStatus } from "@nestjs/common"
import { extname } from "path"

export const imageFilter= function (req, file, cb) {
    //accept imamge only
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        cb(new HttpException(`Unsupport file type ${extname(file.originalname)}`,HttpStatus.BAD_REQUEST),false);
    }
    cb(null, true)
  }