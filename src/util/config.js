const dotEnv=require('dotenv').config({ path: `./envs/${process.env.NODE_ENV || ''}.env`});
console.log(dotEnv);
console.log(`${process.env['MYSQL_HOST']}`);
module.exports = {
  "NODE_ENV":`${process.env.NODE_ENV}||development`,
  "JWT_SECRET":`${process.env['JWT_SECRET']}`,
  "MYSQL_USER":`${process.env['MYSQL_USER']}`,
  "MYSQL_PASS":`${process.env['MYSQL_PASS']}`,
  "MYSQL_HOST":`${process.env['MYSQL_HOST']}`,
  "MYSQL_DATABASE": `${process.env['MYSQL_DATABASE']}`
}
