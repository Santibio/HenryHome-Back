const moment = require('moment')

const daysCalculator = (d1,d2)=>
 {

    const date1 = moment(d1);
    const date2 = moment(d2);

    return date2.diff(date1, "days") + 1; 
/*  var aFecha1 = f1.split('-');
 var aFecha2 = f2.split('-');
 
 var fFecha1 = Date.UTC(aFecha1[0],aFecha1[1]-1,aFecha1[2]);
 var fFecha2 = Date.UTC(aFecha2[0],aFecha2[1]-1,aFecha2[2]);

 var dif = fFecha2 - fFecha1;
 var dias = Math.floor(dif / (1000 * 60 * 60 * 24));
 
 return dias; */
 }

 module.exports = { daysCalculator };