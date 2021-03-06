'use strict';

const noticeDAO = require('../models/noticeDAO')
const jwtmiddle = require('../middleware/jwt')
const escapeHtml = require('escape-html');
const entitie = require('html-entities');
const uploads = require('../middleware/multer');
const dayjs = require('dayjs')
const path = require('path')
const fs = require('fs')
const push = require('../push-message')

const { captureRejectionSymbol } = require('winston-daily-rotate-file');

async function noticeMainApp(req, res, next) {
    let jwt_token = req.cookies.student;
    try {
        if (jwt_token == undefined) { throw "로그인 정보가 없습니다." }
        const permission = await jwtmiddle.jwtCerti(jwt_token);
        const notice_data = await noticeDAO.noticeAll()
        res.json({
            "Message": "성공하였습니다.",
            "Data": notice_data
        })
    } catch (error) {
        res.json({
            "Message": "실패하였습니다.",
            "Error_Message": error
        })
    }
}

async function noticeDetailApp(req, res, next) {
    let parameters = req.query;
    try {
        const notice_detail = await noticeDAO.noticeDetail(parameters);

        let noticedetail_all = []
        for (const element of notice_detail) {
            const data = await noticeDAO.noticeDetailFile(element.notice_id)
            element['file'] = data[0]['file']
            noticedetail_all.push(element)
        }
        res.json({
            "Massage": "성공하였습니다.",
            "Data": noticedetail_all
        })
    }
    catch (error) {
        res.json({
            "Message": "실패하였습니다.",
            "Error_Message": error
        })
    }
}

async function noticeDetailweb(req, res, next) {
    let jwt_token = req.cookies.admin;
    let parameters = req.query;
    try {
        if (jwt_token == undefined) { throw "로그인 정보가 없습니다." }
        const permission = await jwtmiddle.jwtCerti(jwt_token);
        if (permission.LEVEL != 0 && permission.LEVEL != 1) { throw "권한이 없습니다." }

        const notice_detail = await noticeDAO.noticeDetail(parameters);

        let noticedetail_all = []
        for (const element of notice_detail) {
            const data = await noticeDAO.noticeDetailFile(element.notice_id)
            element['file'] = data[0]['file']
            noticedetail_all.push(element)
        }

        res.json({
            "Message": "성공하였습니다.",
            "Data": noticedetail_all
        })
    }
    catch (error) {
        res.json({
            "Message": "실패하였습니다.",
            "Error_Message": error
        })
    }
}

async function noticeMain(req, res, next) {
    let jwt_token = req.cookies.admin;
    try {
        if (jwt_token == undefined) { throw "로그인 정보가 없습니다." }
        const permission = await jwtmiddle.jwtCerti(jwt_token);
        if (permission.LEVEL != 0 && permission.LEVEL != 1) { throw "권한이 없습니다." }
        const notice_data = await noticeDAO.noticeAll()
        res.json({
            "Message": "성공하였습니다.",
            "Data": notice_data
        })
    } catch (error) {
        res.json({
            "Message": "실패하였습니다.",
            "Error_Message": error
        })
    }
}

async function noticeWatch(req, res, next) {
    let jwt_token = req.cookies.admin;
    let parameters = req.query.notice_id
    try {
        if (jwt_token == undefined) { throw "로그인 정보가 없습니다." }
        const permission = await jwtmiddle.jwtCerti(jwt_token);
        if (permission.LEVEL != 0 && permission.LEVEL != 1) { throw "권한이 없습니다." }

        const notice_data = await noticeDAO.noticeWatch(parameters);
        console.log(notice_data)

        res.json({
            "Message": "성공하였습니다.",
            "Data": notice_data
        })
    }
    catch (error) {
        res.json({
            "Message": "실패하였습니다.",
            "Error_Message": error
        })
    }
}

async function noticeWrite(req, res, next) {
    let jwt_token = req.cookies.admin;
    let { title, content, priority, program_id } = req.body;
    let files = req.files
    let date = new dayjs();
    let datetime = date.format('YYYY-MM-DD HH:mm:ss');

    let parameters = {
        "title": title,
        // "content": escapeHtml(content),
        //html형식 이상해서 변경함 02.23.김찬희
        "content": content,
        "priority": priority,
        "create_time":datetime,
        "program_id":''
    }
    
    if(program_id !== '') parameters.program_id = program_id
    try {
        if (jwt_token == undefined) { throw "로그인 정보가 없습니다." }
        const permission = await jwtmiddle.jwtCerti(jwt_token);
        parameters.user_id = permission.STUDENT_ID
        if (permission.LEVEL != 0 && permission.LEVEL != 1) throw "권한이 없습니다.";

        const notice_write = await noticeDAO.noticeWrite(parameters);

        const notice_id = await noticeDAO.select_notice_id(parameters);
        for (var key in files) {
            let file_parameters = {
                "notice_id":notice_id,
                "file_path":files[key].destination,
                "file_orgn_name": files[key].originalname,
                "file_size": files[key].size,
                "file_extension": files[key].mimetype,
                "file_create_time":datetime
            }

            const insert_notice_file = await noticeDAO.insert_notice_file(file_parameters)
        }
        res.json({"Message":"성공하였습니다."})
    } catch (error) {
        res.json({
            "Message": "실패하였습니다.",
            "Error_Message": error
        });
    }
}

async function noticeDelete(req, res, next) {
    let jwt_token = req.cookies.admin;
    let parameters = { "notice_id": req.body.notice_id };

    try {
        if (jwt_token == undefined) { throw "로그인 정보가 없습니다." }
        const permission = await jwtmiddle.jwtCerti(jwt_token);
        if (permission.LEVEL != 0 && permission.LEVEL != 1) { throw "권한이 없습니다." }
        const notice_delete = await noticeDAO.noticeDelete(parameters);

        res.json({
            "Message": "성공하였습니다.",
            "Data": notice_delete
        })
    }
    catch (error) {
        res.json({
            "Message": "실패하였습니다.",
            "Error_Massage": error
        })
    }
}

function downloadFile(req, res, next){
    console.log(req.query.file_name)
    const file = path.join(__dirname,'..','public','upload',req.query.file_name)

    const filestream = fs.createReadStream(file);
    filestream.pipe(res);
}

module.exports = {
    noticeMain,
    noticeDetailweb,
    noticeMainApp,
    noticeDetailApp,
    noticeWrite,
    noticeDelete,
    noticeWatch,
    downloadFile
}