import request from "@/utils/request";

export function getNavSubMan(data){
  return(request({
    url:'/portal/infrom/bsearch',
    method:'get',
    params:data
  }))
}
export function addNavSubMan(data){
  return(request({
    url:'/portal/infrom/add',
    method:'post',
    data:data
  }))
}

export function updateNavSubMan(data){
  return(request({
    url:'/portal/infrom',
    method:'put',
    data:data
  }))
}

export function delNavSubMan(data){
  return(request({
    url:'/portal/infrom/' + data,
    method:'delete',
  }))
}
