import multer from "multer";
import fileDirName from "../fileDirName.js";
import * as path from 'path';
const { __dirname } = fileDirName(import.meta);

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            if (file.fieldname==='fileProd') {
                cb(null,path.join(__dirname, '..','..','/public/img/products'))
            }else{
                cb(null,path.join(__dirname, '..','..','/public/img/profile'))
            }
        }else{
           cb(null, path.join(__dirname, '..','..','/public/documents'));
        }
    },
    filename:function(req, file, cb){
        cb(null,file.originalname)
    }
})
export const uploader = multer({storage});