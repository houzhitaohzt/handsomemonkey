export const SAVE_STATE='SAVE_STATE';
export const RETRIEVE_STATE='RETRIEVE_STATE';

export function save(key,data){
  let obj={key:key,data:data}

  return {
    type:SAVE_STATE,
    data:obj
  }
}
const ACTION_HANDLERS={
  [SAVE_STATE]:function(state,action){
    let {stateMaps}=state;
    let {key,data}=action.data;

    stateMaps[key]=data;
    return Object.assign({},state,{stateMaps:stateMaps});
  }
 
}
const initialState={
  stateMaps:{}
}
export default function stateHandle( state=initialState,action){

  const handler = ACTION_HANDLERS[action.type]

  if(handler)
    {
      return handler(state, action)
    }else{
      return state;
    }
}

