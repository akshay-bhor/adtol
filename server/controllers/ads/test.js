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
        

    // const parser = require('ua-parser-js');

    // let uastr = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36";

    // let ua = parser(uastr);

    // console.log(ua.device);

    // const r = await Campaigns.findOne({ where: { id: 5 }, attributes: ['uid', 'url', 'cpc'] });

    // console.log(r);
    // res.redirect('http://adtol.com');
    
    const x_forwarded_for = req.get('x-forwarded-for');
    const remote_address = req.connection.remoteAddress;
    const req_ip = req.ip;
    const headers = req.headers;
    const x_real_ip = req.get('x-real-ip');

    res.status(200).json({
        x_forwarded_for,
        remote_address,
        req_ip,
        x_real_ip,
        headers
    });
}