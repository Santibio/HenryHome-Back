const dias = (f1,f2)=>
 {
 var aFecha1 = f1.split('-');
 var aFecha2 = f2.split('-');
 
 var fFecha1 = Date.UTC(aFecha1[0],aFecha1[1]-1,aFecha1[2]);
 var fFecha2 = Date.UTC(aFecha2[0],aFecha2[1]-1,aFecha2[2]);

 var dif = fFecha2 - fFecha1;
 var dias = Math.floor(dif / (1000 * 60 * 60 * 24));
 
 return dias;
 }

 module.exports={dias}