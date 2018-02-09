import defaults from "superagent-defaults";
import superagent from "superagent";
import superagentPromise from "superagent-promise";

let request = defaults(superagentPromise(superagent, Promise));

request
  //.use(prefix(process.env.URL))
  //.use(jsonp)
  //.set('Access-Control-Allow-Origin','*')
  .set('Accept', 'application/json;charset=utf-8')
  .set('Content-type', 'application/json');
  //.withCredentials();

let urlencodeRequest=defaults(superagentPromise(superagent, Promise));
urlencodeRequest
  .set('Content-Type',"application/x-www-form-urlencoded;charset=utf-8")
  .set('Accept','application/json');

export {urlencodeRequest};
export default request;

