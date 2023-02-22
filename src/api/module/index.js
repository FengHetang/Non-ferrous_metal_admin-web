import request from "@/utils/request";

export function getModule(data){
  return(request({
    url:'/portal/others/bsearch',
    method:'get',
    params:data
  }))
}

export function addModule(data){
  console.log(data)
  return(request({
    url:'/portal/others/addOthersTitle',
    method:'post',
    data:data
  }))
}

export function updateModule(data){
  return(request({
    url:'/portal/others/editOthersTitle',
    method:'put',
    data:data
  }))
}

export function delModule(data){
  return(request({
    url:'/portal/others/deleteOthersTitle',
    methods:'delete',
    data:data
  }))
}
