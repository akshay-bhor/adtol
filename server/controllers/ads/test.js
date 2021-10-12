const { tinify } = require('../../common/util');
const Campaigns = require('../../models/campaigns');

exports.test = async(req, res, next) => {
    // const Countries = require('../../models/countries');

    // let tmp = [];
    // let countries = Countries.findAll({ order:[['id', 'ASC']], attributes: ['id', 'code', 'name'] })
    //     .then(res => { console.log(res);
    //         res.forEach(data => {
    //             tmp[data.dataValues.id] = [data.dataValues.code, data.dataValues.name];
    //         });
    //         let cData = {...tmp};
    //         let cn = 'IN';
    //         console.log(Object.keys(cData).find(key => cData[key][0] == cn));
    //     });
        
    if(req.query.send == 'ua') {
        const parser = require('ua-parser-js');

        let uastr = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36";

        let ua = parser(req.get('user-agent'));

        console.log(ua.os.version?.split('.')[0] || 0);

        res.status(200).json(ua);
    }

    if(req.query.send == 'ip') {
        const x_forwarded_for = req.get('x-forwarded-for');
        const remote_address = req.connection.remoteAddress;
        const req_ip = req.ip;
        const headers = req.headers;
        const x_real_ip = req.get('x-real-ip');
        req.ip = '10.24.32.1';
        req.ip_addr = '10.24.32.1';
        const updated = req.ip_addr;

        res.status(200).json({
            x_forwarded_for,
            remote_address,
            req_ip,
            x_real_ip,
            updated,
            headers
        });
    }
    
    if(req.query.send == 'match_hash') {
        const result = [];

        for(let i = 1; i < 6;i++) {
            let ad_type = i;
            let adult = 0;
            let str = `0|1|${ad_type}|${adult}|1`; 
            let match_hash = tinify(str);
            result.push(match_hash);

            ad_type = i;
            adult = 1;
            str = `0|1|${ad_type}|${adult}|1`; 
            match_hash = tinify(str);
            result.push(match_hash);
        }
        res.status(200).json(result);
    }
}